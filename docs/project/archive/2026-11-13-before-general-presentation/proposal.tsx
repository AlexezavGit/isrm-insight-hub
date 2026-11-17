import { createFileRoute } from "@tanstack/react-router";
import { BriefingSlider } from "@/components/BriefingSlider";
export const Route = createFileRoute("/proposal")({
  head: () => ({
    meta: [
      { title: "ISRM · Executive briefing" },
      {
        name: "description",
        content:
          "A professional response to David Rubens: purposeful research, accountable human review and a reusable tool for different networks.",
      },
    ],
  }),
  component: BriefingSlider,
});
