import type { Expert } from "./types";
import type { NetworkModel } from "./network-model";
import { serviceCovers, networkNeighborhood } from "./network-model";
export type Point = { x: number; y: number };
const hash = (s: string) => Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
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
): Map<string, Point> {
  const positions = new Map<string, Point>([["isrm", { x: 0, y: 0 }]]);
  const services = model.nodes.filter((n) => n.kind === "service");
  services.forEach((n, i) => {
    const angle = (i / services.length) * 2 * Math.PI - Math.PI / 2;
    positions.set(n.id, { x: Math.cos(angle) * 180, y: Math.sin(angle) * 180 });
  });
  const workflows = model.nodes.filter((n) => n.kind === "workflow");
  workflows.forEach((n, i) => {
    const a = (i / workflows.length) * 2 * Math.PI - Math.PI / 2;
    positions.set(n.id, { x: Math.cos(a) * 76, y: Math.sin(a) * 76 });
  });
  const categories = model.nodes.filter(
    (n) => !["expert", "isrm", "service", "workflow"].includes(n.kind),
  );
  const rings = new Map<number, typeof categories>();
  for (const node of categories) {
    const radius =
      mode === "services"
        ? 242
        : node.id.startsWith("expertise:")
          ? 230
          : node.id.startsWith("sector:")
            ? 310
            : node.id.startsWith("country:")
              ? 390
              : node.id.startsWith("organisation:")
                ? 350
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
  for (const n of model.nodes.filter((n) => n.kind === "expert")) {
    const owner =
      (mode === "services" ? assignedService(n.expert, active, disabled) : null) ?? "isrm";
    groups.set(owner, [...(groups.get(owner) ?? []), n.id]);
  }
  groups.forEach((ids, owner) =>
    ids.sort().forEach((id, i) => {
      const p = positions.get(owner) ?? { x: 0, y: 0 };
      const a = i * 2.399963;
      if (owner === "isrm") {
        const r = 38 + 22 * Math.sqrt(i + 1);
        positions.set(id, { x: Math.cos(a) * r, y: Math.sin(a) * r });
      } else {
        const out = Math.atan2(p.y, p.x),
          r = 11 * Math.sqrt(i + 1);
        positions.set(id, {
          x: p.x - Math.cos(out) * 48 + Math.cos(a) * r,
          y: p.y - Math.sin(out) * 48 + Math.sin(a) * r,
        });
      }
    }),
  );
  if (anchor !== "isrm" && model.nodes.some((n) => n.id === anchor)) {
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
    positions.set(anchor, { x: 0, y: 0 });
  }
  return positions;
}
export function fitGraphView(
  positions: Map<string, Point>,
  visibleIds: string[],
  anchor: string,
  width: number,
  height: number,
) {
  const centre = positions.get(anchor) ?? { x: 0, y: 0 };
  const pts = visibleIds.map((id) => positions.get(id)).filter((p): p is Point => !!p);
  const dx = Math.max(190, ...pts.map((p) => Math.abs(p.x - centre.x) + 24));
  const dy = Math.max(190, ...pts.map((p) => Math.abs(p.y - centre.y) + 24));
  return {
    x: centre.x,
    y: centre.y,
    zoom: Math.max(0.25, Math.min(1.7, (width - 48) / (dx * 2), (height - 48) / (dy * 2))),
  };
}
