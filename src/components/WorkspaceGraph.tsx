import { PublicDirectoryPanel } from "./PublicDirectoryPanel";
import { ISRM_PUBLIC_DIRECTORY, publicRoleId } from "@/lib/public-directory";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Info, Move, Pause, Pin, Play, Scan } from "lucide-react";
import type { Expert } from "@/lib/types";
import type { GraphLayers, NetworkNode } from "@/lib/network-model";
import type { MapKind } from "@/lib/workspace-map";
import { GraphGlyph } from "./WorkspaceGlyph";
import NetworkGraph, { type NetworkGraphHandle } from "./NetworkGraph";

export interface WorkspaceGraphHandle {
  capture: () => string;
  fit: () => void;
}

type Props = {
  experts: Expert[];
  layers: GraphLayers;
  referenceSelection?: {
    country?: string;
    sector?: string;
    expertise?: string;
    role?: string;
    reviewStatus?: string;
  };
  locale: string;
  configuration: boolean;
  configurationRevealStep: number | null;
  showEmpty: boolean;
  anchor: string;
  onAnchor: (id: string) => void;
  focus: string | null;
  onFocus: (id: string | null) => void;
  selectedWorkflow: string | null;
  included: string[];
  shortlistedCodes?: string[];
  activeWorkflowIds: string[];
  onServiceExclude: (id: string) => void;
  onWorkflowSelect: (id: string) => void;
  onNode: (node: NetworkNode, expanded: boolean) => void;
  onBackground: () => void;
  railContent?: ReactNode;
  dashboard?: ReactNode;
  onRailExtent?: (height: number) => void;
};

const legend: Record<string, Record<string, string>> = {
  person: { en: "Person", uk: "Персона" },
  organisation: { en: "Organisation", uk: "Організація" },
  country: { en: "Phone-code country", uk: "Країна за кодом телефону" },
  expertise: { en: "Recorded expertise", uk: "Записана експертиза" },
  sector: { en: "Recorded sector", uk: "Записаний сектор" },
  status: { en: "Recorded status", uk: "Зафіксований статус" },
  core: { en: "Proposed conceptual core", uk: "Запропоноване концептуальне ядро" },
  function: { en: "Capability", uk: "Функція" },
  workflow: { en: "Workflow", uk: "Робочий процес" },
};

