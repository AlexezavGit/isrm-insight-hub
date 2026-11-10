import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";
import type {
  PrototypePanel,
  PrototypeWorkspace,
  WorkspaceAction,
  prototypeLayout,
} from "@/lib/prototype-workspace";

export function NetworkPrototypeDock({
  state,
  layout,
  panes,
  labels,
  onAction,
  onWidth,
  uk,
  profileKey,
}: {
  state: PrototypeWorkspace;
  layout: ReturnType<typeof prototypeLayout>;
  panes: Partial<Record<PrototypePanel, ReactNode>>;
  labels: Record<PrototypePanel, string>;
  onAction: (action: WorkspaceAction) => void;
  onWidth: (panel: PrototypePanel, width: number) => void;
  uk: boolean;
  profileKey: string | null;
}) {
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef<Partial<Record<PrototypePanel, number>>>({});
  const drag = useRef<{ panel: PrototypePanel; x: number; width: number } | null>(null);
  useEffect(() => {
    scroll.current.profile = 0;
    const content = host.current?.querySelector<HTMLElement>(
      '[data-workspace-panel="profile"] .network-prototype-scroll',
    );
    if (content) content.scrollTop = 0;
  }, [profileKey, state.full]);
  const focusPanel = state.focus && layout.panels.includes(state.focus) ? state.focus : null;
  useEffect(() => {
    if (!focusPanel) return;
    const panel = host.current?.querySelector<HTMLElement>(
      `[data-workspace-panel="${focusPanel}"]`,
    );
    panel?.focus({ preventScroll: true });
  }, [focusPanel, state.view, layout.compact]);
  if (!layout.panels.length && !layout.rails.length) return null;
  return (
    <div ref={host} className="network-prototype-dock" style={{ width: layout.width }}>
      <nav
        className="network-panel-spines"
        aria-label={uk ? "Збережений контекст панелей" : "Panel context"}
      >
        {layout.rails.map((panel) => (
          <div className="network-panel-spine" key={panel}>
            <button
              title={labels[panel]}
              onClick={() => onAction({ type: "restore", panel })}
              aria-label={`${uk ? "Відновити" : "Restore"} ${labels[panel]}`}
            >
              <span>{labels[panel]}</span>
            </button>
            <button
              onClick={() => onAction({ type: "close", panel })}
              aria-label={`${uk ? "Закрити" : "Close"} ${labels[panel]}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </nav>
      {(["search", "results", "profile", "shortlist"] as PrototypePanel[])
        .filter((panel) => panes[panel])
        .map((panel) => (
          <section
            key={panel}
            className="network-prototype-pane"
            data-workspace-panel={panel}
            tabIndex={-1}
            hidden={!layout.panels.includes(panel)}
            aria-label={labels[panel]}
            style={{ width: layout[panel] }}
          >
            <header className="network-prototype-heading">
              <h2>{labels[panel]}</h2>
              <button
                title={uk ? "Схлопнути до корінця" : "Collapse to spine"}
                aria-label={`${uk ? "Схлопнути" : "Collapse"} ${labels[panel]}`}
                onClick={() => onAction({ type: "collapse", panel })}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label={`${uk ? "Закрити" : "Close"} ${labels[panel]}`}
                onClick={() => onAction({ type: "close", panel })}
              >
                <X size={16} />
              </button>
            </header>
            <div
              className="network-prototype-scroll"
              ref={(el) => {
                if (el) el.scrollTop = scroll.current[panel] ?? 0;
              }}
              onScroll={(e) => {
                scroll.current[panel] = e.currentTarget.scrollTop;
              }}
            >
              {panes[panel]}
            </div>
            {!layout.compact && (
              <div
                className="network-prototype-resizer"
                role="separator"
                tabIndex={0}
                aria-orientation="vertical"
                aria-label={`${uk ? "Змінити ширину" : "Resize"} ${labels[panel]}`}
                aria-valuemin={220}
                aria-valuemax={560}
                aria-valuenow={Math.round(layout[panel])}
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  drag.current = { panel, x: e.clientX, width: layout[panel] };
                  e.currentTarget.setPointerCapture(e.pointerId);
                  e.preventDefault();
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (!d) return;
                  const next = d.width + e.clientX - d.x;
                  if (next < 140) {
                    drag.current = null;
                    onAction({ type: "collapse", panel });
                  } else onWidth(panel, Math.max(220, Math.min(560, next)));
                }}
                onPointerUp={(e) => {
                  drag.current = null;
                  if (e.currentTarget.hasPointerCapture(e.pointerId))
                    e.currentTarget.releasePointerCapture(e.pointerId);
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
                onLostPointerCapture={() => {
                  drag.current = null;
                }}
                onKeyDown={(e) => {
                  const delta = e.key === "ArrowRight" ? 24 : e.key === "ArrowLeft" ? -24 : 0;
                  if (delta || e.key === "Home" || e.key === "End") {
                    e.preventDefault();
                    onWidth(
                      panel,
                      e.key === "Home"
                        ? 220
                        : e.key === "End"
                          ? 560
                          : Math.max(220, Math.min(560, layout[panel] + delta)),
                    );
                  }
                }}
              />
            )}
          </section>
        ))}
    </div>
  );
}
