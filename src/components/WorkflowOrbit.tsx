import type { CSSProperties } from "react";
import {
  BookOpen,
  FileCheck2,
  FileSearch,
  GraduationCap,
  Handshake,
  Network,
  RefreshCw,
  Users,
} from "lucide-react";
import type { ClientLocale, WorkflowId } from "@/lib/client-catalog";
const cycles = {
  engagement: [
    {
      Icon: Users,
      en: "Audience & needs",
      uk: "Аудиторії та потреби",
      noteEn: "Chapters, followers and professional communities",
      noteUk: "Чаптери, фоловери та професійні спільноти",
    },
    {
      Icon: Network,
      en: "Useful interaction",
      uk: "Корисна взаємодія",
      noteEn: "Discussions, research and shared interests",
      noteUk: "Обговорення, дослідження та спільні інтереси",
    },
    {
      Icon: FileSearch,
      en: "Relevant opportunities",
      uk: "Релевантні можливості",
      noteEn: "Match the need with the next useful step",
      noteUk: "Зіставити потребу з корисним наступним кроком",
    },
    {
      Icon: Handshake,
      en: "Participation & conversion",
      uk: "Участь і конверсія",
      noteEn: "Membership, learning, services and partnerships",
      noteUk: "Членство, навчання, послуги й партнерства",
    },
    {
      Icon: RefreshCw,
      en: "Learn & reconnect",
      uk: "Досвід і повернення",
      noteEn: "New needs shape the next cycle",
      noteUk: "Нові потреби формують наступний цикл",
    },
  ],
  expertise: [
    {
      Icon: Users,
      en: "Experience & inputs",
      uk: "Досвід і матеріали",
      noteEn: "Cases, questions and professional practice",
      noteUk: "Кейси, питання та професійна практика",
    },
    {
      Icon: FileCheck2,
      en: "Evidence & review",
      uk: "Докази й перевірка",
      noteEn: "Sources, attribution and professional judgement",
      noteUk: "Джерела, авторство й професійне судження",
    },
    {
      Icon: Network,
      en: "Knowledge synthesis",
      uk: "Синтез знань",
      noteEn: "Connect expertise and useful technologies",
      noteUk: "Поєднати експертизу й корисні технології",
    },
    {
      Icon: BookOpen,
      en: "Products & application",
      uk: "Продукти й застосування",
      noteEn: "For members and agreed external audiences",
      noteUk: "Для членів та погоджених зовнішніх аудиторій",
    },
    {
      Icon: RefreshCw,
      en: "Learning from use",
      uk: "Досвід застосування",
      noteEn: "Useful results renew the shared knowledge",
      noteUk: "Корисні результати оновлюють спільні знання",
    },
  ],
  monitoring: [
    {
      Icon: FileSearch,
      en: "Signals & sources",
      uk: "Сигнали й джерела",
      noteEn: "Agreed topics and regions",
      noteUk: "Погоджені теми й регіони",
    },
    {
      Icon: Users,
      en: "Relevant expertise",
      uk: "Доречна експертиза",
      noteEn: "Colleagues and local context",
      noteUk: "Колеги й місцевий контекст",
    },
    {
      Icon: FileCheck2,
      en: "Professional review",
      uk: "Професійна перевірка",
      noteEn: "Evidence before conclusions",
      noteUk: "Докази перед висновками",
    },
    {
      Icon: BookOpen,
      en: "Reviewed briefing",
      uk: "Перевірений брифінг",
      noteEn: "Agreed audience and usage rights",
      noteUk: "Погоджена аудиторія й права",
    },
    {
      Icon: RefreshCw,
      en: "Revisit & learn",
      uk: "Уточнити й засвоїти",
      noteEn: "Correct the assessment as events develop",
      noteUk: "Уточнити оцінку за розвитком подій",
    },
  ],
};
export function WorkflowOrbit({
  workflow,
  locale,
  compact = false,
}: {
  workflow: WorkflowId;
  locale: ClientLocale;
  compact?: boolean;
}) {
  const uk = locale === "uk",
    steps = cycles[workflow];
  return (
    <figure
      className={`scope-workflow-orbit ${compact ? "is-compact" : ""}`}
      aria-label={uk ? "Постійний цикл із поверненням досвіду" : "A continuing cycle with feedback"}
    >
      <div className="workflow-orbit-map">
        <svg viewBox="0 0 600 430" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path
            className="orbit-cycle-track"
            d="M310 45C430 40 545 120 522 225S400 400 300 397 60 335 70 225 157 56 275 45"
          />
          <path
            className="orbit-cycle-sweep"
            pathLength="100"
            d="M310 45C430 40 545 120 522 225S400 400 300 397 60 335 70 225 157 56 275 45"
          />
          <path
            className="orbit-inner-links"
            d="M300 210 300 45M300 210 525 195M300 210 445 365M300 210 145 365M300 210 70 195"
          />
          <path d="m275 40 10 5-10 5" />
        </svg>
        <div className="workflow-orbit-hub">
          <Network size={24} aria-hidden="true" />
          <span>
            {workflow === "engagement"
              ? uk
                ? "Потреби → можливості"
                : "Needs → opportunities"
              : uk
                ? "Експертиза → цінність"
                : "Expertise → value"}
          </span>
        </div>
        <ol>
          {steps.map(({ Icon, en, uk: ua, noteEn, noteUk }, i) => (
            <li
              key={en}
              style={{ "--orbit-index": i } as CSSProperties}
              className={`workflow-orbit-node orbit-node-${i}`}
            >
              <span className="orbit-node-number">0{i + 1}</span>
              <Icon size={22} aria-hidden="true" />
              <strong>{uk ? ua : en}</strong>
              {!compact && <small>{uk ? noteUk : noteEn}</small>}
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        {workflow === "engagement"
          ? uk
            ? "Кожна взаємодія уточнює потреби й відкриває доречний наступний крок. Конверсію вимірюємо, а не гарантуємо."
            : "Each interaction clarifies needs and opens a relevant next step. Conversion is measured, not guaranteed."
          : uk
            ? "Досвід може зміцнювати репутацію, а репутація — довіру. Зближення експертизи й технологій тут є напрямом для перевірки на практиці."
            : "Experience can strengthen reputation, and reputation can strengthen trust. Bringing expertise and technology together is a direction to test in practice."}
      </figcaption>
    </figure>
  );
}
