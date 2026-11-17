import {
  forwardRef,
  useEffect,
  useImperativeHandle,
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
  showEmpty: boolean;
  anchor: string;
  onAnchor: (id: string) => void;
  focus: string | null;
  onFocus: (id: string | null) => void;
  selectedWorkflow: string | null;
  included: string[];
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
  function: { en: "Capability", uk: "Функція" },
  workflow: { en: "Workflow", uk: "Workflow" },
};

export const WorkspaceGraph = forwardRef<WorkspaceGraphHandle, Props>(function WorkspaceGraph(
  {
    experts,
    layers,
    referenceSelection,
    locale,
    configuration,
    showEmpty,
    anchor,
    onAnchor,
    focus,
    onFocus,
    selectedWorkflow,
    included,
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
  const [paused, setPaused] = useState(false);
  const [toolsPinned, setToolsPinned] = useState(false);
  const suppressTouch = useRef(false);
  const uk = locale === "uk";

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
    ? ["function", "workflow"]
    : ["person", "organisation", "country", "expertise", "sector", "status"];
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
          layers={layers}
          referenceSelection={configuration ? undefined : referenceSelection}
          focus={focus}
          onFocus={(id) => {
            if (id) onFocus(id);
            else onBackground();
          }}
          serviceMode={configuration}
          live={free}
          showExpertsOnServices={false}
          includeHub={false}
          includeServiceCoverage={false}
          locale={locale}
          motionPaused={paused}
          activeServiceIds={included}
          activeWorkflowIds={activeWorkflowIds}
          highlightedWorkflow={selectedWorkflow}
          onServiceExclude={onServiceExclude}
          onWorkflowSelect={onWorkflowSelect}
          onNodeSelect={onNode}
          anchor={anchor}
          onAnchor={onAnchor}
          showConnectionPath={false}
          readableExpansions={false}
        />
        {dashboard}
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
                  "The map begins as a dispersed network and continuously assembles into a fixed, ordered layout. Pause to stop it mid-transition; choose Free afterward to resume force motion. Search connections use recorded categories; workflow links come from the capability catalogue.",
                  "Мапа починається як розосереджена мережа й без зникнення вузлів збирається у фіксований упорядкований граф. Натисніть «Пауза», щоб зупинити перехід; після збирання «Вільний» відновлює рух. Зв’язки пошуку спираються на записані категорії, а зв’язки workflow — на каталог функцій.",
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
                aria-label={legend[kind]![locale === "uk" ? "uk" : "en"]}
                data-hint={legend[kind]![locale === "uk" ? "uk" : "en"]}
              >
                <GraphGlyph kind={kind} />
                <span>{legend[kind]![locale === "uk" ? "uk" : "en"]}</span>
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
                    d="M17 3 21 7 17 11 13 7Z"
                    fill="#f1deb1"
                    stroke="#102c3c"
                    strokeWidth="1.5"
                  />
                </svg>
                <span>
                  {label("Source flags", "Позначки джерела")} · {sourceFlagCount}/{experts.length}
                </span>
              </div>
            )}
            <div>
              <i className="workspace-edge-key" />
              <span>
                {configuration
                  ? label("Workflow composition", "Склад workflow")
                  : label("Shared recorded attribute", "Спільна записана ознака")}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
});
