import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Settings, SlidersHorizontal } from "lucide-react";
import { ClientAccessibility } from "./ClientAccessibility";
import { AccessControl } from "./AppShell";
import { useDismissibleDetails } from "./useDismissibleDetails";

/** Application controls stay separate from the briefing and commercial documents. */
export function NetworkApplicationHeader({
  wide,
  uk,
  children,
}: {
  wide: boolean;
  uk: boolean;
  children: ReactNode;
}) {
  const view = useRef<HTMLDetailsElement>(null);
  const settings = useDismissibleDetails();
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!wide && view.current && !view.current.contains(event.target as Node))
        view.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (!wide && event.key === "Escape" && view.current?.open) {
        view.current.open = false;
        view.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [wide]);
  return (
    <header className="network-application-header">
      <Link
        to="/"
        search={{ view: "map" }}
        className="client-wordmark"
        aria-label={uk ? "ISRM · робоча мережа" : "ISRM · network workspace"}
      >
        ISRM <span>INSIGHT HUB</span>
      </Link>
      <details ref={view} className="network-application-view" open={wide || undefined}>
        <summary>
          <SlidersHorizontal size={19} aria-hidden="true" />
          {uk ? "Вигляд графа" : "Graph view"}
        </summary>
        <div className="network-application-view-content">{children}</div>
      </details>
      <details ref={settings} className="network-application-settings">
        <summary aria-label={uk ? "Налаштування" : "Settings"}>
          <Settings size={19} aria-hidden="true" />
          <span>{uk ? "Налаштування" : "Settings"}</span>
        </summary>
        <div className="network-chrome-popover">
          <h2>{uk ? "Мова, доступність і доступ" : "Language, accessibility & access"}</h2>
          <ClientAccessibility />
          <AccessControl />
        </div>
      </details>
    </header>
  );
}
