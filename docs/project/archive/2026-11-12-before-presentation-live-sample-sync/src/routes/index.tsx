import { createFileRoute } from "@tanstack/react-router";
import { NetworkWorkspace } from "@/components/NetworkWorkspace";
import { CLIENT_SERVICES } from "@/lib/client-catalog";

type IndexSearch = {
  view?: "map";
  panel?: "search" | "shortlist";
  stage?: "configuration";
  preset?: string;
  anchor?: string;
  capability?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const stage = search["stage"] === "configuration" ? ("configuration" as const) : undefined;
    const panel =
      !stage && ["search", "shortlist"].includes(String(search["panel"]))
        ? (search["panel"] as "search" | "shortlist")
        : undefined;
    const rawPreset = search["preset"];
    const preset = typeof rawPreset === "string" ? rawPreset : undefined;
    const result: IndexSearch = {};
    if (search["view"] === "map") result.view = "map";
    if (stage) result.stage = stage;
    if (panel) result.panel = panel;
    if (preset !== undefined) result.preset = preset;
    if (
      typeof search["capability"] === "string" &&
      CLIENT_SERVICES.some((s) => s.id === search["capability"])
    )
      result.capability = search["capability"];
    if (typeof search["anchor"] === "string" && search["anchor"].length <= 200)
      result.anchor = search["anchor"];
    return result;
  },
  head: () => ({
    meta: [
      { title: "ISRM Insight Hub — Network workspace" },
      {
        name: "description",
        content:
          "A privacy-aware map of expertise, sectors and network services; TII methodology is under development and no score is calculated.",
      },
      { property: "og:title", content: "ISRM Insight Hub — Network workspace" },
      {
        property: "og:description",
        content:
          "Explore the expert network, source data and operational services; Trust & Influence Index (TII) has no validated score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkWorkspace,
});
