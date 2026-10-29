import { IntegrationStrip } from "./IntegrationStrip";
import { BriefingNextSteps } from "./BriefingNextSteps";
import {
  ArrowDown,
  Database,
  FileSearch,
  Handshake,
  Layers3,
  Network,
  ShieldCheck,
  Users,
  BookOpen,
} from "lucide-react";
import { WorkflowOrbit } from "./WorkflowOrbit";
import { ExpertisePyramid } from "./ClientValueFramework";
import type { BriefingSlide } from "@/lib/briefing-slides";
import type { ClientLocale } from "@/lib/client-catalog";

export function BriefingVisual({
  index,
  slide,
  locale,
  reducedMotion = false,
}: {
  index: number;
  slide: BriefingSlide;
  locale: ClientLocale;
  reducedMotion?: boolean;
}) {
  const uk = locale === "uk";
  if (index === 1)
    return (
      <figure className="briefing-visual briefing-chapter-dashboard">
        <header>
          <Network size={20} aria-hidden="true" />
          <strong>35</strong>
          <span>{uk ? "чаптерів · спільне поле взаємодії" : "chapters · a shared view"}</span>
        </header>
        <div className="briefing-review-contour">
          <div>
            <FileSearch size={28} />
            <strong>{uk ? "AI готує" : "AI prepares"}</strong>
            <small>{uk ? "Джерела та знахідки" : "Sources and findings"}</small>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <ShieldCheck size={28} />
            <strong>{uk ? "Фахівець перевіряє" : "A professional reviews"}</strong>
            <small>{uk ? "Ім’я, дата, висновок" : "Name, date, judgement"}</small>
          </div>
        </div>
        <div className="chapter-dashboard-fields">
          {[
            { Icon: Users, en: "Expertise", uk: "Експертиза" },
            { Icon: FileSearch, en: "Needs", uk: "Потреби" },
            { Icon: Handshake, en: "Introductions", uk: "Знайомства" },
          ].map(({ Icon, en, uk: ua }) => (
            <details key={en} className="chapter-field-folder">
              <summary>
                <Icon size={19} aria-hidden="true" />
                <span>{uk ? ua : en}</span>
              </summary>
              <p>
                {uk
                  ? {
                      Expertise: "Яку експертизу чаптер готовий запропонувати колегам?",
                      Needs: "Якої підтримки та інформації потребують члени?",
                      Introductions: "Хто може допомогти з доречним професійним знайомством?",
                    }[en]
                  : {
                      Expertise: "What expertise could the chapter share with colleagues?",
                      Needs: "What support and information do members need?",
                      Introductions: "Who could help with a relevant professional introduction?",
                    }[en]}
              </p>
            </details>
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
  if (index === 2)
    return (
      <div className="briefing-visual briefing-engagement">
        <WorkflowOrbit workflow="engagement" compact locale={locale} />
        <p className="briefing-visual-caption">
          {uk
            ? "Навчання · членство · партнерства · послуги · реферали · конференції"
            : "Learning · membership · partnerships · services · referrals · conferences"}
        </p>
      </div>
    );
  if (index === 3)
    return (
      <div className="briefing-visual">
        <ExpertisePyramid locale={locale} compact />
        <IntegrationStrip locale={locale} />
        <p className="briefing-visual-caption">
          {uk
            ? "Спільне ядро та окремо погоджені напрями розвитку"
            : "A shared foundation with separately agreed workstreams"}
        </p>
      </div>
    );
  if (index === 5) return <BriefingNextSteps locale={locale} reducedMotion={reducedMotion} />;
  return (
    <figure className="briefing-visual briefing-path briefing-path-0">
      <ol>
        {slide.steps.map((s, i) => {
          const Icon =
            index === 0
              ? [Users, FileSearch, Database, ShieldCheck][i]!
              : [FileSearch, BookOpen, Layers3][i]!;
          return (
            <li
              key={s.en}
              style={index === 0 ? { width: `${100 - i * 10}%`, marginInline: "auto" } : undefined}
            >
              <span className="briefing-path-icon">
                <Icon size={23} aria-hidden="true" />
              </span>
              <div>
                <small>0{i + 1}</small>
                <strong>{s[locale]}</strong>
              </div>
              {i < slide.steps.length - 1 && (
                <ArrowDown className="briefing-path-arrow" size={16} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <figcaption>
        {uk
          ? index === 0
            ? "AI прискорює дослідження. Фахівець перевіряє висновки."
            : "Можливий напрям · залежить від якості, прав на дані й довіри."
          : index === 0
            ? "AI accelerates research. A professional verifies conclusions."
            : "A possible direction · dependent on quality, data rights and trust."}
      </figcaption>
    </figure>
  );
}
