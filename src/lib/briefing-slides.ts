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
    label: {
      en: "The bottleneck",
      uk: "Вузьке місце",
    },
    title: {
      en: "From 11,000 contacts to the answers you need.",
      uk: "Від 11 тисяч контактів — до потрібних відповідей.",
    },
    body: {
      en: "Your enquiry concerns 11,000 people. Research can prepare information; a large set of dossiers still needs a way to search, review, select and act. The prototype lets you explore that working process.",
      uk: "Ваш запит стосується 11 тисяч людей. Дослідження готує інформацію; великому масиву досьє ще потрібен спосіб пошуку, перевірки, відбору й подальшої дії. Прототип дозволяє спробувати цей робочий процес.",
    },
    principle: {
      en: "A record is a starting point. A useful interaction is an outcome.",
      uk: "Запис — початок роботи. Корисна взаємодія — результат.",
    },
    insight: {
      en: "Individual research remains an option. The additional question is how to retain sources, follow up and reuse the work across future enquiries.",
      uk: "Разові дослідження залишаються можливістю. Додаткове питання — як зберігати джерела, відстежувати подальші дії та використовувати роботу в наступних запитах.",
    },
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
      en: "Find relevant expertise, inspect the source and prepare a working shortlist. Shared policies would define who maintains a record, reviews findings and authorises its use across chapters.",
      uk: "Знайти доречну експертизу, переглянути джерело й підготувати робочий відбір. Спільні політики визначатимуть, хто підтримує запис, перевіряє висновки й дозволяє його використання між чаптерами.",
    },
    principle: {
      en: "Agree who maintains the record, who reviews it and who may use it.",
      uk: "Погодити, хто підтримує запис, хто перевіряє та хто має доступ.",
    },
    insight: PROJECT_POSITIONING.explanation,
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
      en: "People participate when there is a relevant reason: a professional discussion, useful expertise, an introduction or a service enquiry. Agreed responsibilities and follow-up help turn that interest into a useful interaction.",
      uk: "Люди долучаються, коли є доречний мотив: професійне обговорення, потрібна експертиза, знайомство чи запит на послугу. Погоджена відповідальність і подальші дії допомагають перетворити цей інтерес на корисну взаємодію.",
    },
    principle: {
      en: "Shared standards. A reason to participate. A recorded next step.",
      uk: "Спільні стандарти. Мотив долучитися. Зафіксований наступний крок.",
    },
    insight: {
      en: "Members, clients, students and partners need different routes. The proposed workflow would connect needs with expertise and introductions beyond existing personal contacts; participation and conversion would be measured.",
      uk: "Членам, клієнтам, студентам і партнерам потрібні різні маршрути. Workflow має поєднати потреби, експертизу й знайомства поза особистим колом; участь та конверсію вимірюємо.",
    },
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
      en: "The proposed project supports safer professional communication, connections between colleagues and network expertise. The application would help ISRM put its chosen policies and working practices into use alongside existing systems.",
      uk: "Запропонований проєкт підтримує безпечніші професійні комунікації, горизонтальні зв’язки й мережеву експертизу. Застосунок допоможе втілювати обрані політики та робочі практики ISRM поруч із наявними системами.",
    },
    principle: {
      en: "Configure the support your organisation needs.",
      uk: "Конструюйте підтримку розвитку своєї організації.",
    },
    insight: {
      en: "Build around the systems ISRM already uses. The proposed contribution is to connect expertise, evidence and enquiries; CRM, learning and project tools can be integrated where useful, within an agreed scope.",
      uk: "Спираємося на системи, якими вже користується ISRM. Запропонована цінність — поєднати експертизу, джерела й запити; CRM, навчальні та проєктні інструменти підключати там, де це корисно, у погодженому обсязі.",
    },
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
      en: "The pilot would test whether expertise can support a managed process: sources, dates, digital checks, appropriate contact, willingness to participate and a recorded outcome. Reviewed experience could later inform research, learning and further services.",
      uk: "Пілот перевірить керований процес роботи з експертизою: джерела, дати, цифрові перевірки, доречний контакт, готовність долучитися й зафіксований результат. Перевірений досвід надалі може підтримувати дослідження, навчання та інші сервіси.",
    },
    principle: {
      en: "Keep records current. Give people a reason to contribute.",
      uk: "Підтримувати актуальність. Створювати мотив долучитися.",
    },
    insight: {
      en: "This professional-to-professional direction goes beyond the original enquiry. Any future model training would require separate agreement on rights, permitted data, safeguards and evaluation.",
      uk: "Цей professional-to-professional напрям виходить за початковий запит. Тренування моделей потребуватиме окремого погодження прав, дозволених даних, захисту та оцінювання.",
    },
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
      en: "Try the search on a familiar sample. Then consider a tailored core, explore further capabilities or continue with individual research. Your choices and a brief impression will help us prepare the right next step.",
      uk: "Спробуйте пошук на знайомій вибірці. Далі розгляньте індивідуальне ядро, дослідіть додаткові можливості або продовжуйте разові дослідження. Ваш вибір і коротке враження допоможуть визначити доречний наступний крок.",
    },
    principle: {
      en: "Start with the demonstration. Continue with a concrete scenario.",
      uk: "Почнімо з демонстрації. Продовжимо конкретним сценарієм.",
    },
    insight: {
      en: "A bounded pilot needs an ISRM sponsor, a reviewer, a representative enquiry and a decision date. Compare time to a useful shortlist with current practice, assess relevance and response, then decide whether to proceed. Scope records the proposed acceptance checks.",
      uk: "Пілоту потрібні відповідальний ISRM, фахівець з перевірки, типовий запит і дата рішення. Порівнюємо час до корисного відбору з поточною практикою, оцінюємо релевантність і відгук, тоді вирішуємо щодо продовження. У scope — запропоновані критерії приймання.",
    },
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
