import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

export interface PartnerGraphNode {
  id: string;
  label: string;
  kind: "candidate" | "hub" | "consultation" | "mvp" | "pilot" | "later";
  selected?: boolean;
  group?: string;
}

export interface PartnerGraphLink {
  source: string;
  target: string;
  cycle?: boolean;
}

interface PartnerGraphProps {
  nodes: PartnerGraphNode[];
  links: PartnerGraphLink[];
  selectedId?: string;
  onSelect: (node: PartnerGraphNode) => void;
  onHover?: (node: PartnerGraphNode | null) => void;
  height: number;
  radialLayout?: boolean;
}

export default function PartnerGraph({
  nodes,
  links,
  selectedId,
  onSelect,
  onHover,
  height,
  radialLayout = false,
}: PartnerGraphProps) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(260, Math.floor(entry.contentRect.width)));
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const graphData = useMemo(() => {
    if (!radialLayout) return { nodes, links };
    const scale = Math.min(width, height) * 0.42;
    const radii: Record<PartnerGraphNode["kind"], number> = {
      consultation: scale * 0.22,
      mvp: scale * 0.45,
      pilot: scale * 0.68,
      later: scale * 0.9,
      candidate: scale * 1.08,
      hub: 0,
    };
    const counts = new Map<PartnerGraphNode["kind"], number>();
    const totals = new Map<PartnerGraphNode["kind"], number>();
    for (const node of nodes) totals.set(node.kind, (totals.get(node.kind) ?? 0) + 1);
    return {
      nodes: nodes.map((node) => {
        const index = counts.get(node.kind) ?? 0;
        counts.set(node.kind, index + 1);
        const count = totals.get(node.kind) ?? 1;
        const angle = (2 * Math.PI * index) / Math.max(count, 1) - Math.PI / 2;
        const radius = radii[node.kind];
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return { ...node, x, y, fx: x, fy: y };
      }),
      links,
    };
  }, [height, links, nodes, radialLayout, width]);
  const colors = {
    candidate: "#2A6E78",
    hub: "#1C4F52",
    consultation: "#C8901A",
    mvp: "#3E91A2",
    pilot: "#6A9C63",
    later: "#E8741E",
  };

  return (
    <div
      className="partner-graph"
      ref={container}
      role="group"
      aria-label="Interactive relationship graph"
    >
      <ForceGraph2D
        graphData={graphData}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        nodeRelSize={5}
        nodeVal={(node) =>
          (node as PartnerGraphNode).kind === "consultation" ||
          (node as PartnerGraphNode).kind === "hub"
            ? 3
            : 1
        }
        nodeLabel={(node) => (node as PartnerGraphNode).label}
        nodeCanvasObject={(node, ctx, scale) => {
          const item = node as PartnerGraphNode & { x: number; y: number; val?: number };
          const radius = Math.max(3, Math.sqrt(item.val ?? 1) * 3.5);
          const isActive = item.id === selectedId || item.id === hoveredId;
          ctx.beginPath();
          ctx.arc(item.x, item.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = item.selected || item.id === selectedId ? "#E8741E" : colors[item.kind];
          ctx.fill();
          if (item.kind === "hub" || isActive) {
            const label = item.label.length > 42 ? `${item.label.slice(0, 39)}…` : item.label;
            const fontSize = 12 / Math.max(scale, 0.6);
            ctx.font = `600 ${fontSize}px Space Grotesk`;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            const labelWidth = ctx.measureText(label).width;
            const padding = 4 / Math.max(scale, 0.6);
            const labelY = item.y - radius - 5 / Math.max(scale, 0.6);
            ctx.fillStyle = "rgba(7, 35, 34, 0.92)";
            ctx.fillRect(
              item.x - labelWidth / 2 - padding,
              labelY - fontSize - padding / 2,
              labelWidth + padding * 2,
              fontSize + padding,
            );
            ctx.fillStyle = item.kind === "hub" ? "#E2ECE9" : "#E8741E";
            ctx.fillText(label, item.x, labelY);
          }
        }}
        nodeColor={(node) => {
          const item = node as PartnerGraphNode;
          return item.selected || item.id === selectedId ? "#E8741E" : colors[item.kind];
        }}
        onRenderFramePre={
          radialLayout
            ? (ctx) => {
                const scale = Math.min(width, height) * 0.42;
                ctx.save();
                ctx.setLineDash([4, 5]);
                [
                  [scale * 0.22, "rgba(200,144,26,0.32)"],
                  [scale * 0.45, "rgba(62,145,162,0.28)"],
                  [scale * 0.68, "rgba(106,156,99,0.28)"],
                  [scale * 0.9, "rgba(232,116,30,0.28)"],
                ].forEach(([radius, color]) => {
                  ctx.beginPath();
                  ctx.arc(0, 0, radius as number, 0, 2 * Math.PI);
                  ctx.strokeStyle = color as string;
                  ctx.lineWidth = 1;
                  ctx.stroke();
                });
                ctx.restore();
              }
            : undefined
        }
        linkColor={(link) =>
          (link as PartnerGraphLink).cycle ? "rgba(232, 116, 30, 0.55)" : "rgba(62, 145, 162, 0.4)"
        }
        linkWidth={(link) => ((link as PartnerGraphLink).cycle ? 1.5 : 0.6)}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node) => onSelect(node as PartnerGraphNode)}
        onNodeHover={(node) => {
          const item = (node as PartnerGraphNode | null) ?? null;
          setHoveredId(item?.id ?? null);
          onHover?.(item);
        }}
        cooldownTicks={90}
        enableNodeDrag={false}
        enableZoomInteraction
        enablePanInteraction
      />
    </div>
  );
}
