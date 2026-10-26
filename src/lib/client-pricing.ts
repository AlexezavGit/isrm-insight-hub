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
  base: 26000,
  engagement: 10000,
  expertise: 12000,
  graph: 7500,
  addons: { groups: 2000, contact: 2500, research: 6000, integration: null },
};
export function clientQuote(d: ClientDraft, prices = CLIENT_APPROVED_PRICES): number | null {
  const lines =
    d.mode === "graph"
      ? [prices.graph, ...d.serviceIds.map((id) => prices.addons[id] ?? null)]
      : d.mode === "research-only"
        ? [null]
        : [prices.base, ...d.workflowIds.map((id) => prices[id])];
  if (d.mode === "full" && d.serviceIds.includes("publishing") && d.workflowIds.length === 0)
    return null;
  if (d.mode === "full" && d.customIncluded && d.requests.length) return null;
  if (lines.some((value) => value === null)) return null;
  return lines.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}
