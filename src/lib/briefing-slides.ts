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
      en: "From enquiry to use",
      uk: "Від запиту до використання",
    },
    title: {
      en: "A broad enquiry needs a way to use its results.",
      uk: "Широкий запит потребує способу використати результат.",
    },
    body: {
      en: "Your enquiry covers a large contact audience. Research can prepare the information; reviewing it, selecting relevant expertise and coordinating the next action create an operational challenge of their own.",
      uk: "Ваш запит охоплює велику аудиторію контактів. Дослідження може підготувати інформацію; її перевірка, доречний підбір експертизи й організація наступної дії створюють окрему операційну задачу.",
    },
    insight: {
      en: "A dossier is not yet a conversation, an engagement or a client mandate. The question is how ISRM can put the research to work.",
      uk: "Досьє ще не є розмовою, співпрацею чи клієнтським дорученням. Питання в тому, як ISRM зможе використати дослідження у роботі.",
    },
    principle: {
      en: "Make the information usable as a shared asset.",
      uk: "Зробити інформацію придатним до спільної роботи ресурсом.",
    },
    note: {
      en: "The audience described in the enquiry is the starting context, not a verified reachable network or a forecast of demand.",
      uk: "Аудиторія із запиту — початковий контекст, не підтверджена досяжна мережа чи прогноз попиту.",
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
      en: "Digital tools organise. ISRM professionals judge.",
      uk: "Цифрові інструменти впорядковують. Фахівці ISRM оцінюють.",
    },
    body: {
      en: "The prototype shows search, dossiers and a working shortlist on the supplied research sample. Digital tools can organise information and AI can assist research. ISRM consultants and members can provide professional review, within agreed roles and standards.",
      uk: "Прототип показує пошук, досьє й робочий відбір на переданій дослідницькій вибірці. Цифрові інструменти можуть впорядковувати інформацію, а ШІ — допомагати дослідженню. Консультанти й члени ISRM можуть здійснювати професійну перевірку в межах погоджених ролей і стандартів.",
    },
    insight: {
      en: "The graph helps make sense of it. OSINT helps prepare the information. Professional review provides a considered, accountable judgement. Subsequent interaction creates the result.",
      uk: "Граф допомагає це зрозуміти. OSINT допомагає підготувати інформацію. Професійна перевірка дає відповідальне судження. А подальша взаємодія створює результат.",
    },
    principle: {
      en: "Support professional responsibility with evidence.",
      uk: "Підтримати професійну відповідальність доказовими підставами.",
    },
    note: {
      en: "The map describes the supplied sample, not the whole membership. Source confirmation, professional review, a recommendation and willingness to participate remain distinct. Operational AI research is not connected.",
      uk: "Мапа описує передану вибірку, не весь склад членства. Підтвердження джерела, професійна перевірка, рекомендація й готовність долучитися залишаються різними ознаками. Операційне дослідження з ШІ не підключене.",
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
      en: "Services around member needs",
      uk: "Сервіси навколо потреб членів",
    },
    title: {
      en: "Use the same foundation for more than verification.",
      uk: "Використати спільну основу ширше за верифікацію.",
    },
    body: {
      en: "Information, professional review and member participation can also support introductions, client enquiries, peer learning, discussions and shared knowledge. Choose the services useful to ISRM; the configurator shows how they can work together.",
      uk: "Інформація, професійна перевірка й участь членів можуть також підтримувати знайомства, клієнтські запити, взаємне навчання, обговорення та спільні знання. Обирайте корисні для ISRM сервіси; конфігуратор показує, як вони можуть працювати разом.",
    },
    insight: {
      en: "Services and their required functions form the proposed scope. Workflow examples explain possible uses; they do not require ISRM to buy a preset package.",
      uk: "Сервіси та потрібні функції формують запропонований обсяг. Приклади workflow пояснюють можливі застосування; вони не вимагають купувати готовий пакет.",
    },
    principle: {
      en: "Choose useful services. Agree the way of working.",
      uk: "Обрати корисні сервіси. Погодити спосіб роботи.",
    },
    note: {
      en: "Each use needs an owner, participation and appropriate rules. Choosing a service does not activate it or establish member demand. Technical and process dependencies must be made explicit.",
      uk: "Кожне застосування потребує відповідального, участі людей і доречних правил. Вибір сервісу не активує його й не доводить попиту членів. Технічні та процесні залежності мають бути явними.",
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
      en: "Shared rules make cross-chapter work possible.",
      uk: "Спільні правила уможливлюють роботу між чаптерами.",
    },
    body: {
      en: "A wider range of uses belongs in ISRM’s organisational development: who contributes, who reviews, how information is maintained and how colleagues may be approached. Standards, policies and procedures define responsibilities and acceptable outcomes.",
      uk: "Ширший набір застосувань належить до організаційного розвитку ISRM: хто долучається, хто перевіряє, як підтримується інформація та як звертатися до колег. Стандарти, політики й процедури визначають відповідальність і прийнятний результат.",
    },
    insight: {
      en: "The proposed approach combines reusable tools with ISRM’s own practices. Agreed integrations can connect useful functions to existing systems; actual systems and access requirements must first be established.",
      uk: "Запропонований підхід поєднує повторно використовувані інструменти з практиками ISRM. Погоджені інтеграції можуть поєднати потрібні функції з наявними системами; спочатку потрібно визначити самі системи й вимоги до доступу.",
    },
    principle: {
      en: "Agree what a useful result means.",
      uk: "Погодити, що саме є корисним результатом.",
    },
    note: {
      en: "This is a proposed direction for organisational use. It does not assume active participation across chapters, an existing integration or an approved ISRM operating policy.",
      uk: "Це запропонований напрям організаційного використання. Він не припускає активної участі всіх чаптерів, уже наявної інтеграції чи затвердженої операційної політики ISRM.",
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
      en: "Keep information current. Make participation worthwhile.",
      uk: "Актуальні дані. Змістовна участь.",
    },
    body: {
      en: "Pilot a useful enquiry and examine what sustains the process: current records, a responsible coordinator, professional review and people willing to contribute. Record the next action and its outcome so the network can learn from the interaction.",
      uk: "Випробуймо корисний запит і перевірмо, що підтримує процес: актуальні записи, відповідальний координатор, професійна перевірка й готовність людей долучитися. Фіксуймо наступну дію та її результат, щоб мережа могла вчитися на взаємодії.",
    },
    insight: {
      en: "Access to relevant expertise, introductions, learning and useful discussions may give members reasons to participate. The pilot must test these motives and the work needed to keep them going.",
      uk: "Доступ до доречної експертизи, знайомств, навчання й корисних обговорень може створювати мотив участі. Пілот має перевірити ці мотиви та роботу, потрібну для їх підтримки.",
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
      en: "Try the prototype. Choose useful support.",
      uk: "Спробуйте прототип. Оберіть корисну підтримку.",
    },
    body: {
      en: "Continue individual research, adapt the demonstrated tools or choose further services for a pilot. You can describe a need directly; workflow examples are there to help. A simpler existing-application option remains available for discussion.",
      uk: "Продовжуйте разові дослідження, адаптуйте продемонстровані інструменти чи оберіть додаткові сервіси для пілоту. Потребу можна описати прямо; приклади workflow допомагають зорієнтуватися. Простіший варіант на основі наявного застосунку також залишається предметом обговорення.",
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
