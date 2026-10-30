import { BriefingNextSteps } from "./BriefingNextSteps";
import {
  ExpertiseMapFigure,
  ServiceAudienceFigure,
  ChapterCollaborationFigure,
  ParticipationCycleFigure,
} from "./BriefingEvidenceFigures";
import {
  ArrowDown,
  Database,
  FileSearch,
  Layers3,
  ShieldCheck,
  Users,
  BookOpen,
} from "lucide-react";
import type { Expert } from "@/lib/types";
import type { BriefingSlide } from "@/lib/briefing-slides";
import type { ClientLocale } from "@/lib/client-catalog";

export function BriefingVisual({
  index,
  slide,
  locale,
  reducedMotion = false,
  experts = [],
}: {
  index: number;
  slide: BriefingSlide;
  locale: ClientLocale;
  reducedMotion?: boolean;
  experts?: Expert[];
}) {
  const uk = locale === "uk";
  if (index === 1) return <ExpertiseMapFigure experts={experts} locale={locale} />;
  if (index === 2) return <ServiceAudienceFigure locale={locale} />;
  if (index === 3) return <ChapterCollaborationFigure locale={locale} />;
  if (index === 4) return <ParticipationCycleFigure locale={locale} />;
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
