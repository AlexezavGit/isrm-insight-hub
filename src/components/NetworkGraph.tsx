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
  leftPanelOpen?: boolean;
  rightPanelOpen?: boolean;
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

  // Color tokens aligned with FEEL Again / Bunker palette (Teal/Petrol, Gold, Orange, Cream)
  const colors = useMemo(
    () => ({
      petrol: "#0b2422",
      petrolLight: "#3e91a2",
      gold: "#c8901a",
      goldLight: "#fce9b0",
      orange: "#f08a2e",
      fg: "#f8fafc",
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

    // Core advisory founders for central MVP
    map.set("hub:mvp", verified.slice(0, 4));

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
    const activeServicesList = Array.from(revealedServices);

    for (const e of experts) {
      if (!e.verified && !layers.researchQueue) continue;

      // Find if connected to any revealed service
      const connectedSvc = activeServicesList.find((svcId) =>
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
        lastConnectedSvc: connectedSvc,
      });
    }

    // 4. Edges from active services out to their people
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

    return { nodes, links };
  }, [
    experts,
    layers,
    locale,
    serviceMode,
    fixedServiceNodes,
    revealedServices,
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
            if (l.kind === "service-expert") return colors.gold;
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
            if (l.kind === "service-expert") return 2.2;
            if (l.kind === "mvp") return 1.8;
            if (l.kind === "ring") return 1.5;
            return 0.3;
          }
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
          const fontSize = Math.max(9.5 / scale, 6);
          ctx.font = `600 ${fontSize}px Space Grotesk, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textWidth = ctx.measureText(l.label).width;
          const px = 7 / scale;
          const py = 3.5 / scale;
          const w = textWidth + px * 2;
          const h = fontSize + py * 2;
          const x = mx - w / 2;
          const y = my - h / 2;

          // High-contrast frosted badge on the outer edge
          ctx.fillStyle = "rgba(8, 36, 34, 0.94)";
          ctx.beginPath();
          if (typeof (ctx as any).roundRect === "function") {
            (ctx as any).roundRect(x, y, w, h, 4 / scale);
          } else {
            ctx.rect(x, y, w, h);
          }
          ctx.fill();

          ctx.lineWidth = 1 / scale;
          ctx.strokeStyle = "rgba(200, 144, 26, 0.75)";
          ctx.stroke();

          // High-contrast clean white text
          ctx.fillStyle = "#ffffff";
          ctx.fillText(l.label, mx, my);
          ctx.restore();
        }}
        linkCanvasObjectMode={() => "after"}
        onNodeHover={(n: any) => setHover(n?.id ?? null)}
        onNodeClick={(n: any) => {
          if (!n) return;

          if (serviceMode) {
            // Central MVP node: toggle MVP foundation experts
            if (n.id === "hub:mvp") {
              setRevealedServices((prev) => {
                const next = new Set(prev);
                if (next.has("hub:mvp")) {
                  next.delete("hub:mvp");
                } else {
                  next.add("hub:mvp");
                }
                return next;
              });
              return;
            }

            // Service ring node: toggle active service & connect/disconnect people
            if (typeof n.id === "string" && n.id.startsWith("svc:")) {
              const svcId = n.id;
              setRevealedServices((prev) => {
                const next = new Set(prev);
                if (next.has(svcId)) {
                  next.delete(svcId);
                  if (currentActiveService === svcId) setCurrentActiveService(null);
                  onServiceSelect?.(null);
                } else {
                  next.add(svcId);
                  setCurrentActiveService(svcId);
                  onServiceSelect?.(svcId);
                }
                return next;
              });
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
              const isConnected = !!n.lastConnectedSvc && revealedServices.has(n.lastConnectedSvc);
              const allEightActive = revealedServices.size >= 8;

              // When all 8 are active, edge lines form full mesh while node dots gracefully dim
              ctx.globalAlpha = isConnected ? (allEightActive ? 0.75 : 1) : 0.12;

              const e: Expert | undefined = n.expert;
              const r = isConnected ? 6.5 : 3;

              ctx.beginPath();
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = isConnected ? colors.gold : (e?.verified ? colors.success : colors.muted);
              ctx.fill();

              // Crisp border
              ctx.lineWidth = (isConnected ? 2 : 1) / scale;
              ctx.strokeStyle = isConnected ? "#ffffff" : "rgba(255,255,255,0.3)";
              ctx.stroke();

              // If connected or active/hover: show expert name label on the OUTSIDE
              if ((isConnected || n.id === active) && e) {
                const fSize = Math.max(10.5 / scale, 6);
                ctx.font = `600 ${fSize}px Space Grotesk, sans-serif`;
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

            // Labels for service and MVP nodes
            const labelSize = isHub
              ? Math.max(12 / scale, 7.5)
              : Math.max(10.5 / scale, 6.5);

            ctx.font = `700 ${labelSize}px Space Grotesk, sans-serif`;
            ctx.fillStyle = isActive ? colors.goldLight : colors.fg;
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

            ctx.lineWidth = 1.5 / scale;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

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
