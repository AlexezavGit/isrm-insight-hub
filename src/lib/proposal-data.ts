export type LocaleCopy = { en: string; uk: string };
export type PartnerRoleId = "communications" | "operations" | "product";

export interface PartnerRole {
  id: PartnerRoleId;
  name: LocaleCopy;
  purpose: LocaleCopy;
  standardEquivalent: LocaleCopy;
  outputs: LocaleCopy[];
  kpi: LocaleCopy;
}

export interface ProposalFunction {
  id: string;
  title: LocaleCopy;
  purpose: LocaleCopy;
  capabilities: LocaleCopy[];
  dependencies: string[];
  pilotRole: LocaleCopy;
  kpi: LocaleCopy;
  impact: LocaleCopy;
  phase: LocaleCopy;
  group: "mvp" | "pilot" | "later";
  owner: PartnerRoleId | "client";
  acceptance: LocaleCopy;
  source: string;
}

export interface WorkPackage {
  id: string;
  track: string;
  title: LocaleCopy;
  role: PartnerRoleId | "developer";
  hours: number;
  hoursLow: number;
  hoursHigh: number;
  basis: LocaleCopy;
  deliverable: LocaleCopy;
  acceptance: LocaleCopy;
  gatedByFunction?: string;
}

export interface DossierStage {
  id: string;
  title: LocaleCopy;
  role: PartnerRoleId | "client";
  costed: boolean;
  minutes: number;
  minutesLow: number;
  minutesHigh: number;
  basis: LocaleCopy;
}

export const PARTNER_ROLES: PartnerRole[] = [
  {
    id: "communications",
    name: {
      en: "Client communications & business development",
      uk: "Комунікація із замовником і розвиток бізнесу",
    },
    purpose: {
      en: "Lead client discovery and board communication, clarify decisions and coordinate partner/commercial alignment.",
      uk: "Вести роботу із замовником і комунікацію з бордом, уточнювати рішення та координувати партнерські й комерційні узгодження.",
    },
    standardEquivalent: {
      en: "Client communications and business development",
      uk: "Комунікація із замовником і розвиток бізнесу",
    },
    outputs: [
      { en: "Client and board decision log", uk: "Журнал рішень замовника й борду" },
      { en: "Commercial and partner coordination", uk: "Комерційна й партнерська координація" },
      { en: "Documented next steps and owners", uk: "Задокументовані наступні кроки й власники" },
    ],
    kpi: {
      en: "Decision items with an owner and next step ÷ all open decision items.",
      uk: "Пункти рішень із власником і наступним кроком ÷ усі відкриті пункти рішень.",
    },
  },
  {
    id: "operations",
    name: {
      en: "Operations, OSINT, events & external communications",
      uk: "Операції, OSINT, події та зовнішні комунікації",
    },
    purpose: {
      en: "Prepare and operate approved research, review, survey, event and outreach workflows using authorized sources and channels.",
      uk: "Готувати й виконувати погоджені дослідницькі, перевірочні, опитувальні, подієві та комунікаційні процеси з дозволеними джерелами й каналами.",
    },
    standardEquivalent: {
      en: "Operations, OSINT and external communications",
      uk: "Операції, OSINT і зовнішні комунікації",
    },
    outputs: [
      {
        en: "Authorized research and review process",
        uk: "Погоджений процес дослідження й перевірки",
      },
      {
        en: "Survey, event and outreach delivery records",
        uk: "Записи проведення опитувань, подій і комунікацій",
      },
      {
        en: "Observed evidence and response findings",
        uk: "Фактичні докази й результати відповідей",
      },
    ],
    kpi: {
      en: "Records with authorized source/channel and traceable outcome ÷ records processed.",
      uk: "Записи з дозволеним джерелом/каналом і простежуваним результатом ÷ опрацьовані записи.",
    },
  },
  {
    id: "product",
    name: {
      en: "Product owner, strategy & developer relationships",
      uk: "Власник продукту, стратегія та робота з розробниками",
    },
    purpose: {
      en: "Lead strategy and product definition, turn approved needs into a dependency-aware backlog and coordinate developer scope and acceptance.",
      uk: "Вести стратегію й визначення продукту, перетворювати погоджені потреби на backlog із залежностями та координувати обсяг і приймання робіт розробників.",
    },
    standardEquivalent: {
      en: "Product owner and strategy lead",
      uk: "Власник продукту й керівник стратегії",
    },
    outputs: [
      {
        en: "Strategy and expertise-gap priorities",
        uk: "Стратегічні пріоритети й прогалини експертизи",
      },
      {
        en: "Prioritized, testable product backlog",
        uk: "Пріоритизований backlog із тестованими вимогами",
      },
      {
        en: "Supplier scope, acceptance and handover",
        uk: "Обсяг постачальника, приймання й передача",
      },
    ],
    kpi: {
      en: "Accepted deliverables ÷ submitted deliverables; hours and scope changes tracked against the approved plan.",
      uk: "Прийняті результати ÷ подані результати; години й зміни обсягу звіряються з погодженим планом.",
    },
  },
];

export const CO_DESIGN_SESSIONS = [
  {
    id: "session-strategy",
    title: { en: "Priorities & expertise gaps", uk: "Пріоритети й прогалини експертизи" },
  },
  {
    id: "session-trust",
    title: {
      en: "Trust & Influence Index (TII)",
      uk: "Trust & Influence Index (TII)",
    },
  },
  {
    id: "session-pilot",
    title: { en: "Pilot and community activation", uk: "Пілот і залучення спільноти" },
  },
] satisfies { id: string; title: LocaleCopy }[];

