import { createFileRoute, redirect } from "@tanstack/react-router";
import { NetworkWorkbench } from "@/components/NetworkWorkbench";

type IndexSearch = {
  view?: "map";
  panel?: "search";
  stage?: "configuration";
  preset?: string;
};

export const Route = createFileRoute("/")({
  beforeLoad: ({ search }) => {
    if (!search.view && !search.panel && !search.stage && !search.preset)
      throw redirect({ to: "/proposal" });
  },
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const stage = search["stage"] === "configuration" ? ("configuration" as const) : undefined;
    const panel = !stage && search["panel"] === "search" ? ("search" as const) : undefined;
    const rawPreset = search["preset"];
    const preset = typeof rawPreset === "string" ? rawPreset : undefined;
    const result: IndexSearch = {};
    if (search["view"] === "map") result.view = "map";
    if (stage) result.stage = stage;
    if (panel) result.panel = panel;
    if (preset !== undefined) result.preset = preset;
    return result;
  },
  head: () => ({
    meta: [
      { title: "ISRM Ukraine — Live Expert Network" },
      {
        name: "description",
        content:
          "A privacy-aware map of expertise, sectors and network services; TII methodology is under development and no score is calculated.",
      },
      { property: "og:title", content: "ISRM Ukraine — Live Expert Network" },
      {
        property: "og:description",
        content:
          "Explore the expert network, source data and operational services; Trust & Influence Index (TII) has no validated score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkWorkbench,
});
