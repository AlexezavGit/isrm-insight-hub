import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  BellRing,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  FileSearch,
  FileText,
  GitBranch,
  Handshake,
  Library,
  Mail,
  Megaphone,
  MessageSquareText,
  Newspaper,
  Send,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { PartnerGraphLink, PartnerGraphNode } from "@/components/PartnerGraph";
import { CO_DESIGN_SESSIONS, PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";

const PartnerGraph = lazy(() => import("@/components/PartnerGraph"));

// localStorage key for saving per-service draft forms. Each service's draft is
// stored as a separate entry under this key, keyed by the service title.
const SERVICE_DRAFTS_KEY = "isrm-service-drafts-v1";

type Composer = "task" | "invite" | "alert" | null;
type ServiceFrameField =
  "userRole" | "need" | "behavior" | "outcome" | "dataIntegration" | "acceptance";
type ServiceRequestType = "add" | "change";
type ServiceNeedDecision = "needed" | "not-needed" | "unsure";
type ServiceFrameValues = Record<ServiceFrameField, string> & {
  requestType: ServiceRequestType;
  needDecision: ServiceNeedDecision;
};

const SERVICE_FRAME_FIELDS: {
  id: ServiceFrameField;
  en: string;
  uk: string;
  helpEn: string;
  helpUk: string;
  rows: number;
}[] = [
    {
      id: "userRole",
      en: "Who needs this service, and in what role?",
      uk: "Кому потрібен цей сервіс і в якій ролі?",
      helpEn: "Name the user group and the situation in which they would use it.",
      helpUk: "Вкажіть групу користувачів і ситуацію, у якій вони скористаються сервісом.",
      rows: 2,
    },
    {
      id: "need",
      en: "What gap or problem should it address?",
      uk: "Яку потребу або проблему він має закрити?",
      helpEn: "Describe what is difficult or missing today, not a proposed feature list.",
      helpUk: "Опишіть, чого зараз бракує або що не працює, а не перелік бажаних функцій.",
      rows: 3,
    },
    {
      id: "behavior",
      en: "What should the service let people do?",
      uk: "Що саме людина має мати змогу зробити?",
      helpEn: "Compare the alternatives you have in mind, or describe another preferred flow.",
      helpUk: "Порівняйте варіанти, які розглядаєте, або опишіть бажаний процес інакше.",
      rows: 4,
    },
    {
      id: "outcome",
      en: "What useful result should it produce?",
      uk: "Який корисний результат він має дати?",
      helpEn: "Describe an observable output or decision that would show the service helped.",
      helpUk: "Опишіть видимий результат або рішення, за яким можна оцінити користь сервісу.",
      rows: 2,
    },
    {
      id: "dataIntegration",
      en: "What information or system connection is required?",
      uk: "Які дані або інтеграція потрібні?",
      helpEn: "Identify the source, access boundary and any system it must work with.",
      helpUk: "Назвіть джерело, межі доступу та системи, з якими потрібно взаємодіяти.",
      rows: 3,
    },
    {
      id: "acceptance",
      en: "How will you decide the change is complete?",
      uk: "Як визначити, що зміну виконано?",
      helpEn: "State a checkable acceptance condition; avoid a general goal such as “better”.",
      helpUk: "Задайте перевірювану умову приймання, а не загальну мету на кшталт «краще».",
      rows: 2,
    },
  ];

import { NETWORK_SERVICES, type ServiceItem } from "@/lib/services-data";

export function MemberCabinet({
  open,
  onClose,
  onOpenDependencies,
}: {
  open: boolean;
  onClose: () => void;
  onOpenDependencies: (serviceId: string) => void;
}) {
  const { locale } = useI18n();
  const [active, setActive] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [serviceFrameOpen, setServiceFrameOpen] = useState(false);

  const copy =
    locale === "en"
      ? {
          title: "Customisable network services",
          purpose: "What it provides",
          role: "Workflow & steps",
          explore: "Suggest an addition or change",
          requestNote: "This opens a local request draft; it does not change a live service.",
          dependencies: "Dependencies",
          close: "Close",
        }
      : {
          title: "Операції та сервіси мережі",
          purpose: "Що надає",
          role: "Етапи процесу та участь",
          explore: "Запропонувати додавання або зміну",
          requestNote: "Відкриває локальну чернетку запиту, а не змінює активний сервіс.",
          dependencies: "Залежності",
          close: "Закрити",
        };

  const language = locale === "uk" ? "uk" : "en";
  const service = NETWORK_SERVICES[active] ?? NETWORK_SERVICES[0];

  if (!open) return null;

  return (
    <>
      {/* ── LEFT DRAWER: Configurator Panel (Vertical Listing) ── */}
      <aside className="fixed left-0 bottom-0 pb-28 top-16 z-30 w-[78vw] max-w-[400px] sm:w-[400px] border-r border-[rgba(200,144,26,0.3)] bg-[#082422]/92 p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] frosted-panel overflow-y-auto">
        <header className="flex items-center justify-between pb-3.5 border-b border-border">
          <div>
            <p className="tech-label text-primary flex items-center gap-2">
              <span className="font-display font-semibold">2</span>
              <span className="opacity-60">·</span>
              <span>{locale === "uk" ? "Конфігуратор" : "Configurator"}</span>
            </p>
            <h2 className="font-display text-lg sm:text-xl font-semibold mt-0.5 text-foreground">{copy.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={copy.close}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Describe service or functionality — primary CTA, high contrast (per user spec) */}
        <button
          onClick={() => setServiceFrameOpen(true)}
          className="group mt-4 flex items-start gap-3 rounded-lg border-2 border-brass bg-brass/10 p-4 text-left transition-all cursor-pointer hover:bg-brass/20 hover:border-brass/80 shadow-md"
        >
          <FileText className="h-5 w-5 text-brass shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-bold text-brass group-hover:text-brass/90 transition-colors">
              {locale === "uk" ? "Описати сервіс або функціональність" : "Describe service or functionality"}
            </h3>
            <p className="text-xs text-brass/80 mt-1 line-clamp-2">
              {locale === "uk"
                ? "Додайте власний опис сервісу або процесу для вашої організації"
                : "Add your own description of a service or process for your organisation"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-brass group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
        </button>

        {/* 'обрати передвстановлені сервіси:' label */}
        <p className="mt-5 mb-2 tech-label text-muted-foreground text-xs">
          {locale === "uk" ? "Обрати передвстановлені сервіси:" : "Select preset services:"}
        </p>

        {/* Services vertical listing — numbers REMOVED from cards (moved to dashboard per user spec) */}
        <div className="flex flex-col gap-2.5">
          {NETWORK_SERVICES.map((item, i) => {
            const isSelected = active === i && detailsOpen;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(i);
                  setDetailsOpen(true);
                }}
                className={`group flex items-start gap-3 rounded-lg border p-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card/65 hover:border-primary/50 hover:bg-card/90"
                }`}
              >
                <item.icon className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title[language]}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.short[language]}
                  </p>
                  {/* Numbers removed per user spec: 'В блоках цифри скільки кого де
                      прибрати, вони повинні відображатись в дашборді' */}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── RIGHT DRAWER: Service Description Frame ── */}
      {detailsOpen && (
        <aside className="fixed right-0 bottom-0 pb-28 top-16 z-35 w-[78vw] max-w-[460px] sm:w-[460px] border-l border-[rgba(200,144,26,0.3)] bg-[#082422]/92 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] frosted-panel overflow-y-auto">
          <header className="flex items-center justify-between pb-3.5 border-b border-border">
            <div className="flex items-center gap-2.5 min-w-0">
              <service.icon className="h-5 w-5 text-primary shrink-0" />
              <h2 className="font-display text-lg sm:text-xl font-semibold truncate text-foreground">
                {service.title[language]}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setDetailsOpen(false)} aria-label="Close details">
              <X className="h-5 w-5" />
            </Button>
          </header>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <h4 className="tech-label text-primary">{copy.purpose}</h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-foreground/90">
                {service.purpose[language]}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card/60 p-3.5">
              <h4 className="tech-label text-muted-foreground">{copy.role}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {service.role[language]}
              </p>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5">
              <h4 className="tech-label text-primary">{locale === "uk" ? "Потенціал та конверсія" : "Capacity & conversion"}</h4>
              <p className="mt-1 font-mono text-xs text-primary font-medium">
                {service.metrics[language]}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2 border border-brass/60 text-brass hover:bg-brass/10 bg-transparent font-semibold shadow-md"
                onClick={() => {
                  onOpenDependencies(service.id);
                  setDetailsOpen(false);
                }}
              >
                <GitBranch className="h-4 w-4" />
                {locale === "uk" ? "Залежності (відкрити граф сервісу)" : "Dependencies (open service graph)"}
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setServiceFrameOpen(true)}
              >
                {copy.explore}
              </Button>
            </div>
          </div>
        </aside>
      )}

      {serviceFrameOpen && (
        <ServiceConfigurationFrame
          serviceTitle={service.title[language]}
          purpose={service.purpose[language]}
          role={service.role[language]}
          questions={{ need: "", behavior: "" }}
          locale={locale}
          onClose={() => setServiceFrameOpen(false)}
        />
      )}
    </>
  );
}

