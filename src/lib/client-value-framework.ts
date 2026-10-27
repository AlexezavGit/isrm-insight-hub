import type { Copy } from "./client-catalog";

// Adapted from the supplied /proposal sections, not a new product scope.
export const CORE_CAPABILITIES: { id: string; title: Copy; outcomes: Copy[] }[] = [
  {
    id: "find",
    title: { en: "Find the right expertise", uk: "Знайти потрібну експертизу" },
    outcomes: [
      {
        en: "Search by sector, region and relevant experience, with controlled profile visibility.",
        uk: "Шукати за сектором, регіоном і релевантним досвідом із контрольованою видимістю профілів.",
      },
      {
        en: "See where the network has capacity and where specialist expertise is missing.",
        uk: "Бачити спроможність мережі та прогалини спеціалізованої експертизи.",
      },
      {
        en: "Match people to a project need and prepare a working shortlist before contact.",
        uk: "Добирати людей під потребу проєкту й складати робочий список до першого контакту.",
      },
    ],
  },
  {
    id: "work",
    title: {
      en: "Bring people into purposeful work",
      uk: "Об’єднувати людей для конкретної роботи",
    },
    outcomes: [
      {
        en: "Form a multidisciplinary group around a defined professional need.",
        uk: "Формувати міждисциплінарну групу навколо визначеної професійної потреби.",
      },
      {
        en: "Keep the group’s purpose, relevant expertise and contact route together.",
        uk: "Зберігати разом мету групи, релевантну експертизу та маршрут контакту.",
      },
      {
        en: "Address the relevant group, retain attributable work and prepare a structured enquiry.",
        uk: "Звертатися до відповідної групи, зберігати авторство результатів і готувати структурований запит.",
      },
    ],
  },
  {
    id: "connect",
    title: { en: "Understand what leads to what", uk: "Розуміти, що з чого випливає" },
    outcomes: [
      {
        en: "Connect a current need with a relevant next service or a colleague’s expertise.",
        uk: "Пов’язувати поточну потребу з наступним доречним сервісом або експертизою колеги.",
      },
      {
        en: "Turn working-group experience and reviewed evidence into reusable knowledge.",
        uk: "Перетворювати досвід робочих груп і перевірені докази на повторно використовуване знання.",
      },
      {
        en: "Support cross-referrals, professional visibility and decisions about further activity.",
        uk: "Підтримувати перехресні рекомендації, професійну видимість і рішення про наступні активності.",
      },
    ],
  },
];

export const ENGAGEMENT_CYCLE: { id: string; title: Copy; action: Copy; opportunities: Copy }[] = [
  {
    id: "members",
    title: { en: "Members & priorities", uk: "Члени та пріоритети" },
    action: {
      en: "Start with the existing questionnaire across the 35 chapters: establish needs, expertise gaps and willingness to participate. Shape the next agenda from the responses.",
      uk: "Почати з наявного опитувальника для 35 чаптерів: визначити потреби, прогалини експертизи й готовність долучитися. За відповідями сформувати наступну адженду.",
    },
    opportunities: {
      en: "Internal consultations · alumni participation & resources",
      uk: "Внутрішні консультації · участь і ресурси alumni",
    },
  },
  {
    id: "discussions",
    title: { en: "Expert discussions", uk: "Експертні обговорення" },
    action: {
      en: "Convene focused groups and roundtables. Keep the evidence, authorship and useful findings.",
      uk: "Проводити цільові робочі групи та круглі столи. Зберігати докази, авторство й корисні висновки.",
    },
    opportunities: {
      en: "Client enquiries to colleagues · referrals · joint projects",
      uk: "Запити клієнтів у поле колег · реферали · спільні проєкти",
    },
  },
  {
    id: "publications",
    title: { en: "Reports & publications", uk: "Звіти та публікації" },
    action: {
      en: "Turn reviewed discussions and cases into reports, publications and material suitable for learning.",
      uk: "Перетворювати перевірені обговорення й кейси на звіти, публікації та матеріали для навчання.",
    },
    opportunities: {
      en: "Training enquiries · cross-selling · expanded engagements",
      uk: "Запити на навчання · крос-селл · розширення замовлень",
    },
  },
  {
    id: "audience",
    title: { en: "Professional reach", uk: "Професійне охоплення" },
    action: {
      en: "Share useful work through approved channels and invite interested people into a relevant next interaction.",
      uk: "Поширювати корисну роботу дозволеними каналами й запрошувати зацікавлених людей до наступної релевантної взаємодії.",
    },
    opportunities: {
      en: "Membership · partnerships · conference participants",
      uk: "Членство · партнерство · учасники конференцій",
    },
  },
  {
    id: "conferences",
    title: { en: "Conferences & the next cycle", uk: "Конференції та наступний цикл" },
    action: {
      en: "Bring regional and sector expertise together, present findings and use new questions to shape the next agenda.",
      uk: "Поєднувати регіональну й секторальну експертизу, представляти результати та формувати наступну адженду з нових питань.",
    },
    opportunities: {
      en: "Visitors · learning · partnerships · new professional questions",
      uk: "Відвідувачі · навчання · партнерства · нові професійні питання",
    },
  },
];

// Top first: a value architecture, not a mandatory order of purchase.
export const VALUE_PYRAMID: { id: string; title: Copy; detail: Copy }[] = [
  {
    id: "expertise",
    title: { en: "Network expertise", uk: "Мережева експертиза" },
    detail: {
      en: "Continuously renewed knowledge → learning, publications, professional solutions and thought leadership.",
      uk: "Постійно оновлюване знання → навчання, публікації, професійні рішення та лідерство думок.",
    },
  },
  {
    id: "engagement",
    title: { en: "Continuing engagement", uk: "Постійне залучення" },
    detail: {
      en: "Chapter and sector interaction → useful content → new participants, needs and opportunities.",
      uk: "Взаємодія чаптерів і секторів → корисний контент → нові учасники, потреби й можливості.",
    },
  },
  {
    id: "core",
    title: { en: "Core network application", uk: "Базовий застосунок мережі" },
    detail: {
      en: "Data, expertise map, search, working groups, source records and AI OSINT with human review.",
      uk: "Дані, мапа експертизи, пошук, робочі групи, джерела та AI OSINT із людською перевіркою.",
    },
  },
];
