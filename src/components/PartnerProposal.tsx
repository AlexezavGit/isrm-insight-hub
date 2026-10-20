import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  LockKeyhole,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PartnerGraphLink, PartnerGraphNode } from "@/components/PartnerGraph";
import { getPartnerPreview } from "@/lib/network.functions";
import { useI18n } from "@/lib/i18n";
import { IsrmLogo } from "@/components/IsrmLogo";
import {
  CLIENT_PACKAGES,
  CLIENT_PAYMENT_TERMS,
  CLIENT_PRICING_STATUS,
} from "@/lib/client-proposal-data";
import {
  CO_DESIGN_SESSIONS,
  DOSSIER_STAGES,
  FUNCTION_EXPERT_SECTORS,
  MARKET_BENCHMARKS,
  PARTNER_ROLES,
  PARTNER_WORK_PACKAGES,
  PROPOSAL_FUNCTIONS,
  SUPPORTING_DOCUMENTS,
  type LocaleCopy,
  type PartnerRoleId,
  type ProposalFunction,
} from "@/lib/proposal-data";
import type { PartnerPreview as PartnerPreviewData } from "@/lib/experts.server";

const PartnerGraph = lazy(() => import("@/components/PartnerGraph"));
const STORAGE_KEY = "isrm-partner-review-draft-v1";
const BUDGET_INPUTS_VERSION = 9;

interface ReviewDraft {
  budgetInputsVersion: number;
  selectedCandidateIds: string[];
  selectedFunctionIds: string[];
  packageHours: Record<string, string>;
  dossierVolume: string;
  dossierMinutes: Record<string, string>;
  roleRates: Record<PartnerRoleId, string>;
  developerRate: string;
  demoUseFee: string;
  externalCosts: string;
  boutiqueQuote: string;
  currency: "GBP" | "USD" | "EUR";
  reviewDecisions: Record<string, string>;
  reviewComments: Record<string, string>;
  requestedFunctions: string;
  additionalFunction: Record<AdditionalFunctionField, string>;
  generalComment: string;
}

type AdditionalFunctionField =
  "userRole" | "need" | "behavior" | "outcome" | "dataIntegration" | "acceptance";

const ADDITIONAL_FUNCTION_FIELDS: {
  id: AdditionalFunctionField;
  en: string;
  uk: string;
  rows: number;
}[] = [
  { id: "userRole", en: "User or role", uk: "Користувач або роль", rows: 1 },
  { id: "need", en: "Need or problem", uk: "Потреба або проблема", rows: 2 },
  { id: "behavior", en: "Expected system behavior", uk: "Очікувана поведінка системи", rows: 3 },
  { id: "outcome", en: "Expected output or outcome", uk: "Очікуваний результат", rows: 2 },
  {
    id: "dataIntegration",
    en: "Required data or integration",
    uk: "Потрібні дані або інтеграція",
    rows: 2,
  },
  { id: "acceptance", en: "Acceptance criterion", uk: "Критерій приймання", rows: 2 },
];

interface ProjectEffort {
  partner: Record<PartnerRoleId, number>;
  partnerTotal: number;
  development: number;
  client: number | null;
  dossierByStage: Record<string, number | null>;
  unestimatedPackages: number;
  dossierComplete: boolean;
}

const INITIAL_PACKAGE_HOURS: Record<string, string> = Object.fromEntries(
  PARTNER_WORK_PACKAGES.map((pkg) => [pkg.id, ""]),
);
const INITIAL_DOSSIER_MINUTES: Record<string, string> = Object.fromEntries(
  DOSSIER_STAGES.map((stage) => [stage.id, ""]),
);
const INITIAL_ROLE_RATES: Record<PartnerRoleId, string> = {
  communications: "",
  operations: "",
  product: "",
};

const EMPTY_DRAFT: ReviewDraft = {
  budgetInputsVersion: BUDGET_INPUTS_VERSION,
  selectedCandidateIds: [],
  selectedFunctionIds: PROPOSAL_FUNCTIONS.filter(
    (item) => item.group === "mvp" && item.id !== "billing",
  ).map((item) => item.id),
  packageHours: INITIAL_PACKAGE_HOURS,
  dossierVolume: "",
  dossierMinutes: INITIAL_DOSSIER_MINUTES,
  roleRates: INITIAL_ROLE_RATES,
  developerRate: "",
  demoUseFee: "",
  externalCosts: "",
  boutiqueQuote: "",
  currency: "GBP",
  reviewDecisions: {},
  reviewComments: {},
  requestedFunctions: "",
  additionalFunction: {
    userRole: "",
    need: "",
    behavior: "",
    outcome: "",
    dataIntegration: "",
    acceptance: "",
  },
  generalComment: "",
};

function copy(value: LocaleCopy, locale: string) {
  return locale === "uk" ? value.uk : value.en;
}

function numberFormat(value: number, locale: string, digits = 0) {
  return new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function money(value: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function moneyRate(value: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function LocaleSwitch({
  locale,
  onChange,
  label,
}: {
  locale: string;
  onChange: (locale: "en" | "uk") => void;
  label: string;
}) {
  return (
    <div className="partner-locale-switch" role="group" aria-label={label}>
      <button
        type="button"
        aria-pressed={locale === "en"}
        className={locale === "en" ? "is-active" : ""}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={locale === "uk"}
        className={locale === "uk" ? "is-active" : ""}
        onClick={() => onChange("uk")}
      >
        УКР
      </button>
    </div>
  );
}

function nonNegativeNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function readDraft(): ReviewDraft {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return EMPTY_DRAFT;
  const parsed: unknown = JSON.parse(stored);
  if (!parsed || typeof parsed !== "object")
    throw new Error("The local review draft has an invalid format.");
  const saved = parsed as Partial<ReviewDraft> & {
    savedAt?: string;
    selectedCandidateAliases?: string[];
    partnerDecisions?: Record<string, string>;
    partnerComments?: Record<string, string>;
    clientDecisions?: Record<string, string>;
    clientComments?: Record<string, string>;
    pricingModel?: string;
  };
  const hadSavedCandidateSelections =
    (Array.isArray(saved.selectedCandidateIds) && saved.selectedCandidateIds.length > 0) ||
    (Array.isArray(saved.selectedCandidateAliases) && saved.selectedCandidateAliases.length > 0);
  const {
    selectedCandidateAliases: _legacySelectedCandidateAliases,
    partnerDecisions,
    partnerComments,
    clientDecisions,
    clientComments,
    pricingModel: _legacyPricingModel,
    ...current
  } = saved;
  const currentBudgetInputs = saved.budgetInputsVersion === BUDGET_INPUTS_VERSION;
  void _legacySelectedCandidateAliases;
  void _legacyPricingModel;
  const reviewDecisions = {
    ...partnerDecisions,
    ...clientDecisions,
    ...saved.reviewDecisions,
  };
  const reviewComments = { ...partnerComments, ...clientComments, ...saved.reviewComments };
  const normalized: ReviewDraft = {
    ...EMPTY_DRAFT,
    ...current,
    budgetInputsVersion: BUDGET_INPUTS_VERSION,
    selectedCandidateIds: [],
    packageHours: currentBudgetInputs
      ? { ...INITIAL_PACKAGE_HOURS, ...saved.packageHours }
      : INITIAL_PACKAGE_HOURS,
    dossierVolume: currentBudgetInputs
      ? (saved.dossierVolume ?? EMPTY_DRAFT.dossierVolume)
      : EMPTY_DRAFT.dossierVolume,
    dossierMinutes: currentBudgetInputs
      ? { ...INITIAL_DOSSIER_MINUTES, ...saved.dossierMinutes }
      : INITIAL_DOSSIER_MINUTES,
    roleRates: currentBudgetInputs
      ? { ...EMPTY_DRAFT.roleRates, ...saved.roleRates }
      : EMPTY_DRAFT.roleRates,
    developerRate: currentBudgetInputs
      ? (saved.developerRate ?? EMPTY_DRAFT.developerRate)
      : EMPTY_DRAFT.developerRate,
    currency: currentBudgetInputs ? (saved.currency ?? EMPTY_DRAFT.currency) : EMPTY_DRAFT.currency,
    demoUseFee: currentBudgetInputs
      ? (saved.demoUseFee ?? EMPTY_DRAFT.demoUseFee)
      : EMPTY_DRAFT.demoUseFee,
    externalCosts: currentBudgetInputs
      ? (saved.externalCosts ?? EMPTY_DRAFT.externalCosts)
      : EMPTY_DRAFT.externalCosts,
    reviewDecisions: Object.fromEntries(
      Object.entries(reviewDecisions).filter(([key]) => !key.startsWith("client-")),
    ),
    reviewComments: Object.fromEntries(
      Object.entries(reviewComments).filter(([key]) => !key.startsWith("client-")),
    ),
    additionalFunction: {
      ...EMPTY_DRAFT.additionalFunction,
      ...saved.additionalFunction,
      ...(saved.requestedFunctions &&
      !Object.values(saved.additionalFunction ?? {}).some(
        (value) => typeof value === "string" && Boolean(value.trim()),
      )
        ? { behavior: saved.requestedFunctions }
        : {}),
    },
  };
  if (hadSavedCandidateSelections) {
    const savedAt = typeof saved["savedAt"] === "string" ? { savedAt: saved["savedAt"] } : {};
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...normalized, ...savedAt }));
  }
  return normalized;
}

