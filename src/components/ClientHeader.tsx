import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClientAccessibility } from "./ClientAccessibility";
import { AccessControl } from "./AppShell";
export function ClientHeader({
  signIn = true,
  hideOnScroll = false,
}: {
  signIn?: boolean;
  hideOnScroll?: boolean;
}) {
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
      <Link to="/proposal" className="client-wordmark">
        ISRM <span>INSIGHT HUB</span>
      </Link>
      <div className="client-topbar-actions">
        <ClientAccessibility />
        <AccessControl showSignIn={signIn} />
      </div>
    </header>
  );
}
