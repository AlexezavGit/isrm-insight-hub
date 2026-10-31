import { directNeighbours, expansionProgress } from "@/lib/network-presentation";
import { rotatePoint } from "@/lib/network-experience";
import { RotateCw, Scan, Info } from "lucide-react";
import { NetworkConnectionPath } from "./NetworkConnectionPath";
import { MovableNodeActions } from "./MovableNodeActions";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ForceGraph2D, { type ForceGraphMethods, type LinkObject } from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import {
  buildNetwork,
  relatedPeople,
  networkNeighborhood,
  type GraphLayers,
  type NetworkNode,
} from "@/lib/network-model";
import { layoutNetwork, fitGraphView, GRAPH_LABEL_ZOOM } from "@/lib/network-layout";
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
  highlightedService,
  coachNode,
  highlightedPath = [],
  onServiceExclude,
  onServiceSelect,
  onWorkflowSelect,
  onWorkflowDismiss,
  workflowHint,
  workflowInfoId,
  onPath,
  showConnectionPath = true,
  readableExpansions = true,
  onVisibleCount,
  anchor = "isrm",
  onAnchor,
  warningService,
  warningPeopleIds,
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
  highlightedService?: string | null;
  coachNode?: string | null;
  highlightedPath?: string[];
  onServiceExclude?: (id: string) => void;
  onServiceSelect?: (id: string) => void;
  onWorkflowSelect?: (id: string) => void;
  onWorkflowDismiss?: (() => void) | undefined;
  workflowHint?: ReactNode;
  workflowInfoId?: string | null;
  onPath?: (ids: string[]) => void;
  showConnectionPath?: boolean;
  readableExpansions?: boolean;
  onVisibleCount?: (count: number) => void;
  anchor?: string;
  onAnchor?: (id: string) => void;
  warningService?: string | null;
  warningPeopleIds?: string[];
  disabledServiceIds?: string[];
}) {
  const wrap = useRef<HTMLDivElement>(null),
    fg = useRef<ForceGraphMethods<NetworkNode, { kind: string }> | undefined>(undefined);
  const cache = useRef(new Map<string, NetworkNode>()),
    revealStarted = useRef(0),
    liveExpanded = useRef(false);
  const coachTarget = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [rotationMode, setRotationMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
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
  const [departing, setDeparting] = useState<Map<string, { time: number; order: number }>>(
    new Map(),
  );
  const previousCoverage = useRef(new Set<string>());
  useEffect(() => {
    const lost = [...previousCoverage.current].filter((id) => !covered.has(id));
    previousCoverage.current = new Set(covered);
    if (!serviceMode || motionPaused) {
      setDeparting(new Map());
      return;
    }
    const now = performance.now();
    setDeparting(
      (current) =>
        new Map(
          [...current]
            .filter(([id]) => !covered.has(id))
            .concat(lost.map((id, order) => [id, { time: now, order }] as const)),
        ),
    );
    const timer = window.setTimeout(() => setDeparting(new Map()), 3000);
    return () => window.clearTimeout(timer);
  }, [covered, serviceMode, motionPaused]);
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
            x: prev?.x ?? (live ? 0 : p.x),
            y: prev?.y ?? (live ? 0 : p.y),
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
    [model, points, live],
  );
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setHighContrast(root.classList.contains("client-high-contrast"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let previousGesture = 0;
    const rotate = (delta: number) => {
      angle.current += delta;
      for (const node of data.nodes) {
        if (node.kind === "isrm") continue;
        const p = rotatePoint({ x: node.x ?? 0, y: node.y ?? 0 }, delta);
        node.x = p.x;
        node.y = p.y;
        if (node.fx !== undefined) {
          node.fx = p.x;
          node.fy = p.y;
        }
        if (node.vx !== undefined || node.vy !== undefined) {
          const velocity = rotatePoint({ x: node.vx ?? 0, y: node.vy ?? 0 }, delta);
          node.vx = velocity.x;
          node.vy = velocity.y;
        }
      }
    };
    const wheel = (event: WheelEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".network-workflow-hint,.network-graph-path,.network-graph-view-tools")
      )
        return;
      if (!rotationMode || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      rotate(Math.max(-0.18, Math.min(0.18, (event.deltaX + event.deltaY) * 0.003)));
    };
    const start = () => {
      previousGesture = 0;
    };
    const change = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".network-workflow-hint,.network-graph-path")
      )
        return;
      const gesture = event as Event & { rotation?: number };
      if (!rotationMode || typeof gesture.rotation !== "number") return;
      const next = (gesture.rotation * Math.PI) / 180,
        delta = next - previousGesture;
      previousGesture = next;
      if (Math.abs(delta) < 0.001) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      rotate(delta);
    };
    el.addEventListener("wheel", wheel, { capture: true, passive: false });
    el.addEventListener("gesturestart", start, { capture: true });
    el.addEventListener("gesturechange", change, { capture: true, passive: false });
    return () => {
      el.removeEventListener("wheel", wheel, true);
      el.removeEventListener("gesturestart", start, true);
      el.removeEventListener("gesturechange", change, true);
    };
  }, [data, rotationMode]);
  const visible = useMemo(
    () =>
      neighborhood
        ? new Set(neighborhood.distances.keys())
        : new Set(
            model.nodes
              .filter((n) =>
                serviceMode
                  ? ["isrm", "service", "workflow"].includes(n.kind) ||
                    (n.kind === "expert" && (covered.has(n.id) || departing.has(n.id)))
                  : !["service", "workflow"].includes(n.kind),
              )
              .map((n) => n.id),
          ),
    [model, serviceMode, covered, departing, neighborhood],
  );
  const visibleEdges = useMemo(
    () =>
      model.links.filter((link) => {
        const { source, target, kind } = link;
        if (!visible.has(source) || !visible.has(target)) return false;
        if (neighborhood) return neighborhoodEdges.has(source + "\0" + target + "\0" + kind);
        if (kind === "coverage") {
          return serviceMode && effective.some((id) => "svc:" + id === target);
        }
        return serviceMode ? kind === "architecture" : kind === "category" || kind === "sample";
      }),
    [model, visible, neighborhood, neighborhoodEdges, serviceMode, effective],
  );
  const visibleEdgeIds = useMemo(
    () => new Set(visibleEdges.map((link) => link.source + "\0" + link.target + "\0" + link.kind)),
    [visibleEdges],
  );
  const hoverNeighbours = useMemo(
    () => directNeighbours(visibleEdges, hover),
    [visibleEdges, hover],
  );
  const selectedNode = model.nodes.find((n) => n.id === preview && visible.has(n.id));
  const warningPeople = useMemo(
    () =>
      warningPeopleIds
        ? new Set(warningPeopleIds)
        : warningService
          ? new Set(
              [...covered].filter(
                (id) =>
                  !relatedPeople(
                    model,
                    effective.filter((s) => s !== warningService).map((s) => "svc:" + s),
                  ).has(id),
              ),
            )
          : new Set<string>(),
    [model, warningService, warningPeopleIds, covered, effective],
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
    let raf = 0;
    if (live) {
      if (motionPaused) {
        for (const node of data.nodes) Object.assign(node, { fx: node.x, fy: node.y });
        return;
      }
      const release = () => {
        for (const node of data.nodes) {
          if (node.kind === "isrm") continue;
          delete node.fx;
          delete node.fy;
        }
        fg.current?.d3Force("link")?.["distance"](95)["strength"](0.035);
        fg.current?.d3Force("charge")?.["strength"](-85);
        fg.current?.d3ReheatSimulation();
      };
      if (liveExpanded.current) {
        release();
        return;
      }
      // Pin the opening to one point, then hand the settled arrangement to D3.
      for (const node of data.nodes)
        Object.assign(node, { x: 0, y: 0, fx: 0, fy: 0, vx: 0, vy: 0 });
      const start = performance.now();
      const unfold = (now: number) => {
        const elapsed = now - start;
        data.nodes.forEach((node, index) => {
          if (node.kind === "isrm") return;
          const target = rotatePoint(points.get(node.id)!, angle.current);
          const progress = expansionProgress(elapsed, (index % 7) * 30);
          Object.assign(node, {
            x: target.x * progress,
            y: target.y * progress,
            fx: target.x * progress,
            fy: target.y * progress,
          });
        });
        if (elapsed < 3000) raf = requestAnimationFrame(unfold);
        else {
          liveExpanded.current = true;
          release();
        }
      };
      raf = requestAnimationFrame(unfold);
      return () => cancelAnimationFrame(raf);
    }
    liveExpanded.current = false;
    const start = performance.now(),
      duration = motionPaused ? 0 : 1100;
    const from = new Map(data.nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]));
    const frame = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1,
        ease = 1 - Math.pow(1 - t, 3);
      for (const n of data.nodes) {
        const a = from.get(n.id)!,
          b = rotatePoint(points.get(n.id)!, angle.current);
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
  const cameraArrangement = readableExpansions ? points : null;
  // The configurator retains its historical fit; the prototype opens at reading scale.
  useEffect(() => {
    const view = fitGraphView(points, [...visible], anchor, size.w, size.h, readableExpansions);
    fg.current?.centerAt(view.x, view.y, motionPaused ? 0 : 650);
    fg.current?.zoom(view.zoom, motionPaused ? 0 : 650);
    // Coverage changes do not enter this dependency list, keeping the service wheel stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    anchor,
    size.w,
    size.h,
    serviceMode,
    motionPaused,
    live,
    cameraArrangement,
    readableExpansions,
  ]);
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
      expert: highContrast ? "#a9ffe2" : "#87c1b4",
      organisation: highContrast ? "#c0e4ff" : "#9ec9e8",
      service: "#d2b66f",
      workflow: "#79a8d4",
      isrm: "#e7d8a4",
      sector: highContrast ? "#dfc8ff" : "#b0a4d1",
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
      className="network-graph absolute inset-0"
      role="group"
      aria-label={locale === "uk" ? "Інтерактивна мапа мережі" : "Interactive network map"}
    >
      <ForceGraph2D<NetworkNode, { kind: string }>
        ref={fg}
        width={size.w}
        height={size.h}
        graphData={data}
        backgroundColor={highContrast ? "#03111b" : "rgba(0,0,0,0)"}
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
        linkVisibility={(link: DrawLink) =>
          visibleEdgeIds.has(endId(link.source) + "\0" + endId(link.target) + "\0" + link.kind)
        }
        linkColor={(link: DrawLink) => {
          const a = highlightedPath.indexOf(endId(link.source)),
            b = highlightedPath.indexOf(endId(link.target));
          const pathEdge = a >= 0 && b >= 0 && Math.abs(a - b) === 1;
          const related =
            pathEdge || (hover && (endId(link.source) === hover || endId(link.target) === hover));
          return related
            ? "rgba(241,222,177,.85)"
            : hover
              ? "rgba(145,181,196,.08)"
              : link.kind === "coverage"
                ? "rgba(216,188,112,.38)"
                : highContrast
                  ? "rgba(201,229,240,.62)"
                  : "rgba(145,181,196,.28)";
        }}
        linkWidth={(link: DrawLink) =>
          highlightedPath.includes(endId(link.source)) &&
          highlightedPath.includes(endId(link.target))
            ? 2.5
            : hover && (endId(link.source) === hover || endId(link.target) === hover)
              ? 1.7
              : link.kind === "sample"
                ? 0.4
                : 0.7
        }
        linkLineDash={(l: DrawLink) => (l.kind === "sample" ? [2, 5] : null)}
        onRenderFramePre={(ctx, scale) => {
          const target = coachNode ? data.nodes.find((n) => n.id === coachNode) : null;
          if (target && coachTarget.current && target.x !== undefined && target.y !== undefined) {
            const point = fg.current?.graph2ScreenCoords(target.x, target.y);
            if (point)
              coachTarget.current.style.transform = `translate(${point.x - 28}px,${point.y - 28}px)`;
          }
          if (!serviceMode && !live && !neighborhood) {
            ctx.save();
            ctx.strokeStyle = "rgba(145,181,196,.12)";
            ctx.lineWidth = 1 / scale;
            for (const [prefix, radius] of [
              ["expertise:", 230],
              ["sector:", 310],
              ["country:", 390],
            ] as const) {
              if (!model.nodes.some((node) => node.id.startsWith(prefix))) continue;
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.restore();
          }
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
        onRenderFramePost={(ctx, scale) => {
          const occupied: { x: number; y: number; w: number; h: number }[] = [];
          const priority = (node: NetworkNode) =>
            node.id === hover || node.id === preview || node.id === focus
              ? 0
              : node.id === anchor
                ? 1
                : hoverNeighbours.has(node.id)
                  ? 2
                  : 3;
          const candidates = data.nodes
            .filter(
              (node) =>
                visible.has(node.id) &&
                (priority(node) < 3 ||
                  (!hover && scale >= (node.kind === "expert" ? GRAPH_LABEL_ZOOM : 1.05))),
            )
            .sort((a, b) => priority(a) - priority(b) || a.id.localeCompare(b.id));
          ctx.save();
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          const clipped = (text: string, maxWidth: number) => {
            if (ctx.measureText(text).width <= maxWidth) return text;
            const chars = Array.from(text);
            while (chars.length && ctx.measureText(chars.join("") + "…").width > maxWidth)
              chars.pop();
            return chars.join("") + "…";
          };
          for (const node of candidates) {
            if (node.x === undefined || node.y === undefined) continue;
            const screen = fg.current?.graph2ScreenCoords(node.x, node.y);
            if (
              !screen ||
              screen.x < 8 ||
              screen.y < 8 ||
              screen.x > size.w - 8 ||
              screen.y > size.h - 8
            )
              continue;
            const primary = priority(node) < 2;
            const label = node.label.length > 34 ? node.label.slice(0, 32) + "…" : node.label;
            const detail =
              primary && node.kind === "expert" ? node.expert?.primaryExpertise : undefined;
            ctx.font = `${primary ? 600 : 400} ${12 / scale}px "IBM Plex Sans",sans-serif`;
            const width = Math.min(245 / scale, ctx.measureText(label).width + 12 / scale);
            const height = (detail ? 36 : 21) / scale;
            const gap = radius(node) + 7 / scale;
            const options = [
              { x: node.x - width / 2, y: node.y - gap - height },
              { x: node.x + gap, y: node.y - height / 2 },
              { x: node.x - width - gap, y: node.y - height / 2 },
              { x: node.x - width / 2, y: node.y + gap },
              { x: node.x + gap, y: node.y - gap - height },
              { x: node.x - width - gap, y: node.y + gap },
            ];
            const position = options.find((option) => {
              const top = fg.current?.graph2ScreenCoords(option.x, option.y);
              return (
                top &&
                top.x >= 3 &&
                top.y >= 3 &&
                top.x + width * scale <= size.w - 3 &&
                top.y + height * scale <= size.h - 3 &&
                !occupied.some(
                  (box) =>
                    option.x < box.x + box.w &&
                    option.x + width > box.x &&
                    option.y < box.y + box.h &&
                    option.y + height > box.y,
                )
              );
            });
            if (!position && !primary) continue;
            const box = { ...(position ?? options[0]!), w: width, h: height };
            occupied.push({
              x: box.x - 3 / scale,
              y: box.y - 2 / scale,
              w: width + 6 / scale,
              h: height + 4 / scale,
            });
            ctx.fillStyle = highContrast
              ? "#000c15"
              : primary
                ? "rgba(8,24,36,.95)"
                : "rgba(8,24,36,.78)";
            ctx.fillRect(box.x, box.y, width, height);
            ctx.fillStyle = highContrast
              ? "#ffffff"
              : hoverNeighbours.has(node.id)
                ? "#f1deb1"
                : "#e3ece9";
            ctx.fillText(clipped(label, width - 12 / scale), box.x + 6 / scale, box.y + 11 / scale);
            if (detail) {
              ctx.font = `${10 / scale}px "IBM Plex Sans",sans-serif`;
              ctx.fillStyle = "#b8d2d7";
              ctx.fillText(
                clipped(detail, width - 12 / scale),
                box.x + 6 / scale,
                box.y + 27 / scale,
              );
            }
          }
          ctx.restore();
        }}
        onNodeHover={(n) => setHover(n?.id ?? null)}
        onNodeClick={(n) => {
          if (n.kind !== "workflow") onWorkflowDismiss?.();
          if (n.kind === "service") {
            setPreview(n.id);
            onServiceSelect?.(n.id.slice(4));
          } else if (n.kind === "workflow") {
            setPreview(null);
            onWorkflowSelect?.(n.id.slice(9));
          } else setPreview(n.id);
        }}
        onBackgroundClick={() => {
          onWorkflowDismiss?.();
          setPreview(null);
          onFocus(null);
        }}
        nodePointerAreaPaint={(n, c, ctx, scale) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(n.x ?? 0, n.y ?? 0, Math.max(radius(n) + 6, 22 / scale), 0, Math.PI * 2);
          ctx.fill();
        }}
        nodeCanvasObject={(n, ctx, scale) => {
          if (n.x === undefined || n.y === undefined) return;
          const selected =
            highlightedPath.includes(n.id) ||
            hoverNeighbours.has(n.id) ||
            n.id === preview ||
            n.id === focus ||
            n.id === anchor ||
            (n.kind === "service" &&
              (highlightedService
                ? highlightedService === n.id.slice(4)
                : effective.includes(n.id.slice(4))));
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
          const departure = departing.get(n.id);
          if (departure) {
            const fade = Math.max(
              0,
              1 - (performance.now() - departure.time - (departure.order % 6) * 140) / 1900,
            );
            ctx.globalAlpha *=
              fade * (0.8 + 0.2 * Math.sin((performance.now() - departure.time) / 95));
          }
          if (serviceMode && n.kind === "service" && !effective.includes(n.id.slice(4)))
            ctx.globalAlpha *= 0.3;
          if (hover && !hoverNeighbours.has(n.id) && !selected) ctx.globalAlpha *= 0.25;
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
          ctx.restore();
        }}
      />
      {coachNode && (
        <div ref={coachTarget} data-coach-node="" className="network-coach-node-target" />
      )}
      {workflowHint}
      {showConnectionPath &&
        (selectedNode?.expert || experts.find((person) => person.code === focus)) &&
        onPath && (
          <div className="network-graph-path">
            <NetworkConnectionPath
              key={(selectedNode?.expert || experts.find((person) => person.code === focus))!.code}
              person={(selectedNode?.expert || experts.find((person) => person.code === focus))!}
              people={experts}
              model={model}
              onPath={onPath}
              uk={locale === "uk"}
            />
          </div>
        )}
      <div className="network-graph-view-tools">
        {readableExpansions && (
          <button
            className="network-overview-control"
            onClick={() => {
              const positions = new Map(
                data.nodes.map((node) => [node.id, { x: node.x ?? 0, y: node.y ?? 0 }]),
              );
              const view = fitGraphView(positions, [...visible], anchor, size.w, size.h, false);
              fg.current?.centerAt(view.x, view.y, motionPaused ? 0 : 650);
              fg.current?.zoom(view.zoom, motionPaused ? 0 : 650);
            }}
          >
            <Scan size={15} />
            {locale === "uk" ? "Весь граф" : "Overview"}
          </button>
        )}
        {readableExpansions && workflowInfoId && (
          <button
            className="network-workflow-info"
            onClick={() => onWorkflowSelect?.(workflowInfoId)}
            aria-label={locale === "uk" ? "Пояснення workflow" : "Workflow information"}
          >
            <Info size={17} />
          </button>
        )}
        <button
          className="network-rotate-control"
          aria-pressed={rotationMode}
          title={
            locale === "uk"
              ? "Обертання у площині: прокрутка двома пальцями; щипок змінює масштаб"
              : "Rotate in the plane: two-finger scroll; pinch still zooms"
          }
          onClick={() => setRotationMode((v) => !v)}
        >
          <RotateCw size={15} />
          {locale === "uk" ? "Обертання" : "Rotate"}
        </button>
      </div>
      {selectedNode && (
        <MovableNodeActions uk={locale === "uk"}>
          <strong
            title={
              selectedNode.expert
                ? `${selectedNode.label} · ${selectedNode.expert.primaryExpertise}`
                : selectedNode.label
            }
          >
            {selectedNode.label}
          </strong>
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
            {selectedNode.kind === "service" && effective.includes(selectedNode.id.slice(4)) && (
              <button onClick={() => onServiceExclude?.(selectedNode.id.slice(4))}>
                {locale === "uk" ? "Вилучити зі складу" : "Remove from composition"}
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
        </MovableNodeActions>
      )}
    </div>
  );
}