function ServiceDependencyMap({ locale }: { locale: string }) {
  const [selectedId, setSelectedId] = useState("search");
  const nodePickerRef = useRef<HTMLDetailsElement>(null);
  const language = locale === "uk" ? "uk" : "en";
  const selectNode = (id: string) => {
    setSelectedId(id);
    if (nodePickerRef.current) nodePickerRef.current.open = false;
  };
  const selectedFunction = PROPOSAL_FUNCTIONS.find((item) => item.id === selectedId);
  const selectedSession = CO_DESIGN_SESSIONS.find((item) => item.id === selectedId);
  const nodes = useMemo<PartnerGraphNode[]>(() => {
    const functionNodes = PROPOSAL_FUNCTIONS.map((item) => ({
      id: item.id,
      label: item.title[language],
      kind: item.group,
    }));
    const sessionNodes = CO_DESIGN_SESSIONS.map((item) => ({
      id: item.id,
      label: item.title[language],
      kind: "consultation" as const,
    }));
    return [...functionNodes, ...sessionNodes];
  }, [language]);
  const links = useMemo<PartnerGraphLink[]>(() => {
    const nodeIds = new Set([
      ...PROPOSAL_FUNCTIONS.map((item) => item.id),
      ...CO_DESIGN_SESSIONS.map((item) => item.id),
    ]);
    return PROPOSAL_FUNCTIONS.flatMap((item) =>
      item.dependencies.map((dependency) => {
        if (!nodeIds.has(dependency)) {
          throw new Error(`Function ${item.id} depends on missing node ${dependency}`);
        }
        return { source: dependency, target: item.id };
      }),
    );
  }, []);
  const dependencies =
    selectedFunction?.dependencies.map((id) => {
      const item = PROPOSAL_FUNCTIONS.find((feature) => feature.id === id);
      if (item) return { id: item.id, title: item.title[language] };
      const session = CO_DESIGN_SESSIONS.find((feature) => feature.id === id);
      if (session) return { id: session.id, title: session.title[language] };
      throw new Error(`Function ${selectedFunction.id} depends on missing node ${id}`);
    }) ?? [];

  return (
    <div
      className="partner-graph-layout mt-4"
      role="region"
      aria-label={language === "en" ? "Service dependency graph" : "Граф залежностей сервісів"}
    >
      <article className="partner-card partner-graph-card">
        <p className="partner-kicker">
          {language === "en" ? "Function dependencies" : "Залежності функцій"}
        </p>
        <h3>
          {language === "en"
            ? "Select a node to inspect its prerequisites"
            : "Оберіть вузол, щоб переглянути його передумови"}
        </h3>
        <details ref={nodePickerRef} className="partner-node-picker">
          <summary>
            {language === "en" ? "Browse nodes · " : "Перелік вузлів · "}
            {selectedFunction?.title[language] ?? selectedSession?.title[language]}
          </summary>
          <div
            className="partner-function-accessible-list"
            role="group"
            aria-label={language === "en" ? "Select a graph node" : "Оберіть вузол графа"}
          >
            <h4>{language === "en" ? "Functions" : "Функції"}</h4>
            {PROPOSAL_FUNCTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selectedId === item.id}
                onClick={() => selectNode(item.id)}
              >
                {item.title[language]}
              </button>
            ))}
            <h4>{language === "en" ? "Co-design sessions" : "Сесії спільного проєктування"}</h4>
            {CO_DESIGN_SESSIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selectedId === item.id}
                onClick={() => selectNode(item.id)}
              >
                {item.title[language]}
              </button>
            ))}
          </div>
        </details>
        <Suspense
          fallback={
            <p className="partner-graph-fallback" role="status">
              {language === "en" ? "Loading dependency graph…" : "Завантаження графа залежностей…"}
            </p>
          }
        >
          <PartnerGraph
            nodes={nodes}
            links={links}
            selectedId={selectedId}
            onSelect={(node) => selectNode(node.id)}
            height={360}
          />
        </Suspense>
        <p className="partner-graph-caption">
          {language === "en"
            ? "Arrows point from a prerequisite—including a co-design session—to the function that depends on it."
            : "Стрілки спрямовані від передумови, зокрема сесії спільного проєктування, до залежної від неї функції."}
        </p>
      </article>
      <aside className="partner-card" aria-live="polite">
        <p className="partner-kicker">
          {selectedFunction
            ? selectedFunction.group.toUpperCase()
            : language === "en"
              ? "CO-DESIGN SESSION"
              : "СЕСІЯ СПІЛЬНОГО ПРОЄКТУВАННЯ"}
        </p>
        <h3>{selectedFunction?.title[language] ?? selectedSession?.title[language]}</h3>
        <p className="partner-muted">
          {selectedFunction
            ? selectedFunction.purpose[language]
            : language === "en"
              ? "A co-design activity that supplies decisions to the functions shown in the graph; it is not an application feature."
              : "Сесія спільного проєктування, що забезпечує рішеннями функції на графі; це не функція застосунку."}
        </p>
        <h4>{language === "en" ? "Requires" : "Потребує"}</h4>
        {dependencies.length ? (
          <ul className="partner-bullet-list">
            {dependencies.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        ) : (
          <p className="partner-muted">
            {selectedFunction
              ? language === "en"
                ? "No prerequisite is listed."
                : "Передумов не зазначено."
              : language === "en"
                ? "No upstream dependency is recorded for this session."
                : "Для цієї сесії не зазначено попередніх залежностей."}
          </p>
        )}
      </aside>
    </div>
  );
}

