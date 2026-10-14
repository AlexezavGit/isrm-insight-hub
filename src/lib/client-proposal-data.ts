import { CLIENT_OFFER_ESTIMATES } from "@/lib/proposal-data";

export type ClientPackageId = "consulting" | "application-mvp" | "pilot-functions" | "additional";

export const CLIENT_PACKAGES: {
  id: ClientPackageId;
  title: { en: string; uk: string };
  purpose: { en: string; uk: string };
  boundary: { en: string; uk: string };
}[] = [
  {
    id: "consulting",
    title: { en: "1 · Consulting and strategy", uk: "1 · Консалтинг і стратегія" },
    purpose: {
      en: "Define priorities and expertise gaps, then support board decisions about what to build next. TII co-design within the expert cycle is already costed there and is not charged twice.",
      uk: "Визначити пріоритети й прогалини експертизи та підтримати рішення борду про подальшу розробку. Спільне проєктування TII в експертному циклі вже враховане в його оцінці й не оплачується вдруге.",
    },
    boundary: {
      en: "Additional strategy sessions beyond the listed MVP and expert-cycle outputs require a separate scope and estimate.",
      uk: "Додаткові стратегічні сесії поза результатами MVP та експертного циклу потребують окремого обсягу й оцінки.",
    },
  },
  {
    id: "application-mvp",
    title: { en: "2 · Application MVP", uk: "2 · MVP застосунку" },
    purpose: {
      en: "Turn the approved minimum workflow into a usable application, reusing the existing graph and search where rights and technical review permit.",
      uk: "Перетворити погоджений мінімальний процес на робочий застосунок, повторно використавши наявні граф і пошук там, де це дозволять права й технічна перевірка.",
    },
    boundary: {
      en: "Existing demo work is not treated as free or re-estimated as new work; reuse price, rights and residual implementation remain to be agreed.",
      uk: "Наявна робота над демо не вважається безкоштовною чи новою розробкою; ціну повторного використання, права й залишкову реалізацію ще потрібно погодити.",
    },
  },
  {
    id: "pilot-functions",
    title: { en: "3 · Functions required for the pilot", uk: "3 · Функції, потрібні для пілота" },
    purpose: {
      en: "After the MVP decision, invite willing community experts into TII co-design and agenda-based working groups; produce a report and articles, track actual mentions, and assess conference readiness.",
      uk: "Після рішення щодо MVP залучити охочих експертів спільноти до розроблення TII та робочих груп за погодженим порядком денним; підготувати звіт і статті, відстежити фактичні згадки й оцінити готовність до конференції.",
    },
    boundary: {
      en: "Optional after MVP, not a condition of MVP usefulness. Participation and publication are not guaranteed; up to 50 survey responses is an editable planning assumption, not a forecast. Public-product release is a later decision.",
      uk: "Опція після MVP, а не умова його корисності. Участь і публікації не гарантуються; до 50 відповідей на опитування — змінне планувальне припущення, а не прогноз. Публічний продукт — подальше окреме рішення.",
    },
  },
  {
    id: "additional",
    title: {
      en: "4 · Remaining and additional functionality",
      uk: "4 · Усі інші та додаткові функції",
    },
    purpose: {
      en: "Consider post-pilot functions, public-product continuation, multi-community operation, billing, advanced automation and support as separate decisions.",
      uk: "Окремо розглянути post-pilot функції, продовження публічного продукту, роботу з кількома спільнотами, оплату, розширену автоматизацію та підтримку.",
    },
    boundary: {
      en: "None of these additions is included in the pilot by default; each needs an agreed scope and price.",
      uk: "Жодне з цих доповнень не входить до пілота автоматично; для кожного потрібні погоджені обсяг і ціна.",
    },
  },
];

export const CLIENT_PAYMENT_TERMS = {
  due: {
    en: "Payment for each package is due on its delivery and acceptance.",
    uk: "Оплата кожного пакета здійснюється під час його здачі та приймання.",
  },
  firstPaymentFraction: 0.3,
  firstPaymentFormula: {
    en: "Minimum first payment = total agreed price × 0.30.",
    uk: "Мінімальний перший платіж = загальна погоджена ціна × 0,30.",
  },
  remainingPayments: {
    en: "The remaining payment milestones and percentages are not set; agree them with the client.",
    uk: "Наступні етапи й частки платежів не визначені; їх потрібно погодити із замовником.",
  },
  source: "Explicit user instruction recorded in the approved implementation plan.",
} as const;

