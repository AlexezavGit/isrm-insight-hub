export type ClientLocale = "en" | "uk";
export type Copy = Record<ClientLocale, string>;
export const CLIENT_SERVICES = [
  {
    id: "search",
    title: { en: "Network mapping & search", uk: "Мапування мережі та пошук" },
    detail: {
      en: "You would be able to import agreed contact data, open a brief profile or full dossier, search by relevant criteria and explore connections in the graph. Custom fields and relationship types will support your questions.",
      uk: "Ви зможете завантажувати погоджені контактні дані, відкривати міні-резюме або повне досьє, шукати за потрібними ознаками й досліджувати зв’язки на графі. Налаштовувані поля й типи зв’язків допоможуть ставити власні запитання.",
    },
    status: { en: "Search and graph demonstrated", uk: "Пошук і граф демонструються" },
  },
  {
    id: "groups",
    title: { en: "Groups & working lists", uk: "Групи й робочі списки" },
    detail: {
      en: "You would be able to build long lists and shortlists for a specific enquiry, organise contacts into groups and keep the context of your selection. Shared lists and ownership are part of the planned core.",
      uk: "Ви зможете формувати long lists і shortlists під конкретний запит, об’єднувати контакти в групи та зберігати контекст відбору. Спільні списки й визначення відповідального входять до планованого ядра.",
    },
    status: { en: "Local selection demonstrated", uk: "Локальний відбір демонструється" },
  },
  {
    id: "research",
    title: { en: "AI OSINT research assistant", uk: "ШІ OSINT-помічник дослідника даних" },
    detail: {
      en: "You would be able to request research, receive findings with their sources and pass them to a professional reviewer. The existing AI OSINT assistant requires connection to the application; research volumes and AI/API costs are agreed separately.",
      uk: "Ви зможете замовляти дослідження, отримувати висновки разом із джерелами та передавати їх фахівцю на перевірку. Наявного ШІ OSINT-помічника потрібно підключити до застосунку; обсяг досліджень і AI/API-витрати погоджуються окремо.",
    },
    status: {
      en: "Existing assistant · application connection to agree",
      uk: "Наявний помічник · підключення до застосунку погоджується",
    },
  },
  {
    id: "review",
    title: { en: "Human review & corrections", uk: "Людська перевірка й виправлення" },
    detail: {
      en: "You would be able to check a finding against its sources, record who reviewed it and correct outdated or inaccurate information. A thematic match alone is not a professional recommendation.",
      uk: "Ви зможете перевіряти висновок за джерелами, фіксувати автора професійної перевірки та виправляти застарілі або неточні дані. Сам тематичний збіг не є професійною рекомендацією.",
    },
    status: { en: "Proposed process", uk: "Запропонований процес" },
  },
  {
    id: "evidence",
    title: { en: "Evidence & knowledge records", uk: "Записи доказів і знань" },
    detail: {
      en: "You would be able to reuse a reviewed finding while retaining its source, author, review date, permissions and version history.",
      uk: "Ви зможете повторно використовувати перевірені висновки разом із джерелом, авторством, датою перевірки, дозволами та історією змін.",
    },
    status: { en: "To implement", uk: "Потребує реалізації" },
  },
  {
    id: "contact",
    title: { en: "Introductions & referrals", uk: "Знайомства та реферали" },
    detail: {
      en: "You would be able to find a relevant colleague for an enquiry, arrange an introduction and record permission to share the information and the next action.",
      uk: "Ви зможете знаходити доречного колегу під запит, організовувати знайомство й фіксувати згоду на передачу інформації та наступну дію.",
    },
    status: { en: "Proposed process", uk: "Запропонований процес" },
  },
  {
    id: "integration",
    title: { en: "Access, data & integrations", uk: "Доступ, дані та інтеграції" },
    detail: {
      en: "You would be able to import and improve agreed datasets, configure fields and define who may view or update information. Specific exchanges with ISRM systems are scoped individually.",
      uk: "Ви зможете завантажувати й поліпшувати погоджені набори даних, налаштовувати поля та визначати, хто може переглядати й оновлювати інформацію. Конкретні обміни з системами ISRM визначаються окремо.",
    },
    status: { en: "Scope to agree", uk: "Обсяг належить погодити" },
  },
  {
    id: "survey",
    title: { en: "Member survey & priorities", uk: "Опитування членів та пріоритети" },
    detail: {
      en: "Members and chapter leaders could identify useful expertise, current needs and preferred ways to contribute. The Board could use the findings to agree priorities and a practical starting scope.",
      uk: "Члени й керівники чаптерів зможуть визначити потрібну експертизу, актуальні потреби та зручні способи участі. Правління — використати результати для погодження пріоритетів і практичного початкового обсягу.",
    },
    status: {
      en: "Existing questionnaire draft · distribution to agree",
      uk: "Наявна чернетка опитувальника · розсилку належить погодити",
    },
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
    title: {
      en: "Membership, client enquiries & professional participation",
      uk: "Цикл залучення та конверсії аудиторій",
    },
    detail: {
      en: "A continuing pathway from followers and professional audiences in ISRM’s sphere of influence to relevant participation: paid membership, client services, learning, partnerships, candidate development and future leadership. Each interaction informs the next cycle.",
      uk: "Постійний шлях від фоловерів і цільових аудиторій у зоні впливу ISRM до доречної участі: оплачуваного членства, клієнтських послуг, навчання, партнерства, розвитку кандидатів і майбутнього лідерства. Кожна взаємодія уточнює наступний цикл.",
    },
    serviceIds: ["groups", "contact", "integration", "survey", "publishing"] as ServiceId[],
    outputs: {
      en: [
        "Training enquiries",
        "Membership",
        "Partnerships",
        "Alumni participation & resources",
        "Further services & continuing engagements",
        "Client enquiries & professional referrals",
        "Conference attendance",
        "Professional contribution & succession",
      ],
      uk: [
        "Запити на навчання",
        "Членство",
        "Партнерство",
        "Участь і ресурси alumni",
        "Крос-селл та розширення замовлень",
        "Запити клієнтів у поле колег і реферали",
        "Відвідування конференцій",
        "Кандидати та наступність лідерства",
      ],
    },
  },
  {
    id: "expertise",
    title: {
      en: "Developing and sharing professional expertise",
      uk: "Цикл трансформації експертизи у продукти",
    },
    detail: {
      en: "A managed flow of data and professional experience: review, synthesis and transformation into useful products for members and agreed external audiences. Workflows make participation manageable and preserve attribution. Experience from applying these products can renew the shared expertise and strengthen professional reputation.",
      uk: "Керований потік даних і професійного досвіду: перевірка, синтез і трансформація в корисні продукти для членів та погоджених зовнішніх аудиторій. Workflow впорядковує участь і зберігає авторство. Досвід застосування продуктів може оновлювати спільну експертизу та зміцнювати професійну репутацію.",
    },
    serviceIds: ["groups", "research", "review", "evidence", "publishing"] as ServiceId[],
    outputs: {
      en: [
        "Learning & development",
        "Evidence-based publications",
        "Research & professional discussions",
        "Colleagues for projects & client enquiries",
      ],
      uk: [
        "Навчання та розвиток",
        "Доказові публікації",
        "Дослідження й професійні обговорення",
        "Проєктні групи та клієнтські рішення",
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

/** Proposed outcomes for ISRM leadership and members, to validate in consultation. */
export const WORKFLOW_OUTCOME_COPY = {
  engagement: {
    uk: [
      "Для ISRM це можливість бачити, яких тем і програм потребують різні аудиторії. Член асоціації зможе передати навчальний запит і отримати відповідний контакт або програму; запит, тема та наступний крок залишаться пов’язаними.",
      "Зацікавленій людині має бути зрозуміло, що дає членство та як подати заявку. Команда ISRM зможе супроводжувати звернення до відповідної категорії, зокрема оплачуваного членства, й бачити, де потрібна відповідь або допомога. Умови вступу визначає ISRM.",
      "Правління й чаптери зможуть знаходити колег та організації зі спільними інтересами для партнерства. Член асоціації отримає зрозумілий шлях подати ідею та знайти відповідального співрозмовника; картотека збереже тему й контекст звернення.",
      "Участь у програмі може стати початком тривалого професійного зв’язку з ISRM. Випускник зможе отримувати доречні матеріали, запрошення та можливості поділитися досвідом за своєю згодою; асоціація — підтримувати цей зв’язок відповідно до його інтересів.",
      "Член або клієнт зможе знайти наступну доречну послугу через вже знайомий контакт. Для ISRM це можливість продовжити корисну взаємодію: зберегти потребу, запропонований наступний крок і результат розмови. Зростання продажів потребує перевірки на практиці.",
      "Член асоціації зможе передати запит, який потребує іншої спеціалізації, та знайти доречного колегу в мережі. Клієнт отримає шлях до відповідної експертизи, а ISRM — можливість підтримати реферал зі згодою на передачу даних і зрозумілою наступною дією.",
      "Учасник зможе знаходити події за своїми професійними інтересами. Команда ISRM — пов’язувати запрошення з доречною темою та бачити шлях від інтересу до участі, щоб точніше планувати комунікацію й програму подій.",
      "Члени з інтересом до активнішої участі зможуть заявити про готовність долучитися до ініціатив або майбутніх ролей. Правління й чаптери зможуть підтримувати ці контакти та обговорювати розвиток спільноти; професійні рішення залишаються за відповідальними людьми.",
    ],
    en: [
      "ISRM could see which topics and programmes different audiences need. Members could submit a learning enquiry and reach an appropriate programme or contact, with the topic, enquiry and next step kept together.",
      "An interested person should be able to understand the value of membership and how to apply. ISRM’s team could guide enquiries towards the appropriate category, including paid membership, and see where a response or assistance is needed. ISRM determines admission requirements.",
      "The Board and chapters could identify colleagues and organisations with shared interests. Members would have a clear route to propose an initiative and find the right person to discuss it, with the topic and context retained in the catalogue.",
      "A programme could become the start of an ongoing professional relationship with ISRM. Alumni could receive relevant resources, invitations and opportunities to contribute with their consent; the association could maintain contact around their interests.",
      "A member or client could find a relevant next service through an established contact. ISRM could continue a useful relationship by retaining the need, proposed next step and discussion outcome. The commercial value would be assessed through actual enquiries and subsequent work.",
      "Members could refer an enquiry requiring another specialism and find a suitable colleague in the network. Clients would gain a route to relevant expertise, while ISRM could support the referral with permission to share information and a clear next action.",
      "Participants could find events relevant to their professional interests. ISRM’s team could connect invitations with appropriate topics and follow the path from interest to attendance, informing communication and event planning.",
      "Members interested in greater involvement could express their willingness to contribute to initiatives or future roles. The Board and chapters could maintain these relationships and discuss community development; professional decisions remain with responsible people.",
    ],
  },
  expertise: {
    uk: [
      "Члени асоціації зможуть ділитися перевіреним досвідом і знаходити матеріали для власного розвитку. ISRM — збирати актуальні навчальні теми та готувати разом з авторами модулі на основі практики, зі збереженням джерел і прав використання.",
      "Практик зможе перетворити свій досвід на матеріал із джерелами та професійною рецензією. ISRM — підтримати підготовку публікації, яку можна перевірити й використовувати в роботі; читачі бачитимуть авторство, походження висновків та межі їх застосування.",
      "Правління й чаптери зможуть ставити питання, важливі для професійної спільноти, та залучати доречну експертизу. Члени — долучатися до досліджень і дискусій та отримувати перевірені результати, які можна застосувати у власній практиці.",
      "Член асоціації зможе знайти колег із потрібним досвідом для клієнтського запиту та використати дозволені напрацювання мережі. ISRM — допомогти поєднати запит і експертизу, а отриманий досвід може поповнити спільні знання. Планування й управління проєктами потребує окремої інтеграції.",
    ],
    en: [
      "Members could share reviewed experience and find resources for their own development. ISRM could identify current learning needs and work with authors on practice-based modules, retaining sources and usage rights.",
      "Practitioners could develop their experience into material supported by sources and professional review. ISRM could support a publication that readers can verify and use in their work, with clear attribution, evidence and limits of application.",
      "The Board and chapters could frame questions that matter to the profession and invite relevant expertise. Members could contribute to research and discussions and receive reviewed findings to inform their own practice.",
      "Members could find colleagues with relevant experience for a client enquiry and reuse permitted network resources. ISRM could help connect the enquiry with expertise, while experience from the work could inform shared knowledge. Project planning and management require a separate integration.",
    ],
  },
} as const;
