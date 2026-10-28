import type { ClientDraft } from "./client-draft";
import basis from "./client-pricing-basis.json";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS, type ClientLocale } from "./client-catalog";
// Planning amounts, not supplier quotations or final contractual prices.
const indicative = (hours: number) =>
  Math.round(hours * basis.ukHourlyScenario * (1 + basis.overheadLow) * (1 - basis.targetDiscount));
export const CLIENT_APPROVED_PRICES: {
  currency: string;
  base: number | null;
  engagement: number | null;
  expertise: number | null;
  monitoring: number | null;
  graph: number | null;
  addons: Record<string, number | null>;
} = {
  currency: "GBP",
  base: indicative(basis.hours.core),
  engagement: indicative(basis.hours.engagement),
  expertise: indicative(basis.hours.expertise),
  monitoring: indicative(basis.hours.monitoring),
  graph: Math.round(indicative(basis.hours.core) * basis.fallbackShare),
  addons: {
    groups: null,
    contact: null,
    research: indicative(basis.hours.research),
    integration: null,
  },
};
export const indicativeUpper = (low: number) =>
  Math.round((low * (1 + basis.overheadHigh)) / (1 + basis.overheadLow));
export function indicativePriceLabel(
  low: number | null,
  locale: ClientLocale,
  high = low === null ? null : indicativeUpper(low),
) {
  if (low === null) return locale === "uk" ? "До оцінки" : "To estimate";
  const format = (value: number) =>
    new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
      style: "currency",
      currency: "GBP",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(value);
  return high === null || high === low ? format(low) : `${format(low)}–${format(high)}`;
}
export function clientPriceLines(
  d: ClientDraft,
  locale: ClientLocale,
  prices = CLIENT_APPROVED_PRICES,
) {
  const uk = locale === "uk";
  const lines: { id: string; title: string; value: number | null }[] = [
    {
      id: "base",
      title:
        d.mode === "graph"
          ? uk
            ? "Fallback · застосунок як є"
            : "Fallback · application as is"
          : uk
            ? "Базовий застосунок"
            : "Core application",
      value: d.mode === "research-only" ? null : d.mode === "graph" ? prices.graph : prices.base,
    },
  ];
  if (d.mode === "full") {
    for (const w of CLIENT_WORKFLOWS.filter((w) => d.workflowIds.includes(w.id)))
      lines.push({ id: w.id, title: w.title[locale], value: prices[w.id] });
    if (d.integrationInterest)
      lines.push({
        id: "integration",
        title: uk ? "Подальший розвиток та ШІ" : "Further development & AI",
        value: null,
      });
    if (d.customIncluded)
      for (const r of d.requests) lines.push({ id: r.id, title: r.title, value: null });
  }
  if (d.mode === "graph" && d.serviceIds.includes("research"))
    lines.push({
      id: "research",
      title: CLIENT_SERVICES.find((s) => s.id === "research")!.title[locale],
      value: prices.addons["research"] ?? null,
    });
  return lines;
}
export function clientQuoteRange(d: ClientDraft, prices = CLIENT_APPROVED_PRICES) {
  const values = clientPriceLines(d, "en", prices).map((line) => line.value);
  const low = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  return {
    low,
    high: values.reduce<number>(
      (sum, value) => sum + (value === null ? 0 : indicativeUpper(value)),
      0,
    ),
    pending: clientQuote(d, prices) === null,
  };
}
export function clientQuote(d: ClientDraft, prices = CLIENT_APPROVED_PRICES): number | null {
  const lines =
    d.mode === "graph"
      ? [
          prices.graph,
          ...d.serviceIds.filter((id) => id === "research").map((id) => prices.addons[id] ?? null),
        ]
      : d.mode === "research-only"
        ? [null]
        : [
            prices.base,
            ...d.workflowIds.map((id) => prices[id]),
            ...(d.integrationInterest ? [null] : []),
          ];
  if (d.mode === "full" && d.serviceIds.includes("survey") && !d.workflowIds.includes("engagement"))
    return null;
  if (d.mode === "full" && d.serviceIds.includes("publishing") && d.workflowIds.length === 0)
    return null;
  if (d.mode === "full" && d.customIncluded && d.requests.length) return null;
  if (lines.some((value) => value === null)) return null;
  return lines.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}
