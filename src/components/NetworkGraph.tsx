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
  const fg = useRef<any>(null);
  const wrap = useRef<HTMLDivElement>(null);
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
      primary: "#e2b357",
      fg: "#f8fafc",
      muted: "#94a3b8",
      border: "#334155",
      success: "#10b981",
      c2: "#38bdf8",
      c5: "#c084fc",
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

  // Fixed ring geometry for services
  const fixedServiceNodes = useMemo(() => {
    const R = 210;
    const nodes: GNode[] = [
      {
        id: "hub:mvp",
        kind: "hub",
        label: locale === "uk" ? "MVP Застосунок" : "MVP Application",
        size: 11,
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
        size: 7.5,
        fx: x,
        fy: y,
        x,
        y,
      });
    });

    return nodes;
  }, [locale]);

  const data = useMemo(() => {
    if (serviceMode) {
      const nodes: GNode[] = [...fixedServiceNodes];
      const links: GLink[] = [];

      // Ring connection edges between adjacent services
      const count = NETWORK_SERVICES.length;
      for (let i = 0; i < count; i++) {
        const next = (i + 1) % count;
        links.push({
          source: NETWORK_SERVICES[i].id,
          target: NETWORK_SERVICES[next].id,
          kind: "ring",
        });
      }

      // Spokes connecting central MVP to each of the 8 services
      // Only the currently active service spoke gets the dependency label
      NETWORK_SERVICES.forEach((svc) => {
        const isCurrentActive = currentActiveService === svc.id;
        links.push({
          source: "hub:mvp",
          target: svc.id,
          kind: "mvp",
          label: isCurrentActive ? svc.dependencyLabel[locale === "uk" ? "uk" : "en"] : undefined,
        });
      });

      // Sprout anonymous person nodes for all revealed services
      const pool = experts.filter((e) => e.verified);
      revealedServices.forEach((svcId) => {
        const svcIndex = NETWORK_SERVICES.findIndex((s) => s.id === svcId);
        if (svcIndex < 0) return;
        const svc = NETWORK_SERVICES[svcIndex];
        const count = svc.assumedExpertCount;
        const start = (svcIndex * 3) % Math.max(1, pool.length);
        const assigned = [];
        for (let i = 0; i < count; i++) {
          const expert = pool[(start + i) % pool.length];
          if (expert) assigned.push(expert);
        }

        const angle = (svcIndex / NETWORK_SERVICES.length) * 2 * Math.PI - Math.PI / 2;
        const R = 210;

        assigned.forEach((e, idx) => {
          const personId = `p:${svcId}:${e.code}`;
          const pAngle = angle + ((idx - (count - 1) / 2) * 0.26);
          const pDist = R + 44 + (idx % 2 === 0 ? 0 : 20);
          const px = Math.cos(pAngle) * pDist;
          const py = Math.sin(pAngle) * pDist;

          if (!nodes.some((n) => n.id === personId)) {
            nodes.push({
              id: personId,
              kind: "expert",
              label: "", // Anonymous person node
              expert: e,
              size: 5.5,
              x: px,
              y: py,
              fx: px,
              fy: py,
            });
          }

          links.push({
            source: svcId,
            target: personId,
            kind: "sprout",
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
      nodes.push({ id: e.code, kind: "expert", label: e.displayName, expert: e, size: 2.2 });
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
      fg.current.zoom(2.2, 600);
    }
  }, [focus, data]);

  // Center on graph origin when entering service mode
  useEffect(() => {
    if (serviceMode && fg.current) {
      fg.current.centerAt(0, 0, 700);
      fg.current.zoom(1.15, 700);
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
          if (l.kind === "mvp") return colors.primary + "ee";
          if (l.kind === "ring") return colors.c2 + "99";
          if (l.kind === "sprout") return colors.primary + "aa";
          if (activeSet)
            return activeSet.has(s) && activeSet.has(t) ? colors.primary : "rgba(120,120,130,0.05)";
          return l.kind === "peer" ? colors.primary : "rgba(150,150,160,0.12)";
        }}
        linkWidth={(l: any) => {
          if (l.kind === "mvp") return l.label ? 2.5 : 1.8;
          if (l.kind === "ring") return 1.4;
          if (l.kind === "sprout") return 1.2;
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
          const fontSize = Math.max(10 / scale, 6.5);
          ctx.font = `600 ${fontSize}px 'Space Grotesk', system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textWidth = ctx.measureText(l.label).width;
          const px = 8 / scale;
          const py = 4 / scale;
          const w = textWidth + px * 2;
          const h = fontSize + py * 2;
          const x = mx - w / 2;
          const y = my - h / 2;

          // Draw dark translucent frosted badge
          ctx.fillStyle = "rgba(10, 16, 28, 0.94)";
          ctx.beginPath();
          if (typeof (ctx as any).roundRect === "function") {
            (ctx as any).roundRect(x, y, w, h, 4 / scale);
          } else {
            ctx.rect(x, y, w, h);
          }
          ctx.fill();

          ctx.lineWidth = 1 / scale;
          ctx.strokeStyle = "rgba(226, 179, 87, 0.85)";
          ctx.stroke();

          // High-contrast clean white text
          ctx.fillStyle = "#f8fafc";
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
          const r = n.kind === "expert" && !n.label ? 7.5 : radius(n);
          ctx.arc(n.x, n.y, r + 5, 0, 2 * Math.PI);
          ctx.fill();
        }}
        nodeCanvasObject={(n: any, ctx, scale) => {
          const dim = activeSet && !activeSet.has(n.id);
          ctx.globalAlpha = dim ? 0.15 : 1;

          if (n.kind === "expert") {
            const e: Expert | undefined = n.expert;
            const isAnonymous = !n.label;
            const r = isAnonymous ? 6.5 : radius(n);

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = isAnonymous ? "#38bdf8" : (e?.verified ? colors.success : colors.muted);
            ctx.fill();

            // Crisp border
            ctx.lineWidth = 1.5 / scale;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

            // Inner white dot to look like an expert avatar
            if (isAnonymous) {
              ctx.beginPath();
              ctx.arc(n.x, n.y, 2.2 / scale, 0, 2 * Math.PI);
              ctx.fillStyle = "#ffffff";
              ctx.fill();
            }

            // Selected ring
            if (n.id === focus || (e && e.code === focus)) {
              ctx.lineWidth = 2.5 / scale;
              ctx.strokeStyle = colors.primary;
              ctx.beginPath();
              ctx.arc(n.x, n.y, r + 4 / scale, 0, 2 * Math.PI);
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
            const r = radius(n);

            const col = isHub
              ? colors.primary
              : isActiveService
              ? colors.primary
              : colors.fg;

            ctx.beginPath();
            if (isHub) {
              ctx.rect(n.x - r, n.y - r, r * 2, r * 2);
            } else {
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            }

            ctx.fillStyle = isActiveService ? colors.primary + "33" : "rgba(10, 16, 28, 0.95)";
            ctx.fill();

            ctx.lineWidth = (isActiveService ? 2.5 : 1.5) / Math.max(scale, 0.6);
            ctx.strokeStyle = col;
            ctx.stroke();

            // Outer glow for active service
            if (isActiveService) {
              ctx.lineWidth = 1.4 / scale;
              ctx.strokeStyle = colors.primary + "88";
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
  if (n.kind === "hub") return 11;
  return 7 + Math.sqrt(n.size) * 1.5;
}
