import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  BellRing,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  FileSearch,
  GitBranch,
  Handshake,
  Library,
  Mail,
  Megaphone,
  MessageSquareText,
  Newspaper,
  Send,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { PartnerGraphLink, PartnerGraphNode } from "@/components/PartnerGraph";
import { CO_DESIGN_SESSIONS, PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";

const PartnerGraph = lazy(() => import("@/components/PartnerGraph"));

type Composer = "task" | "invite" | "alert" | null;
type ServiceFrameField =
  "userRole" | "need" | "behavior" | "outcome" | "dataIntegration" | "acceptance";
type ServiceRequestType = "add" | "change";
type ServiceNeedDecision = "needed" | "not-needed" | "unsure";
type ServiceFrameValues = Record<ServiceFrameField, string> & {
  requestType: ServiceRequestType;
  needDecision: ServiceNeedDecision;
};

const SERVICE_FRAME_FIELDS: {
  id: ServiceFrameField;
  en: string;
  uk: string;
  helpEn: string;
  helpUk: string;
  rows: number;
}[] = [
    {
      id: "userRole",
      en: "Who needs this service, and in what role?",
      uk: "Кому потрібен цей сервіс і в якій ролі?",
      helpEn: "Name the user group and the situation in which they would use it.",
      helpUk: "Вкажіть групу користувачів і ситуацію, у якій вони скористаються сервісом.",
      rows: 2,
    },
    {
      id: "need",
      en: "What gap or problem should it address?",
      uk: "Яку потребу або проблему він має закрити?",
      helpEn: "Describe what is difficult or missing today, not a proposed feature list.",
      helpUk: "Опишіть, чого зараз бракує або що не працює, а не перелік бажаних функцій.",
      rows: 3,
    },
    {
      id: "behavior",
      en: "What should the service let people do?",
      uk: "Що саме людина має мати змогу зробити?",
      helpEn: "Compare the alternatives you have in mind, or describe another preferred flow.",
      helpUk: "Порівняйте варіанти, які розглядаєте, або опишіть бажаний процес інакше.",
      rows: 4,
    },
    {
      id: "outcome",
      en: "What useful result should it produce?",
      uk: "Який корисний результат він має дати?",
      helpEn: "Describe an observable output or decision that would show the service helped.",
      helpUk: "Опишіть видимий результат або рішення, за яким можна оцінити користь сервісу.",
      rows: 2,
    },
    {
      id: "dataIntegration",
      en: "What information or system connection is required?",
      uk: "Які дані або інтеграція потрібні?",
      helpEn: "Identify the source, access boundary and any system it must work with.",
      helpUk: "Назвіть джерело, межі доступу та системи, з якими потрібно взаємодіяти.",
      rows: 3,
    },
    {
      id: "acceptance",
      en: "How will you decide the change is complete?",
      uk: "Як визначити, що зміну виконано?",
      helpEn: "State a checkable acceptance condition; avoid a general goal such as “better”.",
      helpUk: "Задайте перевірювану умову приймання, а не загальну мету на кшталт «краще».",
      rows: 2,
    },
  ];

const SERVICE_DRAFTS_KEY = "isrm-service-deck-drafts-v1";

const SERVICES = [
  {
    icon: BriefcaseBusiness,
    title: { en: "Projects & expert requests", uk: "Проєкти й запити на експертизу" },
    purpose: {
      en: "Turn an expertise need into a scoped project, matched team and controlled delivery. Keep goals, owners, tasks and accepted outputs together so work does not disappear into another spreadsheet.",
      uk: "Перетворює потребу в експертизі на проєкт із визначеним обсягом, командою та контрольованим виконанням. Цілі, відповідальні, задачі й прийняті результати зберігаються разом, а не губляться в окремих таблицях.",
    },
    role: {
      en: "Join as a project lead, contributor or reviewer; agree who owns decisions and deliverables.",
      uk: "Долучайтеся як керівник проєкту, виконавець або рецензент; зафіксуйте власників рішень і результатів.",
    },
    questions: {
      en: {
        need: "Do members need a shared project record, or is a structured request and expert group enough?",
        behavior:
          "Should the workflow track tasks and deliverables only, or also approvals and change history?",
      },
      uk: {
        need: "Чи потрібен учасникам спільний запис проєкту, чи достатньо структурованого запиту й групи експертів?",
        behavior:
          "Чи має процес відстежувати лише задачі й результати, чи також погодження та історію змін?",
      },
    },
    stage: 2,
  },
  {
    icon: Megaphone,
    title: { en: "Recruitment campaigns", uk: "Кампанії залучення експертів" },
    purpose: {
      en: "Plan a bounded campaign for an agreed expert profile and purpose. Keep the audience, approved channel, message and actual delivery evidence distinct from the size of a group or follower count.",
      uk: "Допомагає спланувати обмежену кампанію для погодженого профілю експерта й мети. Аудиторія, дозволений канал, повідомлення та фактична доставка відокремлюються від кількості учасників групи чи підписників.",
    },
    role: {
      en: "Refer candidates, review profiles or help prepare outreach through a channel the owner has approved.",
      uk: "Рекомендуйте кандидатів, переглядайте профілі або допомагайте з комунікацією через канал, погоджений його власником.",
    },
    questions: {
      en: {
        need: "Is targeted recruitment needed, and which expertise gap should it address?",
        behavior:
          "Should invitations be prepared for manual review, or should the service only record referrals and responses?",
      },
      uk: {
        need: "Чи потрібне адресне залучення і яку прогалину в експертизі воно має закрити?",
        behavior:
          "Сервіс має готувати запрошення для ручного перегляду чи лише фіксувати рекомендації та відповіді?",
      },
    },
    stage: 3,
  },
  {
    icon: MessageSquareText,
    title: { en: "Expert discussions", uk: "Експертні обговорення" },
    purpose: {
      en: "Support private roundtables, collaborative research and structured consultations with an agreed agenda. Preserve decisions, evidence and disagreements as reviewable outputs rather than treating attendance as endorsement.",
      uk: "Підтримує закриті круглі столи, спільні дослідження й структуровані консультації за погодженим порядком денним. Рішення, докази й розбіжності фіксуються як результати; сама участь не подається як схвалення.",
    },
    role: {
      en: "Contribute evidence, moderate a session or prepare a synthesis for review.",
      uk: "Надавайте докази, модеруючи сесію, або готуйте узагальнення для перевірки.",
    },
    questions: {
      en: {
        need: "Do experts need a facilitated live discussion, an asynchronous review, or both?",
        behavior:
          "Should the record capture attributed contributions, anonymized notes, agreed decisions, or a mix chosen by participants?",
      },
      uk: {
        need: "Експертам потрібне модероване обговорення наживо, асинхронний перегляд чи обидва формати?",
        behavior:
          "Фіксувати авторські внески, анонімізовані нотатки, погоджені рішення чи обраний учасниками варіант?",
      },
    },
    stage: 1,
  },
  {
    icon: CalendarDays,
    title: { en: "Meeting operations", uk: "Організація зустрічей" },
    purpose: {
      en: "Coordinate access, agenda, attendance, materials and follow-up for online or in-person sessions. The required level may range from a checklist to a reusable event record with assigned actions.",
      uk: "Координує доступ, порядок денний, присутність, матеріали й наступні дії для онлайн- або очних зустрічей. Потрібний рівень може бути від чекліста до повторно використовуваного запису події з призначеними діями.",
    },
    role: {
      en: "Host, attend or provide briefing materials; identify who owns follow-up actions.",
      uk: "Проводьте зустріч, беріть участь або готуйте матеріали; визначайте відповідальних за наступні дії.",
    },
    questions: {
      en: {
        need: "Is a meeting workflow needed beyond existing calendar and video-conference tools?",
        behavior:
          "Should the service manage invitations and attendance, or only agendas, materials and follow-up actions?",
      },
      uk: {
        need: "Чи потрібен окремий процес зустрічей понад наявні календарі й відеозв’язок?",
        behavior:
          "Сервіс має керувати запрошеннями й присутністю чи лише порядком денним, матеріалами та подальшими діями?",
      },
    },
    stage: 3,
  },
  {
    icon: Newspaper,
    title: { en: "Network intelligence", uk: "Аналітика мережі" },
    purpose: {
      en: "Bring together selected network news, calls, opportunities and sector signals with a clear source and date. Curation and permission to reuse a source remain explicit responsibilities.",
      uk: "Збирає відібрані новини мережі, запити, можливості й галузеві сигнали з указанням джерела та дати. Відбір і дозвіл на повторне використання джерела залишаються явними обов’язками.",
    },
    role: {
      en: "Follow topics, submit a sourced signal or respond to a call.",
      uk: "Стежте за темами, додавайте сигнал із джерелом або відповідайте на запит.",
    },
    questions: {
      en: {
        need: "Would members use one curated stream, or should updates stay within each project?",
        behavior:
          "Which sources and topics are in scope, and who reviews accuracy and reuse rights before publishing?",
      },
      uk: {
        need: "Учасникам потрібна спільна стрічка чи оновлення мають залишатися в межах кожного проєкту?",
        behavior:
          "Які джерела й теми потрібні та хто перевіряє точність і права повторного використання перед публікацією?",
      },
    },
    stage: 4,
  },
  {
    icon: BellRing,
    title: { en: "Targeted alerts", uk: "Цільові сповіщення" },
    purpose: {
      en: "Route time-sensitive opportunities to relevant experts through controlled, approved channels. Relevance must not imply that a person consented to contact or will respond.",
      uk: "Передає термінові можливості релевантним експертам через контрольовані й погоджені канали. Релевантність не означає згоди людини на контакт або гарантії відповіді.",
    },
    role: {
      en: "Set notification preferences and decide whether to answer each request.",
      uk: "Налаштовуйте вподобання сповіщень і самостійно вирішуйте, чи відповідати на кожен запит.",
    },
    questions: {
      en: {
        need: "Are alerts needed, or are a searchable opportunity list and voluntary subscriptions enough?",
        behavior:
          "Should members opt into topics, select channels, set quiet hours, or choose only the frequency?",
      },
      uk: {
        need: "Чи потрібні сповіщення, чи достатньо пошуку можливостей і добровільних підписок?",
        behavior:
          "Чи мають учасники обирати теми й канали, задавати тихий час або лише частоту повідомлень?",
      },
    },
    stage: 3,
  },
  {
    icon: Bot,
    title: { en: "AI & OSINT", uk: "AI та OSINT" },
    purpose: {
      en: "Explore assisted research briefs, source checks and a network assistant as separate capabilities. Every generated statement would need source links, uncertainty labels and human review before operational use.",
      uk: "Окремо розглядає допоміжні дослідницькі брифи, перевірку джерел і помічника мережі. Кожне згенероване твердження перед практичним використанням потребувало б посилання на джерело, позначки невизначеності й людської перевірки.",
    },
    role: {
      en: "Request a bounded research task, validate sources and decide what may be attached to project work.",
      uk: "Ставте обмежене дослідницьке завдання, перевіряйте джерела й вирішуйте, що можна додати до проєкту.",
    },
    questions: {
      en: {
        need: "Which research task is sufficiently repetitive to justify assistance rather than manual work?",
        behavior:
          "Should the tool find sources, summarize approved material, or compare evidence—and what must remain human-reviewed?",
      },
      uk: {
        need: "Яке дослідницьке завдання достатньо повторюване, щоб виправдати автоматизовану допомогу замість ручної роботи?",
        behavior:
          "Інструмент має знаходити джерела, узагальнювати погоджені матеріали чи порівнювати докази — і що обов’язково перевіряє людина?",
      },
    },
    stage: 4,
  },
  {
    icon: Handshake,
    title: { en: "Partner services", uk: "Партнерські сервіси" },
    purpose: {
      en: "Make vetted operational support discoverable, such as legal, evacuation, local handling or equipment maintenance. Listing a provider is not a safety guarantee; qualification, availability and due diligence need clear owners.",
      uk: "Допомагає знаходити перевірену операційну підтримку: юридичну, евакуаційну, локальну чи технічне обслуговування. Наявність постачальника в каталозі не гарантує безпеку; перевірка кваліфікації, доступності й надійності потребує відповідальних.",
    },
    role: {
      en: "Request or provide a service, and share feedback only under an agreed review process.",
      uk: "Запитуйте або надавайте послугу; залишайте відгук лише за погодженим процесом перевірки.",
    },
    questions: {
      en: {
        need: "Which service categories are missing from existing trusted referral channels?",
        behavior:
          "Should the directory show qualifications and availability, route a request, or only provide a vetted introduction?",
      },
      uk: {
        need: "Яких категорій послуг бракує в наявних довірених каналах рекомендацій?",
        behavior:
          "Каталог має показувати кваліфікацію й доступність, передавати запит чи лише надавати перевірений контакт?",
      },
    },
    stage: 4,
  },
  {
    icon: Library,
    title: { en: "Knowledge repository", uk: "Сховище знань" },
    purpose: {
      en: "Make permitted project outputs, meeting materials and research reports reusable with provenance. Access and reuse conditions should travel with each artifact rather than be inferred from its presence.",
      uk: "Дозволяє повторно використовувати результати проєктів, матеріали зустрічей і звіти з фіксацією походження. Умови доступу й повторного використання мають супроводжувати кожен матеріал, а не виводитися з його наявності.",
    },
    role: {
      en: "Contribute an artifact, describe its source and access terms, or request permission to reuse it.",
      uk: "Додавайте матеріал із джерелом та умовами доступу або запитуйте дозвіл на його повторне використання.",
    },
    questions: {
      en: {
        need: "Is a shared repository needed, or are project-specific stores sufficient?",
        behavior:
          "Which metadata, access roles, retention rules and reuse-permission checks must exist before search?",
      },
      uk: {
        need: "Чи потрібне спільне сховище, чи достатньо окремих сховищ проєктів?",
        behavior:
          "Які метадані, ролі доступу, строки зберігання й перевірки дозволу на повторне використання потрібні до пошуку?",
      },
    },
    stage: 3,
  },
  {
    icon: FileSearch,
    title: { en: "Compliance & conflicts", uk: "Комплаєнс і конфлікти інтересів" },
    purpose: {
      en: "Track required consent, NDA, disclosure and conflict checks before sensitive participation. The service should make unresolved checks visible without turning a record into a legal determination.",
      uk: "Відстежує потрібні згоди, NDA, розкриття інформації та перевірки конфліктів до чутливої участі. Невирішені перевірки мають бути видимими, але запис у системі не є юридичним висновком.",
    },
    role: {
      en: "Maintain declarations, flag a conflict and route the case to an accountable reviewer.",
      uk: "Оновлюйте декларації, повідомляйте про конфлікт і передавайте випадок відповідальному рецензенту.",
    },
    questions: {
      en: {
        need: "Which checks are currently missed or repeated across projects?",
        behavior:
          "Should the system block an assignment, show a pending review, or record an informed exception?",
      },
      uk: {
        need: "Які перевірки зараз пропускають або повторюють у різних проєктах?",
        behavior:
          "Система має блокувати призначення, показувати очікування перевірки чи фіксувати погоджений виняток?",
      },
    },
    stage: 3,
  },
  {
    icon: Star,
    title: { en: "Trust & credentials", uk: "Довіра й підтвердження" },
    purpose: {
      en: "Build an attributable record of expertise and contributions that can support human review. Evidence quality, context, consent and correction rights must be visible; the record is not an automatic score of a person.",
      uk: "Формує атрибутований запис експертності й внесків для людського перегляду. Якість доказу, контекст, згода й право на виправлення мають бути видимими; запис не є автоматичною оцінкою людини.",
    },
    role: {
      en: "Provide evidence, review what is attributed to you and challenge errors or missing context.",
      uk: "Надавайте докази, перевіряйте приписану вам інформацію та оскаржуйте помилки чи втрачений контекст.",
    },
    questions: {
      en: {
        need: "Which expertise claims need independent evidence, and who is allowed to review it?",
        behavior:
          "Should evidence be organized as a source-linked dossier, a contribution history, or both—with what correction route?",
      },
      uk: {
        need: "Які твердження про експертність потребують незалежного доказу і хто може його переглядати?",
        behavior:
          "Докази мають бути досьє з джерелами, історією внесків чи обома форматами — і як виправляти помилки?",
      },
    },
    stage: 4,
  },
  {
    icon: Activity,
    title: { en: "Consulting pipeline", uk: "Потік консультаційних запитів" },
    purpose: {
      en: "Help experts assess relevant consulting requests and decide whether to respond. A match should support discovery, not automatically disclose contact details, imply availability or assign work.",
      uk: "Допомагає експертам оцінювати релевантні консультаційні запити й вирішувати, чи відповідати. Збіг полегшує пошук, але не розкриває контактні дані, не підтверджує доступність і не призначає роботу автоматично.",
    },
    role: {
      en: "Set areas of interest and availability, choose whether to respond, then define a scope directly.",
      uk: "Вкажіть напрями інтересу й доступність, вирішіть, чи відповідати, а потім окремо визначте обсяг робіт.",
    },
    questions: {
      en: {
        need: "Do experts need a shared request pipeline, or are existing introductions sufficient?",
        behavior:
          "Should a request disclose its budget and timeline before an expert opts in, and who decides a match is relevant?",
      },
      uk: {
        need: "Чи потрібен експертам спільний потік запитів, чи достатньо наявних знайомств і рекомендацій?",
        behavior:
          "Запит має показувати бюджет і строки до відгуку експерта, і хто визначає релевантність збігу?",
      },
    },
    stage: 1,
  },
] as const;

export function MemberCabinet({
  open,
  onClose,
  onFindExpert,
}: {
  open: boolean;
  onClose: () => void;
  onFindExpert: () => void;
}) {
  const { locale } = useI18n();
  const [composer, setComposer] = useState<Composer>(null);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(0);
  const [serviceFrameOpen, setServiceFrameOpen] = useState(false);
  const [dependenciesOpen, setDependenciesOpen] = useState(false);
  const serviceDeckRef = useRef<HTMLDivElement>(null);
  const copy =
    locale === "en"
      ? {
        eyebrow: "Member cabinet · demo profile",
        title: "Operations and network services",
        member: "Verified member",
        directory: "Expert directory",
        projects: "Active projects",
        stage: "Circle",
        circlesIntro:
          "The circles separate consulting, the application MVP, functionality needed for the pilot, and all remaining functionality.",
        purpose: "What it provides",
        role: "Your participation",
        explore: "Suggest an addition or change",
        requestNote: "This opens a local request draft; it does not change a live service.",
        fullProposal: "Open proposal: scope & indicative prices",
        actions: ["Create project task", "Invite to network", "Send targeted alert"],
        sent: "Demo message recorded in this browser.",
        close: "Close cabinet",
      }
      : {
        eyebrow: "Кабінет учасника · демо-профіль",
        title: "Операції та сервіси мережі",
        member: "Верифікований учасник",
        directory: "Реєстр експертів",
        projects: "Активні проєкти",
        stage: "Коло",
        circlesIntro:
          "Кола розділяють консалтинг, MVP застосунку, функціональність для пілота та всі інші функції.",
        purpose: "Що надає",
        role: "Ваша участь",
        explore: "Запропонувати додавання або зміну",
        requestNote: "Відкриває локальну чернетку запиту, а не змінює активний сервіс.",
        fullProposal: "Відкрити пропозицію: обсяг і ціни",
        actions: ["Створити проєктну задачу", "Запросити до мережі", "Надіслати цільовий alert"],
        sent: "Демо-повідомлення збережено в цьому браузері.",
        close: "Закрити кабінет",
      };
  const language = locale === "uk" ? "uk" : "en";
  const service = SERVICES[active] ?? SERVICES[0];
  const stages = useMemo(
    () =>
      locale === "en"
        ? ["Consulting", "Application MVP", "Pilot functionality", "All remaining functionality"]
        : ["Консалтинг", "MVP застосунку", "Функції пілота", "Усі інші функції"],
    [locale],
  );
  useEffect(() => {
    serviceDeckRef.current
      ?.querySelector<HTMLElement>(`[data-service-index="${active}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);
  if (!open) return null;
  return (
    <aside className="fixed bottom-0 right-0 z-50 w-full overflow-y-auto overscroll-contain border-l border-border bg-panel/90 pb-24 backdrop-blur-2xl max-h-[50svh] sm:bottom-0 sm:inset-y-0 sm:top-16 sm:max-h-none sm:w-1/2 sm:max-w-[480px]">
      <header className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border bg-panel/90 p-5 backdrop-blur-xl">
        <div className="min-w-0">
          <p className="tech-label text-primary">{copy.eyebrow}</p>
          <h2 className="mt-1 truncate font-display text-2xl sm:text-3xl">{copy.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Alex Morgan · {copy.member}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={copy.close}
          title={copy.close}
        >
          <X />
        </Button>
      </header>

      <div className="space-y-7 p-4 sm:p-5">




        <section>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <div className="min-w-0">
              <p className="tech-label text-primary">
                Service deck · {active + 1}/{SERVICES.length}
              </p>
              <h3 className="mt-1 font-display text-2xl">Customisable network services</h3>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setActive((active - 1 + SERVICES.length) % SERVICES.length)}
                aria-label="Previous"
              >
                ←
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setActive((active + 1) % SERVICES.length)}
                aria-label="Next"
              >
                →
              </Button>
            </div>
          </div>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {copy.circlesIntro}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            aria-expanded={dependenciesOpen}
            onClick={() => setDependenciesOpen((open) => !open)}
          >
            <GitBranch aria-hidden="true" />
            {dependenciesOpen
              ? locale === "en"
                ? "Hide function dependencies"
                : "Сховати залежності функцій"
              : locale === "en"
                ? "Show function dependencies"
                : "Показати залежності функцій"}
          </Button>
          {dependenciesOpen ? (
            <ServiceDependencyMap locale={locale} />
          ) : (
            <>
              <div ref={serviceDeckRef} className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3">
                {SERVICES.map((item, i) => (
                  <button
                    key={item.title.en}
                    data-service-index={i}
                    onClick={() => setActive(i)}
                    className={`min-h-32 w-48 shrink-0 snap-start rounded border p-4 text-left transition-colors ${i === active ? "border-primary bg-primary/10" : "border-border bg-card/65 hover:border-brass/60"}`}
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="mt-5 text-sm font-semibold">{item.title[language]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy.stage} {item.stage}
                    </p>
                  </button>
                ))}
              </div>
              <article
                key={service.title.en}
                className="service-deck-content blueprint-corners rounded border border-border bg-card/70 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="tech-label text-brass">{stages[service.stage - 1]}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl">{service.title[language]}</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="tech-label text-muted-foreground">{copy.purpose}</dt>
                    <dd className="mt-1 leading-relaxed">{service.purpose[language]}</dd>
                  </div>
                  <div>
                    <dt className="tech-label text-muted-foreground">{copy.role}</dt>
                    <dd className="mt-1 leading-relaxed">{service.role[language]}</dd>
                  </div>
                </dl>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => setServiceFrameOpen(true)}
                >
                  {copy.explore}
                  <ChevronRight aria-hidden="true" />
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  {copy.requestNote}
                </p>
                <Button
                  asChild
                  className="mt-4 min-h-12 w-full justify-between whitespace-normal text-left"
                >
                  <Link to="/proposal">
                    {copy.fullProposal}
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              </article>
            </>
          )}
        </section>

      </div>
      {composer && (
        <ComposerModal
          kind={composer}
          sent={sent}
          onSent={() => setSent(true)}
          onClose={() => setComposer(null)}
          onFindExpert={() => {
            setComposer(null);
            onFindExpert();
          }}
          message={copy.sent}
        />
      )}
      {serviceFrameOpen && (
        <ServiceConfigurationFrame
          serviceTitle={service.title[language]}
          purpose={service.purpose[language]}
          role={service.role[language]}
          questions={service.questions[language]}
          locale={locale}
          onClose={() => setServiceFrameOpen(false)}
        />
      )}
    </aside>
  );
}

function ServiceDependencyMap({ locale }: { locale: string }) {
  const [selectedId, setSelectedId] = useState("search");
  const nodePickerRef = useRef<HTMLDetailsElement>(null);
  const language = locale === "uk" ? "uk" : "en";
  const selectNode = (id: string) => {
    setSelectedId(id);
    if (nodePickerRef.current) nodePickerRef.current.open = false;
  };
  const selectedFunction = PROPOSAL_FUNCTIONS.find((item) => item.id === selectedId);
  const selectedSession = CO_DESIGN_SESSIONS.find((item) => item.id === selectedId);
  const nodes = useMemo<PartnerGraphNode[]>(() => {
    const functionNodes = PROPOSAL_FUNCTIONS.map((item) => ({
      id: item.id,
      label: item.title[language],
      kind: item.group,
    }));
    const sessionNodes = CO_DESIGN_SESSIONS.map((item) => ({
      id: item.id,
      label: item.title[language],
      kind: "consultation" as const,
    }));
    return [...functionNodes, ...sessionNodes];
  }, [language]);
  const links = useMemo<PartnerGraphLink[]>(() => {
    const nodeIds = new Set([
      ...PROPOSAL_FUNCTIONS.map((item) => item.id),
      ...CO_DESIGN_SESSIONS.map((item) => item.id),
    ]);
    return PROPOSAL_FUNCTIONS.flatMap((item) =>
      item.dependencies.map((dependency) => {
        if (!nodeIds.has(dependency)) {
          throw new Error(`Function ${item.id} depends on missing node ${dependency}`);
        }
        return { source: dependency, target: item.id };
      }),
    );
  }, []);
  const dependencies =
    selectedFunction?.dependencies.map((id) => {
      const item = PROPOSAL_FUNCTIONS.find((feature) => feature.id === id);
      if (item) return { id: item.id, title: item.title[language] };
      const session = CO_DESIGN_SESSIONS.find((feature) => feature.id === id);
      if (session) return { id: session.id, title: session.title[language] };
      throw new Error(`Function ${selectedFunction.id} depends on missing node ${id}`);
    }) ?? [];

  return (
    <div
      className="partner-graph-layout mt-4"
      role="region"
      aria-label={language === "en" ? "Service dependency graph" : "Граф залежностей сервісів"}
    >
      <article className="partner-card partner-graph-card">
        <p className="partner-kicker">
          {language === "en" ? "Function dependencies" : "Залежності функцій"}
        </p>
        <h3>
          {language === "en"
            ? "Select a node to inspect its prerequisites"
            : "Оберіть вузол, щоб переглянути його передумови"}
        </h3>
        <details ref={nodePickerRef} className="partner-node-picker">
          <summary>
            {language === "en" ? "Browse nodes · " : "Перелік вузлів · "}
            {selectedFunction?.title[language] ?? selectedSession?.title[language]}
          </summary>
          <div
            className="partner-function-accessible-list"
            role="group"
            aria-label={language === "en" ? "Select a graph node" : "Оберіть вузол графа"}
          >
            <h4>{language === "en" ? "Functions" : "Функції"}</h4>
            {PROPOSAL_FUNCTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selectedId === item.id}
                onClick={() => selectNode(item.id)}
              >
                {item.title[language]}
              </button>
            ))}
            <h4>{language === "en" ? "Co-design sessions" : "Сесії спільного проєктування"}</h4>
            {CO_DESIGN_SESSIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selectedId === item.id}
                onClick={() => selectNode(item.id)}
              >
                {item.title[language]}
              </button>
            ))}
          </div>
        </details>
        <Suspense
          fallback={
            <p className="partner-graph-fallback" role="status">
              {language === "en" ? "Loading dependency graph…" : "Завантаження графа залежностей…"}
            </p>
          }
        >
          <PartnerGraph
            nodes={nodes}
            links={links}
            selectedId={selectedId}
            onSelect={(node) => selectNode(node.id)}
            height={360}
          />
        </Suspense>
        <p className="partner-graph-caption">
          {language === "en"
            ? "Arrows point from a prerequisite—including a co-design session—to the function that depends on it."
            : "Стрілки спрямовані від передумови, зокрема сесії спільного проєктування, до залежної від неї функції."}
        </p>
      </article>
      <aside className="partner-card" aria-live="polite">
        <p className="partner-kicker">
          {selectedFunction
            ? selectedFunction.group.toUpperCase()
            : language === "en"
              ? "CO-DESIGN SESSION"
              : "СЕСІЯ СПІЛЬНОГО ПРОЄКТУВАННЯ"}
        </p>
        <h3>{selectedFunction?.title[language] ?? selectedSession?.title[language]}</h3>
        <p className="partner-muted">
          {selectedFunction
            ? selectedFunction.purpose[language]
            : language === "en"
              ? "A co-design activity that supplies decisions to the functions shown in the graph; it is not an application feature."
              : "Сесія спільного проєктування, що забезпечує рішеннями функції на графі; це не функція застосунку."}
        </p>
        <h4>{language === "en" ? "Requires" : "Потребує"}</h4>
        {dependencies.length ? (
          <ul className="partner-bullet-list">
            {dependencies.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        ) : (
          <p className="partner-muted">
            {selectedFunction
              ? language === "en"
                ? "No prerequisite is listed."
                : "Передумов не зазначено."
              : language === "en"
                ? "No upstream dependency is recorded for this session."
                : "Для цієї сесії не зазначено попередніх залежностей."}
          </p>
        )}
      </aside>
    </div>
  );
}

function ServiceConfigurationFrame({
  serviceTitle,
  purpose,
  role,
  questions,
  locale,
  onClose,
}: {
  serviceTitle: string;
  purpose: string;
  role: string;
  questions: { need: string; behavior: string };
  locale: string;
  onClose: () => void;
}) {
  const uk = locale !== "en";
  const [values, setValues] = useState<ServiceFrameValues>({
    requestType: "change",
    needDecision: "unsure",
    userRole: "",
    need: "",
    behavior: "",
    outcome: "",
    dataIntegration: "",
    acceptance: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const headingId = "service-configuration-title";

  useEffect(() => {
    formRef.current?.scrollTo({ top: 0 });
  }, [serviceTitle]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SERVICE_DRAFTS_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Saved service drafts have an invalid format.");
      }
      const serviceDraft = (parsed as Record<string, unknown>)[serviceTitle];
      if (!serviceDraft || typeof serviceDraft !== "object" || Array.isArray(serviceDraft)) return;
      const restored = serviceDraft as Record<string, unknown>;
      const restoredFields: Partial<Record<ServiceFrameField, string>> = Object.fromEntries(
        SERVICE_FRAME_FIELDS.flatMap(({ id }) =>
          typeof restored[id] === "string" ? [[id, restored[id]]] : [],
        ),
      );
      setValues((current) => ({
        ...current,
        ...restoredFields,
        requestType: restored["requestType"] === "add" ? "add" : "change",
        needDecision:
          restored["needDecision"] === "needed" ||
            restored["needDecision"] === "not-needed" ||
            restored["needDecision"] === "unsure"
            ? (restored["needDecision"] as "needed" | "not-needed" | "unsure")
            : "unsure",
      }));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : uk
            ? "Не вдалося прочитати локальну чернетку."
            : "Could not read the local draft.",
      );
    }
  }, [serviceTitle, uk]);

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const stored = window.localStorage.getItem(SERVICE_DRAFTS_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : {};
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Saved service drafts have an invalid format.");
      }
      window.localStorage.setItem(
        SERVICE_DRAFTS_KEY,
        JSON.stringify({
          ...parsed,
          [serviceTitle]: {
            ...values,
            savedAt: new Date().toISOString(),
            status: "Local draft — not submitted or approved",
          },
        }),
      );
      setMessage(
        uk
          ? "Чернетку конфігурації збережено лише в цьому браузері. Її не надіслано й не погоджено."
          : "Configuration draft saved in this browser only. It has not been submitted or approved.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : uk
            ? "Не вдалося зберегти локальну чернетку."
            : "Could not save the local draft.",
      );
    }
  };

  return createPortal(
    <div
      className="service-request-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        ref={formRef}
        role="dialog"
        aria-labelledby={headingId}
        aria-modal="true"
        className="service-request-dialog blueprint-corners rounded border border-primary/50 bg-panel p-5 shadow-2xl sm:p-7"
        onSubmit={save}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="tech-label text-primary">
              {uk ? "Сервіси мережі · запит на зміну" : "Network services · change request"}
            </p>
            <h2 id={headingId} className="mt-1 text-pretty font-display text-2xl sm:text-3xl">
              {serviceTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{purpose}</p>
            <p className="mt-2 text-xs text-muted-foreground">{role}</p>
            <p className="mt-4 rounded border border-primary/25 bg-primary/5 p-3 text-sm leading-relaxed">
              {uk
                ? "Це запит на додавання або зміну — не налаштування активного сервісу. Опишіть потребу й оберіть бажану поведінку; команда окремо вирішить, чи включати це до розробки."
                : "This is a request to add or change a service—not a live configuration. Describe the need and preferred behavior; the team will decide separately whether it enters development."}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={uk ? "Закрити фрейм" : "Close frame"}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <fieldset className="space-y-2 sm:col-span-2">
            <legend className="tech-label text-muted-foreground">
              {uk ? "Що ви пропонуєте?" : "What are you proposing?"}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["add", uk ? "Додати новий сервіс" : "Add a new service"],
                  ["change", uk ? "Змінити цей сервіс" : "Change this service"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded border border-border bg-card/50 px-3 py-2 text-sm focus-within:border-primary"
                >
                  <input
                    type="radio"
                    name="service-request-type"
                    value={value}
                    checked={values.requestType === value}
                    onChange={() => setValues((current) => ({ ...current, requestType: value }))}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2 sm:col-span-2">
            <legend className="tech-label text-muted-foreground">
              {uk ? "Чи потрібна ця функція?" : "Do you need this capability?"}
            </legend>
            <p className="text-sm leading-relaxed text-muted-foreground">{questions.need}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["needed", uk ? "Так, потрібна" : "Yes, needed"],
                  ["not-needed", uk ? "Ні, не потрібна" : "No, not needed"],
                  ["unsure", uk ? "Поки не впевнений" : "Not sure yet"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded border border-border bg-card/50 px-3 py-2 text-sm focus-within:border-primary"
                >
                  <input
                    type="radio"
                    name="service-need-decision"
                    value={value}
                    checked={values.needDecision === value}
                    onChange={() => setValues((current) => ({ ...current, needDecision: value }))}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="rounded border border-brass/25 bg-brass/5 p-3 text-sm leading-relaxed sm:col-span-2">
            <p className="tech-label text-brass">
              {uk ? "Питання для вибору поведінки" : "Decide how it should work"}
            </p>
            <p className="mt-2 text-muted-foreground">{questions.behavior}</p>
          </div>
          {SERVICE_FRAME_FIELDS.map((field) => (
            <label key={field.id} className="space-y-1.5 sm:col-span-2">
              <span className="tech-label text-muted-foreground">{uk ? field.uk : field.en}</span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                {uk ? field.helpUk : field.helpEn}
              </span>
              {field.rows === 1 ? (
                <input
                  name={`service-${field.id}`}
                  autoComplete="off"
                  className="field"
                  value={values[field.id]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.id]: event.target.value }))
                  }
                />
              ) : (
                <textarea
                  name={`service-${field.id}`}
                  autoComplete="off"
                  className="field"
                  rows={field.rows}
                  value={values[field.id]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.id]: event.target.value }))
                  }
                />
              )}
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p
            className="mt-4 rounded border border-success/40 bg-success/10 p-3 text-sm text-success"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {uk ? "Закрити" : "Close"}
          </Button>
          <Button type="submit">{uk ? "Зберегти локальну чернетку" : "Save local draft"}</Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

function ComposerModal({
  kind,
  sent,
  onSent,
  onClose,
  onFindExpert,
  message,
}: {
  kind: Exclude<Composer, null>;
  sent: boolean;
  onSent: () => void;
  onClose: () => void;
  onFindExpert: () => void;
  message: string;
}) {
  const title =
    kind === "task" ? "Project task" : kind === "invite" ? "Network invitation" : "Targeted alert";
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-background/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSent();
        }}
        onClick={(e) => e.stopPropagation()}
        className="blueprint-corners w-full max-w-lg rounded border border-primary/50 bg-panel p-5 shadow-2xl"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div>
            <p className="tech-label text-primary">Demo composer</p>
            <h3 className="mt-1 font-display text-2xl">{title}</h3>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X />
          </Button>
        </div>
        {sent ? (
          <p className="mt-6 rounded border border-success/40 bg-success/10 p-4 text-success">
            {message}
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            <input
              required
              placeholder={kind === "alert" ? "Expert group or geography" : "Recipient or project"}
              className="field"
            />
            <textarea
              required
              rows={5}
              defaultValue={
                kind === "task"
                  ? "We invite you to review the project brief and confirm your availability, role and proposed next step."
                  : kind === "invite"
                    ? "You are invited to join the verified ISRM Ukraine expert network. Please review the trust and privacy protocol."
                    : "Priority request: please confirm relevant experience and availability for a rapid expert response."
              }
              className="field"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline">
                <Mail />
                Email
              </Button>
              <Button type="button" variant="outline">
                <MessageSquareText />
                Signal
              </Button>
              <Button type="button" variant="ghost" onClick={onFindExpert}>
                <Users />
                Find expert on map
              </Button>
            </div>
            <Button className="w-full">
              <Send />
              Send demo
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
