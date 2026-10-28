import { NetworkConcentrator } from "./NetworkConcentrator";
import { NetworkGuide } from "./NetworkGuide";
import { GUIDE_STEPS } from "@/lib/network-guide";
import { NetworkServiceDependencies, NetworkWorkflowDescription } from "./NetworkDescriptions";
import {
  SERVICE_FRAME_FIELDS,
  emptyServiceFrame,
  serviceFrameText,
} from "@/lib/service-request-frame";
import { MemberSurveyPreview } from "./MemberSurveyPreview";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
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
    { draft, update, ready } = useClientDraft();
  const route = useSearch({ strict: false }) as {
    panel?: string;
    stage?: string;
    preset?: string;
    anchor?: string;
  };
  const root = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(false);
  const [guideStep, setGuideStep] = useState<number | null>(null);
  const guidePerson = useRef<string | null>(null);
  const [live, setLive] = useState(!route.anchor && !route.stage && !route.preset);
  const [motionRequested, setMotionRequested] = useState(true);
  const [searchHidden, setSearchHidden] = useState(false);
  const [left, setLeft] = useState<"search" | "workflows" | "shortlist" | null>(
    route.panel === "shortlist"
      ? "shortlist"
      : route.panel === "search"
        ? "search"
        : route.stage === "configuration"
          ? "workflows"
          : null,
  );
  const [shortlistSide, setShortlistSide] = useState<"left" | "right">("left");
  const [groupFeedback, setGroupFeedback] = useState<string | null>(null);
  const [mode, setMode] = useState<"people" | "services">(
    route.stage === "configuration" ? "services" : "people",
  );
  const [f, setF] = useFilters();
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
  const lastStructured = useRef({ anchor, mode, active });
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
    filtered = useMemo(() => applyFilters(all, f), [all, f]);
  const shown = useMemo(
    () => filtered.filter((e) => e.verified || layers.researchQueue),
    [filtered, layers.researchQueue],
  );
  const referenceExperts = useMemo(
    () => all.filter((expert) => expert.verified || layers.researchQueue),
    [all, layers.researchQueue],
  );
  const selected = shown.find((e) => e.code === person),
    selectedService = CLIENT_SERVICES.find((s) => s.id === service);
  const persistentSearch =
    wide && !searchHidden && mode === "people" && !left && !selected && !service;
  const leftPanelVisible = !!(
    (left && !(left === "shortlist" && shortlistSide === "right")) ||
    persistentSearch
  );
  const rightPanelVisible = !!(
    selected ||
    service ||
    (left === "shortlist" && shortlistSide === "right")
  );
  const panelOpen = !!(left || selected || service);
  const model = useMemo(() => buildNetwork(shown, layers, locale, f), [shown, layers, locale, f]);
  const count =
    mode === "services" && active.length
      ? relatedPeople(
          model,
          active.map((s) => "svc:" + s),
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
    setShortlistSide(
      selected || service || (left === "shortlist" && shortlistSide === "right") ? "right" : "left",
    );
    close();
    setSearchHidden(true);
    setLeft("shortlist");
  };
  const inspectPerson = (code: string) => {
    structure();
    setF(EMPTY);
    if (!all.find((e) => e.code === code)?.verified)
      setLayers((v) => ({ ...v, researchQueue: true }));
    setService(null);
    setPerson(code);
    if (!wide || (left === "shortlist" && shortlistSide === "right")) setLeft(null);
  };
  const guideTo = (step: number | null) => {
    setGuideStep(step);
    if (step === null) return;
    close();
    setSearchHidden(true);
    if (step === 0) {
      setMode("people");
      setLeft("search");
    } else if (step === 1) {
      structure();
      setMode("people");
    } else if (step === 2 || step === 3) {
      const code =
        selected?.code ?? shown.find((p) => p.code === guidePerson.current)?.code ?? shown[0]?.code;
      if (code) {
        guidePerson.current = code;
        inspectPerson(code);
      }
    } else if (step === 4) {
      setShortlistSide("left");
      setLeft("shortlist");
    }
  };
  useEffect(() => {
    if (guideStep !== 2 && guideStep !== 3) return;
    const frame = requestAnimationFrame(() => {
      const panel = root.current?.querySelector<HTMLElement>(".network-right-panel");
      if (!panel) return;
      if (guideStep === 2) panel.scrollTop = 0;
      else {
        const target = panel.querySelector<HTMLElement>('[data-guide-target="save"]');
        if (target) {
          const padding = Number.parseFloat(getComputedStyle(panel).paddingTop) || 0;
          panel.scrollTop +=
            target.getBoundingClientRect().top - panel.getBoundingClientRect().top - padding - 12;
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [guideStep, person]);
  const choose = (id: ServiceId) => {
    if (id === "survey") setSurvey(true);
    setLive(false);
    setDisabled((v) => v.filter((s) => s !== id));
    setActive([id]);
    setMode("services");
    if (mode !== "services") setAnchor("isrm");
    setService(id);
    setPerson(null);
    if (!wide) setLeft(null);
  };
  const activateWorkflow = (id: string) => {
    setLive(false);
    setMode("services");
    setActive(workflowServices(id, disabled));
    setAnchor("isrm");
    setPerson(null);
    setService(null);
    setLeft("workflows");
    setOpenWorkflow((v) => (v === id ? null : id));
  };
  const chooseAnchor = (id: string) => {
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
      setMode("services");
      setActive(workflowServices(w, disabled));
    } else setMode("people");
  };
  const startComposer = (k: "service" | "workflow") => {
    setKind(k);
    setTitle("");
    setFrame(emptyServiceFrame());
    setSaved(false);
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
    setWide(screen.matches);
    const resize = () => setWide(screen.matches);
    screen.addEventListener("change", resize);
    return () => {
      screen.removeEventListener("change", resize);
    };
  }, []);
  useEffect(() => {
    if (loading) return;
    if (person && !shown.some((e) => e.code === person)) setPerson(null);
    if (anchor !== "isrm" && !model.nodes.some((n) => n.id === anchor)) setAnchor("isrm");
  }, [shown, model, person, anchor, loading]);
  useEffect(() => {
    if (route.panel === "shortlist") {
      setLeft("shortlist");
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
    const el = root.current;
    if (!el) return;
    const header = el.querySelector<HTMLElement>(".shared-client-header"),
      dashboard = el.querySelector<HTMLElement>(".network-dashboard");
    if (!header || !dashboard) return;
    const measure = () => {
      const top = header.offsetHeight + dashboard.offsetHeight;
      el.style.setProperty("--network-controls-top", `${top}px`);
      el.style.setProperty("--network-header-bottom", `${top + 48}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    ro.observe(dashboard);
    return () => ro.disconnect();
  }, []);
  const backButton = (
    <button
      className="graph-return-tab"
      onClick={() => {
        close();
        setSearchHidden(true);
      }}
      aria-label={t("Close all panels · show graph", "Закрити всі панелі · до графа")}
      title={t("Close all panels · show graph", "Закрити всі панелі · до графа")}
    >
      <Network size={21} />
    </button>
  );
  return (
    <main
      ref={root}
      className={`client-network-page network-workbench ${panelOpen ? "has-panel" : ""}`}
      data-guide-step={guideStep === null ? undefined : GUIDE_STEPS[guideStep]?.id}
    >
      <div
        className={`network-canvas ${leftPanelVisible ? "has-left-panel" : ""} ${rightPanelVisible ? "has-right-panel" : ""} ${persistentSearch ? "has-search-rail" : ""}`}
      >
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph
              experts={shown}
              layers={layers}
              referenceSelection={f}
              locale={locale}
              focus={person}
              onFocus={(code) => {
                close();
                if (code) setPerson(code);
                else setSearchHidden(true);
              }}
              serviceMode={mode === "services"}
              live={live}
              activeServiceIds={active}
              onServiceSelect={(id) => choose(id as ServiceId)}
              onWorkflowSelect={activateWorkflow}
              onVisibleCount={setVisible}
              anchor={anchor}
              onAnchor={chooseAnchor}
              warningService={exclude}
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
                  ? "Workflows"
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
          aria-label={t("Briefing and scope", "Брифінг та обсяг робіт")}
        >
          <Link to="/proposal" className="network-context-link">
            <ArrowLeft size={17} />
            <span>{t("Briefing", "Брифінг")}</span>
          </Link>
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
            <button
              className={`network-shortlist-trigger ${groupFeedback ? "has-feedback" : ""}`}
              onClick={openShortlist}
              aria-label={t("Open shortlist", "Відкрити shortlist")}
            >
              <strong className="network-metric-number" key={draft.shortlist.length}>
                {draft.shortlist.length}
              </strong>
              {t("in your group", "у вашій групі")}
            </button>
            {groupFeedback && (
              <span className="network-group-feedback" role="status">
                {groupFeedback}
              </span>
            )}
          </div>
          <Link to="/scope" className="network-context-link">
            <span>{t("Scope & budget", "Обсяг і бюджет")}</span>
            <ArrowRight size={17} />
          </Link>
        </nav>
        <div className="network-panel-heading network-right-heading">
          {(selected || selectedService || (left === "shortlist" && shortlistSide === "right")) && (
            <>
              <h2>
                {left === "shortlist" && shortlistSide === "right"
                  ? t("Your shortlist", "Ваш shortlist")
                  : selected
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
        >
          <NetworkConcentrator nodes={model.nodes} value={anchor} onChange={chooseAnchor} uk={uk} />
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
      {(left === "search" || persistentSearch) && (
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
            ).map(([id, en, ua]) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={id === "services" ? mode === "services" : !!layers[id]}
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
      )}
      {left === "shortlist" && (
        <aside
          className={`network-paper-panel network-${shortlistSide}-panel`}
          aria-label={t("Shortlist", "Shortlist · відібрана група")}
        >
          <label className="network-group-name">
            {t("Group name", "Назва групи")}
            <input
              value={draft.groupName}
              disabled={!ready}
              onChange={(e) => update({ groupName: e.target.value })}
              placeholder={t("Working group", "Робоча група")}
            />
          </label>
          <p className="network-panel-note">
            {t(
              "Saved in this browser. Opening a profile does not remove it from your group.",
              "Збережено в цьому браузері. Перегляд профілю не прибирає його з групи.",
            )}
          </p>
          {!draft.shortlist.length && (
            <p>
              {t(
                "Select a person and choose Add to shortlist. Your selection will appear here.",
                "Оберіть персону й натисніть «Додати до відбору». Вибрані профілі з’являться тут.",
              )}
            </p>
          )}
          <ol className="network-shortlist">
            {draft.shortlist.map((code) => {
              const p = all.find((e) => e.code === code);
              return (
                <li key={code}>
                  <button
                    className="network-context-action"
                    onClick={() => inspectPerson(code)}
                    disabled={!p}
                  >
                    {p?.displayName || code}
                  </button>
                  <p>
                    {p?.primaryExpertise ||
                      t(
                        "Not in the current accessible sample",
                        "Немає в поточній доступній вибірці",
                      )}
                  </p>
                  <div>
                    {p && (
                      <button className="network-context-action" onClick={() => chooseAnchor(code)}>
                        {t("Explore connections", "Дослідити зв’язки")}
                      </button>
                    )}
                    <button
                      className="network-context-action"
                      disabled={!ready}
                      onClick={() =>
                        update({ shortlist: draft.shortlist.filter((id) => id !== code) })
                      }
                      aria-label={t("Remove ", "Прибрати ") + code}
                    >
                      {t("Remove", "Прибрати")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <Link className="network-context-action" to="/scope">
            {t("Review your proposal request", "Переглянути запит на пропозицію")}
          </Link>
        </aside>
      )}
      {left === "workflows" && (
        <aside
          className="network-paper-panel network-left-panel"
          aria-label={t("Workflow panel", "Панель workflow")}
        >
          <p className="network-panel-note">
            {t(
              "Recurring actions, organised around a useful result. Select a folder to see its services and their potential coverage.",
              "Повторювані дії, впорядковані навколо корисного результату. Оберіть папку, щоб побачити її сервіси та можливе охоплення.",
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
            onClick={() => setSurvey(true)}
          >
            {t(
              "Member & Board questionnaire · view draft",
              "Опитувальник членів і правління · переглянути",
            )}
          </button>
          {[
            {
              id: "core",
              title: { en: "Trust core", uk: "Ядро довіри" },
              serviceIds: CORE_SERVICE_IDS,
            },
            ...CLIENT_WORKFLOWS,
          ].map((w) => (
            <section key={w.id} className="network-workflow-folder">
              <button
                className="network-folder-button"
                aria-expanded={openWorkflow === w.id}
                onClick={() => activateWorkflow(w.id)}
              >
                {w.title[locale]}
                {openWorkflow === w.id ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {openWorkflow === w.id && (
                <div className="network-folder-content">
                  <details className="network-workflow-overview">
                    <summary>{t("About this workflow", "Про цей workflow")}</summary>
                    <NetworkWorkflowDescription
                      id={w.id}
                      locale={locale}
                      onService={choose}
                      compact
                    />
                  </details>
                  {w.id !== "core" && (
                    <label className="network-approve-choice">
                      <input
                        type="checkbox"
                        checked={draft.workflowIds.includes(w.id as WorkflowId)}
                        disabled={!ready}
                        onChange={(e) =>
                          update({
                            mode: "full",
                            workflowIds: e.target.checked
                              ? [...draft.workflowIds, w.id as WorkflowId]
                              : draft.workflowIds.filter((id) => id !== w.id),
                          })
                        }
                      />
                      {t(
                        "Approve · include in the proposal estimate",
                        "Погоджую · додати до розрахунків у пропозиції",
                      )}
                    </label>
                  )}
                  {w.serviceIds.map((id) => (
                    <button
                      className={`network-service-tab ${disabled.includes(id) ? "is-muted" : ""}`}
                      key={id}
                      onClick={() => choose(id)}
                    >
                      {CLIENT_SERVICES.find((s) => s.id === id)?.title[locale]}
                      <ArrowRight size={16} />
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
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
                <button className="network-service-tab" onClick={() => startComposer("workflow")}>
                  {t("Describe a process or workflow", "Описати процес або workflow")}
                </button>
                <button className="network-service-tab" onClick={() => startComposer("service")}>
                  {t("Describe a service or capability", "Описати сервіс або функціональність")}
                </button>
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
      )}
      {selected && (
        <aside
          className="network-paper-panel network-right-panel"
          aria-label={t("Person dossier", "Досьє персони")}
        >
          <h2>{selected.displayName}</h2>
          {selected.organization && (
            <p>
              {selected.role} · {selected.organization}
            </p>
          )}
          <p>{selected.primaryExpertise}</p>
          <dl>
            <dt>{t("Sector", "Сектор")}</dt>
            <dd>{selected.sector}</dd>
            <dt>{t("Country / territory", "Країна / територія")}</dt>
            <dd>{selected.country}</dd>
            <dt>{t("Source record status", "Статус запису у джерелі")}</dt>
            <dd>{selected.identityStatus || t("Not supplied", "Не надано")}</dd>
            <dt>{t("Network role · source field", "Роль у мережі · вихідне поле")}</dt>
            <dd>{selected.communityRole || t("Not supplied", "Не надано")}</dd>
            <dt>{t("Engagement stage · source field", "Етап взаємодії · вихідне поле")}</dt>
            <dd>{selected.crmStage || t("Not supplied", "Не надано")}</dd>
          </dl>
          <p className="network-panel-note">
            {t(
              "Shared categories describe the supplied records. They do not establish a personal introduction, endorsement or willingness to collaborate.",
              "Спільні категорії описують передані записи. Вони не підтверджують особистого знайомства, рекомендації чи готовності до співпраці.",
            )}
          </p>
          <Link
            className="network-folder-button"
            to="/experts/$code"
            params={{ code: selected.code }}
          >
            {t("Full dossier", "Повне досьє")}
          </Link>
          <button
            className="network-folder-button"
            data-guide-target="save"
            disabled={!ready}
            onClick={() => {
              const removing = draft.shortlist.includes(selected.code);
              update({
                shortlist: removing
                  ? draft.shortlist.filter((code) => code !== selected.code)
                  : [...draft.shortlist, selected.code],
              });
              setGroupFeedback(
                removing
                  ? t("Removed from your group · −1", "Прибрано з вашої групи · −1")
                  : t("Added to your group · +1", "Додано до вашої групи · +1"),
              );
            }}
          >
            {draft.shortlist.includes(selected.code)
              ? t("In your group · remove", "У вашій групі · прибрати")
              : t("Add to shortlist", "Додати до відбору")}
          </button>
          <button className="network-context-action" onClick={openShortlist}>
            {t("Open shortlist", "Відкрити shortlist")}
          </button>
          <button className="network-context-action" onClick={() => chooseAnchor(selected.code)}>
            {t("Explore connections", "Дослідити зв’язки")}
          </button>
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
          <NetworkServiceDependencies id={selectedService.id} locale={locale} />
          {service === "survey" && (
            <button className="network-context-action" onClick={() => setSurvey(true)}>
              {t("Open the questionnaire", "Відкрити опитувальник")}
            </button>
          )}
          <small>{selectedService.status[locale]}</small>
          <p className="network-panel-note">
            {t(
              "Highlighted people illustrate potential coverage of this capability using supplied categories; they are not assigned participants.",
              "Підсвічені персони ілюструють можливе охоплення за категоріями вибірки; це не призначені учасники.",
            )}
          </p>
          {service === "contact" && (
            <>
              <button className="network-folder-button" onClick={() => setMailing(true)}>
                {t("Prepare a mailing list", "Скласти список розсилки")}
              </button>
              <button className="network-folder-button" onClick={() => setSurvey(true)}>
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
          <button className="network-folder-button" onClick={() => setExclude(service)}>
            {t("Exclude from the current view", "Виключити з поточного перегляду")}
          </button>
        </aside>
      )}
      <footer className="network-bottom-rail">
        <div className="network-legend" aria-label={t("Graph legend", "Легенда графа")}>
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
          <button className="network-survey-link" onClick={() => setSurvey(true)}>
            {t("Questionnaire", "Опитувальник")}
          </button>
          <NetworkGuide
            step={guideStep}
            onStep={guideTo}
            uk={uk}
            profileAvailable={shown.length > 0}
            profileShortlisted={!!selected && draft.shortlist.includes(selected.code)}
          />
          <DataUseNotice compact />
        </div>
        <nav
          className="client-network-dock network-two-tabs"
          aria-label={t("Graph panels", "Панелі графа")}
        >
          <button
            aria-pressed={left === "search" || persistentSearch}
            onClick={() => {
              const opening = !(left === "search" || persistentSearch);
              close();
              setSearchHidden(!opening);
              setMode("people");
              if (anchor.startsWith("svc:") || anchor.startsWith("workflow:")) setAnchor("isrm");
              setLeft(opening ? "search" : null);
            }}
          >
            <Search size={25} />
            {t("Search", "Пошук")}
          </button>
          <button
            aria-pressed={mode === "services"}
            onClick={() => {
              const opening = left !== "workflows";
              close();
              setMode("services");
              if (opening) {
                setLive(false);
                setActive([]);
                setAnchor("isrm");
                setOpenWorkflow(null);
                setLeft("workflows");
              }
            }}
          >
            <GitBranch size={25} />
            Workflows
          </button>
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
                "Exclude this capability from the view?",
                "Виключити цю функціональність із перегляду?",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                "This changes the demonstration only. No live message, invitation or service is cancelled. A change to the agreed core would need a revised scope.",
                "Це змінює лише демонстрацію. Жодне повідомлення, запрошення чи сервіс не скасовується. Зміна погодженого ядра потребуватиме уточнення обсягу.",
              )}
            </DialogDescription>
          </DialogHeader>
          <p>{CLIENT_SERVICES.find((s) => s.id === exclude)?.detail[locale]}</p>
          <div className="client-inline-actions">
            <button className="client-button" onClick={() => setExclude(null)}>
              {t("Keep the capability", "Залишити функціональність")}
            </button>
            <button
              className="client-text-button"
              onClick={() => {
                if (exclude) {
                  setDisabled((v) => [...new Set([...v, exclude])]);
                  setActive((v) => v.filter((s) => s !== exclude));
                  setService(null);
                  setAnchor("isrm");
                }
                setExclude(null);
              }}
            >
              {t("Exclude from view", "Виключити з перегляду")}
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
            onSubmit={(e) => {
              e.preventDefault();
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
              {t("Title", "Назва")}
              <input
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
            {saved ? (
              <div role="status">
                <p>{t("Added to your scope draft.", "Додано до чернетки scope.")}</p>
                <button type="button" onClick={() => startComposer(kind)}>
                  {t("Describe another", "Описати наступне")}
                </button>
                <Link to="/scope">{t("Review scope", "Переглянути scope")}</Link>
              </div>
            ) : (
              <button
                className="client-button"
                disabled={!ready || !title.trim() || !frame.need.trim() || !frame.outcome.trim()}
              >
                {t("Save to scope", "Зберегти до scope")}
              </button>
            )}
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
