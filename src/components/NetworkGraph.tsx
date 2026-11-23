import {
  MAP_SYMBOLS,
  PEOPLE_MAP_NODE_STYLES,
  PUBLIC_REPRESENTATIVE_OUTLINE,
  mapSymbolPath,
} from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import {
  directNeighbours,
  NETWORK_LIFECYCLE_DURATION,
  networkLifecycleFrame,
} from "@/lib/network-presentation";
import { rotatePoint } from "@/lib/network-experience";
import { FilterX, RotateCw, Scan, Info, Network, Undo2 } from "lucide-react";
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
  type Point,
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
  matchingExperts?: Expert[] | undefined;
  shortlistIds?: string[];
  onToggleShortlist?: ((id: string) => void) | undefined;
  retainContext?: boolean;
  layers: GraphLayers;
  referenceSelection?: Parameters<typeof buildNetwork>[3];
  focus: string | null;
  onFocus: (id: string | null) => void;
  serviceMode?: boolean;
  live?: boolean;
  manualDrag?: boolean;
  showExpertsOnServices?: boolean;
  includeHub?: boolean;
  includeProposedCore?: boolean;
  includeServiceCoverage?: boolean;
  configurationRevealStep?: number | null;
  locale?: string;
  motionPaused?: boolean;
  viewControls?: ReactNode;
  viewDashboard?: ReactNode;
  historyControls?: ReactNode;
  trailControls?: ReactNode;
  onResetFilters?: (() => void) | undefined;
  activeServiceIds?: string[] | undefined;
  activeWorkflowIds?: string[];
  highlightedService?: string | null;
  highlightedWorkflow?: string | null;
  coachNode?: string | null;
  highlightedPath?: string[];
  framePath?: boolean;
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
    matchingExperts,
    shortlistIds = EMPTY_IDS,
    onToggleShortlist,
    retainContext = false,
    layers,
    referenceSelection,
    focus,
    onFocus,
    serviceMode = false,
    live = false,
    manualDrag = false,
    showExpertsOnServices = true,
    includeHub = true,
    includeProposedCore = false,
    includeServiceCoverage = true,
    configurationRevealStep = null,
    locale = "en",
    motionPaused = false,
    viewControls,
    viewDashboard,
    historyControls,
    trailControls,
    onResetFilters,
    activeServiceIds = EMPTY_IDS,
    activeWorkflowIds = EMPTY_IDS,
    highlightedService,
    highlightedWorkflow,
    coachNode,
    highlightedPath = EMPTY_IDS,
    framePath = false,
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
  const retainOverview = retainContext && (!serviceMode || configurationRevealStep === null);
  const retainPeople = retainOverview && !serviceMode;
  const layoutAnchor = retainPeople ? "" : anchor;
  // The entire network must fit even in the short canvas above a mobile dossier.
  const minZoom = retainPeople ? 0.025 : 0.3;
  const shortlisted = useMemo(() => new Set(shortlistIds), [shortlistIds]);
  const viewStrip = useRef<HTMLDivElement>(null);
  const hasViewDashboard = Boolean(viewDashboard);
  const wrap = useRef<HTMLDivElement>(null),
    fg = useRef<ForceGraphMethods<NetworkNode, { kind: string }> | undefined>(undefined);
  const cache = useRef(new Map<string, NetworkNode>()),
    paintedPositions = useRef(new Map<string, Point>()),
    manuallyPlaced = useRef(new Map<string, Point>()),
    previousVisibleIds = useRef(new Set<string>()),
    stagedRevealTimes = useRef(new Map<string, number>()),
    revealStarted = useRef(0),
    liveExpanded = useRef(false),
    initialExpansionStarted = useRef(false),
    initialLifecycleElapsed = useRef(0),
    initialLifecycleStartedAt = useRef<number | null>(null);
  const lastAnimationData = useRef<object | null>(null);
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
  const arrangedPoints = useMemo(
    () =>
      layoutNetwork(
        model,
        serviceMode ? "services" : "people",
        effective,
        disabledServiceIds,
        layoutAnchor,
        includeServiceCoverage,
        { keepPeopleInsideRings: retainPeople },
      ),
    [
      model,
      serviceMode,
      effective,
      disabledServiceIds,
      layoutAnchor,
      includeServiceCoverage,
      retainPeople,
    ],
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
  const requestedFocus = retainPeople ? focus || anchor : "";
  const focusedNodeId = graphNodes.some((node) => node.id === requestedFocus)
    ? requestedFocus
    : null;
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
  const neighborhood = useMemo(
    () =>
      layoutAnchor && layoutAnchor !== "isrm"
        ? networkNeighborhood(model, layoutAnchor, disabledServiceIds)
        : null,
    [model, layoutAnchor, disabledServiceIds],
  );
  const anchorKind = model.nodes.find((node) => node.id === anchor)?.kind;
  const contextFocus = useMemo(() => {
    if (!retainOverview) return null;
    const nearby =
      neighborhood?.distances.size && (!retainPeople || anchorKind !== "expert")
        ? neighborhood.distances
        : null;
    if (!matchingExperts || matchingExperts.length === experts.length)
      return nearby ? new Set(nearby.keys()) : null;

    const matches = new Set(matchingExperts.map((expert) => expert.code));
    const matchedNodes = new Set(matches);
    for (const { source, target, kind } of model.links) {
      if (kind !== "category") continue;
      if (matches.has(source)) matchedNodes.add(target);
      if (matches.has(target)) matchedNodes.add(source);
    }
    if (!nearby)
      for (const node of graphNodes) if (node.id.startsWith("public-")) matchedNodes.add(node.id);
    if (nearby) {
      for (const id of matchedNodes) if (!nearby.has(id)) matchedNodes.delete(id);
    }
    if (anchor) matchedNodes.add(anchor);
    return matchedNodes;
  }, [
    retainOverview,
    retainPeople,
    anchorKind,
    neighborhood,
    matchingExperts,
    experts.length,
    model.links,
    graphNodes,
    anchor,
  ]);
  const points = useMemo(() => {
    if (retainPeople || !contextFocus || !initialExpansionStarted.current) return arrangedPoints;
    const positions = new Map(arrangedPoints);
    for (const [id, position] of paintedPositions.current) {
      if (contextFocus.has(id) || !positions.has(id)) continue;
      positions.set(id, rotatePoint(position, -angle.current));
    }
    return positions;
  }, [arrangedPoints, contextFocus, retainPeople]);
  const categoryRingRadii = useMemo(
    () =>
      ["expertise:", "sector:", "country:"].flatMap((prefix) => {
        const node = model.nodes.find(({ id }) => id.startsWith(prefix));
        const point = node && arrangedPoints.get(node.id);
        return point ? [Math.hypot(point.x, point.y)] : [];
      }),
    [arrangedPoints, model.nodes],
  );
  const freePoints = useMemo(
    () =>
      freeNetworkPositions(
        graphNodes.map((node) => node.id),
        points,
        layoutAnchor,
      ),
    [graphNodes, points, layoutAnchor],
  );
  const collapsedPoint = useMemo(
    () => points.get(layoutAnchor) ?? points.get("isrm") ?? { x: 0, y: 0 },
    [layoutAnchor, points],
  );
  const focusNeighborhood =
    !serviceMode && !retainPeople && anchorKind === "expert" ? neighborhood : null;
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
      layoutAnchor,
    );
    const next = {
      nodes: graphNodes.map((n) => {
        const prev =
            (retainContext && paintedPositions.current.get(n.id)) || cache.current.get(n.id),
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
            : ["category", "sample", "public-role", "public-jurisdiction"].includes(l.kind),
        )
        .map((l) => ({ ...l })),
    };
    return next;
  }, [
    graphNodes,
    model.links,
    points,
    collapsedPoint,
    live,
    serviceMode,
    layoutAnchor,
    retainContext,
  ]);
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
    if (retainOverview) return allVisible;
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
    retainOverview,
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
  const visibleEdges = useMemo(
    () =>
      model.links.filter((link) => {
        const { source, target, kind } = link;
        if (!visible.has(source) || !visible.has(target)) return false;
        if (
          neighborhood &&
          !retainOverview &&
          !(serviceMode && configurationRevealStep !== null && configurationRevealStep < 3)
        )
          return neighborhoodEdges.has(source + "\0" + target + "\0" + kind);
        if (kind === "coverage") {
          return serviceMode && effective.some((id) => "svc:" + id === target);
        }
        return serviceMode
          ? kind === "architecture" || kind === "foundation" || kind === "core"
          : kind === "category" ||
              kind === "sample" ||
              (retainPeople && (kind === "public-role" || kind === "public-jurisdiction"));
      }),
    [
      model,
      visible,
      neighborhood,
      neighborhoodEdges,
      serviceMode,
      configurationRevealStep,
      retainOverview,
      retainPeople,
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
  const focusedNeighbours = useMemo(
    () => directNeighbours(visibleEdges, focusedNodeId),
    [visibleEdges, focusedNodeId],
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
  const cameraAnchor = retainOverview ? (focusedNodeId ?? "") : anchor;
  const cameraDuration = motionPaused || (retainContext && reducedMotion) ? 0 : 650;
  const fitVisible = useCallback(() => {
    const positions = new Map(
      data.nodes.map((node) => [node.id, { x: node.x ?? 0, y: node.y ?? 0 }]),
    );
    const view = fitGraphView(
      positions,
      [...visible],
      retainPeople ? "" : cameraAnchor,
      size.w,
      size.h,
      readableExpansions,
      retainPeople ? minZoom : undefined,
    );
    fg.current?.centerAt(view.x, view.y, cameraDuration);
    fg.current?.zoom(view.zoom, cameraDuration);
  }, [
    data,
    visible,
    cameraAnchor,
    size.w,
    size.h,
    readableExpansions,
    cameraDuration,
    retainPeople,
    minZoom,
  ]);
  const resetPositions = () => {
    manuallyPlaced.current.clear();
    angle.current = 0;
    setRotationMode(false);
    for (const node of data.nodes) {
      const point = points.get(node.id);
      if (point) Object.assign(node, { ...point, fx: point.x, fy: point.y, vx: 0, vy: 0 });
    }
    fitVisible();
  };
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
    const strip = viewStrip.current;
    const update = () => {
      const inset = strip
        ? Math.ceil(strip.getBoundingClientRect().height)
        : Number.parseFloat(getComputedStyle(el).getPropertyValue("--graph-canvas-inset")) || 0;
      if (strip) el.style.setProperty("--graph-canvas-inset", `${inset}px`);
      const w = el.clientWidth;
      const h = Math.max(0, el.clientHeight - inset);
      setSize((previous) => (previous.w === w && previous.h === h ? previous : { w, h }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (strip) ro.observe(strip);
    return () => {
      ro.disconnect();
      if (strip) el.style.removeProperty("--graph-canvas-inset");
    };
  }, [hasViewDashboard]);
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
    // A new filter/layout is a transition from the visible state, not another intro.
    if (lastAnimationData.current && lastAnimationData.current !== data) {
      liveExpanded.current = true;
    }
    lastAnimationData.current = data;
    const targetPosition = (id: string) =>
      rotatePoint(
        manuallyPlaced.current.get(id) ?? points.get(id) ?? collapsedPoint,
        angle.current,
      );
    if (manualDrag || motionPaused || (retainContext && reducedMotion)) {
      for (const node of data.nodes) {
        const target = targetPosition(node.id);
        node.x = target.x;
        node.y = target.y;
        node.fx = target.x;
        node.fy = target.y;
      }
      liveExpanded.current = true;
      initialExpansionStarted.current = true;
      if (motionPaused && !retainPeople && !manualDrag) {
        if (retainContext) {
          fg.current?.resumeAnimation();
          raf = requestAnimationFrame(() => fg.current?.pauseAnimation());
        } else fg.current?.pauseAnimation();
      } else fg.current?.resumeAnimation();
      return () => cancelAnimationFrame(raf);
    }
    fg.current?.resumeAnimation();
    const release = () => {
      if (layoutAnchor) return;
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
            if (node.x !== undefined) node.fx = node.x;
            if (node.y !== undefined) node.fy = node.y;
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
          b = targetPosition(n.id);
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
  }, [
    data,
    points,
    freePoints,
    collapsedPoint,
    motionPaused,
    live,
    manualDrag,
    layoutAnchor,
    serviceMode,
    retainContext,
    retainPeople,
    reducedMotion,
  ]);
  const cameraArrangement = readableExpansions || retainOverview ? points : null;
  const selectionViewIds = useMemo(() => {
    if (!retainPeople || !cameraAnchor) return null;
    if (framePath && highlightedPath.length) return highlightedPath;
    return [...focusedNeighbours];
  }, [retainPeople, cameraAnchor, framePath, highlightedPath, focusedNeighbours]);
  // The configurator retains its historical fit; the prototype opens at reading scale.
  useEffect(() => {
    const viewIds =
      focusNeighborhood && !retainOverview ? [...focusNeighborhood.distances.keys()] : [...visible];
    if (retainPeople) {
      // Apply the viewport fit after the renderer's default zoom for new graph data.
      let frame = requestAnimationFrame(() => {
        const graph = fg.current;
        if (!graph) return;
        const positions = new Map(
          [...points].map(([id, p]) => [
            id,
            rotatePoint(manuallyPlaced.current.get(id) ?? p, angle.current),
          ]),
        );
        const ids = selectionViewIds ?? viewIds;
        const view = fitGraphView(positions, ids, cameraAnchor, size.w, size.h, false, minZoom);
        if (selectionViewIds) {
          const group = ids.flatMap((id) => positions.get(id) ?? []);
          if (group.length) {
            const xs = group.map((point) => point.x);
            const ys = group.map((point) => point.y);
            const left = Math.min(...xs),
              right = Math.max(...xs);
            const top = Math.min(...ys),
              bottom = Math.max(...ys);
            view.x = (left + right) / 2;
            view.y = (top + bottom) / 2;
            view.zoom = Math.max(
              minZoom,
              Math.min(
                3,
                (size.w * 0.79) / Math.max(1, right - left),
                (size.h * 0.79) / Math.max(1, bottom - top),
              ),
            );
          }
        }
        const start = graph.centerAt();
        const startZoom = graph.zoom();
        const canAnimate =
          cameraDuration > 0 &&
          ids.every((id) => {
            const point = positions.get(id);
            return (
              !point ||
              (Math.abs(point.x - start.x) * startZoom <= size.w / 2 - 4 &&
                Math.abs(point.y - start.y) * startZoom <= size.h / 2 - 4)
            );
          });
        if (!canAnimate) {
          graph.zoom(view.zoom);
          graph.centerAt(view.x, view.y);
          return;
        }

        const from = { x: start.x * startZoom, y: start.y * startZoom };
        const to = { x: view.x * view.zoom, y: view.y * view.zoom };
        const startedAt = performance.now();
        const move = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / cameraDuration);
          const eased = 1 - (1 - progress) ** 3;
          const zoom = startZoom + (view.zoom - startZoom) * eased;
          // Interpolate the screen transform so points between two fitted views stay in frame.
          const centre = interpolatePoint(from, to, progress);
          graph.zoom(zoom);
          graph.centerAt(centre.x / zoom, centre.y / zoom);
          if (progress < 1) frame = requestAnimationFrame(move);
        };
        frame = requestAnimationFrame(move);
      });
      return () => cancelAnimationFrame(frame);
    }
    const view = fitGraphView(points, viewIds, cameraAnchor, size.w, size.h, readableExpansions);
    fg.current?.centerAt(view.x, view.y, cameraDuration);
    fg.current?.zoom(view.zoom, cameraDuration);
    return undefined;
    // Coverage changes do not enter this dependency list, keeping the service wheel stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    layoutAnchor,
    cameraAnchor,
    cameraDuration,
    size.w,
    size.h,
    serviceMode,
    motionPaused,
    live,
    cameraArrangement,
    selectionViewIds,
    readableExpansions,
    focusNeighborhood,
    retainOverview,
    retainPeople,
    minZoom,
  ]);
  const backgroundEdge = (link: DrawLink) =>
    contextFocus &&
    (!contextFocus.has(endId(link.source)) || !contextFocus.has(endId(link.target)));
  const pathEdge = (link: DrawLink) => {
    const source = endId(link.source);
    const target = endId(link.target);
    return highlightedPath.some(
      (id, index) =>
        (id === source && highlightedPath[index + 1] === target) ||
        (id === target && highlightedPath[index + 1] === source),
    );
  };
  const searchableIds = new Set(experts.map(({ code }) => code));
  const matchedIds = new Set((matchingExperts ?? experts).map(({ code }) => code));
  const matchesFilters = (id: string) => !searchableIds.has(id) || matchedIds.has(id);
  const focusDegree = retainPeople
    ? Math.max(
        1,
        [...focusedNeighbours].filter((id) => id !== focusedNodeId && matchesFilters(id)).length,
      )
    : 1;
  const focusedEdge = (link: DrawLink) => {
    const source = endId(link.source);
    const target = endId(link.target);
    return (
      focusedNodeId !== null &&
      (source === focusedNodeId || target === focusedNodeId) &&
      (!retainPeople || (matchesFilters(source) && matchesFilters(target)))
    );
  };
  useEffect(() => {
    if (preview && !visible.has(preview)) setPreview(null);
  }, [visible, preview]);
  const radius = (n: NetworkNode) =>
    (retainPeople ? PEOPLE_MAP_NODE_STYLES[networkSymbolKind(n)]?.radius : undefined) ??
    (n.kind === "core"
      ? 21
      : n.kind === "isrm"
        ? 16
        : n.kind === "service"
          ? 11
          : n.kind === "workflow"
            ? n.id === "workflow:search"
              ? 13
              : 10
            : n.kind === "expert" || (retainPeople && n.id.startsWith("public-person:"))
              ? 4.6
              : 8);
  const colour = (n: NetworkNode) =>
    highContrast
      ? {
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
        }[n.kind]
      : MAP_SYMBOLS[networkSymbolKind(n)].color;
  const shape = (n: NetworkNode, r: number) => {
    const x = n.x ?? 0,
      y = n.y ?? 0;
    const path = new Path2D();
    path.addPath(
      new Path2D(mapSymbolPath(networkSymbolKind(n), r)),
      new DOMMatrix().translate(x, y),
    );
    return path;
  };
  const resetLabel = locale === "uk" ? "Скинути фільтри" : "Reset filters";
  const graphViewTools = (
    <div
      className={
        "network-graph-view-tools" + (hasViewDashboard && size.w < 475 ? " is-narrow" : "")
      }
      role="group"
      aria-label={locale === "uk" ? "Керування графом" : "Graph navigation"}
    >
      {historyControls}
      <button
        type="button"
        className="network-overview-control"
        aria-label={
          viewControls
            ? locale === "uk"
              ? "Зняти фокус"
              : "Clear focus"
            : locale === "uk"
              ? "Весь граф"
              : "Overview"
        }
        data-hint={
          viewControls
            ? locale === "uk"
              ? "Зняти фокус, зберегти фільтри"
              : "Clear focus, keep filters"
            : locale === "uk"
              ? "Весь граф"
              : "Overview"
        }
        onClick={() => {
          if (viewControls || anchor || focusedNodeId) onAnchor?.("");
          else fitVisible();
        }}
      >
        {viewControls ? <Network size={18} /> : <Scan size={15} />}
        <span>{locale === "uk" ? "Весь граф" : "Overview"}</span>
      </button>
      {viewControls}
      {readableExpansions && workflowInfoId && (
        <button
          className="network-workflow-info"
          onClick={() => onWorkflowSelect?.(workflowInfoId)}
          aria-label={locale === "uk" ? "Пояснення workflow" : "Workflow information"}
        >
          <Info size={17} />
        </button>
      )}
      {viewControls && (
        <button
          type="button"
          aria-label={locale === "uk" ? "Відновити розкладку" : "Restore layout"}
          data-hint={
            locale === "uk" ? "Повернути вузли на місця" : "Return nodes to their positions"
          }
          onClick={resetPositions}
        >
          <Undo2 size={18} />
        </button>
      )}
      <button
        type="button"
        className="network-rotate-control"
        aria-pressed={rotationMode}
        aria-label={locale === "uk" ? "Обертання" : "Rotate"}
        data-hint={locale === "uk" ? "Обертання" : "Rotate"}
        title={
          locale === "uk"
            ? "Обертання у площині: прокрутка двома пальцями; щипок змінює масштаб"
            : "Rotate in the plane: two-finger scroll; pinch still zooms"
        }
        onClick={() => setRotationMode((v) => !v)}
      >
        <RotateCw size={viewControls ? 18 : 15} />
        <span>{locale === "uk" ? "Обертання" : "Rotate"}</span>
      </button>
      {onResetFilters && (
        <button
          type="button"
          aria-label={resetLabel}
          data-hint={resetLabel}
          onClick={onResetFilters}
        >
          <FilterX size={18} />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );

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
        enableNodeDrag={live || manualDrag}
        onNodeDrag={(node) => {
          if (manualDrag) {
            manuallyPlaced.current.set(
              node.id,
              rotatePoint({ x: node.x ?? 0, y: node.y ?? 0 }, -angle.current),
            );
            return;
          }
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
          if (manualDrag) {
            if (node.x !== undefined) node.fx = node.x;
            if (node.y !== undefined) node.fy = node.y;
            return;
          }
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
        minZoom={minZoom}
        maxZoom={3}
        nodeVisibility={(n) => visible.has(n.id)}
        linkVisibility={(link: DrawLink) =>
          visibleEdgeIds.has(endId(link.source) + "\0" + endId(link.target) + "\0" + link.kind)
        }
        linkColor={(link: DrawLink) => {
          if (pathEdge(link)) return "rgba(104,205,199,.95)";
          if (focusedEdge(link)) {
            const opacity = Math.max(0.12, 0.86 / Math.sqrt(focusDegree / 2));
            return `rgba(104,205,199,${Math.min(0.86, opacity)})`;
          }
          if (focusedNodeId) {
            const touchesHover = hover && [endId(link.source), endId(link.target)].includes(hover);
            if (touchesHover) return "rgba(104,205,199,.28)";
            return highContrast ? "rgba(145,181,196,.22)" : "rgba(145,181,196,.09)";
          }
          if (backgroundEdge(link)) return "rgba(145,181,196,.045)";
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
            selectedWorkflowEdge ||
            directFocusEdge ||
            (hover && (source === hover || target === hover));
          return related
            ? retainPeople && hover
              ? `rgba(104,205,199,${Math.max(0.12, Math.min(0.8, 0.8 / Math.sqrt(hoverNeighbours.size / 2)))})`
              : "rgba(104,205,199,.92)"
            : inFocusNeighborhood
              ? "rgba(145,181,196,.34)"
              : focusNeighborhood
                ? "rgba(145,181,196,.055)"
                : hover && !retainPeople
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
            : pathEdge(link)
              ? 1.8
              : focusedEdge(link)
                ? focusDegree > 8
                  ? 0.8
                  : 1.5
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
        linkDirectionalArrowColor={(link: DrawLink) =>
          backgroundEdge(link) ? "rgba(145,181,196,.12)" : "rgba(104,205,199,.92)"
        }
        linkLineDash={(l: DrawLink) =>
          retainPeople && pathEdge(l)
            ? [4, 3]
            : l.kind === "sample"
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
          if (!serviceMode && !live && (!neighborhood || retainPeople)) {
            ctx.save();
            ctx.strokeStyle = "rgba(145,181,196,.06)";
            ctx.lineWidth = 1 / scale;
            for (const radius of categoryRingRadii) {
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
                  highlightedPath.includes(node.id) ||
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
          const zoomCentre =
            retainPeople && scale >= GRAPH_LABEL_ZOOM
              ? fg.current?.screen2GraphCoords(size.w / 2, size.h / 2)
              : undefined;
          const distanceToCentre = (node: NetworkNode) =>
            zoomCentre && node.x !== undefined && node.y !== undefined
              ? Math.hypot(node.x - zoomCentre.x, node.y - zoomCentre.y)
              : 0;
          const candidates = data.nodes
            .filter(
              (node) =>
                visible.has(node.id) &&
                (!contextFocus ||
                  contextFocus.has(node.id) ||
                  focusedNeighbours.has(node.id) ||
                  highlightedPath.includes(node.id) ||
                  node.id === hover ||
                  node.id === focus) &&
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
                distanceToCentre(a) - distanceToCentre(b) ||
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
            const attached = retainPeople && node.kind !== "expert";
            const labelScale = attached
              ? 1 + Math.min(0.28, Math.max(0, (scale - 0.75) * 0.16))
              : 1;
            const labelFont = `${primary ? 600 : 500} ${(14 * labelScale) / scale}px "IBM Plex Sans",sans-serif`;
            ctx.textAlign = "left";
            ctx.font = labelFont;
            const labelLines = wrap(label, Math.min(232 * labelScale, size.w - 24) / scale);
            const detailLines = detail ? wrap(detail, 232 / scale) : [];
            ctx.font = `700 ${10 / scale}px "IBM Plex Sans",sans-serif`;
            const typeWidth = typeLabel ? ctx.measureText(typeLabel).width + 12 / scale : 0;
            ctx.font = labelFont;
            const width =
              Math.max(
                typeWidth,
                ...[...labelLines, ...detailLines].map((line) => ctx.measureText(line).width),
              ) +
              12 / scale;
            const height =
              ((typeLabel ? 12 : 0) +
                labelLines.length * 17 * labelScale +
                (detailLines.length ? detailLines.length * 13 + 3 : 0) +
                4) /
              scale;
            const gap = radius(node) + 7 / scale;
            const options: (Point & { align?: CanvasTextAlign })[] = attached
              ? [
                  { x: node.x + gap, y: node.y - (10 * labelScale) / scale, align: "left" },
                  {
                    x: node.x - gap - width,
                    y: node.y - (10 * labelScale) / scale,
                    align: "right",
                  },
                  { x: node.x - width / 2, y: node.y - gap - height, align: "center" },
                  { x: node.x - width / 2, y: node.y + gap, align: "center" },
                ]
              : node.kind === "core"
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
            if (attached) {
              const end = {
                x: Math.max(box.x, Math.min(node.x, box.x + box.w)),
                y: Math.max(box.y, Math.min(node.y, box.y + box.h)),
              };
              const dx = end.x - node.x;
              const dy = end.y - node.y;
              const start = (radius(node) * 0.85) / Math.hypot(dx, dy);
              ctx.beginPath();
              ctx.moveTo(node.x + dx * start, node.y + dy * start);
              ctx.lineTo(end.x, end.y);
              ctx.strokeStyle = highContrast ? "#000000" : "#102c3c";
              ctx.lineWidth = 3.5 / scale;
              ctx.stroke();
              ctx.strokeStyle = colour(node);
              ctx.lineWidth = 1.5 / scale;
              ctx.stroke();
            }
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
              ctx.font = labelFont;
            }
            const alignment = position.align ?? "left";
            ctx.textAlign = alignment;
            const textX =
              alignment === "center"
                ? box.x + box.w / 2
                : alignment === "right"
                  ? box.x + box.w - 6 / scale
                  : box.x + 6 / scale;
            const drawLabelLines = (lines: string[], startY: number, lineHeight: number) => {
              lines.forEach((line, index) => {
                const y = box.y + ((typeLabel ? 12 : 0) + startY + lineHeight * index) / scale;
                ctx.strokeStyle = highContrast ? "#000000" : "#102c3c";
                ctx.lineJoin = "round";
                ctx.lineWidth = 3 / scale;
                ctx.strokeText(line, textX, y);
                ctx.fillStyle = colour(node);
                ctx.fillText(line, textX, y);
              });
            };
            drawLabelLines(labelLines, 10 * labelScale, 15 * labelScale);
            if (detailLines.length) {
              ctx.font = `${10 / scale}px "IBM Plex Sans",sans-serif`;
              drawLabelLines(detailLines, labelLines.length * 15 + 13, 11);
            }
          }
          ctx.restore();
        }}
        onNodeHover={(n) => setHover(n?.id ?? null)}
        onNodeClick={(n, event) => {
          if (onToggleShortlist && (event.metaKey || event.ctrlKey)) {
            if (n.kind === "expert" && n.expert) onToggleShortlist(n.expert.code);
            return;
          }
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
        onBackgroundClick={(event) => {
          if (onToggleShortlist && (event.metaKey || event.ctrlKey)) return;
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
          if (retainContext) {
            const position = paintedPositions.current.get(n.id);
            if (position) {
              position.x = n.x;
              position.y = n.y;
            } else paintedPositions.current.set(n.id, { x: n.x, y: n.y });
          }
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
          const background =
            (focusedNodeId
              ? !focusedNeighbours.has(n.id) || (n.id !== focusedNodeId && !matchesFilters(n.id))
              : contextFocus && !contextFocus.has(n.id)) && !highlightedPath.includes(n.id);
          if (background)
            ctx.globalAlpha *= retainPeople
              ? highContrast
                ? 0.6
                : 0.46
              : highContrast
                ? 0.45
                : 0.3;
          else if (focusNeighborhood) {
            const depth = focusNeighborhood.distances.get(n.id);
            ctx.globalAlpha *= depth === undefined ? 0.1 : depth > 1 ? 0.38 : 1;
          }
          if (!retainPeople && !background && hover && !hoverNeighbours.has(n.id) && !selected)
            ctx.globalAlpha *= 0.25;
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
          const nodePath = shape(n, r);
          const isExpert = n.kind === "expert";
          const isRepresentative = n.id.startsWith("public-person:");
          const appearance = retainPeople
            ? PEOPLE_MAP_NODE_STYLES[networkSymbolKind(n)]
            : undefined;
          const hasSourceFlag = isExpert && n.expert?.verified;
          const sourceContourRadius = r + 2.8;
          const sourceContourWidth = 2;
          ctx.fillStyle =
            isExpert || isRepresentative ? colour(n) : (appearance?.fill ?? "#102c3c");
          ctx.strokeStyle = selected ? "#f1deb1" : colour(n);
          ctx.lineWidth = (selected ? 2.4 : (appearance?.strokeWidth ?? 1.4)) / scale;
          ctx.fill(nodePath);
          if (!isExpert && !(retainPeople && isRepresentative)) ctx.stroke(nodePath);
          if (isRepresentative) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 3 / scale, 0, Math.PI * 2);
            ctx.strokeStyle = PUBLIC_REPRESENTATIVE_OUTLINE;
            ctx.stroke();
          }
          const inShortlist = isExpert && shortlisted.has(n.id);
          if (selected && !inShortlist) {
            const focusRadius = hasSourceFlag
              ? sourceContourRadius + sourceContourWidth / 2 + 2 / scale
              : r + 4 / scale;
            ctx.beginPath();
            ctx.arc(n.x, n.y, focusRadius, 0, Math.PI * 2);
            ctx.strokeStyle = colour(n);
            ctx.lineWidth = 1 / scale;
            ctx.stroke();
          }
          if (hasSourceFlag) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, sourceContourRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "#f1deb1";
            ctx.lineWidth = sourceContourWidth;
            ctx.stroke();
          }
          if (inShortlist) {
            const outside = hasSourceFlag ? sourceContourRadius + sourceContourWidth / 2 : r;
            ctx.beginPath();
            ctx.arc(n.x, n.y, outside + 2.5 / scale, 0, Math.PI * 2);
            ctx.setLineDash([3 / scale, 2 / scale]);
            ctx.strokeStyle = highContrast ? "#fff" : "#c1ffe8";
            ctx.lineWidth = (n.id === focus ? 2 : 1.4) / scale;
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
      {hasViewDashboard ? (
        <div ref={viewStrip} className="workspace-map-strip">
          {viewDashboard}
          {graphViewTools}
          {trailControls}
        </div>
      ) : (
        graphViewTools
      )}
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
