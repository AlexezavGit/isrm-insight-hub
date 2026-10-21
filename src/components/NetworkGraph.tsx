import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import { NETWORK_SERVICES, type ServiceItem } from "@/lib/services-data";

type Kind = "expert" | "sector" | "theme" | "hub";

interface GNode {
  id: string;
  kind: Kind;
  label: string;
  expert?: Expert;
  service?: ServiceItem;
  size: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  lastConnectedSvc?: string;
}

interface GLink {
  source: string | GNode;
  target: string | GNode;
  kind: string;
  label?: string;
}

export interface GraphLayers {
  sector: boolean;
  theme: boolean;
  hub: boolean;
  researchQueue: boolean;
}

const SERVICE_EDGE_LABELS: Record<string, { en: string; uk: string }> = {
  "hub:mvp": { uk: "Рада асоціації", en: "Advisory board" },
  "svc:mvp": { uk: "Ядро мережі", en: "Core fellowship" },
  "svc:acquisitions": { uk: "Цільовий відбір", en: "Targeted outreach" },
  "svc:discussions": { uk: "Робоча група", en: "Working panel" },
  "svc:reports": { uk: "Співавтор аналітики", en: "Report co-author" },
  "svc:expertise": { uk: "Автор кейсу / TII", en: "Case author & TII" },
  "svc:warroom": { uk: "Оперативна група", en: "Rapid response" },
  "svc:conferences": { uk: "Спікер секції", en: "Section speaker" },
  "svc:memberships": { uk: "Амбасадор спільноти", en: "Community ambassador" },
};

function strHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function NetworkGraph({
  experts,
  layers,
  focus,
  onFocus,
  serviceMode = false,
  activeServiceId = null,
  onServiceSelect,
  onAllServicesRevealed,
  onBackgroundClick,
  onRevealedServicesChange,
  leftPanelOpen = false,
  rightPanelOpen = false,
  locale = "en",
}: {
  experts: Expert[];
  layers: GraphLayers;
  focus: string | null;
  onFocus: (code: string | null) => void;
  serviceMode?: boolean;
  activeServiceId?: string | null;
  onServiceSelect?: (serviceId: string | null) => void;
  onAllServicesRevealed?: () => void;
  onBackgroundClick?: () => void;
  onRevealedServicesChange?: (count: number) => void;
  leftPanelOpen?: boolean;
  rightPanelOpen?: boolean;
  locale?: string;
}) {
  const fg = useRef<any>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hover, setHover] = useState<string | null>(null);
  // Hovered link (edge) for showing edge label only on hover per user spec:
  // 'написи имен та ребра з'являлися тільки при наведенні'
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Set of service node IDs that have sprouted their person nodes
  const [revealedServices, setRevealedServices] = useState<Set<string>>(() => new Set());
  const [currentActiveService, setCurrentActiveService] = useState<string | null>(null);
  // MVP click illuminates ALL people nodes at 30% brightness (per user spec).
  // Different from service clicks which attach specific expert pools.
  const [illuminateAll, setIlluminateAll] = useState(false);
  // Services that were revealed but are now unclicked — their edges persist as
  // 'shadow' edges with a 'Втрачено: [label]' negative label, signalling what the
  // Institute would lose by toggling that service off. Cleared on re-click.
  const [detachedServices, setDetachedServices] = useState<Set<string>>(() => new Set());
  // Per-expert reveal timestamps for staggered emerge animation (200ms between siblings)
  const [revealedAt, setRevealedAt] = useState<Map<string, number>>(() => new Map());
  // Animation tick — bumped every 80ms via interval ONLY in serviceMode, so
  // nodeCanvasObject can read fresh Date.now() deltas and animate globalAlpha.
  // IMPORTANT: animTick is NOT in the `data` useMemo deps — that would recompute
  // nodes every 80ms, recreating node objects, restarting force simulation →
  // nodes 'fly around like flies' bug. The animation tick triggers React
  // re-render (which triggers canvas re-render) WITHOUT touching graph data.
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    // Only run animation loop when serviceMode is active (staggered emerge)
    if (!serviceMode) return;
    let active = true;
    let stopped = false;
    let raf: number;
    const loop = () => {
      if (!active || stopped) return;
      setAnimTick((t) => (t + 1) % 1_000_000);
      raf = window.setTimeout(loop, 80);
    };
    raf = window.setTimeout(loop, 80);
    // Auto-stop after 8 seconds of inactivity — emerge animations are 600ms per node
    // max ~2.5s for 8 staggered nodes; 8s gives ample margin then stops to save CPU
    return () => {
      active = false;
      stopped = true;
      window.clearTimeout(raf);
      };
  }, [serviceMode]);

  // Sync external activeServiceId with internal state
  useEffect(() => {
    if (activeServiceId) {
      setCurrentActiveService(activeServiceId);
      setRevealedServices((prev) => new Set([...prev, activeServiceId]));
    }
  }, [activeServiceId]);

  // Check if all 9 nodes revealed (8 services + MVP illuminateAll)
  // Per user spec: '9 кліків бо центральний теж рахується'
  // MVP click toggles 'illuminateAll' (not added to revealedServices).
  // So modal triggers when 8 services are revealed AND illuminateAll is true.
  const allServicesRevealedReported = useRef(false);
  useEffect(() => {
    if (
      serviceMode &&
      revealedServices.size >= NETWORK_SERVICES.length &&
      illuminateAll &&
      !allServicesRevealedReported.current
    ) {
      allServicesRevealedReported.current = true;
      onAllServicesRevealed?.();
    }
  }, [revealedServices.size, serviceMode, illuminateAll, onAllServicesRevealed]);

  // Lift revealedServices count up to parent (for dashboard display)
  useEffect(() => {
    onRevealedServicesChange?.(revealedServices.size);
  }, [revealedServices.size, onRevealedServicesChange]);

  // Auto-zoom-out to fit all visible nodes when revealedServices changes.
  // Graph must shrink as more people nodes are added so nothing crawls off-screen.
  useEffect(() => {
    if (!serviceMode || !fg.current) return;
    // Small delay so the new nodes have been added to graphData before fitting
    const handle = window.setTimeout(() => {
      try {
        fg.current?.zoomToFit(400, 60);
      } catch {
        // ignore — fg ref might not be ready on first render
      }
    }, 120);
    return () => window.clearTimeout(handle);
  }, [revealedServices, detachedServices, serviceMode]);

  // Color tokens aligned with FEEL Again / Bunker palette (Teal/Petrol, Gold, Orange, Cream)
  // Plus brass for service labels (per user spec — different colors for different label types)
  const colors = useMemo(
    () => ({
      petrol: "#0b2422",
      petrolLight: "#3e91a2",
      gold: "#c8901a",
      goldLight: "#fce9b0",
      brass: "#c8901a", // brass = gold (ISRM palette)
      orange: "#f08a2e",
      fg: "#f8fafc", // cream white (for people labels)
      peopleLabel: "#f8fafc", // people labels — cream
      serviceLabel: "#c8901a", // service labels — brass
      edgeLabel: "#fce9b0", // edge labels — gold-light (different from people + service)
      muted: "#94a3b8",
      border: "#334155",
      success: "#10b981",
      c2: "#38bdf8",
      bg: "#090d16",
    }),
    [],
  );

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fixed ring geometry for services: inner ring R=185, MVP at center
  const fixedServiceNodes = useMemo(() => {
    const R = 185;
    const nodes: GNode[] = [
      {
        id: "hub:mvp",
        kind: "hub",
        label: locale === "uk" ? "MVP Застосунок" : "MVP Application",
        size: 12,
        fx: 0,
        fy: 0,
        x: 0,
        y: 0,
      },
    ];

    const lang = locale === "uk" ? "uk" : "en";
    NETWORK_SERVICES.forEach((svc, i) => {
      const angle = (i / NETWORK_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
      const x = Math.round(Math.cos(angle) * R);
      const y = Math.round(Math.sin(angle) * R);

      nodes.push({
        id: svc.id,
        kind: "theme",
        label: svc.title[lang],
        service: svc,
        size: 8.5,
        fx: x,
        fy: y,
        x,
        y,
      });
    });

    return nodes;
  }, [locale]);

  // Map each service to a curated pool of verified experts from the real network
  const serviceExpertMap = useMemo(() => {
    const verified = experts.filter((e) => e.verified);
    const map = new Map<string, Expert[]>();

    // MVP at center is the foundational service — search/interaction tool that
    // every member uses. Per user spec: 'MVP — це сервіс, який за ідеєю охоплює
    // всіх' — MVP click ILLUMINATES THE ENTIRE people graph at 30% brightness,
    // NOT attaching a specific subset. The 'illuminateAll' state is tracked
    // separately and rendered in nodeCanvasObject (people dim up from ambient
    // 0.18 to ~0.50 alpha). So MVP has NO entry in serviceExpertMap — its
    // behavior is special-cased in onNodeClick + render.
    // (Setting empty array as sentinel so the 'hub:mvp' id is recognized.)
    map.set("hub:mvp", []);

    NETWORK_SERVICES.forEach((svc, idx) => {
      const count = svc.assumedExpertCount || 6;
      const start = (idx * 5) % Math.max(1, verified.length);
      const list: Expert[] = [];
      for (let i = 0; i < count; i++) {
        const item = verified[(start + i) % verified.length];
        if (item && !list.some((x) => x.code === item.code)) {
          list.push(item);
        }
      }
      map.set(svc.id, list);
    });
    return map;
  }, [experts]);

  const data = useMemo(() => {
    const nodes: GNode[] = [];
    const links: GLink[] = [];

    const ensure = (id: string, kind: Kind, label: string) => {
      let n = nodes.find((x) => x.id === id);
      if (!n) nodes.push((n = { id, kind, label, size: 0 }));
      n.size++;
    };

    if (!serviceMode) {
      // NORMAL MODE: Browse living network
      for (const e of experts) {
        if (!e.verified && !layers.researchQueue) continue;
        nodes.push({ id: e.code, kind: "expert", label: e.displayName, expert: e, size: 2.5 });
        if (layers.sector && e.sector && e.sector !== "Unclassified") {
          ensure("S:" + e.sector, "sector", e.sector);
          links.push({ source: e.code, target: "S:" + e.sector, kind: "sector" });
        }
        if (
          layers.theme &&
          e.ukraineCategory &&
          !["Ukraine-related experience", "Не оцінено"].includes(e.ukraineCategory)
        ) {
          ensure("T:" + e.ukraineCategory, "theme", e.ukraineCategory);
          links.push({ source: e.code, target: "T:" + e.ukraineCategory, kind: "theme" });
        }
        if (layers.hub && e.communityRole && e.communityRole !== "Member / participant") {
          ensure("H:" + e.communityRole, "hub", e.communityRole);
          links.push({ source: e.code, target: "H:" + e.communityRole, kind: "hub" });
        }
        if (!e.verified && layers.researchQueue) {
          ensure("P:queue", "hub", locale === "uk" ? "Черга ресерчу" : "Research queue");
          links.push({ source: e.code, target: "P:queue", kind: "pool" });
        }
      }

      // Expert peer links
      const byOrg = new Map<string, string[]>();
      experts.forEach((e) => {
        if (e.organization) byOrg.set(e.organization, [...(byOrg.get(e.organization) || []), e.code]);
      });
      byOrg.forEach((codes) => {
        for (let i = 1; i < codes.length; i++)
          links.push({ source: codes[0]!, target: codes[i]!, kind: "peer" });
      });

      return { nodes, links };
    }

    // SERVICE MODE: Overlay service ring & position experts strictly on the OUTER circle
    fixedServiceNodes.forEach((sn) => nodes.push({ ...sn }));

    // 1. Ring connection edges between adjacent services
    const count = NETWORK_SERVICES.length;
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count;
      links.push({
        source: NETWORK_SERVICES[i].id,
        target: NETWORK_SERVICES[next].id,
        kind: "ring",
      });
    }

    // 2. Clean spokes connecting central MVP to each of the 8 services
    NETWORK_SERVICES.forEach((svc) => {
      links.push({
        source: "hub:mvp",
        target: svc.id,
        kind: "mvp",
      });
    });

    // 3. Position expert nodes strictly on the OUTER circumference
    const R_OUTER = 310;
    // Bug #16 fix: latest-clicked service wins positioning for shared experts.
    // Array.from(revealedServices) preserves insertion order; reverse() puts latest first.
    const activeServicesList = Array.from(revealedServices).reverse();
    // Detached services (previously revealed, now unclicked) — keep their edges as shadows.
    const detachedList = Array.from(detachedServices);
    // Union: any service that ever had experts attached — used to render shadow edges.
    const allEverAttached = new Set<string>([...revealedServices, ...detachedServices]);

    for (const e of experts) {
      if (!e.verified && !layers.researchQueue) continue;

      // Find if connected to any revealed service (latest-clicked wins)
      const connectedSvc = activeServicesList.find((svcId) =>
        serviceExpertMap.get(svcId)?.some((exp) => exp.code === e.code),
      );
      // Find if detached (was in a previously-revealed service, but no longer connected)
      const detachedSvc = detachedList.find((svcId) =>
        serviceExpertMap.get(svcId)?.some((exp) => exp.code === e.code),
      );

      let fx: number | undefined;
      let fy: number | undefined;

      if (connectedSvc) {
        // Position radially outside that specific service node
        const list = serviceExpertMap.get(connectedSvc) ?? [];
        const idxInList = list.findIndex((exp) => exp.code === e.code);
        const total = Math.max(1, list.length);

        let svcAngle = 0;
        if (connectedSvc === "hub:mvp") {
          svcAngle = (idxInList / total) * 2 * Math.PI - Math.PI / 4;
        } else {
          const sIdx = NETWORK_SERVICES.findIndex((s) => s.id === connectedSvc);
          svcAngle = (sIdx / NETWORK_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
        }

        const angleSpread = svcAngle + (idxInList - (total - 1) / 2) * 0.16;
        fx = Math.round(Math.cos(angleSpread) * R_OUTER);
        fy = Math.round(Math.sin(angleSpread) * R_OUTER);
      } else if (detachedSvc) {
        // Detached: keep expert position at last-known location so shadow edge makes sense.
        // Reuse the same radial position as if still connected.
        const list = serviceExpertMap.get(detachedSvc) ?? [];
        const idxInList = list.findIndex((exp) => exp.code === e.code);
        const total = Math.max(1, list.length);
        let svcAngle = 0;
        if (detachedSvc === "hub:mvp") {
          svcAngle = (idxInList / total) * 2 * Math.PI - Math.PI / 4;
        } else {
          const sIdx = NETWORK_SERVICES.findIndex((s) => s.id === detachedSvc);
          svcAngle = (sIdx / NETWORK_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
        }
        const angleSpread = svcAngle + (idxInList - (total - 1) / 2) * 0.16;
        fx = Math.round(Math.cos(angleSpread) * R_OUTER);
        fy = Math.round(Math.sin(angleSpread) * R_OUTER);
      } else {
        // Ambient background position around the outer periphery
        const h = strHash(e.code);
        const bgAngle = ((h % 360) * Math.PI) / 180;
        const bgDist = 265 + (strHash(e.code + "rad") % 85);
        fx = Math.round(Math.cos(bgAngle) * bgDist);
        fy = Math.round(Math.sin(bgAngle) * bgDist);
      }

      nodes.push({
        id: e.code,
        kind: "expert",
        label: e.displayName,
        expert: e,
        size: connectedSvc ? 5.5 : 2.5,
        fx,
        fy,
        x: fx,
        y: fy,
        lastConnectedSvc: connectedSvc ?? detachedSvc,
      });
    }

    // 4. Edges from active services out to their people (gold, positive label)
    activeServicesList.forEach((svcId) => {
      const activeExperts = serviceExpertMap.get(svcId) ?? [];
      const edgeLabel =
        SERVICE_EDGE_LABELS[svcId]?.[locale === "uk" ? "uk" : "en"] ||
        (locale === "uk" ? "Залучення" : "Engagement");

      activeExperts.forEach((exp) => {
        if (nodes.some((n) => n.id === exp.code)) {
          links.push({
            source: svcId,
            target: exp.code,
            kind: "service-expert",
            label: edgeLabel,
          });
        }
      });
    });

    // 4b. Shadow edges from detached services — same target experts but rendered
    // as dashed gray/red with negative label 'Втрачено: [label]'.
    detachedList.forEach((svcId) => {
      const detachedExperts = serviceExpertMap.get(svcId) ?? [];
      const originalLabel =
        SERVICE_EDGE_LABELS[svcId]?.[locale === "uk" ? "uk" : "en"] ||
        (locale === "uk" ? "Залучення" : "Engagement");
      const lostPrefix = locale === "uk" ? "Втрачено: " : "Lost: ";
      const lostLabel = lostPrefix + originalLabel;

      detachedExperts.forEach((exp) => {
        // Only draw shadow edge if expert is NOT currently connected to another revealed service
        // (otherwise the same expert would have both a gold and a dashed edge from two services,
        //  which is confusing — gold edge wins, shadow edge skipped for that expert).
        const isStillConnectedElsewhere = activeServicesList.some((other) =>
          other !== svcId && serviceExpertMap.get(other)?.some((e2) => e2.code === exp.code),
        );
        if (isStillConnectedElsewhere) return;
        if (!nodes.some((n) => n.id === exp.code)) return;
        links.push({
          source: svcId,
          target: exp.code,
          kind: "service-expert-lost",
          label: lostLabel,
        });
      });
    });

    void allEverAttached; // reserved for future telemetry hooks
    // NOTE: animTick is intentionally NOT in the deps array below — including it
    // would recompute nodes every 80ms, recreating node objects, restarting force
    // simulation → 'nodes fly around like flies' bug. Canvas still re-renders on
    // animTick state change because the parent component re-renders.

    return { nodes, links };
  }, [
    experts,
    layers,
    locale,
    serviceMode,
    fixedServiceNodes,
    revealedServices,
    detachedServices,
    serviceExpertMap,
  ]);

  const active = focus || hover;
  const activeSet = useMemo(() => {
    if (!active) return null;
    const s = new Set<string>([active]);
    data.links.forEach((l) => {
      const src = typeof l.source === "string" ? l.source : (l.source as GNode).id;
      const tgt = typeof l.target === "string" ? l.target : (l.target as GNode).id;
      if (src === active) s.add(tgt);
      if (tgt === active) s.add(src);
    });
    return s;
  }, [active, data.links]);

  // Center on focused expert
  useEffect(() => {
    if (!focus || !fg.current) return;
    const n = data.nodes.find((x) => x.id === focus || (x.expert && x.expert.code === focus));
    if (n && n.x != null && n.y != null) {
      fg.current.centerAt(n.x, n.y, 600);
      fg.current.zoom(2.0, 600);
    }
  }, [focus, data]);

  // Smooth camera centering and panel offset
  useEffect(() => {
    if (!fg.current) return;
    if (leftPanelOpen && !rightPanelOpen) {
      fg.current.centerAt(-85, 0, 500);
    } else if (rightPanelOpen && !leftPanelOpen) {
      fg.current.centerAt(85, 0, 500);
    } else {
      fg.current.centerAt(0, 0, 500);
    }
  }, [leftPanelOpen, rightPanelOpen]);

  // Initial centering in service mode
  useEffect(() => {
    if (serviceMode && fg.current) {
      fg.current.centerAt(0, 0, 700);
      fg.current.zoom(1.05, 700);
    }
  }, [serviceMode]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <ForceGraph2D
        ref={fg}
        width={size.w}
        height={size.h}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={serviceMode ? 10 : 140}
        onEngineStop={() => !focus && !serviceMode && fg.current?.zoomToFit(400, 60)}
        nodeRelSize={1}
        linkColor={(l: any) => {
          if (serviceMode) {
            if (l.kind === "service-expert") return "rgba(200, 144, 26, 0.7)";
            if (l.kind === "service-expert-lost") {
              // Shadow edge — desaturated red/gray, semi-transparent
              return "rgba(220, 80, 60, 0.55)";
            }
            if (l.kind === "mvp") return colors.petrolLight + "aa";
            if (l.kind === "ring") return colors.c2 + "bb";
            return "rgba(120, 120, 130, 0.04)";
          }
          const s = typeof l.source === "object" ? l.source.id : l.source;
          const t = typeof l.target === "object" ? l.target.id : l.target;
          if (activeSet)
            return activeSet.has(s) && activeSet.has(t) ? colors.gold : "rgba(120,120,130,0.05)";
          return l.kind === "peer" ? colors.gold : "rgba(150,150,160,0.12)";
        }}
        linkWidth={(l: any) => {
          if (serviceMode) {
            if (l.kind === "service-expert") return 0.8;
            if (l.kind === "service-expert-lost") return 0.7;
            if (l.kind === "mvp") return 1.8;
            if (l.kind === "ring") return 1.5;
            return 0.3;
          }
          return activeSet && activeSet.has(l.source.id) && activeSet.has(l.target.id) ? 1.2 : 0.5;
        }}
        linkLineDash={(l: any) => {
          // Dashed style for shadow edges — visual cue of loss/disconnection
          if (serviceMode && l.kind === "service-expert-lost") return [6, 4];
          return undefined;
        }}
        linkCanvasObject={(l: any, ctx, scale) => {
          // Per user spec: 'написи имен та ребра з'являлися тільки при наведенні'
          // Edge labels only show on hover. Hidden otherwise — reduces visual mess.
          const srcId = typeof l.source === "object" ? l.source.id : l.source;
          const tgtId = typeof l.target === "object" ? l.target.id : l.target;
          const linkKey = `${srcId}->${tgtId}`;
          if (hoveredLink !== linkKey) return;

          if (!l.label) return;
          const source = l.source as GNode;
          const target = l.target as GNode;
          if (source?.x == null || source?.y == null || target?.x == null || target?.y == null) return;
          const mx = (source.x + target.x) / 2;
          const my = (source.y + target.y) / 2;

          ctx.save();
          // Smaller font for hover-only labels
          const fontSize = Math.max(11 / scale, 7);
          ctx.font = `600 ${fontSize}px Space Grotesk, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textWidth = ctx.measureText(l.label).width;
          const px = 8 / scale;
          const py = 4 / scale;
          const w = textWidth + px * 2;
          const h = fontSize + py * 2;
          const x = mx - w / 2;
          const y = my - h / 2;

          // Determine edge kind for color theming
          const isLost = l.kind === "service-expert-lost";

          // High-contrast frosted badge on the outer edge
          ctx.fillStyle = isLost ? "rgba(60, 12, 8, 0.92)" : "rgba(8, 36, 34, 0.94)";
          ctx.beginPath();
          if (typeof (ctx as any).roundRect === "function") {
            (ctx as any).roundRect(x, y, w, h, 4 / scale);
          } else {
            ctx.rect(x, y, w, h);
          }
          ctx.fill();

          ctx.lineWidth = 1 / scale;
          ctx.strokeStyle = isLost ? "rgba(220, 80, 60, 0.75)" : "rgba(200, 144, 26, 0.75)";
          ctx.stroke();

          // Edge label text — different color from people + service labels per user spec.
          // Active edges: gold-light (warm). Lost edges: warm red-tinted (already different).
          ctx.fillStyle = isLost ? "#fbc0b0" : colors.edgeLabel;
          ctx.fillText(l.label, mx, my);
          ctx.restore();
        }}
        linkCanvasObjectMode={() => "after"}
        onLinkHover={(link: any) => {
          // Track hovered link for showing edge label only on hover per user spec
          if (!link) {
            setHoveredLink(null);
            return;
          }
          const srcId = typeof link.source === "object" ? link.source.id : link.source;
          const tgtId = typeof link.target === "object" ? link.target.id : link.target;
          setHoveredLink(`${srcId}->${tgtId}`);
        }}
        onNodeHover={(n: any) => setHover(n?.id ?? null)}
        onNodeClick={(n: any) => {
          if (!n) return;

          if (serviceMode) {
            // Central MVP node: ILLUMINATE ALL people nodes at 30% brightness.
            // Per user spec: 'MVP — це сервіс, який за ідеєю охоплює всіх' — MVP
            // doesn't attach a specific subset; it illuminates the entire graph.
            // MVP can be toggled on/off freely (it's not subject to MVP-LOCK
            // because it doesn't attach experts — only adjusts global brightness).
            if (n.id === "hub:mvp") {
              setIlluminateAll(true);
              const v=experts.filter(e=>e.verified);const n=Date.now();setRevealedAt(p=>{const m=new Map(p);v.forEach((e,i)=>m.set(e.code,n+(i*13)%500));return m;});
              return;
            }

            // Service ring node: toggle active service & connect/disconnect people
            if (typeof n.id === "string" && n.id.startsWith("svc:")) {
              const svcId = n.id;
              const isCurrentlyRevealed = revealedServices.has(svcId);
              if (isCurrentlyRevealed) {
                // Unclick → move to detached (shadow edges with negative labels)
                setRevealedServices((prev) => {
                  const next = new Set(prev);
                  next.delete(svcId);
                  return next;
                });
                setDetachedServices((prev) => {
                  const next = new Set(prev);
                  next.add(svcId);
                  return next;
                });
                if (currentActiveService === svcId) setCurrentActiveService(null);
                onServiceSelect?.(null);
              } else {
                // Click → reveal; clear from detached (gold edges return)
                const now = Date.now();
                const svcExperts = serviceExpertMap.get(svcId) ?? [];
                setRevealedServices((prev) => {
                  const next = new Set(prev);
                  next.add(svcId);
                  return next;
                });
                setDetachedServices((prev) => {
                  const next = new Set(prev);
                  next.delete(svcId);
                  return next;
                });
                setCurrentActiveService(svcId);
                onServiceSelect?.(svcId);
                // Staggered emerge: each expert appears 220ms after the previous one
                setRevealedAt((prev) => {
                  const next = new Map(prev);
                  svcExperts.forEach((exp, idx) => {
                    next.set(exp.code, now + idx * 220);
                  });
                  return next;
                });
              }
              return;
            }

            // Real expert node: open their mini-dossier!
            if (n.expert) {
              onFocus(n.expert.code);
              return;
            }

            return;
          }

          // Normal expert network view
          if (n.expert) {
            onFocus(n.expert.code);
            return;
          }

          if (n.kind === "sector" || n.kind === "theme" || n.kind === "hub") {
            onFocus(n.id === focus ? null : null);
            return;
          }
        }}
        onBackgroundClick={() => {
          if (onBackgroundClick) {
            onBackgroundClick();
          } else {
            onFocus(null);
          }
        }}
        nodePointerAreaPaint={(n: any, color, ctx) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          const r = radius(n);
          ctx.arc(n.x, n.y, r + 5, 0, 2 * Math.PI);
          ctx.fill();
        }}
        nodeCanvasObject={(n: any, ctx, scale) => {
          if (serviceMode) {
            if (n.kind === "expert") {
              const e: Expert | undefined = n.expert;
              // Check if this expert is currently connected (in a revealed service's pool)
              const isCurrentlyConnected = !!n.lastConnectedSvc && revealedServices.has(n.lastConnectedSvc);
              // Detached = was connected, now unclicked from that service but shadow edges remain
              const isDetached = !isCurrentlyConnected && !!n.lastConnectedSvc && detachedServices.has(n.lastConnectedSvc);
              const allEightActive = revealedServices.size >= 9;

              // Flash illumination effect:
              // When illuminateAll (MVP clicked) OR service is selected, the WHOLE people graph
              // does a flash animation: ambient (30%) → 100% → settles at 50% (per user spec).
              // Multiple sequences fire simultaneously across the field.
              // After flash, names + edge labels only show on hover.
              const revealTime = e ? revealedAt.get(e.code) : undefined;
              const now = Date.now();

              // Flash phase: 0 = pre-flash (still ambient), 1 = peak flash, 2 = settled (50%)
              let flashAlpha = 1;
              let isFlashing = false;
              if (revealTime !== undefined) {
                const elapsed = now - revealTime;
                if (elapsed < 0) {
                  flashAlpha = 0; // not yet (staggered delay)
                  isFlashing = false;
                } else if (elapsed < 300) {
                  // Phase 1: ambient → 100% (rapid rise)
                  const t = elapsed / 300;
                  flashAlpha = t;
                  isFlashing = true;
                } else if (elapsed < 900) {
                  // Phase 2: 100% → 50% (settle)
                  const t = (elapsed - 300) / 600;
                  flashAlpha = 1 - 0.5 * t; // 1.0 → 0.5
                  isFlashing = true;
                } else {
                  // Phase 3: settled at 50%
                  flashAlpha = 0.5;
                  isFlashing = false;
                }
              }

              // Staggered emerge for directly-connected experts (service clicks):
              // These use the original emerge logic (ramp 0 → 1 over 600ms)
              let emergeAlpha = 1;
              if (revealTime !== undefined) {
                const elapsed = now - revealTime;
                if (elapsed < 0) {
                  emergeAlpha = 0;
                } else if (elapsed < 600) {
                  const t = elapsed / 600;
                  emergeAlpha = 1 - Math.pow(1 - t, 3);
                }
              }

              // Visibility logic with flash effect:
              //  - isCurrentlyConnected: full opacity with staggered emerge animation
              //  - isDetached: alpha 0 (node invisible, only shadow edge)
              //  - ambient + illuminateAll: flash from 0.18 → 1.0 → 0.5 (MVP effect)
              //  - ambient + service selected: flash from 0.18 → 1.0 → 0.5 (any service click)
              //  - ambient + no selection: dim underlay at 0.18
              let nodeAlpha: number;
              if (isCurrentlyConnected) {
                nodeAlpha = emergeAlpha * (allEightActive ? 0.75 : 1);
              } else if (isDetached) {
                nodeAlpha = 0;
              } else if (illuminateAll || revealedServices.size > 0) {
                // Flash effect: ambient (0.18) → peak (1.0) → settled (0.5)
                // For ambient people when MVP illuminated OR any service selected
                nodeAlpha = revealTime !== undefined ? 0.18 * flashAlpha : 0.5;
              } else {
                nodeAlpha = 0.18;
              }
              ctx.globalAlpha = nodeAlpha;

              if (nodeAlpha < 0.02) {
                ctx.globalAlpha = 1;
                return;
              }

              const r = isCurrentlyConnected ? 6.5 : 3;

              ctx.beginPath();
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
              const useGold = isCurrentlyConnected || (isFlashing && nodeAlpha > 0.2);
              ctx.fillStyle = useGold ? colors.gold : (e?.verified ? colors.success : colors.muted);
              ctx.fill();

              // NO white border on nodes per user spec — прибрати білий кант на вузлах
              // Only subtle brass border for connected nodes
              if (isCurrentlyConnected) {
                ctx.lineWidth = 1.5 / scale;
                ctx.strokeStyle = colors.gold;
                ctx.stroke();
              }

              // Per user spec: 'Підписи на нодах людей у стані сервіс графу не повинні
              // з'являтися тільки самі ноди' + 'написи имен та ребра з'являлися тільки
              // при наведенні'. So people labels in serviceMode ONLY show on hover.
              if (n.id === active && e) {
                const fSize = Math.max(10.5 / scale, 6);
                ctx.font = `500 ${fSize}px Space Grotesk, sans-serif`;
                ctx.fillStyle = colors.fg;
                ctx.textAlign = "center";
                ctx.fillText(e.displayName, n.x, n.y + r + 10 / scale);
              }

              ctx.globalAlpha = 1;
              return;
            }

            // Central MVP node (Square) or Service node (Circle)
            ctx.globalAlpha = 1;
            const isHub = n.kind === "hub";
            const isService = typeof n.id === "string" && n.id.startsWith("svc:");
            const isActive = isHub
              ? revealedServices.has("hub:mvp")
              : isService && revealedServices.has(n.id);
            const r = isHub ? 12 : 8.5;

            const col = isHub
              ? colors.gold
              : isActive
              ? colors.goldLight
              : colors.petrolLight;

            ctx.beginPath();
            if (isHub) {
              // MVP Center is a square box
              ctx.rect(n.x - r, n.y - r, r * 2, r * 2);
            } else {
              // Service nodes are circles
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            }

            ctx.fillStyle = isActive ? "rgba(200, 144, 26, 0.28)" : "rgba(8, 36, 34, 0.95)";
            ctx.fill();

            ctx.lineWidth = (isActive ? 2.8 : 1.8) / Math.max(scale, 0.6);
            ctx.strokeStyle = col;
            ctx.stroke();

            // Outer halo glow for active service
            if (isActive) {
              ctx.lineWidth = 1.2 / scale;
              ctx.strokeStyle = colors.gold + "88";
              ctx.beginPath();
              if (isHub) {
                ctx.rect(n.x - r - 4 / scale, n.y - r - 4 / scale, (r + 4 / scale) * 2, (r + 4 / scale) * 2);
              } else {
                ctx.arc(n.x, n.y, r + 5 / scale, 0, 2 * Math.PI);
              }
              ctx.stroke();
            }

            // Labels for service and MVP nodes — service labels: brass color, larger font
            // Different color from people labels (cream) and edge labels (white-on-dark)
            const labelSize = isHub
              ? Math.max(13 / scale, 8.5)  // MVP: largest
              : Math.max(11.5 / scale, 7.5); // Services: medium

            // Service labels: Oswald-like weight 700, brass color (NOT white)
            ctx.font = `700 ${labelSize}px Space Grotesk, sans-serif`;
            ctx.fillStyle = isActive ? colors.goldLight : colors.brass || colors.gold;
            ctx.textAlign = "center";
            ctx.fillText(
              n.label.length > 36 ? n.label.slice(0, 34) + "…" : n.label,
              n.x,
              n.y - r - 6 / scale,
            );
            return;
          }

          // NORMAL MODE (serviceMode === false)
          const dim = activeSet && !activeSet.has(n.id);
          ctx.globalAlpha = dim ? 0.15 : 1;

          if (n.kind === "expert") {
            const e: Expert | undefined = n.expert;
            const r = radius(n);

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = e?.verified ? colors.success : colors.muted;
            ctx.fill();

            // NO white border on nodes (per user spec — прибрати білий кант на вузлах)
            // Only brass border on focus/hover
            if (n.id === focus || (e && e.code === focus)) {
              ctx.lineWidth = 2.5 / scale;
              ctx.strokeStyle = colors.gold;
              ctx.beginPath();
              ctx.arc(n.x, n.y, r + 4 / scale, 0, 2 * Math.PI);
              ctx.stroke();
            }

            if (n.id === active && e) {
              ctx.font = `600 ${12 / scale}px Space Grotesk, sans-serif`;
              ctx.fillStyle = colors.fg;
              ctx.textAlign = "center";
              ctx.fillText(e.displayName, n.x, n.y + r + 11 / scale);
            }
          } else {
            // Sector / Theme / Hub node in normal mode
            const isHub = n.kind === "hub";
            const r = radius(n);

            ctx.beginPath();
            if (isHub) {
              ctx.rect(n.x - r, n.y - r, r * 2, r * 2);
            } else {
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            }

            ctx.fillStyle = "rgba(8, 36, 34, 0.95)";
            ctx.fill();

            ctx.lineWidth = 1.5 / Math.max(scale, 0.6);
            ctx.strokeStyle = isHub ? colors.gold : colors.petrolLight;
            ctx.stroke();

            const labelSize = Math.max(11 / scale, 4);
            ctx.font = `700 ${labelSize}px Space Grotesk, sans-serif`;
            ctx.fillStyle = colors.fg;
            ctx.textAlign = "center";
            ctx.fillText(
              n.label.length > 36 ? n.label.slice(0, 34) + "…" : n.label,
              n.x,
              n.y - r - 6 / scale,
            );
          }

          ctx.globalAlpha = 1;
        }}
      />
    </div>
  );
}

function radius(n: GNode) {
  if (n.kind === "expert") return n.size || 2.5;
  if (n.kind === "hub") return 11;
  return 7 + Math.sqrt(n.size) * 1.5;
}