export const PROPOSAL_FUNCTIONS: ProposalFunction[] = [
  {
    id: "search",
    title: { en: "Expert search & group selection", uk: "Пошук експертів і відбір групи" },
    purpose: {
      en: "Filter the existing 178-record CRM cohort for planning.",
      uk: "Фільтрувати наявну CRM-когорту з 178 записів для планування.",
    },
    capabilities: [
      {
        en: "Sector, CRM-recorded area and public-source flag filters",
        uk: "Фільтри за сектором, країною в CRM і наявністю публічного джерела",
      },
      {
        en: "Names and professional mini-dossiers for the closed partner review",
        uk: "Імена й професійні міні-досьє для закритого партнерського перегляду",
      },
      {
        en: "Save a candidate group in the local review draft",
        uk: "Зберегти групу кандидатів у локальній чернетці погодження",
      },
    ],
    dependencies: ["group-save", "review-protocol"],
    pilotRole: {
      en: "Create a review cohort; a match is not consent, interest or qualification.",
      uk: "Сформувати когорту для перевірки; збіг не є згодою, інтересом чи підтвердженою кваліфікацією.",
    },
    kpi: {
      en: "Correctly matched test records ÷ all test records; source is the approved test set.",
      uk: "Правильно зіставлені тестові записи ÷ усі тестові записи; джерело — погоджений тестовий набір.",
    },
    impact: {
      en: "Makes the review cohort traceable and reduces unstructured selection.",
      uk: "Робить когорту простежуваною та зменшує неструктурований відбір.",
    },
    phase: { en: "Partner-review prototype", uk: "Партнерський демонстраційний прототип" },
    group: "mvp",
    owner: "product",
    acceptance: {
      en: "Filters return the expected cohort; names and professional fields appear in the closed review, while contacts and raw evidence are excluded from mini-dossiers.",
      uk: "Фільтри повертають очікувану когорту; імена й професійні поля доступні в закритому перегляді, контакти та сирі докази не додаються до міні-досьє.",
    },
    source: "REQ-002 · SEC-001",
  },
  {
    id: "group-save",
    title: {
      en: "Persistent groups & project assignment",
      uk: "Збережені групи та призначення до проєкту",
    },
    purpose: {
      en: "Store approved groups and their project relationship behind role-based permissions.",
      uk: "Зберігати погоджені групи та зв’язок із проєктом за рольовими правами доступу.",
    },
    capabilities: [
      { en: "Named group and project linkage", uk: "Іменована група та зв’язок із проєктом" },
      { en: "Change history and accountable owner", uk: "Історія змін і відповідальний власник" },
      {
        en: "Consent and access gates before operational use",
        uk: "Ворота згоди й доступу до операційного використання",
      },
    ],
    dependencies: ["search", "review-protocol"],
    pilotRole: {
      en: "Move only approved selections from a local draft into a governed project workflow.",
      uk: "Переносити лише погоджені вибори з локальної чернетки в керований процес проєкту.",
    },
    kpi: {
      en: "Groups with owner, approval and change record ÷ groups activated.",
      uk: "Групи з власником, погодженням та історією змін ÷ активовані групи.",
    },
    impact: {
      en: "Enables repeatable cohort management without a spreadsheet-only workflow.",
      uk: "Дає змогу повторно керувати когортами без процесу, прив’язаного лише до таблиць.",
    },
    phase: {
      en: "Pilot MVP — gated on data and access design",
      uk: "MVP пілота — після погодження даних і доступу",
    },
    group: "mvp",
    owner: "product",
    acceptance: {
      en: "Authorized users can save, retrieve and audit a group; unauthorized reads and writes are denied.",
      uk: "Авторизовані користувачі зберігають, переглядають і аудіюють групу; неавторизовані читання й зміни блокуються.",
    },
    source: "SW-01 · access and consent gate",
  },
  {
    id: "review-protocol",
    title: {
      en: "Trust & Influence Index (TII) and review protocol",
      uk: "Trust & Influence Index (TII) і протокол перевірки",
    },
    purpose: {
      en: "Co-design the index with the client, evidence classes, governance and correction path.",
      uk: "Спільно з замовником розробити індекс, класи доказів, врядування й шлях виправлення.",
    },
    capabilities: [
      {
        en: "Versioned definitions and evidence provenance",
        uk: "Версійовані визначення та походження доказів",
      },
      {
        en: "Reviewer conflict, challenge and appeal steps",
        uk: "Етапи конфлікту інтересів, заперечення й оскарження",
      },
      {
        en: "Explicit limits; no sector-standard claim without validation",
        uk: "Явні обмеження; без заяви про галузевий стандарт без валідації",
      },
    ],
    dependencies: ["session-trust", "reviewers", "knowledge-base"],
    pilotRole: {
      en: "Give selected practice leaders and regional representatives a repeatable human-review method.",
      uk: "Надати відібраним керівникам практик і регіональним представникам відтворюваний метод людської перевірки.",
    },
    kpi: {
      en: "Agreed protocol controls passed ÷ controls tested; inter-reviewer agreement is measured, not pre-set.",
      uk: "Виконані погоджені контролі протоколу ÷ перевірені контролі; узгодженість рецензентів вимірюється, а не задається наперед.",
    },
    impact: {
      en: "Makes evidence quality and decision ownership reviewable.",
      uk: "Робить якість доказів і власність рішень придатними до перевірки.",
    },
    phase: { en: "Co-design before dossier pilot", uk: "Спільне проєктування до пілота досьє" },
    group: "mvp",
    owner: "product",
    acceptance: {
      en: "Client approves versioned criteria, evidence rules, conflict controls and appeal path.",
      uk: "Замовник погоджує версійовані критерії, правила доказів, контроль конфліктів і порядок оскарження.",
    },
    source: "TI-04 · TI-05",
  },
  {
    id: "reviewers",
    title: { en: "Reviewer selection & orientation", uk: "Відбір і навчання рецензентів" },
    purpose: {
      en: "Select practice leaders and regional representatives, then size training to observed baseline knowledge.",
      uk: "Відібрати керівників практик і регіональних представників та визначити навчання за виміряним рівнем знань.",
    },
    capabilities: [
      {
        en: "Selection criteria and conflict check",
        uk: "Критерії відбору та перевірка конфлікту інтересів",
      },
      {
        en: "Short orientation or expanded training based on needs",
        uk: "Короткий вступ або розширене навчання за потребою",
      },
      { en: "Attendance and calibration record", uk: "Облік участі й калібрування" },
    ],
    dependencies: ["review-protocol"],
    pilotRole: {
      en: "Prepare a capable reviewer group before any assessment begins.",
      uk: "Підготувати спроможну групу рецензентів до початку оцінювання.",
    },
    kpi: {
      en: "Selected reviewers completing orientation ÷ selected reviewers; knowledge change measured pre/post.",
      uk: "Відібрані рецензенти, що пройшли вступ ÷ усі відібрані; зміну знань виміряти до/після.",
    },
    impact: {
      en: "Reduces inconsistent interpretation of the agreed protocol.",
      uk: "Зменшує різне тлумачення погодженого протоколу.",
    },
    phase: { en: "After model and protocol approval", uk: "Після погодження моделі й протоколу" },
    group: "pilot",
    owner: "product",
    acceptance: {
      en: "Client/board approve the cohort; every selected reviewer has a recorded orientation status.",
      uk: "Замовник/борд погоджують групу; для кожного відібраного рецензента зафіксовано статус навчання.",
    },
    source: "TI-06 · TI-07 · TI-08",
  },
  {
    id: "knowledge-base",
    title: {
      en: "Expert knowledge base & evidence records",
      uk: "База знань експертів і записи доказів",
    },
    purpose: {
      en: "Organize consented, sourced expertise records with correction and provenance metadata.",
      uk: "Організувати записи експертизи за згодою з джерелами, метаданими походження й виправлень.",
    },
    capabilities: [
      {
        en: "Source, reviewer, date and evidence class",
        uk: "Джерело, рецензент, дата й клас доказу",
      },
      {
        en: "Correction, appeal and retention controls",
        uk: "Контроль виправлення, оскарження та зберігання",
      },
      { en: "Human-approved outputs only", uk: "Лише результати, затверджені людиною" },
    ],
    dependencies: ["review-protocol", "group-save"],
    pilotRole: {
      en: "Record approved findings for the consenting pilot cohort.",
      uk: "Фіксувати погоджені результати для когорти пілота, що надала згоду.",
    },
    kpi: {
      en: "Records with source, date and reviewer ÷ records accepted into the pilot.",
      uk: "Записи з джерелом, датою та рецензентом ÷ записи, прийняті до пілота.",
    },
    impact: {
      en: "Creates reusable, auditable knowledge rather than unstructured dossiers.",
      uk: "Створює повторно використовуване знання з аудитом замість неструктурованих досьє.",
    },
    phase: {
      en: "Pilot MVP — after privacy and data-rights review",
      uk: "MVP пілота — після перевірки приватності й прав на дані",
    },
    group: "pilot",
    owner: "operations",
    acceptance: {
      en: "Every published assessment has provenance, review status and a correction route.",
      uk: "Кожне оприлюднене оцінювання має походження, статус перевірки й шлях виправлення.",
    },
    source: "DATA-01 · LEGAL-01",
  },
  {
    id: "survey",
    title: { en: "Community questionnaire & campaign", uk: "Опитувальник і кампанія спільноти" },
    purpose: {
      en: "Test member needs, expertise priorities and the value of activating existing experts.",
      uk: "Перевірити потреби учасників, пріоритети експертизи й цінність залучення наявних фахівців.",
    },
    capabilities: [
      {
        en: "Consent-aware questionnaire and approved message pack",
        uk: "Опитувальник зі згодою та погоджений пакет повідомлень",
      },
      {
        en: "Authorized channels and delivery logging",
        uk: "Авторизовані канали й журнал доставки",
      },
      {
        en: "No inferred reach or automated LinkedIn outreach",
        uk: "Без припущення про охоплення й автоматизованого звернення в LinkedIn",
      },
    ],
    dependencies: ["session-pilot", "reviewers"],
    pilotRole: {
      en: "Use existing membership and LinkedIn only as a separately authorized communication lever.",
      uk: "Використати наявних учасників і LinkedIn лише як окремо дозволений канал комунікації.",
    },
    kpi: {
      en: "Delivered invitations and completed responses are reported as observed counts; response rate = responses ÷ delivered invitations.",
      uk: "Доставлені запрошення й завершені відповіді звітуються як фактичні кількості; частка відповідей = відповіді ÷ доставлені запрошення.",
    },
    impact: {
      en: "Evidence informs content priorities, feature demand and member-engagement decisions.",
      uk: "Докази уточнюють пріоритети контенту, попит на функції й рішення щодо залучення учасників.",
    },
    phase: {
      en: "Pilot MVP — launch after privacy/channel approval",
      uk: "MVP пілота — запуск після погодження приватності й каналу",
    },
    group: "pilot",
    owner: "operations",
    acceptance: {
      en: "Privacy owner approves purpose, audience, channel, retention and notice before launch.",
      uk: "Відповідальний за приватність погоджує мету, аудиторію, канал, зберігання й повідомлення до запуску.",
    },
    source: "STR-04 · STR-05 · COMM-EXT",
  },
  {
    id: "campaign-insights",
    title: { en: "Campaign analysis & board findings", uk: "Аналіз кампанії й висновки для борду" },
    purpose: {
      en: "Analyze observed responses and state what existing experts may change in recruitment, content and feature priorities.",
      uk: "Проаналізувати фактичні відповіді й визначити, як наявні експерти можуть вплинути на залучення, контент і пріоритети функцій.",
    },
    capabilities: [
      {
        en: "Response, participation and content-interest summaries",
        uk: "Зведення відповідей, участі й інтересу до контенту",
      },
      {
        en: "Explicit denominators and baseline limitations",
        uk: "Явні знаменники й обмеження бази порівняння",
      },
      {
        en: "Separate association from causal claims",
        uk: "Відокремлення зв’язків від причинних тверджень",
      },
    ],
    dependencies: ["survey", "knowledge-base"],
    pilotRole: {
      en: "Decide whether the application adds measurable value and which functions should be funded next.",
      uk: "Визначити, чи додає застосунок вимірювану цінність і які функції фінансувати далі.",
    },
    kpi: {
      en: "Findings with source, denominator and limitation ÷ findings presented to the board.",
      uk: "Висновки з джерелом, знаменником і обмеженням ÷ висновки, подані борду.",
    },
    impact: {
      en: "Reduces decision uncertainty without claiming unobserved member growth.",
      uk: "Зменшує невизначеність рішень без заяв про незафіксоване зростання учасників.",
    },
    phase: { en: "Pilot evaluation gate", uk: "Ворота оцінювання пілота" },
    group: "pilot",
    owner: "operations",
    acceptance: {
      en: "Board receives a versioned report with source, denominator, method and limitations for each KPI.",
      uk: "Борд отримує версійований звіт із джерелом, знаменником, методом і обмеженнями кожної KPI.",
    },
    source: "STR-06 · GATE-4A",
  },
  {
    id: "budget",
    title: { en: "Project budget & scope gates", uk: "Бюджет проєкту й scope-ворота" },
    purpose: {
      en: "Compare work-package hours, partner rates, direct supplier cost and same-scope commercial alternatives.",
      uk: "Порівняти години пакетів робіт, ставки партнерів, прямі витрати постачальника й комерційні альтернативи того самого scope.",
    },
    capabilities: [
      {
        en: "Editable proposed inputs, evidence-linked formulas and explicit assumptions",
        uk: "Редаговані запропоновані значення, формули з джерелами й явні припущення",
      },
      { en: "Separate currencies and comparator classes", uk: "Окремі валюти й класи порівняння" },
      {
        en: "Explicit exclusions for supplier quotes and external costs until supplied",
        uk: "Явні виключення для котирувань постачальників і зовнішніх витрат до їх надання",
      },
    ],
    dependencies: ["group-save", "knowledge-base", "campaign-insights"],
    pilotRole: {
      en: "Prevent approval of a number that mixes unapproved scope, rates or currencies.",
      uk: "Не допустити погодження суми, що змішує непогоджений scope, ставки чи валюти.",
    },
    kpi: {
      en: "Budget completeness = priced in-scope packages ÷ selected in-scope packages. Budget variation = (revised total − agreed reference total) ÷ agreed reference total; show only after both totals are supported.",
      uk: "Повнота бюджету = оцінені пакети в scope ÷ вибрані пакети в scope. Відхилення бюджету = (переглянутий підсумок − погоджений базовий підсумок) ÷ погоджений базовий підсумок; показувати лише за наявності обґрунтованих сум.",
    },
    impact: {
      en: "Makes price drivers and remaining decisions visible before a client offer is generated.",
      uk: "Показує драйвери ціни й невирішені рішення до формування пропозиції замовнику.",
    },
    phase: {
      en: "Partner review, then client configuration",
      uk: "Партнерське погодження, потім конфігурація замовника",
    },
    group: "mvp",
    owner: "product",
    acceptance: {
      en: "No blank input is silently treated as zero; scenario totals disclose exclusions and currency.",
      uk: "Жоден порожній вхід не вважається нулем; сценарні підсумки розкривають виключення й валюту.",
    },
    source: "Project_Budget · Source_Register",
  },
  {
    id: "billing",
    title: { en: "Membership billing & paid contributions", uk: "Оплата членства й внесків" },
    purpose: {
      en: "Support member payments or paid expert contributions after governance and payment rules are approved.",
      uk: "Підтримати платежі учасників або оплату внесків експертів після погодження врядування й платіжних правил.",
    },
    capabilities: [
      { en: "Membership and contribution accounting", uk: "Облік членства та внесків" },
      { en: "Revenue, tax and refund controls", uk: "Контроль доходів, податків і повернень" },
    ],
    dependencies: ["group-save", "knowledge-base"],
    pilotRole: {
      en: "Not required to test the current pilot; possible future sustainability function.",
      uk: "Не потрібна для поточного пілота; можлива майбутня функція сталості.",
    },
    kpi: {
      en: "Transactions reconciled ÷ transactions recorded; only after a compliant payment system exists.",
      uk: "Звірені транзакції ÷ зафіксовані транзакції; лише після появи відповідної платіжної системи.",
    },
    impact: {
      en: "Could enable a later operating model; no income is included in this budget.",
      uk: "Може забезпечити майбутню операційну модель; доходи не включено до цього бюджету.",
    },
    phase: {
      en: "Future option — separately scoped after the pilot",
      uk: "Майбутня опція — окремий scope після пілота",
    },
    group: "later",
    owner: "client",
    acceptance: {
      en: "Separate approval of legal entity, payment provider, fee policy and accounting.",
      uk: "Окреме погодження юрособи, платіжного провайдера, політики внесків і бухгалтерського обліку.",
    },
    source:
      "COMM-01 · optional post-pilot module; provider fees and legal/tax advice are explicit exclusions",
  },
  {
    id: "semantic-match",
    title: { en: "Semantic matching & recommendations", uk: "Семантичний пошук і рекомендації" },
    purpose: {
      en: "Recommend candidate expertise against a request after the evidence model and consent boundaries are validated.",
      uk: "Рекомендувати експертизу під запит після перевірки моделі доказів і меж згоди.",
    },
    capabilities: [
      { en: "Explainable match reasons", uk: "Пояснювані причини збігу" },
      { en: "Human review and correction", uk: "Людська перевірка й виправлення" },
      {
        en: "No automated contact or qualification decision",
        uk: "Без автоматичного контакту чи рішення про кваліфікацію",
      },
    ],
    dependencies: ["knowledge-base", "review-protocol"],
    pilotRole: { en: "Out of current pilot MVP.", uk: "Поза MVP поточного пілота." },
    kpi: {
      en: "Reviewer-accepted recommendations ÷ recommendations reviewed; evaluate on a consented test set.",
      uk: "Рекомендації, прийняті рецензентом ÷ перевірені рекомендації; оцінювати на тестовому наборі зі згодою.",
    },
    impact: {
      en: "May reduce search time after quality and bias testing.",
      uk: "Може скоротити час пошуку після перевірки якості й упередженості.",
    },
    phase: {
      en: "Later — only after baseline and privacy review",
      uk: "Пізніше — лише після базового вимірювання й перевірки приватності",
    },
    group: "later",
    owner: "product",
    acceptance: {
      en: "Documented benchmark, error analysis and human override approved before release.",
      uk: "До випуску погоджено документований benchmark, аналіз помилок і людське скасування рекомендації.",
    },
    source: "Post-pilot capability; excluded from current estimate pending deliverable breakdown",
  },
  {
    id: "member-services",
    title: {
      en: "Member workspace, events & partner services",
      uk: "Кабінет учасника, події та партнерські сервіси",
    },
    purpose: {
      en: "Provide connected member, event and service operations beyond the bounded pilot.",
      uk: "Надати пов’язані операції учасників, подій і сервісів поза межами обмеженого пілота.",
    },
    capabilities: [
      { en: "Member cabinet and service requests", uk: "Кабінет учасника й запити на сервіси" },
      { en: "Meetings, materials and attendance", uk: "Зустрічі, матеріали й участь" },
      { en: "Partner directory and service accounting", uk: "Реєстр партнерів і облік сервісів" },
    ],
    dependencies: ["group-save", "knowledge-base"],
    pilotRole: {
      en: "Not needed to validate the current search/configurator pilot.",
      uk: "Не потрібні для перевірки поточного пілота пошуку й конфігуратора.",
    },
    kpi: {
      en: "Completed service requests ÷ accepted requests; define baseline after scope approval.",
      uk: "Виконані запити на сервіс ÷ прийняті запити; базу визначити після погодження scope.",
    },
    impact: {
      en: "Extends a validated pilot into a broader service platform.",
      uk: "Розширює перевірений пілот до ширшої сервісної платформи.",
    },
    phase: {
      en: "Later — staged after pilot decision",
      uk: "Пізніше — поетапно після рішення за пілотом",
    },
    group: "later",
    owner: "product",
    acceptance: {
      en: "Each service has an owner, consent boundary, service level and measurable acceptance test.",
      uk: "Для кожного сервісу визначено власника, межу згоди, рівень сервісу й тест приймання.",
    },
    source: "Post-pilot capability; excluded from current estimate pending deliverable breakdown",
  },
];

