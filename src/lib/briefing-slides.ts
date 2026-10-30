import { PROJECT_POSITIONING } from "./project-positioning";
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
    label: { en: "Asset, not bottleneck", uk: "Ресурс для роботи" },
    title: {
      en: "11,000 contacts are a starting point.",
      uk: "11 тисяч контактів — початок роботи.",
    },
    body: {
      en: "Your enquiry asks us to research a large audience. We can continue that work. The next practical question is how to find, review, select and use the information once it is delivered.",
      uk: "Ваш запит стосується дослідження великої аудиторії. Ми можемо продовжувати цю роботу. Наступне практичне питання — як знаходити, перевіряти, відбирати й використовувати інформацію після її отримання.",
    },
    insight: {
      en: "A dossier is not yet a conversation, an engagement or a client mandate. The prototype makes the next steps tangible.",
      uk: "Досьє ще не є розмовою, співпрацею чи клієнтським дорученням. Прототип дозволяє спробувати наступні кроки.",
    },
    principle: {
      en: "Put the research to work.",
      uk: "Перетворювати дослідження на корисну роботу.",
    },
    note: {
      en: "11,000 is the scale described in the enquiry, not a verified reachable audience or revenue forecast. No conversion is assumed.",
      uk: "11 тисяч — масштаб із запиту, не підтверджена досяжна аудиторія чи прогноз доходу. Конверсію не припускаємо.",
    },
    steps: [
      { en: "Research enquiry", uk: "Запит дослідження" },
      { en: "Source-backed information", uk: "Інформація з джерелами" },
      { en: "Useful selection", uk: "Доречний відбір" },
      { en: "Agreed next action", uk: "Погоджена наступна дія" },
    ],
    layers: { sector: true, theme: false, hub: false, researchQueue: true },
  },
  {
    label: { en: "Amplifier, not replacement", uk: "Підсилення професійної роботи" },
    title: {
      en: "Find expertise. Understand the evidence.",
      uk: "Знайти експертизу. Зрозуміти підстави.",
    },
    body: {
      en: "Try search, dossiers and a working shortlist on the supplied 178-record sample. The map shows recorded expertise; operational AI research and shared systems still require connection.",
      uk: "Спробуйте пошук, досьє й робочий відбір на переданій вибірці зі 178 записів. Мапа показує зафіксовану експертизу; операційний AI research і спільні системи ще потребують підключення.",
    },
    insight: PROJECT_POSITIONING.explanation,
    principle: { en: "Trust is a professional mandate.", uk: "Довіра — професійний мандат." },
    note: {
      en: "Source confirmation, expertise, a recommendation and willingness to participate are different things. AI does not create a human recommendation. The supplied sample is not a complete membership register.",
      uk: "Підтвердження джерела, експертиза, рекомендація та готовність долучитися — різні речі. ШІ не створює людської рекомендації. Передана вибірка не є повним реєстром членства.",
    },
    steps: [
      { en: "Search", uk: "Пошук" },
      { en: "Inspect evidence", uk: "Перегляд підстав" },
      { en: "Keep a shortlist", uk: "Збереження відбору" },
    ],
    layers: { sector: true, theme: false, hub: false, specialisation: true, researchQueue: true },
  },
  {
    label: { en: "Services around people", uk: "Сервіси навколо людей" },
    title: {
      en: "Choose support for your members’ needs.",
      uk: "Оберіть підтримку потреб ваших членів.",
    },
    body: {
      en: "Explore the service capabilities, keep what is useful and describe what is missing. Services can be combined into workflows, but you need not adopt a preset to explain your requirement.",
      uk: "Переглядайте сервісну функціональність, обирайте корисне й описуйте те, чого бракує. Сервіси можна об’єднувати у workflow, але для опису потреби не обов’язково приймати готовий набір.",
    },
    insight: {
      en: "The configurator shapes a tailored proposal. Its service links illustrate possible working arrangements; they do not activate services or prove member participation.",
      uk: "Конфігуратор формує індивідуальну пропозицію. Зв’язки сервісів показують можливу організацію роботи; вони не активують сервіси й не доводять участь членів.",
    },
    principle: {
      en: "Choose the capability. Shape the process together.",
      uk: "Оберіть можливість. Разом сформуємо процес.",
    },
    note: {
      en: "Preset packages remain optional planning aids. A changed composition requires reassessment of dependencies, outcomes and price in the detailed proposal.",
      uk: "Готові набори — лише опційні орієнтири. Змінений склад потребує переоцінки залежностей, результатів і ціни в детальній пропозиції.",
    },
    steps: [
      { en: "People and needs", uk: "Люди й потреби" },
      { en: "Useful services", uk: "Корисні сервіси" },
      { en: "Agreed workflow", uk: "Погоджений workflow" },
    ],
    layers: { sector: true, theme: false, hub: true, researchQueue: true },
  },
  {
    label: { en: "Shared rules at scale", uk: "Спільні правила на масштабі" },
    title: {
      en: "35 chapters. Shared rules. Local judgement.",
      uk: "35 чаптерів. Спільні правила. Фахове судження.",
    },
    body: {
      en: "Technology can support interaction across chapters. ISRM’s policies must define the expected result, who maintains information, who reviews it and how colleagues may be approached.",
      uk: "Технології можуть підтримати взаємодію між чаптерами. Політики ISRM мають визначити очікуваний результат, хто підтримує інформацію, хто перевіряє її та як звертатися до колег.",
    },
    insight: {
      en: "Appropriate introductions, discussions and useful contributions give people reasons to participate. The application supports these arrangements alongside existing ISRM systems.",
      uk: "Доречні знайомства, обговорення й корисні внески створюють мотив долучатися. Застосунок підтримує ці домовленості поруч із наявними системами ISRM.",
    },
    principle: {
      en: "Agree what a useful result means.",
      uk: "Погодити, що саме є корисним результатом.",
    },
    note: {
      en: "The chapter count is the planning context in the brief, not evidence of active participation. Connections to actual CRM, learning and communication systems require individual scope and permission checks.",
      uk: "Кількість чаптерів — контекст планування з брифу, не доказ активної участі. Підключення до фактичних CRM, навчальних і комунікаційних систем потребують окремого погодження обсягу й прав.",
    },
    steps: [
      { en: "Shared policies", uk: "Спільні політики" },
      { en: "Professional responsibility", uk: "Професійна відповідальність" },
      { en: "Useful interaction", uk: "Корисна взаємодія" },
    ],
    layers: { sector: true, theme: true, hub: true, researchQueue: true },
  },
  {
    label: { en: "Flywheel: a hypothesis to test", uk: "Цикл цінності: гіпотеза для перевірки" },
    title: {
      en: "Keep information current. Make participation worthwhile.",
      uk: "Актуальні дані. Змістовна участь.",
    },
    body: {
      en: "Build the pilot around one real enquiry and two difficult questions: how records stay current, and why people contribute. Sources, dates, digital checks, appropriate contact and the outcome form one managed process.",
      uk: "Побудуймо пілот навколо реального запиту й двох складних питань: як підтримувати актуальність та чому люди долучатимуться. Джерела, дати, цифрові перевірки, доречний контакт і результат утворюють керований процес.",
    },
    insight: {
      en: "Learning, useful interaction and participation can return experience to the network. Measure that effect before expanding into further services or knowledge products.",
      uk: "Навчання, корисна взаємодія й участь можуть повертати досвід у мережу. Виміряймо цей ефект до розширення сервісів чи створення продуктів експертизи.",
    },
    principle: {
      en: "Test the benefit. Then decide what grows.",
      uk: "Перевірити користь. Тоді вирішити, що розвивати.",
    },
    note: {
      en: "No exponential growth or financial return is promised. Future consultant assistants or model training require a separate decision on purpose, data rights, safeguards and evaluation.",
      uk: "Експоненційне зростання чи фінансова віддача не обіцяються. Майбутні AI-консультанти чи навчання моделей потребують окремого рішення щодо мети, прав, захисту й оцінювання.",
    },
    steps: [
      { en: "Useful contribution", uk: "Корисний внесок" },
      { en: "Reviewed experience", uk: "Перевірений досвід" },
      { en: "Further value", uk: "Подальша цінність" },
    ],
    layers: { sector: false, theme: true, hub: true, researchQueue: true },
  },
  {
    label: { en: "Your next step", uk: "Ваш наступний крок" },
    title: {
      en: "Try the application. Choose your next step.",
      uk: "Спробуйте застосунок. Оберіть наступний крок.",
    },
    body: {
      en: "Continue individual research, tailor the core or explore additional capabilities. If a simpler existing-application option fits better, choose the fallback. A brief impression of the prototype is welcome whichever route you prefer.",
      uk: "Продовжуйте разові дослідження, адаптуйте ядро чи дослідіть додаткові можливості. Якщо краще підходить простіший наявний застосунок — оберіть fallback. Будемо вдячні за коротке враження від прототипу за будь-якого вибору.",
    },
    insight: {
      en: "Your choices inform a detailed proposal with agreed scope, dependencies, acceptance checks and budget. This is an invitation to discuss, not an order or acceptance of a final price.",
      uk: "Ваш вибір стане основою детальної пропозиції з погодженими обсягом, залежностями, перевірками приймання й бюджетом. Це запрошення до розмови, не замовлення чи погодження остаточної ціни.",
    },
    principle: {
      en: "Your decision. A practical next conversation.",
      uk: "Ваше рішення. Предметна наступна розмова.",
    },
    note: {
      en: "The demonstration uses the supplied sample. Operational AI OSINT and shared authenticated storage are not connected. Decisions remain with ISRM.",
      uk: "Демонстрація використовує передану вибірку. Операційний AI OSINT і спільне авторизоване сховище не підключені. Рішення залишаються за ISRM.",
    },
    steps: [
      { en: "Explore the graph", uk: "Переглянути граф" },
      { en: "Try the application", uk: "Спробувати застосунок" },
      { en: "Agree scope & budget", uk: "Погодити обсяг і бюджет" },
      { en: "Receive a proposal", uk: "Отримати пропозицію" },
    ],
    layers: { sector: true, theme: true, hub: false, researchQueue: true },
  },
];
