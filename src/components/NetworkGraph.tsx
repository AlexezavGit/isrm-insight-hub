import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, { type ForceGraphMethods, type LinkObject } from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import {
  buildNetwork,
  relatedPeople,
  networkNeighborhood,
  type GraphLayers,
  type NetworkNode,
} from "@/lib/network-model";
import { layoutNetwork, fitGraphView, assignedService } from "@/lib/network-layout";
export type { GraphLayers } from "@/lib/network-model";
type DrawLink = LinkObject<NetworkNode, { kind: string }>;
const endId = (v: string | number | NetworkNode | undefined) =>
  typeof v === "object" ? v.id : String(v ?? "");
export default function NetworkGraph({
  experts,
  layers,
  referenceSelection,
  focus,
  onFocus,
  serviceMode = false,
  live = false,
  locale = "en",
  motionPaused = false,
  activeServiceIds = [],
  onServiceSelect,
  onWorkflowSelect,
  onVisibleCount,
  anchor = "isrm",
  onAnchor,
  warningService,
  disabledServiceIds = [],
}: {
  experts: Expert[];
  layers: GraphLayers;
  referenceSelection?: Parameters<typeof buildNetwork>[3];
  focus: string | null;
  onFocus: (id: string | null) => void;
  serviceMode?: boolean;
  live?: boolean;
  showExpertsOnServices?: boolean;
  locale?: string;
  motionPaused?: boolean;
  activeServiceIds?: string[];
  onServiceSelect?: (id: string) => void;
  onWorkflowSelect?: (id: string) => void;
  onVisibleCount?: (count: number) => void;
  anchor?: string;
  onAnchor?: (id: string) => void;
  warningService?: string | null;
  disabledServiceIds?: string[];
}) {
  const wrap = useRef<HTMLDivElement>(null),
    fg = useRef<ForceGraphMethods<NetworkNode, { kind: string }> | undefined>(undefined);
  const cache = useRef(new Map<string, NetworkNode>()),
    revealStarted = useRef(0);
  const [size, setSize] = useState({ w: 800, h: 600 }),
    [hover, setHover] = useState<string | null>(null),
    [preview, setPreview] = useState<string | null>(null);
  const model = useMemo(
    () => buildNetwork(experts, layers, locale, referenceSelection),
    [experts, layers, locale, referenceSelection],
  );
  const effective = useMemo(
    () => activeServiceIds.filter((id) => !disabledServiceIds.includes(id)),
    [activeServiceIds, disabledServiceIds],
  );
  const covered = useMemo(
    () =>
      relatedPeople(
        model,
        effective.map((s) => "svc:" + s),
      ),
    [model, effective],
  );
  const points = useMemo(
    () =>
      layoutNetwork(
        model,
        serviceMode ? "services" : "people",
        effective,
        disabledServiceIds,
        anchor,
      ),
    [model, serviceMode, effective, disabledServiceIds, anchor],
  );
  const neighborhood = useMemo(
    () => (anchor !== "isrm" ? networkNeighborhood(model, anchor, disabledServiceIds) : null),
    [model, anchor, disabledServiceIds],
  );
  const neighborhoodEdges = useMemo(
    () => new Set(neighborhood?.links.map((l) => l.source + "\0" + l.target + "\0" + l.kind)),
    [neighborhood],
  );
  const data = useMemo(
    () => ({
      nodes: model.nodes
        .filter((n) => !live || !["service", "workflow"].includes(n.kind))
        .map((n) => {
          const prev = cache.current.get(n.id),
            p = points.get(n.id) ?? { x: 0, y: 0 };
          const item: NetworkNode = {
            ...n,
            x: prev?.x ?? (live && !motionPaused ? p.x * 3.5 : p.x),
            y: prev?.y ?? (live && !motionPaused ? p.y * 3.5 : p.y),
          };
          if (!live) {
            item.fx = prev?.x ?? p.x;
            item.fy = prev?.y ?? p.y;
          }
          if (n.kind === "isrm") Object.assign(item, { x: 0, y: 0, fx: 0, fy: 0, vx: 0, vy: 0 });
          cache.current.set(n.id, item);
          return item;
        }),
      links: model.links
        .filter((l) => !live || ["category", "sample"].includes(l.kind))
        .map((l) => ({ ...l })),
    }),
    [model, points, live, motionPaused],
  );
  const visible = useMemo(
    () =>
      neighborhood
        ? new Set(neighborhood.distances.keys())
        : new Set(
            model.nodes
              .filter((n) =>
                serviceMode
                  ? ["isrm", "service", "workflow"].includes(n.kind) ||
                    (n.kind === "expert" && covered.has(n.id))
                  : !["service", "workflow"].includes(n.kind),
              )
              .map((n) => n.id),
          ),
    [model, serviceMode, covered, neighborhood],
  );
  const selectedNode = model.nodes.find((n) => n.id === preview && visible.has(n.id));
  const warningPeople = useMemo(
    () => (warningService ? relatedPeople(model, ["svc:" + warningService]) : new Set<string>()),
    [model, warningService],
  );
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    onVisibleCount?.(
      neighborhood
        ? model.nodes.filter((n) => n.kind === "expert" && visible.has(n.id)).length
        : serviceMode
          ? covered.size
          : experts.filter((e) => e.verified || layers.researchQueue).length,
    );
  }, [
    serviceMode,
    covered,
    experts,
    layers.researchQueue,
    onVisibleCount,
    neighborhood,
    model,
    visible,
  ]);
  useEffect(() => {
    revealStarted.current = performance.now();
    if (live) {
      if (motionPaused) return;
      fg.current?.d3Force("link")?.["distance"](95)["strength"](0.035);
      fg.current?.d3Force("charge")?.["strength"](-85);
      fg.current?.d3ReheatSimulation();
      return;
    }
    let raf = 0;
    const start = performance.now(),
      duration = motionPaused ? 0 : 1100;
    const from = new Map(data.nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]));
    const frame = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1,
        ease = 1 - Math.pow(1 - t, 3);
      for (const n of data.nodes) {
        const a = from.get(n.id)!,
          b = points.get(n.id)!;
        n.x = a.x + (b.x - a.x) * ease;
        n.y = a.y + (b.y - a.y) * ease;
        n.fx = n.x;
        n.fy = n.y;
      }
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [data, points, motionPaused, live]);
  // Explicit concentrator choices and viewport changes move the camera; inspecting never does.
  useEffect(() => {
    const view = fitGraphView(points, [...visible], anchor, size.w, size.h);
    fg.current?.centerAt(view.x, view.y, motionPaused ? 0 : 650);
    fg.current?.zoom(view.zoom, motionPaused ? 0 : 650);
    // Selection changes only surface people around the fixed wheel; they must not refit it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor, size.w, size.h, serviceMode, motionPaused, live]);
  useEffect(() => {
    if (preview && !visible.has(preview)) setPreview(null);
  }, [visible, preview]);
  const radius = (n: NetworkNode) =>
    n.kind === "isrm"
      ? 16
      : n.kind === "service"
        ? 11
        : n.kind === "workflow"
          ? 10
          : n.kind === "expert"
            ? 4.6
            : 8;
  const colour = (n: NetworkNode) =>
    ({
      expert: "#87c1b4",
      organisation: "#9ec9e8",
      service: "#d2b66f",
      workflow: "#79a8d4",
      isrm: "#e7d8a4",
      sector: "#b0a4d1",
      theme: "#87b6c3",
      hub: "#a3c7a7",
    })[n.kind];
  const shape = (n: NetworkNode, ctx: CanvasRenderingContext2D, r: number) => {
    const x = n.x ?? 0,
      y = n.y ?? 0;
    ctx.beginPath();
    if (n.kind === "organisation") {
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.closePath();
    } else if (n.kind === "service") {
      ctx.roundRect(x - r, y - r * 0.8, r * 2, r * 1.6, 3);
    } else if (n.kind === "workflow") {
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = x + Math.cos(a) * r,
          py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else ctx.arc(x, y, r, 0, Math.PI * 2);
  };
  return (
    <div
      ref={wrap}
      className="absolute inset-0"
      role="group"
      aria-label={locale === "uk" ? "Інтерактивна мапа мережі" : "Interactive network map"}
    >
      <ForceGraph2D<NetworkNode, { kind: string }>
        ref={fg}
        width={size.w}
        height={size.h}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel={() => ""}
        warmupTicks={0}
        cooldownTicks={live && !motionPaused ? Infinity : 0}
        d3VelocityDecay={0.65}
        d3AlphaDecay={0.02}
        autoPauseRedraw={false}
        enableNodeDrag={live}
        onNodeDrag={(node) => {
          if (node.kind === "isrm") Object.assign(node, { x: 0, y: 0, fx: 0, fy: 0, vx: 0, vy: 0 });
        }}
        onNodeDragEnd={(node) => {
          if (node.kind === "isrm") Object.assign(node, { x: 0, y: 0, fx: 0, fy: 0, vx: 0, vy: 0 });
          if (!motionPaused) fg.current?.d3ReheatSimulation();
        }}
        minZoom={0.3}
        maxZoom={3}
        nodeVisibility={(n) => visible.has(n.id)}
        linkVisibility={(l: DrawLink) => {
          const s = endId(l.source),
            t = endId(l.target);
          if (!visible.has(s) || !visible.has(t)) return false;
          if (neighborhood) return neighborhoodEdges.has(s + "\0" + t + "\0" + l.kind);
          if (l.kind === "coverage") {
            const n = model.nodes.find((n) => n.id === s);
            return serviceMode && assignedService(n?.expert, effective, disabledServiceIds) === t;
          }
          return serviceMode
            ? l.kind === "architecture"
            : l.kind === "category" || l.kind === "sample";
        }}
        linkColor={(l: DrawLink) =>
          l.kind === "coverage"
            ? "rgba(216,188,112,.38)"
            : l.kind === "architecture"
              ? "rgba(144,177,204,.24)"
              : "rgba(145,181,196,.28)"
        }
        linkWidth={(l: DrawLink) => (l.kind === "sample" ? 0.4 : 0.7)}
        linkLineDash={(l: DrawLink) => (l.kind === "sample" ? [2, 5] : null)}
        onRenderFramePre={(ctx, scale) => {
          if (!serviceMode || neighborhood) return;
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, 180, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(173,199,216,.3)";
          ctx.lineWidth = 1 / scale;
          ctx.stroke();
          const a = motionPaused ? -0.5 : performance.now() / 5000;
          ctx.beginPath();
          ctx.arc(0, 0, 180, a, a + 0.55);
          ctx.strokeStyle = "rgba(222,205,149,.8)";
          ctx.lineWidth = 3 / scale;
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.restore();
        }}
        onNodeHover={(n) => setHover(n?.id ?? null)}
        onNodeClick={(n) => {
          if (n.kind === "service") {
            setPreview(n.id);
            onServiceSelect?.(n.id.slice(4));
          } else if (n.kind === "workflow") {
            setPreview(null);
            onWorkflowSelect?.(n.id.slice(9));
          } else setPreview(n.id);
        }}
        onBackgroundClick={() => {
          setPreview(null);
          onFocus(null);
        }}
        nodePointerAreaPaint={(n, c, ctx, scale) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(n.x ?? 0, n.y ?? 0, Math.max(radius(n) + 4, 13 / scale), 0, Math.PI * 2);
          ctx.fill();
        }}
        nodeCanvasObject={(n, ctx, scale) => {
          if (n.x === undefined || n.y === undefined) return;
          const selected =
            n.id === hover ||
            n.id === preview ||
            n.id === focus ||
            n.id === anchor ||
            (n.kind === "service" && effective.includes(n.id.slice(4)));
          const warning =
            warningService && ("svc:" + warningService === n.id || warningPeople.has(n.id));
          const age = performance.now() - revealStarted.current,
            delay = ((n.expert?.id ?? 0) % 8) * 70;
          const rise = motionPaused ? 1 : Math.max(0, Math.min(1, (age - delay) / 550));
          ctx.save();
          ctx.globalAlpha = disabledServiceIds.includes(n.id.slice(4))
            ? 0.16
            : n.kind === "expert" && serviceMode
              ? rise
              : 1;
          if (warning && !motionPaused)
            ctx.globalAlpha *= 0.65 + 0.25 * Math.sin(performance.now() / 220);
          const r = radius(n);
          shape(n, ctx, r);
          ctx.fillStyle = n.kind === "expert" ? colour(n) : "#102c3c";
          ctx.strokeStyle = selected ? "#f1deb1" : colour(n);
          ctx.lineWidth = (selected ? 2 : 1.4) / scale;
          ctx.fill();
          ctx.stroke();
          if (selected) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 4 / scale, 0, Math.PI * 2);
            ctx.strokeStyle = colour(n);
            ctx.lineWidth = 1 / scale;
            ctx.stroke();
          }
          if (n.id === anchor || n.id === hover || n.id === preview) {
            const label = n.label.length > 35 ? n.label.slice(0, 33) + "…" : n.label;
            const detail = n.kind === "expert" ? n.expert?.primaryExpertise : undefined;
            ctx.font = `600 ${13 / scale}px "Space Grotesk",sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            const w = Math.min(260, Math.max(65, label.length * 7.2)) / scale;
            ctx.fillStyle = "rgba(8,24,36,.94)";
            ctx.fillRect(
              n.x - w / 2 - 5 / scale,
              n.y - r - (detail ? 44 : 25) / scale,
              w + 10 / scale,
              (detail ? 39 : 21) / scale,
            );
            ctx.fillStyle = "#f4eee1";
            ctx.fillText(label, n.x, n.y - r - (detail ? 24 : 8) / scale);
            if (detail) {
              ctx.font = `${11 / scale}px "IBM Plex Sans",sans-serif`;
              ctx.fillStyle = "#b8d2d7";
              ctx.fillText(
                detail.length > 42 ? detail.slice(0, 40) + "…" : detail,
                n.x,
                n.y - r - 8 / scale,
              );
            }
          }
          ctx.restore();
        }}
      />
      {selectedNode && (
        <aside
          className="network-node-preview"
          aria-label={locale === "uk" ? "Обраний вузол" : "Selected node"}
        >
          <strong>{selectedNode.label}</strong>
          {selectedNode.expert && <p>{selectedNode.expert.primaryExpertise}</p>}
          <div>
            {selectedNode.kind === "expert" && (
              <button
                onClick={() => {
                  onFocus(selectedNode.id);
                  setPreview(null);
                }}
              >
                {locale === "uk" ? "Відкрити досьє" : "Open dossier"}
              </button>
            )}
            <button
              onClick={() => {
                onAnchor?.(selectedNode.id);
                setPreview(null);
              }}
            >
              {locale === "uk" ? "Дослідити зв’язки" : "Explore connections"}
            </button>
            <button onClick={() => setPreview(null)}>
              {locale === "uk" ? "Назад до графа" : "Back to graph"}
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
