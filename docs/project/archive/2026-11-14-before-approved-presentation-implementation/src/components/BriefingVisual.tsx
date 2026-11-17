import { ServiceAudienceFigure } from "./BriefingEvidenceFigures";
import { BriefingSearchGraphFigure } from "./BriefingSearchGraphFigure";
import { BriefingStoryGraph } from "./BriefingStoryGraph";
import type { Expert } from "@/lib/types";
import type { ClientLocale } from "@/lib/client-catalog";

export function BriefingVisual({
  index,
  locale,
  experts = [],
}: {
  index: number;
  locale: ClientLocale;
  experts?: Expert[];
}) {
  if (index === 3)
    return <BriefingSearchGraphFigure experts={experts} locale={locale} view="expertise" />;
  if (index === 4) return <ServiceAudienceFigure locale={locale} />;
  return <BriefingStoryGraph index={index} locale={locale} />;
}
