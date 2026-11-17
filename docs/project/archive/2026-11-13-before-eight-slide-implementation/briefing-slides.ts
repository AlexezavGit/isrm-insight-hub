import type { Copy } from "./client-catalog";
import type { GraphLayers } from "@/components/NetworkGraph";
export type BriefingSlide = {
  label: Copy;
  projectName?: Copy;
  title: Copy;
  body: Copy;
  note: Copy;
  insight: Copy;
  principle: Copy;
  steps: Copy[];
  layers: GraphLayers;
};
export const BRIEFING_SLIDES: BriefingSlide[] = [
  {
    label: {
      en: "First research findings for ISRM",
      uk: "Перші результати дослідження для ISRM",
    },
    title: {
      en: "First source findings cover 45 of 178 records.",
      uk: "Перші джерельні дані зібрано щодо 45 зі 178 записів.",
    },
    body: {
      en: "ISRM supplied the contact workbook. We have collected initial public-source data for 45 identified profiles. Research continues; its depth can follow ISRM’s questions. The presentation shows these first findings and the application for working with them.",
      uk: "ISRM передала книгу контактів. Щодо 45 ідентифікованих профілів ми зібрали перші дані з відкритих джерел. Дослідження триває; його глибину можна визначати за питаннями ISRM. Презентація показує ці результати й застосунок для роботи з ними.",
    },
    insight: {
      en: "The graph separates recorded sectors from profiles where source gathering has begun.",
      uk: "Граф розрізняє записані сектори та профілі, щодо яких уже почався збір джерел.",
    },
    principle: {
      en: "A visible map is the start of a maintained working resource.",
      uk: "Видима мапа — початок ресурсу, який можна підтримувати й використовувати.",
    },
    note: {
      en: "This sample is not all ISRM members. Source data are not professional verification or permission to publish or contact a person.",
      uk: "Вибірка не охоплює всіх членів ISRM. Джерельні дані не є фаховою перевіркою чи дозволом оприлюднювати дані або контактувати з людиною.",
    },
    steps: [
      {
        en: "Broad research enquiry",
        uk: "Широкий запит дослідження",
      },
      {
        en: "Source-backed records",
        uk: "Записи з джерелами",
      },
      {
        en: "Professional selection",
        uk: "Професійний відбір",
      },
      {
        en: "Agreed next action",
        uk: "Погоджена наступна дія",
      },
    ],
    layers: {
      sector: true,
      theme: false,
      hub: false,
      researchQueue: true,
    },
  },
  {
    label: {
      en: "Tools and professional judgement",
      uk: "Інструменти й професійне судження",
    },
    title: {
      en: "The largest cluster has no recorded expertise.",
      uk: "Найбільша група не має записаної експертизи.",
    },
    body: {
      en: "The graph groups people by expertise recorded in the supplied sample. Search, dossiers and a browser-local shortlist already work. More dimensions and deeper matching need fuller source data, recorded relationships and agreed access.",
      uk: "Граф групує людей за експертизою, записаною в переданій вибірці. Пошук, досьє та відбір у цьому браузері вже працюють. Більше зрізів і глибший підбір потребують повніших джерельних даних, записаних зв’язків і погодженого доступу.",
    },
    insight: {
      en: "The unclassified cluster shows where research must deepen before a precise match is possible.",
      uk: "Група без записаної експертизи показує, де дослідження потрібно поглибити для точного підбору.",
    },
    principle: {
      en: "Start with the overview, then narrow the search.",
      uk: "Почніть із загального огляду, потім звужуйте пошук.",
    },
    note: {
      en: "The graph maps only available fields. A source mark, professional review, colleague recommendation and willingness to participate are separate states.",
      uk: "Граф показує лише наявні поля. Позначка джерела, фахова перевірка, рекомендація колеги й готовність долучитися — різні стани.",
    },
    steps: [
      {
        en: "Overview of recorded expertise",
        uk: "Огляд записаної експертизи",
      },
      {
        en: "Inspect available evidence",
        uk: "Перегляд доступних підстав",
      },
      {
        en: "Keep a reasoned shortlist",
        uk: "Обґрунтований відбір",
      },
    ],
    layers: {
      sector: true,
      theme: false,
      hub: false,
      specialisation: true,
      researchQueue: true,
    },
  },
  {
    label: {
      en: "Why we built the application",
      uk: "Чому ми створили застосунок",
    },
    title: {
      en: "Several services can meet one professional need.",
      uk: "Одній професійній потребі можуть відповідати кілька сервісів.",
    },
    body: {
      en: "We began building this application for our own consulting work. We did not find the functionality we needed among the proprietary solutions we tried. Our need: one controllable process for source-backed expertise, review, agreed contact and follow-through.",
      uk: "Ми почали створювати застосунок для власної консалтингової роботи. Ми не знайшли потрібної нам функціональності серед пропрієтарних рішень, які випробували. Нам потрібен єдиний керований процес роботи з експертизою та її джерелами, перевіркою, погодженим контактом і подальшими діями.",
    },
    insight: {
      en: "The graph shows how services can combine around people’s needs. The workflows are examples, not preset packages.",
      uk: "Граф показує, як сервіси можна поєднати навколо потреб людей. Workflow тут — приклади, а не готові пакети.",
    },
    principle: {
      en: "Choose the functions; agree the way of working.",
      uk: "Обрати потрібні функції; погодити спосіб роботи.",
    },
    note: {
      en: "This is our own assessment of the tools we tried. Further services need an owner, participants, rules and implementation.",
      uk: "Це наш власний висновок щодо випробуваних інструментів. Додаткові сервіси потребують відповідального, учасників, правил і реалізації.",
    },
    steps: [
      {
        en: "People and needs",
        uk: "Люди й потреби",
      },
      {
        en: "Useful services",
        uk: "Корисні сервіси",
      },
      {
        en: "Agreed working process",
        uk: "Погоджений процес роботи",
      },
    ],
    layers: {
      sector: true,
      theme: false,
      hub: true,
      researchQueue: true,
    },
  },
  {
    label: {
      en: "Shared rules at scale",
      uk: "Спільні правила на масштабі",
    },
    title: {
      en: "A source-backed record still needs a responsible decision.",
      uk: "Запис із джерелом усе одно потребує відповідального рішення.",
    },
    body: {
      en: "The graph traces a possible path: record, source, professional review, permitted action. OSINT can prepare information; a professional judges it; interaction creates the result. ISRM’s standards, policies and procedures must define who does each part.",
      uk: "Граф показує можливий шлях: запис, джерело, фахова перевірка, дозволена дія. OSINT готує інформацію; фахівець оцінює її; взаємодія створює результат. Стандарти, політики й процедури ISRM мають визначити відповідальних на кожному кроці.",
    },
    insight: {
      en: "Maintaining evidence, review and permission is organisational work, not a consequence of drawing the graph.",
      uk: "Підтримка джерел, перевірки й дозволів — організаційна робота, а не автоматичний наслідок побудови графа.",
    },
    principle: {
      en: "Agree the responsible next action.",
      uk: "Погодити відповідальну наступну дію.",
    },
    note: {
      en: "This path is proposed, not completed. Operational AI research, integrations and ISRM-wide procedures need separate agreement.",
      uk: "Цей шлях запропоновано, а не завершено. Операційне ШІ-дослідження, інтеграції та спільні процедури ISRM потребують окремого погодження.",
    },
    steps: [
      {
        en: "Shared policies",
        uk: "Спільні політики",
      },
      {
        en: "Professional responsibility",
        uk: "Професійна відповідальність",
      },
      {
        en: "Useful interaction",
        uk: "Корисна взаємодія",
      },
    ],
    layers: {
      sector: true,
      theme: true,
      hub: true,
      researchQueue: true,
    },
  },
  {
    label: {
      en: "Flywheel: a hypothesis to test",
      uk: "Цикл цінності: гіпотеза для перевірки",
    },
    title: {
      en: "Useful interaction can return experience to the network.",
      uk: "Корисна взаємодія може повертати досвід у мережу.",
    },
    body: {
      en: "Pilot a real enquiry: find expertise, review the evidence, agree contact and record the outcome. Test whether members want to contribute and whether a coordinator can keep the records current.",
      uk: "Випробуймо реальний запит: знайти експертизу, перевірити підстави, погодити контакт і записати результат. Перевірмо, чи хочуть члени долучатися та чи може координатор підтримувати записи актуальними.",
    },
    insight: {
      en: "Introductions, learning, discussions and referrals are possible reasons to participate; the pilot must test them.",
      uk: "Знайомства, навчання, обговорення й реферали можуть мотивувати участь; пілот має це перевірити.",
    },
    principle: {
      en: "Test the cycle before expanding it.",
      uk: "Перевірити цикл перед розширенням.",
    },
    note: {
      en: "Participation and financial return are untested. Future AI assistants or model training need separate decisions on purpose, data rights, safeguards and evaluation.",
      uk: "Участь і фінансова віддача не перевірені. Майбутні ШІ-помічники чи навчання моделей потребують окремих рішень щодо мети, прав на дані, захисту й оцінювання.",
    },
    steps: [
      {
        en: "Useful contribution",
        uk: "Корисний внесок",
      },
      {
        en: "Reviewed experience",
        uk: "Перевірений досвід",
      },
      {
        en: "Further value",
        uk: "Подальша цінність",
      },
    ],
    layers: {
      sector: false,
      theme: true,
      hub: true,
      researchQueue: true,
    },
  },
  {
    label: {
      en: "Your next step",
      uk: "Ваш наступний крок",
    },
    title: {
      en: "Test the working search, then choose what matters next.",
      uk: "Перевірте робочий пошук, потім оберіть наступне потрібне.",
    },
    body: {
      en: "Try search and shortlist on the supplied sample. Choose useful services or describe a need, review scope and budget, then request a detailed proposal.",
      uk: "Спробуйте пошук і відбір на переданій вибірці. Оберіть корисні сервіси або опишіть потребу, перегляньте обсяг і бюджет, а тоді запросіть детальну пропозицію.",
    },
    insight: {
      en: "Tell us where the demonstration fits ISRM’s work and what you would change. Your choices inform scope, dependencies, acceptance checks and budget; they are not an order.",
      uk: "Скажіть, як демонстрація відповідає роботі ISRM і що ви змінили б. Ваш вибір допоможе визначити обсяг, залежності, перевірки приймання й бюджет; він не є замовленням.",
    },
    principle: {
      en: "Your decision shapes the next conversation.",
      uk: "Ваше рішення визначає наступну розмову.",
    },
    note: {
      en: "Operational AI research and shared authenticated storage are not connected. Further implementation needs a separately agreed scope; decisions remain with ISRM.",
      uk: "Операційне ШІ-дослідження та спільне авторизоване сховище не підключені. Подальша реалізація потребує окремо погодженого обсягу; рішення залишаються за ISRM.",
    },
    steps: [
      {
        en: "Try the prototype",
        uk: "Спробувати прототип",
      },
      {
        en: "Choose services or describe a need",
        uk: "Обрати сервіси або описати потребу",
      },
      {
        en: "Review scope and budget position",
        uk: "Розглянути обсяг і бюджетну позицію",
      },
      {
        en: "Request a detailed proposal",
        uk: "Запросити детальну пропозицію",
      },
    ],
    layers: {
      sector: true,
      theme: true,
      hub: false,
      researchQueue: true,
    },
  },
];
