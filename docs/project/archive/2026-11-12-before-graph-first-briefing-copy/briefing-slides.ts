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
      en: "The first research findings are visible in the graph.",
      uk: "Перші результати дослідження видно на графі.",
    },
    body: {
      en: "This is also a presentation of research for ISRM using its supplied workbook: 178 contact records and initial public-source data collected for 45 identified profiles. Research continues, and its depth can be adjusted to the questions ISRM wants to answer. The graph shows these first findings, not all ISRM members or completed verification.",
      uk: "Це водночас презентація дослідження для ISRM на основі переданої робочої книги: 178 записів контактів і перші дані з відкритих джерел, зібрані щодо 45 ідентифікованих профілів. Дослідження триває, а його глибину можна змінювати відповідно до питань ISRM. Граф показує ці перші результати, а не всіх членів ISRM чи завершену перевірку.",
    },
    insight: {
      en: "The map makes the research inspectable. A dossier is not yet a conversation, an engagement or a client mandate.",
      uk: "Мапа робить результати дослідження доступними для огляду. Досьє ще не є розмовою, співпрацею чи клієнтським дорученням.",
    },
    principle: {
      en: "Turn a delivered dataset into a maintained working resource.",
      uk: "Перетворити передані дані на ресурс, який підтримують і використовують.",
    },
    note: {
      en: "The research is based on public sources. It does not replace interviews, professional review or permission to publish or contact a person.",
      uk: "Дослідження спирається на відкриті джерела. Воно не замінює співбесіди, фахової перевірки чи дозволу оприлюднювати дані або контактувати з людиною.",
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
      en: "The graph reveals what the records can currently tell us.",
      uk: "Граф показує те, що зараз можна дізнатися із записів.",
    },
    body: {
      en: "This view groups the supplied sample by recorded expertise. Its largest cluster has no expertise recorded, so deeper matching first needs better source data. The application can search the available fields, show a dossier and keep a shortlist in this browser. The graph only maps parameters present today; its dimensions and depth can grow when further sources, relationships and permissions are agreed.",
      uk: "Цей зріз групує передану вибірку за записаною експертизою. Найбільша група не має записаного напряму, тому для глибшого підбору спершу потрібні повніші вихідні дані. Застосунок шукає за наявними полями, показує досьє й зберігає відбір у цьому браузері. Граф відображає лише наявні зараз параметри; кількість і глибину зрізів можна збільшити після погодження додаткових джерел, зв’язків і прав доступу.",
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
      en: "The map is an overview of recorded attributes. A source flag, professional review, colleague recommendation and willingness to participate are separate states. Operational AI research is not connected.",
      uk: "Мапа є оглядом записаних ознак. Позначка джерела, професійна перевірка, рекомендація колеги й готовність долучитися — різні стани. Операційне дослідження з ШІ не підключене.",
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
      en: "Our own consulting work exposed the missing connection.",
      uk: "У власній консалтинговій роботі ми побачили відсутню ланку.",
    },
    body: {
      en: "We began building this application for our own research, professional judgement and work with colleagues. We did not find the functionality we needed among the proprietary solutions we tried. That is our own experience and the reason we began building. We need to work with source-backed expertise, review, agreed contact and follow-through in one controllable process. The graph makes the available information inspectable; further services remain proposals.",
      uk: "Ми почали створювати цей застосунок для власних досліджень, професійних суджень і роботи з колегами. Ми не знайшли потрібної нам функціональності серед пропрієтарних рішень, які випробували. Це наш власний досвід і причина почати розробку. Нам потрібен єдиний керований процес роботи з експертизою та її джерелами, перевіркою, погодженим контактом і подальшими діями. Граф дає змогу оглянути наявні дані; додаткові сервіси поки що запропоновані.",
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
      en: "Each further use needs an owner, participation, rules and implementation.",
      uk: "Кожне подальше застосування потребує відповідального, участі людей, правил і реалізації.",
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
      en: "People, rules and tools have to work together.",
      uk: "Люди, правила та інструменти мають працювати разом.",
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
      en: "Try the application and tell us what is useful.",
      uk: "Спробуйте застосунок і скажіть, що корисне.",
    },
    body: {
      en: "Explore the working search and shortlist, then consider which further services merit discussion. We would value your view of the demonstration, its fit with ISRM's work and the changes that would make it useful. Any implementation beyond the demonstration needs a separately agreed scope.",
      uk: "Перевірте робочий пошук і відбір, а потім визначте, які додаткові сервіси варто обговорити. Нам важлива ваша думка про демонстрацію, її відповідність роботі ISRM і зміни, які зробили б її корисною. Реалізація поза демонстрацією потребує окремо погодженого обсягу.",
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
