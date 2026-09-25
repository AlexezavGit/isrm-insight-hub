import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { Expert } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

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
}

function css(v: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

export default function NetworkGraph({
  experts,
  layers,
  focus,
  onFocus,
}: {
  experts: Expert[];
  layers: GraphLayers;
  focus: string | null;
  onFocus: (code: string | null) => void;
}) {
  const { t } = useI18n();
  const wrap = useRef<HTMLDivElement>(null);
  const fg = useRef<any>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hover, setHover] = useState<string | null>(null);
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
    const el = wrap.current!;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = useMemo(() => {
    const nodes: GNode[] = [];
    const links: GLink[] = [];
    const ensure = (id: string, kind: Kind, label: string) => {
      let n = nodes.find((x) => x.id === id);
      if (!n) nodes.push((n = { id, kind, label, size: 0 }));
      n.size++;
    };
    for (const e of experts) {
      nodes.push({ id: e.code, kind: "expert", label: e.displayName, expert: e, size: 1 });
      if (layers.sector && e.sector !== "Unclassified") {
        ensure("S:" + e.sector, "sector", e.sector);
        links.push({ source: e.code, target: "S:" + e.sector, kind: "sector" });
      }
      if (layers.theme && !["Ukraine-related experience", "Не оцінено"].includes(e.ukraineCategory)) {
        ensure("T:" + e.ukraineCategory, "theme", e.ukraineCategory);
        links.push({ source: e.code, target: "T:" + e.ukraineCategory, kind: "theme" });
      }
      if (layers.hub && e.communityRole !== "Member / participant") {
        ensure("H:" + e.communityRole, "hub", e.communityRole);
        links.push({ source: e.code, target: "H:" + e.communityRole, kind: "hub" });
      }
    }
    // Unlinked experts gravitate to a research-queue pool
    const linked = new Set(links.map((l) => l.source as string));
    for (const e of experts) {
      if (!linked.has(e.code)) {
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
      for (let i = 1; i < codes.length; i++) links.push({ source: codes[0]!, target: codes[i]!, kind: "peer" });
    });
    return { nodes, links };
  }, [experts, layers, t]);

  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>();
    data.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      if (!m.has(s)) m.set(s, new Set());
      if (!m.has(t)) m.set(t, new Set());
      m.get(s)!.add(t);
      m.get(t)!.add(s);
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
    f.d3Force("charge")?.strength(-45);
    f.d3Force("link")?.distance((l: GLink) => (l.kind === "peer" ? 15 : l.kind === "pool" ? 70 : 55));
  }, [data]);

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
          if (activeSet) return activeSet.has(s) && activeSet.has(t) ? colors.primary : "rgba(120,120,130,0.05)";
          return l.kind === "peer" ? colors.primary : "rgba(150,150,160,0.12)";
        }}
        linkWidth={(l: any) => (activeSet && activeSet.has(l.source.id) && activeSet.has(l.target.id) ? 1.2 : 0.5)}
        onNodeHover={(n: any) => setHover(n?.id ?? null)}
        onNodeClick={(n: any) => onFocus(n.id === focus ? null : n.id)}
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
            if (scale > 2.2 || n.id === active) {
              ctx.font = `${10 / scale}px IBM Plex Mono`;
              ctx.fillStyle = colors.fg;
              ctx.textAlign = "center";
              ctx.fillText(e.code, n.x, n.y + r + 9 / scale);
            }
          } else {
            const col = n.kind === "sector" ? colors.primary : n.kind === "theme" ? colors.c2 : colors.c5;
            ctx.beginPath();
            if (n.kind === "hub") ctx.rect(n.x - r, n.y - r, r * 2, r * 2);
            else ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = colors.bg;
            ctx.fill();
            ctx.lineWidth = 1.2 / Math.max(scale, 0.6);
            ctx.strokeStyle = col;
            ctx.stroke();
            if (n.size < 4 && scale < 1.6 && n.id !== active) { ctx.globalAlpha = 1; return; }
            ctx.font = `500 ${Math.max(11 / scale, 3)}px IBM Plex Sans`;
            ctx.fillStyle = col;
            ctx.textAlign = "center";
            ctx.fillText(n.label.length > 38 ? n.label.slice(0, 36) + "…" : n.label, n.x, n.y - r - 4 / scale);
          }
          ctx.globalAlpha = 1;
        }}
      />
    </div>
  );
}

function radius(n: GNode) {
  if (n.kind === "expert") return 2 + (n.expert!.trust / 100) * 3.5;
  return 4 + Math.sqrt(n.size) * 1.6;
}
