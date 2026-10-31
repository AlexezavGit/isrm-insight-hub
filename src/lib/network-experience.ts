import type { Expert } from "./types";
import { canonicalCountry } from "./network-reference";

export type Experience = "prototype" | "configuration";
export function rotatePoint(p: { x: number; y: number }, angle: number) {
  if (p.x === 0 && p.y === 0) return { x: 0, y: 0 };
  return {
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
  };
}
export function mergeExampleSelection(saved: string[], example: string[], takeOver: boolean) {
  return takeOver ? [...new Set([...saved, ...example])] : [...saved];
}
export function resolveReplayExit<T>(
  original: T | null,
  current: T,
  saved: string[],
  example: string[],
  takeOver: boolean,
) {
  return {
    view: takeOver ? current : (original ?? current),
    selection: mergeExampleSelection(saved, example, takeOver),
  };
}
export function chooseSearchExample(experts: Expert[]) {
  const verified = experts.filter((p) => p.verified).sort((a, b) => a.code.localeCompare(b.code));
  const available = verified.length
    ? verified
    : [...experts].sort((a, b) => a.code.localeCompare(b.code));
  const first =
    available.find(
      (p) =>
        canonicalCountry(p.country) === "Ukraine" && /security|risk|безпек|ризик/i.test(p.sector),
    ) ??
    available.find((p) => canonicalCountry(p.country) === "Ukraine") ??
    available[0];
  if (!first) return null;
  const second =
    available.find(
      (p) =>
        p.code !== first.code &&
        canonicalCountry(p.country) === canonicalCountry(first.country) &&
        p.sector === first.sector,
    ) ?? available.find((p) => p.code !== first.code);
  return {
    people: second ? [first, second] : [first],
    country: first.country,
    sector: first.sector,
    expertise: first.primaryExpertise,
  };
}
export function researchFindings(e: Expert) {
  return [
    { id: "expertise", en: "Expertise", uk: "Експертиза", value: e.primaryExpertise },
    { id: "evidence", en: "Evidence basis", uk: "Доказова база", value: e.evidence },
    { id: "source", en: "Source", uk: "Джерело", value: e.source },
  ].filter((f): f is { id: string; en: string; uk: string; value: string } => !!f.value);
}
export function personStatuses(e: Expert, uk: boolean) {
  const none = uk ? "Не зафіксовано" : "Not recorded";
  return [
    {
      id: "identity",
      label: uk ? "Ідентичність · джерело" : "Identity · source",
      value: e.identityStatus || none,
      recorded: !!e.identityStatus,
    },
    {
      id: "role",
      label: uk ? "Роль у мережі · джерело" : "Network role · source",
      value: e.communityRole || none,
      recorded: !!e.communityRole,
    },
    {
      id: "human",
      label: uk ? "Людська рекомендація" : "Human recommendation",
      value: none,
      recorded: false,
    },
    {
      id: "ai",
      label: "AI OSINT",
      value: uk ? "Очікує на підключення" : "Awaiting connection",
      recorded: false,
    },
    {
      id: "compliance",
      label: uk ? "Рішення щодо комплаєнсу" : "Compliance decision",
      value: none,
      recorded: false,
    },
  ];
}
const hash = (value: string) =>
  Array.from(value).reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
export function constellation(people: Expert[]) {
  const sorted = [...people].sort((a, b) => a.code.localeCompare(b.code));
  const nodes = [{ id: "isrm", x: 50, y: 50, kind: "core" }];
  const links: { source: string; target: string }[] = [];
  const categories = [
    ...new Set(
      sorted.flatMap((p) => ["sector:" + p.sector, "country:" + canonicalCountry(p.country)]),
    ),
  ].sort();
  categories.forEach((id, i) => {
    const a = (i / categories.length) * Math.PI * 2;
    nodes.push({ id, x: 50 + Math.cos(a) * 41, y: 50 + Math.sin(a) * 41, kind: "category" });
  });
  sorted.forEach((p, i) => {
    const a = i * 2.399963 + (hash(p.code) % 36) / 36;
    const r = 12 + Math.sqrt(i + 1) * 4;
    nodes.push({
      id: p.code,
      x: 50 + Math.cos(a) * Math.min(32, r),
      y: 50 + Math.sin(a) * Math.min(32, r),
      kind: "person",
    });
    links.push(
      { source: "isrm", target: p.code },
      { source: p.code, target: "sector:" + p.sector },
      { source: p.code, target: "country:" + canonicalCountry(p.country) },
    );
  });
  return { nodes, links };
}

