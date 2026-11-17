import type { MapKind } from "@/lib/workspace-map";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
export function GraphGlyph({ kind }: { kind: MapKind }) {
  const s = MAP_SYMBOLS[kind];
  return (
    <svg aria-hidden="true" className={"map-glyph is-" + kind} viewBox="-10 -10 20 20">
      <path
        d={mapSymbolPath(kind, 7)}
        fill={s.filled ? s.color : "none"}
        stroke={s.color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
