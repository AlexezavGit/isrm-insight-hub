import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Network,
  Search,
  GitBranch,
  ChevronDown,
  Plus,
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
  const route = useSearch({ strict: false }) as { panel?: string; stage?: string; preset?: string };
  const [left, setLeft] = useState<"search" | "workflows" | null>(
    route.panel === "search" ? "search" : route.stage === "configuration" ? "workflows" : null,
  );
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
  const [anchor, setAnchor] = useState("isrm"),
    [person, setPerson] = useState<string | null>(null),
    [service, setService] = useState<ServiceId | null>(null);
  const [active, setActive] = useState<ServiceId[]>([]),
    [openWorkflow, setOpenWorkflow] = useState<string | null>(null);
  const [exclude, setExclude] = useState<ServiceId | null>(null),
    [disabled, setDisabled] = useState<ServiceId[]>([]);
  const [composer, setComposer] = useState(false),
    [kind, setKind] = useState<"service" | "workflow">("workflow"),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [saved, setSaved] = useState(false);
  const [mailing, setMailing] = useState(false),
    [survey, setSurvey] = useState(false),
    [mounted, setMounted] = useState(false),
    [visible, setVisible] = useState(0),
    [reduced, setReduced] = useState(false);
  const all = useMemo(() => data?.experts ?? [], [data]),
    filtered = useMemo(() => applyFilters(all, f), [all, f]);
  const shown = useMemo(
    () => filtered.filter((e) => e.verified || layers.researchQueue),
    [filtered, layers.researchQueue],
  );
  const selected = shown.find((e) => e.code === person),
    selectedService = CLIENT_SERVICES.find((s) => s.id === service);
  const panelOpen = !!(left || selected || service);
  const model = useMemo(() => buildNetwork(shown, layers, locale), [shown, layers, locale]);
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
  const choose = (id: ServiceId) => {
    if (service === id) {
      setExclude(id);
      return;
    }
    setDisabled((v) => v.filter((s) => s !== id));
    setActive([id]);
    setMode("services");
    setAnchor("svc:" + id);
    setService(id);
    setPerson(null);
    setLeft(null);
  };
  const activateWorkflow = (id: string) => {
    setMode("services");
    setActive(workflowServices(id, disabled));
    setAnchor("workflow:" + id);
    setOpenWorkflow((v) => (v === id ? null : id));
  };
  const chooseAnchor = (id: string) => {
    close();
    setAnchor(id);
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
    setDescription("");
    setSaved(false);
    setComposer(true);
  };
  useEffect(() => {
    setMounted(true);
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const change = () => setReduced(q.matches);
    q.addEventListener("change", change);
    return () => q.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (person && !shown.some((e) => e.code === person)) setPerson(null);
    if (anchor !== "isrm" && !model.nodes.some((n) => n.id === anchor)) setAnchor("isrm");
  }, [shown, model, person, anchor]);
  useEffect(() => {
    if (!route.preset) return;
    if (route.preset === "engagement" || route.preset === "expertise") {
      setLeft("workflows");
      const w = route.preset;
      setMode("services");
      setActive(workflowServices(w, []));
      setAnchor("workflow:" + w);
      setOpenWorkflow(w);
    }
  }, [route.preset]);
  const backButton = (
    <button
      className="graph-return-tab"
      onClick={close}
      aria-label={t("Return to graph", "Повернутися до графа")}
      title={t("Return to graph", "До графа")}
    >
      <Network size={21} />
    </button>
  );
  return (
    <main className={`client-network-page network-workbench ${panelOpen ? "has-panel" : ""}`}>
      <div
        className={`network-canvas ${left ? "has-left-panel" : ""} ${selected || service ? "has-right-panel" : ""}`}
      >
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph
              experts={shown}
              layers={layers}
              locale={locale}
              focus={person}
              onFocus={(code) => {
                close();
                if (code) setPerson(code);
              }}
              serviceMode={mode === "services"}
              activeServiceIds={active}
              onServiceSelect={(id) => choose(id as ServiceId)}
              onVisibleCount={setVisible}
              anchor={anchor}
              onAnchor={chooseAnchor}
              warningService={exclude}
              disabledServiceIds={disabled}
              motionPaused={reduced}
            />
          </Suspense>
        )}
      </div>
      <ClientHeader />
      <div className="network-dashboard">
        <Link to="/proposal" className="network-context-link">
          <ArrowLeft size={17} />
          <span>{t("Briefing", "Брифінг")}</span>
        </Link>
        <div className="network-metrics" aria-live="polite">
          <span>
            <strong>{visible}</strong>
            {t("visible", "видимо")}
          </span>
          <span>
            <strong>{count}</strong>
            {mode === "services"
              ? t("service coverage", "охоплено сервісом")
              : t("matched", "знайдено")}
          </span>
          <span>
            <strong>{draft.shortlist.length}</strong>
            {t("in shortlist", "у відборі")}
          </span>
        </div>
        <Link to="/scope" className="network-context-link">
          <span>{t("Scope & budget", "Обсяг і бюджет")}</span>
          <ArrowRight size={17} />
        </Link>
      </div>
      {!panelOpen && (
        <div className="network-concentrators">
          <label>
            <span>{t("Concentrator", "Концентратор")}</span>
            <select
              aria-label={t("Choose graph concentrator", "Обрати концентратор графа")}
              value={model.nodes.some((n) => n.id === anchor) ? anchor : "isrm"}
              onChange={(e) => chooseAnchor(e.target.value)}
            >
              <option value="isrm">ISRM</option>
              <optgroup label={t("Workflows", "Workflow")}>
                <option value="workflow:core">{t("Trust core", "Ядро довіри")}</option>
                {CLIENT_WORKFLOWS.map((w) => (
                  <option key={w.id} value={"workflow:" + w.id}>
                    {w.title[locale]}
                  </option>
                ))}
              </optgroup>
              <optgroup label={t("Services", "Сервіси")}>
                {CLIENT_SERVICES.map((s) => (
                  <option key={s.id} value={"svc:" + s.id}>
                    {s.title[locale]}
                  </option>
                ))}
              </optgroup>
              <optgroup
                label={t(
                  "Supplied categories & organisations",
                  "Категорії та організації з вибірки",
                )}
              >
                {model.nodes
                  .filter((n) => !["expert", "service", "workflow", "isrm"].includes(n.kind))
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
              </optgroup>
            </select>
          </label>
          <span className="network-interaction-hint">
            {t(
              "Select a person to centre the view; select again for the dossier.",
              "Оберіть персону для центрування; повторно — для досьє.",
            )}
          </span>
        </div>
      )}
      {left === "search" && (
        <aside
          className="network-paper-panel network-left-panel"
          aria-label={t("Search panel", "Панель пошуку")}
        >
          <header>
            <h2>{t("Search", "Пошук")}</h2>
            {backButton}
          </header>
          <fieldset className="network-layer-switch">
            <legend>{t("Concentrators switch", "Перемикач концентраторів")}</legend>
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
                  checked={!!layers[id]}
                  onChange={(e) => {
                    setLayers({ ...layers, [id]: e.target.checked });
                    if (id === "services") setMode(e.target.checked ? "services" : "people");
                  }}
                />
                {t(en, ua)}
              </label>
            ))}
          </fieldset>
          <p className="network-panel-note">
            {t(
              "Cities, human recommendations, AI verification and compliance decisions are not recorded in this sample. They are not inferred.",
              "Міста, людські рекомендації, AI-верифікація та рішення щодо комплаєнсу у вибірці не зафіксовані. Ми їх не виводимо з інших ознак.",
            )}
          </p>
          <FilterBar experts={all} f={f} setF={setF} compact showResearchQueue={false} />
          <button className="network-folder-button" onClick={close}>
            {t("Show results", "Показати результати")} · {shown.length}
          </button>
          <details className="network-profile-list">
            <summary>{t("Profiles · keyboard access", "Профілі · вибір з клавіатури")}</summary>
            {shown.map((p) => (
              <button
                key={p.code}
                onClick={() => {
                  close();
                  setPerson(p.code);
                  setAnchor(p.code);
                }}
              >
                {p.displayName}
              </button>
            ))}
          </details>
        </aside>
      )}
      {left === "workflows" && (
        <aside
          className="network-paper-panel network-left-panel"
          aria-label={t("Workflow panel", "Панель workflow")}
        >
          <header>
            <h2>Workflows</h2>
            {backButton}
          </header>
          <p className="network-panel-note">
            {t(
              "Recurring actions, organised around a useful result. Select a folder to see its services and their potential coverage.",
              "Повторювані дії, впорядковані навколо корисного результату. Оберіть папку, щоб побачити її сервіси та можливе охоплення.",
            )}
          </p>
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
                <ChevronDown size={18} />
              </button>
              {openWorkflow === w.id && (
                <div className="network-folder-content">
                  {w.id !== "core" && (
                    <label className="network-approve-choice">
                      <input
                        type="checkbox"
                        checked={draft.workflowIds.includes(w.id as "engagement" | "expertise")}
                        disabled={!ready || draft.mode !== "full"}
                        onChange={(e) =>
                          update({
                            workflowIds: e.target.checked
                              ? [...draft.workflowIds, w.id as "engagement" | "expertise"]
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
              <Plus size={18} />
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
          <header>
            <span>{selected.code}</span>
            {backButton}
          </header>
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
            disabled={!ready}
            onClick={() =>
              update({
                shortlist: draft.shortlist.includes(selected.code)
                  ? draft.shortlist.filter((c) => c !== selected.code)
                  : [...draft.shortlist, selected.code],
              })
            }
          >
            {draft.shortlist.includes(selected.code)
              ? t("Remove from shortlist", "Прибрати з відбору")
              : t("Add to shortlist", "Додати до відбору")}
          </button>
        </aside>
      )}
      {selectedService && (
        <aside
          className="network-paper-panel network-right-panel"
          aria-label={t("Service dossier", "Опис сервісу")}
        >
          <header>
            <span>{t("Service capability", "Сервісна функціональність")}</span>
            {backButton}
          </header>
          <h2>{selectedService.title[locale]}</h2>
          <p>{selectedService.detail[locale]}</p>
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
          <DataUseNotice compact />
        </div>
        <nav
          className="client-network-dock network-two-tabs"
          aria-label={t("Graph panels", "Панелі графа")}
        >
          <button
            aria-pressed={mode === "people"}
            onClick={() => {
              close();
              setMode("people");
              setLeft(left === "search" ? null : "search");
            }}
          >
            <Search size={25} />
            {t("Search", "Пошук")}
          </button>
          <button
            aria-pressed={mode === "services"}
            onClick={() => {
              close();
              setMode("services");
              setLeft(left === "workflows" ? null : "workflows");
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
      <Dialog open={composer} onOpenChange={setComposer}>
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
                    description: description.trim(),
                  },
                ],
                customIncluded: true,
              });
              setSaved(true);
            }}
          >
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
            <label>
              {t(
                "Who needs it, actions, data and intended outcome",
                "Кому потрібно, дії, дані та очікуваний результат",
              )}
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
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
                disabled={!ready || !title.trim() || !description.trim()}
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
          <p>
            {t(
              "Participation, attribution, future contact and paid work require separate choices. Do not enter confidential client information.",
              "Участь, авторство, подальші контакти й оплачувана робота потребують окремого погодження. Не вводьте конфіденційні дані клієнтів.",
            )}
          </p>
          <a
            className="client-button"
            href="/ISRM_Community_Member_Survey_Draft.md"
            target="_blank"
            rel="noreferrer"
          >
            {t("Read the full existing questionnaire", "Прочитати повний наявний опитувальник")}
          </a>
        </DialogContent>
      </Dialog>
    </main>
  );
}
