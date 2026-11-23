import type { Expert } from "./types";
import type { NetworkModel } from "./network-model";
import { serviceCovers, networkNeighborhood } from "./network-model";
export type Point = { x: number; y: number };
type RelatedLink = { source: string; target: string };
const hash = (s: string) => Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function transitionOrigins(
  ids: readonly string[],
  links: readonly RelatedLink[],
  previous: ReadonlyMap<string, Point>,
  targets: ReadonlyMap<string, Point>,
  anchor: string,
): Map<string, Point> {
  const current = new Set(ids);
  const adjacent = new Map<string, string[]>();
  const visiblePrevious = [...previous];
  for (const { source, target } of links) {
    adjacent.set(source, [...(adjacent.get(source) ?? []), target]);
    adjacent.set(target, [...(adjacent.get(target) ?? []), source]);
  }
  const fallbackFor = (id: string) => {
    if (current.has(anchor)) {
      const anchored = previous.get(anchor) ?? targets.get(anchor);
      if (anchored) return anchored;
    }
    const target = targets.get(id);
    if (target && visiblePrevious.length) {
      return visiblePrevious.reduce((nearest, candidate) =>
        Math.hypot(candidate[1].x - target.x, candidate[1].y - target.y) <
        Math.hypot(nearest[1].x - target.x, nearest[1].y - target.y)
          ? candidate
          : nearest,
      )[1];
    }
    return target ?? { x: 0, y: 0 };
  };
  return new Map(
    ids.map((id) => {
      const position = previous.get(id);
      if (position) return [id, position];
      const neighbours = (adjacent.get(id) ?? [])
        .filter((neighbour) => current.has(neighbour) && previous.has(neighbour))
        .sort();
      const originId = neighbours.includes(anchor) ? anchor : neighbours[0];
      return [id, originId ? previous.get(originId)! : fallbackFor(id)];
    }),
  );
}

export function freeNetworkPositions(
  ids: readonly string[],
  positions: Map<string, Point>,
  anchor: string,
): Map<string, Point> {
  const allIds = new Set(ids);
  const fixedIds = new Set([anchor, "core:expertise-trust"].filter((id) => id && allIds.has(id)));
  const centreId = fixedIds.has(anchor) ? anchor : [...fixedIds][0];
  const centre = (centreId && positions.get(centreId)) ?? { x: 0, y: 0 };
  const nodes = [...allIds].filter((id) => !fixedIds.has(id)).sort();
  const radius = Math.max(
    180,
    ...nodes.map((id) => {
      const point = positions.get(id);
      return point ? Math.hypot(point.x - centre.x, point.y - centre.y) : 0;
    }),
  );
  const result = new Map<string, Point>();
  for (const id of fixedIds) result.set(id, positions.get(id) ?? centre);
  nodes.forEach((id, index) => {
    const seed = hash(id) / 0xffffffff;
    const angle = index * GOLDEN_ANGLE + seed * Math.PI * 2;
    const distance = radius * Math.sqrt((index + 0.5) / nodes.length);
    result.set(id, {
      x: centre.x + Math.cos(angle) * distance,
      y: centre.y + Math.sin(angle) * distance,
    });
  });
  for (const [id, p] of result)
    result.set(id, { x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 });
  return result;
}

