import {
  ArrowDown,
  CalendarDays,
  Database,
  FileSearch,
  Handshake,
  Layers3,
  Network,
  ShieldCheck,
  Users,
  BookOpen,
  Plug,
} from "lucide-react";
import { ExpertisePyramid } from "./ClientValueFramework";
import type { BriefingSlide } from "@/lib/briefing-slides";
import type { ClientLocale } from "@/lib/client-catalog";

export function BriefingVisual({
  index,
  slide,
  locale,
}: {
  index: number;
  slide: BriefingSlide;
  locale: ClientLocale;
}) {
  const uk = locale === "uk";
  if (index === 1)
    return (
      <figure
        className="briefing-visual briefing-review-cycle"
        aria-label={
          uk
            ? "Цикл відповідального професійного судження"
            : "The accountable professional judgement cycle"
        }
      >
        <div className="review-cycle-map">
          <svg viewBox="0 0 320 270" aria-hidden="true" fill="none">
            <defs>
              <marker
                id="review-arrow"
                markerWidth="7"
                markerHeight="7"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0 0 6 3 0 6" />
              </marker>
            </defs>
            <path
              d="M175 40Q275 45 277 119M278 151Q276 235 181 237M143 237Q44 233 43 151M43 118Q43 42 139 40"
              markerEnd="url(#review-arrow)"
            />
          </svg>
          <ol>
            {slide.steps.map((s, i) => {
              const Icon = [ShieldCheck, FileSearch, Database, Users][i]!;
              return (
                <li key={s.en} className={`review-cycle-node review-cycle-node-${i}`}>
                  <Icon size={21} aria-hidden="true" />
                  <strong>{s[locale]}</strong>
                </li>
              );
            })}
          </ol>
          <p className="review-cycle-centre">
            {uk ? "Відповідальність за судження" : "Own the judgement"}
          </p>
        </div>
        <figcaption>
          {uk
            ? "Професійна відповідальність задає питання, вимоги до доказів і повторний перегляд."
            : "Professional accountability frames the question, evidence requirements and the next review."}
        </figcaption>
      </figure>
    );
  if (index === 2)
    return (
      <figure className="briefing-visual briefing-chapter-dashboard">
        <header>
          <Network size={20} aria-hidden="true" />
          <strong>35</strong>
          <span>{uk ? "чаптерів · спільне поле взаємодії" : "chapters · a shared view"}</span>
        </header>
        <div className="chapter-dotmap" aria-hidden="true">
          {Array.from({ length: 35 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="chapter-dashboard-fields">
          {[
            { Icon: Users, en: "Expertise", uk: "Експертиза" },
            { Icon: FileSearch, en: "Needs", uk: "Потреби" },
            { Icon: Handshake, en: "Introductions", uk: "Знайомства" },
          ].map(({ Icon, en, uk: ua }) => (
            <div key={en}>
              <Icon size={19} aria-hidden="true" />
              <span>{uk ? ua : en}</span>
            </div>
          ))}
        </div>
        <div className="chapter-dashboard-outcomes">
          <span>
            {uk
              ? "Навчання · членство · партнерства · alumni"
              : "Learning · membership · partnerships · alumni"}
          </span>
          <span>
            {uk
              ? "Запити клієнтів · реферали · крос-селл · конференції"
              : "Client enquiries · referrals · cross-sell · conferences"}
          </span>
        </div>
        <figcaption>
          {uk
            ? "Концепція дашборда · наповнюється за результатами опитування, без вигаданих показників."
            : "Dashboard concept · populated through the questionnaire, with no invented activity metrics."}
        </figcaption>
      </figure>
    );
  if (index === 3)
    return (
      <div className="briefing-visual">
        <ExpertisePyramid locale={locale} compact />
        <p className="briefing-visual-caption">
          {uk
            ? "Ядро + два незалежні опційні workflow"
            : "One core + two independent optional workflows"}
        </p>
      </div>
    );
  if (index === 4)
    return (
      <figure className="briefing-visual briefing-hypothesis">
        <div className="hypothesis-pair">
          <div>
            <Users size={30} aria-hidden="true" />
            <strong>{slide.steps[0]![locale]}</strong>
          </div>
          <span aria-hidden="true">+</span>
          <div>
            <Layers3 size={30} aria-hidden="true" />
            <strong>{slide.steps[1]![locale]}</strong>
          </div>
        </div>
        <div className="hypothesis-result">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>{slide.steps[2]![locale]}</span>
        </div>
        <figcaption>
          {uk
            ? "Professional → professional · можливі підключення"
            : "Professional → professional · possible connections"}
        </figcaption>
        <div className="briefing-integrations">
          {[
            { Icon: Database, en: "CRM & data", uk: "CRM і дані" },
            { Icon: BookOpen, en: "Knowledge", uk: "Знання" },
            { Icon: CalendarDays, en: "Events", uk: "Події" },
            { Icon: Plug, en: "APIs", uk: "API" },
          ].map(({ Icon, en, uk: ua }) => (
            <div key={en}>
              <Icon aria-hidden="true" />
              <span>{uk ? ua : en}</span>
            </div>
          ))}
        </div>
      </figure>
    );
  if (index === 5)
    return (
      <figure
        className="briefing-visual briefing-next-graph"
        aria-label={uk ? "Послідовність наступних кроків" : "The next steps in sequence"}
      >
        <svg viewBox="0 0 420 90" fill="none" aria-hidden="true">
          <path d="M40 44H380" />
          <path d="m185 39 8 5-8 5m130-10 8 5-8 5" />
          {[40, 210, 380].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="44" r="22" />
              <text x={x} y="49" textAnchor="middle">
                0{i + 1}
              </text>
            </g>
          ))}
        </svg>
        <ol>
          {slide.steps.map((s) => (
            <li key={s.en}>
              <strong>{s[locale]}</strong>
            </li>
          ))}
        </ol>
        <p>
          {uk
            ? "Перегляд → вибір пріоритетів → предметна пропозиція"
            : "Explore → choose priorities → a concrete proposal"}
        </p>
      </figure>
    );
  return (
    <figure className="briefing-visual briefing-path briefing-path-0">
      <ol>
        {slide.steps.map((s, i) => {
          const Icon = [Users, FileSearch, ShieldCheck][i]!;
          return (
            <li key={s.en}>
              <span className="briefing-path-icon">
                <Icon size={23} aria-hidden="true" />
              </span>
              <div>
                <small>0{i + 1}</small>
                <strong>{s[locale]}</strong>
              </div>
              {i < 2 && <ArrowDown className="briefing-path-arrow" size={16} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <figcaption>
        {uk
          ? "Від охоплення — до рішення, яке варте інвестиції."
          : "From audience reach to a decision worth investing in."}
      </figcaption>
    </figure>
  );
}
