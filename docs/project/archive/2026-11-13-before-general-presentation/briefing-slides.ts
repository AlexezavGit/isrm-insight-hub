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
  ),
  slide(
    copy("Data that exists is not data that works", "Наявні дані ще не працюють самі"),
    copy("Data that exists is not data that works.", "Наявні дані ще не працюють самі."),
    copy(
      "A spreadsheet holds the records. Keeping them current, assessing relevance and agreeing the next action still need a managed process. The bottleneck is the work between a record and a useful interaction.",
      "Таблиця зберігає записи. Підтримувати їх актуальність, оцінювати доречність і погоджувати наступну дію потрібно в керованому процесі. Вузьке місце — робота між записом і корисною взаємодією.",
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
      "The return path illustrates a proposed process, not automatic updating.",
      "Повернення результатів показує задум процесу, а не автоматичне оновлення.",
    ),
  ),
  slide(
    copy("What it looks like", "Як це виглядає"),
    copy("Your data, returned as a working map.", "Ваші дані повертаються як робоча мапа."),
    copy(
      "ISRM supplied 178 contact records. We have collected initial public-source data for 45 identified profiles; research continues and its depth can follow your questions. The demonstration returns these first findings as a searchable graph with dossiers and saved selections.",
      "ISRM передала 178 контактних записів. Щодо 45 ідентифікованих профілів зібрано перші дані з відкритих джерел; дослідження триває, його глибину можна визначати за вашими питаннями. Демонстрація повертає ці перші результати у графі з пошуком, досьє та збереженням відбору.",
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
      "Further functions need agreement and implementation. Participation and outcomes remain to be tested.",
      "Подальші функції потребують погодження й реалізації. Участь та результати ще потрібно перевірити.",
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
      "Search and selection can work without AI research. Where useful, AI could help gather sources, compare findings and prepare questions. ISRM’s consultants and members provide the professional judgement; agreed rules determine what can be used and shared.",
      "Пошук і відбір можуть працювати без ШІ-досліджень. Там, де це корисно, ШІ може допомагати збирати джерела, зіставляти результати й готувати питання. Професійне судження забезпечують консультанти та члени ISRM; погоджені правила визначають, що можна використовувати й передавати.",
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
      "We would be grateful if you could take a look, try it, and tell us what you think: whether there is a spark of usefulness in it, what you would change, and whether it sits alongside the board’s objectives. Think of this demonstration as a visit to our workshop, working with the data you shared.",
      "Будемо вдячні, якщо ви переглянете демонстрацію, спробуєте її та поділитеся думкою: чи є в ній щось корисне, що ви змінили б і як це узгоджується із завданнями правління. Сприймайте цю демонстрацію як візит до нашої майстерні, де ми працюємо з переданими вами даними.",
    ),
  ),
];