export const FUNCTION_EXPERT_SECTORS: Record<string, string[]> = {
  search: [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
  "group-save": ["Business / advisory", "Humanitarian / NGO", "Security / risk / resilience"],
  "review-protocol": ["Academia / research", "Humanitarian / NGO", "Security / risk / resilience"],
  reviewers: ["Academia / research", "Humanitarian / NGO", "Security / risk / resilience"],
  "knowledge-base": [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
  survey: [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
  "campaign-insights": [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
  budget: ["Business / advisory"],
  billing: [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
  "semantic-match": [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
  "member-services": [
    "Academia / research",
    "Business / advisory",
    "Humanitarian / NGO",
    "Security / risk / resilience",
  ],
};

export const PARTNER_WORK_PACKAGES: WorkPackage[] = [
  {
    id: "TI-01",
    track: "1",
    title: {
      en: "Prepare Trust & Influence Index (TII) strategic session",
      uk: "Підготувати стратегічну сесію Trust & Influence Index (TII)",
    },
    role: "product",
    hours: 20,
    hoursLow: 16,
    hoursHigh: 24,
    basis: {
      en: "User-stated 2–3 working days. At an assumed 8-hour day for one preparer this is 16–24 person-hours; 20 hours is only the arithmetic midpoint, not measured effort or an agreed fee. Confirm actual day length and number of preparers.",
      uk: "Задано користувачем 2–3 робочі дні. За припущення 8 годин/день і одного виконавця це 16–24 людино-години; 20 годин — лише арифметична середина, не виміряний обсяг чи погоджений гонорар. Підтвердити тривалість дня й кількість виконавців.",
    },
    deliverable: {
      en: "Brief, agenda, pre-read and evidence questions.",
      uk: "Бриф, порядок денний, матеріали для читання й запитання щодо доказів.",
    },
    acceptance: {
      en: "Client sponsor confirms the session brief and objectives.",
      uk: "Спонсор замовника підтверджує бриф і цілі сесії.",
    },
  },
  {
    id: "TI-02",
    track: "1",
    title: {
      en: "Facilitate session and record decisions",
      uk: "Провести сесію й зафіксувати рішення",
    },
    role: "product",
    hours: 8,
    hoursLow: 4,
    hoursHigh: 12,
    basis: {
      en: "[ASSUMPTION] One half-day session: 4 facilitator hours plus 4 hours for preparation, decision capture and validation. Range: 4–12 partner-hours. Participant time is separate.",
      uk: "[ПРИПУЩЕННЯ] Одна сесія на пів дня: 4 години фасилітації та 4 години на підготовку, фіксацію рішень і перевірку. Діапазон: 4–12 партнерських годин. Час учасників обліковується окремо.",
    },
    deliverable: {
      en: "Decision log, unresolved questions and accountable owners.",
      uk: "Журнал рішень, невирішені питання й відповідальні власники.",
    },
    acceptance: {
      en: "Client validates the decision log and its owners.",
      uk: "Замовник перевіряє журнал рішень і відповідальних.",
    },
  },
  {
    id: "TI-03",
    track: "1",
    title: {
      en: "Co-design index, evidence model and protocol",
      uk: "Спільно розробити індекс, модель доказів і протокол",
    },
    role: "product",
    hours: 40,
    hoursLow: 24,
    hoursHigh: 64,
    basis: {
      en: "[ASSUMPTION] Work breakdown: co-design and evidence-class draft (16 h), two review rounds (16 h), versioning and decision record (8 h). Range: 24–64 h; no sector-wide validation included.",
      uk: "[ПРИПУЩЕННЯ] Декомпозиція: спільне проєктування та чернетка класів доказів (16 год), два раунди перегляду (16 год), версія та журнал рішень (8 год). Діапазон: 24–64 год; галузеву валідацію не включено.",
    },
    deliverable: {
      en: "Versioned Trust & Influence Index (TII) methodology, review protocol, evidence rules and appeal route.",
      uk: "Версійована методологія Trust & Influence Index (TII), протокол перевірки, правила доказів і шлях оскарження.",
    },
    acceptance: {
      en: "Client approves intended use, limits, evidence classes and governance.",
      uk: "Замовник погоджує застосування, обмеження, класи доказів і врядування.",
    },
  },
  {
    id: "TI-04",
    track: "1",
    title: {
      en: "Select reviewer group and prepare orientation",
      uk: "Відібрати групу рецензентів і підготувати вступ",
    },
    role: "product",
    hours: 16,
    hoursLow: 8,
    hoursHigh: 24,
    basis: {
      en: "[ASSUMPTION] Draft selection criteria, conflict-check workflow, reviewer shortlist process and one orientation plan; client/board retain selection authority. Range: 8–24 h.",
      uk: "[ПРИПУЩЕННЯ] Чернетка критеріїв відбору, процесу перевірки конфліктів, формування короткого списку рецензентів і одного плану вступу; право вибору залишається за замовником/бордом. Діапазон: 8–24 год.",
    },
    deliverable: {
      en: "Approved selection criteria, reviewer list and orientation plan.",
      uk: "Погоджені критерії, список рецензентів і план вступного навчання.",
    },
    acceptance: {
      en: "Client/board selects the reviewers; training depth follows a baseline check.",
      uk: "Замовник/борд обирають рецензентів; обсяг навчання визначає перевірка базових знань.",
    },
  },
  {
    id: "STR-01",
    track: "1",
    title: {
      en: "Prioritize strategy directions and expertise gaps",
      uk: "Визначити пріоритети стратегії та прогалини експертизи",
    },
    role: "product",
    hours: 24,
    hoursLow: 16,
    hoursHigh: 40,
    basis: {
      en: "[ASSUMPTION] One scoped synthesis: review agreed inputs, rank priorities, map expertise gaps and prepare one decision log. Range: 16–40 h; additional workshops are excluded.",
      uk: "[ПРИПУЩЕННЯ] Один обмежений синтез: перегляд погоджених матеріалів, пріоритизація напрямів, карта прогалин експертизи та один журнал рішень. Діапазон: 16–40 год; додаткові сесії не включено.",
    },
    deliverable: {
      en: "Ranked directions, expertise gaps, rationale and owners.",
      uk: "Пріоритетні напрями, прогалини експертизи, обґрунтування й відповідальні.",
    },
    acceptance: {
      en: "Client/board confirms the prioritization criteria and decision log.",
      uk: "Замовник/борд підтверджують критерії пріоритизації та журнал рішень.",
    },
  },
  {
    id: "STR-02",
    track: "1",
    title: {
      en: "Design expert review, questionnaire and campaign",
      uk: "Спроєктувати перевірку експертів, опитування й кампанію",
    },
    role: "operations",
    hours: 24,
    hoursLow: 16,
    hoursHigh: 40,
    basis: {
      en: "[ASSUMPTION] Draft one short questionnaire, review criteria and one bilingual campaign pack for an authorized channel. Range: 16–40 h; legal review and paid media are excluded.",
      uk: "[ПРИПУЩЕННЯ] Чернетка одного короткого опитувальника, критеріїв перегляду й одного двомовного пакета кампанії для дозволеного каналу. Діапазон: 16–40 год; юридичний перегляд і платне просування не включено.",
    },
    deliverable: {
      en: "Review criteria, community survey and approved campaign pack.",
      uk: "Критерії перевірки, опитувальник спільноти й погоджений пакет кампанії.",
    },
    acceptance: {
      en: "Privacy owner approves purpose, channel, audience, retention and notice before distribution.",
      uk: "Відповідальний за приватність погоджує мету, канал, аудиторію, зберігання й повідомлення до розсилки.",
    },
  },
  {
    id: "STR-03",
    track: "4",
    title: {
      en: "Operate authorized campaign and survey",
      uk: "Провести дозволену кампанію й опитування",
    },
    role: "operations",
    hours: 24,
    hoursLow: 16,
    hoursHigh: 40,
    basis: {
      en: "[ASSUMPTION] Four-week manual campaign window at 6 operating hours per week. Range: 16–40 h. No audience-reach, response or conversion forecast is included; only an authorized channel may be used.",
      uk: "[ПРИПУЩЕННЯ] Чотиритижневе вікно ручної кампанії по 6 операційних годин на тиждень. Діапазон: 16–40 год. Прогноз охоплення, відповідей або конверсії не включено; використовувати можна лише дозволений канал.",
    },
    deliverable: {
      en: "Delivery log, response handling and campaign close-out.",
      uk: "Журнал доставки, опрацювання відповідей і закриття кампанії.",
    },
    acceptance: {
      en: "Every used channel is authorized; actual delivery is distinguished from audience size.",
      uk: "Кожен використаний канал дозволений; фактична доставка відокремлена від розміру аудиторії.",
    },
  },
  {
    id: "STR-04",
    track: "4",
    title: {
      en: "Analyze responses and prepare board findings",
      uk: "Проаналізувати відповіді й підготувати висновки для борду",
    },
    role: "operations",
    hours: 24,
    hoursLow: 16,
    hoursHigh: 40,
    basis: {
      en: "[ASSUMPTION] Analyze up to 50 responses and prepare one concise bilingual board readout. Range: 16–40 h; larger samples or additional analysis questions require the partner to revise hours.",
      uk: "[ПРИПУЩЕННЯ] Аналіз до 50 відповідей і підготовка одного стислого двомовного матеріалу для борду. Діапазон: 16–40 год; більша вибірка або додаткові питання аналізу потребують зміни годин партнером.",
    },
    deliverable: {
      en: "Findings on current experts, recruitment, content and application-feature demand.",
      uk: "Звіт про наявних і залучених експертів, конверсійні етапи, контент і попит на функції застосунку.",
    },
    acceptance: {
      en: "Each reported KPI has source, denominator, observation period and limitation.",
      uk: "Кожна KPI має джерело, знаменник, період спостереження й обмеження.",
    },
  },
  {
    id: "PUB-01",
    track: "4",
    title: {
      en: "Prepare and publish two evidence-based articles",
      uk: "Підготувати й опублікувати дві статті на основі доказів",
    },
    role: "operations",
    hours: 24,
    hoursLow: 16,
    hoursHigh: 32,
    basis: {
      en: "[ASSUMPTION] Two articles × 8–16 hours each for evidence selection, drafting and editorial review. Translation and paid promotion are excluded; publication and third-party pickup are not guaranteed.",
      uk: "[ПРИПУЩЕННЯ] Дві статті × 8–16 годин кожна на добір доказів, написання й редакційну перевірку. Переклад і платне просування не включені; публікація та згадки третіх сторін не гарантуються.",
    },
    deliverable: {
      en: "Two source-linked articles and a log of publication links and attributable third-party mentions during the agreed cycle.",
      uk: "Дві статті з посиланнями на джерела та журнал посилань на публікації й атрибутованих згадок третіх сторін за погоджений цикл.",
    },
    acceptance: {
      en: "Each article passes the agreed evidence and editorial review; the mention log records source and observation date.",
      uk: "Кожна стаття проходить погоджену перевірку доказів і редакції; журнал згадок містить джерело й дату спостереження.",
    },
  },
  {
    id: "PUB-02",
    track: "4",
    title: {
      en: "Assess conference readiness",
      uk: "Оцінити готовність до конференції",
    },
    role: "product",
    hours: 12,
    hoursLow: 8,
    hoursHigh: 16,
    basis: {
      en: "[ASSUMPTION] One feasibility brief: synthesize working-group outputs, assess expert interest and proposed agenda, and document a go/no-go recommendation. Conference production is excluded.",
      uk: "[ПРИПУЩЕННЯ] Один висновок про доцільність: узагальнити результати робочих груп, оцінити інтерес експертів і запропонований порядок денний та зафіксувати рішення «так/ні». Організація конференції не включена.",
    },
    deliverable: {
      en: "Conference-readiness decision brief grounded in observed outputs and expert commitments.",
      uk: "Висновок щодо готовності до конференції на основі фактичних результатів і підтверджених намірів експертів.",
    },
    acceptance: {
      en: "The brief distinguishes observed commitments, unresolved requirements and assumptions; it does not imply that an event will proceed.",
      uk: "Висновок розрізняє фактичні підтвердження, невирішені вимоги й припущення та не створює враження, що подія обов’язково відбудеться.",
    },
  },
  {
    id: "OPS-01",
    track: "Cross-track",
    title: {
      en: "Client support and decision coordination",
      uk: "Підтримка замовника й координація рішень",
    },
    role: "communications",
    hours: 24,
    hoursLow: 16,
    hoursHigh: 40,
    basis: {
      en: "[ASSUMPTION] Six review gates × 4 hours for preparation, follow-up and maintaining decision/risk/action logs. Range: 16–40 h; general corporate overhead excluded.",
      uk: "[ПРИПУЩЕННЯ] Шість етапів перегляду × 4 години на підготовку, супровід і ведення журналів рішень/ризиків/дій. Діапазон: 16–40 год; загальні накладні витрати не включено.",
    },
    deliverable: {
      en: "Decision, change, risk and action log.",
      uk: "Журнал рішень, змін, ризиків і дій.",
    },
    acceptance: {
      en: "Each open decision has an owner and next gate.",
      uk: "Кожне відкрите рішення має власника й наступні ворота.",
    },
  },
  {
    id: "OPS-02",
    track: "2",
    title: {
      en: "Product ownership and developer coordination",
      uk: "Власник продукту й координація розробників",
    },
    role: "product",
    hours: 32,
    hoursLow: 24,
    hoursHigh: 48,
    basis: {
      en: "[ASSUMPTION] Eight-week delivery window × 4 product-owner hours per week for backlog, acceptance and supplier coordination. Range: 24–48 h; supplier PM is not duplicated.",
      uk: "[ПРИПУЩЕННЯ] Восьмитижневе постачання × 4 години власника продукту на тиждень для backlog, приймання й координації постачальника. Діапазон: 24–48 год; PM постачальника не дублюється.",
    },
    deliverable: {
      en: "Prioritized requirements, acceptance evidence and release handover.",
      uk: "Пріоритетні вимоги, докази приймання й передача релізу.",
    },
    acceptance: {
      en: "No duplicated project-management charge where it is already included in the supplier quote.",
      uk: "Немає подвійної оплати управління проєктом, якщо воно вже входить до котирування постачальника.",
    },
  },
  {
    id: "SOFT-01",
    track: "2",
    title: {
      en: "Residual application MVP implementation",
      uk: "Залишкова реалізація MVP застосунку",
    },
    role: "developer",
    hours: 160,
    hoursLow: 120,
    hoursHigh: 240,
    basis: {
      en: "[ASSUMPTION] Residual MVP work breakdown: persistent project briefs, goals, expert groups, task/output assignments and statuses (40 h); role/access controls (32 h); approved evidence upload, validation and review (40 h); consent-gated first-contact workflow (24 h); QA, recovery and handover (24 h). Range: 120–240 supplier-hours. This bounded MVP excludes full project-management features such as chat, calendar, billing and complex workflow automation. Reconcile against the exact demo build before contracting.",
      uk: "[ПРИПУЩЕННЯ] Декомпозиція залишкової роботи MVP: збережені проєктні брифи, цілі, групи експертів, задачі/результати та статуси (40 год); ролі й контроль доступу (32 год); погоджене завантаження доказів, перевірка й перегляд (40 год); workflow першого контакту лише за наявності згоди (24 год); QA, відновлення й передача (24 год). Діапазон: 120–240 годин постачальника. Обмежений MVP не включає повну систему керування проєктами: чат, календар, білінг і складну автоматизацію. До контракту звірити з точною версією демо.",
    },
    deliverable: {
      en: "A useful application MVP for finding expertise, forming project-specific expert groups, recording project goals and assigned tasks/outputs, and reviewing attributable evidence beyond the existing search/group-selection demo.",
      uk: "Самостійно корисний MVP для пошуку експертизи, формування груп під проєктні цілі, фіксації цілей проєкту й призначених задач/результатів та перевірки атрибутованих доказів понад наявне демо пошуку й відбору груп.",
    },
    acceptance: {
      en: "Signed test cases cover permissions, persistence, change history, recovery, validation and consent/channel gates for first contact.",
      uk: "Погоджені тести покривають права доступу, збереження, історію змін, відновлення, перевірку даних і ворота згоди/каналу для першого контакту.",
    },
  },
  {
    id: "DATA-01",
    track: "3",
    title: {
      en: "Data model, analytics and knowledge-base integration",
      uk: "Модель даних, аналітика й інтеграція бази знань",
    },
    role: "developer",
    hours: 80,
    hoursLow: 60,
    hoursHigh: 120,
    basis: {
      en: "[ASSUMPTION] Work breakdown: source/schema mapping (20 h), import validation and lineage (20 h), review-state and aggregate metrics (20 h), tests and handover (20 h). Range: 60–120 supplier-hours; excludes human dossier review.",
      uk: "[ПРИПУЩЕННЯ] Декомпозиція: зіставлення джерел і схеми (20 год), перевірка імпорту та походження (20 год), статуси перегляду й агреговані метрики (20 год), тести й передача (20 год). Діапазон: 60–120 годин постачальника; людський перегляд досьє не включено.",
    },
    deliverable: {
      en: "Versioned data structures and tested analytics/knowledge-base pathways.",
      uk: "Версійовані структури даних і перевірені шляхи аналітики/бази знань.",
    },
    acceptance: {
      en: "Data lineage, access boundary and aggregate outputs pass the agreed tests.",
      uk: "Походження даних, межі доступу й агреговані результати проходять погоджені тести.",
    },
  },
  {
    id: "PAY-01",
    track: "4 · Post-pilot optional module",
    title: {
      en: "Hosted payment integration for paid membership",
      uk: "Інтеграція hosted-платежів для платного членства",
    },
    role: "developer",
    hours: 64,
    hoursLow: 40,
    hoursHigh: 96,
    basis: {
      en: "[ASSUMPTION] Optional single-provider, single-membership-tier module. Base work breakdown: checkout and membership states (24 h), signed webhook and reconciliation (16 h), cancellation/refund/receipt handling (8 h), sandbox security/error tests and handover (16 h). Lower/upper interval covers a lean hosted-checkout path through additional exception handling. Provider fees, legal/tax advice, custom card-data handling and provider onboarding delays are excluded; select provider before implementation.",
      uk: "[ПРИПУЩЕННЯ] Опційний модуль для одного провайдера й одного рівня членства. Базова декомпозиція: checkout і стани членства (24 год), підписані webhook-події та звірка (16 год), скасування/повернення/квитанції (8 год), перевірки безпеки й помилок у sandbox та передача (16 год). Нижня/верхня межа охоплює шлях hosted-checkout від мінімального до додаткової обробки винятків. Комісії провайдера, юридичні/податкові консультації, обробку карткових даних у власній системі та затримки підключення провайдера не включено; провайдера слід обрати до розробки.",
    },
    gatedByFunction: "billing",
    deliverable: {
      en: "Optional hosted checkout, membership payment state, transaction reconciliation and tested refund/cancellation handling.",
      uk: "Опційний hosted-checkout, статус оплати членства, звірка транзакцій і перевірене опрацювання повернень/скасувань.",
    },
    acceptance: {
      en: "One approved payment provider passes sandbox checkout, signed-event, duplicate-event, reconciliation and refund tests; no card data is stored by the app.",
      uk: "Один погоджений провайдер проходить sandbox-тести checkout, підписаних подій, повторних подій, звірки й повернення; застосунок не зберігає карткові дані.",
    },
  },
  {
    id: "SEM-01",
    track: "3 · Post-pilot full functionality",
    title: {
      en: "Explainable semantic matching and recommendations",
      uk: "Пояснюваний семантичний пошук і рекомендації",
    },
    role: "developer",
    hours: 180,
    hoursLow: 120,
    hoursHigh: 280,
    basis: {
      en: "[ASSUMPTION] Post-pilot implementation for one consented dataset and one request workflow. Base work breakdown: data preparation and benchmark set (40 h), matching/retrieval pipeline (40 h), explainable reasons and human override UI (40 h), evaluation, error/bias analysis, security tests and handover (60 h). Range: 120–280 h. Excludes third-party model/API fees, training a foundation model, additional data licensing and production-scale operations.",
      uk: "[ПРИПУЩЕННЯ] Реалізація після пілота для одного набору даних зі згодою й одного workflow запиту. Базова декомпозиція: підготовка даних і benchmark-набору (40 год), конвеєр зіставлення/пошуку (40 год), пояснення причин і UI людського override (40 год), оцінювання, аналіз помилок/упередженості, перевірки безпеки та передача (60 год). Діапазон: 120–280 год. Не включено комісії сторонньої моделі/API, навчання базової моделі, додаткові ліцензії на дані та операції production-масштабу.",
    },
    gatedByFunction: "semantic-match",
    deliverable: {
      en: "Human-reviewable matching prototype with documented benchmark, match explanations, override and error analysis.",
      uk: "Прототип зіставлення для людської перевірки з документованим benchmark, поясненнями збігів, override та аналізом помилок.",
    },
    acceptance: {
      en: "Approved consented test set, documented precision/error analysis, human override, access controls and model/API cost limits pass agreed tests.",
      uk: "Погоджений тестовий набір зі згодою, документований аналіз точності/помилок, людський override, контроль доступу й ліміти витрат моделі/API проходять погоджені тести.",
    },
  },
  {
    id: "MEM-01",
    track: "3 · Post-pilot full functionality",
    title: {
      en: "Member workspace, events and partner services",
      uk: "Кабінет учасника, події та партнерські сервіси",
    },
    role: "developer",
    hours: 240,
    hoursLow: 160,
    hoursHigh: 360,
    basis: {
      en: "[ASSUMPTION] Post-pilot first release: one member workspace, one event workflow, one service-request workflow, a partner directory and basic service accounting. Base breakdown: workspace and roles (48 h), service requests (40 h), events/materials/attendance (40 h), partner directory (48 h), accounting/reporting (32 h), QA/security/handover (32 h). Range: 160–360 h. Excludes native mobile apps, complex scheduling, payment integration (separately scoped as PAY-01), migrations and support operations.",
      uk: "[ПРИПУЩЕННЯ] Перший реліз після пілота: один кабінет учасника, один workflow подій, один workflow запитів послуг, каталог партнерів і базовий облік сервісів. Базова декомпозиція: кабінет і ролі (48 год), запити послуг (40 год), події/матеріали/участь (40 год), каталог партнерів (48 год), облік/звітність (32 год), QA/безпека/передача (32 год). Діапазон: 160–360 год. Не включено нативні мобільні застосунки, складне планування, інтеграцію платежів (окремо оцінено як PAY-01), міграції та операційну підтримку.",
    },
    gatedByFunction: "member-services",
    deliverable: {
      en: "Role-controlled member workspace with event and service-request flows, partner directory and basic service records.",
      uk: "Кабінет учасника з рольовим доступом, workflow подій і запитів послуг, каталог партнерів і базові записи про сервіс.",
    },
    acceptance: {
      en: "Approved user roles and data boundaries pass tests for member access, event participation, service requests, directory updates and audit history.",
      uk: "Погоджені ролі користувачів і межі даних проходять тести доступу учасників, участі в подіях, запитів послуг, оновлення каталогу й історії аудиту.",
    },
  },
];

export const DOSSIER_STAGES: DossierStage[] = [
  {
    id: "prep",
    title: { en: "Human preparation / source gathering", uk: "Людська підготовка / пошук джерел" },
    role: "operations",
    costed: true,
    minutes: 30,
    minutesLow: 15,
    minutesHigh: 60,
    basis: {
      en: "[ASSUMPTION] 30 minutes per record; 15–60 minute planning interval for source gathering, replaceable by observed time.",
      uk: "[ПРИПУЩЕННЯ] 30 хвилин на запис; плановий інтервал 15–60 хвилин для пошуку джерел, замінити фактичним вимірюванням.",
    },
  },
  {
    id: "review",
    title: { en: "Human evidence review", uk: "Людська перевірка доказів" },
    role: "operations",
    costed: true,
    minutes: 45,
    minutesLow: 30,
    minutesHigh: 90,
    basis: {
      en: "[ASSUMPTION] 45 minutes per record for human review under the approved protocol; 30–90 minute planning interval. AI output is not verified evidence.",
      uk: "[ПРИПУЩЕННЯ] 45 хвилин на запис для людського перегляду за погодженим протоколом; плановий інтервал 30–90 хвилин. Результат AI не є перевіреним доказом.",
    },
  },
  {
    id: "rework",
    title: { en: "Correction, appeal and rework", uk: "Виправлення, оскарження й повторна робота" },
    role: "operations",
    costed: true,
    minutes: 30,
    minutesLow: 0,
    minutesHigh: 60,
    basis: {
      en: "[ASSUMPTION] 30 minutes per record reserved for correction/rework; interval 0–60 minutes. No exception rate or appeal frequency is forecast.",
      uk: "[ПРИПУЩЕННЯ] Резерв 30 хвилин на запис для виправлень і повторної роботи; інтервал 0–60 хвилин. Частоту винятків або оскаржень не прогнозуємо.",
    },
  },
  {
    id: "client-approval",
    title: {
      en: "Client decision / approval effort (not supplier cost)",
      uk: "Рішення / погодження замовника (не витрата постачальника)",
    },
    role: "client",
    costed: false,
    minutes: 30,
    minutesLow: 15,
    minutesHigh: 60,
    basis: {
      en: "[ASSUMPTION] 30 minutes per record for client decision/reconciliation effort; 15–60 minute planning interval. Shown separately and excluded from supplier/partner subtotal.",
      uk: "[ПРИПУЩЕННЯ] 30 хвилин на запис для рішення/звірки замовника; плановий інтервал 15–60 хвилин. Показується окремо й виключається з підсумку постачальника/партнерів.",
    },
  },
];

export const MARKET_BENCHMARKS = {
  software: {
    ukraine: { low: 25, base: 37, high: 49, currency: "USD", unit: "provider-hour" },
    us: { low: 50, base: 74.5, high: 99, currency: "USD", unit: "provider-hour" },
    uk: {
      low: 400,
      base: 475,
      high: 550,
      currency: "GBP",
      unit: "contractor-day",
      hoursPerDay: 7.5,
    },
  },
  consulting: {
    ukraine: { low: 25, base: 37, high: 49, currency: "USD", unit: "provider-hour" },
    us: { low: 100, base: 124.5, high: 149, currency: "USD", unit: "provider-hour" },
    uk: null,
  },
  sources: [
    {
      label: "Clutch — software development provider rates",
      url: "https://clutch.co/developers/pricing",
      period: "September 2026 guide; provider-company bands",
    },
    {
      label: "Clutch — business consulting provider rates",
      url: "https://clutch.co/consulting/pricing",
      period:
        "September 2026 guide; Ukraine provider-company band is $25–$49/hour; not an individual partner quote",
    },
    {
      label: "Lemon.io — Ukraine software developer active-contract rates",
      url: "https://lemon.io/rate-calculator/ukraine/",
      period:
        "The retrieved page provides general rate factors but no Ukraine-specific numeric rate; not used in calculations or as a cross-check",
    },
    {
      label: "Lorien — UK software-engineer contractor rates",
      url: "https://www.lorienglobal.com/insights/software-developer-contract-rates-in-the-uk",
      period: "2026 guide; £400–£550 per contractor-day",
    },
    {
      label: "YunoJuno — 2025 Freelancer Rates Report",
      url: "https://www.yunojuno.com/freelancer-rates-report",
      period:
        "2025 report; reported rate dataset covers 2022–2024. Role averages: strategy £65/h, market research £61/h; overall average £49/h. Overall average used only as a non-role-specific assumption for other roles.",
    },
    {
      label: "NASA SWE-015 — cost-estimation practice",
      url: "https://swehb.nasa.gov/display/SWEHBVB/SWE-015+-+Cost+Estimation",
      period: "Document scope, methods, assumptions and uncertainty",
    },
    {
      label: "NASA — software work breakdown structures",
      url: "https://swehb.nasa.gov/spaces/7150/pages/16449881/7.05+-+Work+Breakdown+Structures+That+Include+Software",
      period: "Structure estimates by deliverables and dependencies",
    },
    {
      label: "W3C — WCAG 2.2",
      url: "https://www.w3.org/TR/WCAG22/",
      period: "Accessibility target; conformance requires a separate audit",
    },
  ],
} as const;

const CLIENT_OFFER_WORK_PACKAGE_IDS = {
  applicationMvp: ["SOFT-01", "OPS-02"],
  expertCycle: [
    "TI-01",
    "TI-02",
    "TI-03",
    "TI-04",
    "STR-01",
    "STR-02",
    "STR-03",
    "STR-04",
    "OPS-01",
    "PUB-01",
    "PUB-02",
  ],
} as const;

type EstimateScenario = "low" | "base" | "high";
type EstimateRole = WorkPackage["role"];

export interface ClientEstimateLine {
  role: EstimateRole;
  hours: number;
  rate: number;
  subtotal: number;
}

export interface ClientEstimateScenario {
  hours: number;
  total: number;
  lines: ClientEstimateLine[];
}

export interface ClientPackageEstimate {
  packageIds: readonly string[];
  low: ClientEstimateScenario;
  base: ClientEstimateScenario;
  high: ClientEstimateScenario;
}

function estimateClientPackage(packageIds: readonly string[]): ClientPackageEstimate {
  const workPackages = packageIds.map((id) => {
    const workPackage = PARTNER_WORK_PACKAGES.find((item) => item.id === id);
    if (!workPackage) {
      throw new Error(`Client estimate references unknown work package: ${id}`);
    }
    return workPackage;
  });

  const scenario = (band: EstimateScenario): ClientEstimateScenario => {
    const hoursKey = { low: "hoursLow", base: "hours", high: "hoursHigh" }[band];
    const rateBand = {
      low: "low",
      base: "base",
      high: "high",
    }[band] as EstimateScenario;
    const roles: EstimateRole[] = [
      "developer",
      "product",
      "operations",
      "communications",
    ];
    const lines = roles.flatMap((role) => {
      const hours = workPackages
        .filter((item) => item.role === role)
        .reduce((total, item) => total + (item[hoursKey as keyof WorkPackage] as number), 0);
      if (!hours) return [];
      const rate =
        role === "developer"
          ? MARKET_BENCHMARKS.software.ukraine[rateBand]
          : MARKET_BENCHMARKS.consulting.ukraine[rateBand];
      return [{ role, hours, rate, subtotal: hours * rate }];
    });

    return {
      hours: lines.reduce((total, line) => total + line.hours, 0),
      total: lines.reduce((total, line) => total + line.subtotal, 0),
      lines,
    };
  };

  return {
    packageIds,
    low: scenario("low"),
    base: scenario("base"),
    high: scenario("high"),
  };
}

export const CLIENT_OFFER_ESTIMATES = {
  applicationMvp: estimateClientPackage(CLIENT_OFFER_WORK_PACKAGE_IDS.applicationMvp),
  expertCycle: estimateClientPackage(CLIENT_OFFER_WORK_PACKAGE_IDS.expertCycle),
} satisfies Record<"applicationMvp" | "expertCycle", ClientPackageEstimate>;

export const CLIENT_OFFER_COMBINED_ESTIMATE: ClientPackageEstimate = {
  packageIds: [
    ...CLIENT_OFFER_ESTIMATES.applicationMvp.packageIds,
    ...CLIENT_OFFER_ESTIMATES.expertCycle.packageIds,
  ],
  low: {
    hours:
      CLIENT_OFFER_ESTIMATES.applicationMvp.low.hours +
      CLIENT_OFFER_ESTIMATES.expertCycle.low.hours,
    total:
      CLIENT_OFFER_ESTIMATES.applicationMvp.low.total +
      CLIENT_OFFER_ESTIMATES.expertCycle.low.total,
    lines: [
      ...CLIENT_OFFER_ESTIMATES.applicationMvp.low.lines,
      ...CLIENT_OFFER_ESTIMATES.expertCycle.low.lines,
    ],
  },
  base: {
    hours:
      CLIENT_OFFER_ESTIMATES.applicationMvp.base.hours +
      CLIENT_OFFER_ESTIMATES.expertCycle.base.hours,
    total:
      CLIENT_OFFER_ESTIMATES.applicationMvp.base.total +
      CLIENT_OFFER_ESTIMATES.expertCycle.base.total,
    lines: [
      ...CLIENT_OFFER_ESTIMATES.applicationMvp.base.lines,
      ...CLIENT_OFFER_ESTIMATES.expertCycle.base.lines,
    ],
  },
  high: {
    hours:
      CLIENT_OFFER_ESTIMATES.applicationMvp.high.hours +
      CLIENT_OFFER_ESTIMATES.expertCycle.high.hours,
    total:
      CLIENT_OFFER_ESTIMATES.applicationMvp.high.total +
      CLIENT_OFFER_ESTIMATES.expertCycle.high.total,
    lines: [
      ...CLIENT_OFFER_ESTIMATES.applicationMvp.high.lines,
      ...CLIENT_OFFER_ESTIMATES.expertCycle.high.lines,
    ],
  },
};

export const SUPPORTING_DOCUMENTS = [
  {
    id: "project-description",
    title: {
      en: "1 · ISRM project description",
      uk: "1 · Повний опис проєкту ISRM",
    },
    purpose: {
      en: "The only supporting file currently present in this project; covers purpose, client pilot, architecture, scope and open decisions.",
      uk: "Єдиний супровідний файл, наразі наявний у проєкті; містить мету, клієнтський пілот, архітектуру, обсяг і відкриті рішення.",
    },
    href: "/ISRM_Project_Description.md",
  },
] as const;

// Keep these source observations for pilot-specific evidence review; do not show them as general partner-page metrics.
export const LINKEDIN_PAGE_FOLLOWER_COUNT = 8_742;
export const LINKEDIN_PAGE_FOLLOWER_SOURCE =
  "ISRM_Ukraine_Community_CRM_178_FandP.xlsx, CRM Dashboard!H5; Page followers snapshot dated 2026-08-28.";
export const LINKEDIN_GROUP_MEMBERS_OBSERVED = 11_750;
export const LINKEDIN_GROUP_MEMBERS_SOURCE =
  "User-provided LinkedIn group screenshot; capture date not recorded.";
