import type { Expert } from "./types";
import type { NetworkNode } from "./network-model";

/** One deliberate unfold, a small overshoot, then a handover to the live simulation. */
export function expansionProgress(elapsed: number, delay = 0) {
  const t = Math.max(0, Math.min(1, (elapsed - delay) / 2800));
  if (t === 0 || t === 1) return t;
  if (t < 0.74) return 1.045 * (1 - Math.pow(1 - t / 0.74, 3));
  const settle = (t - 0.74) / 0.26;
  return 1 + 0.045 * (1 - settle) ** 2;
}

export function briefingApproach(elapsed: number) {
  const t = Math.max(0, Math.min(1, elapsed / 4000));
  const progress = 1 - (1 - t) ** 2;
  return { scale: 1 + 3.8 * (1 - progress), progress };
}

export function directNeighbours(
  links: readonly { source: string; target: string }[],
  id: string | null,
) {
  const result = new Set<string>();
  if (!id) return result;
  result.add(id);
  for (const edge of links) {
    if (edge.source === id) result.add(edge.target);
    if (edge.target === id) result.add(edge.source);
  }
  return result;
}

const categories = [
  {
    id: "workflows",
    en: "Workflows",
    uk: "Workflow",
    match: (n: NetworkNode) => n.kind === "workflow",
  },
  {
    id: "services",
    en: "Services",
    uk: "Сервіси",
    match: (n: NetworkNode) => n.kind === "service",
  },
  {
    id: "expertise",
    en: "Expertise",
    uk: "Експертиза",
    match: (n: NetworkNode) => n.id.startsWith("expertise:") || n.id.startsWith("theme:"),
  },
  { id: "sectors", en: "Sectors", uk: "Сектори", match: (n: NetworkNode) => n.kind === "sector" },
  {
    id: "countries",
    en: "Countries",
    uk: "Країни",
    match: (n: NetworkNode) => n.id.startsWith("country:"),
  },
  {
    id: "organisations",
    en: "Organisations",
    uk: "Організації",
    match: (n: NetworkNode) => n.kind === "organisation",
  },
  {
    id: "roles",
    en: "Roles & recorded status",
    uk: "Ролі та статус записів",
    match: (n: NetworkNode) => n.id.startsWith("role:") || n.id.startsWith("record-status:"),
  },
];

export function concentratorGroups(nodes: readonly NetworkNode[]) {
  return categories
    .map(({ match, ...group }) => ({
      ...group,
      nodes: nodes.filter(match).sort((a, b) => a.label.localeCompare(b.label, "en-GB")),
    }))
    .filter((group) => group.nodes.length);
}

/** Retain actual recorded groupings even when a slide's preferred field is absent. */
export function briefingGroups(experts: Expert[], slide: number): [string, Expert[]][] {
  const field =
    (
      [
        "sector",
        "ukraineCategory",
        "communityRole",
        "sector",
        "communityRole",
        "ukraineCategory",
      ] as const
    )[slide] ?? "sector";
  const groupBy = (key: "sector" | "ukraineCategory" | "communityRole") => {
    const map = new Map<string, Expert[]>();
    for (const expert of experts) {
      const value = expert[key];
      if (
        !value ||
        [
          "Unclassified",
          "Не оцінено",
          "Not assessed",
          "Unknown",
          "Ukraine-related experience",
          "Member / participant",
        ].includes(value)
      )
        continue;
      map.set(value, [...(map.get(value) ?? []), expert]);
    }
    return map;
  };
  const preferred = groupBy(field);
  return [...(preferred.size ? preferred : groupBy("sector"))]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8);
}