export const WorkspaceGraph = forwardRef<WorkspaceGraphHandle, Props>(function WorkspaceGraph(
  {
    experts,
    layers,
    referenceSelection,
    locale,
    configuration,
    configurationRevealStep,
    showEmpty,
    anchor,
    onAnchor,
    focus,
    onFocus,
    selectedWorkflow,
    included,
    shortlistedCodes = [],
    activeWorkflowIds,
    onServiceExclude,
    onWorkflowSelect,
    onNode,
    onBackground,
    railContent,
    dashboard,
    onRailExtent,
  },
  ref,
) {
  const graph = useRef<NetworkGraphHandle>(null);
  const rail = useRef<HTMLElement>(null);
  const railContents = useRef<HTMLDivElement>(null);
  const [free, setFree] = useState(false);
  const [publicLeadership, setPublicLeadership] = useState(false);
  const [publicRecord, setPublicRecord] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [toolsPinned, setToolsPinned] = useState(false);
  const suppressTouch = useRef(false);
  const uk = locale === "uk";
  const graphLayers = useMemo(
    () => ({ ...layers, publicLeadership: !configuration && publicLeadership }),
    [layers, configuration, publicLeadership],
  );

  useImperativeHandle(
    ref,
    () => ({
      capture: () => graph.current?.capture() ?? "",
      fit: () => graph.current?.fit(),
    }),
    [],
  );

  useEffect(() => {
    const element = railContents.current;
    if (!element) return;
    const measure = () => onRailExtent?.(Math.ceil(element.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [onRailExtent, configuration]);

  useEffect(() => {
    if (!toolsPinned) return;
    const close = (event: PointerEvent) => {
      if (!rail.current?.contains(event.target as Node)) setToolsPinned(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [toolsPinned]);
  const label = (en: string, ua: string) => (uk ? ua : en);
  const kinds: MapKind[] = configuration
    ? ["core", "function", "workflow"]
    : ["person", "organisation", "country", "expertise", "sector", "status"];
  const legendLabel = (kind: string) =>
    kind === "country" && publicLeadership
      ? label(
          "Country: sample phone code or public chapter jurisdiction; not residence",
          "Країна: код телефону у вибірці або територія чаптеру; не проживання",
        )
      : (legend[kind]?.[uk ? "uk" : "en"] ?? kind);
  const sourceFlagCount = experts.filter((expert) => expert.verified).length;

  return (
    <div className="workspace-graph-layout">
      <div
        className="workspace-map"
        role="region"
        aria-label={label("Interactive network map", "Інтерактивна мапа мережі")}
      >
        <NetworkGraph
          ref={graph}
          experts={experts}
          layers={graphLayers}
          referenceSelection={configuration ? undefined : referenceSelection}
          focus={focus}
          onFocus={(id) => {
            if (id) onFocus(id);
            else onBackground();
          }}
          serviceMode={configuration}
          includeProposedCore={configuration}
          configurationRevealStep={configuration ? configurationRevealStep : null}
          live={free}
          showExpertsOnServices={false}
          includeHub={false}
          includeServiceCoverage={false}
          locale={locale}
          motionPaused={paused}
          activeServiceIds={included}
          shortlistedCodes={shortlistedCodes}
          activeWorkflowIds={activeWorkflowIds}
          highlightedWorkflow={selectedWorkflow}
          onServiceExclude={onServiceExclude}
          onWorkflowSelect={onWorkflowSelect}
          onNodeSelect={(node, expanded) => {
            if (node.id.startsWith("public-person:") || node.id.startsWith("public-unit:"))
              setPublicRecord(node.id);
            else onNode(node, expanded);
          }}
          anchor={anchor}
          onAnchor={onAnchor}
          showConnectionPath={false}
          readableExpansions={false}
        />
        {dashboard}
        {!configuration && (
          <div className="public-directory-control">
            <button
              type="button"
              aria-pressed={publicLeadership}
              onClick={() => setPublicLeadership((v) => !v)}
              title={label(
                "Published units and representatives; double-outline people are separate from the research sample",
                "Опубліковані підрозділи та представники; подвійний контур відділяє їх від дослідницької вибірки",
              )}
            >
              {label("ISRM chapters & representatives", "Чаптери й представники ISRM")}
            </button>
            {publicLeadership && (
              <select
                aria-label={label("Open public ISRM record", "Відкрити публічний запис ISRM")}
                value=""
                onChange={(e) => {
                  if (e.target.value) setPublicRecord(e.target.value);
                }}
              >
                <option value="">
                  {label(
                    "Names, published roles and sources",
                    "Імена, опубліковані посади та джерела",
                  )}
                </option>
                {ISRM_PUBLIC_DIRECTORY.entries.map((u) => (
                  <optgroup key={u.id} label={u.label}>
                    {u.people.map((p) => (
                      <option key={p.name} value={publicRoleId(p.name)}>
                        {p.name} · {p.role}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>
        )}
        {publicRecord && (
          <PublicDirectoryPanel id={publicRecord} uk={uk} onClose={() => setPublicRecord(null)} />
        )}
        {!configuration && showEmpty && (
          <p className="workspace-map-empty">
            {label(
              "No records match this selection. Change the criteria.",
              "Немає записів за цим вибором. Змініть критерії.",
            )}
          </p>
        )}
      </div>
      <aside
        ref={rail}
        tabIndex={-1}
        onPointerDownCapture={(event) => {
          if (event.pointerType === "touch" && !toolsPinned) {
            suppressTouch.current = true;
            setToolsPinned(true);
          }
        }}
        onClickCapture={(event) => {
          if (suppressTouch.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressTouch.current = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setToolsPinned(false);
            rail.current?.focus();
            event.stopPropagation();
          }
        }}
        className={"workspace-map-tools" + (toolsPinned ? " is-pinned" : "")}
        aria-label={label("Map controls and legend", "Керування мапою та легенда")}
      >
        <div className="workspace-rail-content" ref={railContents}>
          <details className="workspace-rail-info">
            <summary
              aria-label={label("About map controls", "Про керування мапою")}
              data-hint={label("About map controls", "Про керування мапою")}
            >
              <Info size={20} />
            </summary>
            <div>
              <p>
                <Info size={15} />
                {label(
                  "The map opens from one point, expands into a dispersed network, pauses briefly, then gathers into fixed groups. Hover or select a person to reveal their name and nearby recorded links. Pause stops the sequence; Free restores movement after it settles. Search links represent recorded attributes; connection-example links show illustrative associations from the capability catalogue, not an organisation's approved process. Select an expertise, sector, or country node to narrow the results; select a person to open their dossier. Add them to the shortlist with the dossier checkbox; square corner marks show group membership on the graph.",
                  "Мапа починається з однієї точки, розгортається у розосереджену мережу, на мить завмирає, а потім збирається у фіксовані групи. Наведіть курсор або виберіть персону, щоб побачити її ім’я та найближчі записані зв’язки. «Пауза» зупиняє послідовність; «Вільний» повертає рух після її завершення. Ребра пошуку показують записані ознаки; ребра прикладів зв’язків — лише ілюстративні асоціації з каталогу функцій, а не погоджений процес організації. Виберіть вузол експертизи, сектора або країни, щоб звузити результати; виберіть персону, щоб відкрити досьє. Додайте її до відбору прапорцем у досьє — квадратні кутові мітки покажуть склад групи на графі.",
                )}
              </p>
            </div>
          </details>
          {railContent}
          <button
            type="button"
            onClick={() => {
              setPaused(false);
              setFree(false);
            }}
            aria-pressed={!free}
            aria-label={label(
              "Ordered, fixed node positions",
              "Впорядковане фіксоване розташування вузлів",
            )}
            data-hint={label("Ordered layout", "Впорядковане розташування")}
          >
            <Pin size={18} />
            <span>{label("Ordered", "Впорядкований")}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPaused(false);
              setFree(true);
            }}
            aria-pressed={free}
            aria-label={label("Free node movement", "Вільне розташування вузлів")}
            data-hint={label("Free node movement", "Вільне розташування вузлів")}
          >
            <Move size={18} />
            <span>{label("Free", "Вільний")}</span>
          </button>
          <button
            type="button"
            onClick={() => graph.current?.fit()}
            aria-label={label("Fit graph to window", "Вписати граф у вікно")}
            data-hint={label("Fit graph to window", "Вписати граф у вікно")}
          >
            <Scan size={18} />
            <span>{label("Fit graph", "Вписати граф")}</span>
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={
              paused
                ? label("Resume graph motion", "Відновити рух графа")
                : label("Pause graph motion", "Призупинити рух графа")
            }
            data-hint={
              paused
                ? label("Resume graph motion", "Відновити рух графа")
                : label("Pause graph motion", "Призупинити рух графа")
            }
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
            <span>{paused ? label("Resume", "Відновити") : label("Pause", "Пауза")}</span>
          </button>
          <div className="workspace-symbol-legend">
            <h2>{label("Legend", "Легенда")}</h2>
            {kinds.map((kind) => (
              <div
                key={kind}
                tabIndex={0}
                role="img"
                aria-label={legendLabel(kind)}
                data-hint={legendLabel(kind)}
              >
                <GraphGlyph kind={kind} />
                <span>{legendLabel(kind)}</span>
              </div>
            ))}
            {!configuration && (
              <div
                role="img"
                aria-label={label(
                  `Source confirmation flag present on ${sourceFlagCount} of ${experts.length} records in this view`,
                  `Позначка підтвердження джерела є у ${sourceFlagCount} з ${experts.length} записів у цьому поданні`,
                )}
                data-hint={label(
                  "A supplied source flag, not independent expert verification",
                  "Позначка у наданому джерелі, не незалежна перевірка експерта",
                )}
              >
                <svg aria-hidden="true" className="map-glyph" viewBox="0 0 24 24">
                  <circle cx="10" cy="15" r="5" fill="#87c1b4" />
                  <path
                    d="M17 2 22 7 17 12 12 7Z"
                    fill="#102c3c"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="17" cy="7" r="1.5" fill="#f1deb1" />
                </svg>
                <span>
                  {label("Source flags", "Позначки джерела")} · {sourceFlagCount}/{experts.length}
                </span>
              </div>
            )}
            {!configuration && (
              <div
                role="img"
                aria-label={label("Person in shortlist", "Персона у відборі")}
                data-hint={label(
                  "A square check marks a person added to your shortlist",
                  "Квадратна позначка показує персону, додану до вашого відбору",
                )}
              >
                <svg aria-hidden="true" className="map-glyph" viewBox="0 0 24 24">
                  <circle cx="10" cy="15" r="5" fill="#87c1b4" />
                  <rect
                    x="13"
                    y="2.5"
                    width="9"
                    height="9"
                    rx="1"
                    fill="#fff"
                    stroke="#102c3c"
                    strokeWidth="1.5"
                  />
                  <path
                    d="m15 7 1.7 1.7L20 5.5"
                    fill="none"
                    stroke="#102c3c"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{label("In shortlist", "У відборі")}</span>
              </div>
            )}
            {configuration ? (
              <>
                <div className="workspace-edge-legend-item">
                  <i className="workspace-edge-key is-architecture" />
                  <span>{label("Workflow uses capability", "Процес використовує функцію")}</span>
                </div>
                <div className="workspace-edge-legend-item">
                  <i className="workspace-edge-key is-foundation" />
                  <span>
                    {label(
                      "Workflow builds on Expertise search",
                      "Процес спирається на пошук експертизи",
                    )}
                  </span>
                </div>
                <div className="workspace-edge-legend-item">
                  <i className="workspace-edge-key is-core" />
                  <span>
                    {label(
                      "Proposed core anchors Expertise search",
                      "Запропоноване ядро є основою пошуку експертизи",
                    )}
                  </span>
                </div>
                <p className="workspace-edge-note">
                  {label(
                    "These are catalogue relationships, not an approved or operational process.",
                    "Це зв’язки каталогу, а не погоджений чи робочий процес.",
                  )}
                </p>
              </>
            ) : (
              <div>
                <i className="workspace-edge-key" />
                <span>{label("Shared recorded attribute", "Спільна записана ознака")}</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
});