function ServiceConfigurationFrame({
  serviceTitle,
  purpose,
  role,
  questions,
  locale,
  onClose,
}: {
  serviceTitle: string;
  purpose: string;
  role: string;
  questions: { need: string; behavior: string };
  locale: string;
  onClose: () => void;
}) {
  const uk = locale !== "en";
  const [values, setValues] = useState<ServiceFrameValues>({
    requestType: "change",
    needDecision: "unsure",
    userRole: "",
    need: "",
    behavior: "",
    outcome: "",
    dataIntegration: "",
    acceptance: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const headingId = "service-configuration-title";

  useEffect(() => {
    formRef.current?.scrollTo({ top: 0 });
  }, [serviceTitle]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SERVICE_DRAFTS_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Saved service drafts have an invalid format.");
      }
      const serviceDraft = (parsed as Record<string, unknown>)[serviceTitle];
      if (!serviceDraft || typeof serviceDraft !== "object" || Array.isArray(serviceDraft)) return;
      const restored = serviceDraft as Record<string, unknown>;
      const restoredFields: Partial<Record<ServiceFrameField, string>> = Object.fromEntries(
        SERVICE_FRAME_FIELDS.flatMap(({ id }) =>
          typeof restored[id] === "string" ? [[id, restored[id]]] : [],
        ),
      );
      setValues((current) => ({
        ...current,
        ...restoredFields,
        requestType: restored["requestType"] === "add" ? "add" : "change",
        needDecision:
          restored["needDecision"] === "needed" ||
            restored["needDecision"] === "not-needed" ||
            restored["needDecision"] === "unsure"
            ? (restored["needDecision"] as "needed" | "not-needed" | "unsure")
            : "unsure",
      }));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : uk
            ? "Не вдалося прочитати локальну чернетку."
            : "Could not read the local draft.",
      );
    }
  }, [serviceTitle, uk]);

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const stored = window.localStorage.getItem(SERVICE_DRAFTS_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : {};
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Saved service drafts have an invalid format.");
      }
      window.localStorage.setItem(
        SERVICE_DRAFTS_KEY,
        JSON.stringify({
          ...parsed,
          [serviceTitle]: {
            ...values,
            savedAt: new Date().toISOString(),
            status: "Local draft — not submitted or approved",
          },
        }),
      );
      setMessage(
        uk
          ? "Чернетку конфігурації збережено лише в цьому браузері. Її не надіслано й не погоджено."
          : "Configuration draft saved in this browser only. It has not been submitted or approved.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : uk
            ? "Не вдалося зберегти локальну чернетку."
            : "Could not save the local draft.",
      );
    }
  };

  return createPortal(
    <div
      className="service-request-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        ref={formRef}
        role="dialog"
        aria-labelledby={headingId}
        aria-modal="true"
        className="service-request-dialog blueprint-corners rounded border border-primary/50 bg-panel p-5 shadow-2xl sm:p-7"
        onSubmit={save}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="tech-label text-primary">
              {uk ? "Шаблон опису функціональності, сервісу, супроводжуваного процесу" : "Functionality, service, accompanying process description template"}
            </p>
            <h2 id={headingId} className="mt-1 text-pretty font-display text-2xl sm:text-3xl">
              {serviceTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{purpose}</p>
            <p className="mt-2 text-xs text-muted-foreground">{role}</p>
            <p className="mt-4 rounded border border-primary/25 bg-primary/5 p-3 text-sm leading-relaxed">
              {uk
                ? "Це запит на додавання або зміну — не налаштування активного сервісу. Опишіть потребу й оберіть бажану поведінку; команда окремо вирішить, чи включати це до розробки."
                : "This is a request to add or change a service—not a live configuration. Describe the need and preferred behavior; the team will decide separately whether it enters development."}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={uk ? "Закрити фрейм" : "Close frame"}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <fieldset className="space-y-2 sm:col-span-2">
            <legend className="tech-label text-muted-foreground">
              {uk ? "Що ви пропонуєте?" : "What are you proposing?"}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["add", uk ? "Додати новий сервіс" : "Add a new service"],
                  ["change", uk ? "Змінити цей сервіс" : "Change this service"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded border border-border bg-card/50 px-3 py-2 text-sm focus-within:border-primary"
                >
                  <input
                    type="radio"
                    name="service-request-type"
                    value={value}
                    checked={values.requestType === value}
                    onChange={() => setValues((current) => ({ ...current, requestType: value }))}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2 sm:col-span-2">
            <legend className="tech-label text-muted-foreground">
              {uk ? "Чи потрібна ця функція?" : "Do you need this capability?"}
            </legend>
            <p className="text-sm leading-relaxed text-muted-foreground">{questions.need}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["needed", uk ? "Так, потрібна" : "Yes, needed"],
                  ["not-needed", uk ? "Ні, не потрібна" : "No, not needed"],
                  ["unsure", uk ? "Поки не впевнений" : "Not sure yet"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded border border-border bg-card/50 px-3 py-2 text-sm focus-within:border-primary"
                >
                  <input
                    type="radio"
                    name="service-need-decision"
                    value={value}
                    checked={values.needDecision === value}
                    onChange={() => setValues((current) => ({ ...current, needDecision: value }))}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="rounded border border-brass/25 bg-brass/5 p-3 text-sm leading-relaxed sm:col-span-2">
            <p className="tech-label text-brass">
              {uk ? "Питання для вибору поведінки" : "Decide how it should work"}
            </p>
            <p className="mt-2 text-muted-foreground">{questions.behavior}</p>
          </div>
          {SERVICE_FRAME_FIELDS.map((field) => (
            <label key={field.id} className="space-y-1.5 sm:col-span-2">
              <span className="tech-label text-muted-foreground">{uk ? field.uk : field.en}</span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                {uk ? field.helpUk : field.helpEn}
              </span>
              {field.rows === 1 ? (
                <input
                  name={`service-${field.id}`}
                  autoComplete="off"
                  className="field"
                  value={values[field.id]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.id]: event.target.value }))
                  }
                />
              ) : (
                <textarea
                  name={`service-${field.id}`}
                  autoComplete="off"
                  className="field"
                  rows={field.rows}
                  value={values[field.id]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.id]: event.target.value }))
                  }
                />
              )}
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p
            className="mt-4 rounded border border-success/40 bg-success/10 p-3 text-sm text-success"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {uk ? "Закрити" : "Close"}
          </Button>
          <Button type="submit">{uk ? "Додати до сервісів" : "Add to services"}</Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

