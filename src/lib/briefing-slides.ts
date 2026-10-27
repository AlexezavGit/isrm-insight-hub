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
      en: "The bottleneck",
      uk: "Вузьке місце",
    },
    title: {
      en: "From 11,000 contacts to the answers you need.",
      uk: "Від 11 тисяч контактів — до потрібних відповідей.",
    },
    body: {
      en: "Checking every contact by hand creates a bottleneck. AI-assisted OSINT can prepare the research, but a professional must verify the evidence and conclusions: an error can put reputations at risk.",
      uk: "Суцільна ручна перевірка створює вузьке місце. AI OSINT може підготувати дослідження, але докази й висновки обов’язково перевіряє фахівець: помилка загрожує репутації.",
    },
    principle: {
      en: "A contact base is a starting point, not a forecast of demand.",
      uk: "База контактів — початок роботи, а не прогноз попиту.",
    },
    insight: {"en": "Begin with a focused sample: test relevance and response before committing resources across the entire contact base.", "uk": "Спершу — цільова вибірка: перевірити релевантність і відгук, перш ніж витрачати ресурси на весь масив контактів."},
    note: {
      en: "11,000+ contacts is the audience cited in your enquiry. LinkedIn contacts do not automatically become paying members or clients. Test relevance, response and conversion on a focused sample before scaling. AI OSINT is proposed and is not connected in this demo.",
      uk: "Понад 11 000 контактів — аудиторія з вашого запиту. Контакти LinkedIn не стають платними членами чи клієнтами автоматично. Спершу перевіряємо релевантність, відгук і конверсію на цільовій вибірці. AI OSINT запропоновано; у демо його ще не підключено.",
    },
    steps: [
      {
        en: "Contact base",
        uk: "Масив контактів",
      },
      {
        en: "Focused enquiries",
        uk: "Цільові запити",
      },
      {
        en: "AI research",
        uk: "AI-дослідження",
      },
      {
        en: "Professional verification",
        uk: "Перевірка фахівцем",
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
      en: "A network solution",
      uk: "Рішення для мережі",
    },
    title: {
      en: "35 chapters. A potential network of expertise.",
      uk: "35 чаптерів. Потенційна мережа експертизи.",
    },
    body: {
      en: "ISRM can connect professional judgement at a scale one source cannot easily offer. A shared application, AI-assisted research and accountable review could give each chapter a useful tool for reliable information and controlled exchange.",
      uk: "ISRM може поєднати професійне судження в масштабі, недоступному одному джерелу. Спільний застосунок, AI-дослідження та відповідальна перевірка можуть дати кожному чаптеру інструмент достовірних даних і контрольованого обміну.",
    },
    principle: {
      en: "Technology extends reach. Named professionals stand behind the judgement.",
      uk: "Технології розширюють охоплення. За судженням — ім’я й репутація.",
    },
    insight: {"en": "Start with the existing chapter questionnaire: establish needs, willingness to contribute and capacity for professional review. Shared policies and named reviewers provide the basis for accountable participation.", "uk": "Починаємо з наявного опитувальника чаптерів: потреби, готовність долучитися та ресурс професійної перевірки. Спільні правила й відповідальні фахівці створюють основу взаємодії."},
    note: {
      en: "Start with the existing questionnaire: needs, willingness to participate and review capacity across 35 chapters. Shared policies, source evidence, dates, access controls and correction routes underpin the proposed service. Secure shared storage and AI OSINT require implementation; the current demo is browser-local. Review does not guarantee accuracy or confer accreditation.",
      uk: "Починаємо з наявного опитувальника: потреби, готовність долучитися й ресурс перевірки 35 чаптерів. Основа сервісу — спільні політики, джерела, дати, контроль доступу й виправлення. Захищене спільне сховище та AI OSINT потребують реалізації; поточне демо працює локально в браузері. Перевірка не гарантує безпомилковості й не є акредитацією.",
    },
    steps: [
      {
        en: "Shared policies",
        uk: "Спільні політики",
      },
      {
        en: "Source evidence",
        uk: "Джерела й докази",
      },
      {
        en: "Professional accountability",
        uk: "Професійна відповідальність",
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
      en: "Engagement cycle",
      uk: "Цикл залучення",
    },
    title: {
      en: "Each interaction opens another possibility.",
      uk: "Кожна взаємодія створює наступну можливість.",
    },
    body: {
      en: "A useful interaction can lead to learning, paid membership, a partnership, a service enquiry, a referral or a conference. A connected workflow helps people find a relevant next step and brings value back to the network.",
      uk: "Корисна взаємодія може привести до навчання, платного членства, партнерства, послуги, клієнтського запиту, рефералу чи конференції. Цілісний workflow допомагає знайти доречний наступний крок і повертає цінність у мережу.",
    },
    principle: {
      en: "Relevant opportunities for people. A repeatable cycle for ISRM.",
      uk: "Людям — доречні можливості. ISRM — відтворюваний цикл.",
    },
    insight: {"en": "Members, clients, students and partners need different routes. The proposed workflow would connect needs with expertise and introductions beyond existing personal contacts; participation and conversion would be measured.", "uk": "Членам, клієнтам, студентам і партнерам потрібні різні маршрути. Workflow має поєднати потреби, експертизу й знайомства поза особистим колом; участь та конверсію вимірюємо."},
    note: {
      en: "Different audiences need different routes: prospective members, clients, students, partners, alumni and future leaders. Participation and conversion are outcomes to measure, not promises. The chapter dashboard can connect needs, expertise and introductions beyond word of mouth.",
      uk: "Різним аудиторіям потрібні різні маршрути: майбутнім членам, клієнтам, студентам, партнерам, alumni та наступникам. Участь і конверсія — результати для вимірювання, а не обіцянки. Дашборд чаптерів може поєднати потреби, експертизу й знайомства поза особистим колом контактів.",
    },
    steps: [
      {
        en: "Useful interaction",
        uk: "Корисна взаємодія",
      },
      {
        en: "Relevant next step",
        uk: "Доречний наступний крок",
      },
      {
        en: "Value for the network",
        uk: "Цінність для мережі",
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
      en: "Digital capability",
      uk: "Цифрова спроможність",
    },
    title: {
      en: "A digital arm for ISRM’s development.",
      uk: "Цифрове плече розвитку ISRM.",
    },
    body: {
      en: "The application, AI OSINT and professional community address an operational need. Together they could build an enduring capability: members gain useful tools, clients gain better-supported answers, and ISRM gains stronger services and connections.",
      uk: "Застосунок, AI OSINT і професійна спільнота відповідають на операційну потребу. Разом вони можуть утворити постійну спроможність: інструменти для членів, краще обґрунтовані відповіді для клієнтів, сильніші сервіси й зв’язки для ISRM.",
    },
    principle: {
      en: "A capability for future enquiries — with room to develop.",
      uk: "Спроможність для наступних запитів — із простором для розвитку.",
    },
    insight: {"en": "The core provides the foundation. Existing learning, CRM and project systems can be considered for subsequent integration, subject to access, resources and an agreed scope.", "uk": "Ядро створює основу. Наявні навчальні, CRM та проєктні системи можна підключати наступними ітераціями — за погодженими доступами, ресурсами й обсягом."},
    note: {
      en: "Bringing professional intelligence and technology together opens possibilities beyond individual checks. Development still depends on participation, evidence quality, governance and resources. Existing CRM, learning and project systems can be integrated; project planning and reporting belong to a separately scoped second iteration.",
      uk: "Поєднання професійного інтелекту й технологій відкриває можливості за межами окремих перевірок. Розвиток залежить від участі, якості доказів, правил і ресурсів. Можлива інтеграція з наявними CRM, навчальними та проєктними системами; планування й звітність — окремо погоджена друга ітерація.",
    },
    steps: [
      {
        en: "Members",
        uk: "Члени",
      },
      {
        en: "Clients",
        uk: "Клієнти",
      },
      {
        en: "ISRM",
        uk: "ISRM",
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
      en: "A horizon to explore",
      uk: "Горизонт для дослідження",
    },
    title: {
      en: "From verified information to network expertise.",
      uk: "Від перевірених даних — до мережевої експертизи.",
    },
    body: {
      en: "Materials and experience could become research, professional practice and learning — and, later, AI agents that assist consultants. A hypothesis worth discussing, once secure communication and digital trust have a sound foundation.",
      uk: "Матеріали й досвід можуть ставати дослідженнями, практиками й навчанням, а згодом — AI-агентами на допомогу консультантам. Гіпотеза, варта розмови, коли є основа безпечних комунікацій і цифрової довіри.",
    },
    principle: {
      en: "First establish trust. Then explore what expertise + AI can become.",
      uk: "Спершу — основа довіри. Далі — можливості експертизи + AI.",
    },
    insight: {"en": "This professional-to-professional direction goes beyond the original enquiry. Any future model training would require separate agreement on rights, permitted data, safeguards and evaluation.", "uk": "Цей professional-to-professional напрям виходить за початковий запит. Тренування моделей потребуватиме окремого погодження прав, дозволених даних, захисту та оцінювання."},
    note: {
      en: "A possible professional-to-professional direction: safer professional communication and stronger trust in network expertise across ISRM’s sphere of influence. This lies beyond the original enquiry. Any future model training would require separate agreement on rights, permitted data use, safeguards and evaluation; no training, ranking or additional programme is commissioned here.",
      uk: "Можливий professional-to-professional напрям: розвиток безпеки професійних комунікацій та зміцнення довіри до носіїв мережевої експертизи в зоні впливу ISRM. Це поза початковим запитом. Майбутнє тренування моделей потребує окремого погодження прав, дозволеного використання даних, захисту й оцінювання; тут не замовляється тренування, рейтинг чи додаткова програма.",
    },
    steps: [
      {
        en: "Verified material & experience",
        uk: "Перевірені матеріали й досвід",
      },
      {
        en: "Research, practice & learning",
        uk: "Дослідження, практики й навчання",
      },
      {
        en: "Trained consultant assistant · next iteration",
        uk: "Навчений AI-консультант · наступна ітерація",
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
      en: "Define the scenario that fits you.",
      uk: "Наступний крок — визначити ваш сценарій.",
    },
    body: {
      en: "Explore your familiar sample in the graph. Choose useful capabilities and workflows, clarify the scope and indicative budget, and use that starting point to shape a detailed proposal together.",
      uk: "Перегляньте знайому вибірку в графі. Оберіть корисні можливості та workflow, уточніть обсяг і бюджетний орієнтир — на цій основі разом сформуємо детальну пропозицію.",
    },
    principle: {
      en: "Start with the demonstration. Continue with a concrete scenario.",
      uk: "Почнімо з демонстрації. Продовжимо конкретним сценарієм.",
    },
    insight: {"en": "The demonstration uses your supplied sample. AI OSINT and shared authenticated storage are not connected; your experience of the tool will help define what should be developed next.", "uk": "У демонстрації — передана вами вибірка. AI OSINT і спільне авторизоване сховище ще не підключені; досвід роботи з інструментом допоможе визначити наступні кроки."},
    note: {
      en: "The demo uses the supplied sample; AI OSINT and shared authenticated storage are not yet connected. The briefing is an invitation to clarify needs, not a commission or a guarantee of commercial outcomes.",
      uk: "Демонстрація використовує передану вибірку; AI OSINT і спільне авторизоване сховище ще не підключено. Брифінг — запрошення уточнити потреби, а не замовлення робіт чи гарантія комерційного результату.",
    },
    steps: [
      { en: "Explore the graph", uk: "Переглянути граф" },
      { en: "Try the application", uk: "Спробувати застосунок" },
      { en: "Agree scope & budget", uk: "Погодити обсяг і бюджет" },
      { en: "Receive a proposal", uk: "Отримати пропозицію" },
    ],
    layers: {
      sector: true,
      theme: true,
      hub: false,
      researchQueue: true,
    },
  },
];
