import type { Expert } from "./types";
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
  if (["search", "groups", "contact", "integration", "survey"].includes(id)) return true;
  const text = [e.sector, e.primaryExpertise, ...(e.tags ?? [])].join(" ").toLowerCase();
  return /risk|resilien|security|advis|research|academ|humanitarian|безпек|ризик|дослідж/.test(
    text,
  );
}
export function buildNetwork(experts: Expert[], layers: GraphLayers, locale: string): NetworkModel {
  const uk = locale === "uk",
    nodes: NetworkNode[] = [{ id: "isrm", kind: "isrm", label: "ISRM", size: 16 }],
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
      [
        layers.hub,
        e.communityRole === "Member / participant" ? undefined : e.communityRole,
        "role",
        "hub",
      ],
      [layers.organization, e.organization, "organisation", "organisation"],
      [layers.country, e.country, "country", "hub"],
      [layers.rank, e.identityStatus || e.communityRole, "record-status", "hub"],
      [layers.specialisation, e.primaryExpertise, "expertise", "theme"],
    ];
    for (const [enabled, value, prefix, kind] of fields)
      if (enabled && known(value))
        edge(e.code, add(prefix + ":" + value, kind, value!), "category");
    CLIENT_SERVICES.filter((s) => serviceCovers(s.id, e)).forEach((s) =>
      edge(e.code, "svc:" + s.id, "coverage"),
    );
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
  const direct = new Set<string>([id]);
  for (const l of model.links)
    if (l.kind === "category" && (l.source === id || l.target === id)) {
      direct.add(l.source);
      direct.add(l.target);
    }
  return direct;
}

export function workflowServices(id: string, disabled: ServiceId[]): ServiceId[] {
  const ids =
    id === "core"
      ? CORE_SERVICE_IDS
      : (CLIENT_WORKFLOWS.find((w) => w.id === id)?.serviceIds ?? []);
  return ids.filter((s) => !disabled.includes(s));
}
