import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";

type Kind = "expert" | "sector" | "theme" | "hub";
interface GNode {
  id: string;
  kind: Kind;
  label: string;
  expert?: Expert;
  size: number;
  x?: number;
  y?: number;
}
interface GLink {
  source: string | GNode;
  target: string | GNode;
  kind: string;
}

export interface GraphLayers {
  sector: boolean;
  theme: boolean;
  hub: boolean;
  researchQueue: boolean;
}

function css(v: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

export default function NetworkGraph({
  experts,
  layers,
  focus,
  onFocus,
  serviceMode = false,
  showExpertsOnServices = false,
}: {
  experts: Expert[];
  layers: GraphLayers;
  focus: string | null;
  onFocus: (code: string | null) => void;
  /** When true, show service functions graph (cycle ring) instead of expert graph */
  serviceMode?: boolean;
  /** When true (dependencies mode), clicking a service node reveals connected expert nodes */
  showExpertsOnServices?: boolean;
}) {
  const { t } = useI18n();
  const wrap = useRef<HTMLDivElement>(null);
  const fg = useRef<any>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hover, setHover] = useState<string | null>(null);
  // Track which service nodes have been clicked to reveal experts (dependencies mode)
  const [revealedServices, setRevealedServices] = useState<Set<string>>(new Set());
  const colors = useMemo(
    () => ({
      primary: css("--primary"),
      fg: css("--foreground"),
      muted: css("--muted-foreground"),
      border: css("--border"),
      success: css("--success"),
      c2: css("--chart-2"),
      c5: css("--chart-5"),
      bg: css("--background"),
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

  useEffect(() => {
    if (!showExpertsOnServices) setRevealedServices(new Set());
  }, [showExpertsOnServices]);


  // Service graph: two orbital rings around central hub
  const serviceData = useMemo(() => {
    const nodes: GNode[] = [];
    const links: GLink[] = [];
    // Central node: MVP application (single hub)
    nodes.push({ id: "hub:mvp", kind: "hub", label: "MVP Application", size: 8 });
    // Engagement cycle services — ordered as the cycle on proposal page
    // These correspond to the pilot-group PROPOSAL_FUNCTIONS + key engagement steps
    const cycleServices = [
      { id: "svc:members",    label: "Active Members",         kind: "sector" as const },
      { id: "svc:agenda",     label: "Expert Agenda",          kind: "sector" as const },
      { id: "svc:discussions",label: "Discussions",            kind: "theme" as const },
      { id: "svc:reports",    label: "Reports + Case Library", kind: "theme" as const },
      { id: "svc:expertise",  label: "Network Expertise / TII",kind: "theme" as const },
      { id: "svc:membership", label: "New Memberships",        kind: "sector" as const },
      { id: "svc:warroom",    label: "War Room",               kind: "sector" as const },
      { id: "svc:conference", label: "Conference + Almanac",   kind: "sector" as const },
    ];
    // Place cycle nodes with initial positions in a circle
    const R = 180; // radius of the service ring
    cycleServices.forEach((svc, i) => {
      const angle = (i / cycleServices.length) * 2 * Math.PI - Math.PI / 2;
      nodes.push({
        id: svc.id,
        kind: svc.kind,
        label: svc.label,
        size: 3,
        x: Math.cos(angle) * R,
        y: Math.sin(angle) * R,
      });
      // Each cycle node connects to the central MVP hub
      links.push({ source: "hub:mvp", target: svc.id, kind: "mvp" });
    });
    // Connect cycle nodes to each other (ring = cycle)
    for (let i = 0; i < cycleServices.length; i++) {
      links.push({
        source: cycleServices[i]!.id,
        target: cycleServices[(i + 1) % cycleServices.length]!.id,
        kind: "pilot-ring",
      });
    }
    return { nodes, links };
  }, []);

  const data = useMemo(() => {
    if (serviceMode) {
      if (!showExpertsOnServices || revealedServices.size === 0) return serviceData;
      // Merge: service ring + expert nodes attached to revealed service nodes
      const nodes = [...serviceData.nodes];
      const links = [...serviceData.links];
      // Map each service to relevant expert sectors
      const svcSectors: Record<string, string[]> = {
        "svc:members":    ["Business / advisory", "Humanitarian / NGO"],
        "svc:agenda":     ["Academia / research", "Security / risk / resilience"],
        "svc:discussions":["Academia / research", "Humanitarian / NGO"],
        "svc:reports":    ["Academia / research", "Business / advisory"],
        "svc:expertise":  ["Security / risk / resilience", "Business / advisory"],
        "svc:membership": ["Humanitarian / NGO", "Business / advisory"],
        "svc:warroom":    ["Security / risk / resilience"],
        "svc:conference": ["Academia / research", "Business / advisory", "Humanitarian / NGO"],
      };
      revealedServices.forEach((svcId) => {
        const sectors = svcSectors[svcId] ?? [];
        experts
          .filter((e) => e.verified && sectors.some((s) => e.sector?.includes(s)))
          .slice(0, 6)
          .forEach((e) => {
            if (!nodes.find((n) => n.id === e.code)) {
              nodes.push({ id: e.code, kind: "expert" as const, label: e.displayName, expert: e, size: 1 });
            }
            if (!links.find((l) =>
              (l.source === e.code || (l.source as any).id === e.code) &&
              (l.target === svcId  || (l.target as any).id === svcId)
            )) {
              links.push({ source: e.code, target: svcId, kind: "dependency" });
            }
          });
      });
      return { nodes, links };
    }
    const nodes: GNode[] = [];
    const links: GLink[] = [];
    const ensure = (id: string, kind: Kind, label: string) => {
      let n = nodes.find((x) => x.id === id);
      if (!n) nodes.push((n = { id, kind, label, size: 0 }));
      n.size++;
    };
    for (const e of experts) {
      if (!e.verified && !layers.researchQueue) continue;
      nodes.push({ id: e.code, kind: "expert", label: e.displayName, expert: e, size: 1 });
      if (layers.sector && e.sector !== "Unclassified") {
        ensure("S:" + e.sector, "sector", e.sector);
        links.push({ source: e.code, target: "S:" + e.sector, kind: "sector" });
      }
      if (
        layers.theme &&
        !["Ukraine-related experience", "Не оцінено"].includes(e.ukraineCategory)
      ) {
        ensure("T:" + e.ukraineCategory, "theme", e.ukraineCategory);
        links.push({ source: e.code, target: "T:" + e.ukraineCategory, kind: "theme" });
      }
      if (layers.hub && e.communityRole !== "Member / participant") {
        ensure("H:" + e.communityRole, "hub", e.communityRole);
        links.push({ source: e.code, target: "H:" + e.communityRole, kind: "hub" });
      }
      if (!e.verified && layers.researchQueue) {
        ensure("P:queue", "hub", t("researchQueue"));
        links.push({ source: e.code, target: "P:queue", kind: "pool" });
      }
    }
    // Expert-to-expert: shared organisation (revealed mode) or shared case theme
    const byOrg = new Map<string, string[]>();
    experts.forEach((e) => {
      if (e.organization) byOrg.set(e.organization, [...(byOrg.get(e.organization) || []), e.code]);
    });
    byOrg.forEach((codes) => {
      for (let i = 1; i < codes.length; i++)
        links.push({ source: codes[0]!, target: codes[i]!, kind: "peer" });
    });
    return { nodes, links };
  }, [experts, layers, t, serviceMode, serviceData]);  // serviceData included for serviceMode switch

  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>();
    data.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
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

  useEffect(() => {
    if (!focus || !fg.current) return;
    const n = data.nodes.find((x) => x.id === focus);
    if (n?.x != null) {
      fg.current.centerAt(n.x, n.y, 600);
      fg.current.zoom(3, 600);
    }
  }, [focus, data]);

  useEffect(() => {
    const f = fg.current;
    if (!f) return;
    if (serviceMode) {
      f.d3Force("charge")?.strength(-120);
      f.d3Force("link")?.distance((l: GLink) =>
        l.kind === "mvp" ? 180 : l.kind === "pilot-ring" ? 90 : 60,
      );
      // Reduce simulation iterations for cleaner circle layout
      f.d3Force("center")?.strength(0.05);
    } else {
      f.d3Force("charge")?.strength(-34);
      f.d3Force("link")?.distance((l: GLink) =>
        l.kind === "peer" ? 12 : l.kind === "pool" ? 54 : 42,
      );
    }
  }, [data, serviceMode]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <ForceGraph2D
        ref={fg}
        width={size.w}
        height={size.h}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={180}
        onEngineStop={() => !focus && fg.current?.zoomToFit(400, 60)}
        nodeRelSize={1}
        linkColor={(l: any) => {
          const s = l.source.id,
            t = l.target.id;
          if (l.kind === "mvp" || l.kind === "mvp-ring") return colors.primary + "cc";
          if (l.kind === "pilot" || l.kind === "pilot-ring") return colors.c2 + "cc";
          if (l.kind === "dependency") return colors.success + "99";

          if (activeSet)
            return activeSet.has(s) && activeSet.has(t) ? colors.primary : "rgba(120,120,130,0.05)";
          return l.kind === "peer" ? colors.primary : "rgba(150,150,160,0.12)";
        }}
        linkWidth={(l: any) =>
          activeSet && activeSet.has(l.source.id) && activeSet.has(l.target.id) ? 1.2 : 0.5
        }
        onNodeHover={(n: any) => setHover(n?.id ?? null)}
        onNodeClick={(n: any) => {
          if (showExpertsOnServices && typeof n.id === "string" && n.id.startsWith("svc:")) {
            setRevealedServices((prev) => {
              const next = new Set(prev);
              if (next.has(n.id)) next.delete(n.id);
              else next.add(n.id);
              return next;
            });
            return;
          }
          onFocus(n.id === focus ? null : n.id);
        }}
        onBackgroundClick={() => onFocus(null)}
        nodePointerAreaPaint={(n: any, color, ctx) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius(n) + 2, 0, 2 * Math.PI);
          ctx.fill();
        }}
        nodeCanvasObject={(n: any, ctx, scale) => {
          const dim = activeSet && !activeSet.has(n.id);
          ctx.globalAlpha = dim ? 0.12 : 1;
          const r = radius(n);
          if (n.kind === "expert") {
            const e: Expert = n.expert;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = e.verified ? colors.success : colors.muted;
            ctx.fill();
            if (n.id === focus) {
              ctx.lineWidth = 1.5 / scale;
              ctx.strokeStyle = colors.primary;
              ctx.beginPath();
              ctx.arc(n.x, n.y, r + 3 / scale + 1, 0, 2 * Math.PI);
              ctx.stroke();
            }
            if (n.id === active) {
              ctx.font = `500 ${12 / scale}px Space Grotesk`;
              ctx.fillStyle = colors.fg;
              ctx.textAlign = "center";
              ctx.fillText(e.displayName, n.x, n.y + r + 11 / scale);
            }
          } else {
            const col =
              n.kind === "sector" ? colors.primary : n.kind === "theme" ? colors.c2 : colors.c5;
            ctx.beginPath();
            if (n.kind === "hub") ctx.rect(n.x - r, n.y - r, r * 2, r * 2);
            else ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = colors.bg;
            ctx.fill();
            ctx.lineWidth = 1.2 / Math.max(scale, 0.6);
            ctx.strokeStyle = col;
            ctx.stroke();
            if (n.size < 4 && scale < 1.6 && n.id !== active) {
              ctx.globalAlpha = 1;
              return;
            }
            ctx.font = `600 ${Math.max(13 / scale, 3.5)}px Space Grotesk`;
            ctx.fillStyle = col;
            ctx.textAlign = "center";
            ctx.fillText(
              n.label.length > 38 ? n.label.slice(0, 36) + "…" : n.label,
              n.x,
              n.y - r - 4 / scale,
            );
          }
          ctx.globalAlpha = 1;
        }}
      />
    </div>
  );
}

function radius(n: GNode) {
  if (n.kind === "expert") return 4;
  return 4 + Math.sqrt(n.size) * 1.6;
}
