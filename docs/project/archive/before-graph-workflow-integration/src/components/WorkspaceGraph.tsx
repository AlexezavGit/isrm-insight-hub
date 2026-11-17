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
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { Scan, Move, Pin, RotateCw, Info, Pause, Play } from "lucide-react";
import { GraphGlyph } from "./WorkspaceGlyph";
import { CLIENT_SERVICES } from "@/lib/client-catalog";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
import type { MapNode, MapEdge, MapKind, WorkspaceMap } from "@/lib/workspace-map";
export interface WorkspaceGraphHandle {
  capture: () => string;
  fit: () => void;
}
const endpointId = (value: unknown): string =>
  typeof value === "string"
    ? value
    : value && typeof value === "object" && "id" in value
      ? String(value.id)
      : "";
type DrawNode = MapNode & {
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
};
export const WorkspaceGraph = forwardRef<
  WorkspaceGraphHandle,
  {
    build: (w: number, h: number) => WorkspaceMap;
    uk: boolean;
    configuration: boolean;
    cycle: string | null;
    selected: string | null;
    included: string[];
    relations: boolean;
    onHover: (n: MapNode) => void;
    onNode: (n: MapNode, full: boolean) => void;
    onBackground: () => void;
    railContent?: ReactNode;
    dashboard?: ReactNode;
    onRailExtent?: (height: number) => void;
  }
