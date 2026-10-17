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

function css(v: string) {
  return typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue(v).trim()
    : "";
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
  locale?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const fg = useRef<any>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hover, setHover] = useState<string | null>(null);

  // Set of service node IDs that have sprouted their person nodes
  const [revealedServices, setRevealedServices] = useState<Set<string>>(() => new Set());
  const [currentActiveService, setCurrentActiveService] = useState<string | null>(null);

  // Sync external activeServiceId with internal state
  useEffect(() => {
    if (activeServiceId) {
      setCurrentActiveService(activeServiceId);
      setRevealedServices((prev) => new Set([...prev, activeServiceId]));
    }
  }, [activeServiceId]);

  // Check if all 8 services have been revealed
  const allServicesRevealedReported = useRef(false);
  useEffect(() => {
    if (serviceMode && revealedServices.size >= NETWORK_SERVICES.length && !allServicesRevealedReported.current) {
      allServicesRevealedReported.current = true;
      onAllServicesRevealed?.();
    }
  }, [revealedServices.size, serviceMode, onAllServicesRevealed]);

  const colors = useMemo(
    () => ({
      primary: css("--primary") || "#e2b357",
      fg: css("--foreground") || "#f8fafc",
      muted: css("--muted-foreground") || "#94a3b8",
      border: css("--border") || "#334155",
      success: css("--success") || "#10b981",
      c2: css("--chart-2") || "#38bdf8",
      c5: css("--chart-5") || "#c084fc",
      bg: css("--background") || "#090d16",
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

  // Fixed ring geometry for services
  const fixedServiceNodes = useMemo(() => {
    const R = 210;
    const nodes: GNode[] = [
      {
        id: "hub:mvp",
        kind: "hub",
        label: locale === "uk" ? "MVP Застосунок" : "MVP Application",
        size: 9,
        fx: 0,
        fy: 0,
        x: 0,
        y: 0,
      },
    ];

    NETWORK_SERVICES.forEach((svc, i) => {
      const angle = (i / NETWORK_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
      const x = Math.round(Math.cos(angle) * R);
      const y = Math.round(Math.sin(angle) * R);
      nodes.push({
        id: svc.id,
        kind: "sector",
        label: svc.title[locale === "uk" ? "uk" : "en"],
        service: svc,
        size: 5,
        x,
        y,
        fx: x,
        fy: y,
      });
    });

    const links: GLink[] = [];
    // Radial links from center to services
    NETWORK_SERVICES.forEach((svc) => {
      links.push({
        source: "hub:mvp",
        target: svc.id,
        kind: "mvp",
      });
    });

    // Ring connecting the outer circle
    for (let i = 0; i < NETWORK_SERVICES.length; i++) {
      links.push({
        source: NETWORK_SERVICES[i]!.id,
        target: NETWORK_SERVICES[(i + 1) % NETWORK_SERVICES.length]!.id,
        kind: "ring",
      });
    }

    return { nodes, links };
  }, [locale]);

  // Generate the current graph data
  const data = useMemo(() => {
    if (serviceMode) {
      const nodes = [...fixedServiceNodes.nodes];
      const links = [...fixedServiceNodes.links];

      // Distribute verified experts across services deterministically
      const verifiedExperts = experts.filter((e) => e.verified);
      const pool = verifiedExperts.length > 0 ? verifiedExperts : experts;

      revealedServices.forEach((svcId) => {
        const svc = NETWORK_SERVICES.find((s) => s.id === svcId);
        if (!svc) return;

        const svcIndex = NETWORK_SERVICES.findIndex((s) => s.id === svcId);
        const count = svc.assumedExpertCount;
        // Select an offset of experts from the pool
        const start = (svcIndex * 3) % Math.max(1, pool.length);
        const assigned = [];
        for (let i = 0; i < count; i++) {
          const expert = pool[(start + i) % pool.length];
          if (expert) assigned.push(expert);
        }

        const angle = (svcIndex / NETWORK_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
        const R = 210;
        const cx = Math.cos(angle) * R;
        const cy = Math.sin(angle) * R;

        assigned.forEach((e, idx) => {
          const personId = `p:${svcId}:${e.code}`;
          // Position person nodes slightly around the service node
          const pAngle = angle + ((idx - (count - 1) / 2) * 0.28);
          const pDist = R + 48 + (idx % 2 === 0 ? 0 : 22);
          const px = Math.cos(pAngle) * pDist;
          const py = Math.sin(pAngle) * pDist;

          if (!nodes.some((n) => n.id === personId)) {
            nodes.push({
              id: personId,
              kind: "expert",
              label: "", // Anonymous: no names displayed on person nodes per spec
              expert: e,
              size: 2.2,
              x: px,
              y: py,
              fx: px,
              fy: py,
            });
          }

          const isCurrentActive = currentActiveService === svcId;
          links.push({
            source: svcId,
            target: personId,
            kind: "dependency",
            label: isCurrentActive ? svc.dependencyLabel[locale === "uk" ? "uk" : "en"] : undefined,
          });
        });
      });

      return { nodes, links };
    }

    // Normal expert network view
    const nodes: GNode[] = [];
    const links: GLink[] = [];

    const ensure = (id: string, kind: Kind, label: string) => {
      let n = nodes.find((x) => x.id === id);
      if (!n) nodes.push((n = { id, kind, label, size: 0 }));
      n.size++;
    };

    for (const e of experts) {
      if (!e.verified && !layers.researchQueue) continue;
      nodes.push({ id: e.code, kind: "expert", label: e.displayName, expert: e, size: 1.5 });
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
  }, [
    experts,
    layers,
    locale,
    serviceMode,
    fixedServiceNodes,
    revealedServices,
    currentActiveService,
  ]);

  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>();
    data.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : (l.source as GNode).id;
      const t = typeof l.target === "string" ? l.target : (l.target as GNode).id;
      if (!m.has(s)) m.set(s, new Set());
      if (!m.has(t)) m.set(t, new Set());
      m.get(s)?.add(t);
      m.get(t)?.add(s);
    });
    return m;
  }, [data]);

  const active = focus || hover;
  const activeSet = useMemo(() => {
    if (!active) return null;
    const s = new Set([active, ...(neighbors.get(active) || [])]);
    return s;
  }, [active, neighbors]);

  // Center on focus when focus changes
  useEffect(() => {
    if (!focus || !fg.current) return;
    const n = data.nodes.find((x) => x.id === focus || (x.expert && x.expert.code === focus));
    if (n?.x != null && n?.y != null) {
      fg.current.centerAt(n.x, n.y, 600);
      fg.current.zoom(2.5, 600);
    }
  }, [focus, data]);

  // Center on graph origin when entering service mode
  useEffect(() => {
    if (serviceMode && fg.current) {
      fg.current.centerAt(0, 0, 700);
      fg.current.zoom(1.1, 700);
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
        cooldownTicks={serviceMode ? 20 : 160}
        onEngineStop={() => !focus && !serviceMode && fg.current?.zoomToFit(400, 60)}
        nodeRelSize={1}
        linkColor={(l: any) => {
          const s = l.source.id;
          const t = l.target.id;
          if (l.kind === "mvp") return colors.primary + "dd";
          if (l.kind === "ring") return colors.c2 + "99";
          if (l.kind === "dependency") {
            const isLabeled = l.label != null;
            return isLabeled ? colors.primary : colors.muted + "44";
          }
          if (activeSet)
            return activeSet.has(s) && activeSet.has(t) ? colors.primary : "rgba(120,120,130,0.05)";
          return l.kind === "peer" ? colors.primary : "rgba(150,150,160,0.12)";
        }}
        linkWidth={(l: any) => {
          if (l.kind === "mvp") return 1.8;
          if (l.kind === "ring") return 1.4;
          if (l.kind === "dependency") return l.label ? 1.6 : 0.8;
          return activeSet && activeSet.has(l.source.id) && activeSet.has(l.target.id) ? 1.2 : 0.5;
        }}
        linkCanvasObject={(l: any, ctx, scale) => {
          if (!l.label) return;
          const source = l.source as GNode;
          const target = l.target as GNode;
          if (source?.x == null || source?.y == null || target?.x == null || target?.y == null) return;
          const mx = (source.x + target.x) / 2;
          const my = (source.y + target.y) / 2;

          ctx.save();
          const fontSize = Math.max(9 / scale, 4);
          ctx.font = `600 ${fontSize}px Space Grotesk, sans-serif`;
          ctx.fillStyle = colors.primary;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Subtle pill background behind edge label for readability
          const textWidth = ctx.measureText(l.label).width;
          ctx.fillStyle = colors.bg + "ee";
          ctx.fillRect(mx - textWidth / 2 - 4 / scale, my - fontSize / 2 - 2 / scale, textWidth + 8 / scale, fontSize + 4 / scale);

          ctx.fillStyle = colors.primary;
          ctx.fillText(l.label, mx, my);
          ctx.restore();
        }}
        linkCanvasObjectMode={() => "after"}
        onNodeHover={(n: any) => setHover(n?.id ?? null)}
        onNodeClick={(n: any) => {
          if (!n) return;

          // In serviceMode: clicking a service node toggles its people and labels
          if (serviceMode && typeof n.id === "string" && n.id.startsWith("svc:")) {
            const svcId = n.id;
            if (currentActiveService === svcId) {
              // Re-clicking active service: collapse its person nodes & edge labels
              setCurrentActiveService(null);
              setRevealedServices((prev) => {
                const next = new Set(prev);
                next.delete(svcId);
                return next;
              });
              onServiceSelect?.(null);
            } else {
              // Clicking new service: make it active, sprout its person nodes & label edges
              setCurrentActiveService(svcId);
              setRevealedServices((prev) => new Set([...prev, svcId]));
              onServiceSelect?.(svcId);
            }
            return;
          }

          // Clicking a person node (either anonymous person in service graph or expert in main graph)
          if (n.expert) {
            onFocus(n.expert.code);
            return;
          }

          onFocus(n.id === focus ? null : n.id);
        }}
        onBackgroundClick={() => {
          onFocus(null);
        }}
        nodePointerAreaPaint={(n: any, color, ctx) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius(n) + 4, 0, 2 * Math.PI);
          ctx.fill();
        }}
        nodeCanvasObject={(n: any, ctx, scale) => {
          const dim = activeSet && !activeSet.has(n.id);
          ctx.globalAlpha = dim ? 0.15 : 1;
          const r = radius(n);

          if (n.kind === "expert") {
            const e: Expert | undefined = n.expert;
            const isAnonymous = !n.label;

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = e?.verified ? colors.success : colors.muted;
            ctx.fill();

            // Selected ring
            if (n.id === focus || (e && e.code === focus)) {
              ctx.lineWidth = 2 / scale;
              ctx.strokeStyle = colors.primary;
              ctx.beginPath();
              ctx.arc(n.x, n.y, r + 3 / scale + 1, 0, 2 * Math.PI);
              ctx.stroke();
            }

            // In normal mode: show name on active/hover
            if (!isAnonymous && n.id === active && e) {
              ctx.font = `600 ${12 / scale}px Space Grotesk, sans-serif`;
              ctx.fillStyle = colors.fg;
              ctx.textAlign = "center";
              ctx.fillText(e.displayName, n.x, n.y + r + 11 / scale);
            }
          } else {
            // Service / Hub / Sector / Theme node
            const isHub = n.kind === "hub";
            const isService = typeof n.id === "string" && n.id.startsWith("svc:");
            const isActiveService = isService && currentActiveService === n.id;
            const isRevealed = isService && revealedServices.has(n.id);

            const col = isHub
              ? colors.primary
              : isActiveService
              ? colors.primary
              : isRevealed
              ? colors.c2
              : colors.fg;

            ctx.beginPath();
            if (isHub) {
              // Diamond or rounded box for central MVP
              const s = r * 1.8;
              ctx.rect(n.x - s / 2, n.y - s / 2, s, s);
            } else {
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            }

            ctx.fillStyle = isActiveService ? colors.primary + "33" : colors.bg;
            ctx.fill();

            ctx.lineWidth = (isActiveService ? 2.5 : 1.5) / Math.max(scale, 0.6);
            ctx.strokeStyle = col;
            ctx.stroke();

            // Outer glow for active service
            if (isActiveService) {
              ctx.lineWidth = 1.2 / scale;
              ctx.strokeStyle = colors.primary + "66";
              ctx.beginPath();
              ctx.arc(n.x, n.y, r + 6 / scale, 0, 2 * Math.PI);
              ctx.stroke();
            }

            // Labels for service and hub nodes
            const labelSize = isHub
              ? Math.max(12 / scale, 8)
              : isService
              ? Math.max(10.5 / scale, 6.5)
              : Math.max(11 / scale, 4);

            ctx.font = `700 ${labelSize}px Space Grotesk, sans-serif`;
            ctx.fillStyle = col;
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
  if (n.kind === "hub") return 10;
  return 6 + Math.sqrt(n.size) * 1.5;
}
