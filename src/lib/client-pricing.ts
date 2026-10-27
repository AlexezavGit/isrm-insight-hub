import type { ClientDraft } from "./client-draft";
// Only owner-approved client amounts belong here. Pending items are not zero.
export const CLIENT_APPROVED_PRICES: {
  currency: string;
  base: number | null;
  engagement: number | null;
  expertise: number | null;
  graph: number | null;
  addons: Record<string, number | null>;
} = {
  currency: "GBP",
  base: 33600,
  engagement: null,
  expertise: null,
  graph: 10080,
  addons: { groups: null, contact: null, research: null, integration: null },
};
export function clientQuote(d: ClientDraft, prices = CLIENT_APPROVED_PRICES): number | null {
  const lines =
    d.mode === "graph"
      ? [
          prices.graph,
          ...d.serviceIds.filter((id) => id === "research").map((id) => prices.addons[id] ?? null),
        ]
      : d.mode === "research-only"
        ? [null]
        : [prices.base];
  if (d.mode === "full" && d.serviceIds.includes("survey") && !d.workflowIds.includes("engagement"))
    return null;
  if (d.mode === "full" && d.serviceIds.includes("publishing") && d.workflowIds.length === 0)
    return null;
  if (d.mode === "full" && d.customIncluded && d.requests.length) return null;
  if (lines.some((value) => value === null)) return null;
  return lines.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}
