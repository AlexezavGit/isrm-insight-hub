import {
  directNeighbours,
  NETWORK_LIFECYCLE_DURATION,
  networkLifecycleFrame,
} from "@/lib/network-presentation";
import { rotatePoint } from "@/lib/network-experience";
import { RotateCw, Scan, Info } from "lucide-react";
import { NetworkConnectionPath } from "./NetworkConnectionPath";
import { MovableNodeActions } from "./MovableNodeActions";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ForceGraph2D, { type ForceGraphMethods, type LinkObject } from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import {
  buildNetwork,
  relatedPeople,
  networkNeighborhood,
  type GraphLayers,
  type NetworkNode,
} from "@/lib/network-model";
import {
  layoutNetwork,
  fitGraphView,
  freeNetworkPositions,
  GRAPH_LABEL_ZOOM,
  interpolatePoint,
  transitionOrigins,
} from "@/lib/network-layout";
export type { GraphLayers } from "@/lib/network-model";
type DrawLink = LinkObject<NetworkNode, { kind: string }>;
export interface NetworkGraphHandle {
  capture: () => string;
  fit: () => void;
}
const endId = (v: string | number | NetworkNode | undefined) =>
  typeof v === "object" ? v.id : String(v ?? "");
const EMPTY_IDS: string[] = [];
type NetworkGraphProps = {
  experts: Expert[];
  layers: GraphLayers;
  referenceSelection?: Parameters<typeof buildNetwork>[3];
  focus: string | null;
  onFocus: (id: string | null) => void;
  serviceMode?: boolean;
  live?: boolean;
  showExpertsOnServices?: boolean;
  includeHub?: boolean;
  includeProposedCore?: boolean;
  includeServiceCoverage?: boolean;
  configurationRevealStep?: number | null;
  locale?: string;
  motionPaused?: boolean;
  activeServiceIds?: string[];
  activeWorkflowIds?: string[];
  shortlistedCodes?: string[];
  highlightedService?: string | null;
  highlightedWorkflow?: string | null;
  coachNode?: string | null;
  highlightedPath?: string[];
  onServiceExclude?: (id: string) => void;
  onServiceSelect?: (id: string) => void;
  onWorkflowSelect?: (id: string) => void;
  onNodeSelect?: (node: NetworkNode, expanded: boolean) => void;
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
};
const NetworkGraph = forwardRef<NetworkGraphHandle, NetworkGraphProps>(function NetworkGraph(
  {
    experts,
    layers,
    referenceSelection,
    focus,
    onFocus,
    serviceMode = false,
    live = false,
    showExpertsOnServices = true,
    includeHub = true,
    includeProposedCore = false,
    includeServiceCoverage = true,
    configurationRevealStep = null,
    locale = "en",
    motionPaused = false,
    activeServiceIds = EMPTY_IDS,
    activeWorkflowIds = EMPTY_IDS,
    shortlistedCodes = EMPTY_IDS,
    highlightedService,
    highlightedWorkflow,
    coachNode,
    highlightedPath = EMPTY_IDS,
    onServiceExclude,
    onServiceSelect,
    onWorkflowSelect,
    onNodeSelect,
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
    disabledServiceIds = EMPTY_IDS,
  },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null),
    fg = useRef<ForceGraphMethods<NetworkNode, { kind: string }> | undefined>(undefined);
  const cache = useRef(new Map<string, NetworkNode>()),
    previousVisibleIds = useRef(new Set<string>()),
    stagedRevealTimes = useRef(new Map<string, number>()),
    revealStarted = useRef(0),
    liveExpanded = useRef(false),
    initialExpansionStarted = useRef(false),
    initialLifecycleElapsed = useRef(0),
    initialLifecycleStartedAt = useRef<number | null>(null);
  const coachTarget = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [rotationMode, setRotationMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [size, setSize] = useState({ w: 800, h: 600 }),
    [hover, setHover] = useState<string | null>(null),
    [preview, setPreview] = useState<string | null>(null);
  const model = useMemo(
    () =>
      buildNetwork(experts, layers, locale, referenceSelection, {
        includeHub,
        includeProposedCore,
        includeServiceCoverage,
      }),
    [
      experts,
      layers,
      locale,
      referenceSelection,
      includeHub,
      includeProposedCore,
      includeServiceCoverage,
    ],
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
  const [revealCount, setRevealCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const revealStepKey = useRef("");
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
        includeServiceCoverage,
      ),
    [model, serviceMode, effective, disabledServiceIds, anchor, includeServiceCoverage],
  );
  const graphNodes = useMemo(
    () =>
      model.nodes.filter((n) =>
        serviceMode
          ? ["isrm", "core", "service", "workflow"].includes(n.kind) ||
            (showExpertsOnServices && n.kind === "expert")
          : !["service", "workflow"].includes(n.kind),
      ),
    [model.nodes, serviceMode, showExpertsOnServices],
  );
  const revealSequence = useMemo(
    () =>
      configurationRevealStep === 1
        ? model.nodes.filter((node) => node.kind === "service")
        : configurationRevealStep === 2
          ? model.nodes.filter((node) => node.kind === "workflow")
          : [],
    [configurationRevealStep, model.nodes],
  );
  const revealStepKeyValue =
    serviceMode && configurationRevealStep !== null ? String(configurationRevealStep) : "complete";
  const currentRevealCount = revealStepKey.current === revealStepKeyValue ? revealCount : 0;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (revealStepKey.current !== revealStepKeyValue) {
      revealStepKey.current = revealStepKeyValue;
      if (revealCount !== 0) {
        setRevealCount(0);
        return;
      }
    }
    if (!revealSequence.length) {
      setRevealCount(0);
      return;
    }
    if (reducedMotion) {
      setRevealCount(revealSequence.length);
      return;
    }
    if (motionPaused || revealCount >= revealSequence.length) return;
    const timer = window.setTimeout(
      () => setRevealCount((count) => Math.min(revealSequence.length, count + 1)),
      240,
    );
    return () => window.clearTimeout(timer);
  }, [revealStepKeyValue, revealSequence.length, revealCount, reducedMotion, motionPaused]);
  const freePoints = useMemo(
    () =>
      freeNetworkPositions(
        graphNodes.map((node) => node.id),
        points,
        anchor,
      ),
    [graphNodes, points, anchor],
  );
  const collapsedPoint = useMemo(
    () => points.get(anchor) ?? points.get("isrm") ?? { x: 0, y: 0 },
    [anchor, points],
  );
  const neighborhood = useMemo(
    () =>
      anchor && anchor !== "isrm" ? networkNeighborhood(model, anchor, disabledServiceIds) : null,
    [model, anchor, disabledServiceIds],
  );
  const anchorNode = model.nodes.find((node) => node.id === anchor);
  const focusNeighborhood = !serviceMode && anchorNode?.kind === "expert" ? neighborhood : null;
  const neighborhoodEdges = useMemo(
    () => new Set(neighborhood?.links.map((l) => l.source + "\0" + l.target + "\0" + l.kind)),
    [neighborhood],
  );
  const data = useMemo(() => {
    const previous = new Map(
      [...cache.current]
        .filter(([id]) => previousVisibleIds.current.has(id))
        .map(([id, node]) => [id, { x: node.x ?? 0, y: node.y ?? 0 }]),
    );
    const origins = transitionOrigins(
      graphNodes.map((node) => node.id),
      model.links,
      previous,
      points,
      anchor,
    );
    const next = {
      nodes: graphNodes.map((n) => {
        const prev = cache.current.get(n.id),
          p = initialExpansionStarted.current
            ? (origins.get(n.id) ?? points.get(n.id) ?? { x: 0, y: 0 })
            : collapsedPoint;
        const item: NetworkNode = {
          ...n,
          x: prev?.x ?? p.x,
          y: prev?.y ?? p.y,
        };
        if (!live || !initialExpansionStarted.current || n.kind === "core") {
          item.fx = prev?.x ?? p.x;
          item.fy = prev?.y ?? p.y;
        }
        cache.current.set(n.id, item);
        return item;
      }),
      links: model.links
        .filter((l) =>
          serviceMode
            ? ["architecture", "foundation", "coverage", "core"].includes(l.kind)
            : ["category", "sample"].includes(l.kind),
        )
        .map((l) => ({ ...l })),
    };
    return next;
  }, [graphNodes, model.links, points, collapsedPoint, live, serviceMode, anchor]);
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
  const visible = useMemo(() => {
    const allVisible = new Set(graphNodes.map((node) => node.id));
    if (serviceMode && configurationRevealStep !== null) {
      const coreId = "core:expertise-trust";
      if (configurationRevealStep === 0) return new Set(allVisible.has(coreId) ? [coreId] : []);
      if (configurationRevealStep === 1) {
        const services = revealSequence.slice(0, currentRevealCount).map((node) => node.id);
        return new Set([...(allVisible.has(coreId) ? [coreId] : []), ...services]);
      }
      if (configurationRevealStep === 2) {
        const services = model.nodes
          .filter((node) => node.kind === "service")
          .map((node) => node.id);
        const workflows = revealSequence.slice(0, currentRevealCount).map((node) => node.id);
        return new Set([...(allVisible.has(coreId) ? [coreId] : []), ...services, ...workflows]);
      }
    }
    if (focusNeighborhood)
      return new Set(
        [...allVisible].filter((id) => {
          const kind = model.nodes.find((node) => node.id === id)?.kind;
          return kind !== "service" && kind !== "workflow";
        }),
      );
    if (neighborhood)
      return new Set([...neighborhood.distances.keys()].filter((id) => allVisible.has(id)));
    return allVisible;
  }, [
    graphNodes,
    model.nodes,
    serviceMode,
    configurationRevealStep,
    revealSequence,
    currentRevealCount,
    neighborhood,
    focusNeighborhood,
  ]);
  useEffect(() => {
    if (!serviceMode || configurationRevealStep === null) {
      stagedRevealTimes.current.clear();
      return;
    }
    const now = performance.now();
    for (const id of visible)
      if (!stagedRevealTimes.current.has(id)) stagedRevealTimes.current.set(id, now);
    for (const id of stagedRevealTimes.current.keys())
      if (!visible.has(id)) stagedRevealTimes.current.delete(id);
  }, [visible, serviceMode, configurationRevealStep]);
  useEffect(() => {
    previousVisibleIds.current = new Set([...visible].filter((id) => cache.current.has(id)));
  }, [visible]);
  const shortlisted = useMemo(() => new Set(shortlistedCodes), [shortlistedCodes]);
  const visibleEdges = useMemo(
    () =>
      model.links.filter((link) => {
        const { source, target, kind } = link;
        if (!visible.has(source) || !visible.has(target)) return false;
        if (
          neighborhood &&
          !(serviceMode && configurationRevealStep !== null && configurationRevealStep < 3)
        )
          return neighborhoodEdges.has(source + "\0" + target + "\0" + kind);
        if (kind === "coverage") {
          return serviceMode && effective.some((id) => "svc:" + id === target);
        }
        return serviceMode
          ? kind === "architecture" || kind === "foundation" || kind === "core"
          : kind === "category" || kind === "sample";
      }),
    [
      model,
      visible,
      neighborhood,
      neighborhoodEdges,
      serviceMode,
      configurationRevealStep,
      effective,
    ],
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
  const workflowLabelContext = useMemo(() => {
    const activeWorkflows = new Set(activeWorkflowIds.map((id) => "workflow:" + id));
    if (highlightedWorkflow) activeWorkflows.add("workflow:" + highlightedWorkflow);
    const primary = new Set(["workflow:search", ...activeWorkflows]);
    const workflows = new Set(
      model.nodes.filter((node) => node.kind === "workflow").map((node) => node.id),
    );
    const foundationCapabilities = new Set<string>();
    const selectedCapabilities = new Set<string>();
    for (const link of model.links) {
      if (link.kind !== "architecture" && link.kind !== "foundation") continue;
      if (activeWorkflows.has(link.source)) selectedCapabilities.add(link.target);
      if (activeWorkflows.has(link.target)) selectedCapabilities.add(link.source);
      if (link.kind === "architecture" && link.source === "workflow:search")
        foundationCapabilities.add(link.target);
      if (link.kind === "architecture" && link.target === "workflow:search")
        foundationCapabilities.add(link.source);
    }
    return { primary, workflows, foundationCapabilities, selectedCapabilities };
  }, [model.nodes, model.links, activeWorkflowIds, highlightedWorkflow]);
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
  const fitVisible = useCallback(() => {
    const positions = new Map(
      data.nodes.map((node) => [node.id, { x: node.x ?? 0, y: node.y ?? 0 }]),
    );
    const view = fitGraphView(positions, [...visible], anchor, size.w, size.h, readableExpansions);
    fg.current?.centerAt(view.x, view.y, motionPaused ? 0 : 650);
    fg.current?.zoom(view.zoom, motionPaused ? 0 : 650);
  }, [data, visible, anchor, size.w, size.h, readableExpansions, motionPaused]);
  useImperativeHandle(
    ref,
    () => ({
      capture: () => {
        const source = wrap.current?.querySelector("canvas");
        if (!source || source.width === 0 || source.height === 0) return "";
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = Math.max(1, Math.round((320 * source.height) / source.width));
        const context = canvas.getContext("2d");
        if (!context) return "";
        context.fillStyle = "#102c3b";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png");
      },
      fit: fitVisible,
    }),
    [fitVisible],
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
    let raf = 0;
    if (motionPaused) {
      fg.current?.pauseAnimation();
      return () => cancelAnimationFrame(raf);
    }
    fg.current?.resumeAnimation();
    const release = () => {
      if (anchor) return;
      for (const node of data.nodes) {
        if (node.kind === "isrm" || node.kind === "core") continue;
        delete node.fx;
        delete node.fy;
      }
      fg.current?.d3Force("link")?.["distance"](95)["strength"](0.035);
      fg.current?.d3Force("charge")?.["strength"](-85);
      fg.current?.d3ReheatSimulation();
    };
    if (!initialExpansionStarted.current) initialExpansionStarted.current = true;
    if (!liveExpanded.current) {
      const start = performance.now(),
        elapsedAtStart = initialLifecycleElapsed.current;
      initialLifecycleStartedAt.current = start;
      const animate = (now: number) => {
        const elapsed = Math.min(NETWORK_LIFECYCLE_DURATION, elapsedAtStart + now - start);
        const frame = networkLifecycleFrame(elapsed);
        for (const node of data.nodes) {
          const origin = rotatePoint(collapsedPoint, angle.current),
            scattered = rotatePoint(freePoints.get(node.id) ?? collapsedPoint, angle.current),
            target = rotatePoint(
              points.get(node.id) ?? freePoints.get(node.id) ?? collapsedPoint,
              angle.current,
            );
          const position =
            frame.stage === "origin"
              ? origin
              : frame.stage === "scatter"
                ? interpolatePoint(origin, scattered, frame.progress)
                : frame.stage === "pause"
                  ? scattered
                  : frame.stage === "assemble"
                    ? interpolatePoint(scattered, target, frame.progress)
                    : target;
          node.x = position.x;
          node.y = position.y;
          node.fx = position.x;
          node.fy = position.y;
        }
        initialLifecycleElapsed.current = elapsed;
        if (frame.stage !== "complete") raf = requestAnimationFrame(animate);
        else {
          initialLifecycleStartedAt.current = null;
          liveExpanded.current = true;
          if (live) release();
        }
      };
      raf = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(raf);
        if (initialLifecycleStartedAt.current === start) {
          initialLifecycleElapsed.current = Math.min(
            NETWORK_LIFECYCLE_DURATION,
            elapsedAtStart + performance.now() - start,
          );
          initialLifecycleStartedAt.current = null;
        }
      };
    }
    if (live) {
      if (liveExpanded.current) {
        const start = performance.now();
        const from = new Map(
          data.nodes.map((node) => [node.id, { x: node.x ?? 0, y: node.y ?? 0 }]),
        );
        const transform = (now: number) => {
          const t = Math.min(1, (now - start) / 1100),
            ease = 1 - Math.pow(1 - t, 3);
          for (const node of data.nodes) {
            const origin = from.get(node.id)!,
              target = rotatePoint(points.get(node.id)!, angle.current);
            const position = interpolatePoint(origin, target, t);
            node.x = position.x;
            node.y = position.y;
            node.fx = node.x;
            node.fy = node.y;
          }
          if (t < 1) raf = requestAnimationFrame(transform);
          else release();
        };
        raf = requestAnimationFrame(transform);
        return () => cancelAnimationFrame(raf);
      }
    }
    const start = performance.now(),
      duration = motionPaused ? 0 : 1100;
    const from = new Map(data.nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]));
    const frame = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1,
        done = t >= 1;
      for (const n of data.nodes) {
        const a = from.get(n.id)!,
          b = rotatePoint(points.get(n.id)!, angle.current);
        const position = interpolatePoint(a, b, t);
        n.x = position.x;
        n.y = position.y;
        n.fx = n.x;
        n.fy = n.y;
      }
      if (!done) raf = requestAnimationFrame(frame);
      else liveExpanded.current = true;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [data, points, freePoints, collapsedPoint, motionPaused, live, anchor, serviceMode]);
  const cameraArrangement = readableExpansions ? points : null;
  // The configurator retains its historical fit; the prototype opens at reading scale.
  useEffect(() => {
    const viewIds = focusNeighborhood ? [...focusNeighborhood.distances.keys()] : [...visible];
    const view = fitGraphView(points, viewIds, anchor, size.w, size.h, readableExpansions);
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
    focusNeighborhood,
  ]);
  useEffect(() => {
    if (preview && !visible.has(preview)) setPreview(null);
  }, [visible, preview]);
  const radius = (n: NetworkNode) =>
    n.kind === "core"
      ? 21
      : n.kind === "isrm"
        ? 16
        : n.kind === "service"
          ? 11
          : n.kind === "workflow"
            ? n.id === "workflow:search"
              ? 13
              : 10
            : n.kind === "expert"
              ? 4.6
              : 8;
  const colour = (n: NetworkNode) =>
    ({
      expert: highContrast ? "#a9ffe2" : "#87c1b4",
      core: highContrast ? "#fff2bc" : "#78d4c2",
      organisation: highContrast ? "#c0e4ff" : "#9ec9e8",
      service: "#d2b66f",
      workflow: "#79a8d4",
      isrm: "#e7d8a4",
      sector: highContrast ? "#dfc8ff" : "#b0a4d1",
      theme: "#87b6c3",
      hub: "#a3c7a7",
      status: "#b7d29c",
    })[n.kind];
  const shape = (n: NetworkNode, ctx: CanvasRenderingContext2D, r: number) => {
    const x = n.x ?? 0,
      y = n.y ?? 0;
    ctx.beginPath();
    if (n.kind === "core") {
      for (const scale of [1, 0.7]) {
        const radius = r * scale;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = x + Math.cos(angle) * radius,
            py = y + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (scale === 1) ctx.moveTo(x, y);
      }
    } else if (n.kind === "organisation" || n.kind === "status") {
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
      if (n.id === "workflow:search") {
        ctx.moveTo(x + r * 0.45, y);
        ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
      }
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
        cooldownTicks={live && !motionPaused && !anchor ? Infinity : 0}
        d3VelocityDecay={0.65}
        d3AlphaDecay={0.02}
        autoPauseRedraw={false}
        enableNodeDrag={live}
        onNodeDrag={(node) => {
          if (node.kind === "isrm" || node.kind === "core") {
            const position = points.get(node.id) ?? { x: 0, y: 0 };
            Object.assign(node, {
              x: position.x,
              y: position.y,
              fx: position.x,
              fy: position.y,
              vx: 0,
              vy: 0,
            });
          }
        }}
        onNodeDragEnd={(node) => {
          if (node.kind === "isrm" || node.kind === "core") {
            const position = points.get(node.id) ?? { x: 0, y: 0 };
            Object.assign(node, {
              x: position.x,
              y: position.y,
              fx: position.x,
              fy: position.y,
              vx: 0,
              vy: 0,
            });
          }
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
          const source = endId(link.source);
          const target = endId(link.target);
          const selectedWorkflowEdge =
            ((link.kind === "architecture" || link.kind === "foundation") &&
              (source === "workflow:" + highlightedWorkflow ||
                target === "workflow:" + highlightedWorkflow ||
                activeWorkflowIds.some(
                  (id) => source === "workflow:" + id || target === "workflow:" + id,
                ))) ||
            (link.kind === "core" && target === "workflow:" + highlightedWorkflow);
          const inFocusNeighborhood =
            !!focusNeighborhood && neighborhoodEdges.has(source + "\0" + target + "\0" + link.kind);
          const directFocusEdge = inFocusNeighborhood && (source === anchor || target === anchor);
          const related =
            (serviceMode && configurationRevealStep === 3) ||
            pathEdge ||
            selectedWorkflowEdge ||
            directFocusEdge ||
            (hover && (source === hover || target === hover));
          return related
            ? "rgba(104,205,199,.92)"
            : inFocusNeighborhood
              ? "rgba(145,181,196,.34)"
              : focusNeighborhood
                ? "rgba(145,181,196,.055)"
                : hover
                  ? "rgba(145,181,196,.035)"
                  : link.kind === "coverage"
                    ? "rgba(216,188,112,.3)"
                    : highContrast
                      ? "rgba(201,229,240,.42)"
                      : "rgba(145,181,196,.12)";
        }}
        linkWidth={(link: DrawLink) =>
          serviceMode && configurationRevealStep === 3
            ? 1.5
            : highlightedPath.includes(endId(link.source)) &&
                highlightedPath.includes(endId(link.target))
              ? 2.5
              : focusNeighborhood
                ? neighborhoodEdges.has(
                    endId(link.source) + "\0" + endId(link.target) + "\0" + link.kind,
                  )
                  ? endId(link.source) === anchor || endId(link.target) === anchor
                    ? 1.5
                    : 0.65
                  : 0.2
                : hover && (endId(link.source) === hover || endId(link.target) === hover)
                  ? 1.8
                  : link.kind === "sample"
                    ? 0.3
                    : 0.42
        }
        linkDirectionalArrowLength={(link: DrawLink) =>
          ["architecture", "foundation", "core"].includes(link.kind) ? 5 : 0
        }
        linkDirectionalArrowRelPos={0.8}
        linkDirectionalArrowColor={() => "rgba(104,205,199,.92)"}
        linkLineDash={(l: DrawLink) =>
          l.kind === "sample"
            ? [2, 5]
            : l.kind === "foundation"
              ? [5, 4]
              : l.kind === "core"
                ? [8, 3, 2, 3]
                : null
        }
        onRenderFramePre={(ctx, scale) => {
          const target = coachNode ? data.nodes.find((n) => n.id === coachNode) : null;
          if (target && coachTarget.current && target.x !== undefined && target.y !== undefined) {
            const point = fg.current?.graph2ScreenCoords(target.x, target.y);
            if (point)
              coachTarget.current.style.transform = `translate(${point.x - 28}px,${point.y - 28}px)`;
          }
          if (!serviceMode && !live && !neighborhood) {
            ctx.save();
            ctx.strokeStyle = "rgba(145,181,196,.06)";
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
          if (!serviceMode || neighborhood || !covered.size) return;
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
            node.kind === "core" || node.id === hover || node.id === preview || node.id === focus
              ? 0
              : node.id === anchor ||
                  workflowLabelContext.primary.has(node.id) ||
                  workflowLabelContext.selectedCapabilities.has(node.id)
                ? 1
                : workflowLabelContext.workflows.has(node.id) ||
                    workflowLabelContext.foundationCapabilities.has(node.id)
                  ? 2
                  : focusNeighborhood?.distances.get(node.id) === 1
                    ? 2
                    : hoverNeighbours.has(node.id)
                      ? 2
                      : 3;
          const overviewLabelRank = (node: NetworkNode) =>
            node.kind === "sector"
              ? 0
              : node.kind === "theme"
                ? 1
                : node.kind === "hub"
                  ? 2
                  : node.kind === "status"
                    ? 3
                    : node.kind === "core"
                      ? -1
                      : node.kind === "organisation"
                        ? 4
                        : 5;
          const candidates = data.nodes
            .filter(
              (node) =>
                visible.has(node.id) &&
                (priority(node) < 2 ||
                  (serviceMode && ["core", "service", "workflow"].includes(node.kind)) ||
                  (node.kind === "expert"
                    ? priority(node) === 2 && scale >= GRAPH_LABEL_ZOOM
                    : scale >= 0.45)),
            )
            .sort(
              (a, b) =>
                priority(a) - priority(b) ||
                (scale < 0.75 ? overviewLabelRank(a) - overviewLabelRank(b) : 0) ||
                a.id.localeCompare(b.id),
            );
          const labelLimit = serviceMode
            ? Math.max(data.nodes.length, 20)
            : size.w < 560
              ? 9
              : scale < 0.75
                ? Math.min(12, Math.max(8, Math.floor((size.w * size.h) / 63000)))
                : Math.min(36, Math.max(12, Math.floor((size.w * size.h) / 42000)));
          let visibleLabels = 0;
          ctx.save();
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          const wrap = (text: string, maxWidth: number) => {
            const lines: string[] = [];
            let line = "";
            for (const word of text.split(/\s+/)) {
              const candidate = line ? line + " " + word : word;
              if (!line || ctx.measureText(candidate).width <= maxWidth) {
                line = candidate;
                continue;
              }
              lines.push(line);
              line = word;
            }
            if (line) lines.push(line);
            return lines;
          };
          for (const node of candidates) {
            const primary = priority(node) < 2;
            if (visibleLabels >= labelLimit) continue;
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
            const label =
              node.kind === "core"
                ? locale === "uk"
                  ? "Цифрова довіра й вплив"
                  : "Digital trust & influence"
                : node.label;
            const detail =
              primary && node.kind === "expert" ? node.expert?.primaryExpertise : undefined;
            const typeLabel = serviceMode
              ? node.kind === "core"
                ? locale === "uk"
                  ? "ПРОПОНОВАНЕ ЯДРО"
                  : "PROPOSED CORE"
                : node.kind === "service"
                  ? locale === "uk"
                    ? "ФУНКЦІЯ"
                    : "CAPABILITY"
                  : node.kind === "workflow"
                    ? locale === "uk"
                      ? "СЦЕНАРІЙ"
                      : "WORKFLOW"
                    : ""
              : "";
            ctx.font = `${primary ? 600 : 500} ${14 / scale}px "IBM Plex Sans",sans-serif`;
            const labelLines = wrap(label, 232 / scale);
            const detailLines = detail ? wrap(detail, 232 / scale) : [];
            ctx.font = `700 ${10 / scale}px "IBM Plex Sans",sans-serif`;
            const typeWidth = typeLabel ? ctx.measureText(typeLabel).width + 12 / scale : 0;
            ctx.font = `${primary ? 600 : 500} ${14 / scale}px "IBM Plex Sans",sans-serif`;
            const width =
              Math.max(
                typeWidth,
                ...[...labelLines, ...detailLines].map((line) => ctx.measureText(line).width),
              ) +
              12 / scale;
            const height =
              ((typeLabel ? 12 : 0) +
                labelLines.length * 17 +
                (detailLines.length ? detailLines.length * 13 + 3 : 0) +
                4) /
              scale;
            const gap = radius(node) + 7 / scale;
            const options =
              node.kind === "core"
                ? [
                    { x: node.x - width - gap, y: node.y - height / 2 },
                    { x: node.x - width / 2, y: node.y - gap - height },
                    { x: node.x - width / 2, y: node.y + gap },
                    { x: node.x + gap, y: node.y - height / 2 },
                  ]
                : [
                    { x: node.x - width / 2, y: node.y - gap - height },
                    { x: node.x + gap, y: node.y - height / 2 },
                    { x: node.x - width - gap, y: node.y - height / 2 },
                    { x: node.x - width / 2, y: node.y + gap },
                    { x: node.x + gap, y: node.y - gap - height },
                    { x: node.x - width - gap, y: node.y + gap },
                  ];
            const position = options.find((option) => {
              const top = fg.current?.graph2ScreenCoords(option.x, option.y);
              const obstructed = data.nodes.some((other) => {
                if (
                  other.id === node.id ||
                  !visible.has(other.id) ||
                  other.x === undefined ||
                  other.y === undefined
                )
                  return false;
                const nearestX = Math.max(option.x, Math.min(other.x, option.x + width));
                const nearestY = Math.max(option.y, Math.min(other.y, option.y + height));
                return (
                  Math.hypot(other.x - nearestX, other.y - nearestY) < radius(other) + 5 / scale
                );
              });
              return (
                top &&
                top.x >= 3 &&
                top.y >= 3 &&
                top.x + width * scale <= size.w - 3 &&
                top.y + height * scale <= size.h - 3 &&
                !obstructed &&
                !occupied.some(
                  (box) =>
                    option.x < box.x + box.w &&
                    option.x + width > box.x &&
                    option.y < box.y + box.h &&
                    option.y + height > box.y,
                )
              );
            });
            if (!position) continue;
            const box = { ...position, w: width, h: height };
            occupied.push({
              x: box.x - 3 / scale,
              y: box.y - 2 / scale,
              w: width + 6 / scale,
              h: height + 4 / scale,
            });
            visibleLabels++;
            if (typeLabel) {
              const markerX = box.x + 9 / scale;
              const y = box.y + 7 / scale;
              const markerSize = 3.5 / scale;
              ctx.beginPath();
              if (node.kind === "core") {
                for (let i = 0; i < 6; i++) {
                  const angle = (i * Math.PI) / 3;
                  const x = markerX + Math.cos(angle) * markerSize;
                  const y = box.y + 7 / scale + Math.sin(angle) * markerSize;
                  if (i === 0) ctx.moveTo(x, y);
                  else ctx.lineTo(x, y);
                }
                ctx.closePath();
              } else if (node.kind === "service") {
                ctx.rect(markerX - markerSize, y - markerSize, markerSize * 2, markerSize * 2);
              } else if (node.kind === "workflow") {
                ctx.moveTo(markerX - markerSize, y);
                ctx.lineTo(markerX + markerSize, y);
                ctx.moveTo(markerX, y - markerSize);
                ctx.lineTo(markerX + markerSize, y);
                ctx.lineTo(markerX, y + markerSize);
              }
              ctx.strokeStyle = colour(node);
              ctx.lineWidth = 1.5 / scale;
              ctx.lineJoin = "round";
              ctx.stroke();
              const x = box.x + 15 / scale;
              ctx.font = `700 ${10 / scale}px "IBM Plex Sans",sans-serif`;
              ctx.strokeStyle = highContrast ? "#000000" : "#102c3c";
              ctx.lineJoin = "round";
              ctx.lineWidth = 3 / scale;
              ctx.strokeText(typeLabel, x, y);
              ctx.fillStyle = colour(node);
              ctx.fillText(typeLabel, x, y);
              ctx.font = `${primary ? 600 : 500} ${14 / scale}px "IBM Plex Sans",sans-serif`;
            }
            const drawLabelLines = (lines: string[], startY: number, lineHeight: number) => {
              lines.forEach((line, index) => {
                const x = box.x + 6 / scale;
                const y = box.y + ((typeLabel ? 12 : 0) + startY + lineHeight * index) / scale;
                ctx.strokeStyle = highContrast ? "#000000" : "#102c3c";
                ctx.lineJoin = "round";
                ctx.lineWidth = 3 / scale;
                ctx.strokeText(line, x, y);
                ctx.fillStyle = colour(node);
                ctx.fillText(line, x, y);
              });
            };
            drawLabelLines(labelLines, 10, 15);
            if (detailLines.length) {
              ctx.font = `${10 / scale}px "IBM Plex Sans",sans-serif`;
              drawLabelLines(detailLines, labelLines.length * 15 + 13, 11);
            }
          }
          ctx.restore();
        }}
        onNodeHover={(n) => setHover(n?.id ?? null)}
        onNodeClick={(n, event) => {
          if (onNodeSelect) {
            onWorkflowDismiss?.();
            setPreview(null);
            onNodeSelect(n, event.detail > 1);
            return;
          }
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
            (serviceMode && configurationRevealStep === 3 && visible.has(n.id)) ||
            highlightedPath.includes(n.id) ||
            hoverNeighbours.has(n.id) ||
            focusNeighborhood?.distances.get(n.id) === 1 ||
            n.id === preview ||
            n.id === focus ||
            n.id === anchor ||
            (n.kind === "service" &&
              (highlightedService
                ? highlightedService === n.id.slice(4)
                : effective.includes(n.id.slice(4)))) ||
            (n.kind === "workflow" &&
              (n.id === "workflow:" + highlightedWorkflow ||
                activeWorkflowIds.includes(n.id.slice(9))));
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
          if (focusNeighborhood) {
            const depth = focusNeighborhood.distances.get(n.id);
            ctx.globalAlpha *= depth === undefined ? 0.1 : depth > 1 ? 0.38 : 1;
          }
          if (hover && !hoverNeighbours.has(n.id) && !selected) ctx.globalAlpha *= 0.25;
          if (warning && !motionPaused)
            ctx.globalAlpha *= 0.65 + 0.25 * Math.sin(performance.now() / 220);
          const revealTime = stagedRevealTimes.current.get(n.id);
          const revealProgress =
            serviceMode &&
            configurationRevealStep !== null &&
            !reducedMotion &&
            ["core", "service", "workflow"].includes(n.kind) &&
            revealTime !== undefined
              ? Math.min(1, (performance.now() - revealTime) / 420)
              : 1;
          ctx.globalAlpha *= revealProgress;
          ctx.translate(n.x, n.y);
          ctx.scale(revealProgress, revealProgress);
          ctx.translate(-n.x, -n.y);
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
          if (n.kind === "expert" && shortlisted.has(n.id)) {
            const half = r + 7 / scale;
            const corner = 4 / scale;
            const drawCorners = () => {
              ctx.beginPath();
              for (const direction of [-1, 1]) {
                for (const vertical of [-1, 1]) {
                  const x = n.x + direction * half;
                  const y = n.y + vertical * half;
                  ctx.moveTo(x - direction * corner, y);
                  ctx.lineTo(x, y);
                  ctx.lineTo(x, y - vertical * corner);
                }
              }
              ctx.stroke();
            };
            ctx.lineCap = "square";
            ctx.strokeStyle = "#102c3c";
            ctx.lineWidth = 4 / scale;
            drawCorners();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2 / scale;
            drawCorners();
          }
          if (n.kind === "expert" && n.expert?.verified) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 2.8 / scale, 0, Math.PI * 2);
            ctx.strokeStyle = "#f1deb1";
            ctx.lineWidth = 2 / scale;
            ctx.stroke();
            const markerRadius = 6 / scale;
            const markerX = n.x + r * 0.72;
            const markerY = n.y - r * 0.72;
            ctx.beginPath();
            ctx.moveTo(markerX, markerY - markerRadius);
            ctx.lineTo(markerX + markerRadius, markerY);
            ctx.lineTo(markerX, markerY + markerRadius);
            ctx.lineTo(markerX - markerRadius, markerY);
            ctx.closePath();
            ctx.fillStyle = "#102c3c";
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2 / scale;
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(markerX, markerY, 1.8 / scale, 0, Math.PI * 2);
            ctx.fillStyle = "#f1deb1";
            ctx.fill();
          }
          if (n.kind === "expert" && shortlisted.has(n.id)) {
            const markerRadius = 5 / scale;
            const markerX = n.x - r * 0.72;
            const markerY = n.y - r * 0.72;
            ctx.beginPath();
            ctx.rect(
              markerX - markerRadius,
              markerY - markerRadius,
              markerRadius * 2,
              markerRadius * 2,
            );
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#102c3c";
            ctx.lineWidth = 1.5 / scale;
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(markerX - 2.2 / scale, markerY);
            ctx.lineTo(markerX - 0.6 / scale, markerY + 1.8 / scale);
            ctx.lineTo(markerX + 2.4 / scale, markerY - 1.8 / scale);
            ctx.strokeStyle = "#102c3c";
            ctx.lineWidth = 1.7 / scale;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
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
        <button
          className="network-overview-control"
          onClick={() => {
            if (anchor) onAnchor?.("");
            else fitVisible();
          }}
        >
          <Scan size={15} />
          {locale === "uk" ? "Весь граф" : "Overview"}
        </button>
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
});
export default NetworkGraph;
