import { PublicChapterFigure } from "./PublicChapterFigure";
import { BriefingSearchJourneyFigure } from "./BriefingSearchJourneyFigure";
import { BriefingStoryGraph } from "./BriefingStoryGraph";
import { BriefingDataFlowFigure } from "./BriefingDataFlowFigure";
import { BriefingConnectedGraph } from "./BriefingConnectedGraph";
import type { Expert } from "@/lib/types";
import type { ClientLocale } from "@/lib/client-catalog";
export function BriefingVisual({
  index,
  locale,
  experts = [],
  printMode = false,
  motionPaused = false,
}: {
  index: number;
  locale: ClientLocale;
  experts?: Expert[];
  printMode?: boolean;
  motionPaused?: boolean;
}) {
  if (index === 0) return <BriefingDataFlowFigure experts={experts} locale={locale} />;
  if (index === 1)
    return (
      <BriefingConnectedGraph
        experts={experts}
        locale={locale}
        scene="responsibility"
        printMode={printMode}
        motionPaused={motionPaused}
      />
    );
  if (index === 2) return <PublicChapterFigure locale={locale} />;
  if (index === 3) return <BriefingSearchJourneyFigure experts={experts} locale={locale} />;
  if (index === 4) return <BriefingStoryGraph index={5} locale={locale} />;
  return (
    <BriefingConnectedGraph
      experts={experts}
      locale={locale}
      scene={index === 5 ? "configuration" : index === 6 ? "integration" : "invitation"}
      printMode={printMode}
      motionPaused={motionPaused}
    />
  );
}
