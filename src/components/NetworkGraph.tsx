import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, { type ForceGraphMethods, type LinkObject } from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import {
  buildNetwork,
  relatedPeople,
  categoryNeighbors,
  type GraphLayers,
  type NetworkNode,
} from "@/lib/network-model";
export type { GraphLayers } from "@/lib/network-model";
type DrawLink = LinkObject<NetworkNode, { kind: string }>;
const endId = (v: string | number | NetworkNode | undefined): string =>
  typeof v === "object" ? v.id : String(v ?? "");
export default function NetworkGraph({
  experts,
  layers,
  focus,
  onFocus,
  serviceMode = false,
  locale = "en",
  motionPaused = false,
  activeServiceIds = [],
  onServiceSelect,
  onVisibleCount,
  anchor = "isrm",
  onAnchor,
  warningService,
  disabledServiceIds = [],
}: {
  experts: Expert[];
  layers: GraphLayers;
  focus: string | null;
  onFocus: (code: string | null) => void;
  serviceMode?: boolean;
  showExpertsOnServices?: boolean;
  locale?: string;
  motionPaused?: boolean;
  activeServiceIds?: string[];
  onServiceSelect?: (id: string) => void;
  onVisibleCount?: (count: number) => void;
  anchor?: string;
  onAnchor?: (id: string) => void;
  warningService?: string | null;
  disabledServiceIds?: string[];
}) {
  const wrap = useRef<HTMLDivElement>(null),
    fg = useRef<ForceGraphMethods<NetworkNode, { kind: string }> | undefined>(undefined),
    positions = useRef(new Map<string, NetworkNode>());
  const [size, setSize] = useState({ w: 800, h: 600 }),
    [hover, setHover] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const revealStarted = useRef(0);
  useEffect(() => {
    revealStarted.current = performance.now();
  }, [activeServiceIds, serviceMode]);
  const model = useMemo(() => buildNetwork(experts, layers, locale), [experts, layers, locale]);
  const selected = useMemo(() => activeServiceIds.map((s) => "svc:" + s), [activeServiceIds]);
  const covered = useMemo(() => relatedPeople(model, selected), [model, selected]);
  const category = useMemo(() => categoryNeighbors(model, anchor), [model, anchor]);
  const data = useMemo(() => {
    const nodes = model.nodes.map((n, i) => {
      const cached = positions.current.get(n.id);
      const a = i * 2.399963,
        r = n.kind === "expert" ? 180 + (i % 9) * 15 : n.kind === "service" ? 125 : 240;
      const v: NetworkNode = {
        ...n,
        x: cached?.x ?? Math.cos(a) * r,
        y: cached?.y ?? Math.sin(a) * r,
        vx: 0,
        vy: 0,
      };
      if (n.id === "isrm") {
        v.fx = anchor === "isrm" ? 0 : 270;
        v.fy = 0;
      }
      if (n.id === anchor) {
        v.fx = 0;
        v.fy = 0;
      }
      positions.current.set(n.id, v);
      return v;
    });
    return { nodes, links: model.links.map((l) => ({ ...l })) };
  }, [model, anchor]);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    onVisibleCount?.(model.nodes.filter((n) => n.kind === "expert").length);
  }, [model, onVisibleCount]);
  useEffect(() => {
    const f = fg.current;
    if (!f) return;
    f.d3Force("charge")?.["strength"]((n: NetworkNode) => (n.kind === "expert" ? -38 : -90));
    f.d3Force("link")
      ?.["distance"]((l: DrawLink) =>
        l.kind === "sample"
          ? 230
          : l.kind === "coverage"
            ? 145
            : l.kind === "architecture"
              ? 130
              : 65,
      )
      ["strength"]((l: DrawLink) =>
        l.kind === "coverage"
          ? serviceMode && selected.includes(endId(l.target))
            ? 0.16
            : 0.001
          : l.kind === "sample"
            ? 0.035
            : 0.3,
      );
    f.d3ReheatSimulation();
  }, [data, serviceMode, selected]);
  useEffect(() => {
    const f = fg.current;
    if (!f) return;
    f.centerAt(0, 0, motionPaused ? 0 : 1200);
    f.zoomToFit(motionPaused ? 0 : 1200, 70);
  }, [anchor, motionPaused]);
  useEffect(() => {
    if (!warningService) return;
    const t = setInterval(() => setTick((t) => t + 1), 300);
    return () => clearInterval(t);
  }, [warningService]);
  const isActive = (n: NetworkNode) =>
    !disabledServiceIds.includes(n.id.replace("svc:", "")) &&
    (layers.services !== false || !["service", "workflow"].includes(n.kind)) &&
    (n.id === "isrm" ||
      n.id === anchor ||
      n.id === focus ||
      n.id === hover ||
      (serviceMode
        ? n.kind === "service"
          ? selected.length === 0 || selected.includes(n.id)
          : n.kind === "workflow" || covered.has(n.id)
        : n.kind === "expert" ||
          n.kind === "organisation" ||
          (!["service", "workflow"].includes(n.kind) && category.has(n.id))));
  const colour = (n: NetworkNode) =>
    n.kind === "expert"
      ? "#87afa8"
      : n.kind === "organisation"
        ? "#c3d8dd"
        : n.kind === "service"
          ? "#d3c28c"
          : n.kind === "workflow" || n.kind === "isrm"
            ? "#e2d6ad"
            : "#8caebc";
  const warningPeople = useMemo(
    () => (warningService ? relatedPeople(model, ["svc:" + warningService]) : new Set<string>()),
    [model, warningService],
  );
  const radius = (n: NetworkNode) =>
    n.kind === "isrm"
      ? 13
      : n.kind === "expert"
        ? 4
        : n.kind === "workflow"
          ? 9
          : n.kind === "service"
            ? 7
            : 5 + Math.min(7, Math.sqrt(n.size));
  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      role="img"
      aria-label={
        locale === "uk"
          ? "Інтерактивна мапа наданих даних та запропонованих сервісів"
          : "Interactive map of supplied records and proposed services"
      }
    >
      <ForceGraph2D<NetworkNode, { kind: string }>
        ref={fg}
        width={size.w}
        height={size.h}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        warmupTicks={motionPaused ? 100 : 0}
        cooldownTicks={motionPaused ? 1 : 140}
        onEngineStop={() => {
          if (anchor === "isrm") fg.current?.zoomToFit(motionPaused ? 0 : 850, 70);
        }}
        nodeRelSize={1}
        nodeLabel={(n) => n.label}
        linkColor={(l: DrawLink) => {
          if (l.kind === "sample")
            return anchor === "isrm" ? "rgba(150,170,180,.045)" : "rgba(150,170,180,.015)";
          if (l.kind === "coverage")
            return serviceMode && selected.includes(endId(l.target))
              ? "rgba(200,185,125,.42)"
              : "rgba(130,150,160,.025)";
          return serviceMode && l.kind === "category"
            ? "rgba(130,150,160,.04)"
            : "rgba(150,175,185,.22)";
        }}
        linkWidth={(l: DrawLink) =>
          l.kind === "coverage" && selected.includes(endId(l.target)) ? 1.1 : 0.45
        }
        onNodeHover={(n) => setHover(n?.id ?? null)}
        onNodeClick={(n) => {
          if (n.kind === "service") {
            if (n.id === anchor) onServiceSelect?.(n.id.slice(4));
            else onAnchor?.(n.id);
            return;
          }
          if (n.kind === "workflow") {
            onAnchor?.(n.id);
            return;
          }
          if (n.id === anchor && n.kind === "expert") {
            onFocus(n.id);
            return;
          }
          onAnchor?.(n.id);
        }}
        onBackgroundClick={() => onFocus(null)}
        nodePointerAreaPaint={(n, c, ctx) => {
          if (n.x === undefined || n.y === undefined) return;
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius(n) + 5, 0, Math.PI * 2);
          ctx.fill();
        }}
        nodeCanvasObject={(n, ctx, scale) => {
          if (n.x === undefined || n.y === undefined) return;
          const active = isActive(n),
            warning =
              warningService &&
              ("svc:" + warningService === n.id ||
                (n.kind === "expert" && warningPeople.has(n.id)));
          ctx.save();
          const arrival =
            !motionPaused && serviceMode && n.kind === "expert" && covered.has(n.id)
              ? Math.max(
                  0,
                  Math.min(
                    1,
                    (performance.now() - revealStarted.current - ((n.expert?.id ?? 0) % 8) * 70) /
                      450,
                  ),
                )
              : 1;
          ctx.globalAlpha = warning
            ? 0.45 + (tick % 2) * 0.3
            : active
              ? 0.18 + 0.82 * arrival
              : 0.18;
          const r = radius(n),
            col = warning ? "#c5a583" : colour(n);
          ctx.beginPath();
          if (n.kind === "organisation") {
            ctx.moveTo(n.x, n.y - r);
            ctx.lineTo(n.x + r, n.y);
            ctx.lineTo(n.x, n.y + r);
            ctx.lineTo(n.x - r, n.y);
            ctx.closePath();
          } else ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.lineWidth = 1.3 / scale;
          ctx.strokeStyle = col;
          ctx.fillStyle = n.kind === "expert" ? col : "#0d2330";
          ctx.fill();
          ctx.stroke();
          if (n.id === anchor || n.id === focus) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 4 / scale, 0, Math.PI * 2);
            ctx.stroke();
          }
          const label =
            n.kind === "expert"
              ? n.id === anchor || n.id === focus || n.id === hover
              : active || n.id === hover;
          if (label) {
            ctx.font = `${n.kind === "isrm" ? 700 : 500} ${Math.max(11 / scale, 4)}px "Space Grotesk",sans-serif`;
            ctx.fillStyle = "#e9e4d6";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(
              n.label.length > 42 ? n.label.slice(0, 40) + "…" : n.label,
              n.x,
              n.y - r - 5 / scale,
            );
          }
          ctx.restore();
        }}
      />
    </div>
  );
}
