import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Network, X } from "lucide-react";
import type { stackedInspectionLayout, StackWidths } from "@/lib/network-dock";

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
  const limit = (value: number) => Math.max(220, Math.min(maximum, value));
  return (
    <div
      className="network-panel-resizer"
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={220}
      aria-valuemax={Math.round(maximum)}
      aria-valuenow={Math.round(width)}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        drag.current = { x: event.clientX, width };
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
      }}
      onPointerMove={(event) => {
        if (drag.current) onWidth(limit(drag.current.width + event.clientX - drag.current.x));
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
        const change = event.key === "ArrowRight" ? 24 : event.key === "ArrowLeft" ? -24 : 0;
        if (change || event.key === "Home" || event.key === "End") {
          event.preventDefault();
          onWidth(
            event.key === "Home" ? 220 : event.key === "End" ? maximum : limit(width + change),
          );
        }
      }}
    />
  );
}

export function NetworkInspectionDock({
  search,
  searchLabel,
  onCloseSearch,
  searchKey,
  profile,
  shortlist,
  profileKey,
  layout,
  onWidth,
  onCloseProfile,
  onCloseShortlist,
  onGraph,
  uk,
  auxiliaryLabel,
  auxiliaryKey,
  profileLabel,
  historical = false,
}: {
  search?: ReactNode;
  searchLabel?: string | undefined;
  searchKey?: number;
  onCloseSearch?: () => void;
  profile?: ReactNode;
  shortlist?: ReactNode;
  profileKey: string | null;
  layout: ReturnType<typeof stackedInspectionLayout>;
  onWidth: (panel: keyof StackWidths, width: number) => void;
  onCloseProfile: () => void;
  onCloseShortlist: () => void;
  onGraph: () => void;
  uk: boolean;
  auxiliaryLabel?: string | undefined;
  auxiliaryKey?: string | null;
  profileLabel?: string | undefined;
  historical?: boolean;
}) {
  const [tab, setTab] = useState<"search" | "profile" | "shortlist">(
    profile ? "profile" : "shortlist",
  );
  const hasShortlist = !!shortlist;
  const previous = useRef(hasShortlist);
  useEffect(() => {
    if (hasShortlist && !previous.current) setTab("shortlist");
    previous.current = hasShortlist;
  }, [hasShortlist]);
  useEffect(() => {
    if (profileKey) setTab("profile");
  }, [profileKey]);
  useEffect(() => {
    if (searchKey) setTab("search");
  }, [searchKey]);
  useEffect(() => {
    if (auxiliaryKey) setTab("shortlist");
  }, [auxiliaryKey]);
  const panes = { search, profile, shortlist };
  const active = panes[tab] ? tab : search ? "search" : profile ? "profile" : "shortlist";
  if (!search && !profile && !shortlist) return null;
  const t = (en: string, ua: string) => (uk ? ua : en);
  return (
    <div className="network-inspection-dock" style={{ width: layout.width } as CSSProperties}>
      {layout.compact && (
        <nav
          className="network-inspection-tabs"
          aria-label={t("Inspection panels", "Панелі перегляду")}
        >
          {search && (
            <button aria-pressed={active === "search"} onClick={() => setTab("search")}>
              {searchLabel || t("Search", "Пошук")}
            </button>
          )}
          {profile && (
            <button aria-pressed={active === "profile"} onClick={() => setTab("profile")}>
              {profileLabel || t("Dossier", "Досьє")}
            </button>
          )}
          {shortlist && (
            <button aria-pressed={active === "shortlist"} onClick={() => setTab("shortlist")}>
              {auxiliaryLabel || t("Shortlist", "Відбір")}
            </button>
          )}
          <button onClick={onGraph} aria-label={t("Return to graph", "Повернутися до графа")}>
            <Network size={18} />
          </button>
        </nav>
      )}
      {(["search", "profile", "shortlist"] as const).map((panel) => {
        const content = panes[panel];
        if (!content) return null;
        const width = layout[panel];
        const maximum = historical
          ? Math.min(560, layout.graph - 380 + width)
          : Math.max(220, Math.min(560, layout.graph - 260 + width));
        return (
          <section
            key={panel}
            className={`network-inspection-pane inspection-${panel}`}
            hidden={layout.compact && active !== panel}
            style={layout.compact ? undefined : { width }}
          >
            {!historical && (
              <h2 className="network-pane-heading">
                {panel === "search"
                  ? searchLabel || t("Search", "Пошук")
                  : panel === "profile"
                    ? profileLabel || t("Dossier", "Досьє")
                    : auxiliaryLabel || t("Your shortlist", "Ваш відбір")}
              </h2>
            )}
            {!layout.compact && (
              <WidthHandle
                width={width}
                maximum={maximum}
                label={
                  panel === "search"
                    ? t("Resize ", "Змінити ширину: ") + (searchLabel || t("Search", "Пошук"))
                    : panel === "profile"
                      ? t("Resize dossier", "Змінити ширину досьє")
                      : auxiliaryLabel
                        ? t("Resize ", "Змінити ширину: ") + auxiliaryLabel
                        : t("Resize shortlist", "Змінити ширину відбору")
                }
                onWidth={(value) => onWidth(panel, value)}
              />
            )}
            <button
              className="network-inspection-close"
              onClick={
                panel === "search"
                  ? onCloseSearch
                  : panel === "profile"
                    ? onCloseProfile
                    : onCloseShortlist
              }
              aria-label={
                panel === "search"
                  ? t("Close ", "Закрити: ") + (searchLabel || t("Search", "Пошук"))
                  : panel === "profile"
                    ? t("Close dossier", "Закрити досьє")
                    : auxiliaryLabel
                      ? t("Close ", "Закрити: ") + auxiliaryLabel
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
