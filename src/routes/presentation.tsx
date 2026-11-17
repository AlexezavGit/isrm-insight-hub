import { createFileRoute } from "@tanstack/react-router";
import { BriefingSlider } from "@/components/BriefingSlider";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Insight Hub · Expertise and professional networks" },
      {
        name: "description",
        content:
          "From research records to professional expertise, agreed interaction and a maintained working resource. Explore the demonstration.",
      },
    ],
  }),
  component: BriefingSlider,
});
