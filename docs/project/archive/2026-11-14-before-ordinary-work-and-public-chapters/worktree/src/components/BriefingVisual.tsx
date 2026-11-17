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
  if (index === 3 || index === 7)
    return <BriefingSearchGraphFigure experts={experts} locale={locale} view="expertise" />;
  if (index === 4) return <BriefingWorkflowFigure locale={locale} />;
  return <BriefingStoryGraph index={index} locale={locale} />;
}
