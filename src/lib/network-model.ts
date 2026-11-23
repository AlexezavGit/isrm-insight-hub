import { hasRecordedContent } from "./dossier-content";
import { publicLeadershipGraph } from "./public-directory";
import type { Expert } from "./types";
import { canonicalCountry } from "./network-reference";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  CORE_SERVICE_IDS,
  type ServiceId,
} from "./client-catalog";
import { SEARCH_WORKFLOW, recordedChapterHead, recordedMember } from "./workspace-map";
export type GraphKind =
  | "expert"
  | "organisation"
  | "sector"
  | "theme"
  | "hub"
  | "status"
  | "service"
  | "workflow"
  | "core"
  | "isrm";
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
  membership?: boolean;
  chapter?: boolean;
  publicLeadership?: boolean;
}
export interface NetworkBuildOptions {
  includeHub?: boolean;
  includeServiceCoverage?: boolean;
  includeProposedCore?: boolean;
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
const known = (s: string | undefined) => hasRecordedContent(s) && s?.trim() !== "Не оцінено";
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
  options: NetworkBuildOptions = {},
): NetworkModel {
  const uk = locale === "uk",
    includeHub = options.includeHub ?? true,
    includeServiceCoverage = options.includeServiceCoverage ?? true,
    includeProposedCore = options.includeProposedCore ?? false,
    nodes: NetworkNode[] = includeHub
      ? [{ id: "isrm", kind: "isrm", label: "ISRM", size: 16, x: 0, y: 0, fx: 0, fy: 0 }]
      : [],
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
  const coreId = includeProposedCore
    ? add(
        "core:expertise-trust",
        "core",
        uk
          ? "Запропоноване ядро: цифрова довіра й вплив"
          : "Proposed core: digital trust & influence",
      )
    : null;
  CLIENT_SERVICES.forEach((s) => add("svc:" + s.id, "service", s.title[uk ? "uk" : "en"]));
  const workflows = [SEARCH_WORKFLOW, ...CLIENT_WORKFLOWS];
  workflows.forEach((w) => {
    add("workflow:" + w.id, "workflow", w.title[uk ? "uk" : "en"]);
    if (coreId && w.id === SEARCH_WORKFLOW.id) edge(coreId, "workflow:" + w.id, "core");
    if (includeHub && w.id === SEARCH_WORKFLOW.id)
      edge("isrm", "workflow:" + SEARCH_WORKFLOW.id, "architecture");
    if (w.id !== SEARCH_WORKFLOW.id)
      edge("workflow:" + w.id, "workflow:" + SEARCH_WORKFLOW.id, "foundation");
    const serviceIds =
      w.id === SEARCH_WORKFLOW.id
        ? w.serviceIds
        : w.serviceIds.filter((id) => !SEARCH_WORKFLOW.serviceIds.includes(id));
    serviceIds.forEach((id) => edge("workflow:" + w.id, "svc:" + id, "architecture"));
  });
  for (const e of experts) {
    if (!e.verified && !layers.researchQueue) continue;
    nodes.push({ id: e.code, kind: "expert", label: e.displayName, size: 1, expert: e });
    map.set(e.code, nodes[nodes.length - 1]!);
    if (includeHub) edge(e.code, "isrm", "sample");
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
    if (layers.membership)
      edge(
        e.code,
        add(
          recordedMember(e) ? "membership:recorded" : "membership:not-recorded",
          "status",
          recordedMember(e)
            ? uk
              ? "Членство ISRM зафіксоване"
              : "Recorded ISRM membership"
            : uk
              ? "Членство ISRM не зафіксоване в записі"
              : "ISRM membership not recorded in this record",
        ),
        "category",
      );
    if (layers.chapter)
      edge(
        e.code,
        add(
          recordedChapterHead(e) ? "chapter:recorded" : "chapter:not-recorded",
          "status",
          recordedChapterHead(e)
            ? uk
              ? "Керівник чаптеру зафіксований"
              : "Recorded chapter head"
            : uk
              ? "Керівництво чаптером не зафіксоване в записі"
              : "Chapter leadership not recorded in this record",
        ),
        "category",
      );
    if (selection.reviewStatus === "Source confirmation flag present" && e.verified)
      edge(
        e.code,
        add(
          "source:flag",
          "status",
          uk ? "Є позначка підтвердження джерела" : "Source confirmation flag present",
        ),
        "category",
      );
    if (selection.reviewStatus === "No source confirmation flag supplied" && !e.verified)
      edge(
        e.code,
        add(
          "source:not-flagged",
          "status",
          uk ? "Позначку підтвердження джерела не надано" : "No source confirmation flag supplied",
        ),
        "category",
      );
    if (includeServiceCoverage)
      CLIENT_SERVICES.filter((s) => serviceCovers(s.id, e)).forEach((s) =>
        edge(e.code, "svc:" + s.id, "coverage"),
      );
  }
  if (layers.publicLeadership) {
    const published = publicLeadershipGraph();
    for (const node of published.nodes)
      if (!map.has(node.id)) {
        nodes.push(node);
        map.set(node.id, node);
      }
    links.push(...published.links);
  }
  // A selected reference category may have no matching records. Retain its node
  // without inventing links, membership or coverage.
  const sourceFlagCriteria = [
    "Source confirmation flag present",
    "No source confirmation flag supplied",
  ].includes(selection.reviewStatus ?? "");
  for (const [value, prefix, kind] of [
    [selection.country ? canonicalCountry(selection.country) : "", "country", "hub"],
    [selection.sector, "sector", "sector"],
    [selection.expertise, "expertise", "theme"],
    [selection.role, "role", "hub"],
    [sourceFlagCriteria ? undefined : selection.reviewStatus, "record-status", "hub"],
  ] as [string | undefined, string, GraphKind][]) {
    if (value && known(value) && !map.has(prefix + ":" + value)) {
      const id = prefix + ":" + value;
      const node: NetworkNode = { id, kind, label: value, size: 0 };
      nodes.push(node);
      map.set(id, node);
    }
  }
  if (sourceFlagCriteria) {
    const present = selection.reviewStatus === "Source confirmation flag present";
    const id = present ? "source:flag" : "source:not-flagged";
    if (!map.has(id)) {
      const node: NetworkNode = {
        id,
        kind: "status",
        label: present
          ? uk
            ? "Є позначка підтвердження джерела"
            : "Source confirmation flag present"
          : uk
            ? "Позначку підтвердження джерела не надано"
            : "No source confirmation flag supplied",
        size: 0,
      };
      nodes.push(node);
      map.set(id, node);
    }
  }
  return { nodes, links };
}
export function relatedPeople(model: NetworkModel, ids: string[]): Set<string> {
  const services = new Set(ids.filter((id) => id.startsWith("svc:")));
  const workflows = new Set(ids.filter((id) => id.startsWith("workflow:")));
  for (const link of model.links)
    if (link.kind === "foundation" && workflows.has(link.source)) workflows.add(link.target);
  for (const l of model.links)
    if (workflows.has(l.source) && l.kind === "architecture" && l.target.startsWith("svc:"))
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
  const capability =
    !categoriesOnly &&
    (node?.kind === "service" || node?.kind === "workflow" || node?.kind === "core");
  const edges = model.links.filter(
    (l) =>
      ![l.source, l.target].some((id) => id.startsWith("svc:") && disabled.includes(id.slice(4))) &&
      (capability
        ? ["coverage", "architecture", "foundation", "core"].includes(l.kind)
        : l.kind === "category"),
  );
  const distances = new Map<string, number>();
  const nodes = new Map(model.nodes.map((item) => [item.id, item]));
  if (node) distances.set(anchor, 0);
  for (let step = 0; step < 2; step++) {
    const frontier = new Set(
      [...distances].filter(([, depth]) => depth === step).map(([id]) => id),
    );
    const expandable =
      step === 0 ? frontier : new Set([...frontier].filter((id) => !id.startsWith("country:")));
    for (const edge of edges) {
      if (expandable.has(edge.source) && !distances.has(edge.target))
        distances.set(edge.target, step + 1);
      if (expandable.has(edge.target) && !distances.has(edge.source))
        distances.set(edge.source, step + 1);
    }
  }
  const isCountryCohortEdge = (edge: NetworkEdge) =>
    edge.kind === "category" &&
    ((edge.source.startsWith("country:") &&
      nodes.get(edge.target)?.kind === "expert" &&
      edge.target !== anchor) ||
      (edge.target.startsWith("country:") &&
        nodes.get(edge.source)?.kind === "expert" &&
        edge.source !== anchor));
  return {
    distances,
    links: edges.filter(
      (l) => distances.has(l.source) && distances.has(l.target) && !isCountryCohortEdge(l),
    ),
  };
}

export function workflowServices(id: string, disabled: ServiceId[]): ServiceId[] {
  const workflow = [SEARCH_WORKFLOW, ...CLIENT_WORKFLOWS].find((item) => item.id === id);
  const ids =
    id === "core"
      ? CORE_SERVICE_IDS
      : workflow
        ? [...new Set<ServiceId>([...SEARCH_WORKFLOW.serviceIds, ...workflow.serviceIds])]
        : [];
  return ids.filter((s) => !disabled.includes(s));
}
