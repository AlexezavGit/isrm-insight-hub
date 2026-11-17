import { createFileRoute } from "@tanstack/react-router";
import { BriefingSlider } from "@/components/BriefingSlider";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "ISRM · Executive presentation" },
      {
        name: "description",
        content: "Research, professional review and potential uses of ISRM's supplied sample.",
      },
    ],
  }),
  component: BriefingSlider,
});
