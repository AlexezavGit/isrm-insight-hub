import type { Copy } from "./client-catalog";
import type { GraphLayers } from "@/components/NetworkGraph";
export type BriefingSlide = {
  label: Copy;
  title: Copy;
  body: Copy;
  note: Copy;
  insight: Copy;
  principle: Copy;
  steps: Copy[];
  layers: GraphLayers;
};
const copy = (en: string, uk: string): Copy => ({ en, uk });
const slide = (label: Copy, title: Copy, body: Copy, note = copy("", "")): BriefingSlide => ({
  label,
  title,
  body,
  note,
  insight: copy("", ""),
  principle: copy("", ""),
  steps: [],
  layers: { sector: true, theme: false, hub: false, researchQueue: true },
});
/** Approved eight-part sequence shared by screen and print. */
export const BRIEFING_SLIDES: BriefingSlide[] = [
  slide(
    copy("The capability gap", "Спроможність, якої бракує"),
    copy(
      "Holding data is a start. Making it work takes more.",
      "Мати дані — початок. Для їх використання потрібно більше.",
    ),
    copy(
      "Collecting and storing information creates a starting point. Turning it into a continuing flow of expertise, interaction and resources takes tools, people and agreed ways of working.",
      "Збір і зберігання інформації створюють початкову основу. Щоб перетворити її на постійний потік експертизи, взаємодії та ресурсів, потрібні інструменти, люди й погоджені правила роботи.",
    ),
    copy(
      "For consultants, network coordinators and professional associations: find relevant expertise, understand its basis and agree a useful next step.",
      "Для консультантів, координаторів мереж і професійних асоціацій: знайти доречну експертизу, зрозуміти її підстави й погодити корисний наступний крок.",
    ),
  ),
  slide(
    copy("Data that exists is not data that works", "Наявні дані ще не працюють самі"),
    copy("Data that exists is not data that works.", "Наявні дані ще не працюють самі."),
    copy(
      "A coordinator receives an enquiry. Which profiles are relevant, how current are the sources, and who may be contacted? A spreadsheet holds the records; the work between a record and a useful interaction still needs an owner and agreed rules.",
      "Координатор отримує запит. Чия експертиза доречна, наскільки актуальні джерела й до кого можна звернутися? Таблиця зберігає записи; робота між записом і корисною взаємодією потребує відповідального й погоджених правил.",
    ),
  ),
  slide(
    copy(
      "A standing resource rather than a one-off study",
      "Постійний ресурс замість разового дослідження",
    ),
    copy(
      "A standing resource rather than a one-off study.",
      "Постійний ресурс замість разового дослідження.",
    ),
    copy(
      "We began building this application for our own consulting work. We did not find the functionality we needed among the proprietary solutions we tried. We wanted research that could be updated, revisited and used for the next enquiry.",
      "Ми почали створювати застосунок для власної консалтингової роботи. Ми не знайшли потрібної нам функціональності серед пропрієтарних рішень, які випробували. Нам потрібні результати дослідження, які можна оновлювати, переглядати й використовувати для наступного запиту.",
    ),
    copy(
      "Target architecture: existing systems → connectors → profiles, expertise and sources → working processes. This demo uses preloaded data and browser-local saving; connectors and shared storage require development.",
      "Цільова архітектура: наявні системи → конектори → профілі, експертиза й джерела → робочі процеси. У демо — завантажені дані й збереження в браузері; конектори та спільне сховище потребують розроблення.",
    ),
  ),
  slide(
    copy(
      "What it looks like · a real research sample",
      "Як це виглядає · реальна дослідницька вибірка",
    ),
    copy("From records to a working map.", "Від записів до робочої мапи."),
    copy(
      "This demonstration uses a supplied research sample of 178 contact records, with initial public-source data for 45 identified profiles. Research continues. Start with recorded expertise, open a dossier, make a shortlist and save the search. The sample illustrates the application; it is not your organisation’s network.",
      "Демонстрація використовує передану дослідницьку вибірку зі 178 контактних записів, із першими даними відкритих джерел щодо 45 ідентифікованих профілів. Дослідження триває. Почніть із наявної експертизи, відкрийте досьє, зробіть відбір і збережіть пошук. Вибірка ілюструє застосунок; це не мережа вашої організації.",
    ),
    copy(
      "The graph shows available fields. Further dimensions and deeper research can be agreed. Selections are saved in this browser.",
      "Граф показує наявні поля. Додаткові виміри й глибину дослідження можна погодити. Відбір зберігається в цьому браузері.",
    ),
  ),
  slide(
    copy("Where it could go", "Куди це може розвиватися"),
    copy(
      "The same foundation could support more of your work.",
      "Ця основа може підтримувати більше напрямів вашої роботи.",
    ),
    copy(
      "Possible uses range from research assistance to introductions, shared expertise and member engagement. Members’ contributions, supported by agreed standards and procedures, could extend this into organisational development. The configurator illustrates possibilities for discussion.",
      "Можливі застосування охоплюють допомогу в дослідженнях, знайомства, спільну експертизу та залучення членів. Участь членів за погодженими стандартами й процедурами може розширити це до організаційного розвитку. Конфігуратор ілюструє можливості для обговорення.",
    ),
    copy(
      "CRM, learning and publishing systems are potential integration partners. The aim is to connect expertise and its evidence across them. Adapters are not connected; further functions, participation and outcomes remain to be tested.",
      "CRM, навчальні та видавничі системи — потенційне поле інтеграції. Задум — пов’язувати експертизу та її підстави між ними. Адаптери не підключено; подальші функції, участь і результати ще потрібно перевірити.",
    ),
  ),
  slide(
    copy("Privacy and consent by design", "Приватність і згода в основі проєктування"),
    copy(
      "Seeing a profile should not mean unrestricted access.",
      "Перегляд профілю не має означати необмежений доступ.",
    ),
    copy(
      "A useful network needs clear rules for who can see, review and share information. A source record, a colleague’s recommendation and a person’s consent are different things. Introductions need an agreed route and permission to disclose contact details.",
      "Корисній мережі потрібні чіткі правила: хто може бачити, перевіряти й передавати інформацію. Запис у джерелі, рекомендація колеги та згода персони — різні речі. Для знайомства потрібні погоджений шлях і дозвіл розкрити контактні дані.",
    ),
    copy(
      "The demonstration masks direct contacts. Operational access, consent and retention rules require agreement and implementation.",
      "Демонстрація приховує прямі контакти. Операційні правила доступу, згоди та зберігання потребують погодження й реалізації.",
    ),
  ),
  slide(
    copy("AI: optional", "ШІ: за потреби"),
    copy(
      "AI can assist the work. You decide where.",
      "ШІ може допомагати роботі. Ви визначаєте де.",
    ),
    copy(
      "Search and selection can work without AI research. Where useful, AI could help gather sources, compare findings and prepare questions. Participating professionals provide the judgement; agreed rules determine what can be used and shared.",
      "Пошук і відбір можуть працювати без ШІ-досліджень. Там, де це корисно, ШІ може допомагати збирати джерела, зіставляти результати й готувати питання. Професійне судження забезпечують залучені фахівці; погоджені правила визначають, що можна використовувати й передавати.",
    ),
    copy(
      "Operational AI research is not connected in this demonstration.",
      "Операційне ШІ-дослідження в цій демонстрації не підключено.",
    ),
  ),
  slide(
    copy("An invitation, not an offer", "Запрошення до відгуку"),
    copy("We would value your view", "Будемо вдячні за вашу думку"),
    copy(
      "Please explore the demonstration and tell us what you think: what would be useful, what you would change, and how it relates to your organisation’s work. Think of it as a visit to our workshop, working with a real research sample. Your feedback can help define the next conversation about a relevant implementation.",
      "Огляньте демонстрацію та поділіться думкою: що було б корисним, що ви змінили б і як це пов’язано з роботою вашої організації. Сприймайте її як візит до нашої майстерні з реальною дослідницькою вибіркою. Ваш відгук допоможе визначити наступну розмову про доречне впровадження.",
    ),
  ),
];
