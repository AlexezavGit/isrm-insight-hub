import type { MapKind } from "./workspace-map";
export const MAP_SYMBOLS: Record<
  MapKind,
  {
    shape: "circle" | "square" | "rounded" | "diamond" | "triangle" | "hexagon" | "core";
    color: string;
    filled: boolean;
  }
> = {
  person: { shape: "circle", color: "#92c8ba", filled: true },
  organisation: { shape: "square", color: "#d2bd70", filled: false },
  country: { shape: "circle", color: "#d2bd70", filled: false },
  expertise: { shape: "hexagon", color: "#e0c16d", filled: false },
  sector: { shape: "triangle", color: "#a6b2d2", filled: false },
  status: { shape: "diamond", color: "#e4c48b", filled: false },
  function: { shape: "rounded", color: "#d2bd70", filled: false },
  workflow: { shape: "hexagon", color: "#8eb9d6", filled: false },
  core: { shape: "core", color: "#78d4c2", filled: false },
  illustration: { shape: "circle", color: "#92c8ba", filled: true },
};

export const PEOPLE_MAP_NODE_STYLES: Partial<
  Record<MapKind, { radius: number; fill: string; strokeWidth: number }>
> = {
  country: { radius: 12, fill: "#294c55", strokeWidth: 2.2 },
  expertise: { radius: 8.5, fill: "#443b28", strokeWidth: 1.6 },
  sector: { radius: 8, fill: "#354364", strokeWidth: 1.8 },
  organisation: { radius: 7, fill: "#223d47", strokeWidth: 1.4 },
};
export const PUBLIC_REPRESENTATIVE_OUTLINE = "#e5c66b";
/** Shared geometry for the actual map and its legend/slips. */
export function mapSymbolPath(kind: MapKind, r: number) {
  return rawMapSymbolPath(kind, r).replace(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi, (value) =>
    String(Math.round(Number(value) * 1000) / 1000),
  );
}
function rawMapSymbolPath(kind: MapKind, r: number) {
  const shape = MAP_SYMBOLS[kind].shape;
  if (shape === "circle") return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0`;
  if (shape === "diamond") return `M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`;
  if (shape === "triangle") return `M 0 ${-r} L ${r} ${r} L ${-r} ${r} Z`;
  if (shape === "hexagon")
    return (
      Array.from(
        { length: 6 },
        (_, i) =>
          `${i ? "L" : "M"} ${Math.cos((i * Math.PI) / 3) * r} ${Math.sin((i * Math.PI) / 3) * r}`,
      ).join(" ") + " Z"
    );
  if (shape === "core") {
    const hexagon = (radius: number) =>
      Array.from(
        { length: 6 },
        (_, i) =>
          `${i ? "L" : "M"} ${Math.cos((i * Math.PI) / 3) * radius} ${Math.sin((i * Math.PI) / 3) * radius}`,
      ).join(" ") + " Z";
    return hexagon(r) + " " + hexagon(r * 0.58);
  }
  if (shape === "rounded") {
    const c = Math.min(3, r / 2);
    return `M ${-r + c} ${-r} H ${r - c} Q ${r} ${-r} ${r} ${-r + c} V ${r - c} Q ${r} ${r} ${r - c} ${r} H ${-r + c} Q ${-r} ${r} ${-r} ${r - c} V ${-r + c} Q ${-r} ${-r} ${-r + c} ${-r} Z`;
  }
  return `M ${-r} ${-r} H ${r} V ${r} H ${-r} Z`;
}
