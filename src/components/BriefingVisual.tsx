import { BriefingSearchJourneyFigure } from "./BriefingSearchJourneyFigure";
import { PublicChapterFigure } from "./PublicChapterFigure";
import { BriefingSearchGraphFigure } from "./BriefingSearchGraphFigure";
import { BriefingStoryGraph } from "./BriefingStoryGraph";
import { BriefingDataFlowFigure } from "./BriefingDataFlowFigure";
import { BriefingWorkflowFigure } from "./BriefingWorkflowFigure";
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
  if (index === 0) return <BriefingDataFlowFigure experts={experts} locale={locale} />;
  if (index === 3) return <BriefingSearchJourneyFigure experts={experts} locale={locale} />;
  if (index === 7)
    return <BriefingSearchGraphFigure experts={experts} locale={locale} view="expertise" />;
  if (index === 5) return <BriefingWorkflowFigure locale={locale} />;
  if (index === 2) return <PublicChapterFigure locale={locale} />;
  if (index === 4) return <BriefingStoryGraph index={5} locale={locale} />;
  return <BriefingStoryGraph index={index} locale={locale} />;
}