export function interpolatePoint(from: Point, to: Point, progress: number): Point {
  const t = Math.max(0, Math.min(1, progress));
  const eased = 1 - Math.pow(1 - t, 3);
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased,
  };
}
export function assignedService(expert: Expert | undefined, active: string[], disabled: string[]) {
  const eligible = active.filter(
    (id) => !disabled.includes(id) && expert && serviceCovers(id, expert),
  );
  return expert && eligible.length ? "svc:" + eligible[hash(expert.code) % eligible.length] : null;
}
export function layoutNetwork(
  model: NetworkModel,
  mode: "people" | "services",
  active: string[],
  disabled: string[],
  anchor = "isrm",
  includeServiceCoverage = true,
  { keepPeopleInsideRings = false } = {},
): Map<string, Point> {
  const hasHub = model.nodes.some((n) => n.id === "isrm");
  const experts = model.nodes.filter((n) => n.kind === "expert");
  const innerGroups = mode === "people" && keepPeopleInsideRings;
  const clusterCenterLimit = 100;
  const clusterStep = 11;
  const expertiseRadius = 230;
  const ringOffset = innerGroups
    ? Math.max(
        0,
        clusterCenterLimit + clusterStep * Math.sqrt(experts.length) + 40 - expertiseRadius,
      )
    : 0;
  const core = model.nodes.find((n) => n.kind === "core");
  const hasProposedCore = !!core;
  const positions = new Map<string, Point>();
  if (hasHub) positions.set("isrm", { x: 0, y: 0 });
  if (core) positions.set(core.id, { x: 0, y: 0 });
  const services = model.nodes.filter((n) => n.kind === "service");
  services.forEach((n, i) => {
    const angle = (i / services.length) * 2 * Math.PI - Math.PI / 2;
    const radius = hasProposedCore ? 420 : 180;
    positions.set(n.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  });
  const workflows = model.nodes.filter((n) => n.kind === "workflow");
  workflows.forEach((n, i) => {
    const a = (i / workflows.length) * 2 * Math.PI - Math.PI / 2;
    const radius = hasProposedCore ? 200 : 76;
    positions.set(n.id, { x: Math.cos(a) * radius, y: Math.sin(a) * radius });
  });
  const categories = model.nodes.filter(
    (n) => !["expert", "isrm", "core", "service", "workflow"].includes(n.kind),
  );
  const rings = new Map<number, typeof categories>();
  for (const node of categories) {
    const radius =
      mode === "services"
        ? 242
        : node.id.startsWith("public-person:")
          ? 158
          : node.id.startsWith("public-unit:")
            ? 270
            : node.id.startsWith("expertise:")
              ? expertiseRadius + ringOffset
              : node.id.startsWith("sector:")
                ? 310 + ringOffset
                : node.id.startsWith("country:")
                  ? 390 + ringOffset
                  : node.id.startsWith("organisation:")
                    ? 350 + ringOffset
                    : 270;
    rings.set(radius, [...(rings.get(radius) ?? []), node]);
  }
  for (const [radius, nodes] of rings) {
    nodes
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach((n, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        positions.set(n.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
      });
  }
  const groups = new Map<string, string[]>();
  for (const n of experts) {
    const owner =
      (mode === "services" && includeServiceCoverage
        ? assignedService(n.expert, active, disabled)
        : null) ??
      (!hasHub
        ? model.links.find((link) => link.source === n.id && link.kind === "category")?.target
        : undefined) ??
      (hasHub ? "isrm" : "");
    groups.set(owner, [...(groups.get(owner) ?? []), n.id]);
  }
  groups.forEach((ids, owner) =>
    ids.sort().forEach((id, i) => {
      const p = positions.get(owner) ?? { x: 0, y: 0 };
      const a = i * 2.399963;
      if (owner === "isrm" && !innerGroups) {
        const r = 38 + 22 * Math.sqrt(i + 1);
        positions.set(id, { x: Math.cos(a) * r, y: Math.sin(a) * r });
      } else {
        const distance = Math.hypot(p.x, p.y);
        const inward =
          innerGroups && distance > clusterCenterLimit ? clusterCenterLimit / distance : 1;
        const r = clusterStep * Math.sqrt(i + 1);
        positions.set(id, {
          x: p.x * inward + Math.cos(a) * r,
          y: p.y * inward + Math.sin(a) * r,
        });
      }
    }),
  );
  if (!innerGroups && anchor && anchor !== "isrm" && positions.has(anchor)) {
    const { distances } = networkNeighborhood(model, anchor, disabled);
    for (const depth of [1, 2]) {
      const ids = [...distances]
        .filter(([, d]) => d === depth)
        .map(([id]) => id)
        .sort();
      ids.forEach((id, i) => {
        const a = (i / ids.length) * Math.PI * 2 - Math.PI / 2;
        positions.set(id, { x: Math.cos(a) * depth * 110, y: Math.sin(a) * depth * 110 });
      });
    }
    if (core && anchor !== core.id && !distances.has(core.id))
      positions.set(core.id, { x: -220, y: 0 });
    positions.set(anchor, { x: 0, y: 0 });
  }
  // Stable SVG/SSR coordinates across JavaScript engines; subpixel layout is unchanged.
  for (const [id, p] of positions)
    positions.set(id, { x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 });
  return positions;
}
export const GRAPH_LABEL_ZOOM = 1.65;
export const GRAPH_READABLE_ZOOM = 1.8;
export function fitGraphView(
  positions: Map<string, Point>,
  visibleIds: string[],
  anchor: string,
  width: number,
  height: number,
  readable = true,
  minOverviewZoom = 0.25,
) {
  const centre = positions.get(anchor) ?? { x: 0, y: 0 };
  const pts = visibleIds.map((id) => positions.get(id)).filter((p): p is Point => !!p);
  const dx = Math.max(190, ...pts.map((p) => Math.abs(p.x - centre.x) + 24));
  const dy = Math.max(190, ...pts.map((p) => Math.abs(p.y - centre.y) + 24));
  return {
    x: centre.x,
    y: centre.y,
    zoom: readable
      ? Math.max(
          GRAPH_READABLE_ZOOM,
          Math.min(2.2, (width - 48) / (dx * 2), (height - 48) / (dy * 2)),
        )
      : Math.max(minOverviewZoom, Math.min(1.7, (width - 48) / (dx * 2), (height - 48) / (dy * 2))),
  };
}
