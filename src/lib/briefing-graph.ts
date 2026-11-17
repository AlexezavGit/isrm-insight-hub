import type { Expert } from "./types";
import { buildNetwork } from "./network-model";
import { layoutNetwork, freeNetworkPositions } from "./network-layout";
import { hasRecordedContent } from "./dossier-content";
import type { ClientLocale } from "./client-catalog";

/** Identical projection and layout to the live graph's presentation sample links. */
export function briefingGraph(
  experts: Expert[],
  view: "expertise" | "sectors",
  locale: ClientLocale,
) {
  const model = buildNetwork(
    experts,
    {
      sector: view === "sectors",
      theme: false,
      hub: false,
      researchQueue: true,
      specialisation: view === "expertise",
    },
    locale,
    {},
    { includeHub: false, includeServiceCoverage: false },
  );
  const nodes = model.nodes.filter(
    (n) =>
      n.kind === "expert" ||
      (view === "sectors" ? n.kind === "sector" : n.id.startsWith("expertise:")),
  );
  const ids = new Set(nodes.map((n) => n.id));
  const links = model.links.filter(
    (e) => e.kind === "category" && ids.has(e.source) && ids.has(e.target),
  );
  const positions = layoutNetwork(model, "people", [], [], "", false);
  const free = freeNetworkPositions(
    nodes.map((n) => n.id),
    positions,
    "",
  );
  const counts = new Map<string, number>();
  for (const e of links) counts.set(e.target, (counts.get(e.target) ?? 0) + 1);
  // A real recorded category, without treating an absent field as an expertise.
  const category = nodes
    .filter((n) => n.kind !== "expert" && hasRecordedContent(n.label))
    .sort(
      (a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0) || a.id.localeCompare(b.id),
    )[0];
  const matched = new Set(links.filter((e) => e.target === category?.id).map((e) => e.source));
  return { nodes, links, positions, free, counts, category, matched };
}