export const SEARCH_REPLAY = [
  {
    id: "intro",
    en: "An interactive prototype",
    uk: "Інтерактивний прототип",
    textEn:
      "Explore recorded expertise in the supplied sample. Follow a search, inspect sources and statuses, then save a shortlist. Policies, professional review and willingness to participate are distinct from a graph connection. This example does not change your saved group.",
    textUk:
      "Дослідіть зафіксовану експертизу переданої вибірки. Пройдіть пошук, перегляньте джерела й статуси, збережіть відбір. Політики, професійна перевірка та готовність долучитися відрізняються від зв’язку на графі. Приклад не змінює вашу групу.",
  },
  {
    id: "country",
    en: "Set the country",
    uk: "Оберіть країну",
    textEn:
      "Begin with a country recorded in the supplied sample. The graph changes with the search parameters.",
    textUk:
      "Починаємо з країни, наявної в переданій вибірці. Граф змінюється разом із параметрами пошуку.",
  },
  {
    id: "sector",
    en: "Narrow the sector",
    uk: "Уточніть сектор",
    textEn:
      "Choose a sector to narrow the enquiry. The number of matching profiles changes; empty categories show gaps in this sample.",
    textUk:
      "Оберіть сектор для точнішого запиту. Кількість профілів змінюється; порожні категорії показують прогалини цієї вибірки.",
  },
  {
    id: "expertise",
    en: "Find relevant expertise",
    uk: "Знайдіть потрібну експертизу",
    textEn:
      "Choose a recorded expertise direction. Relevance is a reason to review a profile, not proof of suitability.",
    textUk:
      "Оберіть наявний напрям експертизи. Релевантність — привід переглянути профіль, а не доказ відповідності.",
  },
  {
    id: "mini",
    en: "Review the mini dossier",
    uk: "Перегляньте міні-досьє",
    textEn: "Check expertise, location and the source-record status before choosing this person.",
    textUk: "Перш ніж відібрати людину, перевіряємо експертизу, країну й статус запису у джерелі.",
  },
  {
    id: "status",
    en: "Distinguish the statuses",
    uk: "Розрізняйте статуси",
    textEn:
      "A confirmed source record is distinct from a human recommendation, an AI OSINT check or a compliance decision. Missing assessments remain unrecorded.",
    textUk:
      "Підтверджений запис у джерелі, людська рекомендація, AI OSINT-перевірка та рішення щодо комплаєнсу — різні речі. Ненадані оцінки лишаються незафіксованими.",
  },
  {
    id: "full-expertise",
    en: "Open the full dossier",
    uk: "Відкрийте повне досьє",
    textEn:
      "The full dossier opens over the graph. Your search and group remain in place. Start with the recorded expertise.",
    textUk:
      "Повне досьє відкривається поверх графа. Пошук і група залишаються на місці. Починаємо з наявної експертизи.",
  },
  {
    id: "full-evidence",
    en: "Examine the evidence",
    uk: "Перевірте підстави",
    textEn:
      "Read the evidence basis and any source available at your access level. Restricted or missing fields are not filled in by inference.",
    textUk:
      "Перегляньте доказову базу та джерела свого рівня доступу. Закриті чи ненадані поля не заповнюються припущеннями.",
  },
  {
    id: "request",
    en: "Preview a research request",
    uk: "Перегляньте запит на дослідження",
    textEn:
      "This shows the proposed AI OSINT process. It makes no external request and does not verify this person.",
    textUk:
      "Показуємо запропонований процес AI OSINT. Зовнішній запит не надсилається, особа не проходить нову перевірку.",
  },
  {
    id: "findings",
    en: "See the returned fields",
    uk: "Побачте отримані поля",
    textEn:
      "Highlighted fields are extracted from the already supplied, accessible record. In a connected service, new findings would retain sources and await professional review.",
    textUk:
      "Виділені поля взято з уже переданого доступного запису. У підключеному сервісі нові дані зберігатимуть джерела й очікуватимуть перевірки фахівцем.",
  },
  {
    id: "first",
    en: "Keep the first profile",
    uk: "Відіберіть перший профіль",
    textEn:
      "The selected-only listing appears without leaving the graph. This example is temporary; adding someone does not contact them.",
    textUk:
      "Лістинг лише відібраних з’являється без виходу з графа. Цей приклад тимчасовий; додавання людини не надсилає їй повідомлення.",
  },
  {
    id: "connections",
    en: "Explore another profile’s connections",
    uk: "Дослідіть зв’язки іншого профілю",
    textEn:
      "Centre another accessible profile to explore recorded shared categories. These links do not establish personal acquaintance or a recommendation.",
    textUk:
      "Центруємо інший доступний профіль і досліджуємо спільні категорії. Ці зв’язки не підтверджують особистого знайомства чи рекомендації.",
  },
  {
    id: "second",
    en: "Review, then add to the listing",
    uk: "Перегляньте й додайте до лістингу",
    textEn:
      "Inspect the next mini dossier and retain it in the same example group. Open names in the shortlist to review their dossiers while continuing the search.",
    textUk:
      "Переглядаємо наступне міні-досьє й додаємо до тієї самої групи прикладу. Клік на ім’я у відборі відкриває досьє для перегляду без припинення пошуку.",
  },
  {
    id: "result",
    en: "A result you can work with",
    uk: "Результат для подальшої роботи",
    textEn:
      "You have a named shortlist to review, mark for follow-up and save locally. Take over to keep this selection, or close the example to restore your previous search.",
    textUk:
      "Маєте відібрану групу: її можна переглянути, позначити для подальших дій і зберегти локально. Переберіть керування, щоб залишити відбір, або закрийте приклад і поверніться до свого пошуку.",
  },
] as const;
export const CONFIGURATION_REPLAY = [
  {
    id: "intro",
    en: "Configure the application",
    uk: "Конфігуратор застосунку",
    textEn:
      "Here you choose the capabilities of the future application. The people illustrate possible audiences; this is different from using the expertise-search prototype.",
    textUk:
      "Тут обирають функціональність майбутнього застосунку. Персони ілюструють можливі аудиторії; це інша задача, ніж користування прототипом пошуку експертизи.",
  },
  {
    id: "core",
    en: "Start with a useful workflow",
    uk: "Почніть із корисного workflow",
    textEn:
      "A workflow groups recurring actions around a result. The Trust core includes the search and selection cycle demonstrated in the prototype.",
    textUk:
      "Workflow поєднує повторювані дії навколо результату. Ядро довіри включає цикл пошуку й відбору, продемонстрований у прототипі.",
  },
  {
    id: "service",
    en: "Read the service and its dependencies",
    uk: "Перегляньте сервіс і залежності",
    textEn:
      "Read who would use the capability, the expected result and the systems it depends on. Highlighting members illustrates potential coverage, not actual usage.",
    textUk:
      "Перегляньте, хто користуватиметься функцією, очікуваний результат і залежності від систем. Підсвічування членів ілюструє можливе охоплення, а не фактичне користування.",
  },
  {
    id: "workflow",
    en: "Consider the engagement cycle",
    uk: "Розгляньте цикл залучення",
    textEn:
      "Here members and prospective clients are audiences for a proposed workflow. Compare its services with what your association needs.",
    textUk:
      "Тут члени й потенційні клієнти — аудиторії запропонованого workflow. Зіставте його сервіси з потребами асоціації.",
  },
  {
    id: "tailor",
    en: "Describe your own requirement",
    uk: "Опишіть власну потребу",
    textEn:
      "Use the structured requirement form to describe a function or workflow in your own terms. The description becomes a separate item in your proposal request.",
    textUk:
      "У структурованому шаблоні опишіть функцію чи workflow своїми словами. Опис стане окремою позицією запиту на пропозицію.",
  },
  {
    id: "result",
    en: "Take your priorities to scope and budget",
    uk: "Перейдіть із пріоритетами до обсягу й бюджету",
    textEn:
      "Select relevant presets and review their indicative estimates in Scope & budget. Watching this example has not changed your saved proposal choices.",
    textUk:
      "Оберіть потрібні пресети й перегляньте індикативні оцінки в «Обсяг і бюджет». Перегляд цього прикладу не змінює збережені позиції пропозиції.",
  },
] as const;
