import type { MapKind } from "./workspace-map";
/** Shared semantics for the live canvas, SVG figures and legend. */
export function networkSymbolKind(node: { id: string; kind: string }): MapKind {
  if (node.kind === "expert") return "person";
  if (node.kind === "service") return "function";
  if (node.kind === "isrm" || node.kind === "core") return "core";
  if (node.id.startsWith("country:")) return "country";
  if (node.id.startsWith("expertise:") || node.kind === "theme") return "expertise";
  if (node.kind === "organisation") return "organisation";
  if (node.kind === "sector") return "sector";
  if (node.kind === "workflow") return "workflow";
  if (node.kind === "status") return "status";
  return "illustration";
}
