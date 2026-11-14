import type { Expert } from "./types";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS, type ServiceId } from "./client-catalog";
import { canonicalCountry } from "./network-reference";
import { hasRecordedContent } from "./dossier-content";
export type WorkspaceMode = "home" | "search" | "configuration";
export type WorkspacePane =
  | "criteria"
  | "results"
  | "profile"
  | "shortlist"
  | "core"
  | "functions"
  | "selection"
  | "workflow";
export const SEARCH_PANES: WorkspacePane[] = ["results", "profile", "shortlist"];
export const CONFIGURATION_PANES: WorkspacePane[] = ["core", "functions", "selection", "workflow"];
export const DEFAULT_MAP_LAYERS = {
  people: true,
  organisations: true,
  countries: true,
  expertise: true,
  sectors: true,
  ai: true,
  peer: true,
  membership: true,
  chapter: true,
};
export type MapLayers = typeof DEFAULT_MAP_LAYERS;
export type PresentationSampleView = "sectors" | "expertise";
export const presentationSampleLayers = (view: PresentationSampleView): MapLayers => ({
  people: true,
  organisations: false,
  countries: false,
  expertise: view === "expertise",
  sectors: view === "sectors",
  ai: false,
  peer: false,
  membership: false,
  chapter: false,
});
export type MapKind =
  | "person"
  | "organisation"
  | "country"
  | "expertise"
  | "sector"
  | "status"
  | "function"
  | "workflow"
  | "core"
  | "illustration";
export interface MapNode {
  id: string;
  kind: MapKind;
  label: string;
  x: number;
  y: number;
  size: number;
  primary?: boolean;
  clusterRadius?: number;
  value?: string | undefined;
  code?: string;
  functionId?: ServiceId;
  workflowId?: string;
}
export interface MapEdge {
  source: string;
  target: string;
  kind: "category" | "workflow" | "illustration";
}
export interface WorkspaceMap {
  nodes: MapNode[];
  links: MapEdge[];
}
export const SEARCH_WORKFLOW = {
  id: "search",
  title: { en: "Expertise search", uk: "Пошук експертизи" },
  detail: {
    en: "Enquiry → recorded expertise → dossier review → working shortlist → agreed next action. Research and introductions remain proposed capabilities.",
    uk: "Запит → наявна експертиза → перегляд досьє → робочий відбір → погоджена наступна дія. Дослідження й знайомства залишаються запропонованими функціями.",
  },
  serviceIds: ["search", "review", "groups", "contact"] as ServiceId[],
};
export const WORKSPACE_WORKFLOWS = [SEARCH_WORKFLOW, ...CLIENT_WORKFLOWS];
export function workflowAdditionalServiceIds(id: string): ServiceId[] {
  const workflow = WORKSPACE_WORKFLOWS.find((item) => item.id === id);
  if (!workflow) return [];
  if (id === SEARCH_WORKFLOW.id) return [...SEARCH_WORKFLOW.serviceIds];
  return workflow.serviceIds.filter((serviceId) => !SEARCH_WORKFLOW.serviceIds.includes(serviceId));
}
export function workflowRequiredServiceIds(id: string): ServiceId[] {
  const workflow = WORKSPACE_WORKFLOWS.find((item) => item.id === id);
  return workflow
    ? [...new Set<ServiceId>([...SEARCH_WORKFLOW.serviceIds, ...workflow.serviceIds])]
    : [];
}
export const recordedMember = (e: Expert) =>
  [e.communityRole, e.role ?? ""].some((value) =>
    /^(isrm member|member of (the )?isrm)$/i.test(value.trim()),
  );
export const recordedChapterHead = (e: Expert) => {
  const fields = [e.communityRole, e.role ?? ""];
  const attributed = /\bisrm\b/i.test([...fields, e.organization ?? ""].join(" "));
  const title =
    /\bchapter\s+(head|chair|lead|director)\b|\b(head|chair|lead|director)(?:\s+of)?(?:\s+(?:the|isrm))?\s+chapter\b|(голова|керівник|директор)\s+чаптер[ау]/i;
  return attributed && fields.some((value) => title.test(value));
};
export function matchesStatus(e: Expert, status: string) {
  if (status === "source") return e.verified;
  if (status === "ai" || status === "peer") return false; // No such decisions are supplied by the current domain API.
  if (status === "member") return recordedMember(e);
  if (status === "chapter") return recordedChapterHead(e);
  return true;
}
export const expertiseName = (e: Expert, uk: boolean) =>
  hasRecordedContent(e.primaryExpertise)
    ? e.primaryExpertise
    : uk
      ? "Експертиза не зафіксована"
      : "Expertise not recorded";
