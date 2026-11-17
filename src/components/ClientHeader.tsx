import { ArrowLeft, ArrowRight } from "lucide-react";
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
}: {
  signIn?: boolean;
  hideOnScroll?: boolean;
  motionControl?: ReactNode;
  baseline?: boolean;
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
  const stages = [
    { id: "briefing", to: "/proposal" as const, search: {}, label: uk ? "Брифінг" : "Briefing" },
    {
      id: "prototype",
      to: "/" as const,
      search: { view: "map" as const },
      label: uk ? "Пошук · прототип" : "Find expertise · prototype",
    },
    {
      id: "configuration",
      to: "/" as const,
      search: { view: "map" as const, stage: "configuration" as const },
      label: uk ? "Конфігуратор" : "Configurator",
    },
    {
      id: "scope",
      to: "/scope" as const,
      search: {},
      label: uk ? "Обсяг і бюджет" : "Scope & budget",
    },
  ];
  const index = stages.findIndex((s) => s.id === active),
    previous = stages[(index + 3) % 4]!,
    next = stages[(index + 1) % 4]!;
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
      className={`client-topbar shared-client-header ${baseline ? "is-baseline-header" : ""} ${hideOnScroll ? "scroll-client-header" : ""} ${hidden ? "is-receded" : ""}`}
    >
      <Link
        to="/scope"
        className="client-wordmark"
        aria-label={uk ? "ISRM · обсяг і бюджет" : "ISRM · scope and budget"}
      >
        ISRM <span>INSIGHT HUB</span>
      </Link>
      <div className="client-topbar-actions">
        <ClientAccessibility baseline={baseline} />
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
      <nav
        className="client-journey-ring"
        aria-label={uk ? "Кільцева навігація розділами" : "Cycle through the four sections"}
      >
        <Link
          to={previous.to}
          search={previous.search}
          aria-label={(uk ? "До розділу: " : "Previous: ") + previous.label}
        >
          <ArrowLeft size={21} />
        </Link>
        <span aria-current="page">
          <small>{index + 1} / 4</small>
          {stages[index]?.label}
        </span>
        <Link
          to={next.to}
          search={next.search}
          aria-label={(uk ? "До розділу: " : "Next: ") + next.label}
        >
          <ArrowRight size={21} />
        </Link>
      </nav>
    </header>
  );
}
