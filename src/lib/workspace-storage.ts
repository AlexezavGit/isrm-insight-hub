import type { Filters } from "./filters";
import { DEFAULT_MAP_LAYERS, type MapLayers } from "./workspace-map";
export type StatusCriteria = Record<"ai" | "peer" | "membership" | "chapter", string> &
  Partial<Record<"source" | "organisation", string>>;
export interface SavedWorkspaceMap {
  id: string;
  name: string;
  filters: Filters;
  layers: MapLayers;
  status: StatusCriteria;
  image: string;
  codes: string[];
  anchor?: string;
}
export function readWorkspaceMaps(raw: string | null): SavedWorkspaceMap[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw Error("Invalid saved map collection");
  return parsed.map((x: unknown) => {
    if (!x || typeof x !== "object") throw Error("Invalid saved map");
    const s = x as Record<string, unknown>,
      f = s["filters"] as Record<string, unknown> | undefined,
      l = s["layers"] as Record<string, unknown> | undefined,
      v = s["status"] as Record<string, unknown> | undefined;
    if (
      typeof s["id"] !== "string" ||
      typeof s["name"] !== "string" ||
      typeof s["image"] !== "string" ||
      (s["image"] && !s["image"].startsWith("data:image/png;base64,")) ||
      (s["anchor"] !== undefined && typeof s["anchor"] !== "string") ||
      !Array.isArray(s["codes"]) ||
      !s["codes"].every((c) => typeof c === "string") ||
      !f ||
      !["q", "country", "sector", "role", "theme"].every((k) => typeof f[k] === "string") ||
      !["all", "verified", "queue"].includes(String(f["verified"])) ||
      !l ||
      !Object.keys(DEFAULT_MAP_LAYERS).every((k) => typeof l[k] === "boolean") ||
      !v ||
      !["ai", "peer", "membership", "chapter"].every((k) =>
        ["any", "yes", "unknown"].includes(String(v[k])),
      )
    )
      throw Error("Invalid saved map");
    for (const key of ["source", "organisation"])
      if (v[key] !== undefined && !["any", "yes", "unknown"].includes(String(v[key])))
        throw Error("Invalid status criterion");
    for (const key of ["organization", "expertise", "reviewStatus"])
      if (f[key] !== undefined && typeof f[key] !== "string")
        throw Error("Invalid optional criterion");
    return x as SavedWorkspaceMap;
  });
}