function ComposerModal({
  kind,
  sent,
  onSent,
  onClose,
  onFindExpert,
  message,
}: {
  kind: Exclude<Composer, null>;
  sent: boolean;
  onSent: () => void;
  onClose: () => void;
  onFindExpert: () => void;
  message: string;
}) {
  const title =
    kind === "task" ? "Project task" : kind === "invite" ? "Network invitation" : "Targeted alert";
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-background/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSent();
        }}
        onClick={(e) => e.stopPropagation()}
        className="blueprint-corners w-full max-w-lg rounded border border-primary/50 bg-panel p-5 shadow-2xl"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div>
            <p className="tech-label text-primary">Demo composer</p>
            <h3 className="mt-1 font-display text-2xl">{title}</h3>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X />
          </Button>
        </div>
        {sent ? (
          <p className="mt-6 rounded border border-success/40 bg-success/10 p-4 text-success">
            {message}
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            <input
              required
              placeholder={kind === "alert" ? "Expert group or geography" : "Recipient or project"}
              className="field"
            />
            <textarea
              required
              rows={5}
              defaultValue={
                kind === "task"
                  ? "We invite you to review the project brief and confirm your availability, role and proposed next step."
                  : kind === "invite"
                    ? "You are invited to join the verified ISRM Ukraine expert network. Please review the trust and privacy protocol."
                    : "Priority request: please confirm relevant experience and availability for a rapid expert response."
              }
              className="field"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline">
                <Mail />
                Email
              </Button>
              <Button type="button" variant="outline">
                <MessageSquareText />
                Signal
              </Button>
              <Button type="button" variant="ghost" onClick={onFindExpert}>
                <Users />
                Find expert on map
              </Button>
            </div>
            <Button className="w-full">
              <Send />
              Send demo
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
