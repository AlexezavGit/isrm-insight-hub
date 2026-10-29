import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ClientAccessibility } from "./ClientAccessibility";
import { AccessControl } from "./AppShell";
export function ClientHeader({
  signIn = true,
  hideOnScroll = false,
  motionControl,
}: {
  signIn?: boolean;
  hideOnScroll?: boolean;
  motionControl?: ReactNode;
}) {
  const { locale } = useI18n();
  const uk = locale === "uk";
  const location = useLocation();
  const search = location.search as { stage?: string; preset?: string };
  const configuration = search.stage === "configuration" || !!search.preset;
  const active =
    location.pathname === "/proposal"
      ? "briefing"
      : location.pathname === "/scope"
        ? "scope"
        : configuration
          ? "configuration"
          : "prototype";
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!hideOnScroll) return;
    let previous = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - previous) > 6) {
        setHidden(y > 100 && y > previous);
        previous = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);
  return (
    <header
      className={`client-topbar shared-client-header ${hideOnScroll ? "scroll-client-header" : ""} ${hidden ? "is-receded" : ""}`}
    >
      <Link to="/" search={{ view: "map" }} className="client-wordmark">
        ISRM <span>INSIGHT HUB</span>
      </Link>
      <div className="client-topbar-actions">
        <ClientAccessibility />
        {motionControl}
        <AccessControl showSignIn={signIn} />
      </div>
      <nav
        className="client-journey-tabs"
        aria-label={uk ? "Етапи знайомства із застосунком" : "Explore the application"}
      >
        <Link to="/proposal" aria-current={active === "briefing" ? "page" : undefined}>
          {uk ? "Брифінг" : "Briefing"}
        </Link>
        <Link
          to="/"
          search={{ view: "map" }}
          aria-current={active === "prototype" ? "page" : undefined}
        >
          <span>{uk ? "Пошук" : "Find expertise"}</span>
          <small>{uk ? "Прототип" : "Prototype"}</small>
        </Link>
        <Link
          to="/"
          search={{ view: "map", stage: "configuration" }}
          aria-current={active === "configuration" ? "page" : undefined}
        >
          <span>{uk ? "Конфігуратор" : "Configurator"}</span>
          <small>{uk ? "Обрати функції" : "Choose capabilities"}</small>
        </Link>
        <Link to="/scope" aria-current={active === "scope" ? "page" : undefined}>
          {uk ? "Обсяг і бюджет" : "Scope & budget"}
        </Link>
      </nav>
    </header>
  );
}