export const personMapLabel = (e: Expert, uk: boolean) => `${expertiseName(e, uk)} · ${e.code}`;
export function searchMap(
  experts: Expert[],
  layers: MapLayers,
  uk: boolean,
  w: number,
  h: number,
): WorkspaceMap {
  const nodes: MapNode[] = [],
    links: MapEdge[] = [];
  const groups = new Map<string, Expert[]>();
  for (const e of experts) {
    const label = expertiseName(e, uk);
    groups.set(label, [...(groups.get(label) ?? []), e]);
  }
  const ranked = [...groups].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const groupsShown = ranked.slice(0, 5);
  const others = ranked.slice(5).flatMap(([, p]) => p);
  if (others.length)
    groupsShown.push([uk ? "Інші записані напрями" : "Other recorded directions", others]);
  const portrait = w < 400 && h > w * 1.4;
  // Reuse the established phyllotaxis spacing from network-layout: a larger
  // population gets a larger footprint, never a fixed disk with larger dots.
  const clusterRadius = (count: number) => 18 + 11 * Math.sqrt(count);
  const radii = groupsShown.map(([, people]) => clusterRadius(people.length));
  const largest = Math.max(0, ...radii);
  const orbitX = Math.max(w * 0.28, largest * 2.3);
  const orbitY = Math.max(h * 0.27, largest * 1.7);
  const portraitHeight = radii.reduce((sum, radius) => sum + radius * 2 + 70, 0);
  let portraitY = -portraitHeight / 2;
  const grouped = new Map<string, { x: number; y: number }>();
  groupsShown.forEach(([label, people], i) => {
    const a = (i / groupsShown.length) * Math.PI * 2 - Math.PI / 2;
    const radius = radii[i]!;
    const x = portrait ? 0 : Math.cos(a) * orbitX;
    const y = portrait ? portraitY + radius : Math.sin(a) * orbitY;
    portraitY += radius * 2 + 70;
    const id = "expertise:" + label;
    if (layers.expertise)
      nodes.push({
        id,
        kind: "expertise",
        label: `${label} · ${people.length}`,
        value: groups.has(label) ? label : undefined,
        x,
        y,
        size: 8,
        primary: true,
        clusterRadius: radius,
      });
    people.forEach((e, j) => {
      const r = 18 + 11 * Math.sqrt(j + 1);
      const angle = j * 2.399963229728653;
      const point = { x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r };
      grouped.set(e.code, point);
      if (layers.people) {
        nodes.push({
          id: e.code,
          kind: "person",
          label: people.length === 1 ? e.code : personMapLabel(e, uk),
          code: e.code,
          ...point,
          size: 2.8,
        });
        if (layers.expertise) links.push({ source: e.code, target: id, kind: "category" });
      }
    });
  });
  const categories = new Map<
    string,
    { label: string; kind: MapKind; codes: string[]; value: string }
  >();
  const add = (kind: MapKind, value: string, e: Expert) => {
    if (!hasRecordedContent(value)) return;
    const id = kind + ":" + value;
    const c = categories.get(id) ?? { label: value, kind, codes: [], value };
    c.codes.push(e.code);
    categories.set(id, c);
  };
  for (const e of experts) {
    if (layers.organisations && e.organization) add("organisation", e.organization, e);
    if (layers.countries) add("country", canonicalCountry(e.country), e);
    if (layers.sectors) add("sector", e.sector, e);
    if (layers.membership && recordedMember(e))
      add("status", uk ? "Членство ISRM зафіксоване" : "Recorded ISRM membership", e);
    if (layers.chapter && recordedChapterHead(e))
      add("status", uk ? "Керівник чаптеру зафіксований" : "Recorded chapter head", e);
  }
  [...categories].forEach(([id, c], i) => {
    const a = (i / Math.max(1, categories.size)) * Math.PI * 2;
    nodes.push({
      id,
      kind: c.kind,
      label: `${c.label} · ${c.codes.length}`,
      value: c.value,
      x: portrait ? largest + 90 : Math.cos(a) * Math.max(w * 0.42, orbitX + largest + 80),
      y: portrait
        ? (i / Math.max(1, categories.size - 1) - 0.5) * portraitHeight
        : Math.sin(a) * Math.max(h * 0.42, orbitY + largest + 80),
      size: c.kind === "organisation" ? 5 : 4.5,
    });
    if (layers.people)
      for (const code of c.codes)
        if (grouped.has(code)) links.push({ source: code, target: id, kind: "category" });
  });
  if (experts.length === 1) {
    for (const node of nodes) {
      if (node.kind === "person") {
        node.x = w * 0.12;
        node.y = -h * 0.13;
      } else if (node.kind === "expertise") {
        node.x = -w * 0.18;
        node.y = h * 0.06;
      } else if (node.kind === "country") {
        node.x = w * 0.29;
        node.y = h * 0.21;
      } else if (node.kind === "sector") {
        node.x = -w * 0.24;
        node.y = h * 0.32;
      }
    }
  }
  return { nodes, links };
}
/** Availability of supplied fields, never inferred participation or demand. */
export function illustrativeRecords(id: ServiceId, experts: Expert[], shortlist: string[]) {
  return experts.filter((e) => {
    switch (id) {
      case "groups":
        return shortlist.includes(e.code);
      case "research":
        return !hasRecordedContent(e.evidence);
      case "review":
        return e.verified;
      case "evidence":
      case "publishing":
        return hasRecordedContent(e.evidence);
      case "contact":
        return shortlist.includes(e.code);
      case "survey":
        return hasRecordedContent(e.communityRole);
      default:
        return true;
    }
  });
}
export function configurationMap(
  experts: Expert[],
  uk: boolean,
  w: number,
  h: number,
  selected: ServiceId | null,
  cycle: string | null,
  relations: boolean,
  shortlist: string[],
): WorkspaceMap {
  const nodes: MapNode[] = [],
    links: MapEdge[] = [];
  const flow = WORKSPACE_WORKFLOWS.find((f) => f.id === cycle);
  const services = flow
    ? flow.serviceIds.map((id) => CLIENT_SERVICES.find((s) => s.id === id)!)
    : CLIENT_SERVICES;
  services.forEach((s, i) => {
    const a = (i / services.length) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: "function:" + s.id,
      kind: "function",
      label: s.title[uk ? "uk" : "en"],
      functionId: s.id,
      x: Math.cos(a) * w * 0.32,
      y: Math.sin(a) * h * 0.32,
      size: 8,
      primary: true,
    });
  });
  const relevant = WORKSPACE_WORKFLOWS.filter((f) => !selected || f.serviceIds.includes(selected));
  if (flow) {
    services.forEach((s, i) =>
      links.push({
        source: "function:" + s.id,
        target: "function:" + services[(i + 1) % services.length]!.id,
        kind: "workflow",
      }),
    );
  } else
    WORKSPACE_WORKFLOWS.forEach((f, i) => {
      const a = (i / WORKSPACE_WORKFLOWS.length) * Math.PI * 2;
      nodes.push({
        id: "workflow:" + f.id,
        kind: "workflow",
        label: f.title[uk ? "uk" : "en"],
        workflowId: f.id,
        x: Math.cos(a) * w * 0.12,
        y: Math.sin(a) * h * 0.12,
        size: 6,
      });
      if (!relations || relevant.includes(f))
        for (const id of f.serviceIds)
          links.push({ source: "workflow:" + f.id, target: "function:" + id, kind: "workflow" });
    });
  if (selected && !cycle && !relations) {
    const parent = nodes.find((n) => n.functionId === selected)!;
    const records = illustrativeRecords(selected, experts, shortlist);
    const radius = 18 + 11 * Math.sqrt(records.length);
    const outward = Math.atan2(parent.y, parent.x);
    const centre = {
      x: parent.x + Math.cos(outward) * (radius + 36),
      y: parent.y + Math.sin(outward) * (radius + 36),
    };
    records.forEach((e, i) => {
      const a = i * 2.399963229728653;
      const r = 18 + 11 * Math.sqrt(i + 1);
      const id = "illustration:" + selected + ":" + e.code;
      nodes.push({
        id,
        kind: "illustration",
        label: uk
          ? "Ілюстрація наявності даних, не участь у сервісі"
          : "Supplied-data illustration, not service participation",
        x: centre.x + Math.cos(a) * r,
        y: centre.y + Math.sin(a) * r,
        size: 2.3,
      });
      links.push({ source: id, target: parent.id, kind: "illustration" });
    });
  }
  return { nodes, links };
}
