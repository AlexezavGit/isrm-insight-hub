import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ClientAccessibility } from "./ClientAccessibility";
import { AccessControl } from "./AppShell";
export function ClientHeader({
  signIn = true,
  hideOnScroll = false,
  motionControl,
  baseline = false,
  beforeNavigation,
}: {
  signIn?: boolean;
  hideOnScroll?: boolean;
  motionControl?: ReactNode;
  baseline?: boolean;
  beforeNavigation?: ReactNode;
}) {
  const { locale } = useI18n();
  const uk = locale === "uk";
  const location = useLocation();
  const active =
    location.pathname === "/proposal"
      ? "briefing"
      : location.pathname === "/scope"
        ? "scope"
        : "dossier";
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
      className={`client-topbar shared-client-header is-material-header ${baseline ? "is-baseline-header" : ""} ${hideOnScroll ? "scroll-client-header" : ""} ${hidden ? "is-receded" : ""}`}
    >
      <Link
        to="/"
        search={{ view: "map" }}
        className="client-wordmark"
        aria-label={uk ? "ISRM · відкрити застосунок" : "ISRM · open application"}
      >
        ISRM <span>INSIGHT HUB</span>
      </Link>
      <div className="client-topbar-actions">
        <ClientAccessibility baseline={baseline} />
        {motionControl}
        <AccessControl showSignIn={signIn} />
      </div>
      {beforeNavigation}
      <nav
        className="client-material-navigation"
        aria-label={
          uk ? "Матеріали й перехід до застосунку" : "Supporting materials and application"
        }
      >
        <Link to="/" search={{ view: "map" }}>
          {uk ? "Відкрити застосунок" : "Open application"}
        </Link>
        <Link to="/proposal" aria-current={active === "briefing" ? "page" : undefined}>
          {uk ? "Брифінг · документ" : "Briefing · document"}
        </Link>
        <Link to="/scope" aria-current={active === "scope" ? "page" : undefined}>
          {uk ? "Обсяг і бюджет · документ" : "Scope & budget · document"}
        </Link>
      </nav>
    </header>
  );
}
