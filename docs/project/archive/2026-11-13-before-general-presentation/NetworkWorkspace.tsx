import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
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
import { canonicalCountry, referenceOptions, type ReferenceField } from "@/lib/network-reference";
import { CLIENT_SERVICES, type ServiceId } from "@/lib/client-catalog";
import type { GraphLayers, NetworkNode } from "@/lib/network-model";
import { selectedServiceIds } from "@/lib/client-draft";
import { serviceSelectionChanges } from "@/lib/tailored-scope";
import { hasDossierDetails } from "@/lib/dossier-content";
import {
  DEFAULT_MAP_LAYERS,
  SEARCH_PANES,
  CONFIGURATION_PANES,
  SEARCH_WORKFLOW,
  WORKSPACE_WORKFLOWS,
  expertiseName,
  workflowAdditionalServiceIds,
  workflowRequiredServiceIds,
  presentationSampleLayers,
  type PresentationSampleView,
  type MapLayers,
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
const anchorFromFilters = (filters: Filters) =>
  filters.organization
    ? "organisation:" + filters.organization
    : filters.expertise
      ? "expertise:" + filters.expertise
      : filters.sector
        ? "sector:" + filters.sector
        : filters.country
          ? "country:" + canonicalCountry(filters.country)
          : "";
export function NetworkWorkspace() {
  const navigate = useNavigate();
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
    sample?: PresentationSampleView;
    anchor?: string;
  };
  const [mode, setMode] = useState<WorkspaceMode>(
    route.stage === "configuration" || route.preset ? "configuration" : "search",
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
    [cycle, setCycle] = useState<string | null>(null),
    [workflowId, setWorkflowId] = useState("search");
  const [anchor, setAnchor] = useState("");
  const [priorities, setPriorities] = useState<
    Partial<Record<ServiceId, "must" | "should" | "later">>
  >({});
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
  const [scopePrompt, setScopePrompt] = useState<{
    title: string;
    described: boolean;
    id?: ServiceId;
  } | null>(null);
  const settings = useDismissibleDetails(),
    mapRef = useRef<WorkspaceGraphHandle>(null),
    bodyRef = useRef<HTMLDivElement>(null);
  const tutorialBefore = useRef<{
    pane: WorkspacePane | null;
    person: string | null;
    full: boolean;
    functionId: ServiceId | null;
    cycle: string | null;
    anchor: string;
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
    (w) =>
      !functionId ||
      w.id === SEARCH_WORKFLOW.id ||
      workflowRequiredServiceIds(w.id).includes(functionId),
  );
  const selectedWorkflow =
    workflows.find((w) => w.id === workflowId) ?? workflows[0] ?? WORKSPACE_WORKFLOWS[0]!;
  const activeWorkflowIds = useMemo<string[]>(() => [], []);
  const isConfiguration = mode === "configuration",
    spines = isConfiguration ? CONFIGURATION_PANES : SEARCH_PANES;
  const name = (id: WorkspacePane) =>
    ({
      criteria: t("Search criteria", "Критерії пошуку"),
      results: t("Search results", "Результати пошуку"),
      profile: t("Dossier", "Досьє"),
      shortlist: t("My shortlist", "Мій відбір"),
      core: t("Proposed conceptual core", "Запропоноване концептуальне ядро"),
      functions: t("Capability description", "Опис функції"),
      selection: t("Selected capabilities", "Обрані функції"),
      workflow: t("Connection examples", "Приклади зв’язків"),
    })[id];
  const shortName = (id: WorkspacePane) =>
    ({
      criteria: t("Criteria", "Пошук"),
      results: t("Results", "Результати"),
      profile: t("Dossier", "Досьє"),
      shortlist: t("Shortlist", "Відбір"),
      core: t("Core", "Ядро"),
      functions: t("Capabilities", "Функції"),
      selection: t("Selected", "Обрані"),
      workflow: t("Workflows", "Сценарії"),
    })[id];
  const spineIcon = (id: WorkspacePane) => {
    if (id === "criteria") return <FilterX size={20} aria-hidden="true" />;
    if (id === "results") return <Search size={20} aria-hidden="true" />;
    if (id === "profile") return <Users size={20} aria-hidden="true" />;
    if (id === "shortlist") return <Check size={20} aria-hidden="true" />;
    if (id === "core") return <Network size={20} aria-hidden="true" />;
    if (id === "functions") return <Layers size={20} aria-hidden="true" />;
    if (id === "selection") return <Check size={20} aria-hidden="true" />;
    return <GitBranch size={20} aria-hidden="true" />;
  };
  const open = (id: WorkspacePane, selectionAnchor?: string) => {
    if (id === "shortlist") {
      if (mapContext !== "shortlist") setAnchor(draft.shortlist[0] ?? "");
      setMapContext("shortlist");
    }
    if (id === "criteria" || id === "results") {
      if (mapContext === "shortlist") setAnchor(selectionAnchor ?? "");
      setMapContext("search");
    }
    if (id !== "profile") setPanelWidth(365);
    setPane(id === "criteria" ? "results" : id);
  };
  const go = (next: WorkspaceMode) => {
    setTutorial(null);
    setMode(next);
    setPane(null);
    setAnchor("");
    setHomeStep("intro");
    if (next === "search") setMapContext("search");
    if (next === "configuration") {
      setWorkflowId(SEARCH_WORKFLOW.id);
      setCycle(null);
    }
  };
  useEffect(() => {
    if (route.stage === "configuration" || route.capability || route.preset) {
      setMode("configuration");
      setPane(route.capability ? "functions" : null);
      if (route.capability) {
        setFunctionId(route.capability);
        setAnchor("svc:" + route.capability);
      } else {
        const selected = WORKSPACE_WORKFLOWS.some((workflow) => workflow.id === route.preset)
          ? route.preset!
          : SEARCH_WORKFLOW.id;
        setWorkflowId(selected);
        setAnchor(route.preset ? "workflow:" + selected : "");
      }
    } else if (route.sample) {
      setMode("search");
      setPane(null);
      setF({ ...EMPTY });
      setLayers(presentationSampleLayers(route.sample));
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
      setAnchor("");
    } else if (route.panel) {
      setMode("search");
      setPane(route.panel === "shortlist" ? "shortlist" : "results");
      setMapContext(route.panel === "shortlist" ? "shortlist" : "search");
    }
  }, [route.stage, route.capability, route.preset, route.sample, route.panel]);
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
  const noGraphPeople = useMemo<typeof graphPeople>(() => [], []);
  const graphLayers = useMemo<GraphLayers>(
    () => ({
      sector: layers.sectors,
      theme: false,
      hub: false,
      researchQueue: true,
      organization: layers.organisations,
      country: layers.countries,
      rank: false,
      specialisation: layers.expertise,
      services: isConfiguration,
      membership: layers.membership,
      chapter: layers.chapter,
    }),
    [layers, isConfiguration],
  );
  const membershipStatus = status["membership"];
  const sourceStatus = status["source"];
  const referenceSelection = useMemo(
    () => ({
      ...(f.country ? { country: f.country } : {}),
      ...(f.sector ? { sector: f.sector } : {}),
      ...(f.expertise ? { expertise: f.expertise } : {}),
      ...(membershipStatus === "yes" ? { role: "Recorded ISRM membership" } : {}),
      ...(sourceStatus === "yes"
        ? { reviewStatus: "Source confirmation flag present" }
        : sourceStatus === "unknown"
          ? { reviewStatus: "No source confirmation flag supplied" }
          : {}),
    }),
    [f.country, f.expertise, f.sector, membershipStatus, sourceStatus],
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
    anchor,
    cycle,
    mode,
    pane,
    mapContext,
    graphPeople,
  ]);
  const inspect = (code: string, expanded = false) => {
    setPerson(code);
    setAnchor(code);
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
    const selected = included.includes(id)
      ? included.filter((serviceId) => serviceId !== id)
      : [...included, id];
    update(serviceSelectionChanges(draft, selected));
  };
  const setCapabilityPriority = (id: ServiceId, priority: "must" | "should" | "later" | "") =>
    setPriorities((current) => {
      const next = { ...current };
      if (priority) next[id] = priority;
      else delete next[id];
      return next;
    });
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
      anchor,
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
  const setFilter = (key: keyof Filters, value: string, selectedAnchor?: string) => {
    const filterAnchor = value
      ? key === "organization"
        ? "organisation:" + value
        : key === "country"
          ? "country:" + canonicalCountry(value)
          : key === "sector"
            ? "sector:" + value
            : key === "expertise"
              ? "expertise:" + value
              : ""
      : "";
    setAnchor(selectedAnchor ?? filterAnchor);
    setF((v) => ({ ...v, [key]: value }));
  };
  const statusAnchor = (key: string, value: string) =>
    value === "any"
      ? ""
      : key === "membership"
        ? value === "yes"
          ? "membership:recorded"
          : "membership:not-recorded"
        : key === "chapter"
          ? value === "yes"
            ? "chapter:recorded"
            : "chapter:not-recorded"
          : key === "source"
            ? value === "yes"
              ? "source:flag"
              : "source:not-flagged"
            : "";
  const changeLayer = (key: keyof MapLayers) => {
    setAnchor("");
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
          onChange={(e) => {
            setAnchor(statusAnchor(key, e.target.value));
            setStatus((s) => ({ ...s, [key]: e.target.value }));
          }}
        >
          <option value="any">{t("Any", "Усі")}</option>
          <option value="yes">{t("Recorded", "Зафіксовано")}</option>
          <option value="unknown">{t("Not recorded", "Не зафіксовано")}</option>
        </select>
      )}
    </div>
  );
  const selectNode = (n: NetworkNode, expanded: boolean) => {
    setAnchor(n.id);
    if (n.kind === "expert") inspect(n.id, expanded);
    else if (n.kind === "core") {
      setCycle(null);
      open("core");
    } else if (n.kind === "service") {
      const id = n.id.slice(4) as ServiceId;
      if (!CLIENT_SERVICES.some((service) => service.id === id)) {
        setScopePrompt({ title: n.label, described: false });
        return;
      }
      setFunctionId(id);
      setCycle(null);
      const workflow = WORKSPACE_WORKFLOWS.find((item) => item.serviceIds.includes(id));
      if (workflow) setWorkflowId(workflow.id);
      open("functions");
    } else if (n.kind === "workflow") {
      setWorkflowId(n.id.slice(9));
      setCycle(n.id.slice(9));
      open("workflow");
    } else if (n.id.startsWith("country:")) {
      setFilter("country", n.label, n.id);
      open("results", n.id);
    } else if (n.id.startsWith("sector:")) {
      setFilter("sector", n.label, n.id);
      open("results", n.id);
    } else if (n.id.startsWith("expertise:")) {
      setFilter("expertise", n.label, n.id);
      open("results", n.id);
    } else if (n.kind === "organisation") {
      setFilter("organization", n.label, n.id);
      open("results", n.id);
    } else if (n.id === "membership:recorded" || n.id === "membership:not-recorded") {
      const value = n.id === "membership:recorded" ? "yes" : "unknown";
      setStatus((old) => ({ ...old, membership: value }));
      open("results", n.id);
    } else if (n.id === "chapter:recorded" || n.id === "chapter:not-recorded") {
      const value = n.id === "chapter:recorded" ? "yes" : "unknown";
      setStatus((old) => ({ ...old, chapter: value }));
      open("results", n.id);
    } else if (n.id === "source:flag" || n.id === "source:not-flagged") {
      const value = n.id === "source:flag" ? "yes" : "unknown";
      setStatus((old) => ({ ...old, source: value }));
      open("results", n.id);
    }
  };
  // Hover previews stay in place; only an intentional click opens a resizable paper.
  const beginTutorial = () => {
    tutorialBefore.current = {
      pane,
      person,
      full,
      functionId,
      cycle,
      anchor,
      mapContext,
      panelWidth,
      workflowId,
      f: { ...f },
      layers: { ...layers },
      status: { ...status },
    };
    setPane(null);
    setCycle(null);
    setAnchor("");
    if (isConfiguration) {
      setFunctionId(null);
      setWorkflowId(SEARCH_WORKFLOW.id);
    } else {
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
      setCycle(old.cycle);
      setAnchor(old.anchor);
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
      if (next === 1) {
        setAnchor("");
        setPane(null);
      }
      if (next === 2) {
        setCycle(SEARCH_WORKFLOW.id);
        setAnchor("");
        setPane(null);
      }
      if (next === 3) {
        setWorkflowId(SEARCH_WORKFLOW.id);
        setCycle(SEARCH_WORKFLOW.id);
        setAnchor("");
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
        t("Show connected capabilities", "Показати пов’язані функції"),
        <GitBranch />,
        () => {
          setCycle(null);
          setAnchor("svc:" + selectedFunction.id);
          open("workflow");
        },
      )}
      {iconAction(
        t("Highlight its connection example", "Підсвітити пов’язаний приклад"),
        <RefreshCw />,
        () => {
          setCycle(selectedWorkflow.id);
          setAnchor("workflow:" + selectedWorkflow.id);
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
      <button
        type="button"
        className="workspace-scope-bridge"
        onClick={() =>
          setScopePrompt({
            title: selectedFunction.title[locale],
            described: true,
            id: selectedFunction.id,
          })
        }
      >
        {t("Review this function in Scope & budget", "Розглянути функцію в «Обсяг і бюджет»")}
      </button>
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
          "Connection examples show catalogue associations only. They do not assign people to services, indicate demand or confirm that a service is available.",
          "Приклади зв’язків показують лише асоціації каталогу. Вони не призначають людей до сервісів, не свідчать про попит і не підтверджують доступність сервісу.",
        )}{" "}
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
    if (pane === "core")
      return (
        <>
          <h3>{t("Digital trust and influence", "Цифрова довіра та вплив")}</h3>
          <p>
            {t(
              "This is a proposed conceptual centre for discussing the product boundary. It is not a live graph database, a computed trust score, an identity-verification service, or an implemented access policy.",
              "Це запропонований концептуальний центр для обговорення меж продукту. Це не робоча графова база даних, не обчислений показник довіри, не сервіс перевірки особи й не реалізована політика доступу.",
            )}
          </p>
          <h4>{t("What the graph shows", "Що показує граф")}</h4>
          <p>
            {t(
              "The current graph is a catalogue view: it connects proposed capabilities and illustrative workflow relationships. It does not claim that evidence, permissions, recommendations, events, or internal APIs are already implemented.",
              "Поточний граф — це подання каталогу: він пов’язує запропоновані функції та ілюстративні зв’язки робочих процесів. Він не стверджує, що докази, дозволи, рекомендації, події чи внутрішні API вже реалізовані.",
            )}
          </p>
          <p className="workspace-boundary">
            {t(
              "The MVP boundary is still for discussion. Selecting a node or viewing this walkthrough does not approve scope.",
              "Межа MVP ще обговорюється. Вибір вузла чи перегляд цього пояснення не означає погодження обсягу робіт.",
            )}
          </p>
        </>
      );
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
                  <small>
                    {e.verified
                      ? t("Source confirmation flag present", "Є позначка підтвердження джерела")
                      : t(
                          "No source confirmation flag supplied",
                          "Позначку підтвердження джерела не надано",
                        )}
                  </small>
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
                setAnchor(s.anchor || anchorFromFilters(s.filters));
                setMapContext("search");
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
            onConfigure={() => go("configuration")}
            onRestore={(shortlist, groupName) => update({ shortlist, groupName })}
            captureGraph={capture}
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
                setAnchor("svc:" + s.id);
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
              "This draft records the service functions selected for discussion. Connection examples explain possible relationships; they are not scope selections, a price, a schedule or an implementation commitment.",
              "У цій чернетці зафіксовано сервісні функції для обговорення. Приклади зв’язків пояснюють можливі взаємозалежності, але не є вибором обсягу робіт, ціною, графіком чи зобов’язанням щодо реалізації.",
            )}
          </p>
          <h4>{t("Capability priorities", "Пріоритети функцій")}</h4>
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
                <label className="workspace-priority">
                  <span>{t("Priority", "Пріоритет")}</span>
                  <select
                    aria-label={`${t("Priority for", "Пріоритет функції")} ${s.title[locale]}`}
                    value={priorities[id] ?? ""}
                    onChange={(event) =>
                      setCapabilityPriority(
                        id,
                        event.target.value as "must" | "should" | "later" | "",
                      )
                    }
                  >
                    <option value="">{t("Not assessed", "Не оцінено")}</option>
                    <option value="must">{t("Must-have", "Обов’язково")}</option>
                    <option value="should">{t("Should-have", "Важливо")}</option>
                    <option value="later">{t("Later", "Пізніше")}</option>
                  </select>
                </label>
                {iconAction(t("Remove capability", "Вилучити функцію"), <Minus />, () =>
                  toggleFunction(id),
                )}
              </article>
            );
          })}
          <p className="workspace-boundary">
            {t(
              "Priority ratings are temporary in this tab and are not written to the browser draft.",
              "Оцінки пріоритету тимчасові в цій вкладці й не записуються до чернетки браузера.",
            )}
          </p>
          <h4>{t("Connection examples", "Приклади зв’язків")}</h4>
          <p>
            {t(
              "Expertise search is the shared foundation. Each other example builds on it and adds only its own capabilities; the base is shown once. These examples explain relationships, not scope choices or an organisation’s agreed process.",
              "Пошук експертизи — спільна основа. Кожен інший приклад спирається на нього й додає лише власні функції; основу показано один раз. Це пояснення зв’язків, а не вибір обсягу робіт чи погоджений процес організації.",
            )}
          </p>
          {WORKSPACE_WORKFLOWS.map((workflow) => {
            const additions = workflowAdditionalServiceIds(workflow.id);
            const missingServices = workflowRequiredServiceIds(workflow.id)
              .filter((serviceId) => !included.includes(serviceId))
              .map(
                (serviceId) =>
                  CLIENT_SERVICES.find((service) => service.id === serviceId)?.title[locale],
              )
              .filter((title): title is string => Boolean(title));
            const isBase = workflow.id === SEARCH_WORKFLOW.id;
            return (
              <article className="workspace-scope-workflow" key={workflow.id}>
                <GraphGlyph kind="workflow" />
                <div>
                  <strong>{workflow.title[locale]}</strong>
                  <small>
                    {isBase
                      ? t("Foundational workflow", "Базовий workflow")
                      : t(
                          `Builds on ${SEARCH_WORKFLOW.title[locale]}`,
                          `Спирається на: ${SEARCH_WORKFLOW.title[locale]}`,
                        )}
                  </small>
                  <small>{workflow.detail[locale]}</small>
                  <p>
                    <strong>
                      {isBase
                        ? t("Base capabilities", "Базові функції")
                        : t("Additional capabilities", "Додаткові функції")}
                    </strong>
                    {": "}
                    {additions
                      .map(
                        (serviceId) =>
                          CLIENT_SERVICES.find((service) => service.id === serviceId)?.title[
                            locale
                          ],
                      )
                      .filter((title): title is string => Boolean(title))
                      .join(", ")}
                  </p>
                  <p className="workspace-boundary">
                    {missingServices.length
                      ? t(
                          `Missing from this example: ${missingServices.join(", ")}. Without them, the base or added part of the example would be incomplete.`,
                          `Не обрано для цього прикладу: ${missingServices.join(", ")}. Без них базова або додаткова частина прикладу буде неповною.`,
                        )
                      : t(
                          "The base and additional capabilities are selected. This remains an illustration, not an agreed organisational workflow.",
                          "Базові й додаткові функції обрано. Це лише ілюстрація, а не погоджений workflow організації.",
                        )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWorkflowId(workflow.id);
                    setCycle(workflow.id);
                    setAnchor("workflow:" + workflow.id);
                    open("workflow");
                  }}
                >
                  {t("Show on graph", "Показати на графі")}
                </button>
              </article>
            );
          })}
          {mapSlip(t("Selected capabilities", "Обрані функції"))}
          <label className="workspace-field">
            {t(
              "Scope requirements: users, audiences, locations, current tools, integrations and specific needs",
              "Вимоги scope: користувачі, аудиторії, локації, поточні системи, інтеграції та особливі потреби",
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
                      status: "draft_for_scope_discussion",
                      capabilities: included.map((id) => ({
                        id,
                        title: CLIENT_SERVICES.find((service) => service.id === id)?.title[locale],
                        priority: priorities[id] ?? "not_assessed",
                      })),
                      requirements: draft.notes,
                      pricing: "not_assessed",
                      timeline: "not_assessed",
                      activation: "not_requested",
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
              a.download = "work-scope-draft.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={16} />
            {t("Download work-scope draft", "Завантажити чернетку scope робіт")}
          </button>
        </>
      );
    if (pane === "workflow") {
      const missingServices = workflowRequiredServiceIds(selectedWorkflow.id).filter(
        (id) => !included.includes(id),
      );
      const missingNames = missingServices
        .map((id) => CLIENT_SERVICES.find((service) => service.id === id)?.title[locale])
        .filter((title): title is string => Boolean(title));
      const additionalServices = workflowAdditionalServiceIds(selectedWorkflow.id);
      const isBase = selectedWorkflow.id === SEARCH_WORKFLOW.id;
      return (
        <>
          {functionDescription}
          <label className="workspace-field">
            {t("Connection example", "Приклад зв’язків")}
            <select
              value={selectedWorkflow.id}
              onChange={(e) => {
                setWorkflowId(e.target.value);
                setAnchor("workflow:" + e.target.value);
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
          <p>
            {isBase
              ? t(
                  "This is the foundation. The other connection examples build on this workflow.",
                  "Це базовий workflow. Інші приклади зв’язків спираються на нього.",
                )
              : t(
                  `Builds on ${SEARCH_WORKFLOW.title[locale]}. Its base capabilities are shown once; only the additional capabilities are listed here.`,
                  `Спирається на: ${SEARCH_WORKFLOW.title[locale]}. Базові функції показано один раз; тут наведено лише додаткові.`,
                )}
          </p>
          <h4>
            {isBase
              ? t("Base capabilities", "Базові функції")
              : t("Additional capabilities", "Додаткові функції")}
          </h4>
          <ol>
            {additionalServices.map((id) => {
              const service = CLIENT_SERVICES.find((item) => item.id === id);
              if (!service) return null;
              return (
                <li key={id}>
                  {service.title[locale]} —{" "}
                  {included.includes(id) ? t("selected", "обрано") : t("not selected", "не обрано")}
                </li>
              );
            })}
          </ol>
          <p className="workspace-boundary" role="status">
            {missingNames.length
              ? t(
                  `The example would be incomplete without these base or additional capabilities: ${missingNames.join(", ")}.`,
                  `Приклад буде неповним без таких базових або додаткових функцій: ${missingNames.join(", ")}.`,
                )
              : t(
                  "The base and additional capabilities are selected. This is still an illustration, not approval of an organisational workflow.",
                  "Базові й додаткові функції обрано. Це все ще ілюстрація, а не погодження workflow організації.",
                )}
          </p>
          <button
            onClick={() => {
              setCycle(selectedWorkflow.id);
              setAnchor("workflow:" + selectedWorkflow.id);
              setPane(null);
            }}
          >
            <RefreshCw size={16} />
            {t("Highlight example in graph", "Підсвітити приклад на графі")}
          </button>
        </>
      );
    }
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
        <button className="workspace-brand" onClick={() => go("search")}>
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
              setAnchor("");
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
                  onChange={(e) => {
                    setAnchor("");
                    setStatus((old) => ({ ...old, [key]: e.target.value }));
                  }}
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
                : t("Choose a starting point", "Оберіть спосіб початку")}
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
                    {t("Explore starting points", "Переглянути варіанти початку")}
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
                        "Foundation: overview → enquiry → dossier → shortlist → next action",
                        "Основа: огляд → запит → досьє → відбір → наступна дія",
                      )}
                    </small>
                  </span>
                </button>
                {WORKSPACE_WORKFLOWS.filter((w) => w.id !== "search").map((w) => (
                  <div className="workspace-workflow-pipeline" key={w.id}>
                    <strong>{w.title[locale]}</strong>
                    <span>
                      {t(
                        `Builds on ${SEARCH_WORKFLOW.title[locale]}`,
                        `Спирається на: ${SEARCH_WORKFLOW.title[locale]}`,
                      )}
                    </span>
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
                  aria-label={name(id)}
                  data-hint={t("Open: ", "Відкрити: ") + name(id)}
                >
                  {spineIcon(id)}
                  <span className="workspace-spine-full">{name(id)}</span>
                  <span className="workspace-spine-short">{shortName(id)}</span>
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
                    experts={isConfiguration || !layers.people ? noGraphPeople : graphPeople}
                    layers={graphLayers}
                    referenceSelection={referenceSelection}
                    locale={locale}
                    configuration={isConfiguration}
                    configurationRevealStep={isConfiguration ? tutorial : null}
                    showEmpty={!isConfiguration && graphPeople.length === 0}
                    anchor={anchor}
                    onAnchor={setAnchor}
                    focus={person}
                    onFocus={(id) => (id ? inspect(id) : setPerson(null))}
                    selectedWorkflow={cycle ?? selectedWorkflow.id}
                    included={included}
                    shortlistedCodes={draft.shortlist}
                    activeWorkflowIds={activeWorkflowIds}
                    onServiceExclude={(id) => toggleFunction(id as ServiceId)}
                    onWorkflowSelect={(id) => {
                      setWorkflowId(id);
                      setCycle(id);
                      setAnchor("workflow:" + id);
                      open("workflow");
                    }}
                    onNode={selectNode}
                    onBackground={() => setAnchor("")}
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
                              [
                                t("Connection examples", "Приклади зв’язків"),
                                WORKSPACE_WORKFLOWS.length,
                              ],
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
                    setAnchor("workflow:" + SEARCH_WORKFLOW.id);
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
                          "The centre is a proposed concept: digital trust and influence. It is not a live graph database, a computed trust score, identity verification, or an implemented access policy. The MVP boundary is still for discussion.",
                          "У центрі — запропонована концепція: цифрова довіра та вплив. Це не робоча графова база даних, не обчислений показник довіри, не перевірка особи й не реалізована політика доступу. Межа MVP ще обговорюється.",
                        ),
                        t(
                          "Capabilities appear one by one around the proposed centre. Select a node or open Capability descriptions for its purpose, result and availability. Adding a capability to this local draft is not approval or activation.",
                          "Функції з’являються по одній навколо запропонованого ядра. Виберіть вузол або відкрийте «Описи функцій», щоб прочитати призначення, результат і доступність. Додавання функції до локальної чернетки не є погодженням чи активацією.",
                        ),
                        t(
                          "Workflows then appear with labelled relationships: solid arrows show a workflow using a capability; dashed arrows show another workflow building on Expertise search; patterned arrows connect the proposed centre to that search. These are catalogue relationships, not your approved process.",
                          "Далі з’являються робочі процеси з підписаними зв’язками: суцільні стрілки показують використання функції процесом; пунктирні — залежність іншого процесу від пошуку експертизи; штрих-пунктирні з’єднують запропоноване ядро з пошуком. Це зв’язки каталогу, а не погоджений процес.",
                        ),
                        t(
                          "The assembled graph lights up to show the proposed relationships together. It is an explainer for discussion, not evidence that the data core or workflows are implemented, and not approval of an MVP scope.",
                          "Зібраний граф підсвічує всі запропоновані зв’язки разом. Це пояснювальна схема для обговорення, а не доказ реалізації ядра даних чи процесів і не погодження обсягу MVP.",
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
                          "Expand the dossier, add people to your shortlist and save it locally. After the tour, open My shortlist to try the project-name field; sending invitations is not enabled in this demo. Use the Configurator to shape the group's service needs; a future release may require Premium.",
                          "Розгорніть досьє, додайте людей до відбору й збережіть список локально. Після туторіалу відкрийте «Мій відбір» і спробуйте поле назви проєкту; надсилання запрошень у демо недоступне. У конфігураторі визначте потреби групи у сервісах; у майбутній версії ця функція може вимагати Premium.",
                        ),
                      ])[tutorial]
                }
              </p>
              <button onClick={() => setTutorialLong(!tutorialLong)}>
                {t("Data and status explanation", "Пояснення даних і статусів")}
              </button>
              {tutorialLong && <DataUseNotice />}
              <button
                onClick={closeTutorial}
                aria-label={t(
                  "Skip tutorial and restore workspace",
                  "Пропустити туторіал і повернути роботу",
                )}
              >
                {t("Skip", "Пропустити")}
              </button>
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
      {scopePrompt && (
        <div
          className="workspace-scope-shade"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              setScopePrompt(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="workspace-scope-prompt-title"
            aria-describedby="workspace-scope-prompt-body"
            className="workspace-scope-prompt"
          >
            <h2 id="workspace-scope-prompt-title">
              {t("Discuss this function", "Обговорити функцію")}
            </h2>
            <p id="workspace-scope-prompt-body">
              {t(
                `Open Scope & budget to review ${scopePrompt.title} for an estimate request.${scopePrompt.described ? "" : " You can describe this proposed function in Additional functions."} This does not approve implementation, timing or price.`,
                `Відкрийте «Обсяг і бюджет», щоб розглянути «${scopePrompt.title}» у запиті на оцінку.${scopePrompt.described ? "" : " Цю запропоновану функцію можна описати в розділі «Додаткова функціональність»."} Це не погоджує реалізацію, строки чи ціну.`,
              )}
            </p>
            <div>
              <button type="button" autoFocus onClick={() => setScopePrompt(null)}>
                {t("Stay here", "Залишитися тут")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setScopePrompt(null);
                  void navigate({
                    to: "/scope",
                    hash: scopePrompt.described
                      ? `scope-service-${scopePrompt.id}`
                      : "scope-additional-functions",
                  });
                }}
              >
                {t("Open Scope & budget", "Відкрити «Обсяг і бюджет»")}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
