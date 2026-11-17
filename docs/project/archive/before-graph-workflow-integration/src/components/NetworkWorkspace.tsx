import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import {
  Info,
  FolderOpen,
  FilterX,
  Building2,
  Bot,
  BadgeCheck,
  Flag,
  FileCheck2,
  Maximize2,
  Minimize2,
  GraduationCap,
  Settings,
  Search,
  Layers,
  Network,
  Users,
  X,
  Plus,
  Minus,
  GitBranch,
  RefreshCw,
  Check,
  Save,
  Download,
} from "lucide-react";
import { useAccess } from "@/lib/access";
import { useI18n } from "@/lib/i18n";
import { EMPTY, type Filters } from "@/lib/filters";
import { referenceOptions, type ReferenceField } from "@/lib/network-reference";
import { CLIENT_SERVICES, type ServiceId } from "@/lib/client-catalog";
import { selectedServiceIds } from "@/lib/client-draft";
import { excludeServiceChanges } from "@/lib/tailored-scope";
import { hasDossierDetails } from "@/lib/dossier-content";
import {
  DEFAULT_MAP_LAYERS,
  SEARCH_PANES,
  CONFIGURATION_PANES,
  WORKSPACE_WORKFLOWS,
  expertiseName,
  searchMap,
  configurationMap,
  illustrativeRecords,
  type MapLayers,
  type MapNode,
  type WorkspacePane,
  type WorkspaceMode,
} from "@/lib/workspace-map";
import { useClientDraft } from "./ClientDraftProvider";
import { AccessControl } from "./AppShell";
import { ClientAccessibility } from "./ClientAccessibility";
import { useDismissibleDetails } from "./useDismissibleDetails";
import { DataUseNotice } from "./DataUseNotice";
import { WorkspacePerson } from "./WorkspacePerson";
import { WorkspaceHints } from "./WorkspaceHints";
import { workspaceSelection } from "@/lib/workspace-selection";
import { NetworkShortlist } from "./NetworkShortlist";
import { ExpertiseMapFigure } from "./BriefingEvidenceFigures";
import type { WorkspaceGraphHandle } from "./WorkspaceGraph";
import { GraphGlyph } from "./WorkspaceGlyph";
import { readWorkspaceMaps, type SavedWorkspaceMap as SavedMap } from "@/lib/workspace-storage";
const Graph = lazy(() => import("./WorkspaceGraph").then((m) => ({ default: m.WorkspaceGraph })));
const storageKey = "isrm-saved-search-maps-v1";
export function NetworkWorkspace() {
  const { locale } = useI18n(),
    uk = locale === "uk",
    t = useCallback((en: string, ua: string) => (uk ? ua : en), [uk]);
  const { data } = useAccess();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { draft, update, ready, error } = useClientDraft();
  const route = useSearch({ strict: false }) as {
    view?: string;
    stage?: string;
    panel?: string;
    capability?: ServiceId;
    preset?: string;
    anchor?: string;
  };
  const [mode, setMode] = useState<WorkspaceMode>(
    route.stage === "configuration" || route.preset
      ? "configuration"
      : route.view || route.panel
        ? "search"
        : "home",
  );
  const [homeStep, setHomeStep] = useState<"intro" | "workflows">("intro");
  const [pane, setPane] = useState<WorkspacePane | null>(
    route.panel === "shortlist"
      ? "shortlist"
      : route.panel === "search"
        ? "results"
        : route.capability
          ? "functions"
          : null,
  );
  const [f, setF] = useState<Filters>({ ...EMPTY });
  const [layers, setLayers] = useState<MapLayers>({ ...DEFAULT_MAP_LAYERS });
  const [status, setStatus] = useState<Record<string, string>>({
    ai: "any",
    peer: "any",
    membership: "any",
    chapter: "any",
    organisation: "any",
    source: "any",
  });
  const [mapContext, setMapContext] = useState<"search" | "shortlist">("search");
  const [person, setPerson] = useState<string | null>(null),
    [full, setFull] = useState(false);
  const [functionId, setFunctionId] = useState<ServiceId | null>(route.capability ?? null),
    [relations, setRelations] = useState(false),
    [cycle, setCycle] = useState<string | null>(null),
    [workflowId, setWorkflowId] = useState("search");
  const [panelWidth, setPanelWidth] = useState(480),
    [dragging, setDragging] = useState(false);
  const [railExtent, setRailExtent] = useState(10000);
  const [tutorial, setTutorial] = useState<number | null>(null),
    [tutorialLong, setTutorialLong] = useState(false);
  const [slip, setSlip] = useState(""),
    [saved, setSaved] = useState<SavedMap[]>([]),
    [saveName, setSaveName] = useState(""),
    [storageError, setStorageError] = useState("");
  const [savedBlocked, setSavedBlocked] = useState(false);
  const settings = useDismissibleDetails(),
    mapRef = useRef<WorkspaceGraphHandle>(null),
    bodyRef = useRef<HTMLDivElement>(null);
  const tutorialBefore = useRef<{
    pane: WorkspacePane | null;
    person: string | null;
    full: boolean;
    functionId: ServiceId | null;
    relations: boolean;
    cycle: string | null;
    mapContext: "search" | "shortlist";
    panelWidth: number;
    workflowId: string;
    f: Filters;
    layers: MapLayers;
    status: Record<string, string>;
  } | null>(null);
  const all = useMemo(() => data?.experts ?? [], [data]);
  const { sample, review: shown } = useMemo(
    () => workspaceSelection(all, f, status),
    [all, f, status],
  );
  const included = useMemo(() => selectedServiceIds(draft), [draft]);
  const selectedPerson = all.find((e) => e.code === person),
    selectedFunction = CLIENT_SERVICES.find((s) => s.id === functionId);
  const workflows = WORKSPACE_WORKFLOWS.filter(
    (w) => !functionId || w.serviceIds.includes(functionId),
  );
  const selectedWorkflow =
    workflows.find((w) => w.id === workflowId) ?? workflows[0] ?? WORKSPACE_WORKFLOWS[0]!;
  const isConfiguration = mode === "configuration",
    spines = isConfiguration ? CONFIGURATION_PANES : SEARCH_PANES;
  const name = (id: WorkspacePane) =>
    ({
      criteria: t("Search criteria", "Критерії пошуку"),
      results: t("Search results", "Результати пошуку"),
      profile: t("Dossier", "Досьє"),
      shortlist: t("My shortlist", "Мій відбір"),
      functions: t("Capability description", "Опис функції"),
      selection: t("Selected capabilities", "Обрані функції"),
      workflow: t("Workflow composition", "Склад workflow"),
    })[id];
  const open = (id: WorkspacePane) => {
    if (id === "shortlist") setMapContext("shortlist");
    if (id === "criteria" || id === "results") setMapContext("search");
    if (id !== "profile") setPanelWidth(365);
    setPane(id === "criteria" ? "results" : id);
  };
  const go = (next: WorkspaceMode) => {
    setTutorial(null);
    setMode(next);
    setPane(null);
    setHomeStep("intro");
    if (next === "search") setMapContext("search");
    if (next === "configuration") {
      setRelations(false);
      setCycle(null);
    }
  };
  useEffect(() => {
    if (route.stage === "configuration" || route.capability || route.preset) {
      setMode("configuration");
      setPane(route.capability ? "functions" : null);
      if (route.capability) setFunctionId(route.capability);
      if (route.preset) setWorkflowId(route.preset);
    } else if (route.panel) {
      setMode("search");
      setPane(route.panel === "shortlist" ? "shortlist" : "results");
      setMapContext(route.panel === "shortlist" ? "shortlist" : "search");
    }
  }, [route.stage, route.capability, route.preset, route.panel]);
  useEffect(() => {
    try {
      setSaved(readWorkspaceMaps(localStorage.getItem(storageKey)));
    } catch {
      setSavedBlocked(true);
      setStorageError(
        t(
          "Saved maps could not be read. Existing browser data was not overwritten.",
          "Збережені мапи не вдалося прочитати. Наявні дані браузера не перезаписано.",
        ),
      );
    }
  }, [t]);
  const graphPeople = useMemo(
    () =>
      mapContext === "shortlist" ? all.filter((e) => draft.shortlist.includes(e.code)) : shown,
    [mapContext, all, draft.shortlist, shown],
  );
  const build = useCallback(
    (w: number, h: number) =>
      isConfiguration
        ? configurationMap(all, uk, w, h, functionId, cycle, relations, draft.shortlist)
        : searchMap(graphPeople, layers, uk, w, h),
    [isConfiguration, all, uk, functionId, cycle, relations, draft.shortlist, graphPeople, layers],
  );
  useEffect(() => {
    if (mode === "home") return;
    const id = window.setTimeout(() => setSlip(mapRef.current?.capture() ?? ""), 1750);
    return () => clearTimeout(id);
  }, [
    f,
    layers,
    status,
    person,
    functionId,
    included,
    cycle,
    relations,
    mode,
    pane,
    mapContext,
    graphPeople,
  ]);
  const inspect = (code: string, expanded = false) => {
    setPerson(code);
    if (mapContext === "shortlist" && !draft.shortlist.includes(code)) setMapContext("search");
    const e = all.find((p) => p.code === code);
    setFull(expanded && !!e && hasDossierDetails(e));
    setPanelWidth(expanded ? 680 : 480);
    open("profile");
  };
  const togglePerson = () => {
    if (!person) return;
    update({
      shortlist: draft.shortlist.includes(person)
        ? draft.shortlist.filter((c) => c !== person)
        : [...draft.shortlist, person],
    });
  };
  const toggleFunction = (id: ServiceId) => {
    if (included.includes(id)) update(excludeServiceChanges(draft, id, null));
    else {
      const packages = {
        ...draft.packageServices,
        core: [...new Set([...(draft.packageServices.core ?? []), id])],
      };
      const union = [...new Set([...included, id])];
      update({
        mode: "full",
        serviceIds: union,
        workflowIds: draft.workflowIds,
        packageServices: { ...packages, core: union },
      });
    }
  };
  const capture = () => {
    const image = mapRef.current?.capture() ?? "";
    if (image) setSlip(image);
    return image;
  };
  const saveSearch = () => {
    if (savedBlocked) return;
    const item: SavedMap = {
      id: crypto.randomUUID(),
      name: saveName.trim() || t("Expertise search", "Пошук експертизи"),
      filters: { ...f },
      layers: { ...layers },
      status: { ...status } as SavedMap["status"],
      codes: shown.map((e) => e.code),
      image: capture(),
    };
    try {
      const next = [item, ...saved];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setSaved(next);
      setStorageError("");
    } catch {
      setStorageError(
        t(
          "The map could not be saved. Download the working list before leaving.",
          "Мапу не вдалося зберегти. Завантажте робочий список перед виходом.",
        ),
      );
    }
  };
  const iconAction = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    pressed?: boolean,
  ) => (
    <button
      type="button"
      className="workspace-icon-action"
      data-hint={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {icon}
    </button>
  );
  const mapSlip = (label: string) => (
    <figure className="workspace-map-slip">
      {slip ? (
        <img src={slip} alt={t("Copy of the current graph: ", "Копія поточного графа: ") + label} />
      ) : (
        <span>{t("Graph snapshot is being prepared", "Готується знімок графа")}</span>
      )}
      <figcaption>{label}</figcaption>
    </figure>
  );
  const setFilter = (key: keyof Filters, value: string) => setF((v) => ({ ...v, [key]: value }));
  const changeLayer = (key: keyof MapLayers) => {
    setLayers((s) => ({ ...s, [key]: !s[key] }));
    if (layers[key]) {
      if (key === "countries") setFilter("country", "");
      if (key === "sectors") setFilter("sector", "");
      if (key === "expertise") setFilter("expertise", "");
      if (key in status) setStatus((v) => ({ ...v, [key]: "any" }));
    }
  };
  const options = (field: ReferenceField) => {
    if (!hydrated) return null;
    const opts = referenceOptions(all, field, locale);
    const optionLabel = (o: { value: string; label: string; count: number }) =>
      /США.*Канада/.test(o.label)
        ? t("US / Canada (source grouping)", "США / Канада (групування джерела)")
        : o.label;
    return (
      <>
        <optgroup label={t("Recorded in this sample", "Зафіксовані у вибірці")}>
          {opts
            .filter((o) => o.count > 0)
            .map((o) => (
              <option key={o.value} value={o.value}>
                {optionLabel(o)} · {o.count}
              </option>
            ))}
        </optgroup>
        <optgroup
          label={t(
            "Reference categories with no matching record",
            "Довідкові категорії без відповідних записів",
          )}
        >
          {opts
            .filter((o) => !o.count)
            .map((o) => (
              <option key={o.value} value={o.value}>
                {optionLabel(o)} · 0
              </option>
            ))}
        </optgroup>
      </>
    );
  };
  const layerField = (
    key: keyof MapLayers,
    label: string,
    field?: ReferenceField,
    filter?: keyof Filters,
  ) => (
    <div className={"workspace-layer-field" + (key in status ? " is-status-layer" : "")} key={key}>
      <label title={label}>
        <input type="checkbox" checked={layers[key]} onChange={() => changeLayer(key)} />
        <span>{label}</span>
      </label>
      {field && filter && (
        <select
          title={
            label +
            (field === "country"
              ? t(
                  " · Phone-code country, not verified working location",
                  " · Країна коду телефону, не перевірене місце роботи",
                )
              : "")
          }
          aria-label={label}
          disabled={!layers[key]}
          value={String(f[filter] ?? "")}
          onChange={(e) => setFilter(filter, e.target.value)}
        >
          <option value="">{t("All", "Усі")}</option>
          {options(field)}
        </select>
      )}
      {key in status && (
        <select
          aria-label={label}
          title={label}
          disabled={!layers[key]}
          value={status[key]}
          onChange={(e) => setStatus((s) => ({ ...s, [key]: e.target.value }))}
        >
          <option value="any">{t("Any", "Усі")}</option>
          <option value="yes">{t("Recorded", "Зафіксовано")}</option>
          <option value="unknown">{t("Not recorded", "Не зафіксовано")}</option>
        </select>
      )}
    </div>
  );
  const selectNode = (n: MapNode, expanded: boolean) => {
    if (n.code) inspect(n.code, expanded);
    else if (n.functionId) {
      setFunctionId(n.functionId);
      setRelations(true);
      setCycle(null);
      const w = WORKSPACE_WORKFLOWS.find((w) => w.serviceIds.includes(n.functionId!));
      if (w) setWorkflowId(w.id);
      open("workflow");
    } else if (n.workflowId) {
      setWorkflowId(n.workflowId);
      open("workflow");
    } else if (n.value) {
      const key =
        n.kind === "country"
          ? "country"
          : n.kind === "sector"
            ? "sector"
            : n.kind === "expertise"
              ? "expertise"
              : null;
      if (key) {
        setFilter(key, n.value);
        open("results");
      }
    }
  };
  // Hover previews stay in place; only an intentional click opens a resizable paper.
  const hoverNode = () => {};
  const beginTutorial = () => {
    tutorialBefore.current = {
      pane,
      person,
      full,
      functionId,
      relations,
      cycle,
      mapContext,
      panelWidth,
      workflowId,
      f: { ...f },
      layers: { ...layers },
      status: { ...status },
    };
    setPane(null);
    setCycle(null);
    setRelations(false);
    if (isConfiguration) setFunctionId(null);
    else {
      setF({ ...EMPTY });
      setLayers({ ...DEFAULT_MAP_LAYERS });
      setStatus({
        ai: "any",
        peer: "any",
        membership: "any",
        chapter: "any",
        source: "any",
        organisation: "any",
      });
      setMapContext("search");
      setPerson(null);
    }
    setTutorial(0);
    setTutorialLong(false);
  };
  const closeTutorial = () => {
    const old = tutorialBefore.current;
    if (old) {
      setPane(old.pane);
      setPerson(old.person);
      setFull(old.full);
      setFunctionId(old.functionId);
      setRelations(old.relations);
      setCycle(old.cycle);
      setMapContext(old.mapContext);
      setPanelWidth(old.panelWidth);
      setWorkflowId(old.workflowId);
      setF(old.f);
      setLayers(old.layers);
      setStatus(old.status);
    }
    setTutorial(null);
  };
  const nextTutorial = () => {
    if (tutorial === null) return;
    const next = tutorial + 1;
    if (next > 3) {
      closeTutorial();
      return;
    }
    setTutorial(next);
    if (isConfiguration) {
      setFunctionId(functionId ?? "search");
      if (next === 1) open("functions");
      if (next === 2) {
        setRelations(true);
        setCycle(null);
        open("workflow");
      }
      if (next === 3) {
        setWorkflowId("search");
        setCycle("search");
        setRelations(false);
        setPane(null);
      }
    } else {
      if (next === 1) open("criteria");
      if (next === 2) open("results");
      if (next === 3) {
        const example = shown.find(hasDossierDetails) ?? shown[0];
        if (example) inspect(example.code);
        else open("shortlist");
      }
    }
  };
  const functionActions = selectedFunction && (
    <div className="workspace-function-actions">
      {iconAction(
        included.includes(selectedFunction.id)
          ? t("Remove this capability", "Вилучити функцію")
          : t("Include this capability", "Додати функцію"),
        included.includes(selectedFunction.id) ? <Minus /> : <Plus />,
        () => toggleFunction(selectedFunction.id),
        included.includes(selectedFunction.id),
      )}
      {iconAction(
        t("Show related capabilities in the workflow", "Показати пов’язані функції у workflow"),
        <GitBranch />,
        () => {
          setRelations(!relations);
          setCycle(null);
          open("workflow");
        },
        relations,
      )}
      {iconAction(
        t("Show this capability in a workflow cycle", "Показати функцію в циклі workflow"),
        <RefreshCw />,
        () => {
          setCycle(selectedWorkflow.id);
          setRelations(false);
          setPane(null);
        },
        !!cycle,
      )}
    </div>
  );
  const functionDescription = selectedFunction ? (
    <>
      <h3>{selectedFunction.title[locale]}</h3>
      <p>{selectedFunction.detail[locale]}</p>
      <h4>{t("Result and availability", "Результат і доступність")}</h4>
      <p>{selectedFunction.status[locale]}</p>
      {selectedFunction.id === "evidence" && (
        <p>
          {t(
            "Retain a finding together with its source, reviewer, review date and permission. The demonstration does not create such a review or send any data.",
            "Зберегти висновок разом із джерелом, рецензентом, датою перевірки й дозволом. Демонстрація не створює такої перевірки й не передає дані.",
          )}
        </p>
      )}
      {functionActions}
      <p className="workspace-boundary">
        {t(
          "Graph audience dots illustrate availability of supplied fields; they are not service users or inferred interests.",
          "Точки аудиторії ілюструють наявність вихідних полів; це не користувачі сервісу й не припущення про їхні інтереси.",
        )}{" "}
        {t("Accessible records for this illustration: ", "Доступних записів для цієї ілюстрації: ")}
        {illustrativeRecords(selectedFunction.id, all, draft.shortlist).length}
      </p>
      {mapSlip(selectedFunction.title[locale])}
    </>
  ) : (
    <p>
      {t(
        "Hover or select a capability in the graph to read its purpose and expected result.",
        "Наведіть курсор або оберіть функцію на графі, щоб прочитати її призначення й очікуваний результат.",
      )}
    </p>
  );
  const panelContent = () => {
    if (pane === "results")
      return (
        <>
          <p role="status">
            {t("Records matching the current map: ", "Записів у поточній мапі: ")}
            {shown.length}
          </p>

          <div className="workspace-batch-actions">
            <button
              disabled={!ready || !shown.length}
              onClick={() =>
                update({
                  shortlist: [...new Set([...draft.shortlist, ...shown.map((e) => e.code)])],
                })
              }
            >
              {t("Select all results", "Відібрати всі результати")}
            </button>
            <button
              disabled={!ready}
              onClick={() =>
                update({
                  shortlist: draft.shortlist.filter((code) => !shown.some((e) => e.code === code)),
                })
              }
            >
              {t("Remove results from shortlist", "Зняти відбір результатів")}
            </button>
          </div>
          {shown.map((e) => (
            <div className="workspace-result" key={e.code}>
              <input
                type="checkbox"
                aria-label={t("Select ", "Відібрати ") + e.code}
                checked={draft.shortlist.includes(e.code)}
                disabled={!ready}
                onChange={() =>
                  update({
                    shortlist: draft.shortlist.includes(e.code)
                      ? draft.shortlist.filter((code) => code !== e.code)
                      : [...draft.shortlist, e.code],
                  })
                }
              />
              <button onClick={() => inspect(e.code)}>
                <GraphGlyph kind="person" />
                <span>
                  <strong>{expertiseName(e, uk)}</strong>
                  <small>{e.code}</small>
                </span>
              </button>
            </div>
          ))}
          <label className="workspace-field">
            {t("Search name", "Назва пошуку")}
            <input value={saveName} onChange={(e) => setSaveName(e.target.value)} />
          </label>
          <button onClick={saveSearch} disabled={savedBlocked || !ready}>
            <Save size={16} />
            {t("Save search and map in this browser", "Зберегти пошук і мапу в браузері")}
          </button>
          {mapSlip(t("Current search", "Поточний пошук"))}
          {saved.map((s) => (
            <button
              className="workspace-saved-map"
              key={s.id}
              onClick={() => {
                setF({ ...s.filters });
                setLayers({ ...s.layers });
                setStatus({ ...s.status });
                setPane("results");
              }}
            >
              {s.image && <img src={s.image} alt="" />}
              <span>{s.name}</span>
            </button>
          ))}
        </>
      );
    if (pane === "profile")
      return selectedPerson ? (
        <WorkspacePerson expert={selectedPerson} uk={uk} full={full} ready={ready} />
      ) : (
        <p>
          {t(
            "Choose a person from the map or results.",
            "Оберіть персону на мапі або в результатах.",
          )}
        </p>
      );
    if (pane === "shortlist")
      return (
        <>
          {mapSlip(t("My shortlist", "Мій відбір"))}
          <NetworkShortlist
            people={all}
            codes={draft.shortlist}
            name={draft.groupName}
            onName={(groupName) => update({ groupName })}
            onInspect={(code) => inspect(code)}
            onRemove={(code) => update({ shortlist: draft.shortlist.filter((c) => c !== code) })}
            onClose={() => setPane(null)}
            onSearch={() => open("criteria")}
            onRestore={(shortlist, groupName) => update({ shortlist, groupName })}
            uk={uk}
            disabled={!ready}
            expanded={panelWidth > 500}
            onExpand={() => setPanelWidth(panelWidth > 500 ? 365 : 580)}
          />
        </>
      );
    if (pane === "functions")
      return (
        <>
          {functionDescription}
          <h4>{t("All capabilities", "Усі функції")}</h4>
          {CLIENT_SERVICES.map((s) => (
            <button
              className="workspace-result"
              key={s.id}
              onClick={() => {
                setFunctionId(s.id);
                setCycle(null);
                setRelations(false);
              }}
            >
              <GraphGlyph kind="function" />
              <span>{s.title[locale]}</span>
              {included.includes(s.id) && <Check size={16} />}
            </button>
          ))}
        </>
      );
    if (pane === "selection")
      return (
        <>
          <p>
            {t(
              "Your selection describes requested capabilities. It does not activate a service or send data.",
              "Вибір описує потрібні функції. Він не активує сервіс і не надсилає дані.",
            )}
          </p>
          {included.map((id) => {
            const s = CLIENT_SERVICES.find((s) => s.id === id)!;
            return (
              <article className="workspace-included" key={id}>
                <GraphGlyph kind="function" />
                <button
                  onClick={() => {
                    setFunctionId(id);
                    open("functions");
                  }}
                >
                  {s.title[locale]}
                </button>
                {iconAction(t("Remove capability", "Вилучити функцію"), <Minus />, () =>
                  toggleFunction(id),
                )}
              </article>
            );
          })}
          {mapSlip(t("Selected capabilities", "Обрані функції"))}
          <label className="workspace-field">
            {t(
              "Users, audiences, locations, current tools, integrations and specific needs",
              "Користувачі, аудиторії, локації, поточні системи, інтеграції та особливі потреби",
            )}
            <textarea
              rows={6}
              value={draft.notes}
              disabled={!ready}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </label>
          <button
            onClick={() => {
              const blob = new Blob(
                [
                  JSON.stringify(
                    {
                      capabilities: included,
                      workflowContext: workflowId,
                      requirements: draft.notes,
                      activation: "requested_not_connected",
                    },
                    null,
                    2,
                  ),
                ],
                { type: "application/json" },
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "capability-selection.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={16} />
            {t("Download capability selection", "Завантажити склад функцій")}
          </button>
        </>
      );
    if (pane === "workflow")
      return (
        <>
          {functionDescription}
          <label className="workspace-field">
            {t("Workflow context", "Контекст workflow")}
            <select
              value={selectedWorkflow.id}
              onChange={(e) => {
                setWorkflowId(e.target.value);
                if (cycle) setCycle(e.target.value);
              }}
            >
              {(workflows.length ? workflows : WORKSPACE_WORKFLOWS).map((w) => (
                <option value={w.id} key={w.id}>
                  {w.title[locale]}
                </option>
              ))}
            </select>
          </label>
          <h3>{selectedWorkflow.title[locale]}</h3>
          <p>{selectedWorkflow.detail[locale]}</p>
          <ol>
            {selectedWorkflow.serviceIds.map((id) => (
              <li key={id}>{CLIENT_SERVICES.find((s) => s.id === id)?.title[locale]}</li>
            ))}
          </ol>
          <button
            onClick={() => {
              setCycle(selectedWorkflow.id);
              setRelations(false);
              setPane(null);
            }}
          >
            <RefreshCw size={16} />
            {t("Show cycle in graph", "Показати цикл у графі")}
          </button>
        </>
      );
    return null;
  };
  const resizePaper = (width: number) => {
    setPanelWidth(width);
    if (pane === "profile")
      setFull(width >= 500 && !!selectedPerson && hasDossierDetails(selectedPerson));
  };
  const resize = (e: React.PointerEvent) => {
    e.preventDefault();
    const start = e.clientX,
      width = panelWidth;
    setDragging(true);
    const move = (event: PointerEvent) =>
      resizePaper(Math.max(260, Math.min(window.innerWidth - 160, width + event.clientX - start)));
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };
  return (
    <main
      className={
        "insight-workspace is-" +
        mode +
        (pane ? " has-paper" : "") +
        (dragging ? " is-resizing" : "")
      }
      style={
        {
          "--workspace-paper-width": panelWidth + "px",
          "--workspace-rail-extent": railExtent + "px",
        } as React.CSSProperties
      }
      onKeyDown={(event) => {
        if (
          event.key === "Escape" &&
          !(event.target as Element).closest(".workspace-settings[open],.client-data-notice[open]")
        ) {
          if (tutorial !== null) closeTutorial();
          else setPane(null);
        }
      }}
    >
      <WorkspaceHints />
      <header className="workspace-header">
        <button className="workspace-brand" onClick={() => go("home")}>
          ISRM <span>INSIGHT HUB</span>
        </button>
        {mode === "search" && (
          <div
            className="workspace-layer-strip"
            aria-label={t(
              "Search layers and attribute filters",
              "Шари пошуку та фільтри атрибутів",
            )}
          >
            {iconAction(t("Reset filters", "Скинути фільтри"), <FilterX />, () => {
              setF({ ...EMPTY });
              setStatus({
                ai: "any",
                peer: "any",
                membership: "any",
                chapter: "any",
                organisation: "any",
                source: "any",
              });
              setMapContext("search");
            })}
            <input
              className="workspace-quick-search"
              type="search"
              aria-label={t("Search records", "Пошук записів")}
              placeholder={t("Search", "Пошук")}
              value={f.q}
              onChange={(e) => setFilter("q", e.target.value)}
            />
            <span className="workspace-strip-label">{t("Layers", "Шари")}</span>
            {layerField("countries", t("Countries", "Країни"), "country", "country")}
            {layerField("expertise", t("Expertise", "Експертиза"), "expertise", "expertise")}
            {layerField("sectors", t("Sectors", "Сектори"), "sector", "sector")}
            <span className="workspace-strip-label">{t("Attributes", "Атрибути")}</span>
            {(
              [
                ["organisation", t("Organisation recorded", "З організацією"), Building2],
                ["source", t("Source confirmation", "Підтвердження у джерелі"), FileCheck2],
                ["ai", t("AI review", "Перевірка ШІ"), Bot],
                ["peer", t("Peer recommendations", "Рекомендації колег"), Users],
                ["membership", t("ISRM membership", "Членство ISRM"), BadgeCheck],
                ["chapter", t("Chapter head", "Керівник чаптеру"), Flag],
              ] as const
            ).map(([key, label, Icon]) => (
              <div
                key={key}
                className="workspace-attribute"
                data-hint={
                  label + " · " + t("Filter by recorded attribute", "Тільки з таким статусом")
                }
              >
                <Icon size={20} />
                <select
                  aria-label={label}
                  value={status[key] ?? "any"}
                  onChange={(e) => setStatus((old) => ({ ...old, [key]: e.target.value }))}
                >
                  <option value="any">{t("Any", "Усі")}</option>
                  <option value="yes">{t("Recorded", "Є позначка")}</option>
                  <option value="unknown">{t("Not recorded", "Не встановлено")}</option>
                </select>
                <span aria-hidden="true">
                  {status[key] === "yes" ? "✓" : status[key] === "unknown" ? "?" : ""}
                </span>
              </div>
            ))}
          </div>
        )}
        {mode === "configuration" && (
          <h1>{t("Capability configurator", "Конфігуратор функцій")}</h1>
        )}
        <details className="workspace-surface-info">
          <summary
            aria-label={t("About this workspace", "Про робочий простір")}
            data-hint={t("About the search and counters", "Про пошук і лічильники")}
          >
            <Info size={20} />
          </summary>
          <div>
            <p>
              <Info size={15} />
              {t(
                "Sample counts people matching expertise alone. Under review applies all remaining criteria. Selected counts your shortlist.",
                "Вибірка враховує лише експертизу. На розгляді — персони, які відповідають решті критеріїв. Відібрано — ваш список.",
              )}
            </p>
            <p>
              <Info size={15} />
              {t(
                "Country comes from the phone code. Shared category edges are not personal recommendations. AI and peer checks are not connected.",
                "Країна походить із телефонного коду. Спільна категорія не доводить знайомства. Перевірки ШІ й колег не підключені.",
              )}
            </p>
          </div>
        </details>
        {mode === "home" && (
          <div className="workspace-header-actions">
            <AccessControl />
          </div>
        )}
      </header>
      {mode === "home" ? (
        <section className="workspace-home" aria-labelledby="workspace-home-title">
          <div>
            <p className="workspace-eyebrow">INSIGHT HUB</p>
            <h1 id="workspace-home-title">
              {homeStep === "intro"
                ? t("Work with network expertise", "Робота з мережевою експертизою")
                : t("Choose a workflow", "Оберіть workflow")}
            </h1>
            {homeStep === "intro" ? (
              <>
                <p>
                  {t(
                    "Explore network expertise and compose the services your team needs. This demonstration supports testing the work and discussing priorities.",
                    "Працюйте з мережевою експертизою та формуйте потрібний склад сервісів. Демонстрація призначена для перевірки зручності роботи й обговорення пріоритетів.",
                  )}
                </p>
                <h2>{t("Working demonstrations", "Налаштовані функціональні демонстрації")}</h2>
                <p>
                  {t(
                    "Explore the sample, filter the map, read accessible dossiers, save searches and local shortlists, and configure requested capabilities.",
                    "Огляд вибірки, фільтрування мапи, перегляд дозволених досьє, збереження пошуків і локального відбору, конфігурування потрібних функцій.",
                  )}
                </p>
                <div className="workspace-entry-actions">
                  <button onClick={() => setHomeStep("workflows")}>
                    <Search />
                    {t("Choose a workflow", "Обрати workflow")}
                  </button>
                  <button onClick={() => go("configuration")}>
                    <Layers />
                    {t("Open capability configurator", "Відкрити конфігуратор")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  className="workspace-workflow-choice"
                  onClick={() => {
                    setF({ ...EMPTY });
                    setLayers({ ...DEFAULT_MAP_LAYERS });
                    setStatus({
                      ai: "any",
                      peer: "any",
                      membership: "any",
                      chapter: "any",
                      source: "any",
                      organisation: "any",
                    });
                    go("search");
                  }}
                >
                  <Search />
                  <span>
                    <strong>{t("Expertise search", "Пошук експертизи")}</strong>
                    <small>
                      {t(
                        "Overview → enquiry → dossier → shortlist → next action",
                        "Огляд → запит → досьє → відбір → наступна дія",
                      )}
                    </small>
                  </span>
                </button>
                {WORKSPACE_WORKFLOWS.filter((w) => w.id !== "search").map((w) => (
                  <div className="workspace-workflow-pipeline" key={w.id}>
                    <strong>{w.title[locale]}</strong>
                    <span>{t("In the pipeline", "У пайплайні")}</span>
                  </div>
                ))}
                <button onClick={() => setHomeStep("intro")}>{t("Back", "Назад")}</button>
              </>
            )}
          </div>
          <div className="workspace-home-overview">
            <ExpertiseMapFigure experts={all} locale={locale} />
            <p>
              {t(
                "The supplied sample is not a complete membership register.",
                "Передана вибірка не є повним реєстром членів асоціації.",
              )}
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className="workspace-body" ref={bodyRef}>
            <nav
              className="workspace-spines"
              aria-label={t("Workspace panels", "Панелі робочого простору")}
            >
              {spines.map((id) => (
                <button
                  key={id}
                  onClick={() => open(id)}
                  aria-pressed={pane === id}
                  data-hint={t("Open: ", "Відкрити: ") + name(id)}
                >
                  <FolderOpen size={21} aria-hidden="true" />
                  <span>{name(id)}</span>
                </button>
              ))}
            </nav>
            {pane && (
              <section className="workspace-paper" aria-label={name(pane)}>
                <header>
                  {pane === "profile" && selectedPerson && (
                    <>
                      {slip && (
                        <img
                          className="workspace-person-slip"
                          src={slip}
                          alt={t("Snapshot of this selection", "Знімок цієї вибірки")}
                        />
                      )}
                      <div className="workspace-person-heading">
                        <h2>
                          {/^Expert\s*#/i.test(selectedPerson.displayName)
                            ? selectedPerson.code
                            : selectedPerson.displayName}
                        </h2>
                        <label>
                          <input
                            type="checkbox"
                            aria-label={t("Selected", "Відібрано")}
                            checked={draft.shortlist.includes(selectedPerson.code)}
                            disabled={!ready}
                            onChange={togglePerson}
                          />
                          {t("Selected", "Відібрано")}
                        </label>
                      </div>
                    </>
                  )}
                  {pane !== "profile" && <h2>{name(pane)}</h2>}
                  {pane === "profile" && selectedPerson && hasDossierDetails(selectedPerson) && (
                    <button
                      aria-label={
                        full ? t("Mini dossier", "Міні-досьє") : t("Full dossier", "Повне досьє")
                      }
                      data-hint={
                        full ? t("Mini dossier", "Міні-досьє") : t("Full dossier", "Повне досьє")
                      }
                      onClick={() => {
                        setFull(!full);
                        setPanelWidth(full ? 480 : 680);
                      }}
                    >
                      {full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                  )}
                  <button
                    aria-label={t("Close panel", "Закрити панель")}
                    data-hint={t("Collapse to folder spine", "Схлопнути до корінця")}
                    onClick={() => setPane(null)}
                  >
                    <X size={18} />
                  </button>
                  <details className="workspace-surface-info">
                    <summary
                      aria-label={t("About this panel", "Про цю панель")}
                      data-hint={t("About this panel", "Про цю панель")}
                    >
                      <Info size={18} />
                    </summary>
                    <div>
                      <p>
                        <Info size={15} />
                        {pane === "profile"
                          ? t(
                              "Dossier from the supplied research record. Self-confirmation is not recorded. It supports preliminary selection and planning a contact; it is not accreditation.",
                              "Досьє з наданого дослідницького запису. Самопідтвердження не встановлено. Призначення — попередній добір і планування контакту, не акредитація.",
                            )
                          : t(
                              "This working panel is local to your browser. Close it to restore the graph; its spine remains available.",
                              "Робоча панель зберігається локально в браузері. Закриття повертає граф, корінець лишається доступним.",
                            )}
                      </p>
                    </div>
                  </details>
                </header>
                <div className="workspace-paper-scroll">{panelContent()}</div>
                <div
                  className="workspace-paper-resize"
                  role="separator"
                  tabIndex={0}
                  aria-label={t("Resize panel", "Змінити ширину панелі")}
                  aria-valuemin={260}
                  aria-valuemax={900}
                  aria-valuenow={panelWidth}
                  onPointerDown={resize}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") resizePaper(Math.min(900, panelWidth + 30));
                    if (e.key === "ArrowLeft") resizePaper(Math.max(260, panelWidth - 30));
                    if (e.key === "Home") resizePaper(260);
                    if (e.key === "End") resizePaper(Math.min(900, window.innerWidth - 160));
                  }}
                />
              </section>
            )}
            <div className="workspace-graph-host">
              <Suspense fallback={<p>{t("Loading map…", "Завантаження мапи…")}</p>}>
                {hydrated && (
                  <Graph
                    ref={mapRef}
                    build={build}
                    uk={uk}
                    configuration={isConfiguration}
                    cycle={isConfiguration ? cycle : null}
                    selected={isConfiguration ? functionId : person}
                    included={included}
                    relations={isConfiguration && relations}
                    onRailExtent={setRailExtent}
                    railContent={
                      <>
                        <details ref={settings} className="workspace-settings">
                          <summary
                            aria-label={t("Settings", "Налаштування")}
                            data-hint={t("Settings", "Налаштування")}
                          >
                            <Settings size={20} />
                            <span>{t("Settings", "Налаштування")}</span>
                          </summary>
                          <div>
                            <ClientAccessibility />
                            {iconAction(
                              t("Tutorial", "Туторіал"),
                              <GraduationCap />,
                              beginTutorial,
                            )}
                          </div>
                        </details>
                        <AccessControl compact />
                      </>
                    }
                    dashboard={
                      <div
                        className="workspace-dashboard"
                        aria-label={t("Workspace counts", "Лічильники робочого простору")}
                        aria-live="polite"
                      >
                        {(isConfiguration
                          ? [
                              [t("Capabilities", "Функції"), CLIENT_SERVICES.length],
                              [t("In composition", "У складі"), included.length],
                              ["Workflow", WORKSPACE_WORKFLOWS.length],
                            ]
                          : [
                              [t("Sample", "Вибірка"), sample.length],
                              [t("Under review", "На розгляді"), shown.length],
                              [t("Selected", "Відібрано"), draft.shortlist.length],
                            ]
                        ).map(([label, count]) => (
                          <div key={label}>
                            <span>{label}</span>
                            <strong>{count}</strong>
                          </div>
                        ))}
                      </div>
                    }
                    onHover={hoverNode}
                    onNode={selectNode}
                    onBackground={() => {}}
                  />
                )}
              </Suspense>
            </div>
          </div>
          <footer className="workspace-bottom">
            {isConfiguration ? (
              <>
                <button onClick={() => open("functions")}>
                  <Layers size={20} />
                  <span>{t("Capability descriptions", "Описи функцій")}</span>
                </button>
                <button onClick={() => open("selection")}>
                  <Check size={20} />
                  <span>
                    {t("Selected capabilities", "Обрані функції")} · {included.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setPane(null);
                    setCycle(null);
                    setRelations(false);
                  }}
                >
                  <Network size={20} />
                  <span>{t("Show graph", "Показати граф")}</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => open("results")}>
                  <Users size={20} />
                  <span>{t("Results", "Результати")}</span>
                </button>
                <button onClick={() => open("shortlist")}>
                  <Check size={20} />
                  <span>{t("My shortlist", "Мій відбір")}</span>
                </button>
                <button onClick={() => go("configuration")}>
                  <Layers size={20} />
                  <span>{t("Configurator", "Конфігуратор")}</span>
                </button>
              </>
            )}
          </footer>
          {tutorial !== null && (
            <aside className="workspace-tutorial" aria-label={t("Tutorial", "Туторіал")}>
              <header>
                <h2>
                  {isConfiguration
                    ? t("Configurator tutorial", "Туторіал конфігуратора")
                    : t("Search tutorial", "Туторіал пошуку")}{" "}
                  · {tutorial + 1}/4
                </h2>
                <button
                  aria-label={t(
                    "Close tutorial and restore workspace",
                    "Закрити туторіал і повернути роботу",
                  )}
                  onClick={closeTutorial}
                >
                  <X size={18} />
                </button>
              </header>
              <p>
                {
                  (isConfiguration
                    ? [
                        t(
                          "All capabilities are named in the graph. Hover to read a description; click to inspect its workflow. Include or remove it explicitly in the panel.",
                          "Усі функції підписані на графі. Наведіть для опису; клікніть для перегляду workflow. Додавайте чи вилучайте функцію явною кнопкою на панелі.",
                        ),
                        t(
                          "The description explains purpose, result and availability. Inclusion is a request, not activation.",
                          "Опис пояснює призначення, результат і доступність. Додавання є запитом, а не активацією.",
                        ),
                        t(
                          "The branch icon shows related capabilities and the workflow composition, without treating people as participants.",
                          "Іконка розгалуження показує пов’язані функції та склад workflow; персони не стають учасниками сервісу.",
                        ),
                        t(
                          "The cycle icon arranges the workflow as a loop. Labels appear as the tapered reflection passes.",
                          "Іконка циклу розміщує workflow кільцем. Підписи з’являються під час проходження відблиску.",
                        ),
                      ]
                    : [
                        t(
                          "Always begin with an overview of the recorded expertise. All mapping layers are enabled; this is a supplied sample, not all ISRM members.",
                          "Завжди починаємо з огляду наявної експертизи. Усі шари мапування ввімкнено; це передана вибірка, не всі члени ISRM.",
                        ),
                        t(
                          "Use a checkbox to show a layer and its adjacent list to filter records. Countries with records come first.",
                          "Чекбокс показує шар, сусідній список фільтрує записи. Країни з наявними записами йдуть першими.",
                        ),
                        t(
                          "Search results and the map use the same records. Choose a person to read the dossier. Closed panels stay in the left spines.",
                          "Результати й мапа використовують ті самі записи. Оберіть персону для досьє. Закриті панелі залишаються в корінцях ліворуч.",
                        ),
                        t(
                          "Expand the available dossier, add to your shortlist and save your work locally. Introductions and research need separately agreed capabilities.",
                          "Розгорніть наявне досьє, додайте до відбору й збережіть роботу локально. Знайомства та дослідження потребують окремо погоджених функцій.",
                        ),
                      ])[tutorial]
                }
              </p>
              <button onClick={() => setTutorialLong(!tutorialLong)}>
                {t("Data and status explanation", "Пояснення даних і статусів")}
              </button>
              {tutorialLong && <DataUseNotice />}
              <button onClick={nextTutorial}>
                {tutorial === 3
                  ? t("Finish and restore work", "Завершити й повернути роботу")
                  : t("Next", "Далі")}
              </button>
            </aside>
          )}
        </>
      )}
      {(error || storageError) && (
        <p role="alert" className="workspace-storage-error">
          {error || storageError}
        </p>
      )}
    </main>
  );
}
