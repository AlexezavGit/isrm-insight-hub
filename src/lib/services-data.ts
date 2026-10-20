import {
  Activity,
  BriefcaseBusiness,
  CalendarDays,
  FileSearch,
  Library,
  Megaphone,
  MessageSquareText,
  Newspaper,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  icon: any;
  title: { en: string; uk: string };
  short: { en: string; uk: string };
  purpose: { en: string; uk: string };
  role: { en: string; uk: string };
  metrics: { en: string; uk: string };
  dependencyLabel: { en: string; uk: string };
  color: string;
  assumedExpertCount: number;
}

export const NETWORK_SERVICES: ServiceItem[] = [
  {
    id: "svc:mvp",
    icon: BriefcaseBusiness,
    title: {
      en: "MVP Application",
      uk: "MVP Застосунок",
    },
    short: {
      en: "Core expert workflow, search and group formation",
      uk: "Основа робочого процесу, пошук та формування груп",
    },
    purpose: {
      en: "The core working application: find the right expertise, form project groups, track goals and contributions, prepare first contact. Everything else builds on this foundation.",
      uk: "Основний робочий застосунок: знайти потрібну експертизу, сформувати проєктні групи, відстежувати цілі й внески, підготувати перший контакт. Все інше будується на цьому фундаменті.",
    },
    role: {
      en: "Expert search and filtering · Purpose-based group selection · Profile and evidence review · Project goal and task tracking · First contact preparation.",
      uk: "Пошук і фільтрування експертів · Відбір групи за метою · Перегляд профілю й доказів · Облік цілей і задач проєкту · Підготовка першого контакту.",
    },
    metrics: {
      en: "45 verified profiles · 178 CRM records · 100% privacy boundary",
      uk: "45 верифікованих профілів · 178 записів у CRM · 100% захист приватності",
    },
    dependencyLabel: {
      en: "Core Application · Foundational Privacy",
      uk: "Основа застосунку · Межі приватності",
    },
    color: "hsl(var(--primary))",
    assumedExpertCount: 4,
  },
  {
    id: "svc:acquisitions",
    icon: Users,
    title: {
      en: "Active acquisitions",
      uk: "Активні залучення",
    },
    short: {
      en: "Form listing of potential candidate experts",
      uk: "Сформувати лістинг потенційних експертів",
    },
    purpose: {
      en: "Systematically identify and onboard potential candidate experts into the association pool across priority sectors and strategic gaps.",
      uk: "Системна ідентифікація та залучення потенційних експертів до пулу асоціації за пріоритетними секторами та стратегічними прогалинами.",
    },
    role: {
      en: "Form listing of potential experts · Target outreach by sector & jurisdiction · Track initial consent and profile completion · Establish onboarding pipeline.",
      uk: "Сформувати лістинг потенційних експертів · Таргетований аутріч за секторами й юрисдикціями · Облік згоди та заповнення профілів · Побудова пайплайну залучення.",
    },
    metrics: {
      en: "178 CRM records · ~175 target candidates / cycle (2% lower band)",
      uk: "178 записів у CRM · ~175 цільових кандидатів / цикл (2% нижній діапазон)",
    },
    dependencyLabel: {
      en: "Capacity expansion · Acquisition pipeline",
      uk: "Розширення капасіті · Пайплайн залучення",
    },
    color: "hsl(var(--chart-2, 210 100% 66%))",
    assumedExpertCount: 6,
  },
  {
    id: "svc:discussions",
    icon: MessageSquareText,
    title: {
      en: "Expert discussions",
      uk: "Експертні обговорення",
    },
    short: {
      en: "Form agenda, connect expert listing, distribute invitations",
      uk: "Сформувати адженду, приєднати експертів, надіслати запрошення",
    },
    purpose: {
      en: "Structured working groups and expert roundtables. Capture decisions, evidence and outputs with full attribution.",
      uk: "Структуровані робочі групи та експертні круглі столи. Фіксація рішень, доказів та практичних результатів із повною атрибуцією.",
    },
    role: {
      en: "Form agenda, connect expert listing, distribute invitations, moderate structured roundtables, synthesize findings.",
      uk: "Сформувати адженду, приєднати лістинг експертів, відправити запрошення, модерувати структуровані круглі столи, узагальнювати висновки.",
    },
    metrics: {
      en: "~175 engaged per campaign · 20-30 active roundtable contributors",
      uk: "~175 залучених за кампанію · 20-30 активних учасників круглих столів",
    },
    dependencyLabel: {
      en: "Competency mapping · Evidence review",
      uk: "Карта компетенцій · Перегляд доказів",
    },
    color: "hsl(var(--chart-3, 142 70% 45%))",
    assumedExpertCount: 4,
  },
  {
    id: "svc:reports",
    icon: Library,
    title: {
      en: "Reports & Publications",
      uk: "Звіти та публікації",
    },
    short: {
      en: "Transcribe audio, compile report, publish and engage media",
      uk: "Розшифрувати стенограму, створити звіт, публікації та медіа",
    },
    purpose: {
      en: "Transcribe audio records, convert to analytical reports and publications, connect journalists and media outlets, confirm publishing, post to web & social media, collect interested leads, and launch follow-up inquiries.",
      uk: "Розшифрувати стенограму, перетворити на звіт, перетворити на публікації, приєднати лістинг журналістів та видань, відправити матеріал, отримати підтвердження, перепостити на сайт та соцмережі, зібрати зацікавлених/лайки/коментарі, сформувати запит на обговорення.",
    },
    role: {
      en: "Transcribe audio record, compile analytical report, adapt into articles, connect journalists and media outlets, send material, confirm publishing, post to web & social media, track engagements/likes/comments, generate follow-up requests.",
      uk: "Розшифрувати стенограму, перетворити на звіт, перетворити на публікації, приєднати лістинг журналістів та видань, відправити матеріал, отримати підтвердження, перепостити на сайт та до соцмереж, зібрати зацікавлених/лайки/коментарі, сформувати запит на обговорення.",
    },
    metrics: {
      en: "Free publications · 8.7k LinkedIn audience reach · media mentions",
      uk: "Безоплатні публікації · 8.7k охоплення аудиторії LinkedIn · медіа-згадки",
    },
    dependencyLabel: {
      en: "Publicity development · Free publications",
      uk: "Розвиток паблісіті · Безоплатні публікації",
    },
    color: "hsl(var(--chart-4, 45 93% 47%))",
    assumedExpertCount: 5,
  },
  {
    id: "svc:expertise",
    icon: ShieldCheck,
    title: {
      en: "Network Expertise - Cases",
      uk: "Мережева експертиза — Кейси",
    },
    short: {
      en: "Author-permitted reports, project execution, proposals & fees",
      uk: "Звіти за згодою автора, виконання проєктів, запити й гонорари",
    },
    purpose: {
      en: "Structure delivered reports into the network expertise repository, unlockable via verified author permission. Inquire about project execution and fees, assemble working groups by discipline, request proposals, and agree honoraria.",
      uk: "Розподілити звіти у мережеву експертизу (відкриваються за підтвердженим запитом від автора), запитатися у експерта про виконання проєкту та гонорар, підібрати групу за напрямом, запитатися про пропозицію, погодити гонорар.",
    },
    role: {
      en: "Structure reports into the network expertise repository, accessible via verified author permission, inquire about project execution and fees, assemble working group by discipline, request proposal, agree honorarium.",
      uk: "Розподілити звіти у мережеву експертизу — відкриваються за підтвердженим запитом від автора, запитатися у експерта про виконання проєкту та гонорар, підібрати групу за напрямом, запитатися про пропозицію, погодити гонорар.",
    },
    metrics: {
      en: "Composite TII record · Cross-sell & over-sell commercial pipeline",
      uk: "Композитний запис TII · Комерційний пайплайн крос-селлу та овер-селлу",
    },
    dependencyLabel: {
      en: "Cross-sell · Over-sell · TII record",
      uk: "Крос-селл · Овер-селл · Запис TII",
    },
    color: "hsl(var(--primary))",
    assumedExpertCount: 6,
  },
  {
    id: "svc:warroom",
    icon: Megaphone,
    title: {
      en: "War Room",
      uk: "War Room",
    },
    short: {
      en: "Real-time mapping, project assembly, board supervision",
      uk: "Картування експертизи в реальному часі, супервізія борду",
    },
    purpose: {
      en: "Map expertise, experts and consultants in real time, create active projects, assemble advisors, prepare documentation, request supervision, refer clients/requests, approach board or disciplinary committee, collect research, publish briefs, identify partner services, request client recommendations.",
      uk: "Картувати експертизу, експертів та консультантів, створити актуальний проєкт, зібрати групу експертів та консультантів, створити документацію, запитати про супервізію, реферувати замовлення/замовника, звернутися до борду, дисциплінарної комісії, зібрати дослідження, опублікувати вакансію, знайти партнерські сервіси, запитати рекомендації на клієнтів.",
    },
    role: {
      en: "Map expertise, experts and consultants in real time, create active project, assemble consultants & advisors, prepare documentation, request supervision, refer client/request, approach board or disciplinary committee, collect research, publish briefs, identify partner services, request client recommendations.",
      uk: "Картувати експертизу, експертів та консультантів, створити актуальний проєкт, зібрати групу експертів та консультантів, створити документацію, запитати про супервізію, реферувати замовлення/замовника, звернутися до борду, дисциплінарної комісії, зібрати дослідження, опублікувати вакансію, знайти партнерські сервіси, запитати рекомендації на клієнтів.",
    },
    metrics: {
      en: "Real-time deployment · Rapid response team capacity",
      uk: "Розгортання в реальному часі · Оперативна спроможність команд",
    },
    dependencyLabel: {
      en: "Real-time deployment · Governance supervision",
      uk: "Розгортання в реальному часі · Супервізія борду",
    },
    color: "hsl(var(--chart-5, 280 65% 60%))",
    assumedExpertCount: 5,
  },
  {
    id: "svc:conferences",
    icon: Newspaper,
    title: {
      en: "Conferences by sector, specialisation, territory",
      uk: "Конференції за секторами, спеціалізаціями, територіями",
    },
    short: {
      en: "Agenda, billing, speaker pool, Almanac & relationship management",
      uk: "Адженда, квитки, пул спікерів, Альманах і менеджмент відносин",
    },
    purpose: {
      en: "Form agenda, distribute to members and broad public, digital event management service (tickets, billing, speaker roster, interested pool, communication stream, Almanac preparation, invitations, notifications, session rescheduling, vendor, relationship and payment management).",
      uk: "Сформувати адженду, розповсюдити серед членів або по широкому колу, цифровий сервіс супроводу (квитки, білінг, зібрати докладчиків, зібрати пул зацікавлених, створити комунікацію, підготувати Almanac, запрошення, повідомлення, перепланування докладів, керування підрядниками, відносинами, платежами).",
    },
    role: {
      en: "Form agenda, distribute to members and public, digital management service (tickets, billing, speaker roster, interested pool, communication stream, Almanac preparation, invitations, rescheduling, vendor, relationship and payment management).",
      uk: "Сформувати адженду, розповсюдити серед членів або по широкому колу, цифровий сервіс супроводу (квитки, білінг, зібрати докладчиків, зібрати пул зацікавлених, створити комунікацію, підготувати Almanac, запрошення, повідомлення, перепланування докладів, керування підрядниками, відносинами, платежами).",
    },
    metrics: {
      en: "~43 attendees / cycle (25% free-to-paid benchmark) · Almanac distribution",
      uk: "~43 платних відвідувачів / цикл (25% конверсія) · Розповсюдження альманаху",
    },
    dependencyLabel: {
      en: "Commercial ticket billing · Almanac thought leadership",
      uk: "Білінг квитків · Лідерство думок через Almanac",
    },
    color: "hsl(var(--chart-2))",
    assumedExpertCount: 8,
  },
  {
    id: "svc:memberships",
    icon: Star,
    title: {
      en: "New Memberships at every step",
      uk: "Нові членства на кожному кроці",
    },
    short: {
      en: "Continuous value-based conversion into paid association members",
      uk: "Безперервна конверсія у платних членів через цінність",
    },
    purpose: {
      en: "Followers who participated in discussions, read reports, and attended conferences convert into paid members throughout every step of the cycle — through demonstrated value, not cold sales pitches.",
      uk: "Фоловери, які брали участь в обговореннях, читали звіти та відвідували конференції, конвертуються у платних членів на кожному кроці циклу — через продемонстровану цінність, а не холодний продаж.",
    },
    role: {
      en: "Seamless membership funnel across all touchpoints (roundtable participants, report readers, conference attendees convert to paid members via demonstrated value).",
      uk: "Безперервна воронка членства на кожному етапі взаємодії (учасники круглих столів, читачі звітів, гості конференцій стають платними членами через продемонстровану цінність).",
    },
    metrics: {
      en: "~52 paid members / cycle (30% apply-to-accepted benchmark)",
      uk: "~52 нових платних члени / цикл (30% прийняття заявок)",
    },
    dependencyLabel: {
      en: "Value-based conversion · New paid memberships",
      uk: "Конвертація через цінність · Нові платні членства",
    },
    color: "hsl(var(--chart-3))",
    assumedExpertCount: 7,
  },
];