>(function WorkspaceGraph(
  {
    build,
    uk,
    configuration,
    cycle,
    selected,
    included,
    relations,
    onHover,
    onNode,
    onBackground,
    railContent,
    dashboard,
    onRailExtent,
  },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null),
    graph = useRef<ForceGraphMethods<DrawNode, { kind: MapEdge["kind"] }>>(undefined);
  const [size, setSize] = useState({ w: 900, h: 600 }),
    [free, setFree] = useState(false),
    [rotate, setRotate] = useState(false),
    [hover, setHover] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const started = useRef(0);
  const cycleKey = useRef<string | null>(null);
  const revealedLabels = useRef(new Set<string>());
  const elapsedClock = useRef(0),
    lastTick = useRef(0),
    lastPointer = useRef(0);
  const [paused, setPaused] = useState(false);
  const [toolsPinned, setToolsPinned] = useState(false);
  const rail = useRef<HTMLElement>(null);
  const railContents = useRef<HTMLDivElement>(null);
  const suppressTouch = useRef(false);
  useEffect(() => {
    const el = railContents.current;
    if (!el) return;
    const measure = () => onRailExtent?.(Math.ceil(el.getBoundingClientRect().height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onRailExtent, configuration]);
  useEffect(() => {
    if (!toolsPinned) return;
    const close = (event: PointerEvent) => {
      if (!rail.current?.contains(event.target as Node)) setToolsPinned(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [toolsPinned]);
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const labelQueue = useRef<DrawNode[]>([]);
  const model = useMemo(
    () => build(Math.max(240, size.w - (size.w < 600 ? 80 : 160)), Math.max(220, size.h - 180)),
    [build, size],
  );
  const data = useMemo(
    () => ({
      nodes: model.nodes.map((n) => {
        const p = positions.current.get(n.id);
        return { ...n, x: p?.x ?? 0, y: p?.y ?? 0, fx: p?.x ?? 0, fy: p?.y ?? 0 } as DrawNode;
      }),
      links: model.links.map((e) => ({ ...e })),
    }),
    [model],
  );
  const fit = useCallback(
    (duration = 600) => {
      if (!data.nodes.length) return;
      const left = Math.min(...data.nodes.map((n) => (n.x ?? 0) - n.size));
      const right = Math.max(...data.nodes.map((n) => (n.x ?? 0) + n.size));
      const top = Math.min(...data.nodes.map((n) => (n.y ?? 0) - n.size));
      const bottom = Math.max(...data.nodes.map((n) => (n.y ?? 0) + n.size));
      const padding = size.w < 600 ? 28 : 80;
      const zoom = Math.min(
        2.2,
        (size.w - padding * 2) / Math.max(100, right - left),
        (size.h - 64 - padding * 2) / Math.max(100, bottom - top),
      );
      graph.current?.centerAt((left + right) / 2, (top + bottom) / 2, duration);
      graph.current?.zoom(Math.max(0.05, zoom), duration);
    },
    [data, size.w, size.h],
  );
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      setSize((s) =>
        s.w === Math.floor(r.width) && s.h === Math.floor(r.height)
          ? s
          : { w: Math.floor(r.width), h: Math.floor(r.height) },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (cycle) {
      setFree(false);
      setRotate(false);
    }
  }, [cycle]);
  useEffect(() => {
    started.current = performance.now();
    if (cycleKey.current !== cycle) {
      elapsedClock.current = 0;
      cycleKey.current = cycle;
      revealedLabels.current.clear();
    }
    lastTick.current = performance.now();
    let id = 0;
    const start = data.nodes.map((n) => ({ x: n.x ?? 0, y: n.y ?? 0 }));
    const animate = (now: number) => {
      const p = reduced ? 1 : Math.min(1, (now - started.current) / 900),
        e = 1 - Math.pow(1 - p, 3);
      data.nodes.forEach((n, i) => {
        const target = model.nodes[i]!;
        n.x = start[i]!.x + (target.x - start[i]!.x) * e;
        n.y = start[i]!.y + (target.y - start[i]!.y) * e;
        n.fx = n.x;
        n.fy = n.y;
        positions.current.set(n.id, { x: n.x, y: n.y });
      });
      graph.current?.d3ReheatSimulation();
      if (p < 1) id = requestAnimationFrame(animate);
      else {
        fit();
        if (free)
          for (const n of data.nodes) {
            delete n.fx;
            delete n.fy;
          }
      }
    };
    id = requestAnimationFrame(animate);
    graph.current?.centerAt(0, 0, 300);
    graph.current?.zoom(1, 300);
    return () => cancelAnimationFrame(id);
  }, [data, model, free, reduced, cycle, fit]);
  useEffect(() => {
    const observer = new MutationObserver(() => graph.current?.d3ReheatSimulation());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      capture: () => {
        const source = wrap.current?.querySelector("canvas");
        if (!source) return "";
        const c = document.createElement("canvas");
        c.width = 320;
        c.height = Math.max(1, Math.round((320 * source.height) / source.width));
        const ctx = c.getContext("2d");
        if (!ctx) return "";
        ctx.fillStyle = "#102c3b";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(source, 0, 0, c.width, c.height);
        return c.toDataURL("image/png");
      },
      fit: () => {
        fit();
      },
    }),
    [fit],
  );
  const related = useMemo(() => {
    if (!selected || !relations) return new Set<string>();
    const workflows = new Set(
      model.links
        .filter((e) => e.source === "function:" + selected || e.target === "function:" + selected)
        .flatMap((e) => [e.source, e.target]),
    );
    for (const e of model.links) if (workflows.has(e.source)) workflows.add(e.target);
    return workflows;
  }, [model, selected, relations]);
  const labels = (label: string) => {
    const words = label.split(/\s+/),
      lines: string[] = [];
    let line = "";
    for (const word of words) {
      if ((line + " " + word).length > (size.w < 400 ? 24 : 30) && line) {
        lines.push(line);
        line = word;
      } else line += (line ? " " : "") + word;
    }
    if (line) lines.push(line);
    return lines;
  };
  return (
    <div className="workspace-graph-layout">
      <div
        className="workspace-map"
        onPointerMove={() => {
          lastPointer.current = performance.now();
        }}
        ref={wrap}
        tabIndex={-1}
        role="region"
        aria-label={uk ? "Інтерактивна мапа" : "Interactive map"}
      >
        <ForceGraph2D<DrawNode, { kind: MapEdge["kind"] }>
          ref={graph}
          width={size.w}
          height={Math.max(100, size.h - 64)}
          graphData={data}
          backgroundColor="#102c3b00"
          autoPauseRedraw={(!cycle || paused || reduced) && !rotate}
          enableNodeDrag={free}
          enablePanInteraction={true}
          enableZoomInteraction={true}
          cooldownTicks={free ? 120 : 0}
          maxZoom={3}
          onEngineStop={() => {
            if (free) fit();
          }}
          nodeLabel={(n) => {
            const escape = (s: string) =>
              s.replace(
                /[&<>"']/g,
                (c) =>
                  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
              );
            const capability = CLIENT_SERVICES.find((s) => s.id === n.functionId);
            return (
              escape(n.label) +
              (capability ? "<br/>" + escape(capability.detail[uk ? "uk" : "en"]) : "")
            );
          }}
          nodeVal={(n) => n.size}
          linkVisibility={(e) => !cycle || e.kind !== "workflow"}
          linkWidth={(e) =>
            endpointId(e.source) === selected || endpointId(e.target) === selected
              ? 1.6
              : e.kind === "workflow"
                ? 1.4
                : 0.7
          }
          linkColor={(e) =>
            endpointId(e.source) === selected || endpointId(e.target) === selected
              ? "#eee9dcc9"
              : e.kind === "workflow"
                ? "#d2bd7077"
                : e.kind === "illustration"
                  ? "#92c8ba33"
                  : "#9cb9bd66"
          }
          linkLineDash={(e) => (e.kind === "category" ? [3, 3] : [])}
          onNodeHover={(n) => {
            setHover(n?.id ?? null);
            if (n && n.kind !== "illustration" && performance.now() - lastPointer.current < 160)
              onHover(n);
          }}
          onNodeClick={(n, event) => {
            if (n.kind !== "illustration") onNode(n, event.detail > 1);
          }}
          onBackgroundClick={onBackground}
          onNodeDragEnd={(n) => {
            n.fx = n.x;
            n.fy = n.y;
            positions.current.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 });
          }}
          onRenderFramePre={(ctx) => {
            labelQueue.current = [];
            const clockNow = performance.now();
            if (!paused && !reduced)
              elapsedClock.current += Math.max(0, clockNow - lastTick.current);
            lastTick.current = clockNow;
            if (rotate && !reduced) {
              const a = 0.0018,
                c = Math.cos(a),
                s = Math.sin(a);
              for (const n of data.nodes) {
                const x = n.x ?? 0,
                  y = n.y ?? 0;
                n.x = x * c - y * s;
                n.y = x * s + y * c;
                n.fx = n.x;
                n.fy = n.y;
              }
            }
            if (cycle && configuration && data.nodes.some((n) => n.kind === "function")) {
              const ring = data.nodes.filter((n) => n.kind === "function"),
                radiusX = Math.max(...ring.map((n) => Math.abs(n.x))),
                radiusY = Math.max(...ring.map((n) => Math.abs(n.y)));
              const period = ring.reduce(
                (sum, n) => sum + Math.max(2000, n.label.split(/\s+/).length * 420),
                0,
              );
              const phase = reduced
                ? 0
                : ((elapsedClock.current % period) / period) * Math.PI * 2 - Math.PI / 2;
              ctx.save();
              ctx.beginPath();
              ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
              ctx.strokeStyle = "#9eb5bd77";
              ctx.lineWidth = 1;
              ctx.stroke();
              for (let i = 0; i < 46; i++) {
                const a = phase - (46 - i) * 0.008,
                  t = i / 46;
                ctx.beginPath();
                ctx.ellipse(0, 0, radiusX, radiusY, 0, a, a + 0.012);
                ctx.strokeStyle = `rgba(236,220,150,${Math.sin(t * Math.PI) * 0.85})`;
                ctx.lineWidth = Math.sin(t * Math.PI) * 4;
                ctx.stroke();
              }
              ctx.restore();
            }
          }}
          onRenderFramePost={(ctx, scale) => {
            const canvasHeight = Math.max(100, size.h - 64);
            const occupied: { x: number; y: number; w: number; h: number }[] = [];
            const priority = (n: DrawNode) =>
              n.id === selected || n.functionId === selected
                ? 0
                : n.id === hover
                  ? 1
                  : n.primary
                    ? 2
                    : 3;
            const candidates = [...labelQueue.current].sort((a, b) => priority(a) - priority(b));
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            for (const n of candidates) {
              const point = graph.current?.graph2ScreenCoords(n.x ?? 0, n.y ?? 0);
              if (!point) continue;
              const fontPixels = document.documentElement.classList.contains("client-large-text")
                ? 19
                : size.w < 400
                  ? 14
                  : 16;
              ctx.font = `${n.primary ? 600 : 400} ${fontPixels / scale}px "Source Sans 3", Arial`;
              const lines = labels(n.kind === "person" ? (n.code ?? n.id) : n.label);
              const width =
                Math.max(...lines.map((line) => ctx.measureText(line).width)) * scale + 12;
              const lineHeight = fontPixels * 1.25;
              const height = lines.length * lineHeight + 8;
              const radius = (n.clusterRadius ?? n.size) * scale + 10;
              const choices = [
                { x: point.x - width / 2, y: point.y + radius },
                { x: point.x - width / 2, y: point.y - radius - height },
                { x: point.x + radius, y: point.y - height / 2 },
                { x: point.x - radius - width, y: point.y - height / 2 },
              ];
              // Additional lanes retain primary captions without allowing them
              // to collide with captions already placed in this frame.
              if (n.primary || priority(n) < 2) {
                for (let step = 1; step <= 5; step++)
                  for (const sign of [-1, 1])
                    choices.push({
                      x: point.x - width / 2,
                      y: point.y + sign * (radius + step * (height + 8)),
                    });
              }
              const box = choices.find(
                (option) =>
                  option.x >= 5 &&
                  option.y >= 5 &&
                  option.x + width <= size.w - 5 &&
                  option.y + height <= canvasHeight - 5 &&
                  !occupied.some(
                    (other) =>
                      option.x < other.x + other.w + 6 &&
                      option.x + width + 6 > other.x &&
                      option.y < other.y + other.h + 6 &&
                      option.y + height + 6 > other.y,
                  ),
              );
              if (!box) continue;
              occupied.push({ ...box, w: width, h: height });
              const origin = {
                x: (n.x ?? 0) + (box.x - point.x) / scale,
                y: (n.y ?? 0) + (box.y - point.y) / scale,
              };
              ctx.fillStyle = "#102c3be8";
              ctx.fillRect(origin.x, origin.y, width / scale, height / scale);
              ctx.fillStyle = "#eee9dc";
              lines.forEach((line, i) =>
                ctx.fillText(
                  line,
                  origin.x + width / (2 * scale),
                  origin.y + (4 + i * lineHeight) / scale,
                ),
              );
            }
            ctx.restore();
          }}
          nodeCanvasObject={(n, ctx, scale) => {
            const isHover = hover === n.id;
            const isSelected = n.functionId === selected || n.id === selected;
            const dim = relations && related.size && !related.has(n.id) && n.kind === "function";
            ctx.save();
            ctx.translate(n.x ?? 0, n.y ?? 0);
            ctx.globalAlpha = dim ? 0.28 : 1;
            // Keep the established world-space glyph sizes. A screen-space
            // minimum on every record made zoomed-out populations merge.
            const radius = n.size;
            const shape = new Path2D(mapSymbolPath(n.kind, radius));
            ctx.fillStyle =
              n.kind === "person" || n.kind === "illustration"
                ? MAP_SYMBOLS[n.kind].color
                : "#102c3b";
            ctx.fill(shape);
            ctx.strokeStyle = MAP_SYMBOLS[n.kind].color;
            ctx.lineWidth = 1.3 / Math.max(0.7, scale);
            ctx.stroke(shape);
            if (isSelected || (n.functionId && included.includes(n.functionId))) {
              const outerShape = new Path2D(mapSymbolPath(n.kind, radius + 4 / scale));
              ctx.strokeStyle = "#eee0a6";
              ctx.lineWidth = (isSelected ? 2 : 1) / Math.max(0.7, scale);
              ctx.stroke(outerShape);
            }
            const cycleNodes = data.nodes.filter((x) => x.kind === "function");
            const elapsed = elapsedClock.current;
            let threshold = 0;
            for (const x of cycleNodes) {
              if (x.id === n.id) break;
              threshold += Math.max(2000, x.label.split(/\s+/).length * 420);
            }
            if (!cycle || reduced || paused || elapsed >= threshold)
              revealedLabels.current.add(n.id);
            const reveal = revealedLabels.current.has(n.id);
            const show =
              n.kind !== "illustration" &&
              (isHover ||
                isSelected ||
                (n.primary && reveal) ||
                (n.kind !== "person" &&
                  n.kind !== "workflow" &&
                  (model.nodes.length < 25 || scale > 1.4)));
            if (show) labelQueue.current.push(n);
            ctx.restore();
          }}
        />
        {dashboard}
        {!model.nodes.length && (
          <p className="workspace-map-empty">
            {uk
              ? "Немає записів за цим вибором. Змініть критерії."
              : "No records match this selection. Change the criteria."}
          </p>
        )}
      </div>
      <aside
        ref={rail}
        onPointerDownCapture={(event) => {
          if (event.pointerType === "touch" && !toolsPinned) {
            suppressTouch.current = true;
            setToolsPinned(true);
          }
        }}
        onClickCapture={(event) => {
          if (suppressTouch.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressTouch.current = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setToolsPinned(false);
            wrap.current?.focus();
            event.stopPropagation();
          }
        }}
        className={"workspace-map-tools" + (toolsPinned ? " is-pinned" : "")}
        aria-label={uk ? "Керування мапою та легенда" : "Map controls and legend"}
      >
        <div className="workspace-rail-content" ref={railContents}>
          <details className="workspace-rail-info">
            <summary
              aria-label={uk ? "Про панель керування" : "About map controls"}
              data-hint={uk ? "Про панель керування" : "About map controls"}
            >
              <Info size={20} />
            </summary>
            <div>
              <p>
                <Info size={15} />
                {uk
                  ? "Керування графом, легенда, мова та доступ. Наведіть курсор, перейдіть клавіатурою або торкніться, щоб розгорнути панель. Повторне торкання виконує обрану дію."
                  : "Map controls, legend, language and access. Hover, focus or tap to expand; a second tap activates a control."}
              </p>
            </div>
          </details>
          {railContent}
          <button
            onClick={() => setFree(false)}
            aria-pressed={!free}
            aria-label={uk ? "Фіксоване розташування вузлів" : "Fixed node positions"}
            data-hint={uk ? "Фіксоване розташування вузлів" : "Fixed node positions"}
          >
            <Pin size={18} />
            <span>{uk ? "Фіксований" : "Fixed"}</span>
          </button>
          <button
            onClick={() => setFree(true)}
            aria-pressed={free}
            aria-label={uk ? "Вільне розташування вузлів" : "Free node layout"}
            data-hint={uk ? "Вільне розташування вузлів" : "Free node layout"}
          >
            <Move size={18} />
            <span>{uk ? "Вільний" : "Free"}</span>
          </button>
          <button
            onClick={() => {
              fit();
            }}
            aria-label={uk ? "Вписати граф у вікно" : "Fit graph to window"}
            data-hint={uk ? "Вписати граф у вікно" : "Fit graph to window"}
          >
            <Scan size={18} />
            <span>{uk ? "Вписати у вікно" : "Fit to window"}</span>
          </button>
          <button
            onClick={() => setRotate(!rotate)}
            aria-pressed={rotate}
            aria-label={uk ? "Обертати граф" : "Rotate graph"}
            data-hint={uk ? "Обертати граф" : "Rotate graph"}
          >
            <RotateCw size={18} />
            <span>{uk ? "Обертати" : "Rotate"}</span>
          </button>
          {cycle && (
            <button
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              title={uk ? "Призупинити або відновити відблиск" : "Pause or resume reflection"}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
              <span>{paused ? (uk ? "Відновити" : "Resume") : uk ? "Призупинити" : "Pause"}</span>
            </button>
          )}
          <div className="workspace-symbol-legend">
            <h2>{uk ? "Легенда" : "Legend"}</h2>
            {(configuration
              ? ["function", "workflow", "illustration"]
              : ["person", "organisation", "country", "expertise", "sector", "status"]
            ).map((k) => (
              <div
                key={k}
                tabIndex={0}
                role="img"
                aria-label={
                  {
                    person: uk ? "Персона" : "Person",
                    organisation: uk ? "Організація" : "Organisation",
                    country: uk ? "Країна" : "Country",
                    expertise: uk ? "Експертиза" : "Expertise",
                    sector: uk ? "Сектор" : "Sector",
                    status: uk ? "Статус" : "Status",
                    function: uk ? "Функція" : "Capability",
                    workflow: "Workflow",
                    illustration: uk ? "Ілюстрація, не учасник" : "Illustration, not participant",
                  }[k]
                }
                data-hint={
                  {
                    person: uk ? "Персона" : "Person",
                    organisation: uk ? "Організація" : "Organisation",
                    country: uk ? "Країна за телефонним кодом" : "Phone-code country",
                    expertise: uk ? "Експертиза" : "Expertise",
                    sector: uk ? "Сектор" : "Sector",
                    status: uk ? "Статус джерела" : "Source status",
                    function: uk ? "Функція" : "Capability",
                    workflow: "Workflow",
                    illustration: uk ? "Ілюстрація, не учасник" : "Illustration, not participant",
                  }[k]
                }
              >
                <GraphGlyph kind={k as MapKind} />
                <span>
                  {
                    (
                      {
                        person: uk ? "Персона" : "Person",
                        organisation: uk ? "Організація" : "Organisation",
                        country: uk ? "Країна" : "Country",
                        expertise: uk ? "Експертиза" : "Expertise",
                        sector: uk ? "Сектор" : "Sector",
                        status: uk ? "Записаний статус" : "Recorded status",
                        function: uk ? "Функція" : "Capability",
                        workflow: "Workflow",
                        illustration: uk
                          ? "Ілюстративні записи · не учасники"
                          : "Illustrative records · not participants",
                      } as Record<string, string>
                    )[k]
                  }
                </span>
              </div>
            ))}
            <div>
              <i className="workspace-edge-key" />
              <span>
                {configuration
                  ? uk
                    ? "Склад workflow"
                    : "Workflow composition"
                  : uk
                    ? "Спільна записана ознака"
                    : "Shared recorded attribute"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
});