export default function PartnerProposal() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const copyText = (en: string, ua: string) => (uk ? ua : en);
  const [view, setView] = useState<"description" | "workspace" | "order">("description");
  const [workspaceMode, setWorkspaceMode] = useState<"experts" | "configurator">("experts");
  const [preview, setPreview] = useState<PartnerPreviewData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [draftError, setDraftError] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const [draft, setDraft] = useState<ReviewDraft>(EMPTY_DRAFT);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedFunctionId, setSelectedFunctionId] = useState("search");
  const [sectorFilters, setSectorFilters] = useState<string[]>([]);
  const [filterPanel, setFilterPanel] = useState<"sector" | null>(null);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);

  useEffect(() => {
    if (view !== "workspace") return;
    let active = true;
    getPartnerPreview()
      .then((data) => {
        if (active) setPreview(data as PartnerPreviewData);
      })
      .catch((error: unknown) => {
        if (active)
          setLoadError(
            error instanceof Error ? error.message : "Could not load the partner preview.",
          );
      });
    return () => {
      active = false;
    };
  }, [view]);

  useEffect(() => {
    try {
      setDraft(readDraft());
    } catch (error) {
      setDraftError(
        error instanceof Error ? error.message : "Could not read the local review draft.",
      );
    }
    setDraftLoaded(true);
  }, []);

  const visibleCandidates = useMemo(
    () =>
      preview?.candidates.filter(
        (candidate) => !sectorFilters.length || sectorFilters.includes(candidate.sector),
      ) || [],
    [preview, sectorFilters],
  );
  useEffect(() => {
    if (
      selectedCandidateId &&
      !visibleCandidates.some((candidate) => candidate.id === selectedCandidateId)
    ) {
      setSelectedCandidateId("");
    }
  }, [selectedCandidateId, visibleCandidates]);
  const selectedFunction =
    PROPOSAL_FUNCTIONS.find((item) => item.id === selectedFunctionId) || PROPOSAL_FUNCTIONS[0];
  const filteredSectors = useMemo(
    () =>
      Array.from(new Set(visibleCandidates.map((candidate) => candidate.sector))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [visibleCandidates],
  );
  const graphNodes = useMemo(() => {
    const sectorNodes = Array.from(
      new Set(visibleCandidates.map((candidate) => candidate.sector)),
    ).map((sector) => ({
      id: `sector:${sector}`,
      label: sector,
      kind: "hub" as const,
    }));
    const candidateNodes = visibleCandidates.map((candidate) => ({
      id: candidate.id,
      label: candidate.name,
      kind: "candidate" as const,
      group: candidate.sector,
      selected: draft.selectedCandidateIds.includes(candidate.id),
    }));
    return [...sectorNodes, ...candidateNodes];
  }, [visibleCandidates, draft.selectedCandidateIds]);
  const expertGraphLinks = useMemo(
    () =>
      visibleCandidates.flatMap((candidate) => [
        { source: candidate.id, target: `sector:${candidate.sector}` },
      ]),
    [visibleCandidates],
  );
  const featureGraph = useMemo(() => {
    const nodes: PartnerGraphNode[] = [
      ...CO_DESIGN_SESSIONS.map((session) => ({
        id: session.id,
        label: copy(session.title, locale),
        kind: "consultation" as const,
      })),
      ...PROPOSAL_FUNCTIONS.map((feature) => ({
        id: feature.id,
        label: copy(feature.title, locale),
        kind: feature.group,
        selected: draft.selectedFunctionIds.includes(feature.id),
      })),
    ];
    const links: PartnerGraphLink[] = PROPOSAL_FUNCTIONS.flatMap((feature) =>
      feature.dependencies.map((dependency) => ({ source: dependency, target: feature.id })),
    );
    const linkedCandidates = new Map<string, (typeof visibleCandidates)[number]>();
    const candidateLinks: PartnerGraphLink[] = [];
    for (const feature of PROPOSAL_FUNCTIONS) {
      if (!draft.selectedFunctionIds.includes(feature.id)) continue;
      const sectors = FUNCTION_EXPERT_SECTORS[feature.id] ?? [];
      for (const candidate of visibleCandidates) {
        if (!sectors.includes(candidate.sector)) continue;
        linkedCandidates.set(candidate.id, candidate);
        candidateLinks.push({
          source: feature.id,
          target: `potential-expert:${candidate.id}`,
        });
      }
    }
    for (const candidate of linkedCandidates.values()) {
      nodes.push({
        id: `potential-expert:${candidate.id}`,
        label: candidate.name,
        kind: "candidate",
        group: candidate.sector,
        selected: draft.selectedCandidateIds.includes(candidate.id),
      });
    }
    links.push(...candidateLinks);
    links.push(
      { source: "survey", target: "campaign-insights", cycle: true },
      { source: "campaign-insights", target: "session-strategy", cycle: true },
      { source: "session-strategy", target: "survey", cycle: true },
    );
    return {
      nodes,
      links,
      candidateCount: linkedCandidates.size,
    };
  }, [draft.selectedCandidateIds, draft.selectedFunctionIds, locale, visibleCandidates]);
  const projectEffort = useMemo(() => {
    const partner: Record<PartnerRoleId, number> = {
      communications: 0,
      operations: 0,
      product: 0,
    };
    let unestimatedPackages = 0;
    let development = 0;
    for (const pkg of PARTNER_WORK_PACKAGES) {
      if (pkg.gatedByFunction && !draft.selectedFunctionIds.includes(pkg.gatedByFunction)) {
        continue;
      }
      const rawHours = draft.packageHours[pkg.id] ?? "";
      const hours = nonNegativeNumber(rawHours);
      if (hours === null) {
        unestimatedPackages += 1;
        continue;
      }
      if (pkg.role === "developer") {
        development += hours;
      } else {
        partner[pkg.role] += hours;
      }
    }
    const volume = nonNegativeNumber(draft.dossierVolume);
    const dossierByStage = Object.fromEntries(
      DOSSIER_STAGES.map((stage) => {
        const minutes = nonNegativeNumber(draft.dossierMinutes[stage.id] ?? "");
        return [stage.id, volume === null || minutes === null ? null : (volume * minutes) / 60];
      }),
    ) as Record<string, number | null>;
    for (const stage of DOSSIER_STAGES) {
      const hours = dossierByStage[stage.id];
      if (stage.costed && stage.role !== "client" && hours !== null) {
        partner[stage.role] += hours;
      }
    }
    const dossierComplete = DOSSIER_STAGES.every(
      (stage) => !stage.costed || (volume !== null && dossierByStage[stage.id] !== null),
    );
    return {
      partner,
      partnerTotal: Object.values(partner).reduce((sum, hours) => sum + hours, 0),
      development,
      client: dossierByStage["client-approval"],
      dossierByStage,
      unestimatedPackages,
      dossierComplete,
    };
  }, [draft.packageHours, draft.dossierVolume, draft.dossierMinutes, draft.selectedFunctionIds]);
  const activeSelectedCandidates =
    preview?.candidates.filter((candidate) => draft.selectedCandidateIds.includes(candidate.id)) ??
    [];

  function toggleArrayValue(values: string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }

  function updateDraft<K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveNotice("");
  }

  function saveLocalDraft() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...draft,
          selectedCandidateIds: [],
          savedAt: new Date().toISOString(),
        }),
      );
      setSaveNotice(
        uk
          ? "Чернетку збережено локально. Псевдонімний вибір не зберігається між завантаженнями; експортуйте його до оновлення сторінки."
          : "Draft saved locally. Pseudonymous profile selections do not persist across loads; export them before refreshing.",
      );
      setDraftError("");
    } catch (error) {
      setDraftError(
        error instanceof Error ? error.message : "Could not save the local review draft.",
      );
    }
  }

  function exportDraft() {
    const payload = {
      document: "ISRM partner review draft",
      state: "Local working draft — not submitted or approved",
      savedAt: new Date().toISOString(),
      project: "ISRM expert-network search, configurable pilot and project-wide budget",
      currency: draft.currency,
      selectedFunctions: draft.selectedFunctionIds,
      proposedHours: draft.packageHours,
      dossierVolume: draft.dossierVolume,
      dossierMinutesPerRecord: draft.dossierMinutes,
      selectedCandidateCount: activeSelectedCandidates.length,
      selectedExperts: activeSelectedCandidates.map((candidate) => ({
        name: candidate.name,
        sector: candidate.sector,
      })),
      partnerRates: draft.roleRates,
      developerRate: draft.developerRate,
      externalCosts: draft.externalCosts,
      boutiqueQuote: draft.boutiqueQuote,
      reviewDecisions: draft.reviewDecisions,
      reviewComments: draft.reviewComments,
      requestedFunctions: draft.requestedFunctions,
      additionalFunction: draft.additionalFunction,
      generalComment: draft.generalComment,
      reviewBoundary:
        "This demonstration export contains per-load random pseudonyms and broad sector categories only. Direct identifiers, contact data, organizations, role titles, individual expertise descriptions, geography, source URLs, CRM identifiers and verification flags are excluded. Attribute combinations may still enable re-identification; this is pseudonymization, not a guarantee of anonymity. The export is local, not submitted or approved.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "isrm-partner-review-draft.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const i18n = {
    back: uk ? "До огляду партнера" : "Partner overview",
    label: uk ? "Партнерський перегляд · робоча чернетка" : "Partner review · working draft",
    title: uk
      ? "ISRM: партнерський огляд і ціноутворення"
      : "ISRM: partner review and scope pricing",
    intro: uk
      ? "Партнерський маршрут: опис ролей і меж → пошук та конфігурація → перегляд кошторису й рішень. Партнерські ставки та оцінки вводяться окремо; невідомі значення залишаються TBD."
      : "Partner route: review roles and boundaries → search and configuration → review the cost model and decisions. Partner rates and estimates are entered separately; unknown values remain TBD.",
    description: uk ? "Опис і межі" : "Description and boundaries",
    experts: uk ? "Пошук експертів" : "Expert search",
    configurator: uk ? "Налаштування" : "Settings",
    workspace: uk ? "Пошук і конфігурація" : "Search and configuration",
    pilot: uk ? "Функції пілота" : "Pilot functions",
    order: uk ? "Кошторис і рішення" : "Cost model and decisions",
    internal: uk
      ? "Внутрішня/партнерська чернетка · не публікувати без контролю доступу"
      : "Internal/partner draft · do not publish without access control",
    privacy: uk
      ? "Демо показує випадкові псевдоніми замість імен; організації, посади, індивідуальні описи експертизи, контакти, посилання й прапорці перевірки не передаються в браузер. Залишкові комбінації широких категорій можуть ідентифікувати людину, тому це не гарантує анонімності й не є дозволом на публічне розгортання."
      : "The demo uses random pseudonyms instead of names; organizations, titles, individual expertise descriptions, contacts, links and verification flags are not sent to the browser. Combinations of remaining broad categories may still identify someone, so this does not guarantee anonymity or authorize public deployment.",
    load: uk ? "Завантаження даних партнерського перегляду…" : "Loading partner-review data…",
    noData: uk ? "Набір не завантажено." : "Preview data did not load.",
    pipeline: uk ? "Сектор експертизи" : "Expertise sector",
    sectors: uk ? "Сектори у фільтрі" : "Sectors in filter",
    selectFilters: uk ? "Фільтри демо-профілів" : "Demonstration profile filters",
    all: uk ? "Усі" : "All",
    noCandidates: uk ? "Немає записів для цих фільтрів." : "No records match these filters.",
    selected: uk ? "Відібрано для планування" : "Selected for planning",
    selectionLifecycle: uk
      ? "Псевдоніми змінюються під час кожного нового завантаження демо. Виберіть профілі й експортуйте їх до перезавантаження; локальна чернетка навмисно не зберігає псевдонімний вибір."
      : "Pseudonyms change on each demonstration load. Select profiles and export before reloading; the local draft deliberately does not retain pseudonymous profile selections.",
    choose: uk ? "Додати до планової групи" : "Add to planning group",
    remove: uk ? "Зняти вибір" : "Remove selection",
    miniDossier: uk ? "Міні-досьє для погодження" : "Review mini-dossier",
    fullDossier: uk
      ? "Повне досьє — поза межами цього перегляду"
      : "Full dossier — outside this review view",
    sourceOnly: uk
      ? "Профіль має випадковий псевдонім для поточного завантаження демо."
      : "This profile has a random pseudonym for the current demonstration load.",
    designNote: uk
      ? "Псевдонім змінюється під час кожного нового завантаження; зв’язку з CRM ID у браузері немає."
      : "The pseudonym changes on each load; no CRM ID is present in the browser.",
    fit: uk ? "Пошук експертів" : "Search experts",
    selectedFunction: uk ? "Функція" : "Function",
    mvp: uk ? "MVP пілота" : "Pilot MVP",
    later: uk ? "Поза MVP / пізніше" : "Later / outside MVP",
    loop: uk
      ? "Цикл навчання пілота: опитування → аналіз → уточнення пріоритетів → наступна кампанія."
      : "Pilot learning loop: survey → analysis → updated priorities → next campaign.",
    scopeTitle: uk ? "Що оцінює партнер" : "What partners review",
    roles: uk ? "Функціональні ролі й передача" : "Functional roles and handover",
    budgetTitle: uk ? "Бюджет усього проєкту" : "Project-wide budget",
    assumptions: uk ? "Як читати припущення" : "How to read the assumptions",
    viewSources: uk ? "Пояснення й документи" : "Explanations and documents",
    comments: uk ? "Коментар / запропонована зміна" : "Comment / proposed change",
    addFunction: uk ? "Запропонувати функцію або сервіс" : "Propose a function or service",
    localDraft: uk ? "Локальна чернетка" : "Local draft",
    save: uk ? "Зберегти в браузері" : "Save in browser",
    export: uk ? "Завантажити файл для надсилання" : "Download file to send",
    noSubmit: uk
      ? "Нічого не надсилається автоматично. Передайте завантажений файл через погоджений захищений канал."
      : "Nothing is submitted automatically. Send the downloaded file through an approved secure channel.",
  };

  return (
    <main className="partner-review">
      <div className="partner-shell">
        <header className="partner-header">
          <div>
            <div className="mb-3" aria-label="ISRM">
              <IsrmLogo className="h-9 w-auto" showSubtitle={true} />
            </div>
            <Button variant="ghost" className="partner-back" onClick={() => setView("description")}>
              <ArrowLeft aria-hidden="true" />
              {i18n.back}
            </Button>
            <p className="partner-eyebrow">{i18n.label}</p>
            <h1>{i18n.title}</h1>
            <p className="partner-lede">{i18n.intro}</p>
          </div>
          <div className="partner-header-status">
            <LocaleSwitch
              locale={locale}
              onChange={setLocale}
              label={uk ? "Мова сторінки" : "Page language"}
            />
            <span className="partner-badge">
              <LockKeyhole size={14} />
              {i18n.internal}
            </span>
            <span
              className="partner-route-notice"
              role="note"
              aria-label={
                uk
                  ? "Маршрут без серверної авторизації"
                  : "Route without server-side authentication"
              }
            >
              {uk
                ? "Локальна чернетка · без серверної авторизації · не надсилайте як зовнішнє партнерське посилання"
                : "Local-only draft · no server-side authentication · do not share as an external partner link"}
            </span>
            <Button
              variant="outline"
              className="partner-doc-button"
              onClick={() => setDocumentOpen(true)}
            >
              <BookOpen size={16} />
              {i18n.viewSources}
            </Button>
          </div>
        </header>

        <nav
          className="partner-stepper"
          aria-label={uk ? "Етапи партнерського перегляду" : "Partner review steps"}
        >
          {(
            [
              ["description", i18n.description],
              ["workspace", i18n.workspace],
              ["order", i18n.order],
            ] as const
          ).map(([step, label], index) => (
            <button
              key={step}
              type="button"
              className={`partner-step ${view === step ? "is-active" : ""}`}
              aria-current={view === step ? "step" : undefined}
              onClick={() => setView(step)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
              {index < 2 && <ArrowRight size={15} aria-hidden="true" />}
            </button>
          ))}
        </nav>
        {view === "workspace" && (
          <div className="partner-workspace-tabs" role="tablist" aria-label={i18n.workspace}>
            {(
              [
                ["experts", i18n.experts],
                ["configurator", i18n.configurator],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={workspaceMode === mode}
                className={workspaceMode === mode ? "is-active" : ""}
                onClick={() => setWorkspaceMode(mode)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {(loadError || draftError) && (
          <div className="partner-alert" role="alert">
            <AlertTriangle size={18} />
            <span>{loadError || draftError}</span>
          </div>
        )}
        {draftError && !loadError && (
          <Button
            variant="outline"
            className="partner-small-button"
            onClick={() => {
              window.localStorage.removeItem(STORAGE_KEY);
              setDraft(EMPTY_DRAFT);
              setDraftError("");
            }}
          >
            {uk ? "Очистити пошкоджену локальну чернетку" : "Clear the invalid local draft"}
          </Button>
        )}

        {view === "description" && (
          <section className="partner-view" aria-labelledby="partner-description-heading">
            <SectionHeading
              number="01"
              title={uk ? "Робоча модель партнерства" : "Partner working model"}
              subtitle={
                uk
                  ? "Огляд для партнерів: чотири послідовні комерційні скоупи, відповідальність і невирішені цінові входи."
                  : "Partner overview: four sequential commercial scopes, responsibilities and unresolved pricing inputs."
              }
            />
            <div className="partner-warning">
              <LockKeyhole size={18} />
              <p>
                {uk
                  ? "Це локальна чернетка, а не захищена партнерська зона: автентифікація й розмежування прав не налаштовані. Не надсилайте цей маршрут як приватне посилання."
                  : "This is a local draft, not a protected partner area: authentication and role-based authorization are not configured. Do not distribute this route as a private link."}
              </p>
            </div>
            <div className="partner-order-grid">
              <div className="partner-order-main">
                <article className="partner-card">
                  <p className="partner-kicker">
                    {uk
                      ? "Чотири послідовні комерційні скоупи"
                      : "Four sequential commercial scopes"}
                  </p>
                  <h2 id="partner-description-heading">
                    {uk
                      ? "Пілот не є повною публічною платформою"
                      : "The pilot is not the complete public platform"}
                  </h2>
                  <div className="partner-package-list">
                    {CLIENT_PACKAGES.map((item) => (
                      <div className="partner-package-card" key={item.id}>
                        <span>
                          <strong>{item.title[uk ? "uk" : "en"]}</strong>
                          <span>{item.purpose[uk ? "uk" : "en"]}</span>
                          <small>{item.boundary[uk ? "uk" : "en"]}</small>
                        </span>
                        <b>{uk ? "Пакетна сума: TBD" : "Package amount: TBD"}</b>
                      </div>
                    ))}
                  </div>
                  <p className="partner-muted">{CLIENT_PRICING_STATUS[uk ? "uk" : "en"]}</p>
                </article>

                <article className="partner-card">
                  <p className="partner-kicker">
                    {uk ? "Відповідальність партнерів" : "Partner responsibilities"}
                  </p>
                  <h2>
                    {uk
                      ? "Рольова робота з передачею до операційної моделі"
                      : "Role-based work with handover into operations"}
                  </h2>
                  <div className="partner-role-overview">
                    {PARTNER_ROLES.map((role) => (
                      <section key={role.id}>
                        <h3>{copy(role.name, locale)}</h3>
                        <p>{copy(role.purpose, locale)}</p>
                        <p>
                          <strong>{uk ? "Очікувані результати" : "Expected outputs"}:</strong>{" "}
                          {role.outputs.map((item) => copy(item, locale)).join("; ")}
                        </p>
                        <p>
                          <strong>
                            {uk ? "Операційний еквівалент" : "Operational equivalent"}:
                          </strong>{" "}
                          {copy(role.standardEquivalent, locale)}
                        </p>
                      </section>
                    ))}
                  </div>
                  <p className="partner-muted">
                    {uk
                      ? "Остаточні межі ролей, передача до стандартної операційної роботи та відповідальність після пілота потребують спільного погодження. Внутрішній розподіл партнерського доходу не визначено."
                      : "Final role boundaries, handover into standard operations and post-pilot accountability require agreement. Internal allocation of partner revenue is not set."}
                  </p>
                </article>

                <article className="partner-card">
                  <p className="partner-kicker">
                    {uk ? "Оплата замовника" : "Client payment basis"}
                  </p>
                  <h2>
                    {uk
                      ? "Оплата за здачею і прийманням пакета"
                      : "Payment follows package delivery and acceptance"}
                  </h2>
                  <p className="partner-body">{CLIENT_PAYMENT_TERMS.due[uk ? "uk" : "en"]}</p>
                  <p className="partner-body">
                    {CLIENT_PAYMENT_TERMS.firstPaymentFormula[uk ? "uk" : "en"]}
                  </p>
                  <p className="partner-muted">
                    {CLIENT_PAYMENT_TERMS.remainingPayments[uk ? "uk" : "en"]}
                  </p>
                  <p className="partner-no-submit">
                    {uk
                      ? "Це правило клієнтської пропозиції, а не встановлений графік виплат між партнерами."
                      : "This is the client-facing payment rule, not an agreed schedule for payments among partners."}
                  </p>
                </article>
              </div>
              <aside className="partner-order-side">
                <div className="partner-card partner-side-sticky">
                  <p className="partner-kicker">
                    {uk ? "Що залишається відкритим" : "Open commercial inputs"}
                  </p>
                  <ul className="partner-bullet-list">
                    <li>
                      {uk
                        ? "Погоджений обсяг кожного пакета та його критерії приймання."
                        : "Agreed package scope and acceptance criteria."}
                    </li>
                    <li>
                      {uk
                        ? "Години за декомпозицією робіт і ставки кожної партнерської ролі."
                        : "Work-breakdown hours and rates for each partner role."}
                    </li>
                    <li>
                      {uk
                        ? "Ціна розробки, повторного використання графа/пошуку й підтверджені зовнішні витрати."
                        : "Development price, graph/search reuse compensation and confirmed external costs."}
                    </li>
                    <li>
                      {uk
                        ? "Ціна постпілотного продовження, публічного доступу й підтримки."
                        : "Post-pilot continuation, public access and support pricing."}
                    </li>
                  </ul>
                  <p className="partner-muted">
                    {uk
                      ? "Ціни, внутрішній розподіл доходу й частки партнерів не виводяться без погоджених джерельних даних."
                      : "Prices, internal revenue allocation and partner shares are not derived without approved source inputs."}
                  </p>
                  <Button
                    className="partner-primary-button partner-full-button"
                    onClick={() => setView("workspace")}
                  >
                    {uk ? "Відкрити пошук і конфігурацію" : "Open search and configuration"}
                    <ArrowRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    className="partner-outline-button partner-full-button"
                    onClick={() => setView("order")}
                  >
                    {uk ? "Переглянути кошторис і рішення" : "Review cost model and decisions"}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </aside>
            </div>
          </section>
        )}

        {view === "workspace" && workspaceMode === "experts" && (
          <section className="partner-view" id="partner-experts">
            <SectionHeading
              number="01"
              title={i18n.experts}
              subtitle={
                uk
                  ? "Оглядова когорта з CRM-записів відображається лише через випадкові псевдоніми та широкі сектори."
                  : "The CRM-derived review cohort is shown only through random pseudonyms and broad sectors."
              }
            />
            <div className="partner-warning">
              <ShieldCheck size={18} />
              <p>{i18n.privacy}</p>
            </div>
            {!preview && !loadError && <div className="partner-card">{i18n.load}</div>}
            {preview && (
              <>
                <div
                  className="partner-metrics"
                  aria-label={uk ? "Показники пошуку" : "Search metrics"}
                >
                  <button
                    type="button"
                    className="partner-metric"
                    onClick={() => {
                      setSectorFilters([]);
                    }}
                  >
                    <span>{uk ? "Виявлено у наборі" : "Identified in source set"}</span>
                    <strong>{numberFormat(preview.recordCount, locale)}</strong>
                    <small>
                      {uk ? "Псевдонімізовані записи демо" : "Pseudonymized demonstration records"}
                    </small>
                  </button>
                  <button
                    type="button"
                    className="partner-metric"
                    onClick={() => {
                      setFilterPanel(filterPanel === "sector" ? null : "sector");
                      setSelectedCandidateId("");
                    }}
                  >
                    <span>{i18n.pipeline}</span>
                    <strong>{numberFormat(filteredSectors.length, locale)}</strong>
                    <small>{uk ? "Категорії · фільтрувати" : "Categories · filter"}</small>
                  </button>
                </div>
                <div
                  className="partner-search-context"
                  aria-label={uk ? "Додаткові показники пошуку" : "Additional search indicators"}
                >
                  <div>
                    <strong>{numberFormat(visibleCandidates.length, locale)}</strong>
                    <span>{uk ? "у поточній когорті" : "in current cohort"}</span>
                  </div>
                  <div>
                    <strong>{numberFormat(activeSelectedCandidates.length, locale)}</strong>
                    <span>{uk ? "відібрано для планування" : "selected for planning"}</span>
                  </div>
                </div>
                <p className="partner-muted">{i18n.selectionLifecycle}</p>

                {filterPanel && (
                  <div className="partner-filter-panel">
                    <div className="partner-filter-head">
                      <h3>{i18n.selectFilters}</h3>
                      <button
                        type="button"
                        aria-label={uk ? "Закрити фільтри" : "Close filters"}
                        onClick={() => setFilterPanel(null)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="partner-filter-grid">
                      {filterPanel === "sector"
                        ? preview.sectors.map((item) => (
                            <label key={item.value} className="partner-checkbox-row">
                              <input
                                type="checkbox"
                                checked={sectorFilters.includes(item.value)}
                                onChange={() =>
                                  setSectorFilters((items) => toggleArrayValue(items, item.value))
                                }
                              />
                              <span>{item.value}</span>
                              <small>{numberFormat(item.count, locale)}</small>
                            </label>
                          ))
                        : null}
                    </div>
                    <p className="partner-muted">
                      {uk
                        ? "Імена, CRM ID, контакти, організації, посади, індивідуальна експертиза, географія, джерела та прапорці перевірки вилучені з відповіді для браузера. Залишені лише випадкові псевдоніми й широкі сектори; це знижує ризик, але не гарантує анонімності."
                        : "Names, CRM IDs, contacts, organizations, titles, individual expertise, geography, sources and verification flags are excluded from the browser response. Only random pseudonyms and broad sectors remain; this reduces risk but does not guarantee anonymity."}
                    </p>
                  </div>
                )}

                <div className="partner-graph-layout">
                  <div className="partner-card partner-graph-card">
                    <div className="partner-card-head">
                      <div>
                        <p className="partner-kicker">{uk ? "Граф експертів" : "Expert graph"}</p>
                        <h2>
                          {uk
                            ? `${visibleCandidates.length} експертних записів у поточному відборі`
                            : `${visibleCandidates.length} expert records in the current cohort`}
                        </h2>
                      </div>
                      <span className="partner-node-legend">
                        <i />
                        {uk ? "Категорії CRM" : "CRM categories"}
                      </span>
                    </div>
                    {visibleCandidates.length ? (
                      <Suspense
                        fallback={
                          <div className="partner-graph-fallback">
                            {uk ? "Завантаження графа…" : "Loading graph…"}
                          </div>
                        }
                      >
                        <PartnerGraph
                          nodes={graphNodes}
                          links={expertGraphLinks}
                          selectedId={selectedCandidateId}
                          onSelect={(node) => {
                            if (node.kind === "candidate") setSelectedCandidateId(node.id);
                          }}
                          height={440}
                        />
                      </Suspense>
                    ) : (
                      <p className="partner-empty">{i18n.noCandidates}</p>
                    )}
                    <p className="partner-graph-caption">
                      {uk
                        ? "Лінії позначають лише категорію, записану в CRM. Вони не означають соціальний зв’язок, довіру чи інтерес."
                        : "Lines indicate only a category recorded in CRM. They do not imply social connection, trust or interest."}
                    </p>
                  </div>
                  <aside className="partner-card partner-dossier" aria-live="polite">
                    {selectedCandidateId ? (
                      <CandidateDossier
                        candidateId={selectedCandidateId}
                        candidates={visibleCandidates}
                        selected={draft.selectedCandidateIds.includes(selectedCandidateId)}
                        locale={locale}
                        onToggle={() =>
                          updateDraft(
                            "selectedCandidateIds",
                            toggleArrayValue(draft.selectedCandidateIds, selectedCandidateId),
                          )
                        }
                        strings={i18n}
                      />
                    ) : (
                      <div className="partner-dossier-empty">
                        <Users size={22} />
                        <h2>{uk ? "Міні-досьє" : "Mini-dossier"}</h2>
                        <p>
                          {uk
                            ? "Оберіть вузол або запис у списку, щоб переглянути міні-досьє."
                            : "Select a node or record from the list to view its mini-dossier."}
                        </p>
                        <div className="partner-selected-count">
                          <CheckCircle2 size={16} />
                          {i18n.selected}: {numberFormat(activeSelectedCandidates.length, locale)}
                        </div>
                      </div>
                    )}
                  </aside>
                </div>

                <details className="partner-card partner-candidate-section">
                  <summary className="partner-candidate-summary">
                    <div>
                      <p className="partner-kicker">{uk ? "Перелік експертів" : "Expert list"}</p>
                      <h2>{uk ? "Записи в поточному фільтрі" : "Records in the current filter"}</h2>
                    </div>
                    <span className="partner-candidate-disclosure">
                      <span className="partner-candidate-open-label">
                        {uk ? "Розгорнути" : "Expand"}
                      </span>
                      <span className="partner-candidate-close-label">
                        {uk ? "Згорнути" : "Collapse"}
                      </span>
                      <span className="partner-count-pill">{visibleCandidates.length}</span>
                      <ChevronDown size={18} aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="partner-candidate-content">
                    <div className="partner-candidate-list">
                      {visibleCandidates.slice(0, 80).map((candidate) => (
                        <button
                          key={candidate.id}
                          type="button"
                          className={`partner-candidate ${selectedCandidateId === candidate.id ? "is-selected" : ""}`}
                          onClick={() => setSelectedCandidateId(candidate.id)}
                        >
                          <strong>{candidate.name}</strong>
                          <span>{candidate.sector}</span>
                          <small>
                            {uk ? "Псевдонімізований демо-профіль" : "Pseudonymized demo profile"}
                          </small>
                        </button>
                      ))}
                    </div>
                    {visibleCandidates.length > 80 && (
                      <p className="partner-muted">
                        {uk
                          ? `Показано 80 із ${visibleCandidates.length} записів; використайте фільтри, щоб звузити перелік.`
                          : `Showing 80 of ${visibleCandidates.length} records; use filters to narrow the list.`}
                      </p>
                    )}
                  </div>
                </details>
                <div className="partner-footer-actions">
                  <Button
                    className="partner-primary-button"
                    onClick={() => setWorkspaceMode("configurator")}
                  >
                    {uk ? "Перейти до налаштувань" : "Continue to settings"}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            )}
          </section>
        )}

        {view === "workspace" && workspaceMode === "configurator" && (
          <section className="partner-view" id="partner-configurator">
            <SectionHeading
              number="01"
              title={i18n.configurator}
              subtitle={
                uk
                  ? "Центр — сесії спільного проєктування; перше коло — MVP пілота; зовнішнє — майбутні сервіси."
                  : "Co-design sessions at the center; pilot MVP in the first ring; later services outside."
              }
            />
            <div className="partner-config-top">
              <div className="partner-legend">
                <span>
                  <i className="partner-dot partner-dot-session" />
                  {uk ? "Сесії" : "Sessions"}
                </span>
                <span>
                  <i className="partner-dot partner-dot-mvp" />
                  {i18n.mvp}
                </span>
                <span>
                  <i className="partner-dot partner-dot-pilot" />
                  {i18n.pilot}
                </span>
                <span>
                  <i className="partner-dot partner-dot-later" />
                  {i18n.later}
                </span>
                <span>
                  <i className="partner-dot partner-dot-experts" />
                  {uk ? "Потенційні експерти" : "Potential experts"}
                </span>
              </div>
              <p className="partner-loop">
                <WorkflowIcon />
                {i18n.loop}
              </p>
            </div>
            <div className="partner-graph-layout partner-config-layout">
              <div className="partner-card partner-graph-card">
                <div className="partner-card-head">
                  <div>
                    <p className="partner-kicker">{uk ? "Граф сервісів" : "Service graph"}</p>
                    <h2>
                      {uk ? "Функції та потенційні експерти" : "Functions and potential experts"}
                    </h2>
                  </div>
                  <span className="partner-node-legend">
                    <i />
                    {uk ? "Вибрано" : "Selected"}
                  </span>
                </div>
                <Suspense
                  fallback={
                    <div className="partner-graph-fallback">
                      {uk ? "Завантаження графа…" : "Loading graph…"}
                    </div>
                  }
                >
                  <PartnerGraph
                    nodes={featureGraph.nodes}
                    links={featureGraph.links}
                    selectedId={selectedFunctionId}
                    onSelect={(node) => {
                      if (PROPOSAL_FUNCTIONS.some((item) => item.id === node.id)) {
                        setSelectedFunctionId(node.id);
                        setSelectedCandidateId("");
                      } else if (node.id.startsWith("potential-expert:")) {
                        setSelectedCandidateId(node.id.slice("potential-expert:".length));
                      }
                    }}
                    height={500}
                    radialLayout
                  />
                </Suspense>
                <div className="partner-graph-caption">
                  {uk
                    ? `Чотири функціональні кола: 1) консультації → 2) MVP додатку → 3) функціональність, потрібна для пілота → 4) усі інші функціональності. Потенційні експерти (${featureGraph.candidateCount}) відображаються окремими вузлами за межами цих кіл. ⚠️ ASSUMPTION: відповідність визначається категоріями CRM і поточними фільтрами; це не підтверджує інтересу, згоди чи кваліфікації. Лінії показують залежності й цикл зворотного зв’язку.`
                    : `Four functional rings: 1) consultations → 2) application MVP → 3) functionality required to run the pilot → 4) all other functionality. Potential experts (${featureGraph.candidateCount}) are separate nodes outside these rings. ⚠️ ASSUMPTION: matches are based on CRM categories and current filters; they do not establish interest, consent or qualification. Links show dependencies and the feedback loop.`}
                </div>
              </div>
              <aside
                className="partner-card partner-dossier partner-function-dossier"
                aria-live="polite"
              >
                {selectedCandidateId ? (
                  <CandidateDossier
                    candidateId={selectedCandidateId}
                    candidates={visibleCandidates}
                    selected={draft.selectedCandidateIds.includes(selectedCandidateId)}
                    locale={locale}
                    onToggle={() =>
                      updateDraft(
                        "selectedCandidateIds",
                        toggleArrayValue(draft.selectedCandidateIds, selectedCandidateId),
                      )
                    }
                    strings={i18n}
                  />
                ) : (
                  <FunctionDossier
                    feature={selectedFunction}
                    locale={locale}
                    selected={draft.selectedFunctionIds.includes(selectedFunction.id)}
                    onToggle={() =>
                      updateDraft(
                        "selectedFunctionIds",
                        toggleArrayValue(draft.selectedFunctionIds, selectedFunction.id),
                      )
                    }
                    onFindExperts={() => {
                      setView("workspace");
                      setWorkspaceMode("experts");
                      setFilterPanel(null);
                      setSelectedCandidateId("");
                    }}
                    onDocument={() => setDocumentOpen(true)}
                  />
                )}
              </aside>
            </div>
            <div className="partner-function-groups">
              <FunctionList
                title={uk ? "MVP додатку" : "Application MVP"}
                items={PROPOSAL_FUNCTIONS.filter((item) => item.group === "mvp")}
                selectedId={selectedFunctionId}
                selectedIds={draft.selectedFunctionIds}
                locale={locale}
                onSelect={(id) => {
                  setSelectedFunctionId(id);
                  setSelectedCandidateId("");
                }}
                onToggle={(id) =>
                  updateDraft(
                    "selectedFunctionIds",
                    toggleArrayValue(draft.selectedFunctionIds, id),
                  )
                }
              />
              <FunctionList
                title={uk ? "Функції, необхідні для пілота" : "Pilot-required functionality"}
                items={PROPOSAL_FUNCTIONS.filter((item) => item.group === "pilot")}
                selectedId={selectedFunctionId}
                selectedIds={draft.selectedFunctionIds}
                locale={locale}
                onSelect={(id) => {
                  setSelectedFunctionId(id);
                  setSelectedCandidateId("");
                }}
                onToggle={(id) =>
                  updateDraft(
                    "selectedFunctionIds",
                    toggleArrayValue(draft.selectedFunctionIds, id),
                  )
                }
              />
              <FunctionList
                title={uk ? "Усі інші функціональності" : "All other functionality"}
                items={PROPOSAL_FUNCTIONS.filter((item) => item.group === "later")}
                selectedId={selectedFunctionId}
                selectedIds={draft.selectedFunctionIds}
                locale={locale}
                onSelect={(id) => {
                  setSelectedFunctionId(id);
                  setSelectedCandidateId("");
                }}
                onToggle={(id) =>
                  updateDraft(
                    "selectedFunctionIds",
                    toggleArrayValue(draft.selectedFunctionIds, id),
                  )
                }
              />
            </div>
            <div className="partner-footer-actions">
              <Button
                variant="outline"
                className="partner-outline-button"
                onClick={() => setWorkspaceMode("experts")}
              >
                <Search size={16} />
                {i18n.experts}
              </Button>
              <Button className="partner-primary-button" onClick={() => setView("order")}>
                {uk ? "Перейти до погодження й бюджету" : "Continue to review and budget"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </section>
        )}

        {view === "order" && (
          <section className="partner-view" id="partner-order">
            <SectionHeading
              number="03"
              title={i18n.order}
              subtitle={
                uk
                  ? "Перевірте чотири скоупи, партнерські ставки й розрахункові входи. Порожні значення не вважаються нулем."
                  : "Review the four scopes, partner rates and calculation inputs. Blank values are never treated as zero."
              }
            />
            <div className="partner-warning">
              <AlertTriangle size={18} />
              <p>
                {uk
                  ? "У бюджеті три партнерські ролі; окремо порівнюються три методи ціноутворення для однакового scope. Залишкова розробка та повторне використання графа/пошуку — окремі витрати проєкту. Це чернетка для погодження, не затверджена ціна клієнту."
                  : "Partner roles are priced separately; the calculator is a working comparison model, not an approved client quote. Residual software work and graph/search reuse are separate cost inputs. The four commercial scopes remain distinct; post-pilot scope is not assumed to be part of the pilot."}
              </p>
            </div>
            <div className="partner-order-grid">
              <div className="partner-order-main">
                <article className="partner-card" id="partner-scope">
                  <div className="partner-card-head">
                    <div>
                      <p className="partner-kicker">ISRM · pilot</p>
                      <h2>{uk ? "Мета та пропонований пілот" : "Purpose and proposed pilot"}</h2>
                    </div>
                    <span className="partner-stage-badge">
                      {uk ? "На погодження" : "For review"}
                    </span>
                  </div>
                  <p className="partner-body">
                    {uk
                      ? "Визначити пріоритети розвитку й прогалини експертизи; спільно з замовником спроєктувати Trust & Influence Index (TII) як метод, а не готовий бал; визначити групу рецензентів; перевірити погоджені функції застосунку; виміряти фактичну трудомісткість і провести дозволений цикл серед наявної спільноти."
                      : "Set development priorities and expertise gaps; co-design Trust & Influence Index (TII) as a methodology, not a ready-made score; define a reviewer group; test approved application functions; measure actual effort; and run an authorized cycle with the existing community."}
                  </p>
                  <div className="partner-pilot-sequence">
                    {[
                      [
                        uk ? "1 · Спільне проєктування" : "1 · Co-design",
                        uk
                          ? "Стратегія, індекс, критерії та протокол."
                          : "Strategy, index, criteria and protocol.",
                      ],
                      [
                        uk ? "2 · Група рецензентів" : "2 · Reviewer group",
                        uk
                          ? "Відбір керівників практик і регіональних представників; рівень навчання — за базовою перевіркою."
                          : "Select practice leaders and regional representatives; size training after a baseline check.",
                      ],
                      [
                        uk ? "3 · Дозволений пілот" : "3 · Authorized pilot",
                        uk
                          ? "Обмежена когорта, контроль приватності, вимірювання часу й результатів."
                          : "Bounded cohort, privacy gate, observed time and outcome measurement.",
                      ],
                      [
                        uk ? "4 · Рішення борду" : "4 · Board decision",
                        uk
                          ? "Звіт про цінність, витрати, прогалини та наступні функції без заяв про причинність."
                          : "Evidence on value, cost, gaps and next functions without unsupported causal claims.",
                      ],
                    ].map(([title, text]) => (
                      <div className="partner-pilot-step" key={title}>
                        <strong>{title}</strong>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </article>
                <ProjectBudget
                  locale={locale}
                  draft={draft}
                  updateDraft={updateDraft}
                  effort={projectEffort}
                  showAssumptions={showAssumptions}
                  setShowAssumptions={setShowAssumptions}
                />
                <article className="partner-card" id="partner-decisions">
                  <div className="partner-card-head">
                    <div>
                      <p className="partner-kicker">
                        {uk ? "Перевірка партнерами" : "Partner review"}
                      </p>
                      <h2>
                        {uk
                          ? "Рішення щодо трьох партнерських скоупів"
                          : "Decisions on the three partner scopes"}
                      </h2>
                    </div>
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="partner-muted">
                    {uk
                      ? "Внесіть підтверджену або запропоновану ставку для кожної ролі; гонорар перераховується за внесеними годинами відповідних пакетів. Розробка й компенсація за повторне використання графа/пошуку показані окремими компонентами."
                      : "Enter a sourced or proposed rate for each role; fees recalculate against entered hours for the relevant work packages. Software development and graph/search reuse compensation are separate cost components."}
                  </p>
                  <div className="partner-decision-list">
                    {PARTNER_ROLES.map((role) => {
                      const label = copy(role.name, locale);
                      return (
                        <div className="partner-decision-row" key={role.id}>
                          <div>
                            <strong>{label}</strong>
                            <small>{uk ? "Партнерська роль · ціна" : "Partner role · price"}</small>
                          </div>
                          <select
                            aria-label={`${label} decision`}
                            value={draft.reviewDecisions[`scope-${role.id}`] || ""}
                            onChange={(event) =>
                              updateDraft("reviewDecisions", {
                                ...draft.reviewDecisions,
                                [`scope-${role.id}`]: event.target.value,
                              })
                            }
                          >
                            <option value="">{uk ? "Оберіть рішення" : "Select decision"}</option>
                            <option value="agree">{uk ? "Погоджую" : "Agree"}</option>
                            <option value="revise">
                              {uk ? "Пропоную зміни" : "Propose changes"}
                            </option>
                            <option value="discuss">
                              {uk ? "Потрібне обговорення" : "Discuss"}
                            </option>
                          </select>
                          <textarea
                            rows={2}
                            aria-label={`${label} ${i18n.comments}`}
                            placeholder={i18n.comments}
                            value={draft.reviewComments[`scope-${role.id}`] || ""}
                            onChange={(event) =>
                              updateDraft("reviewComments", {
                                ...draft.reviewComments,
                                [`scope-${role.id}`]: event.target.value,
                              })
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </article>
                <article className="partner-card" id="partner-scope-decisions">
                  <div className="partner-card-head">
                    <div>
                      <p className="partner-kicker">
                        {uk ? "Партнерський перегляд" : "Partner review"}
                      </p>
                      <h2>
                        {uk
                          ? "Рішення за кожним комерційним скоупом"
                          : "Partner decision on each commercial scope"}
                      </h2>
                    </div>
                    <FileText size={20} />
                  </div>
                  <p className="partner-muted">
                    {uk
                      ? "Ці позначки є локальним робочим записом, а не зобов’язанням чи підтвердженням замовника. Пакет 4 — постпілотний і не входить до ціни пілота за замовчуванням."
                      : "These selections are local working notes, not a commitment or client approval. Package 4 is post-pilot and is not included in the pilot price by default."}
                  </p>
                  {CLIENT_PACKAGES.map((item) => (
                    <div className="partner-client-input" key={item.id}>
                      <label htmlFor={`scope-decision-${item.id}`}>
                        {item.title[uk ? "uk" : "en"]}
                      </label>
                      <select
                        id={`scope-decision-${item.id}`}
                        value={draft.reviewDecisions[`package-${item.id}`] || ""}
                        onChange={(event) =>
                          updateDraft("reviewDecisions", {
                            ...draft.reviewDecisions,
                            [`package-${item.id}`]: event.target.value,
                          })
                        }
                      >
                        <option value="">{uk ? "Оберіть рішення" : "Select decision"}</option>
                        <option value="agree">
                          {uk ? "Погоджую обсяг для оцінки" : "Scope accepted for costing"}
                        </option>
                        <option value="revise">{uk ? "Потрібні зміни" : "Changes required"}</option>
                        <option value="discuss">{uk ? "Потрібне обговорення" : "Discuss"}</option>
                      </select>
                      <textarea
                        rows={2}
                        aria-label={`${item.title[uk ? "uk" : "en"]} ${i18n.comments}`}
                        placeholder={i18n.comments}
                        value={draft.reviewComments[`package-${item.id}`] || ""}
                        onChange={(event) =>
                          updateDraft("reviewComments", {
                            ...draft.reviewComments,
                            [`package-${item.id}`]: event.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                  <p className="partner-field-label">{i18n.addFunction}</p>
                  <div className="partner-additional-function">
                    {ADDITIONAL_FUNCTION_FIELDS.map((field) => (
                      <label key={field.id} htmlFor={`additional-function-${field.id}`}>
                        <span>{uk ? field.uk : field.en}</span>
                        <textarea
                          id={`additional-function-${field.id}`}
                          rows={field.rows}
                          value={draft.additionalFunction[field.id]}
                          onChange={(event) =>
                            updateDraft("additionalFunction", {
                              ...draft.additionalFunction,
                              [field.id]: event.target.value,
                            })
                          }
                        />
                        <small>
                          {copyText(
                            "A blank fee remains TBD; 0 is an explicit waiver, not an assumed free reuse.",
                            "Порожня плата лишається TBD; 0 — явне скасування, а не припущення про безкоштовне повторне використання.",
                          )}
                        </small>
                      </label>
                    ))}
                  </div>
                  <label className="partner-field-label" htmlFor="partner-general-comment">
                    {uk ? "Загальний коментар" : "General comment"}
                  </label>
                  <textarea
                    id="partner-general-comment"
                    rows={4}
                    value={draft.generalComment}
                    onChange={(event) => updateDraft("generalComment", event.target.value)}
                    placeholder={i18n.comments}
                  />
                </article>
              </div>
              <aside className="partner-order-side">
                <div className="partner-card partner-side-sticky">
                  <p className="partner-kicker">{uk ? "Етап 3 із 3" : "Stage 3 of 3"}</p>
                  <div className="partner-next-owner">
                    <ArrowRight size={16} />
                    {uk
                      ? "Тут партнери документують свої пропозиції й рішення за кожним скоупом. Замовник має окремий маршрут і окремий розрахунковий екран."
                      : "Partners record their proposed inputs and decisions for each scope here. The client has a separate route and separate calculation page."}
                  </div>
                </div>
                <div className="partner-card">
                  <p className="partner-kicker">{i18n.localDraft}</p>
                  <p className="partner-muted">
                    {uk
                      ? "Збереження локальне; спільного сховища або сервісу подання не налаштовано."
                      : "Local storage only; no shared store or submission service is configured."}
                  </p>
                  {draftLoaded && (
                    <p className="partner-draft-status">
                      <Check size={15} />
                      {uk ? "Поточні зміни ще не збережені" : "Current changes are not yet saved"}
                    </p>
                  )}
                  {saveNotice && (
                    <p className="partner-save-notice" role="status">
                      {saveNotice}
                    </p>
                  )}
                  {draftError && (
                    <p className="partner-error" role="alert">
                      {draftError}
                    </p>
                  )}
                  <Button
                    className="partner-primary-button partner-full-button"
                    onClick={saveLocalDraft}
                  >
                    <CheckCircle2 size={16} />
                    {i18n.save}
                  </Button>
                  <Button
                    variant="outline"
                    className="partner-outline-button partner-full-button"
                    onClick={exportDraft}
                  >
                    <ArrowDownToLine size={16} />
                    {i18n.export}
                  </Button>
                  <p className="partner-no-submit">{i18n.noSubmit}</p>
                </div>
              </aside>
            </div>
          </section>
        )}

        <footer className="partner-footer">
          <span>
            <LockKeyhole size={14} />
            {uk ? "Внутрішня чернетка · локальні дані" : "Internal draft · local data"}
          </span>
          <span>
            {uk
              ? "Цілі доступності: WCAG 2.2 AA; формальна відповідність не аудитувалась."
              : "Accessibility target: WCAG 2.2 AA; formal conformance not audited."}
          </span>
        </footer>
      </div>

      {documentOpen && (
        <div
          className="partner-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDocumentOpen(false);
          }}
        >
          <section
            className="partner-document-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-doc-title"
          >
            <div className="partner-card-head">
              <div>
                <p className="partner-kicker">{uk ? "Документний центр" : "Document centre"}</p>
                <h2 id="partner-doc-title">{i18n.viewSources}</h2>
              </div>
              <div className="partner-document-tools">
                <LocaleSwitch
                  locale={locale}
                  onChange={setLocale}
                  label={uk ? "Мова документів" : "Document language"}
                />
                <button
                  type="button"
                  aria-label={uk ? "Закрити" : "Close"}
                  onClick={() => setDocumentOpen(false)}
                >
                  <X />
                </button>
              </div>
            </div>
            <p className="partner-body">
              {uk
                ? "У проєкті зараз доступний повний опис. Розрахункова книга, згадана в попередніх чернетках, у цій теці відсутня й не додається до пропозиції; ціни та підсумки залишаються TBD. Демо й локальні чернетки не мають контролю партнерського доступу — не надсилайте URL з даними мережі до налаштування автентифікації та авторизації."
                : "The full project description is the only supporting file currently available. The calculation workbook mentioned in earlier drafts is absent from this project and is not attached; prices and totals remain TBD. The demo and local drafts do not enforce partner access—do not share a URL containing network data before authentication and authorization are configured."}
            </p>
            <div className="partner-document-list">
              {SUPPORTING_DOCUMENTS.map((item) => (
                <a href={item.href} download className="partner-document-row" key={item.id}>
                  <span className="partner-document-icon">
                    <FileText size={17} />
                  </span>
                  <span>
                    <strong>{copy(item.title, locale)}</strong>
                    <small>{copy(item.purpose, locale)}</small>
                  </span>
                  <ArrowRight size={16} />
                </a>
              ))}
            </div>
            <div className="partner-source-register">
              <h3>{uk ? "Зовнішні методичні джерела" : "External practice references"}</h3>
              <ul>
                {MARKET_BENCHMARKS.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                      <ArrowRight size={13} />
                    </a>
                    <small>{source.period}</small>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="partner-section-heading">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function CandidateDossier({
  candidateId,
  candidates,
  selected,
  locale,
  onToggle,
  strings,
}: {
  candidateId: string;
  candidates: PartnerPreviewData["candidates"];
  selected: boolean;
  locale: string;
  onToggle: () => void;
  strings: Record<string, string>;
}) {
  const candidate = candidates.find((item) => item.id === candidateId);
  const uk = locale === "uk";
  return (
    <div className="partner-mini-dossier">
      <p className="partner-kicker">{strings.miniDossier}</p>
      <h2>{candidate?.name || (uk ? "Запис не знайдено" : "Record not found")}</h2>
      {candidate && (
        <dl>
          <div>
            <dt>{uk ? "Узагальнений сектор" : "Broad sector group"}</dt>
            <dd>{candidate.sector}</dd>
          </div>
          <div></div>
        </dl>
      )}
      <p className="partner-inline-note">
        <ShieldCheck size={15} />
        {strings.sourceOnly}
      </p>
      <p className="partner-muted">{strings.designNote}</p>
      <div className="partner-dossier-underdev">
        <LockKeyhole size={16} />
        <span>
          <strong>{strings.fullDossier}</strong>
          <small>
            {uk
              ? "Потрібні окремі підстава доступу, згода та контроль розкриття."
              : "Requires separate access basis, consent and disclosure controls."}
          </small>
        </span>
      </div>
      <Button
        className={
          selected
            ? "partner-outline-button partner-full-button"
            : "partner-primary-button partner-full-button"
        }
        onClick={onToggle}
      >
        {selected ? <X size={15} /> : <Check size={15} />}
        {selected ? strings.remove : strings.choose}
      </Button>
    </div>
  );
}

function FunctionDossier({
  feature,
  locale,
  selected,
  onToggle,
  onFindExperts,
  onDocument,
}: {
  feature: ProposalFunction;
  locale: string;
  selected: boolean;
  onToggle: () => void;
  onFindExperts: () => void;
  onDocument: () => void;
}) {
  const uk = locale === "uk";
  const role = PARTNER_ROLES.find((item) => item.id === feature.owner);
  const dependencyTitles = feature.dependencies.map((dependency) => {
    const functionItem = PROPOSAL_FUNCTIONS.find((item) => item.id === dependency);
    const sessionItem = CO_DESIGN_SESSIONS.find((item) => item.id === dependency);
    return functionItem
      ? copy(functionItem.title, locale)
      : sessionItem
        ? copy(sessionItem.title, locale)
        : dependency;
  });
  return (
    <div className="partner-function-detail">
      <div className="partner-card-head">
        <div>
          <p className="partner-kicker">
            {feature.group === "mvp"
              ? uk
                ? "MVP пілота"
                : "Pilot MVP"
              : feature.group === "pilot"
                ? uk
                  ? "Функція пілота"
                  : "Pilot function"
                : uk
                  ? "Пізніший етап"
                  : "Later phase"}
          </p>
          <h2>{copy(feature.title, locale)}</h2>
        </div>
        <span className={`partner-function-mark ${feature.group}`}>
          {feature.group === "mvp" ? "MVP" : feature.group === "pilot" ? "PILOT" : "LATER"}
        </span>
      </div>
      <p className="partner-body">{copy(feature.purpose, locale)}</p>
      <DetailSection
        title={uk ? "Ключові можливості" : "Key capabilities"}
        items={feature.capabilities.map((item) => copy(item, locale))}
      />
      <DetailSection title={uk ? "Залежить від" : "Dependencies"} items={dependencyTitles} />
      <dl className="partner-function-facts">
        <div>
          <dt>{uk ? "Роль у пілоті" : "Pilot role"}</dt>
          <dd>{copy(feature.pilotRole, locale)}</dd>
        </div>
        <div>
          <dt>{uk ? "KPI · формула вимірювання" : "KPI · measurement formula"}</dt>
          <dd>{copy(feature.kpi, locale)}</dd>
        </div>
        <div>
          <dt>{uk ? "Вплив на результат" : "Project impact"}</dt>
          <dd>{copy(feature.impact, locale)}</dd>
        </div>
        <div>
          <dt>{uk ? "Етап" : "Proposed phase"}</dt>
          <dd>{copy(feature.phase, locale)}</dd>
        </div>
        <div>
          <dt>{uk ? "Критерій приймання" : "Acceptance criterion"}</dt>
          <dd>{copy(feature.acceptance, locale)}</dd>
        </div>
        <div>
          <dt>{uk ? "Власник функції" : "Function owner"}</dt>
          <dd>{role ? copy(role.name, locale) : uk ? "Замовник / борд" : "Client / board"}</dd>
        </div>
        <div>
          <dt>{uk ? "Підстава" : "Basis"}</dt>
          <dd>{feature.source}</dd>
        </div>
      </dl>
      <div className="partner-function-actions">
        <Button variant="outline" className="partner-outline-button" onClick={onFindExperts}>
          <Search size={15} />
          {uk ? "Підібрати за категоріями" : "Search by category"}
        </Button>
        <Button
          className={selected ? "partner-outline-button" : "partner-primary-button"}
          onClick={onToggle}
        >
          {selected ? <Check size={15} /> : <ArrowRight size={15} />}
          {selected
            ? uk
              ? "У замовленні"
              : "In order"
            : uk
              ? "Додати до замовлення"
              : "Add to order"}
        </Button>
        <Button variant="ghost" className="partner-doc-link" onClick={onDocument}>
          <BookOpen size={15} />
          {uk ? "Відкрити пояснення й джерела" : "Open explanation and sources"}
        </Button>
      </div>
    </div>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="partner-detail-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function FunctionList({
  title,
  items,
  selectedId,
  selectedIds,
  locale,
  onSelect,
  onToggle,
}: {
  title: string;
  items: ProposalFunction[];
  selectedId: string;
  selectedIds: string[];
  locale: string;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <section className="partner-card">
      <div className="partner-card-head">
        <h2>{title}</h2>
        <span className="partner-count-pill">{items.length}</span>
      </div>
      <div className="partner-function-list">
        {items.map((item) => (
          <div
            className={`partner-function-row ${selectedId === item.id ? "is-active" : ""}`}
            key={item.id}
          >
            <button
              type="button"
              className="partner-function-select"
              onClick={() => onSelect(item.id)}
            >
              <span className={`partner-function-dot ${item.group}`} />
              <span>
                <strong>{copy(item.title, locale)}</strong>
                <small>{copy(item.phase, locale)}</small>
              </span>
            </button>
            <label
              className="partner-checkbox-wrap"
              aria-label={`${copy(item.title, locale)} selected for order`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => onToggle(item.id)}
              />
              <span className="sr-only">{copy(item.title, locale)}</span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkflowIcon() {
  return (
    <span className="partner-flow-icon" aria-hidden="true">
      <ArrowRight size={14} />
      <ArrowRight size={14} />
      <ArrowLeft size={14} />
    </span>
  );
}

function ProjectBudget({
  locale,
  draft,
  updateDraft,
  effort,
  showAssumptions,
  setShowAssumptions,
}: {
  locale: string;
  draft: ReviewDraft;
  updateDraft: <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => void;
  effort: ProjectEffort;
  showAssumptions: boolean;
  setShowAssumptions: (value: boolean) => void;
}) {
  const uk = locale === "uk";
  const copyText = (en: string, ua: string) => (uk ? ua : en);
  const actualQuote = nonNegativeNumber(draft.boutiqueQuote);
  const enteredExternalCosts = nonNegativeNumber(draft.externalCosts);
  const enteredDemoUseFee = nonNegativeNumber(draft.demoUseFee);
  const actualExternal = enteredExternalCosts ?? 0;
  const enteredPartnerRates = PARTNER_ROLES.map((role) =>
    nonNegativeNumber(draft.roleRates[role.id] ?? ""),
  );
  const enteredDeveloperRate = nonNegativeNumber(draft.developerRate);
  const ratesComplete =
    PARTNER_ROLES.every(
      (role, index) => effort.partner[role.id] === 0 || enteredPartnerRates[index] !== null,
    ) &&
    (effort.development === 0 || enteredDeveloperRate !== null);
  const partnerLabor = PARTNER_ROLES.reduce(
    (sum, role) =>
      sum + effort.partner[role.id] * (nonNegativeNumber(draft.roleRates[role.id] ?? "") ?? 0),
    0,
  );
  const developmentLabor = effort.development * (enteredDeveloperRate ?? 0);
  const estimateComplete =
    ratesComplete &&
    effort.unestimatedPackages === 0 &&
    effort.dossierComplete &&
    enteredExternalCosts !== null &&
    enteredDemoUseFee !== null;
  const effortComplete = effort.unestimatedPackages === 0;
  const actualSeparateTotal =
    effortComplete && ratesComplete
      ? partnerLabor + developmentLabor + (enteredExternalCosts ?? 0) + (enteredDemoUseFee ?? 0)
      : null;
  const dossierUnitCost = DOSSIER_STAGES.reduce((sum, stage) => {
    if (!stage.costed || stage.role === "client") return sum;
    const minutes = nonNegativeNumber(draft.dossierMinutes[stage.id] ?? "");
    const rate = nonNegativeNumber(draft.roleRates[stage.role] ?? "");
    return minutes === null || rate === null ? sum : sum + (minutes / 60) * rate;
  }, 0);
  const rangeCost = (hours: number, minimum: number, maximum: number) => ({
    minimum: hours * minimum,
    reference: hours * ((minimum + maximum) / 2),
    maximum: hours * maximum,
  });
  const marketRows = [
    {
      label: copyText(
        "Ukraine software provider · USD/provider-hour",
        "Україна, розробка · USD/год постачальника",
      ),
      currency: "USD",
      values: rangeCost(
        effort.development,
        MARKET_BENCHMARKS.software.ukraine.low,
        MARKET_BENCHMARKS.software.ukraine.high,
      ),
    },
    {
      label: copyText(
        "United States software provider · USD/provider-hour",
        "США, розробка · USD/год постачальника",
      ),
      currency: "USD",
      values: rangeCost(
        effort.development,
        MARKET_BENCHMARKS.software.us.low,
        MARKET_BENCHMARKS.software.us.high,
      ),
    },
    {
      label: copyText(
        "Ukraine consulting provider · USD/provider-hour",
        "Україна, консалтинг · USD/год постачальника",
      ),
      currency: "USD",
      values: rangeCost(
        effort.partnerTotal,
        MARKET_BENCHMARKS.consulting.ukraine.low,
        MARKET_BENCHMARKS.consulting.ukraine.high,
      ),
    },
    {
      label: copyText(
        "United States consulting provider · USD/provider-hour",
        "США, консалтинг · USD/год постачальника",
      ),
      currency: "USD",
      values: rangeCost(
        effort.partnerTotal,
        MARKET_BENCHMARKS.consulting.us.low,
        MARKET_BENCHMARKS.consulting.us.high,
      ),
    },
    {
      label: copyText(
        "United Kingdom software contractor · GBP/day ÷ 7.5 hours/day",
        "Велика Британія, розробник-контрактор · GBP/день ÷ 7,5 год/день",
      ),
      currency: "GBP",
      values: rangeCost(
        effort.development,
        MARKET_BENCHMARKS.software.uk.low / MARKET_BENCHMARKS.software.uk.hoursPerDay,
        MARKET_BENCHMARKS.software.uk.high / MARKET_BENCHMARKS.software.uk.hoursPerDay,
      ),
    },
  ];
  return (
    <article className="partner-card partner-budget" id="partner-budget">
      <div className="partner-card-head">
        <div>
          <p className="partner-kicker">
            {uk ? "Три методи ціноутворення · один scope" : "Three pricing methods · one scope"}
          </p>
          <h2>{uk ? "Три методи ціноутворення" : "Three pricing methods"}</h2>
        </div>
        <Wallet size={21} />
      </div>
      <p className="partner-body">
        {copyText(
          "This editable model is a calculation aid, not an agreed client quote. Each partner-rate field is pre-filled with an indicative market comparator (Clutch directory band) and labelled ‘indicative · not an agreed partner rate’; partners can override every value. Hours, dossier effort, graph/search reuse and external-cost inputs start blank to avoid success-shaped zeros and remain TBD-from-measurement until supplied. The derived subtotal is INDICATIVE and stays that way until the client preliminarily approves scope and an acceptable overall budget ceiling.",
          "Ця редагована модель — інструмент розрахунку, а не погоджена ціна для замовника. Кожне поле партнерської ставки попередньо заповнене індикативним ринковим орієнтиром (Clutch directory band) з підписом «[indicative · не погоджена ставка партнера]»; партнер може override кожне поле. Години, трудомісткість досьє, повторне використання графа/пошуку та зовнішні витрати починаються порожніми, щоб уникнути success-shaped нулів, і залишаються TBD-from-measurement до введення. Похідний підсумок є INDICATIVE і залишається таким, доки замовник попередньо не погодить обсяг і прийнятну верхню межу бюджету.",
        )}
      </p>
      <div className="partner-budget-controls">
        <label>
          <span>
            {copyText(
              "Currency for all entered rates and cost inputs · no conversion",
              "Валюта для всіх внесених ставок і витрат · без конвертації",
            )}
          </span>
          <select
            value={draft.currency}
            onChange={(event) =>
              updateDraft("currency", event.target.value as ReviewDraft["currency"])
            }
          >
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
      </div>
      <div className="partner-budget-live-total" role="status" aria-live="polite">
        <div>
          <span>
            {copyText(
              "Indicative project subtotal · selected currency",
              "Індикативний підсумок проєкту · обрана валюта",
            )}
          </span>
          <strong>
            {actualSeparateTotal === null
              ? copyText(
                  "Required hours, rates and other cost inputs are incomplete",
                  "Обов’язкові години, ставки й інші витрати не заповнені",
                )
              : money(actualSeparateTotal, draft.currency, locale)}
          </strong>
        </div>
        <small>
          {actualSeparateTotal !== null
            ? `${copyText("Partner work", "Робота партнерів")}: ${money(partnerLabor, draft.currency, locale)} · ${copyText("Software/data", "Розробка/дані")}: ${money(developmentLabor, draft.currency, locale)}`
            : copyText(
                "Subtotal excludes any role whose proposed rate is blank. Dossier work is charged per record below; reuse and unquoted external costs are excluded until priced.",
                "Підсумок не враховує роль із порожньою запропонованою ставкою. Робота з досьє розраховується за запис нижче; повторне використання й непідтверджені зовнішні витрати виключено до оцінювання.",
              )}
        </small>
      </div>
      <div className="partner-scenario-cards">
        <article className="partner-scenario-card base">
          <span>
            {copyText(
              "Project effort · partner/vendor inputs",
              "Трудовитрати проєкту · входи партнерів/постачальника",
            )}
          </span>
          <strong>
            {effortComplete
              ? `${numberFormat(effort.partnerTotal + effort.development, locale, 1)} h`
              : "TBD"}
          </strong>
          <small>
            {copyText(
              "No unmeasured planning intervals are used as current estimates. Enter a partner/vendor estimate with its work-breakdown basis.",
              "Невиміряні планові інтервали не використовуються як поточна оцінка. Внесіть оцінку партнера/постачальника з декомпозицією робіт.",
            )}
          </small>
          <p>
            {copyText("Partner work", "Партнерська робота")}:{" "}
            <b> {effortComplete ? `${numberFormat(effort.partnerTotal, locale, 1)} h` : "TBD"}</b>
          </p>
          <p>
            {copyText("Software/data", "Розробка/дані")}:{" "}
            <b> {effortComplete ? `${numberFormat(effort.development, locale, 1)} h` : "TBD"}</b>
          </p>
          <p>
            {copyText("Client/board in-kind effort", "Час замовника/борду окремо")}:{" "}
            <b>
              {effort.client === null
                ? copyText("Add a planning value", "Введіть планове значення")
                : `${numberFormat(effort.client, locale, 1)} h`}
            </b>
          </p>
          {effort.unestimatedPackages > 0 ||
          !effort.dossierComplete ||
          enteredExternalCosts === null ||
          enteredDemoUseFee === null ||
          !ratesComplete ? (
            <p className="partner-budget-completeness">
              {copyText(
                `Add a value for ${effort.unestimatedPackages} cleared work package(s), a required rate, dossier measure, graph/search reuse amount or external cost to calculate the total. Excluded cost categories are not represented as included.`,
                `Щоб розрахувати підсумок, додайте значення для ${effort.unestimatedPackages} пакетів робіт, обов’язкової ставки, вимірювання досьє, суми за повторне використання графа/пошуку або зовнішніх витрат. Виключені категорії не вважаються включеними.`,
              )}
            </p>
          ) : null}
          <em>
            {actualSeparateTotal === null
              ? copyText("Add missing planning inputs", "Додайте відсутні планові значення")
              : money(actualSeparateTotal, draft.currency, locale)}
          </em>
        </article>
      </div>
      <div className="partner-role-fee-list">
        <strong>{copyText("Partner fees · three roles", "Партнерські гонорари · три ролі")}</strong>
        <p className="partner-budget-completeness">
          {copyText(
            "Each partner-rate field is pre-filled with an indicative market comparator (Clutch directory band) — source, period and ‘indicative · not an agreed partner rate’ are visible below the input. Edit any value to set the partner’s own rate; the role fee recalculates against the work-package hours entered for that role. The default is a planning reference, not an agreed fee.",
            "Кожне поле партнерської ставки попередньо заповнене індикативним ринковим орієнтиром (Clutch directory band) — джерело, період і підпис «indicative · не погоджена ставка партнера» видимі під полем. Відредагуйте будь-яке значення, щоб встановити власну ставку партнера; гонорар ролі перераховується за годинами пакетів для цієї ролі. Дефолт — планувальний орієнтир, а не погоджений гонорар.",
          )}
        </p>
        {PARTNER_ROLES.map((role) => {
          const rate = nonNegativeNumber(draft.roleRates[role.id] ?? "");
          const amount = rate === null || !effortComplete ? null : effort.partner[role.id] * rate;
          return (
            <div key={role.id}>
              <span>{copy(role.name, locale)}</span>
              <b>
                {!effortComplete
                  ? "TBD"
                  : rate === null && effort.partner[role.id] > 0
                    ? copyText("Hourly rate TBD", "Погодинна ставка TBD")
                    : amount === null
                      ? copyText("No scoped hours", "Години ролі не заплановані")
                      : moneyRate(amount, draft.currency, locale)}
              </b>
              <small>
                {effortComplete
                  ? `${numberFormat(effort.partner[role.id], locale, 1)} h`
                  : copyText("hours TBD", "години TBD")}
              </small>
              <label className="partner-partner-rate">
                <span>{copyText("Proposed rate / hour", "Запропонована ставка / год")}</span>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  aria-label={`${copy(role.name, locale)} ${copyText("proposed hourly rate", "запропонована погодинна ставка")}`}
                  value={draft.roleRates[role.id]}
                  onChange={(event) =>
                    updateDraft("roleRates", {
                      ...draft.roleRates,
                      [role.id]: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          );
        })}
      </div>
      <div className="partner-supporting-costs">
        <strong>
          {copyText(
            "Technical project costs · separate from the three partner prices",
            "Технічні витрати проєкту · окремо від трьох партнерських цін",
          )}
        </strong>
        <div>
          <span>
            {copyText("Remaining application development", "Залишкова розробка застосунку")}
          </span>
          <b>
            {enteredDeveloperRate === null || !effortComplete
              ? "TBD"
              : money(developmentLabor, draft.currency, locale)}
          </b>
          <small>
            {enteredDeveloperRate === null || !effortComplete
              ? copyText("Hours/rate not agreed", "Години/ставка не погоджені")
              : `${numberFormat(effort.development, locale, 1)} h × ${moneyRate(enteredDeveloperRate, draft.currency, locale)}/h`}
          </small>
        </div>
        <div>
          <span>
            {copyText(
              "Graph/search reuse compensation · internal allocation",
              "Компенсація за повторне використання графа/пошуку · внутрішній розподіл",
            )}
          </span>
          <b>
            {enteredDemoUseFee === null
              ? copyText("Not priced · excluded", "Не оцінено · виключено")
              : money(enteredDemoUseFee, draft.currency, locale)}
          </b>
          <small>
            {copyText(
              "Included once in this planning total; do not add a second client line if already covered by the contract price.",
              "Враховується в цій плановій сумі один раз; не додавати окремим рядком клієнту, якщо вже включено в ціну договору.",
            )}
          </small>
        </div>
        <div>
          <span>{copyText("External costs", "Зовнішні витрати")}</span>
          <b>
            {enteredExternalCosts === null
              ? copyText("Not quoted · excluded", "Немає котирування · виключено")
              : money(actualExternal, draft.currency, locale)}
          </b>
        </div>
      </div>
      <div className="partner-formula-box">
        <strong>{copyText("How the comparison is calculated", "Як розраховано порівняння")}</strong>
        <p>
          <code>
            provider benchmark = developer hours × software-provider rate + partner work hours ×
            business-consulting-provider rate
          </code>
        </p>
        <p>
          {copyText(
            "Partner estimate = Σ((partner work-package hours + costed dossier-review hours assigned to that partner) × that partner's agreed hourly rate) + residual software/data hours × supplier rate + agreed graph/search reuse compensation + confirmed external costs. Client/board time is shown separately and excluded. A 0 reuse fee or external-cost value is treated as explicitly excluded only when entered, not when left blank.",
            "Оцінка партнерської моделі = Σ((години пакетів робіт партнера + години оплачуваного перегляду досьє, призначені цьому партнеру) × погоджена погодинна ставка партнера) + години залишкової розробки/даних × ставка постачальника + погоджена компенсація за повторне використання графа/пошуку + підтверджені зовнішні витрати. Час замовника/борду показано окремо й виключено. Нульова плата за повторне використання або зовнішні витрати означає явне виключення лише після введення нуля, а не коли поле порожнє.",
          )}
        </p>
      </div>
      <div className="partner-market-table-wrap">
        <p className="partner-budget-completeness">
          {copyText(
            "Comparators remain TBD until work-package hours and dossier effort are supplied. Provider-company benchmarks are rate sensitivity references, not same-scope quotes; later full-product functionality is not priced in this pilot scope.",
            "Порівняльні орієнтири залишаються TBD, доки не внесені години пакетів робіт і трудомісткість досьє. Ставки компаній-постачальників — лише орієнтири чутливості, а не котирування на той самий scope; функції повного продукту після пілота не включені до цього пілотного scope.",
          )}
        </p>
        <table className="partner-market-table">
          <thead>
            <tr>
              <th>{copyText("Price route / comparator", "Модель / порівняльний орієнтир")}</th>
              <th>{copyText("Source range · lower", "Діапазон джерела · нижня межа")}</th>
              <th>{copyText("Arithmetic midpoint", "Арифметична середина")}</th>
              <th>{copyText("Source range · upper", "Діапазон джерела · верхня межа")}</th>
            </tr>
          </thead>
          <tbody>
            {marketRows.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                <td>{effortComplete ? money(row.values.minimum, row.currency, locale) : "TBD"}</td>
                <td>
                  {effortComplete ? money(row.values.reference, row.currency, locale) : "TBD"}
                </td>
                <td>{effortComplete ? money(row.values.maximum, row.currency, locale) : "TBD"}</td>
              </tr>
            ))}
            <tr className="partner-table-note">
              <th>
                {copyText(
                  "UK consulting company comparator",
                  "Британський консалтинговий орієнтир",
                )}
              </th>
              <td colSpan={3}>
                {copyText(
                  "Not available in the cited Clutch country table; no rate imputed.",
                  "У наведеній країновій таблиці Clutch відсутній; ставку не підставлено.",
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="partner-warning partner-warning-compact">
        <AlertTriangle size={17} />
        <p>
          {copyText(
            "A same-scope boutique all-in quote is not in the sources. The computed Ukraine/US composite adds two different provider-company comparators only as a sensitivity test; it does not isolate margin or overhead and is not a boutique quote.",
            "У джерелах немає all-in котирування boutique-команди на той самий scope. Розрахований композит Україна/США додає два різні орієнтири компаній лише як тест чутливості; він не виділяє маржу чи накладні витрати й не є boutique-котируванням.",
          )}
        </p>
      </div>
      <button
        className="partner-expand-button"
        type="button"
        onClick={() => setShowAssumptions(!showAssumptions)}
        aria-expanded={showAssumptions}
      >
        <ChevronDown size={16} className={showAssumptions ? "rotated" : ""} />
        {showAssumptions
          ? copyText("Hide work-package assumptions", "Приховати припущення пакетів робіт")
          : copyText(
              "Show work-package hours, deliverables and acceptance",
              "Показати години, результати й критерії приймання пакетів робіт",
            )}
      </button>
      {showAssumptions && (
        <div className="partner-work-package-table-wrap">
          <label className="partner-field-label" htmlFor="dossier-volume">
            {copyText(
              "Dossier record count · confirm for this pilot",
              "Кількість записів досьє · підтвердити для цього пілота",
            )}
          </label>
          <input
            id="dossier-volume"
            className="partner-hours-input"
            type="number"
            min="0"
            step="1"
            value={draft.dossierVolume}
            onChange={(event) => updateDraft("dossierVolume", event.target.value)}
            placeholder={copyText("TBD", "TBD")}
          />
          <table className="partner-work-package-table">
            <thead>
              <tr>
                <th>ID · deliverable</th>
                <th>{copyText("Owner", "Власник")}</th>
                <th>
                  {copyText(
                    "Partner/vendor estimate · hours",
                    "Оцінка партнера/постачальника · години",
                  )}
                </th>
                <th>{copyText("Estimate status · acceptance", "Статус оцінки · приймання")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="partner-subhead">
                <th colSpan={4}>
                  {copyText("Partner and advisory packages", "Партнерські й консультаційні пакети")}
                </th>
              </tr>
              {PARTNER_WORK_PACKAGES.filter((pkg) => pkg.role !== "developer").map((pkg) => {
                const role = PARTNER_ROLES.find((item) => item.id === pkg.role);
                return (
                  <tr key={pkg.id}>
                    <th>
                      <code>{pkg.id}</code>
                      <strong>{copy(pkg.title, locale)}</strong>
                      <small>
                        {copy(pkg.deliverable, locale)}
                        {pkg.gatedByFunction &&
                          copyText(
                            " · Optional; included only when its function is selected.",
                            " · Опційно; включається лише після вибору відповідної функції.",
                          )}
                      </small>
                    </th>
                    <td>{role ? copy(role.name, locale) : "—"}</td>
                    <td>
                      <input
                        className="partner-hours-input"
                        aria-label={`${pkg.id} proposed hours`}
                        type="number"
                        min="0"
                        step="0.5"
                        value={draft.packageHours[pkg.id] ?? ""}
                        onChange={(event) =>
                          updateDraft("packageHours", {
                            ...draft.packageHours,
                            [pkg.id]: event.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <small>
                        {copyText(
                          "TBD until the delivery owner supplies a scoped estimate and work breakdown; prior planning assumptions are not current estimates.",
                          "TBD, доки власник виконання не надасть оцінку для погодженого scope та декомпозицію робіт; попередні планові припущення не є поточною оцінкою.",
                        )}
                      </small>
                      <small>
                        <strong>{copyText("Accept:", "Приймання:")}</strong>{" "}
                        {copy(pkg.acceptance, locale)}
                      </small>
                    </td>
                  </tr>
                );
              })}
              <tr className="partner-subhead">
                <th colSpan={4}>
                  {copyText(
                    "Software and data work — vendor hours, separate from partner hours",
                    "Розробка й дані — години постачальника окремо від партнерських",
                  )}
                </th>
              </tr>
              <tr className="partner-table-note">
                <th colSpan={4}>
                  {copyText(
                    "Existing demo search and group selection are already built. Do not charge their development again; any agreed use fee is entered separately below.",
                    "Демо пошуку й формування групи вже створено. Не виставляти повторно оплату за їх розробку; будь-яку погоджену плату за використання внести окремо нижче.",
                  )}
                </th>
              </tr>
              {PARTNER_WORK_PACKAGES.filter((pkg) => pkg.role === "developer").map((pkg) => (
                <tr key={pkg.id}>
                  <th>
                    <code>{pkg.id}</code>
                    <strong>{copy(pkg.title, locale)}</strong>
                    <small>
                      {copy(pkg.deliverable, locale)}
                      {pkg.gatedByFunction &&
                        copyText(
                          " · Optional; included only when its function is selected.",
                          " · Опційно; включається лише після вибору відповідної функції.",
                        )}
                    </small>
                  </th>
                  <td>{copyText("Software supplier", "Постачальник розробки")}</td>
                  <td>
                    <input
                      className="partner-hours-input"
                      aria-label={`${pkg.id} proposed hours`}
                      type="number"
                      min="0"
                      step="0.5"
                      value={draft.packageHours[pkg.id] ?? ""}
                      onChange={(event) =>
                        updateDraft("packageHours", {
                          ...draft.packageHours,
                          [pkg.id]: event.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <small>
                      {copyText(
                        "TBD until the delivery team reviews the current demo build and estimates residual work.",
                        "TBD до перегляду поточної збірки демо й оцінки залишкових робіт delivery-командою.",
                      )}
                    </small>
                    <small>
                      <strong>{copyText("Accept:", "Приймання:")}</strong>{" "}
                      {copy(pkg.acceptance, locale)}
                    </small>
                  </td>
                </tr>
              ))}
              <tr className="partner-subhead">
                <th colSpan={4}>
                  {copyText(
                    "Dossier workload — measure before pricing",
                    "Трудомісткість досьє — виміряти до ціноутворення",
                  )}
                </th>
              </tr>
              {DOSSIER_STAGES.map((stage) => {
                const stageHours = effort.dossierByStage[stage.id];
                return (
                  <tr key={stage.id}>
                    <th>
                      <code>DOS-{stage.id.toUpperCase()}</code>
                      <strong>{copy(stage.title, locale)}</strong>
                      <small>
                        {stage.costed
                          ? copyText(
                              "Partner effort is costed only after time is measured.",
                              "Партнерські години оцінюються лише після вимірювання часу.",
                            )
                          : copyText(
                              "Client in-kind time; excluded from supplier subtotal",
                              "Час замовника; виключено з підсумку постачальника",
                            )}
                      </small>
                    </th>
                    <td>
                      {stage.role === "client"
                        ? copyText("Client/board", "Замовник/борд")
                        : copy(PARTNER_ROLES.find((role) => role.id === stage.role)!.name, locale)}
                    </td>
                    <td>
                      <div className="partner-dossier-effort-input">
                        <span>
                          {stageHours === null
                            ? copyText("Enter minutes", "Введіть хвилини")
                            : `${numberFormat(stageHours, locale, 1)} h`}
                        </span>
                        <label>
                          {copyText("min/record", "хв/запис")}
                          <input
                            className="partner-hours-input"
                            aria-label={`${stage.id} minutes per record`}
                            type="number"
                            min="0"
                            step="1"
                            value={draft.dossierMinutes[stage.id] ?? ""}
                            onChange={(event) =>
                              updateDraft("dossierMinutes", {
                                ...draft.dossierMinutes,
                                [stage.id]: event.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </td>
                    <td>
                      <small>
                        {copyText(
                          "TBD until measured per activity and assigned to a role; no default minutes are assumed.",
                          "TBD до вимірювання за видом роботи й прив’язки до ролі; типові хвилини не припускаються.",
                        )}
                      </small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <details className="partner-budget-inputs partner-budget-detail">
        <summary>
          <Wallet size={18} />
          <span>
            {copyText(
              "Other cost inputs · supplier rate, reuse and comparator",
              "Інші витрати · ставка постачальника, повторне використання й порівняння",
            )}
          </span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <p className="partner-muted">
          {copyText(
            "The three role rates and software supplier rate must be entered from partner/supplier agreement; work-package hours and dossier measures require an attributed estimate. Changing currency relabels amounts; it does not convert numeric inputs.",
            "Ставки трьох ролей і постачальника ПЗ потрібно внести з погодження партнера/постачальника; години пакетів і вимірювання досьє потребують атрибутованої оцінки. Зміна валюти змінює позначення сум, але не конвертує числові значення.",
          )}
        </p>
        <div className="partner-rate-grid">
          <label>
            <span>
              {copyText("Software supplier ·", "Постачальник розробки ·")} {draft.currency}/
              {copyText("h", "год")}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.developerRate}
              onChange={(event) => updateDraft("developerRate", event.target.value)}
              placeholder={copyText("TBD", "TBD")}
            />
          </label>
          <label>
            <span>
              {copyText(
                "Graph and search reuse compensation · editable",
                "Компенсація за повторне використання графа й пошуку · редагується",
              )}{" "}
              {draft.currency}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.demoUseFee}
              onChange={(event) => updateDraft("demoUseFee", event.target.value)}
              placeholder={copyText(
                "TBD · enter 0 only if waived",
                "TBD · введіть 0, лише якщо плату скасовано",
              )}
            />
            <small>
              {copyText(
                "A blank fee remains TBD; 0 is an explicit waiver, not an assumed free reuse.",
                "Порожня плата лишається TBD; 0 — явне скасування, а не припущення про безкоштовне повторне використання.",
              )}
            </small>
          </label>
          <label>
            <span>
              {copyText(
                "External costs · enter 0 only if explicitly excluded ·",
                "Зовнішні витрати · введіть 0, лише якщо їх явно виключено ·",
              )}{" "}
              {draft.currency}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.externalCosts}
              onChange={(event) => updateDraft("externalCosts", event.target.value)}
              placeholder={copyText(
                "TBD · enter 0 only if excluded",
                "TBD · введіть 0, лише якщо виключено",
              )}
            />
          </label>
        </div>
        <div className="partner-calculated-cost">
          <span>
            {copyText("Current indicative project total", "Поточний індикативний бюджет проєкту")}
          </span>
          <strong>
            {actualSeparateTotal === null
              ? copyText(
                  "TBD · complete or explicitly exclude every required input",
                  "TBD · заповніть або явно виключіть кожен обов’язковий вхід",
                )
              : money(actualSeparateTotal, draft.currency, locale)}
          </strong>
          <small>
            {copyText(
              "Total = Σ over partner roles [(role's work-package hours + measured, costed dossier hours assigned to that role) × that role's agreed rate] + residual software/data hours × supplier rate + agreed graph/search reuse compensation + confirmed external costs. Client/board hours are shown separately and excluded. No total is shown while any required input is TBD.",
              "Підсумок = Σ за партнерськими ролями [(години пакетів цієї ролі + виміряні оплачувані години досьє, призначені цій ролі) × погоджена ставка цієї ролі] + години залишкової розробки/даних × ставка постачальника + погоджена компенсація за повторне використання графа/пошуку + підтверджені зовнішні витрати. Час замовника/борду показано окремо й виключено. Поки будь-який обов’язковий вхід має статус TBD, підсумок не показується.",
            )}
          </small>
        </div>
        <div className="partner-rate-grid partner-quote-grid">
          <label>
            <span>
              {copyText(
                "Same-scope boutique all-in quote ·",
                "All-in котирування boutique-команди на той самий scope ·",
              )}{" "}
              {draft.currency}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.boutiqueQuote}
              onChange={(event) => updateDraft("boutiqueQuote", event.target.value)}
              placeholder={copyText(
                "Enter an actual quote; do not estimate",
                "Введіть фактичне котирування; не оцінюйте замість постачальника",
              )}
            />
          </label>
          <div className="partner-quote-result">
            <span>{copyText("Comparable quote status", "Статус зіставного котирування")}</span>
            <strong>
              {actualQuote === null
                ? copyText("No quote entered", "Котирування не введено")
                : money(actualQuote, draft.currency, locale)}
            </strong>
            <small>
              {copyText(
                "Compare only when deliverables, acceptance, taxes, term and exclusions match.",
                "Порівнюйте лише за однакових результатів, приймання, податків, строку й виключень.",
              )}
            </small>
          </div>
        </div>
      </details>
      <div className="partner-commercial-models">
        <h3>
          {copyText(
            "Offer scope to review with partners",
            "Обсяг пропозиції для перегляду партнерами",
          )}
        </h3>
        <p className="partner-muted">
          {copyText(
            "These four scopes describe what is being commissioned, not the app's navigation. Search and service configuration share page one; page two is for review, approval and the budget boundary.",
            "Ці чотири scope описують замовлений обсяг робіт, а не навігацію застосунку. Пошук і конфігурація сервісів відбуваються на першій сторінці; друга призначена для перегляду, погодження та бюджетної межі.",
          )}
        </p>
        <div className="partner-commercial-grid">
          <div>
            <strong>{copyText("Consulting · by approval", "Консалтинг · за погодженням")}</strong>
            <p>
              {copyText(
                "Define the client's priority questions and expertise gaps, co-design the expert-focused Trust & Influence Index (TII) and evidence protocol if selected, and produce a decision record and pilot brief. This stage reduces the risk of building for an untested need; the model is not a validated sector index.",
                "Визначити пріоритетні запити замовника й прогалини експертизи; за вибору спільно розробити Trust & Influence Index (TII) для експертів і протокол доказів; підготувати журнал рішень і бриф пілота. Це зменшує ризик розробки для неперевіреної потреби; модель не є валідованим галузевим індексом.",
              )}
            </p>
          </div>
          <div>
            <strong>{copyText("Application MVP", "MVP застосунку")}</strong>
            <p>
              {copyText(
                "The minimum repeatable workflow is approved-data import and validation, human source/profile reconciliation, search and purpose-specific group formation, and first contact through an approved channel. It makes the agreed pilot operationally repeatable; demo screens do not prove production persistence, access control or integration.",
                "Мінімальний повторюваний процес: імпорт і перевірка погоджених даних, людська звірка профілів із джерелами, пошук і формування цільової групи, перший контакт погодженим каналом. Це робить пілот повторюваним; демонстраційні екрани не доводять наявність production-збереження, контролю доступу чи інтеграцій.",
              )}
            </p>
          </div>
          <div>
            <strong>
              {copyText(
                "Functionality required to run the pilot",
                "Функціональність для проведення пілота",
              )}
            </strong>
            <p>
              {copyText(
                "Add only the operating functions needed for one approved client cycle: invitation/response status, human decisions and approvals, activity tracking, agreed output/knowledge capture, feedback and evidence measures. This is not a public launch or paid-membership product; billing is a separate future choice.",
                "Додати лише операційні функції одного погодженого циклу клієнта: статуси запрошень/відповідей, людські рішення й погодження, облік активності, фіксацію погодженого результату/знань, зворотний зв’язок і вимірювання. Це не публічний запуск і не продукт платного членства; білінг — окреме майбутнє рішення.",
              )}
            </p>
          </div>
          <div>
            <strong>
              {copyText(
                "Other and post-pilot functionality",
                "Інші функції та розвиток після пілота",
              )}
            </strong>
            <p>
              {copyText(
                "Prioritize other network services, events, knowledge reuse, analytics, integrations, billing or multi-community access only after the pilot review. Public continuation is a separate decision with its own access, privacy/security, operations, support and commercial scope.",
                "Інші сервіси мережі, події, повторне використання знань, аналітику, інтеграції, білінг чи доступ для кількох спільнот пріоритизувати після перегляду пілота. Публічне продовження — окреме рішення з власним scope доступу, приватності/безпеки, операцій, підтримки й комерційних умов.",
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="partner-budget-exclusions">
        <strong>
          {copyText(
            "Excluded until permission, scope or supplier quote exists",
            "Виключено до дозволу, scope чи котирування постачальника",
          )}
        </strong>
        <p>
          {copyText(
            "Paid campaign media/events, travel, translation, legal/privacy counsel, hosting/SaaS/API usage, taxes, ongoing post-pilot operations and any agreed demo-reuse fee. These are gated cost inputs, not zero-cost items.",
            "Платні медіа/події кампанії, подорожі, переклад, юридичний супровід приватності, хостинг/SaaS/API, податки, операційна підтримка після пілота й погоджена плата за повторне використання демо. Це відкладені витратні входи, а не безкоштовні позиції.",
          )}
        </p>
      </div>
      <div className="partner-market-sources" id="partner-sources">
        <strong>{copyText("Sources and units", "Джерела й одиниці")}</strong>
        <ul>
          {MARKET_BENCHMARKS.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
              <small>{source.period}</small>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
