import { useEffect, useMemo, useRef, useState } from "react";
import { briefingApproach, expansionProgress, briefingGroups } from "@/lib/network-presentation";
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
  const [elapsed, setElapsed] = useState(reducedMotion ? 4000 : 0);
  const progress = useRef(reducedMotion ? 4000 : 0);
  useEffect(() => {
    if (reducedMotion || progress.current >= 4000) return;
    let raf = 0;
    const start = performance.now() - progress.current;
    const frame = (now: number) => {
      progress.current = Math.min(4000, now - start);
      setElapsed(progress.current);
      if (progress.current < 4000) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);
  const approach = briefingApproach(elapsed);
  const groups = useMemo(() => briefingGroups(experts, slide), [experts, slide]);
  return (
    <svg
      className={`briefing-peripheral-network ${reducedMotion ? "is-still" : ""}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g
        className="briefing-network-assembly"
        transform={`translate(720 450) scale(${approach.scale}) translate(-720 -450)`}
      >
        {groups.map(([category, members], i) => {
          const [cx, cy] = anchors[(i + slide) % anchors.length]!;
          return (
            <g key={`${slide}:${category}`} className="briefing-network-cluster">
              {members.map((e) => {
                const seed = hash(e.code + category),
                  a = (seed % 628) / 100,
                  r = (55 + (seed % 125)) * (0.3 + 0.7 * expansionProgress(elapsed, i * 30)),
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
