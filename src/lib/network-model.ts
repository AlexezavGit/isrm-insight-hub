import type { Expert } from "./types";
import { canonicalCountry } from "./network-reference";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  CORE_SERVICE_IDS,
  type ServiceId,
} from "./client-catalog";
export type GraphKind =
  "expert" | "organisation" | "sector" | "theme" | "hub" | "service" | "workflow" | "isrm";
export interface GraphLayers {
  sector: boolean;
  theme: boolean;
  hub: boolean;
  researchQueue: boolean;
  organization?: boolean;
  country?: boolean;
  rank?: boolean;
  specialisation?: boolean;
  services?: boolean;
}
export interface NetworkNode {
  id: string;
  kind: GraphKind;
  label: string;
  size: number;
  expert?: Expert;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
}
export interface NetworkEdge {
  source: string;
  target: string;
  kind: string;
}
export interface NetworkModel {
  nodes: NetworkNode[];
  links: NetworkEdge[];
}
const known = (s: string | undefined) =>
  !!s?.trim() &&
  !["Unclassified", "Не оцінено", "Unknown", "Ukraine-related experience"].includes(s);
/** Coverage illustrates proposed service use; never a social recommendation or endorsement. */
export function serviceCovers(id: string, e: Expert) {
  // Illustrative participation bands, not an inference about this person's interests or use.
  const hash = Array.from(e.code).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const catalogue = CLIENT_SERVICES.map((service) => service.id);
  const first = hash % catalogue.length;
  const second = (first + 1) % catalogue.length;
  return (
    id === catalogue[first] ||
    id === catalogue[second] ||
    (hash % 3 === 0 && id === (hash % 2 === 0 ? "survey" : "publishing"))
  );
}
export function buildNetwork(
  experts: Expert[],
  layers: GraphLayers,
  locale: string,
  selection: {
    country?: string;
    sector?: string;
    expertise?: string;
    role?: string;
    reviewStatus?: string;
  } = {},
): NetworkModel {
  const uk = locale === "uk",
    nodes: NetworkNode[] = [
      { id: "isrm", kind: "isrm", label: "ISRM", size: 16, x: 0, y: 0, fx: 0, fy: 0 },
    ],
    links: NetworkEdge[] = [];
  const map = new Map(nodes.map((n) => [n.id, n]));
  const add = (id: string, kind: GraphKind, label: string) => {
    let n = map.get(id);
    if (!n) {
      n = { id, kind, label, size: 1 };
      nodes.push(n);
      map.set(id, n);
    } else n.size++;
    return id;
  };
  const edge = (source: string, target: string, kind: string) =>
    links.push({ source, target, kind });
  CLIENT_SERVICES.forEach((s) => add("svc:" + s.id, "service", s.title[uk ? "uk" : "en"]));
  const workflows = [
    { id: "core", title: { en: "Trust core", uk: "Ядро довіри" }, serviceIds: CORE_SERVICE_IDS },
    ...CLIENT_WORKFLOWS,
  ];
  workflows.forEach((w) => {
    add("workflow:" + w.id, "workflow", w.title[uk ? "uk" : "en"]);
    edge("isrm", "workflow:" + w.id, "architecture");
    w.serviceIds.forEach((id) => edge("workflow:" + w.id, "svc:" + id, "architecture"));
  });
  for (const e of experts) {
    if (!e.verified && !layers.researchQueue) continue;
    nodes.push({ id: e.code, kind: "expert", label: e.displayName, size: 1, expert: e });
    map.set(e.code, nodes[nodes.length - 1]!);
    // Sample provenance is not membership, endorsement or a personal acquaintance.
    edge(e.code, "isrm", "sample");
    const fields: [boolean | undefined, string | undefined, string, GraphKind][] = [
      [layers.sector, e.sector, "sector", "sector"],
      [layers.theme, e.ukraineCategory, "theme", "theme"],
      [layers.hub, e.communityRole, "role", "hub"],
      [layers.organization, e.organization, "organisation", "organisation"],
      [layers.country, canonicalCountry(e.country), "country", "hub"],
      [layers.rank, e.identityStatus, "record-status", "hub"],
      [layers.specialisation, e.primaryExpertise, "expertise", "theme"],
    ];
    for (const [enabled, value, prefix, kind] of fields)
      if (enabled && known(value))
        edge(e.code, add(prefix + ":" + value, kind, value!), "category");
    CLIENT_SERVICES.filter((s) => serviceCovers(s.id, e)).forEach((s) =>
      edge(e.code, "svc:" + s.id, "coverage"),
    );
  }
  // A selected reference category may have no matching records. Retain its node
  // without inventing links, membership or coverage.
  for (const [value, prefix, kind] of [
    [selection.country ? canonicalCountry(selection.country) : "", "country", "hub"],
    [selection.sector, "sector", "sector"],
    [selection.expertise, "expertise", "theme"],
    [selection.role, "role", "hub"],
    [selection.reviewStatus, "record-status", "hub"],
  ] as [string | undefined, string, GraphKind][]) {
    if (value && !map.has(prefix + ":" + value)) {
      const id = prefix + ":" + value;
      const node: NetworkNode = { id, kind, label: value, size: 0 };
      nodes.push(node);
      map.set(id, node);
    }
  }
  return { nodes, links };
}
export function relatedPeople(model: NetworkModel, ids: string[]): Set<string> {
  const services = new Set(ids.filter((id) => id.startsWith("svc:")));
  for (const l of model.links)
    if (ids.includes(l.source) && l.kind === "architecture" && l.target.startsWith("svc:"))
      services.add(l.target);
  const people = new Set<string>();
  for (const l of model.links)
    if (l.kind === "coverage" && services.has(l.target)) people.add(l.source);
  return people;
}
export function categoryNeighbors(model: NetworkModel, id: string): Set<string> {
  return new Set(networkNeighborhood(model, id, [], true).distances.keys());
}

/** Two recorded steps, not a recommendation path or evidence of acquaintance. */
export function networkNeighborhood(
  model: NetworkModel,
  anchor: string,
  disabled: string[] = [],
  categoriesOnly = false,
) {
  const node = model.nodes.find((n) => n.id === anchor);
  const capability = !categoriesOnly && (node?.kind === "service" || node?.kind === "workflow");
  const edges = model.links.filter(
    (l) =>
      ![l.source, l.target].some((id) => id.startsWith("svc:") && disabled.includes(id.slice(4))) &&
      (capability ? ["coverage", "architecture"].includes(l.kind) : l.kind === "category"),
  );
  const distances = new Map<string, number>();
  if (node) distances.set(anchor, 0);
  for (let step = 0; step < 2; step++) {
    const frontier = new Set(
      [...distances].filter(([, depth]) => depth === step).map(([id]) => id),
    );
    for (const edge of edges) {
      if (frontier.has(edge.source) && !distances.has(edge.target))
        distances.set(edge.target, step + 1);
      if (frontier.has(edge.target) && !distances.has(edge.source))
        distances.set(edge.source, step + 1);
    }
  }
  return {
    distances,
    links: edges.filter((l) => distances.has(l.source) && distances.has(l.target)),
  };
}

export function workflowServices(id: string, disabled: ServiceId[]): ServiceId[] {
  const ids =
    id === "core"
      ? CORE_SERVICE_IDS
      : (CLIENT_WORKFLOWS.find((w) => w.id === id)?.serviceIds ?? []);
  return ids.filter((s) => !disabled.includes(s));
}
