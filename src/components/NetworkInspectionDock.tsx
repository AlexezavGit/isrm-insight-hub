import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Network, X } from "lucide-react";
import type { inspectionLayout, InspectionWidths } from "@/lib/network-dock";

function WidthHandle({
  width,
  maximum,
  label,
  onWidth,
}: {
  width: number;
  maximum: number;
  label: string;
  onWidth: (width: number) => void;
}) {
  const drag = useRef<{ x: number; width: number } | null>(null);
  const limit = (value: number) => Math.max(260, Math.min(maximum, value));
  return (
    <div
      className="network-panel-resizer"
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={260}
      aria-valuemax={Math.round(maximum)}
      aria-valuenow={Math.round(width)}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        drag.current = { x: event.clientX, width };
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
      }}
      onPointerMove={(event) => {
        if (drag.current) onWidth(limit(drag.current.width + drag.current.x - event.clientX));
      }}
      onPointerUp={(event) => {
        drag.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onLostPointerCapture={() => {
        drag.current = null;
      }}
      onKeyDown={(event) => {
        const change = event.key === "ArrowLeft" ? 24 : event.key === "ArrowRight" ? -24 : 0;
        if (change || event.key === "Home" || event.key === "End") {
          event.preventDefault();
          onWidth(
            event.key === "Home" ? 260 : event.key === "End" ? maximum : limit(width + change),
          );
        }
      }}
    />
  );
}

export function NetworkInspectionDock({
  profile,
  shortlist,
  profileKey,
  layout,
  onWidth,
  onCloseProfile,
  onCloseShortlist,
  onGraph,
  uk,
}: {
  profile?: ReactNode;
  shortlist?: ReactNode;
  profileKey: string | null;
  layout: ReturnType<typeof inspectionLayout>;
  onWidth: (panel: keyof InspectionWidths, width: number) => void;
  onCloseProfile: () => void;
  onCloseShortlist: () => void;
  onGraph: () => void;
  uk: boolean;
}) {
  const [tab, setTab] = useState<"profile" | "shortlist">(profile ? "profile" : "shortlist");
  const hasShortlist = !!shortlist;
  const previous = useRef(hasShortlist);
  useEffect(() => {
    if (hasShortlist && !previous.current) setTab("shortlist");
    previous.current = hasShortlist;
  }, [hasShortlist]);
  useEffect(() => {
    if (profileKey) setTab("profile");
  }, [profileKey]);
  const active = tab === "profile" && profile ? "profile" : shortlist ? "shortlist" : "profile";
  if (!profile && !shortlist) return null;
  const t = (en: string, ua: string) => (uk ? ua : en);
  return (
    <div className="network-inspection-dock" style={{ width: layout.width } as CSSProperties}>
      {layout.compact && (
        <nav
          className="network-inspection-tabs"
          aria-label={t("Inspection panels", "Панелі перегляду")}
        >
          {profile && (
            <button aria-pressed={active === "profile"} onClick={() => setTab("profile")}>
              {t("Dossier", "Досьє")}
            </button>
          )}
          {shortlist && (
            <button aria-pressed={active === "shortlist"} onClick={() => setTab("shortlist")}>
              {t("Shortlist", "Відбір")}
            </button>
          )}
          <button onClick={onGraph} aria-label={t("Return to graph", "Повернутися до графа")}>
            <Network size={18} />
          </button>
        </nav>
      )}
      {(["shortlist", "profile"] as const).map((panel) => {
        const content = panel === "profile" ? profile : shortlist;
        if (!content) return null;
        const width = layout[panel];
        const maximum = Math.min(
          560,
          layout.width + layout.graph - 380 - layout[panel === "profile" ? "shortlist" : "profile"],
        );
        return (
          <section
            key={panel}
            className={`network-inspection-pane inspection-${panel}`}
            hidden={layout.compact && active !== panel}
            style={layout.compact ? undefined : { width }}
          >
            {!layout.compact && (
              <WidthHandle
                width={width}
                maximum={maximum}
                label={
                  panel === "profile"
                    ? t("Resize dossier", "Змінити ширину досьє")
                    : t("Resize shortlist", "Змінити ширину відбору")
                }
                onWidth={(value) => onWidth(panel, value)}
              />
            )}
            <button
              className="network-inspection-close"
              onClick={panel === "profile" ? onCloseProfile : onCloseShortlist}
              aria-label={
                panel === "profile"
                  ? t("Close dossier", "Закрити досьє")
                  : t("Close shortlist", "Закрити відбір")
              }
            >
              <X size={17} />
            </button>
            {content}
          </section>
        );
      })}
    </div>
  );
}
