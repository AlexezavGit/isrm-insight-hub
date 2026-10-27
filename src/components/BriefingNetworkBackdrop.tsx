import { useMemo, type CSSProperties } from "react";
import type { Expert } from "@/lib/types";

const anchors = [
  [300, 250],
  [1140, 270],
  [320, 660],
  [1120, 650],
  [550, 180],
  [900, 180],
  [540, 750],
  [910, 750],
] as const;
const hash = (value: string) =>
  Array.from(value).reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
/** Decorative views of actual categorical relationships in the supplied sample.
 * No identity, reputation or chapter participation is inferred by the drawing.
 */
export function BriefingNetworkBackdrop({
  experts,
  slide,
  reducedMotion,
}: {
  experts: Expert[];
  slide: number;
  reducedMotion: boolean;
}) {
  const groups = useMemo(() => {
    const field =
      (
        [
          "sector",
          "ukraineCategory",
          "communityRole",
          "sector",
          "communityRole",
          "ukraineCategory",
        ] as const
      )[slide] ?? "sector";
    const map = new Map<string, Expert[]>();
    experts.forEach((e) => {
      const category = e[field];
      if (
        !category ||
        [
          "Unclassified",
          "Не оцінено",
          "Ukraine-related experience",
          "Member / participant",
        ].includes(category)
      )
        return;
      map.set(category, [...(map.get(category) ?? []), e]);
    });
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 8);
  }, [experts, slide]);
  return (
    <svg
      className={`briefing-peripheral-network ${reducedMotion ? "is-still" : ""}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g key={`${slide}:${experts.length}`} className="briefing-network-assembly">
        {groups.map(([category, members], i) => {
          const [cx, cy] = anchors[i]!;
          return (
            <g
              key={`${slide}:${category}`}
              className="briefing-network-cluster"
              style={
                {
                  "--arrival-x": `${cx < 720 ? -180 : 180}px`,
                  "--arrival-y": `${cy < 450 ? -80 : 80}px`,
                } as CSSProperties
              }
            >
              {members.map((e) => {
                const seed = hash(e.code + category),
                  a = (seed % 628) / 100,
                  r = 55 + (seed % 125),
                  x = cx + Math.cos(a) * r,
                  y = cy + Math.sin(a) * r;
                return (
                  <g key={e.code}>
                    <line x1={cx} y1={cy} x2={x} y2={y} />
                    <circle cx={x} cy={y} r={2 + (seed % 3)} />
                  </g>
                );
              })}
              <circle className="briefing-network-hub" cx={cx} cy={cy} r="8" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