export const CLIENT_PRICING_STATUS = {
  en: "These are provisional planning scenarios from assumed WBS hours and rate-band values recorded in the project. The linked Clutch pages could not be independently retrieved during this revision, so treat their rate inputs as unverified until checked. Partner allocations, reuse compensation and excluded costs remain unresolved; these figures are not a supplier quote.",
  uk: "Це попередні планувальні сценарії на основі припущених годин WBS і діапазонів ставок, записаних у проєкті. Під час цієї редакції не вдалося незалежно отримати сторінки Clutch, тому ставки слід вважати неперевіреними до звірки. Розподіл партнерської винагороди, компенсація за повторне використання та невраховані витрати не визначені; це не котирування постачальника.",
} as const;

export const CLIENT_OFFER_PACKAGES = [
  {
    id: "application-mvp",
    estimate: CLIENT_OFFER_ESTIMATES.applicationMvp,
    title: { en: "Application MVP", uk: "MVP застосунку" },
    result: {
      en: "A useful standalone application for finding expertise, forming project groups, storing goals, assigned tasks and outputs, and reviewing attributable evidence.",
      uk: "Самостійно корисний застосунок для пошуку експертизи, формування проєктних груп, збереження цілей, призначених задач і результатів та перегляду атрибутованих доказів.",
    },
    boundary: {
      en: "A bounded project workflow, not a full PM suite. Existing graph/search reuse rights and compensation, hosting, AI/API, legal/privacy work and ongoing support are not included.",
      uk: "Обмежений проєктний процес, а не повна PM-система. Права й компенсація за повторне використання графа/пошуку, хостинг, AI/API, юридична робота, приватність і постійна підтримка не включені.",
    },
  },
  {
    id: "expert-cycle",
    estimate: CLIENT_OFFER_ESTIMATES.expertCycle,
    title: { en: "Optional expert-community cycle", uk: "Опційний цикл експертної спільноти" },
    result: {
      en: "Co-design a proposed TII procedure with willing experts; run agenda-based groups; deliver a findings report, two evidence-based articles, a mention log and a conference-readiness brief.",
      uk: "Спільно з охочими експертами розробити процедуру TII; провести тематичні групи; підготувати звіт, дві доказові статті, журнал згадок і висновок про готовність до конференції.",
    },
    boundary: {
      en: "Optional after MVP review. [ASSUMPTION] Up to 50 survey responses informs the effort range; larger samples, additional research, translation, paid promotion and conference production require separate approval and estimate.",
      uk: "Опція після перегляду MVP. [ПРИПУЩЕННЯ] До 50 відповідей на опитування впливають на оцінку; більша вибірка, додаткове дослідження, переклад, платне просування та організація конференції потребують окремого погодження й оцінки.",
    },
  },
] as const;

export type ClientOfferPackage = (typeof CLIENT_OFFER_PACKAGES)[number];
export type ClientOfferPackageId = ClientOfferPackage["id"];

export const CLIENT_OFFER_NOTE = {
  en: "Each scenario is Σ(role hours × the recorded role-comparator rate). The stored $25–$49/hour band and $37 arithmetic midpoint are unverified rate inputs, not validated market limits or partner quotes. Hosting, AI/API, legal/privacy services, reuse compensation/rights, tax and ongoing support are excluded, not zero. The pilot LinkedIn Page follower count (8,742 in the 2026-08-28 Ukraine CRM snapshot) is verified aggregate analytics, used as the conservative reach anchor for cohort 2; the three conversion rates and the engaged-in-services share on the page are planning defaults and are not a forecast. Name-level LinkedIn data is forbidden by REQ-018.",
  uk: "Кожен сценарій — це Σ(години ролі × записана порівняльна ставка ролі). Збережений діапазон $25–$49/год і арифметична середина $37 — неперевірені входи ставок, а не підтверджені межі ринку чи гонорари партнерів. Хостинг, AI/API, юридичні послуги, приватність, компенсація/права повторного використання, податки й постійна підтримка виключені, а не дорівнюють нулю. Кількість підписників LinkedIn Page пілота (8 742 у snapshot Ukraine CRM 2026-08-28) — перевірені aggregate-аналітики, використовуються як conservative reach-anchor для когорти 2; три conversion rates та частка engaged-in-services — планувальні дефолти й не є прогнозом. Name-level дані LinkedIn заборонені REQ-018.",
} as const;

export const CLIENT_CONSULTING_OPTION = {
  en: "The expert-cycle estimate already includes TII co-design, evidence rules and the listed strategy outputs. Optional consulting beyond those deliverables can cover further priorities, expertise gaps and board decisions; define and price that additional scope separately so the same work is not billed twice.",
  uk: "Оцінка експертного циклу вже включає спільне проєктування TII, правила доказів і перелічені стратегічні результати. Додатковий консалтинг може охоплювати подальші пріоритети, прогалини експертизи й рішення борду; його обсяг і ціну потрібно визначати окремо, щоб не оплачувати ту саму роботу двічі.",
} as const;
