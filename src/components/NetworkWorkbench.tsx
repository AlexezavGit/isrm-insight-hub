import { NetworkWorkflowHint } from "./NetworkWorkflowHint";
import { NetworkCapabilityTree } from "./NetworkCapabilityTree";
import {
  packageServiceIds,
  packageChanges,
  excludeServiceChanges,
  type PackageId,
} from "@/lib/tailored-scope";
import { selectedServiceIds } from "@/lib/client-draft";
import { NetworkConcentrator } from "./NetworkConcentrator";
import { NetworkWalkthrough, type WalkthroughState } from "./NetworkWalkthrough";
import { NetworkProfile } from "./NetworkProfile";
import { NetworkShortlist } from "./NetworkShortlist";
import { NetworkInspectionDock } from "./NetworkInspectionDock";
import { stackedInspectionLayout, type StackWidths } from "@/lib/network-dock";
import {
  chooseSearchExample,
  resolveReplayExit,
  SEARCH_REPLAY,
  CONFIGURATION_REPLAY,
  type Experience,
} from "@/lib/network-experience";
import { NetworkServiceDependencies } from "./NetworkDescriptions";
import {
  SERVICE_FRAME_FIELDS,
  emptyServiceFrame,
  serviceFrameText,
  missingRequirementFields,
} from "@/lib/service-request-frame";
import { MemberSurveyPreview } from "./MemberSurveyPreview";
import { CLIENT_APPROVED_PRICES, indicativePriceLabel } from "@/lib/client-pricing";
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Network,
  Search,
  GitBranch,
  Plus,
  Minus,
  Play,
  Pause,
  Users,
  Building2,
  Layers,
  Info,
} from "lucide-react";
import { useAccess } from "@/lib/access";
import { useI18n } from "@/lib/i18n";
import { applyFilters, EMPTY, useFilters, FilterBar } from "@/lib/filters";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  CORE_SERVICE_IDS,
  type ServiceId,
  type WorkflowId,
} from "@/lib/client-catalog";
import type { GraphLayers } from "@/lib/network-model";
import { buildNetwork, relatedPeople, workflowServices } from "@/lib/network-model";
import { useClientDraft } from "./ClientDraftProvider";
import { ClientHeader } from "./ClientHeader";
import { DataUseNotice } from "./DataUseNotice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
const NetworkGraph = lazy(() => import("./NetworkGraph"));
export function NetworkWorkbench() {
  const { locale } = useI18n(),
    uk = locale === "uk",
    t = (en: string, ua: string) => (uk ? ua : en);
  const { data, loading } = useAccess(),
    { draft, update, ready, error: draftError } = useClientDraft();
  const route = useSearch({ strict: false }) as {
    panel?: string;
    stage?: string;
    preset?: string;
    anchor?: string;
    capability?: string;
  };
  const root = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [inspectionFocus, setInspectionFocus] = useState(0);
  const [panelInset, setPanelInset] = useState(0);
  const resizedPanels = useRef(new Set<keyof StackWidths>());
  const [searchFocus, setSearchFocus] = useState(0);
  const [configurationStarted, setConfigurationStarted] = useState(false);
  const [connectionPath, setConnectionPath] = useState<string[]>([]);
  const [panelWidths, setPanelWidths] = useState<StackWidths>({
    search: 300,
    profile: 330,
    shortlist: 330,
  });
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [walk, setWalk] = useState<WalkthroughState | null>(null);
  const [groupOpen, setGroupOpen] = useState(route.panel === "shortlist");
  const [fullDossier, setFullDossier] = useState(false);
  const [experience, setExperience] = useState<Experience>(
    route.stage === "configuration" || route.preset ? "configuration" : "prototype",
  );
  const [exampleName, setExampleName] = useState("");
  const [exampleCodes, setExampleCodes] = useState<string[]>([]);
  const savedView = useRef<ReturnType<typeof captureView> | null>(null);
  const [live, setLive] = useState(!route.anchor && !route.stage && !route.preset);
  const [motionRequested, setMotionRequested] = useState(true);
  const [searchHidden, setSearchHidden] = useState(false);
  const [left, setLeft] = useState<"search" | "workflows" | "shortlist" | null>(
    route.panel === "shortlist"
      ? null
      : route.panel === "search"
        ? "search"
        : route.stage === "configuration"
          ? "workflows"
          : null,
  );
  const [groupFeedback, setGroupFeedback] = useState<string | null>(null);
  const [mode, setMode] = useState<"people" | "services">(
    route.stage === "configuration" ? "services" : "people",
  );
  const [f, setF] = useFilters(!walk && experience === "prototype");
  const searchBeforeConnections = useRef<{ f: typeof f; anchor: string; live: boolean } | null>(
    null,
  );
  const [layers, setLayers] = useState<GraphLayers>({
    sector: true,
    theme: true,
    hub: false,
    researchQueue: false,
    organization: true,
    country: false,
    rank: false,
    specialisation: false,
    services: true,
  });
  const [anchor, setAnchor] = useState(route.anchor || "isrm"),
    [person, setPerson] = useState<string | null>(null),
    [service, setService] = useState<ServiceId | null>(null);
  const [active, setActive] = useState<ServiceId[]>([]),
    [openWorkflow, setOpenWorkflow] = useState<string | null>(null);
  const [inspectedWorkflow, setInspectedWorkflow] = useState<string | null>(null);
  const lastStructured = useRef({ anchor, mode, active });
  const [excludePackage, setExcludePackage] = useState<PackageId | null>(null);
  const [exclude, setExclude] = useState<ServiceId | null>(null),
    [disabled, setDisabled] = useState<ServiceId[]>([]);
  const [composer, setComposer] = useState(false),
    [kind, setKind] = useState<"service" | "workflow">("workflow"),
    [title, setTitle] = useState(""),
    [frame, setFrame] = useState(emptyServiceFrame),
    [saved, setSaved] = useState(false);
  const [mailing, setMailing] = useState(false),
    [survey, setSurvey] = useState(false),
    [mounted, setMounted] = useState(false),
    [visible, setVisible] = useState(0);
  const all = useMemo(() => data?.experts ?? [], [data]),
    filtered = useMemo(
      () => applyFilters(all, experience === "configuration" ? EMPTY : f),
      [all, f, experience],
    );
  const shown = useMemo(
    () => filtered.filter((e) => e.verified || layers.researchQueue),
    [filtered, layers.researchQueue],
  );
  const referenceExperts = useMemo(
    () => all.filter((expert) => expert.verified || layers.researchQueue),
    [all, layers.researchQueue],
  );
  const example = useMemo(() => chooseSearchExample(all), [all]);
  const selectedCodes = walk?.kind === "prototype" ? exampleCodes : draft.shortlist;
  const walkId = walk
    ? (walk.kind === "configuration" ? CONFIGURATION_REPLAY : SEARCH_REPLAY)[walk.index]?.id
    : undefined;
  const selected = all.find((e) => e.code === person),
    selectedService = CLIENT_SERVICES.find((s) => s.id === service);
  const persistentSearch =
    wide && !searchHidden && experience === "prototype" && mode === "people" && !left;
  const leftPanelVisible = !!(left || persistentSearch);
  const layout = stackedInspectionLayout(
    viewportWidth,
    {
      search: experience === "configuration" ? left === "workflows" : leftPanelVisible,
      profile: experience === "configuration" ? !!(selected || service) : !!selected,
      shortlist: experience === "configuration" ? false : groupOpen,
    },
    panelWidths,
  );
  const rightPanelVisible = !!(
    selected ||
    service ||
    (experience === "configuration" ? left === "workflows" : groupOpen)
  );
  const dossierFull = fullDossier;
  const setWidth = (panel: keyof StackWidths, width: number) => {
    resizedPanels.current.add(panel);
    setPanelWidths((current) => ({ ...current, [panel]: width }));
    if (panel === "profile")
      setFullDossier(
        width >= Math.max(460, Math.min(520, Math.round((viewportWidth - 40) / 4) + 40)),
      );
  };
  const panelOpen = !!(left || selected || service || (groupOpen && experience === "prototype"));
  const selection = experience === "configuration" ? EMPTY : f;
  const model = useMemo(
    () => buildNetwork(shown, layers, locale, selection),
    [shown, layers, locale, selection],
  );
  const configuredServices = useMemo(() => selectedServiceIds(draft), [draft]);
  const exclusionImpact = useMemo(() => {
    if (!exclude) return [];
    const next = { ...draft, ...excludeServiceChanges(draft, exclude, excludePackage) };
    const after = relatedPeople(
      model,
      selectedServiceIds(next).map((id) => "svc:" + id),
    );
    return [
      ...relatedPeople(
        model,
        configuredServices.map((id) => "svc:" + id),
      ),
    ].filter((id) => !after.has(id));
  }, [exclude, excludePackage, draft, model, configuredServices]);
  const graphServices =
    experience === "configuration" && !walk
      ? configurationStarted
        ? configuredServices
        : []
      : active;
  const count =
    mode === "services"
      ? relatedPeople(
          model,
          graphServices.map((s) => "svc:" + s),
        ).size
      : shown.length;
  const close = () => {
    setLeft(null);
    setPerson(null);
    setService(null);
  };
  const structure = () => {
    setLive(false);
    if (live) {
      setAnchor(lastStructured.current.anchor);
      setMode(lastStructured.current.mode);
      setActive(lastStructured.current.active);
    }
  };
  const openShortlist = () => {
    setGroupOpen((v) => !v);
  };
  const inspectPerson = (code: string) => {
    setInspectionFocus((value) => value + 1);
    structure();
    setFullDossier(false);
    if (!all.find((e) => e.code === code)?.verified)
      setLayers((v) => ({ ...v, researchQueue: true }));
    setService(null);
    setPerson(code);
  };
  const captureView = () => ({
    f: { ...f },
    layers: { ...layers },
    anchor,
    mode,
    active: [...active],
    left,
    person,
    service,
    live,
    searchHidden,
    groupOpen,
    fullDossier,
    openWorkflow,
    inspectedWorkflow,
    configurationStarted,
    connectionPath: [...connectionPath],
    disabled: [...disabled],
    motionRequested,
    connectionReturn: searchBeforeConnections.current,
  });
  const endWalk = (takeOver = false, restore = true) => {
    if (!walk) return;
    const result = resolveReplayExit(
      savedView.current,
      captureView(),
      draft.shortlist,
      exampleCodes,
      takeOver,
    );
    if (takeOver && walk.kind === "prototype") {
      update({ shortlist: result.selection, groupName: draft.groupName || exampleName });
      setGroupOpen(true);
    }
    if (takeOver && walk.kind === "configuration" && walk.index >= 3)
      update({
        mode: "full",
        workflowIds: [...new Set<WorkflowId>([...draft.workflowIds, "engagement"])],
      });
    if (!takeOver && restore) {
      const view = result.view;
      setF(view.f);
      setLayers(view.layers);
      setAnchor(view.anchor);
      setMode(view.mode);
      setActive(view.active);
      setLeft(view.left);
      setPerson(view.person);
      setService(view.service);
      setLive(view.live);
      setSearchHidden(view.searchHidden);
      setGroupOpen(view.groupOpen);
      setFullDossier(view.fullDossier);
      setOpenWorkflow(view.openWorkflow);
      setInspectedWorkflow(view.inspectedWorkflow);
      setConfigurationStarted(view.configurationStarted);
      setConnectionPath(view.connectionPath);
      setDisabled(view.disabled);
      setMotionRequested(view.motionRequested);
      searchBeforeConnections.current = view.connectionReturn;
    }
    setWalk(null);
    savedView.current = null;
  };
  const beginWalk = () => {
    if (!walk) savedView.current = captureView();
    setExampleCodes([]);
    setExampleName(t("Example enquiry", "Приклад запиту"));
    setWalk({ kind: experience, index: 0, playing: true });
  };
  useEffect(() => {
    if (!walk?.playing || loading) return;
    const length =
      walk.kind === "configuration" ? CONFIGURATION_REPLAY.length : SEARCH_REPLAY.length;
    if (walk.index >= length - 1) {
      setWalk((v) => (v ? { ...v, playing: false } : v));
      return;
    }
    const timer = window.setTimeout(
      () => setWalk((v) => (v ? { ...v, index: v.index + 1 } : v)),
      6500,
    );
    return () => window.clearTimeout(timer);
  }, [walk?.playing, walk?.index, walk?.kind, loading]);
  useEffect(() => {
    if (!walk || loading) return;
    const id = (walk.kind === "configuration" ? CONFIGURATION_REPLAY : SEARCH_REPLAY)[walk.index]
      ?.id;
    setSearchHidden(true);
    setPerson(null);
    setService(null);
    setInspectedWorkflow(null);
    setFullDossier(false);
    setLeft(null);
    if (walk.kind === "configuration") {
      setMode("services");
      setLive(false);
      setAnchor("isrm");
      setGroupOpen(false);
      setF(EMPTY);
      setLeft("workflows");
      if (id === "intro" || id === "core") {
        setInspectedWorkflow("core");
        setOpenWorkflow("core");
        setActive([...CORE_SERVICE_IDS]);
      }
      if (id === "service") {
        setInspectedWorkflow("core");
        setOpenWorkflow("core");
        setActive(["search"]);
        setService("search");
      }
      if (id === "workflow") {
        setInspectedWorkflow("engagement");
        setOpenWorkflow("engagement");
        setActive(workflowServices("engagement", []));
      }
      if (id === "tailor") setOpenWorkflow("own");
      return;
    }
    setMode("people");
    setLive(id === "intro");
    setAnchor("isrm");
    setLayers((v) => ({
      ...v,
      country: true,
      sector: true,
      specialisation: true,
      researchQueue: !!example?.people.some((p) => !p.verified),
    }));
    const first = example?.people[0],
      second = example?.people[1] ?? first;
    if (!first) {
      setWalk((v) => (v ? { ...v, playing: false } : v));
      setLeft("search");
      return;
    }
    const filters = {
      ...EMPTY,
      country: id === "intro" ? "" : first.country,
      sector: walk.index >= 2 ? first.sector : "",
      expertise: walk.index >= 3 && walk.index < 10 ? first.primaryExpertise : "",
    };
    if (walk.index >= 11 && second) {
      filters.country = second.country;
      filters.sector = second.sector;
      filters.expertise = "";
    }
    setF(filters);
    if (walk.index <= 3) setLeft("search");
    if (walk.index >= 4 && walk.index <= 10) setPerson(first.code);
    if (walk.index >= 6 && walk.index <= 9) setFullDossier(true);
    if (walk.index >= 11 && second) {
      setPerson(second.code);
      setAnchor(second.code);
    }
    setExampleCodes(
      walk.index >= 12 ? example.people.map((p) => p.code) : walk.index >= 10 ? [first.code] : [],
    );
    setGroupOpen(walk.index >= 10);
    // Commands are tied to the replay step, not to subsequent manual panel interactions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walk?.index, walk?.kind, loading, example]);
  useEffect(() => {
    if (!walkId) return;
    const panel = root.current?.querySelector<HTMLElement>(".network-right-panel");
    if (!panel) return;
    const field =
      walkId === "full-evidence" ? "evidence" : walkId === "full-expertise" ? "expertise" : null;
    const frame = requestAnimationFrame(() => {
      const target = field
        ? panel.querySelector<HTMLElement>('[data-profile-field="' + field + '"]')
        : walkId === "request" || walkId === "findings"
          ? panel.querySelector<HTMLElement>(".network-research-preview")
          : null;
      if (target)
        panel.scrollTop +=
          target.getBoundingClientRect().top -
          panel.getBoundingClientRect().top -
          parseFloat(getComputedStyle(panel).paddingTop) -
          8;
      else panel.scrollTop = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [walkId, person]);
  const changePackage = (id: PackageId, serviceId: ServiceId, checked: boolean) => {
    setConfigurationStarted(true);
    if (!checked) {
      setExcludePackage(id);
      setExclude(serviceId);
      return;
    }
    update(packageChanges(draft, id, [...packageServiceIds(draft, id), serviceId]));
    setService(serviceId);
    setDisabled((v) => v.filter((s) => s !== serviceId));
  };
  const choose = (id: ServiceId) => {
    setConfigurationStarted(true);
    setInspectedWorkflow(null);
    setInspectionFocus((value) => value + 1);
    if (id === "survey") setSurvey(true);
    setLive(false);
    setDisabled((v) => v.filter((s) => s !== id));
    setActive([id]);
    setMode("services");
    if (mode !== "services") setAnchor("isrm");
    setService(id);
    setPerson(null);
  };
  const activateWorkflow = (id: string) => {
    setConfigurationStarted(true);
    setInspectedWorkflow((current) => (current === id ? null : id));
    setInspectionFocus((value) => value + 1);
    setLive(false);
    setMode("services");
    setActive(workflowServices(id, disabled));
    setAnchor("isrm");
    setPerson(null);
    setService(null);
    setOpenWorkflow(id);
  };
  const chooseAnchor = (id: string) => {
    if (all.some((e) => e.code === id) && !searchBeforeConnections.current)
      searchBeforeConnections.current = { f: { ...f }, anchor, live };
    setLive(false);
    close();
    setAnchor(id);
    setSearchHidden(true);
    if (all.some((e) => e.code === id)) {
      setF(EMPTY);
      if (!all.find((e) => e.code === id)?.verified)
        setLayers((v) => ({ ...v, researchQueue: true }));
    }
    if (id.startsWith("svc:")) {
      setDisabled((v) => v.filter((s) => s !== id.slice(4)));
      setMode("services");
      setActive([id.slice(4) as ServiceId]);
    } else if (id.startsWith("workflow:")) {
      const w = id.slice(9);
      setInspectedWorkflow(w);
      setOpenWorkflow(w);
      setMode("services");
      setActive(workflowServices(w, disabled));
    } else setMode("people");
  };
  const continueSearch = () => {
    setSearchFocus((value) => value + 1);
    const view = searchBeforeConnections.current;
    if (view) {
      setF(view.f);
      setAnchor(view.anchor);
      setLive(view.live);
      searchBeforeConnections.current = null;
    }
    setLeft("search");
    setSearchHidden(false);
    setPerson(null);
    setService(null);
    setMode("people");
  };
  const startComposer = (k: "service" | "workflow") => {
    if (walk) endWalk();
    setKind(k);
    setTitle("");
    setFrame(emptyServiceFrame());
    setSaved(false);
    setAttemptedSave(false);
    setComposer(true);
  };
  useEffect(() => {
    if (!groupFeedback) return;
    const timer = window.setTimeout(() => setGroupFeedback(null), 2400);
    return () => window.clearTimeout(timer);
  }, [groupFeedback]);
  useEffect(() => {
    setMounted(true);
    const screen = matchMedia("(min-width:1100px)");
    const resize = () => {
      setWide(screen.matches);
      setViewportWidth(window.innerWidth);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    if (loading) return;
    if (person && !all.some((e) => e.code === person)) setPerson(null);
    if (anchor !== "isrm" && !model.nodes.some((n) => n.id === anchor)) setAnchor("isrm");
  }, [shown, all, model, person, anchor, loading]);
  const prototypeView = useRef<{
    f: typeof f;
    layers: GraphLayers;
    anchor: string;
    left: typeof left;
    live: boolean;
    groupOpen: boolean;
    searchHidden: boolean;
  } | null>(null);
  useEffect(() => {
    const next: Experience =
      route.stage === "configuration" || route.preset ? "configuration" : "prototype";
    if (next === experience) return;
    const returnView = resolveReplayExit(
      savedView.current,
      captureView(),
      draft.shortlist,
      exampleCodes,
      false,
    ).view;
    if (walk) endWalk(false, false);
    if (next === "configuration") {
      prototypeView.current = returnView;
      close();
      setF(EMPTY);
      setGroupOpen(false);
      setMode("services");
      setLive(false);
      setAnchor("isrm");
      setActive([]);
      setLeft("workflows");
      setSearchHidden(true);
    } else {
      close();
      setMode("people");
      setService(null);
      setActive([]);
      const view = prototypeView.current;
      if (view) {
        setF(view.f);
        setLayers(view.layers);
        setAnchor(view.anchor);
        setLeft(view.left);
        setLive(view.live);
        setGroupOpen(view.groupOpen);
        setSearchHidden(view.searchHidden);
      } else {
        setAnchor("isrm");
        setLive(true);
        setSearchHidden(false);
      }
    }
    setExperience(next);
    // Route changes are explicit experience transitions; routine panel changes are not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.stage, route.preset]);
  useEffect(() => {
    if (route.panel === "shortlist") {
      setGroupOpen(true);
      setLeft(null);
      setSearchHidden(true);
    } else if (route.panel === "search") setLeft("search");
  }, [route.panel]);
  useEffect(() => {
    if (!route.anchor || loading) return;
    setLive(false);
    setF(EMPTY);
    if (all.some((e) => e.code === route.anchor && !e.verified))
      setLayers((v) => ({ ...v, researchQueue: true }));
    setAnchor(route.anchor);
    setSearchHidden(true);
  }, [route.anchor, setF, loading, all]);
  useEffect(() => {
    if (!route.preset) return;
    setLive(false);
    if (CLIENT_WORKFLOWS.some((w) => w.id === route.preset)) {
      setLeft("workflows");
      const w = route.preset;
      setMode("services");
      setActive(workflowServices(w, []));
      setAnchor("isrm");
      setOpenWorkflow(w);
    }
  }, [route.preset]);
  useEffect(() => {
    if (experience !== "configuration" || !route.capability) return;
    const capability = CLIENT_SERVICES.find((item) => item.id === route.capability);
    if (capability) {
      setLeft("workflows");
      choose(capability.id);
    }
    // This is an explicit route handoff, not an effect of ordinary service inspection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.capability, experience]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const header = el.querySelector<HTMLElement>(".shared-client-header"),
      dashboard = el.querySelector<HTMLElement>(".network-dashboard");
    if (!header || !dashboard) return;
    const rail = el.querySelector<HTMLElement>(".network-bottom-rail");
    const controls = el.querySelector<HTMLElement>(".network-concentrators");
    const measure = () => {
      const tab = header.querySelector<HTMLElement>(".client-journey-tabs > a");
      if (wide && tab) {
        const rect = tab.getBoundingClientRect();
        const column = Math.max(220, Math.min(560, Math.round(rect.width)));
        setPanelInset(Math.max(0, Math.round(rect.left - el.getBoundingClientRect().left)));
        setPanelWidths((current) => {
          const next = { ...current };
          for (const key of ["search", "profile", "shortlist"] as const)
            if (!resizedPanels.current.has(key)) next[key] = column;
          return Object.keys(next).some(
            (key) => next[key as keyof StackWidths] !== current[key as keyof StackWidths],
          )
            ? next
            : current;
        });
      }
      const top = header.offsetHeight + dashboard.offsetHeight;
      el.style.setProperty("--network-controls-top", `${top}px`);
      el.style.setProperty(
        "--network-header-bottom",
        `${top + (controls?.offsetHeight ?? 0) + 12}px`,
      );
      if (rail?.offsetHeight)
        el.style.setProperty("--network-rail-height", `${rail.offsetHeight}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    ro.observe(dashboard);
    if (rail) ro.observe(rail);
    if (controls) ro.observe(controls);
    return () => ro.disconnect();
  }, [wide, panelOpen]);
  const personServiceInspection = (
    <>
      {selected && (
        <aside
          className={`network-paper-panel network-right-panel ${dossierFull ? "is-full-dossier" : ""}`}
          aria-label={
            dossierFull
              ? t("Full person dossier", "Повне досьє персони")
              : t("Person dossier", "Досьє персони")
          }
        >
          {experience === "configuration" ? (
            <>
              <h2>{selected.displayName}</h2>
              <p>{selected.primaryExpertise}</p>
              <p className="network-panel-note">
                {t(
                  "Illustrative audience profile. Coverage does not establish actual use, entitlement or participation. Switch to the prototype to review and shortlist expertise.",
                  "Профіль можливої аудиторії. Охоплення не підтверджує користування, право доступу чи участь. Для дослідження й відбору експертизи перейдіть до прототипу.",
                )}
              </p>
              <Link
                className="network-context-action"
                to="/"
                search={{ view: "map", anchor: selected.code }}
              >
                {t("Review in the prototype", "Переглянути у прототипі")}
              </Link>
            </>
          ) : (
            <>
              <NetworkProfile
                expert={selected}
                example={!!walk}
                uk={uk}
                full={dossierFull}
                onFull={(full) => {
                  setFullDossier(full);
                  setPanelWidths((current) => ({
                    ...current,
                    profile: full ? 560 : Math.max(220, Math.round((viewportWidth - 40) / 4)),
                  }));
                }}
                shortlisted={selectedCodes.includes(selected.code)}
                ready={ready}
                onToggle={() => {
                  const removing = selectedCodes.includes(selected.code);
                  const shortlist = removing
                    ? selectedCodes.filter((code) => code !== selected.code)
                    : [...selectedCodes, selected.code];
                  if (walk?.kind === "prototype") setExampleCodes(shortlist);
                  else update({ shortlist });
                  setGroupOpen(true);
                  setGroupFeedback(
                    removing
                      ? t("Removed from your group · −1", "Прибрано з вашої групи · −1")
                      : t("Added to your group · +1", "Додано до вашої групи · +1"),
                  );
                }}
                onGroup={() => setGroupOpen(true)}
                onConnections={() => chooseAnchor(selected.code)}
                replayResearch={
                  walkId === "request" ? "request" : walkId === "findings" ? "findings" : undefined
                }
                highlight={
                  walkId === "full-expertise"
                    ? "expertise"
                    : walkId === "full-evidence"
                      ? "evidence"
                      : undefined
                }
              />
            </>
          )}
        </aside>
      )}
      {selectedService && (
        <aside
          className="network-paper-panel network-right-panel"
          aria-label={t("Service dossier", "Опис сервісу")}
        >
          <h2>{selectedService.title[locale]}</h2>
          <details className="network-service-description" open>
            <summary>{t("How this would help", "Як це допоможе")}</summary>
            <p>{selectedService.detail[locale]}</p>
          </details>
          <NetworkServiceDependencies
            id={selectedService.id}
            locale={locale}
            expanded={wide && layout.profile >= 460}
          />
          {service === "survey" && (
            <button
              className="network-context-action"
              onClick={() => {
                if (walk) endWalk();
                setSurvey(true);
              }}
            >
              {t("Open the questionnaire", "Відкрити опитувальник")}
            </button>
          )}
          <small>{selectedService.status[locale]}</small>
          <button
            className="network-context-action"
            onClick={() => {
              startComposer("service");
              setTitle(selectedService.title[locale]);
            }}
          >
            {t("Suggest a change to this capability", "Запропонувати зміну цієї функції")}
          </button>
          <p className="network-panel-note">
            {t(
              "Illustrative audience bands show potential overlapping coverage. They are not actual assignments or inferred interests.",
              "Умовні групи аудиторії показують можливе перехресне охоплення. Це не реальні призначення й не припущення про інтереси персон.",
            )}
          </p>
          {service === "contact" && (
            <>
              <button
                className="network-folder-button"
                onClick={() => {
                  if (walk) endWalk();
                  setMailing(true);
                }}
              >
                {t("Prepare a mailing list", "Скласти список розсилки")}
              </button>
              <button
                className="network-folder-button"
                onClick={() => {
                  if (walk) endWalk();
                  setSurvey(true);
                }}
              >
                {t("View the member questionnaire", "Переглянути опитувальник членів")}
              </button>
            </>
          )}
          <button
            className="network-folder-button"
            onClick={() => {
              close();
              setLeft("workflows");
            }}
          >
            {t("Back to workflows", "До workflow")}
          </button>
          <button
            className="network-folder-button"
            onClick={() => {
              if (walk) endWalk();
              setExcludePackage(null);
              setExclude(service);
            }}
          >
            {t("Remove from proposed scope", "Вилучити із запропонованого обсягу")}
          </button>
        </aside>
      )}
    </>
  );
  const backButton = (
    <button
      className="graph-return-tab"
      onClick={() => {
        setInspectedWorkflow(null);
        close();
        setGroupOpen(false);
        setSearchHidden(true);
      }}
      aria-label={t("Show graph", "Показати граф")}
      title={t("Show graph", "Показати граф")}
    >
      <Network size={21} />
    </button>
  );
  return (
    <main
      ref={root}
      className={`client-network-page network-workbench is-${experience} ${panelOpen ? "has-panel" : ""} ${groupOpen ? "has-shortlist-tray" : ""} ${walk ? "has-replay" : ""}`}
      style={
        {
          "--network-inspection-width": `${layout.width}px`,
          "--network-left-space": `${wide ? layout.width + (layout.width ? panelInset : 0) : 0}px`,
          "--network-dock-left": `${wide ? panelInset : 0}px`,
        } as CSSProperties
      }
      data-replay-step={walkId}
      onPointerDownCapture={(event) => {
        if (
          walk?.playing &&
          !(event.target as HTMLElement).closest(
            ".network-replay-coach,.network-replay-invite,.network-survey-link",
          )
        )
          setWalk({ ...walk, playing: false });
      }}
    >
      <div
        className={`network-canvas ${leftPanelVisible ? "has-left-panel" : ""} ${rightPanelVisible ? "has-right-panel" : ""} ${persistentSearch ? "has-search-rail" : ""}`}
        style={
          wide ? { left: layout.width + (layout.width ? panelInset : 0), right: 0 } : undefined
        }
      >
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph
              experts={shown}
              layers={layers}
              referenceSelection={selection}
              locale={locale}
              focus={person}
              onFocus={(code) => {
                setInspectionFocus((value) => value + 1);
                setService(null);
                setFullDossier(false);
                if (code) setPerson(code);
                else {
                  close();
                  setGroupOpen(false);
                  setInspectedWorkflow(null);
                  setSearchHidden(true);
                }
              }}
              serviceMode={mode === "services"}
              live={live}
              activeServiceIds={graphServices}
              highlightedService={service}
              coachNode={walk ? person || anchor : null}
              highlightedPath={connectionPath}
              onServiceExclude={(id) => {
                if (walk) endWalk();
                setExcludePackage(null);
                setExclude(id as ServiceId);
              }}
              onServiceSelect={(id) => choose(id as ServiceId)}
              onWorkflowSelect={activateWorkflow}
              workflowInfoId={openWorkflow && openWorkflow !== "own" ? openWorkflow : null}
              showConnectionPath={experience === "prototype"}
              onWorkflowDismiss={() => setInspectedWorkflow(null)}
              workflowHint={
                experience === "configuration" && inspectedWorkflow ? (
                  <NetworkWorkflowHint
                    id={inspectedWorkflow}
                    locale={locale}
                    onClose={() => setInspectedWorkflow(null)}
                    onService={choose}
                    disabled={!ready || !!walk}
                    selected={draft.workflowIds.includes(inspectedWorkflow as WorkflowId)}
                    onSelect={(checked) =>
                      update({
                        mode: "full",
                        workflowIds: checked
                          ? [...new Set([...draft.workflowIds, inspectedWorkflow as WorkflowId])]
                          : draft.workflowIds.filter((id) => id !== inspectedWorkflow),
                      })
                    }
                  />
                ) : null
              }
              onPath={(ids) => {
                setConnectionPath(ids);
                if (ids.length) {
                  setAnchor("isrm");
                  setLive(false);
                }
              }}
              onVisibleCount={setVisible}
              anchor={anchor}
              onAnchor={chooseAnchor}
              warningService={exclude}
              warningPeopleIds={exclusionImpact}
              disabledServiceIds={disabled}
              motionPaused={!motionRequested}
            />
          </Suspense>
        )}
        {!loading && shown.length === 0 && (
          <p className="network-empty-summary" role="status">
            {t(
              "No profiles recorded for this selection in the accessible sample.",
              "За цим вибором у доступній вибірці профілів не зафіксовано.",
            )}
          </p>
        )}
      </div>
      <ClientHeader />
      <div className={`network-dashboard ${persistentSearch ? "has-search-rail" : ""}`}>
        <div className="network-panel-heading network-left-heading">
          {leftPanelVisible && (
            <>
              <h2>
                {left === "workflows"
                  ? t("Capability configurator", "Конфігуратор функціональності")
                  : left === "shortlist"
                    ? t("Your shortlist", "Ваш shortlist")
                    : t("Search", "Пошук")}
              </h2>
              {backButton}
            </>
          )}
        </div>
        <nav
          className="network-dashboard-navigation"
          aria-label={t("Current view and selection", "Поточний вигляд і відбір")}
        >
          <div className="network-metrics" aria-live="polite">
            <span>
              <strong className="network-metric-number" key={visible}>
                {visible}
              </strong>
              {t("visible", "видимо")}
            </span>
            <span>
              <strong className="network-metric-number" key={count}>
                {count}
              </strong>
              {mode === "services"
                ? t("service coverage", "охоплено сервісом")
                : t("matched", "знайдено")}
            </span>
            {experience === "prototype" && (
              <button
                className={`network-shortlist-trigger ${groupFeedback ? "has-feedback" : ""}`}
                onClick={openShortlist}
                aria-label={t("Open shortlist", "Відкрити shortlist")}
              >
                <strong className="network-metric-number" key={selectedCodes.length}>
                  {selectedCodes.length}
                </strong>
                {t("in your group", "у вашій групі")}
              </button>
            )}
            {groupFeedback && (
              <span className="network-group-feedback" role="status">
                {groupFeedback}
              </span>
            )}
          </div>
        </nav>
        <div className="network-panel-heading network-right-heading">
          {(selected || selectedService) && (
            <>
              <h2>
                {selected
                  ? `${t("Dossier", "Досьє")} · ${selected.code}`
                  : t("Service capability", "Сервісна функціональність")}
              </h2>
              {backButton}
            </>
          )}
        </div>
      </div>
      {(!panelOpen || wide) && (
        <div
          className={`network-concentrators ${leftPanelVisible ? "has-left-panel" : ""} ${rightPanelVisible ? "has-right-panel" : ""} ${persistentSearch ? "has-search-rail" : ""}`}
          style={
            wide
              ? { left: layout.width + (layout.width ? panelInset : 0) + 12, right: 12 }
              : undefined
          }
        >
          <NetworkConcentrator
            nodes={
              experience === "prototype"
                ? model.nodes.filter((n) => !["service", "workflow"].includes(n.kind))
                : model.nodes
            }
            value={anchor}
            configuration={experience === "configuration"}
            onFindPerson={
              experience === "prototype"
                ? (query) => {
                    structure();
                    setF({ ...EMPTY, q: query });
                    setLeft("search");
                    setSearchHidden(false);
                  }
                : undefined
            }
            onChange={chooseAnchor}
            uk={uk}
          />
          <button
            className="network-live-control"
            aria-pressed={live}
            onClick={() => {
              if (live) structure();
              else {
                lastStructured.current = { anchor, mode, active: [...active] };
                close();
                setSearchHidden(true);
                setMode("people");
                setAnchor("isrm");
                setMotionRequested(true);
                setLive(true);
              }
            }}
          >
            {t("Live graph", "Живий граф")}
          </button>
          {live && (
            <button
              className="network-motion-control"
              aria-pressed={motionRequested}
              aria-label={
                motionRequested
                  ? t("Pause graph motion", "Призупинити рух графа")
                  : t("Animate live graph", "Увімкнути рух живого графа")
              }
              title={
                motionRequested
                  ? t("Pause graph motion", "Призупинити рух графа")
                  : t("Animate live graph", "Увімкнути рух живого графа")
              }
              onClick={() => setMotionRequested((value) => !value)}
            >
              {motionRequested ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
          <span className="network-experience-purpose">
            {experience === "prototype"
              ? t(
                  "Interactive prototype · find, review and retain expertise",
                  "Інтерактивний прототип · знайти, перевірити й відібрати експертизу",
                )
              : t(
                  "Capability configurator · choose services for your proposal",
                  "Конфігуратор · обрати сервіси для пропозиції",
                )}
          </span>
          <span className="network-interaction-hint">
            {live
              ? !motionRequested
                ? t(
                    "Paused. Drag nodes manually or press Play; search returns to the structured view.",
                    "Рух призупинено. Тягніть вузли вручну або натисніть Play; пошук повертає структуру.",
                  )
                : t(
                    "Drag nodes to explore; a search choice returns to the structured view.",
                    "Тягніть вузли; вибір у пошуку повертає структурований вигляд.",
                  )
              : anchor !== "isrm"
                ? t(
                    "Connections within two steps · shared records, not personal introductions.",
                    "Зв’язки у межах двох кроків · спільні записи, не особисті знайомства.",
                  )
                : t(
                    "Hover to see direct connections; zoom in for names. Select a node for details.",
                    "Наведіть для назви; оберіть вузол для опису. Центрування — окрема дія.",
                  )}
          </span>
        </div>
      )}
      <NetworkInspectionDock
        searchKey={searchFocus}
        searchLabel={
          experience === "configuration" ? t("Configurator", "Конфігуратор") : t("Search", "Пошук")
        }
        onCloseSearch={() => {
          setLeft(null);
          setSearchHidden(true);
        }}
        search={
          experience === "configuration" && left === "workflows" ? (
            <aside
              className="network-paper-panel network-left-panel"
              aria-label={t("Service capabilities", "Сервісна функціональність")}
            >
              <p className="network-panel-note">
                {t(
                  "Choose the services that would support your work. Read a description, adjust the selection or describe your own requirement. Your choices shape a proposal; they do not activate services.",
                  "Оберіть сервіси для вашої роботи. Прочитайте опис, змініть вибір або опишіть власну потребу. Вибір формує пропозицію, а не активує сервіси.",
                )}
              </p>
              <button
                className="network-service-tab network-add-request"
                onClick={() => startComposer("workflow")}
              >
                <Plus size={18} />
                {t("Describe your own requirement", "Описати власну потребу")}
              </button>
              <button
                className="network-context-action network-survey-entry"
                onClick={() => {
                  if (walk) endWalk();
                  setSurvey(true);
                }}
              >
                {t(
                  "Member & Board questionnaire · view draft",
                  "Опитувальник членів і правління · переглянути",
                )}
              </button>
              <NetworkCapabilityTree
                draft={
                  walk?.kind === "configuration"
                    ? {
                        ...draft,
                        packageServices: {},
                        workflowIds: walk.index >= 3 ? ["engagement"] : [],
                      }
                    : draft
                }
                locale={locale}
                onService={choose}
                disabled={!ready || !!walk}
                onToggle={(id, checked) => {
                  if (checked) changePackage("core", id, true);
                  else {
                    setExcludePackage(null);
                    setExclude(id);
                  }
                }}
              />
              {walk?.kind === "configuration" && walkId === "result" && (
                <section className="network-example-proposal">
                  <h3>{t("Example proposal selection", "Приклад позицій пропозиції")}</h3>
                  <p>
                    {t("Core service capabilities", "Сервісна функціональність ядра")} ·{" "}
                    {indicativePriceLabel(CLIENT_APPROVED_PRICES.base, locale)}
                  </p>
                  <p>
                    {t("Engagement cycle", "Цикл залучення")} ·{" "}
                    {indicativePriceLabel(CLIENT_APPROVED_PRICES.engagement, locale)}
                  </p>
                  <small>
                    {t(
                      "Existing indicative development estimates, subject to an agreed specification. This example is not saved unless you choose to use it.",
                      "Наявні індикативні оцінки розробки за погодженим ТЗ. Приклад не зберігається без вашого вибору.",
                    )}
                  </small>
                  <Link
                    className="network-context-action"
                    to="/scope"
                    onClick={() => endWalk(true)}
                  >
                    {t(
                      "Use this selection and review scope",
                      "Взяти цей вибір і переглянути обсяг",
                    )}
                  </Link>
                </section>
              )}
              <section className="network-workflow-folder">
                <button
                  className="network-folder-button"
                  onClick={() => setOpenWorkflow((v) => (v === "own" ? null : "own"))}
                  aria-expanded={openWorkflow === "own"}
                >
                  {t("Future development / add your own", "Майбутні розробки / додати своє")}
                  {openWorkflow === "own" ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openWorkflow === "own" && (
                  <div className="network-folder-content">
                    <button
                      className="network-service-tab"
                      onClick={() => startComposer("workflow")}
                    >
                      {t("Describe a process or workflow", "Описати процес або workflow")}
                    </button>
                    <button
                      className="network-service-tab"
                      onClick={() => startComposer("service")}
                    >
                      {t("Describe a service or capability", "Описати сервіс або функціональність")}
                    </button>
                    {walk?.kind === "configuration" && walkId === "tailor" && (
                      <div className="network-example-frame">
                        <h3>{t("Example requirement frame", "Приклад шаблону потреби")}</h3>
                        {SERVICE_FRAME_FIELDS.map((field) => (
                          <p key={field.id}>
                            <strong>{uk ? field.uk : field.en}</strong>
                            <br />
                            <small>{uk ? field.helpUk : field.helpEn}</small>
                          </p>
                        ))}
                        <p>
                          {t(
                            "Fill this form in your own words after taking over; it becomes a separate proposal item.",
                            "Переберіть керування й заповніть шаблон своїми словами; він стане окремою позицією пропозиції.",
                          )}
                        </p>
                      </div>
                    )}
                    {draft.requests.map((r) => (
                      <article key={r.id}>
                        <strong>{r.title}</strong>
                        <p>{r.description}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </aside>
          ) : experience === "prototype" && leftPanelVisible ? (
            <aside
              className={`network-paper-panel network-left-panel ${persistentSearch ? "is-persistent-search" : ""}`}
              aria-label={t("Search panel", "Панель пошуку")}
            >
              <fieldset className="network-layer-switch">
                <legend>{t("View connections by", "Показати зв’язки за")}</legend>
                {(
                  [
                    ["organization", "People + organisations", "Персони та організації"],
                    ["hub", "Professional role / chapter", "Професійна роль / чаптер"],
                    ["rank", "Recorded review status", "Зафіксований статус перевірки"],
                    ["specialisation", "Specialisation / expertise", "Спеціалізація / експертиза"],
                    ["sector", "Economic sectors", "Сектори економіки"],
                    ["theme", "Experience themes", "Тематики досвіду"],
                    ["country", "Countries / territories", "Країни / території"],
                    ["researchQueue", "Awaiting review", "Очікують перевірки"],
                    ["services", "ISRM application services", "Сервіси застосунку ISRM"],
                  ] as const
                )
                  .filter(([id]) => id !== "services")
                  .map(([id, en, ua]) => (
                    <label key={id} data-layer-id={id}>
                      <input
                        type="checkbox"
                        checked={!!layers[id]}
                        onChange={(e) => {
                          structure();
                          setLayers({ ...layers, [id]: e.target.checked });
                          if (id === "services") {
                            setMode(e.target.checked ? "services" : "people");
                            setAnchor("isrm");
                            setActive([]);
                            setPerson(null);
                            setService(null);
                          }
                        }}
                      />
                      {t(en, ua)}
                    </label>
                  ))}
              </fieldset>
              <p className="network-panel-note">
                {t(
                  "Explore recorded coverage and reference categories, including those with no matching profiles.",
                  "Переглядайте наявні записи й категорії довідника, зокрема ті, для яких профілів ще немає.",
                )}
              </p>
              <details className="network-refine-fields" open={left === "search"}>
                <summary>{t("Refine the search", "Уточнити пошук")}</summary>
                <FilterBar
                  experts={referenceExperts}
                  f={f}
                  setF={(value) => {
                    structure();
                    searchBeforeConnections.current = null;
                    setF(value);
                  }}
                  compact
                  showResearchQueue={false}
                  includeReference
                />
              </details>
              <button className="network-folder-button" onClick={close}>
                {t("Show results", "Показати результати")} · {shown.length}
              </button>
              <details className="network-profile-list">
                <summary>{t("Profiles · keyboard access", "Профілі · вибір з клавіатури")}</summary>
                {shown.map((p) => (
                  <button key={p.code} onClick={() => inspectPerson(p.code)}>
                    {p.displayName}
                  </button>
                ))}
              </details>
            </aside>
          ) : null
        }
        profileKey={person || service ? `${person || service}:${inspectionFocus}` : null}
        layout={layout}
        onWidth={setWidth}
        onCloseProfile={() => {
          setPerson(null);
          setService(null);
        }}
        auxiliaryLabel={undefined}
        profileLabel={experience === "configuration" ? t("Service", "Сервіс") : undefined}
        onCloseShortlist={() =>
          experience === "configuration" ? (setService(null), setPerson(null)) : setGroupOpen(false)
        }
        onGraph={() => {
          setInspectedWorkflow(null);
          close();
          setGroupOpen(false);
          setSearchHidden(true);
        }}
        uk={uk}
        auxiliaryKey={
          experience === "configuration" && (service || person)
            ? `${service || person}:${inspectionFocus}`
            : null
        }
        profile={selected || selectedService ? personServiceInspection : null}
        shortlist={
          experience === "prototype" && groupOpen ? (
            <NetworkShortlist
              people={all}
              codes={selectedCodes}
              name={walk?.kind === "prototype" ? exampleName : draft.groupName}
              onName={(name) =>
                walk?.kind === "prototype" ? setExampleName(name) : update({ groupName: name })
              }
              expanded={wide && layout.shortlist >= 460}
              onExpand={() => setWidth("shortlist", layout.shortlist >= 460 ? 330 : 560)}
              onInspect={inspectPerson}
              onRemove={(code) =>
                walk?.kind === "prototype"
                  ? setExampleCodes((v) => v.filter((id) => id !== code))
                  : update({ shortlist: draft.shortlist.filter((id) => id !== code) })
              }
              onRestore={(shortlist, groupName) => update({ shortlist, groupName })}
              onClose={() => setGroupOpen(false)}
              onSearch={continueSearch}
              uk={uk}
              example={walk?.kind === "prototype"}
              disabled={!ready}
            />
          ) : null
        }
      />
      <footer className="network-bottom-rail">
        <div
          className="network-legend"
          aria-label={t("Graph legend", "Легенда графа")}
          title={t(
            "Legend · these symbols describe node types",
            "Легенда · ці символи пояснюють типи вузлів",
          )}
        >
          <small>{t("Legend", "Легенда")}</small>
          <span>
            <Users size={14} />
            {t("Person", "Персона")}
          </span>
          <span>
            <Building2 size={14} />
            {t("Organisation", "Організація")}
          </span>
          <span>
            <Layers size={14} />
            {t("Service", "Сервіс")}
          </span>
          <span>
            <GitBranch size={14} />
            Workflow
          </span>
          <span>○ {t("Concentrator", "Концентратор")}</span>
          <span className="network-demo-label">
            {t("Demonstration · supplied sample", "Демонстрація · передана вибірка")}
          </span>
          <button
            className="network-survey-link"
            onClick={() => {
              if (walk) endWalk();
              setSurvey(true);
            }}
          >
            {t("Questionnaire", "Опитувальник")}
          </button>
          <NetworkWalkthrough
            host={root}
            state={walk}
            experience={experience}
            onStart={beginWalk}
            onChange={setWalk}
            onClose={() => endWalk()}
            onTakeOver={() => endWalk(true)}
            uk={uk}
            available={!!example}
          />
          <DataUseNotice compact />
        </div>
        <nav
          className="client-network-dock network-two-tabs"
          aria-label={t("Current workspace actions", "Дії поточного режиму")}
        >
          {experience === "prototype" ? (
            <>
              <button
                aria-pressed={left === "search" || persistentSearch}
                onClick={() => {
                  const opening = !(left === "search" || persistentSearch);
                  close();
                  setSearchHidden(!opening);
                  setMode("people");
                  if (opening) continueSearch();
                  else setLeft(null);
                }}
              >
                <Search size={25} />
                {t("Search", "Пошук")}
              </button>
              <button aria-pressed={groupOpen} onClick={openShortlist}>
                <Users size={25} />
                {t("Your shortlist", "Ваш відбір")} · {selectedCodes.length}
              </button>
            </>
          ) : (
            <>
              <button
                aria-pressed={left === "workflows"}
                onClick={() => {
                  const opening = left !== "workflows";
                  close();
                  setLeft(opening ? "workflows" : null);
                  setSearchHidden(true);
                  setMode("services");
                }}
              >
                <GitBranch size={25} />
                {t("Service capabilities", "Сервісна функціональність")}
              </button>
              <button onClick={() => startComposer("workflow")}>
                <Plus size={25} />
                {t("Describe what you need", "Опишіть вашу потребу")}
              </button>
            </>
          )}
        </nav>
      </footer>
      <Dialog open={!!exclude} onOpenChange={(o) => !o && setExclude(null)}>
        <DialogContent
          className="client-request-dialog network-dialog"
          closeIcon={<Network size={19} />}
          closeLabel={t("Return to graph", "Повернутися до графа")}
        >
          <DialogHeader>
            <DialogTitle>
              {t(
                "Remove this capability from the proposed composition?",
                "Вилучити функціональність із запропонованого складу?",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                "This changes your proposed scope. No live message, invitation or service is cancelled. Changed packages require a revised estimate. People who retain another selected service remain covered in the illustration.",
                "Це змінює запропонований обсяг. Повідомлення, запрошення чи діючі сервіси не скасовуються. Змінені пакети потребують переоцінки. Персони з іншим обраним сервісом залишаються охопленими в ілюстрації.",
              )}
            </DialogDescription>
          </DialogHeader>
          <p>{CLIENT_SERVICES.find((s) => s.id === exclude)?.detail[locale]}</p>
          <p>
            {t(
              "Illustrative profiles left without a selected service: ",
              "Профілів без обраного сервісу в ілюстрації: ",
            )}
            {exclusionImpact.length}
          </p>
          <div className="client-inline-actions">
            <button className="client-button" onClick={() => setExclude(null)}>
              {t("Keep the capability", "Залишити функціональність")}
            </button>
            <button
              className="client-text-button"
              onClick={() => {
                if (exclude) {
                  const changes = excludeServiceChanges(draft, exclude, excludePackage);
                  const stillIncluded = selectedServiceIds({ ...draft, ...changes }).includes(
                    exclude,
                  );
                  update(changes);
                  setDisabled((v) =>
                    stillIncluded
                      ? v.filter((id) => id !== exclude)
                      : [...new Set([...v, exclude])],
                  );
                  setActive((v) => (stillIncluded ? v : v.filter((s) => s !== exclude)));
                  setService(null);
                  setAnchor("isrm");
                }
                setExclude(null);
              }}
            >
              {t("Remove from proposed scope", "Вилучити із запропонованого обсягу")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={composer}
        onOpenChange={(o) => {
          setComposer(o);
          if (!o) close();
        }}
      >
        <DialogContent
          className="client-request-dialog network-dialog"
          closeIcon={<Network size={19} />}
          closeLabel={t("Return to graph", "Повернутися до графа")}
        >
          <DialogHeader>
            <DialogTitle>{t("Describe what you need", "Опишіть вашу потребу")}</DialogTitle>
            <DialogDescription>
              {t(
                "Your description will be included in scope and in the same proposal request used for email and PDF.",
                "Опис потрапить до scope та спільного запиту для листа й PDF.",
              )}
            </DialogDescription>
          </DialogHeader>
          <form
            noValidate
            onChange={() => setSaved(false)}
            onSubmit={(e) => {
              e.preventDefault();
              setAttemptedSave(true);
              const missing = missingRequirementFields(title, frame);
              if (missing.length || !ready) {
                document.getElementById("requirement-" + missing[0])?.focus();
                return;
              }
              update({
                requests: [
                  ...draft.requests,
                  {
                    id: crypto.randomUUID(),
                    kind,
                    title: title.trim(),
                    description: serviceFrameText(frame, locale),
                  },
                ],
                customIncluded: true,
              });
              setSaved(true);
            }}
          >
            <label>
              {t("Requirement type", "Тип потреби")}
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as "service" | "workflow")}
              >
                <option value="workflow">{t("Process / workflow", "Процес / workflow")}</option>
                <option value="service">
                  {t("Service / capability", "Сервіс / функціональність")}
                </option>
              </select>
            </label>
            <label>
              {t("Title", "Назва")} *
              <input
                id="requirement-title"
                aria-invalid={attemptedSave && !title.trim()}
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            {SERVICE_FRAME_FIELDS.map((field) => (
              <label key={field.id}>
                {field[locale]}
                {field.id === "need" || field.id === "outcome" ? " *" : ""}
                <small>{uk ? field.helpUk : field.helpEn}</small>
                <textarea
                  id={"requirement-" + field.id}
                  aria-invalid={
                    attemptedSave &&
                    (field.id === "need" || field.id === "outcome") &&
                    !frame[field.id].trim()
                  }
                  rows={field.rows}
                  required={field.id === "need" || field.id === "outcome"}
                  value={frame[field.id]}
                  onChange={(event) => {
                    setFrame((current) => ({ ...current, [field.id]: event.target.value }));
                    setSaved(false);
                  }}
                />
              </label>
            ))}
            <div className="network-requirement-submit">
              {draftError && <p role="alert">{draftError}</p>}
              {attemptedSave && missingRequirementFields(title, frame).length > 0 && (
                <p role="alert">
                  {t("Please complete the required fields: ", "Заповніть обов’язкові поля: ")}
                  {missingRequirementFields(title, frame)
                    .map((id) =>
                      id === "title"
                        ? t("Title", "Назва")
                        : SERVICE_FRAME_FIELDS.find((field) => field.id === id)![locale],
                    )
                    .join("; ")}
                </p>
              )}
              {saved ? (
                <div role="status">
                  <p>{t("Added to your scope draft.", "Додано до чернетки scope.")}</p>
                  <button type="button" onClick={() => startComposer(kind)}>
                    {t("Describe another", "Описати наступне")}
                  </button>
                  <Link to="/scope">{t("Review scope", "Переглянути scope")}</Link>
                </div>
              ) : (
                <button className="client-button" type="submit" disabled={!ready}>
                  {t("Save to scope", "Зберегти до scope")}
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={mailing} onOpenChange={setMailing}>
        <DialogContent
          className="client-request-dialog network-dialog"
          closeIcon={<Network size={19} />}
          closeLabel={t("Return to graph", "Повернутися до графа")}
        >
          <DialogHeader>
            <DialogTitle>
              {t(
                "Include permission-based network mailing?",
                "Включити розсилку з урахуванням дозволів?",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Add this requirement to the scope discussion. The demonstration will not send messages or export private contact details.",
                "Додайте цю вимогу до обговорення обсягу. Демонстрація не надсилатиме повідомлень і не експортуватиме приватних контактів.",
              )}
            </DialogDescription>
          </DialogHeader>
          <Link
            className="client-button"
            to="/scope"
            onClick={() => {
              if (!draft.requests.some((r) => r.id === "network-mailing"))
                update({
                  requests: [
                    ...draft.requests,
                    {
                      id: "network-mailing",
                      kind: "service",
                      title: t(
                        "Permission-based network mailing and member survey",
                        "Розсилка з урахуванням дозволів та опитування членів",
                      ),
                      description: t(
                        "Define recipient groups, access permissions, sender approval and an agreed member or Board questionnaire. Delivery integrations and costs require separate agreement.",
                        "Визначити групи одержувачів, рівні доступу, погодження відправника та опитування членів або правління. Інтеграція надсилання й витрати погоджуються окремо.",
                      ),
                    },
                  ],
                  customIncluded: true,
                });
            }}
          >
            {t("Add & review scope and limits", "Додати та перейти до scope й лімітів")}
          </Link>
        </DialogContent>
      </Dialog>
      <Dialog open={survey} onOpenChange={setSurvey}>
        <DialogContent
          className="client-request-dialog network-dialog"
          closeIcon={<Network size={19} />}
          closeLabel={t("Return to graph", "Повернутися до графа")}
        >
          <DialogHeader>
            <DialogTitle>
              {t("Community member survey · draft", "Опитування членів спільноти · проєкт")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Preview of the existing draft questionnaire, not a live survey.",
                "Перегляд наявного проєкту опитувальника, не запущене опитування.",
              )}
            </DialogDescription>
          </DialogHeader>
          <MemberSurveyPreview locale={locale} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
