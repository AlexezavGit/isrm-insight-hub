import {
  ArrowDown,
  BookOpen,
  CalendarDays,
  Database,
  FileSearch,
  GraduationCap,
  Handshake,
  Layers3,
  Network,
  Plug,
  ShieldCheck,
  Users,
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
  const caption = uk ? "Логіка рішення" : "The solution at a glance";
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
      <figure className="briefing-visual briefing-horizon">
        <ol className="briefing-horizon-steps">
          {slide.steps.map((step, i) => (
            <li key={step.en}>
              <span>0{i + 1}</span>
              <strong>{step[locale]}</strong>
            </li>
          ))}
        </ol>
        <figcaption>
          {uk ? "Можливі інтеграції · визначаємо разом" : "Possible integrations · agreed together"}
        </figcaption>
        <div className="briefing-integrations">
          {[
            { Icon: Database, en: "CRM & data", uk: "CRM і дані" },
            { Icon: BookOpen, en: "Learning", uk: "Навчання" },
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
  if (index === 2)
    return (
      <figure className="briefing-visual briefing-engagement">
        <div className="briefing-chapter-seal">
          <Network aria-hidden="true" />
          <strong>35</strong>
          <span>
            {uk ? "чаптерів · починаємо з опитування" : "chapters · begin with the questionnaire"}
          </span>
        </div>
        <div className="briefing-opportunities">
          {[
            { Icon: GraduationCap, en: "Learning", uk: "Навчання" },
            { Icon: Users, en: "Membership", uk: "Членство" },
            {
              Icon: Handshake,
              en: "Partnerships · alumni resources",
              uk: "Партнерства · ресурси alumni",
            },
            {
              Icon: Layers3,
              en: "Cross-sell · expanded engagements",
              uk: "Крос-селл · розширення замовлень",
            },
            { Icon: Network, en: "Client enquiries · referrals", uk: "Запити клієнтів · реферали" },
            { Icon: CalendarDays, en: "Conference visitors", uk: "Відвідувачі конференцій" },
          ].map(({ Icon, en, uk: ua }) => (
            <div key={en}>
              <Icon size={18} aria-hidden="true" />
              <span>{uk ? ua : en}</span>
            </div>
          ))}
        </div>
        <figcaption>
          {uk
            ? "Взаємодія → можливості → нові потреби → наступний цикл"
            : "Interaction → opportunities → new needs → the next cycle"}
        </figcaption>
      </figure>
    );
  const Icons =
    index === 1
      ? [FileSearch, Database, Users, ShieldCheck]
      : index === 0
        ? [Users, FileSearch, ShieldCheck]
        : [Network, Layers3, Handshake];
  return (
    <figure className={`briefing-visual briefing-path briefing-path-${index}`} aria-label={caption}>
      <ol>
        {slide.steps.map((step, i) => {
          const Icon = Icons[i]!;
          return (
            <li key={step.en}>
              <span className="briefing-path-icon">
                <Icon size={23} aria-hidden="true" />
              </span>
              <div>
                <small>{String(i + 1).padStart(2, "0")}</small>
                <strong>{step[locale]}</strong>
              </div>
              {i < slide.steps.length - 1 && (
                <ArrowDown className="briefing-path-arrow" size={16} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <figcaption>
        {index === 1
          ? uk
            ? "Кожен етап додає контроль. Висновок залишається перевірюваним."
            : "Each step adds a control. The conclusion remains open to scrutiny."
          : index === 0
            ? uk
              ? "Від охоплення — до рішення, яке варте інвестиції."
              : "From audience reach to a decision worth investing in."
            : uk
              ? "Від знайомої вибірки — до вашого сценарію."
              : "From the supplied sample to your own use case."}
      </figcaption>
    </figure>
  );
}
