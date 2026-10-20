import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import { CircleHelp, Printer, Send, Server, ShieldCheck, Sparkles } from "lucide-react";
import { pushInbox, useAccess } from "@/lib/access";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  CORE_FEATURES,
  DEFAULT_FEATURES,
  useConfiguratorState,
  type ClientRequirement,
  type ConfiguratorMode,
  type FeatureId,
} from "@/lib/proposal-config";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));
const INDICATIVE_BASE_EFFORT_HOURS = 2810;
const UKRAINE_PUBLISHED_UPPER_RATE_USD = 49;
const MINIMUM_ADVANCE_PERCENT = 30;
const MAXIMUM_INSTALLMENTS = 3;
const INDICATIVE_BASE_PRICE_USD =
  INDICATIVE_BASE_EFFORT_HOURS * UKRAINE_PUBLISHED_UPPER_RATE_USD;
const INDICATIVE_MINIMUM_ADVANCE_USD =
  (INDICATIVE_BASE_PRICE_USD * MINIMUM_ADVANCE_PERCENT) / 100;

function formatUsd(value: number, locale: "uk" | "en") {
  return new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatClientRequirement(requirement: ClientRequirement, locale: "uk" | "en") {
  const labels =
    locale === "uk"
      ? { need: "Потреба", outcome: "Очікуваний результат", constraints: "Обмеження" }
      : { need: "Need", outcome: "Expected outcome", constraints: "Constraints" };
  return [
    requirement.title.trim() || (locale === "uk" ? "Без назви" : "Untitled requirement"),
    requirement.need.trim() ? `${labels.need}: ${requirement.need.trim()}` : "",
    requirement.outcome.trim() ? `${labels.outcome}: ${requirement.outcome.trim()}` : "",
    requirement.constraints.trim()
      ? `${labels.constraints}: ${requirement.constraints.trim()}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const Route = createFileRoute("/proposal")({
  head: () => ({
    meta: [
      { title: "ISRM Ukraine Platform Proposal" },
      {
        name: "description",
        content:
          "Configure a proposed ISRM Ukraine expert-network platform scope and prepare a local discussion brief.",
      },
      { property: "og:title", content: "ISRM Ukraine Platform Proposal" },
      {
        property: "og:description",
        content:
          "Proposed scope and local discussion brief for the ISRM Ukraine expert-network platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProposalPage,
});

function ProposalPage() {
  return (
    <main>
      <ProposalSection />
    </main>
  );
}

const SERVICE_CATALOG = [
  {
    serviceId: "service-war-room",
    phase: "01",
    title: "Network map & War Room",
    description:
      "Optional operational workspace joining network expertise, situational context, alerts and action ownership; external monitoring integrations require separate validation.",
    stack: "React · force graph · network-scoped APIs · external World Monitor",
    data: "Approved profile fields, network relationships, visibility rules and any external-source access",
    client: "Approve profile fields, access policy and operational ownership",
    deliverables: "Interactive graph, named relationships, filters and operating view",
    acceptance: "A user can filter the network, select an expert and open a short dossier",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-war-room" },
    worldMonitor: true,
    requires: ["expert-search"],
  },
  {
    serviceId: "service-projects",
    phase: "02",
    title: "Projects & expert requests",
    description:
      "Create a project, formulate an expertise request, find experts on the graph and send a controlled invitation through the Cabinet.",
    stack: "PostgreSQL · request workflow · RBAC · audit events",
    data: "Projects, tasks, invitations and consent states",
    client: "Supply request templates and nominate workflow owner",
    deliverables: "Project form, request composer, expert selection and invitation queue",
    acceptance: "A request can be drafted, targeted and recorded with an audit event",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-projects" },
    requires: ["expert-search"],
  },
  {
    serviceId: "expert-search",
    phase: "03",
    title: "Expert search & dossiers",
    description:
      "Search the network by expertise, geography and experience; inspect a privacy-aware expert dossier.",
    stack: "React · indexed search · profile and consent model",
    data: "Expert profiles, evidence, network membership and visibility rules",
    client: "Approve search vocabulary, fields and disclosure policy",
    deliverables: "Search, filter, match cards, short and full dossiers",
    acceptance: "A participant can find a match and view only fields permitted to their access",
    demo: { label: "Open search", to: "/coordinator", hash: "expert-search" },
  },
  {
    serviceId: "service-recruitment",
    phase: "04",
    title: "Expert recruitment campaigns",
    description:
      "Campaign planning, audience segments and lead intake; direct social or messenger automation remains a later integration subject to provider terms.",
    stack: "Campaign domain · import pipeline · approved channel adapters",
    data: "Segments, campaign consent and lead source",
    client: "Provide compliant audience sources and campaign objectives",
    deliverables: "Campaign brief, consent-aware segment, invitation and review pipeline",
    acceptance: "Every outbound audience has a stated source, consent state and owner",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-recruitment" },
    requires: ["expert-search"],
  },
  {
    serviceId: "service-research",
    phase: "05",
    title: "Expert discussions & research",
    description:
      "Moderated, evidence-led expert sessions that turn complex questions into decision-ready outputs.",
    stack: "Research workflow · facilitation · evidence library",
    data: "Questions, participants, sources, synthesis and dissent",
    client: "Provide research priorities, moderators and attribution rules",
    deliverables: "Question brief, participant mix, evidence pack and synthesis",
    acceptance: "Session output identifies evidence, caveats and decision relevance",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-research" },
    requires: ["expert-search"],
  },
  {
    serviceId: "service-public-engagement",
    phase: "06",
    title: "Public campaigns & hearings",
    description:
      "Accessible public engagement with transparent participation rules and a documented response loop.",
    stack: "Campaign workflow · stakeholder registry · response matrix",
    data: "Audience, submissions, moderation and response themes",
    client: "Approve public purpose, safeguarding and publication policy",
    deliverables: "Engagement plan, stakeholder map and response summary",
    acceptance: "Participants can see how feedback was considered",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-public-engagement" },
    requires: ["service-projects"],
  },
  {
    serviceId: "service-leads",
    phase: "07",
    title: "Consulting lead generation",
    description: "Qualify external needs and build appropriately scoped expert teams.",
    stack: "Lead intake · capability matching · opportunity workflow",
    data: "Lead source, client need, capability fit and follow-up owner",
    client: "Define sectors, qualification criteria and commercial owner",
    deliverables: "Qualification brief, candidate team and next-step plan",
    acceptance: "Each lead has an owner, fit rationale and disposition",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-leads" },
    requires: ["expert-search", "service-projects"],
  },
  {
    serviceId: "service-news-alerts",
    phase: "08",
    title: "Network news & targeted alerts",
    description: "Share verified updates to the relevant members by expertise, role or geography.",
    stack: "Publishing workflow · audience rules · approved notification adapters",
    data: "Bulletins, recipients, delivery status and acknowledgements",
    client: "Approve editorial policy, urgency rules and channels",
    deliverables: "Reviewed bulletin, audience preview and delivery log",
    acceptance: "Alerts are reviewable and targeted; broad sends require explicit scope",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-news-alerts" },
  },
  {
    serviceId: "service-meetings",
    phase: "09",
    title: "Meeting & event operations",
    description:
      "Coordinate virtual and in-person sessions, access, agendas, materials and actions.",
    stack: "Event workspace · RSVP · access checks · calendar adapter",
    data: "Events, participants, agendas, attendance and artifacts",
    client: "Provide event policy, moderators and material taxonomy",
    deliverables: "Event setup, check-in list, agenda and action/library view",
    acceptance: "Organisers can manage attendance and publish follow-up actions",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-meetings" },
    requires: ["service-projects"],
  },
  {
    serviceId: "service-ai-osint",
    phase: "10",
    title: "AI/OSINT discovery & controls",
    description:
      "Define one bounded, source-cited AI/OSINT workflow and its privacy, audit and human-review controls; production integration is a separate optional tier.",
    stack: "Use-case discovery · approved sources · human-review and audit design",
    data: "Approved sources, query purpose, findings, caveats and reviewer decisions",
    client: "Approve lawful purposes, source list, providers and reviewer policy",
    deliverables: "Bounded use-case brief, source policy and integration acceptance criteria",
    acceptance: "No live AI/OSINT integration or automated adverse decision in this line item",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-ai-osint" },
  },
  {
    serviceId: "service-partners",
    phase: "11",
    title: "Partner services marketplace",
    description: "Offer network-approved legal, field, evacuation and equipment support.",
    stack: "Provider directory · evidence/reviews · service request workflow",
    data: "Provider coverage, evidence, reviews, offers and service requests",
    client: "Approve provider criteria, moderation and recommendation policy",
    deliverables: "Service cards, shortlist, recommendation and quote request",
    acceptance: "Recommendations expose their basis and do not imply a guarantee",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-partners" },
  },
  {
    serviceId: "service-billing",
    phase: "12",
    title: "Network billing & premium services",
    description:
      "Keep basic participation free and price optional services transparently, pay as you go.",
    stack: "Service catalogue · approval workflow · billing provider adapter",
    data: "Service units, estimates, approvals, billing contacts and invoices",
    client: "Approve pricing, tax treatment, payment provider and authorization",
    deliverables: "Estimate preview, approval record and integration contract",
    acceptance: "The demo never charges; production charges require explicit approval and provider",
    demo: { label: "Open service mockup", to: "/coordinator", hash: "service-billing" },
  },
] as const;

type ServiceCatalogItem = (typeof SERVICE_CATALOG)[number];
const getRequirements = (service: ServiceCatalogItem): readonly FeatureId[] =>
  "requires" in service ? (service.requires as readonly FeatureId[]) : [];

const FEATURE_TONES: Record<FeatureId, "teal" | "orange" | "gold" | "steel"> = {
  "service-war-room": "teal",
  "service-projects": "orange",
  "expert-search": "teal",
  "service-recruitment": "orange",
  "service-research": "gold",
  "service-public-engagement": "steel",
  "service-leads": "gold",
  "service-news-alerts": "orange",
  "service-meetings": "teal",
  "service-ai-osint": "steel",
  "service-partners": "orange",
  "service-billing": "gold",
};

const CORE_SCOPE_COPY = {
  uk: [
    "Безпека й серверно контрольований доступ за ролями, згодами та журналом аудиту.",
    "Живі профілі експертів, інструменти операторів, онбординг і керована модерація.",
    "Пошук, карта мережі та базові зв’язки між експертами.",
    "Односторінковий робочий простір із перемиканням між графом мережі, можливостями платформи та залежностями.",
    "AI-підтримка пошуку, зіставлення й цільових кампаній із людською перевіркою; вимірювання фактичної воронки залучення без неперевірених прогнозів.",
    "Базові групи, співпраця та події.",
    "Перевірка експертних тверджень із джерелами, provenance та історією змін; без композитного рейтингу довіри.",
  ],
  en: [
    "Security and server-enforced role-based access, consent states and audit trail.",
    "Live expert profiles, operator tools, onboarding and governed moderation.",
    "Expert search, network map and basic expert relationships.",
    "A one-page workspace with switchable network, platform-capability and dependency graph views.",
    "AI-assisted discovery, matching and targeted campaigns, with human review; measure observed recruitment funnel outcomes without unvalidated forecasts.",
    "Basic groups, collaboration and events.",
    "Evidence-backed expert verification with sources, provenance and change history; no composite trust score.",
  ],
} as const;

const CORE_ACCEPTANCE_COPY = {
  uk: [
    "Права перевіряються на сервері; заборонений доступ не розкриває поля профілю й залишає аудиторський запис.",
    "Для кожного доказового твердження можна побачити джерело, статус перевірки та обмеження.",
    "AI-рекомендація показує підстави й джерела; запрошення чи публікацію підтверджує людина.",
    "Для кампанії фіксуються джерело аудиторії, згода, запрошення та фактична відповідь/онбординг; звіт розрізняє спостереження й прогноз.",
    "Модерація, базові групи та події працюють у межах погоджених ролей і правил доступу.",
  ],
  en: [
    "Authorization is enforced server-side; denied access reveals no restricted profile fields and leaves an audit event.",
    "Each evidence-backed claim exposes its source, verification status and limitations.",
    "AI recommendations expose their rationale and sources; a human approves outreach or publication.",
    "Campaign audience source, consent, invitation and observed response/onboarding are recorded; reporting distinguishes observations from forecasts.",
    "Moderation, basic groups and events operate within approved roles and access rules.",
  ],
} as const;

const CLIENT_CONFIRMATIONS_COPY = {
  uk: [
    "Пілот і результат: визначити першу когорту експертів, конкретний запит/рішення, канал запрошення та період пілота. Погодити, яку фактичну дію вважати результатом (наприклад, згода на участь, завершений профіль, перевірена експертність або змістовний внесок); не підмінювати її охопленням чи прогнозом конверсії.",
    "Дані, згода та AI: затвердити джерела даних і правову підставу; окремо визначити згоду на контакт і публікацію, відкликання згоди, доступ і строк зберігання. Погодити AI-провайдера та межі використання; ідентичність, експертність, контакт і публікацію підтверджує людина.",
  ],
  en: [
    "Pilot and outcome: identify the first expert cohort, concrete need/decision, invitation channel and pilot observation period. Agree which observed action counts as an outcome (for example, consent to participate, completed profile, verified expertise or substantive contribution); do not substitute reach or an assumed conversion rate.",
    "Data, consent and AI: approve data sources and lawful basis; define contact and publication consent separately, withdrawal, access and retention. Approve the AI provider and use boundaries; a human confirms identity, expertise, outreach and publication.",
  ],
} as const;

const DEMO_DATA_CAVEAT_COPY = {
  uk: "Статуси й лічильники мережевої демоверсії є ілюстративними внутрішніми даними; replay може імітувати зміну статусу. Вони не підтверджують незалежно експертність або згоду на контакт і не є прогнозом залучення.",
  en: "Network-demo counts and statuses are illustrative internal data; replay may simulate status changes. They do not establish independently verified expertise, consent to contact, or a recruitment forecast.",
} as const;

const SERVICE_UK_COPY: Partial<
  Record<FeatureId, { title: string; deliverable: string; acceptance: string; clientInput: string }>
> = {
  "service-war-room": {
    title: "Ситуаційна координація (War Room)",
    deliverable: "Операційний екран із картою мережі, контекстом, сигналами та відповідальними.",
    acceptance: "Кожен погоджений сигнал має власника, пріоритет і наступну дію.",
    clientInput: "Погодити джерела сигналів, правила ескалації та операційного власника.",
  },
  "service-projects": {
    title: "Проєкти й запити експертам",
    deliverable: "Форма запиту, добір експертів, контрольоване запрошення та журнал дій.",
    acceptance: "Запит можна сформувати, адресно надіслати й простежити за журналом.",
    clientInput: "Надати шаблони запитів і визначити відповідального за процес.",
  },
  "expert-search": {
    title: "Пошук експертів і досьє",
    deliverable: "Пошук, фільтри, картки зіставлення та профілі з контрольованою видимістю.",
    acceptance: "Користувач бачить лише поля, дозволені його рівнем доступу.",
    clientInput: "Погодити словник експертності, поля профілю та правила розкриття.",
  },
  "service-recruitment": {
    title: "Кампанії залучення експертів",
    deliverable: "Бриф кампанії, сегмент аудиторії, запрошення та черга перевірки.",
    acceptance:
      "Для кожної аудиторії відомі джерело, згода й відповідальний; автоматизація каналів погоджується окремо.",
    clientInput: "Надати правомірні джерела аудиторій і цілі кампаній.",
  },
  "service-research": {
    title: "Експертні обговорення й дослідження",
    deliverable: "Бриф запитань, склад учасників, пакет доказів і синтез висновків.",
    acceptance: "Результат відділяє докази від обмежень і пояснює значення для рішення.",
    clientInput: "Визначити пріоритети дослідження, модератора й правила атрибуції.",
  },
  "service-public-engagement": {
    title: "Публічні кампанії та консультації",
    deliverable: "План залучення, карта зацікавлених сторін і матриця відповідей.",
    acceptance: "Учасникам зрозуміло, як їхні відповіді були враховані.",
    clientInput: "Погодити мету, захист учасників і правила публікації.",
  },
  "service-leads": {
    title: "Кваліфікація запитів і формування команд",
    deliverable: "Кваліфікований запит, обґрунтування відповідності команди й наступний крок.",
    acceptance: "Кожен запит має відповідального, підставу відповідності та статус.",
    clientInput: "Визначити сектори, критерії кваліфікації й комерційного власника.",
  },
  "service-news-alerts": {
    title: "Новини мережі й адресні сповіщення",
    deliverable: "Перевірене повідомлення, попередній перегляд аудиторії та журнал доставки.",
    acceptance:
      "Адресні сповіщення доступні для перевірки; широкі розсилки вимагають окремого погодження.",
    clientInput: "Погодити редакційну політику, терміновість і канали.",
  },
  "service-meetings": {
    title: "Керування зустрічами й подіями",
    deliverable: "Налаштування події, список учасників, порядок денний і перелік дій.",
    acceptance: "Організатор контролює участь і публікує узгоджені підсумкові дії.",
    clientInput: "Надати правила подій, модераторів і класифікацію матеріалів.",
  },
  "service-ai-osint": {
    title: "Окремий AI/OSINT-сценарій",
    deliverable: "Обмежений сценарій використання, перелік джерел і критерії інтеграції.",
    acceptance:
      "Застосування має затверджену мету, джерела, людську перевірку й аудит; автоматизовані негативні рішення виключені.",
    clientInput: "Погодити законні цілі, джерела, провайдерів і правила перевірки.",
  },
  "service-partners": {
    title: "Каталог партнерських послуг",
    deliverable: "Картки послуг, короткий список, обґрунтування рекомендації та запит пропозиції.",
    acceptance: "Підстави рекомендацій відкриті й не створюють гарантій результату.",
    clientInput: "Погодити критерії партнерів, модерацію та правила рекомендацій.",
  },
  "service-billing": {
    title: "Платні сервіси й білінг",
    deliverable: "Перегляд оцінки, запис погодження та контракт інтеграції платіжного провайдера.",
    acceptance:
      "Демо не списує кошти; реальні платежі можливі лише після окремого погодження й інтеграції.",
    clientInput: "Погодити тарифи, податкову модель, платіжного провайдера й авторизацію.",
  },
};

const COPY = {
  uk: {
    eyebrow: "Артефакт-пропозиція · для ЛПР",
    title: "Цифрова інфраструктура довіри для експертної мережі ISRM Ukraine",
    step: "Крок",
    next: "Далі",
    architecture: "Архітектура",
    roadmap: "Дорожня карта",
    pricing: "Пропозиція для обговорення",
    pricingIntro:
      "Рекомендований наступний крок — погодити сценарій першого пілота та правила роботи з даними й AI. Це дасть змогу зафіксувати вимірюваний результат, межі ядра, кошторис і календарний план. Прогноз економіки членства та внесків — окремий необов’язковий аналіз, він не є передумовою пілота.",
    rationale: "Ціна, строки й наступний крок",
    rationaleText:
      "Фіксовані ціна й дата завершення будуть подані після погодження сценарію пілота, даних і доступу, інтеграцій, критеріїв приймання та етапів. Перед початком реалізації сторони окремо затверджують обсяг робіт і комерційні умови.",
    assumptions: "Що потрібно погодити",
    assumptionsText:
      "Джерела й правова підстава даних; ролі доступу та правила згоди/відкликання; джерела доказів і відповідальні за перевірку; дозволені AI-провайдери й людський контроль; інтеграції, розміщення та операційний власник.",
    steps: [
      [
        "Карта мережі",
        "Інтерактивна карта експертної мережі з узгодженими шарами, фільтрами та переходом до профілю. Склад оперативного ситуаційного центру визначається окремим модулем.",
        "/",
        "Відкрити карту",
      ],
      [
        "Протокол приватності",
        "Доступ, видимість профілів, згода на контакт і журналювання мають бути визначені політикою замовника та реалізовані із серверною перевіркою прав.",
        "/directory",
        "Спробувати",
      ],
      [
        "Реєстр і фільтри",
        "Пошук за погодженими полями експертності, географії, досвіду й ролі; доступність і якість кожного поля треба перевірити на стартових даних.",
        "/directory",
        "До реєстру",
      ],
      [
        "Досьє та джерела доказів",
        "Профіль показує джерела, статус перевірки й походження доказів; композитний рейтинг довіри не входить до ядра без погодженої методики та апеляції.",
        "/experts/$code",
        "Приклад досьє",
      ],
      [
        "Робоче місце оператора",
        "Демонстрація координаційних сценаріїв; production-черга, сповіщення та показники потребують окремої перевірки й реалізації.",
        "/coordinator",
        "Кабінет",
      ],
    ],
    arch: [
      ["Клієнт", "Граф, реєстр і досьє для ЛПР та аналітиків."],
      [
        "Шар доступу",
        "Серверна перевірка прав; правила видимості й знеособлення погоджуються окремо.",
      ],
      ["Дані", "Профілі, джерела доказів, статуси перевірки, згоди та історія змін."],
      [
        "Координація",
        "Сценарії запитів і згоди; production-зберігання та сповіщення потребують реалізації й перевірки.",
      ],
    ],
    road: [
      [
        "Етап 1",
        "Пілот і готовність даних",
        "За окремо погодженим обсягом зафіксувати сценарій і вимірювану дію-результат, джерела та правила даних, ролі доступу й межі AI. Результат: погоджений короткий обсяг, критерії приймання та оцінка наступного етапу.",
      ],
      [
        "Етап 2",
        "Деталізація ядра",
        "Уточнити профілі, мережевий пошук, AI-підтримку, кампанії, групи, події, модерацію, provenance та операторські сценарії.",
      ],
      [
        "Етап 3",
        "Обрані додаткові модулі",
        "Оцінити й реалізувати лише модулі, включені до погодженого обсягу, із визначеними передумовами та відповідальними.",
      ],
      [
        "Етап 4",
        "Приймання й передача",
        "Перевірити критерії приймання, безпеку й доступ, підготувати інструкції, передачу знань та операційний запуск.",
      ],
    ],
    topics: [
      "Функціональність",
      "Приватність і доступ",
      "Дорожня карта",
      "Партнерство",
      "Оцінка та комерційні рамки",
    ],
  },
  en: {
    eyebrow: "Product proposal · for decision-makers",
    title: "A digital trust infrastructure for the ISRM Ukraine expert network",
    step: "Step",
    next: "Next",
    architecture: "Architecture",
    roadmap: "Roadmap",
    pricing: "Proposal for discussion",
    pricingIntro:
      "Recommended next step: agree the first pilot scenario and data/AI rules. This establishes a measurable outcome, the core scope, budget and schedule. A membership-contribution or revenue forecast is a separate optional analysis, not a prerequisite for the pilot.",
    rationale: "Price, timing and next step",
    rationaleText:
      "A fixed fee and completion date will follow agreement on the pilot scenario, data and access, integrations, acceptance criteria and delivery stages. Both parties will approve the statement of work and commercial terms before implementation starts.",
    assumptions: "Decisions required",
    assumptionsText:
      "Data sources and lawful basis; access roles and consent/withdrawal rules; evidence sources and review owners; approved AI providers and human oversight; integrations, hosting and operational ownership.",
    steps: [
      [
        "Network map",
        "An interactive expert-network map with agreed layers, filters and profile navigation. A full operational situation room is a separate optional module.",
        "/",
        "Open map",
      ],
      [
        "Privacy protocol",
        "Access, profile visibility, contact consent and audit requirements must follow the client's policy and be enforced server-side.",
        "/directory",
        "Try it",
      ],
      [
        "Directory and filters",
        "Search agreed expertise, geography, experience and role fields; availability and quality of each field must be checked against the initial data.",
        "/directory",
        "Open directory",
      ],
      [
        "Dossier and evidence sources",
        "Profiles show sources, verification status and evidence provenance; a composite trust score is excluded until its method and appeal process are approved.",
        "/experts/$code",
        "View dossier",
      ],
      [
        "Operator workspace",
        "Coordination workflows are demonstrated; production queues, notifications and metrics require separate validation and implementation.",
        "/coordinator",
        "Open workspace",
      ],
    ],
    arch: [
      ["Client", "Graph, directory and dossiers for decision-makers and analysts."],
      [
        "Access layer",
        "Server-side permission checks; visibility and anonymisation rules are agreed separately.",
      ],
      ["Data", "Profiles, evidence sources, verification states, consent and change history."],
      [
        "Coordination",
        "Request and consent workflows; production persistence and notifications require implementation and validation.",
      ],
    ],
    road: [
      [
        "Stage 1",
        "Pilot and data readiness",
        "Under a separately agreed scope, define the scenario and measurable outcome, data sources and rules, access roles and AI boundaries. Deliver an agreed concise scope, acceptance criteria and estimate for the next stage.",
      ],
      [
        "Stage 2",
        "Core scope definition",
        "Specify profiles, network search, AI assistance, campaigns, groups, events, moderation, provenance and operator workflows.",
      ],
      [
        "Stage 3",
        "Selected optional modules",
        "Estimate and deliver only modules included in the agreed scope, with their prerequisites and owners.",
      ],
      [
        "Stage 4",
        "Acceptance and handoff",
        "Verify acceptance and security criteria; prepare operating guidance, knowledge transfer and launch.",
      ],
    ],
    topics: [
      "Functionality",
      "Privacy and access",
      "Roadmap",
      "Partnership",
      "Estimate and commercial terms",
    ],
  },
} as const;

const CAPABILITY_GROUPS = {
  uk: [
    {
      title: "Довіра та контроль",
      items: ["Рольовий доступ, згоди й аудит", "Докази, джерела та історія перевірки"],
    },
    {
      title: "Мережа та пошук",
      items: ["Профілі й зв’язки експертів", "Пошук і карта мережі"],
    },
    {
      title: "Залучення",
      items: [
        "AI-підтримка добору з людською перевіркою",
        "Цільові кампанії та вимірювання фактичної відповіді",
      ],
    },
    {
      title: "Спільна робота",
      items: ["Базові групи та співпраця", "Події, онбординг і модерація"],
    },
  ],
  en: [
    {
      title: "Trust and control",
      items: ["Role-based access, consent and audit", "Evidence sources and verification history"],
    },
    {
      title: "Network and discovery",
      items: ["Expert profiles and relationships", "Network search and map"],
    },
    {
      title: "Recruitment",
      items: ["AI-assisted matching with human review", "Targeted campaigns and observed response"],
    },
    {
      title: "Collaboration",
      items: ["Basic groups and collaboration", "Events, onboarding and moderation"],
    },
  ],
} as const;

function ProposalGraphSwitcher() {
  const { locale } = useI18n();
  const { data, loading } = useAccess();
  const { state, update } = useConfiguratorState();
  const [mounted, setMounted] = useState(false);
  const isUk = locale === "uk";
  useEffect(() => setMounted(true), []);

  const tabs: { id: ConfiguratorMode; label: string }[] = isUk
    ? [
        { id: "network", label: "Мережа експертів" },
        { id: "platform", label: "Можливості платформи" },
        { id: "dependencies", label: "Залежності модулів" },
      ]
    : [
        { id: "network", label: "Expert network" },
        { id: "platform", label: "Platform capabilities" },
        { id: "dependencies", label: "Module dependencies" },
      ];

  return (
    <section
      aria-labelledby="proposal-graph-heading"
      className="mt-8 rounded border border-border bg-card p-4 sm:p-6"
      id="proposal-graphs"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {isUk ? "Інтерактивний огляд" : "Interactive overview"}
        </p>
        <h3 id="proposal-graph-heading" className="mt-2 font-display text-2xl">
          {isUk ? "Три погляди на пропозицію" : "Three views of the proposal"}
        </h3>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {isUk
            ? "Перемикайтеся між наявним графом мережі, концептуальною картою можливостей і задекларованими залежностями модулів."
            : "Switch between the existing network graph, a conceptual capability map and the module prerequisites stated in this proposal."}
        </p>
      </div>
      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label={isUk ? "Види графа" : "Graph views"}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={state.mode === tab.id}
            aria-controls="proposal-graph-panel"
            onClick={() => update({ mode: tab.id })}
            className={`min-h-10 rounded border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              state.mode === tab.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="mt-5 overflow-hidden rounded border border-border bg-background"
        id="proposal-graph-panel"
        role="region"
        aria-label={tabs.find((tab) => tab.id === state.mode)?.label}
      >
        {state.mode === "network" && (
          <>
            <p className="border-b border-border px-4 py-2 text-xs leading-relaxed text-muted-foreground">
              {isUk
                ? "Поточні записи мережі; демо-статуси можуть симулюватися й не підтверджують згоду на контакт."
                : "Current network records; demo statuses may be simulated and do not establish consent to contact."}
            </p>
            <div className="relative h-[min(65vh,600px)] min-h-[360px]">
              {loading && (
                <p className="absolute inset-0 z-10 grid place-items-center bg-background/80 text-sm text-muted-foreground">
                  {isUk ? "Завантаження мережі…" : "Loading network…"}
                </p>
              )}
              {mounted && !loading && (
                <Suspense
                  fallback={
                    <p className="grid h-full place-items-center text-sm text-muted-foreground">
                      {isUk ? "Завантаження графа…" : "Loading graph…"}
                    </p>
                  }
                >
                  <NetworkGraph
                    experts={data?.experts ?? []}
                    layers={{ ...state.layers, network: true }}
                    focus={state.focusedExpertCode}
                    onFocus={(focusedExpertCode) => update({ focusedExpertCode })}
                  />
                </Suspense>
              )}
            </div>
          </>
        )}
        {state.mode === "platform" && (
          <div className="p-4 sm:p-6">
            <p className="mb-4 rounded border border-warning/50 bg-warning/10 p-3 text-xs leading-relaxed">
              {isUk
                ? "Концептуальне групування функцій із пропозиції, не схема готової production-системи."
                : "Conceptual grouping of proposal capabilities, not a diagram of a completed production system."}
            </p>
            <div className="mb-4 flex justify-center">
              <div className="rounded-full border border-primary/50 bg-primary/10 px-5 py-3 text-center font-display text-lg">
                {isUk ? "Інфраструктура довіри ISRM" : "ISRM trust infrastructure"}
              </div>
            </div>
            <div className="mx-auto mb-4 h-5 w-px bg-border" aria-hidden="true" />
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-4 left-[12.5%] right-[12.5%] hidden border-t border-border xl:block"
              />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {CAPABILITY_GROUPS[locale].map((group) => (
                  <article
                    key={group.title}
                    className="relative rounded border border-border bg-card p-4"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -top-4 left-1/2 hidden h-4 w-px bg-border xl:block"
                    />
                    <h4 className="font-semibold">{group.title}</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
        {state.mode === "dependencies" && (
          <div className="p-4 sm:p-6">
            <p className="mb-4 rounded border border-warning/50 bg-warning/10 p-3 text-xs leading-relaxed">
              {isUk
                ? "Показано лише залежності, прямо записані в каталозі пропозиції. Відсутність стрілки не означає, що реалізація не має технічних передумов."
                : "Only prerequisites explicitly recorded in this proposal catalogue are shown. No arrow does not mean implementation has no technical prerequisites."}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CATALOG.map((service) => {
                const requirements = getRequirements(service);
                return (
                  <article
                    key={service.serviceId}
                    className="rounded border border-border bg-card p-4"
                  >
                    <p className="font-mono text-xs text-muted-foreground">
                      {isUk ? "Модуль" : "Module"} {service.phase}
                    </p>
                    <h4 className="mt-1 font-semibold">
                      {isUk
                        ? (SERVICE_UK_COPY[service.serviceId]?.title ?? service.title)
                        : service.title}
                    </h4>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {isUk ? "Потребує" : "Requires"}
                    </p>
                    {requirements.length ? (
                      <ul className="mt-1 space-y-1 text-sm">
                        {requirements.map((requirement) => {
                          const prerequisite = SERVICE_CATALOG.find(
                            (candidate) => candidate.serviceId === requirement,
                          );
                          return (
                            <li key={requirement} className="text-primary">
                              ←{" "}
                              {isUk
                                ? (SERVICE_UK_COPY[requirement]?.title ?? prerequisite?.title)
                                : prerequisite?.title}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isUk ? "Явну передумову не зазначено" : "No explicit prerequisite listed"}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProposalSection() {
  const { locale } = useI18n();
  const c = COPY[locale];
  const { state, update } = useConfiguratorState();
  const included = state.includedFeatures;
  const [commercialPath, setCommercialPath] = useState("");
  const [needDescription, setNeedDescription] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [finalTask, setFinalTask] = useState("");
  const isUk = locale === "uk";
  const text = isUk
    ? {
        configure: "Зберіть бриф пропозиції",
        configureHelp:
          "Ядро наведено як базовий пропонований обсяг. Перевірте додаткові модулі, опишіть потребу й сформуйте бриф для обговорення; точний обсяг та оцінку буде визначено після підтверджень.",
        selected: "додаткових модулів обрано",
        included: "Додано до обсягу",
        dependency: "Потрібна залежність",
        coreAcceptance: "Критерії приймання ядра",
        scopeEstimate: "Бюджет і строки",
        scopeNote: "Визначити після уточнення потреби та оцінки обраного обсягу.",
        noScope:
          "Базовий обсяг визначений у ядрі пропозиції; за потреби виберіть додатковий модуль вище.",
        commercial: "Модель роботи та права — предмет обговорення",
        commercialNote:
          "Вибір фіксує тему для обговорення, але не погоджує ціну, передачу прав, частку чи дохід.",
        pilot: "Партнерський пілот",
        pilotDesc:
          "Спільно перевірити перший цикл на мережі; окремо погодити внесок учасників, SaaS-умови, підтримку та будь-який механізм співвласності.",
        transfer: "Замовна розробка з передачею коду",
        transferDesc:
          "Етапна розробка для спільноти/замовника; обсяг передачі прав, повторне використання компонентів і ліцензії визначаються договором.",
        standard: "Звичайна розробка / використання сервісу",
        standardDesc:
          "Оплатити погоджений обсяг робіт і окремо домовитися про підтримку чи SaaS після запуску; IP-умови не припускаються автоматично.",
        final: "Обсяг пропозиції та підтвердження замовника",
        finalPurpose:
          "Цей бриф фіксує запропонований обсяг, очікувані результати й відкриті рішення. Він призначений для погодження пілота; не є фіксованою ціною, графіком чи зобов’язанням почати розробку.",
        need: "Опишіть потребу, рішення або результат, якого очікуєте",
        name: "Ім’я та роль (необов’язково)",
        comment: "Відкриті питання або додаткові умови",
        send: "Сформувати бриф пропозиції",
        demoNotice:
          "Бриф зберігається лише в локальній демо-черзі цього застосунку; він не надсилається замовнику автоматично й не є офертою чи погодженням бюджету/строків.",
        sent: "Бриф сформовано й додано до локальної демо-черги; його не надіслано замовнику.",
        empty: "—",
        reset: "Скинути додаткові модулі",
        requiredFor: "Потрібно для",
        core: "Базове ядро пропозиції",
        optional: "Додаткові модулі",
        taskNeed: "Потреба замовника",
        deliverables: "Результат",
        acceptance: "Критерій приймання",
        clientInput: "Потрібно від замовника",
        openQuestions: "Відкриті питання до Discovery",
        dependencies: "Невирішені залежності",
        exclusions: "Поза обсягом без окремого погодження",
        budget: "Бюджет і строки",
        stages: "Етапи",
        stageText:
          "Підтвердження пілотного сценарію й даних → Discovery та фіксація обсягу → оцінка й погодження комерційних умов → реалізація, приймання та передача. Календарний план визначається після оцінки.",
      }
    : {
        configure: "Build the proposal brief",
        configureHelp:
          "The core is presented as the proposed baseline. Review optional modules, describe the need and prepare a discussion brief; final scope and estimate follow client confirmations.",
        selected: "optional modules selected",
        included: "Included in scope",
        dependency: "Prerequisite missing",
        coreAcceptance: "Core acceptance criteria",
        scopeEstimate: "Budget and timing",
        scopeNote: "To be established after clarifying the need and estimating the selected scope.",
        noScope: "The proposal baseline is defined above; select optional modules as needed.",
        commercial: "Engagement and IP options · discussion only",
        commercialNote:
          "This records a discussion topic; it does not agree price, rights transfer, equity or revenue.",
        pilot: "Founding / partner pilot",
        pilotDesc:
          "Validate the first operating cycle with the network; separately negotiate member contribution, SaaS terms, support and any co-ownership mechanism.",
        transfer: "Custom delivery with code transfer",
        transferDesc:
          "Staged build for the client/community; transfer scope, reusable components and licenses require explicit contract terms.",
        standard: "Standard build / service use",
        standardDesc:
          "Pay for the agreed scope and separately discuss support or SaaS after launch; IP terms are not assumed.",
        final: "Proposal scope and client confirmations",
        finalPurpose:
          "This brief records the proposed scope, expected outcomes and open decisions. It is intended to agree the pilot; it is not a fixed fee, delivery schedule or commitment to begin implementation.",
        need: "Describe the need, decision or expected outcome",
        name: "Name and role (optional)",
        comment: "Open questions or additional conditions",
        send: "Prepare proposal brief",
        demoNotice:
          "The brief is stored only in this application's local demo inbox; it is not sent to the client and is not an offer or approval of budget/timing.",
        sent: "Brief generated and added to the local demo inbox; it has not been sent to the client.",
        empty: "—",
        reset: "Reset optional modules",
        requiredFor: "Required by",
        core: "Proposed baseline scope",
        optional: "Optional modules",
        taskNeed: "Client need",
        deliverables: "Deliverable",
        acceptance: "Acceptance criterion",
        clientInput: "Client input required",
        openQuestions: "Open Discovery questions",
        dependencies: "Unresolved dependencies",
        exclusions: "Out of scope unless separately agreed",
        budget: "Budget and timing",
        stages: "Stages",
        stageText:
          "Confirm pilot scenario and data → Discovery and scope definition → estimate and commercial approval → implementation, acceptance and handover. Schedule follows scope estimation.",
      };

  const includedServices = SERVICE_CATALOG.filter((service) =>
    included.includes(service.serviceId as FeatureId),
  );
  const selectedOptionalServices = includedServices.filter(
    (service) => !CORE_FEATURES.includes(service.serviceId as FeatureId),
  );
  const serviceTitle = (service: ServiceCatalogItem) =>
    isUk
      ? (SERVICE_UK_COPY[service.serviceId as FeatureId]?.title ?? service.title)
      : service.title;
  const serviceDeliverable = (service: ServiceCatalogItem) =>
    isUk
      ? (SERVICE_UK_COPY[service.serviceId as FeatureId]?.deliverable ?? service.deliverables)
      : service.deliverables;
  const serviceAcceptance = (service: ServiceCatalogItem) =>
    isUk
      ? (SERVICE_UK_COPY[service.serviceId as FeatureId]?.acceptance ?? service.acceptance)
      : service.acceptance;
  const serviceClientInput = (service: ServiceCatalogItem) =>
    isUk
      ? (SERVICE_UK_COPY[service.serviceId as FeatureId]?.clientInput ?? service.client)
      : service.client;
  const featureName = (id: FeatureId) => {
    const service = SERVICE_CATALOG.find((candidate) => candidate.serviceId === id);
    return service ? serviceTitle(service) : id;
  };
  const submitConfiguration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!needDescription.trim()) return;
    const missingDependencies = selectedOptionalServices.flatMap((service) =>
      getRequirements(service)
        .filter((id) => !included.includes(id))
        .map((id) => `${serviceTitle(service)} → ${featureName(id)}`),
    );
    const task = [
      isUk ? "ISRM — ПРОПОЗИЦІЯ ДЛЯ ОБГОВОРЕННЯ" : "ISRM — PROPOSAL FOR DISCUSSION",
      name.trim() ? `${isUk ? "Замовник / контакт" : "Client / contact"}: ${name.trim()}` : "",
      "",
      `${text.taskNeed}:\n${needDescription.trim()}`,
      "",
      `${text.core}:\n${CORE_SCOPE_COPY[locale].map((item) => `- ${item}`).join("\n")}`,
      "",
      `${text.coreAcceptance}:\n${CORE_ACCEPTANCE_COPY[locale].map((item) => `- ${item}`).join("\n")}`,
      "",
      `${isUk ? "Два підтвердження замовника до фінальної оцінки" : "Two client confirmations required before final estimate"}:\n${CLIENT_CONFIRMATIONS_COPY[locale].map((item, index) => `${index + 1}. ${item}`).join("\n")}`,
      `${isUk ? "Застереження щодо демо-даних" : "Demo-data caveat"}:\n${DEMO_DATA_CAVEAT_COPY[locale]}`,
      "",
      `${text.optional}:\n${
        selectedOptionalServices.length
          ? selectedOptionalServices
              .map(
                (service) =>
                  `- ${serviceTitle(service)}\n  ${text.deliverables}: ${serviceDeliverable(service)}\n  ${text.acceptance}: ${serviceAcceptance(service)}`,
              )
              .join("\n")
          : `- ${text.empty}`
      }`,
      "",
      `${text.openQuestions}:\n${[
        ...selectedOptionalServices.map(serviceClientInput),
        isUk
          ? "Підтвердити джерела даних і правову підставу обробки, ролі доступу, правила згоди/відкликання та строк зберігання."
          : "Confirm data sources and lawful basis, access roles, consent/withdrawal rules and retention period.",
        isUk
          ? "Погодити AI-провайдерів, межі використання, людську перевірку та окремі витрати на зовнішні API."
          : "Approve AI providers, use boundaries, human review and any external API costs.",
        isUk
          ? "Підтвердити інтеграції, середовище розміщення, підтримку й операційного власника."
          : "Confirm integrations, hosting environment, support and operational owner.",
      ]
        .map((item) => `- ${item}`)
        .join("\n")}`,
      missingDependencies.length
        ? `\n${text.dependencies}:\n${missingDependencies.map((item) => `- ${item}`).join("\n")}`
        : "",
      comment.trim() ? `\n${text.comment}:\n${comment.trim()}` : "",
      "",
      `${text.exclusions}:\n${
        SERVICE_CATALOG.filter((service) => !included.includes(service.serviceId as FeatureId))
          .map((service) => `- ${serviceTitle(service)}`)
          .join("\n") || `- ${text.empty}`
      }\n- ${isUk ? "Зовнішні API/дані, міграція великих масивів і канальні інтеграції — якщо їх явно не погоджено." : "External APIs/data, large-scale migration and channel integrations unless explicitly agreed."}`,
      "",
      `${text.stages}:\n- ${text.stageText}`,
      "",
      `${text.budget}: TBD — ${text.scopeNote}`,
      isUk
        ? "\nОплата: аванс — не менше 30%; загалом — не більше трьох платежів. Частки наступних платежів погоджуються після оцінки й фіксації етапів."
        : "\nPayment structure: advance payment of at least 30%; no more than three payments in total. Remaining milestone shares are subject to agreement after estimation and scope definition.",
      commercialPath
        ? `\n${isUk ? "Модель для обговорення" : "Engagement model for discussion"}: ${
            commercialPath === "partner-pilot"
              ? text.pilot
              : commercialPath === "code-transfer"
                ? text.transfer
                : text.standard
          }`
        : "",
      "",
      isUk
        ? "Робочий бриф для обговорення; не є офертою, договором чи підтвердженням бюджету/строків."
        : "Working discussion brief; not an offer, contract or confirmation of budget/timing.",
    ]
      .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
      .join("\n");
    setFinalTask(task);
    pushInbox({
      kind: "feedback",
      from: name || "Proposal visitor",
      topic: isUk ? "Чернетка брифу пропозиції" : "Proposal brief draft",
      message: task,
    });
    setSubmitted(true);
  };

  return (
    <section
      id="proposal"
      className="proposal-light scroll-mt-16 px-4 py-10 pb-28 text-foreground sm:px-5 sm:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-chart-4">
          03 · {c.eyebrow}
        </p>
        <div className="mt-5 rounded border border-primary/40 bg-primary/5 p-4 text-sm">
          <h3 className="font-semibold">
            {isUk
              ? "Два підтвердження замовника до фінальної оцінки"
              : "Two client confirmations before final estimation"}
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-muted-foreground">
            {CLIENT_CONFIRMATIONS_COPY[locale].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <h2 className="mt-2 max-w-4xl font-display text-3xl leading-tight sm:text-4xl">
          {c.title}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {c.pricingIntro}
        </p>
        <p className="mt-4 max-w-3xl rounded border border-warning/50 bg-warning/10 p-3 text-sm leading-relaxed">
          <strong>{isUk ? "Застереження щодо демо-даних: " : "Demo-data caveat: "}</strong>
          {DEMO_DATA_CAVEAT_COPY[locale]}
        </p>
        <ProposalGraphSwitcher />
        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print / PDF
          </Button>
          <a
            className="inline-flex items-center rounded border border-border px-3 py-2 text-sm font-medium"
            href="#feedback"
          >
            {isUk ? "До форми брифу" : "Open brief form"}
          </a>
        </div>

        <section className="mt-10 scroll-mt-20" id="scope-list">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-chart-1">
              {isUk ? "Обсяг і наслідки вибору" : "Scope and trade-offs"}
            </p>
            <h3 className="mt-2 font-display text-3xl">
              {isUk ? "Що входить у конфігурацію" : "What goes into this configuration"}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {isUk
                ? "Нижче показано базове ядро пропозиції. Додаткові модулі можна змінити в Future Features; ціна й календарний план будуть погоджені окремо після підтверджень."
                : "The proposed baseline scope is shown below. Optional modules can be changed in Future Features; fee and schedule will be agreed separately after client confirmations."}
            </p>
          </div>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {SERVICE_CATALOG.map((service) => {
              const featureId = service.serviceId as FeatureId;
              const isIncluded = included.includes(featureId);
              const missing = getRequirements(service).filter((id) => !included.includes(id));
              const dependentServices = SERVICE_CATALOG.filter((candidate) =>
                getRequirements(candidate).includes(featureId),
              );
              return (
                <article
                  id={`scope-${service.serviceId}`}
                  key={service.phase}
                  data-tone={FEATURE_TONES[featureId]}
                  className={`proposal-feature-row scroll-mt-24 py-4 sm:py-5 ${isIncluded ? "is-included" : ""}`}
                >
                  <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="feature-index font-display text-2xl tabular-nums">
                        {service.phase}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h4 className="font-display text-xl">{serviceTitle(service)}</h4>
                          <span className="feature-state">
                            {isIncluded
                              ? isUk
                                ? "Включено"
                                : "Included"
                              : isUk
                                ? "Не включено"
                                : "Not included"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <a
                        href={`/#${service.serviceId}`}
                        className="inline-flex min-h-10 items-center rounded border border-border px-3 text-sm font-medium hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {isUk ? "Макет сервісу" : "Service mockup"} →
                      </a>
                    </div>
                  </div>
                  {missing.length > 0 && isIncluded && (
                    <p className="mt-4 flex items-start gap-2 rounded border border-warning/50 bg-warning/10 p-3 text-sm">
                      <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        <strong>{text.dependency}:</strong>{" "}
                        {missing.map((id) => featureName(id as FeatureId)).join(", ")}.{" "}
                        {isUk
                          ? "Цей сервіс лишається в оцінці, але його шлях залежатиме від погодження передумови."
                          : "This service remains in the estimate, but its workflow depends on approving the prerequisite."}
                      </span>
                    </p>
                  )}
                  {!isIncluded && dependentServices.length > 0 && (
                    <p className="mt-4 rounded border border-warning/50 bg-warning/10 p-3 text-sm">
                      <strong>{isUk ? "Без цього сервісу:" : "Without this capability:"}</strong>{" "}
                      {dependentServices.map(serviceTitle).join(", ")}{" "}
                      {isUk
                        ? "втратять відповідну залежну функцію."
                        : "will lose the dependent workflow."}
                    </p>
                  )}
                  <p className="mt-3 inline-flex min-h-10 items-center rounded border border-border bg-card px-3 py-2 text-sm font-medium">
                    {isIncluded
                      ? isUk
                        ? "Вибрано у Future Features"
                        : "Selected in Future Features"
                      : isUk
                        ? "Відхилено у Future Features"
                        : "Excluded in Future Features"}
                  </p>
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                      {isUk
                        ? "Технічний напрям, дані й критерії приймання"
                        : "Proposed technical direction, data and acceptance"}
                    </summary>
                    <div className="mt-3 grid gap-3 border-l-2 border-[var(--feature-accent)] pl-4 md:grid-cols-2">
                      <p>
                        <strong>
                          {isUk
                            ? "Технічний напрям (уточнити):"
                            : "Technical direction (to confirm):"}
                        </strong>{" "}
                        <span className="text-muted-foreground">{service.stack}</span>
                      </p>
                      <p>
                        <strong>{isUk ? "Строки:" : "Timing:"}</strong>{" "}
                        <span className="text-muted-foreground">TBD</span>
                      </p>
                      <p>
                        <strong>{isUk ? "Дані / доступ:" : "Data / access:"}</strong>{" "}
                        <span className="text-muted-foreground">{service.data}</span>
                      </p>
                      <p>
                        <strong>{isUk ? "Участь клієнта:" : "Client participation:"}</strong>{" "}
                        <span className="text-muted-foreground">{serviceClientInput(service)}</span>
                      </p>
                      <p>
                        <strong>{isUk ? "Результати:" : "Deliverables:"}</strong>{" "}
                        <span className="text-muted-foreground">{serviceDeliverable(service)}</span>
                      </p>
                      <p>
                        <strong>{isUk ? "Приймання:" : "Acceptance:"}</strong>{" "}
                        <span className="text-muted-foreground">{serviceAcceptance(service)}</span>
                      </p>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 scroll-mt-20" id="configuration">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {isUk ? "Збирання брифу пропозиції" : "Proposal brief builder"}
            </p>
            <h2 className="mt-2 font-display text-4xl">{c.pricing}</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded border border-border bg-card p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl">{text.configure}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {text.configureHelp}
                  </p>
                </div>
                <span className="rounded border border-border px-2 py-1 font-mono text-xs">
                  {selectedOptionalServices.length} {text.selected}
                </span>
              </div>
              <div className="mt-5 rounded border border-chart-2/40 bg-chart-2/10 p-4">
                <h3 className="font-semibold">{text.core}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {CORE_SCOPE_COPY[locale].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => update({ includedFeatures: [...DEFAULT_FEATURES] })}
              >
                {text.reset}
              </Button>
            </div>

            <aside className="h-fit rounded border border-primary/50 bg-primary/5 p-5 lg:sticky lg:top-5">
              <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {text.scopeEstimate}
              </p>
              <p className="mt-2 font-display text-3xl leading-tight text-primary">TBD</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{text.scopeNote}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {isUk
                  ? "Фіксовані транші й ціни модулів не задані: їх визначають після кошторису."
                  : "No fixed tranches or module prices are set; these follow the estimate."}
              </p>
            </aside>
          </div>
          <div className="mt-5 grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-2">
            <div className="bg-card p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-medium">{c.rationale}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.rationaleText}</p>
            </div>
            <div className="bg-card p-5">
              <Server className="h-5 w-5 text-chart-2" />
              <h3 className="mt-3 font-medium">{c.assumptions}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.assumptionsText}</p>
            </div>
          </div>
        </section>

        <details className="mt-8 rounded border border-border bg-card">
          <summary className="cursor-pointer px-5 py-4 font-display text-xl hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {isUk ? "Архітектура та етапи реалізації" : "Architecture and delivery roadmap"}
          </summary>
          <div className="border-t border-border p-5 sm:p-6">
            <h3 className="font-display text-lg">{c.architecture}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {c.arch.map(([title, description]) => (
                <article key={title} className="border-l-2 border-chart-2 pl-3">
                  <h4 className="font-semibold">{title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
            <h3 className="mt-7 font-display text-lg">{c.roadmap}</h3>
            <div className="mt-3 space-y-3">
              {c.road.map(([timing, title, description]) => (
                <article
                  key={timing}
                  className="grid gap-1 border-l-2 border-chart-1 pl-3 sm:grid-cols-[120px_minmax(0,1fr)]"
                >
                  <p className="font-mono text-xs uppercase tracking-wide text-chart-1">{timing}</p>
                  <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </details>

        <section className="mt-16" id="commercial-model">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {isUk ? "Після пілота" : "After the pilot"}
            </p>
            <h2 className="mt-2 font-display text-3xl">{text.commercial}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text.commercialNote}</p>
          </div>
          <fieldset className="mt-5 grid gap-3 lg:grid-cols-3">
            <legend className="sr-only">{text.commercial}</legend>
            {[
              { id: "partner-pilot", title: text.pilot, desc: text.pilotDesc },
              { id: "code-transfer", title: text.transfer, desc: text.transferDesc },
              { id: "standard-use", title: text.standard, desc: text.standardDesc },
            ].map(({ id, title, desc }) => (
              <label
                key={id}
                className={`cursor-pointer rounded border p-4 transition-colors ${commercialPath === id ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="commercial-path"
                    value={id}
                    checked={commercialPath === id}
                    onChange={() => setCommercialPath(id)}
                    className="mt-1 h-4 w-4 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </section>

        <section
          className="mt-16 grid gap-8 border-t border-border pt-8 md:grid-cols-2"
          id="feedback"
        >
          <div>
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-display text-3xl">{text.final}</h2>
            <p className="mt-2 text-muted-foreground">
              {isUk
                ? "Після опису потреби й налаштування модулів сформуйте бриф для обговорення з результатами, критеріями приймання та відкритими питаннями."
                : "After describing the need and configuring modules, prepare a discussion brief with expected outcomes, acceptance criteria and open questions."}
            </p>
            <p className="mt-3 rounded border border-border bg-card p-3 text-sm text-muted-foreground">
              {text.finalPurpose}
            </p>
            <div className="mt-5 rounded border border-border bg-card p-4 text-sm">
              <p className="font-semibold">{text.core}</p>
              <p className="mt-2 text-muted-foreground">
                {isUk
                  ? "Безпека, профілі, пошук, AI-зіставлення, кампанії, співпраця, модерація та provenance."
                  : "Security, profiles, search, AI matching, campaigns, collaboration, moderation and provenance."}
              </p>
              <p className="mt-4 font-semibold">
                {text.optional} ({selectedOptionalServices.length})
              </p>
              <p className="mt-1 text-muted-foreground">
                {selectedOptionalServices.map(serviceTitle).join(", ") || text.empty}
              </p>
              <p className="mt-4 font-display text-xl text-primary">{text.budget}: TBD</p>
            </div>
          </div>
          {submitted ? (
            <div className="space-y-3">
              <p
                role="status"
                aria-live="polite"
                className="rounded border border-success/40 bg-success/10 p-4 text-success"
              >
                {text.sent}
              </p>
              <pre className="max-h-[36rem] overflow-auto whitespace-pre-wrap rounded border border-border bg-card p-5 text-sm leading-relaxed">
                {finalTask}
              </pre>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFinalTask("");
                }}
              >
                {isUk ? "Редагувати бриф" : "Edit brief"}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={submitConfiguration}
              className="space-y-3 rounded border border-border bg-card p-5"
            >
              <label className="block text-sm font-medium">
                {text.need}
                <textarea
                  name="needDescription"
                  value={needDescription}
                  onChange={(event) => setNeedDescription(event.target.value)}
                  rows={5}
                  required
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-base"
                />
              </label>
              <label className="block text-sm font-medium">
                {text.name}
                <input
                  name="contactName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-base"
                  autoComplete="name"
                />
              </label>
              <label className="block text-sm font-medium">
                {text.comment}
                <textarea
                  name="comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-base"
                />
              </label>
              <p className="text-xs leading-relaxed text-muted-foreground">{text.demoNotice}</p>
              <Button type="submit" disabled={!needDescription.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {text.send}
              </Button>
            </form>
          )}
        </section>
      </div>
    </section>
  );
}
