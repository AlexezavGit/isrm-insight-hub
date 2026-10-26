export type ClientLocale = "en" | "uk";
export type Copy = Record<ClientLocale, string>;
export const CLIENT_SERVICES = [
  {
    id: "search",
    title: { en: "Network mapping & search", uk: "Мапування мережі та пошук" },
    detail: {
      en: "Import agreed data, explore relationships and find relevant expertise. Different datasets serve different questions.",
      uk: "Завантажувати погоджені дані, досліджувати зв’язки та знаходити експертизу. Різні набори даних відповідають на різні питання.",
    },
    status: { en: "Search and graph demonstrated", uk: "Пошук і граф демонструються" },
  },
  {
    id: "groups",
    title: { en: "Groups & working lists", uk: "Групи й робочі списки" },
    detail: {
      en: "Select people for a purpose, save a working list and assign a responsible owner. Shared storage requires implementation.",
      uk: "Відбирати людей за метою, зберігати список і визначати відповідального. Спільне зберігання потребує реалізації.",
    },
    status: { en: "Local selection demonstrated", uk: "Локальний відбір демонструється" },
  },
  {
    id: "research",
    title: { en: "AI-assisted open-source research", uk: "Дослідження відкритих джерел із ШІ" },
    detail: {
      en: "Research on request, retain sources and prepare findings for a named reviewer. Research volume and AI/API running costs are agreed separately.",
      uk: "Досліджувати за запитом, зберігати джерела й готувати висновки для визначеного перевіряльника. Обсяг досліджень і регулярні AI/API-витрати погоджуються окремо.",
    },
    status: { en: "Proposed · AI is not connected", uk: "Запропоновано · ШІ не підключено" },
  },
  {
    id: "review",
    title: { en: "Human review & corrections", uk: "Людська перевірка й виправлення" },
    detail: {
      en: "Agree evidence standards, reviewer responsibility, update intervals and a correction route. A thematic match is not a recommendation.",
      uk: "Погодити правила доказів, відповідальність перевіряльника, оновлення та виправлення. Тематичний збіг не є рекомендацією.",
    },
    status: { en: "Proposed process", uk: "Запропонований процес" },
  },
  {
    id: "evidence",
    title: { en: "Evidence & knowledge records", uk: "Записи доказів і знань" },
    detail: {
      en: "Keep source, author, review date, permissions and versions with each reusable finding.",
      uk: "Зберігати джерело, автора, дату перевірки, дозволи та версії кожного повторно використовуваного результату.",
    },
    status: { en: "To implement", uk: "Потребує реалізації" },
  },
  {
    id: "contact",
    title: { en: "Introductions & referrals", uk: "Знайомства та реферали" },
    detail: {
      en: "Route an enquiry to an appropriate colleague or authorised contact. Record permission and the next action.",
      uk: "Спрямовувати запит відповідному колезі або уповноваженій контактній особі. Фіксувати дозвіл і наступну дію.",
    },
    status: { en: "Proposed process", uk: "Запропонований процес" },
  },
  {
    id: "integration",
    title: { en: "Access, data & integrations", uk: "Доступ, дані та інтеграції" },
    detail: {
      en: "Approved imports, configurable fields, role-based access and named connections to existing ISRM systems; no unlimited integration promise.",
      uk: "Погоджені імпорти, налаштовувані поля, рольовий доступ і визначені інтеграції з системами ISRM; без обіцянки необмежених інтеграцій.",
    },
    status: { en: "Scope to agree", uk: "Обсяг належить погодити" },
  },
  {
    id: "publishing",
    title: { en: "Knowledge into professional use", uk: "Знання у професійне використання" },
    detail: {
      en: "Prepare reviewed expertise for learning, publications, discussions and client work, with attribution and permission.",
      uk: "Готувати перевірену експертизу до використання в навчанні, публікаціях, обговореннях і роботі з клієнтами, з авторством і дозволами.",
    },
    status: { en: "Optional workflow capability", uk: "Функціональність опційного workflow" },
  },
] as const;
export type ServiceId = (typeof CLIENT_SERVICES)[number]["id"];
export const CLIENT_WORKFLOWS = [
  {
    id: "engagement",
    title: { en: "Continuous engagement & opportunities", uk: "Постійне залучення та можливості" },
    detail: {
      en: "An ongoing cycle: relevant professional topics → useful interactions → understood needs → appropriate opportunities → feedback into the next cycle.",
      uk: "Перманентний цикл: релевантні професійні теми → корисна взаємодія → розуміння потреб → відповідні можливості → зворотний зв’язок у наступний цикл.",
    },
    serviceIds: ["groups", "contact", "integration", "publishing"] as ServiceId[],
    outputs: {
      en: [
        "Training enquiries",
        "Membership",
        "Partnerships",
        "Alumni participation & resources",
        "Cross-selling & expanded engagements",
        "Client enquiries to colleagues & referrals",
        "Conference attendance",
      ],
      uk: [
        "Запити на навчання",
        "Членство",
        "Партнерство",
        "Участь і ресурси alumni",
        "Крос-селл та розширення замовлень",
        "Запити клієнтів у поле колег і реферали",
        "Відвідування конференцій",
      ],
    },
  },
  {
    id: "expertise",
    title: {
      en: "Network expertise into shared capability",
      uk: "Мережева експертиза у спільну спроможність",
    },
    detail: {
      en: "Professional experience → source-backed findings → human review → reusable knowledge → learning, publications and client work. Over time, this could inform an AI assistant for consultants and perhaps a market-facing AI consultant, subject to rights, validation and a separate decision.",
      uk: "Професійний досвід → висновки з джерелами → людська перевірка → повторно використовувані знання → навчання, публікації та клієнтська робота. Згодом це може стати основою AI-помічника консультантів і, можливо, AI-консультанта для ринку — за умови прав на дані, валідації та окремого рішення.",
    },
    serviceIds: ["groups", "research", "review", "evidence", "publishing"] as ServiceId[],
    outputs: {
      en: [
        "Learning & development",
        "Evidence-based publications",
        "Research & professional discussions",
        "Project teams & client solutions",
        "Possible future AI assistant",
      ],
      uk: [
        "Навчання та розвиток",
        "Доказові публікації",
        "Дослідження й професійні обговорення",
        "Проєктні групи та клієнтські рішення",
        "Можливий майбутній AI-помічник",
      ],
    },
  },
] as const;
export type WorkflowId = (typeof CLIENT_WORKFLOWS)[number]["id"];

export const CORE_SERVICE_IDS: ServiceId[] = [
  "search",
  "groups",
  "research",
  "review",
  "evidence",
  "contact",
  "integration",
];
