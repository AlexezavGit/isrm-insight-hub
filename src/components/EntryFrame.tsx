import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EntryFrameProps {
  locale: "en" | "uk";
}

const copy = {
  en: {
    heading: "See the expert network in action",
    subheading:
      "The network graph is live. Use it to search for expertise, review profiles, and see which capabilities your association can activate.",
    cta: "Open the expert network →",
    ariaLabel: "Next step: open the expert network",
  },
  uk: {
    heading: "Подивіться на мережу експертів у дії",
    subheading:
      "Граф мережі — живий. Використовуйте його для пошуку експертизи, перегляду профілів і визначення можливостей асоціації.",
    cta: "Відкрити мережу експертів →",
    ariaLabel: "Наступний крок: відкрити мережу експертів",
  },
} as const;

export function EntryFrame({ locale }: EntryFrameProps) {
  const frameRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fallback: if IntersectionObserver is unavailable (SSR or old browser),
    // show immediately without animation — Requirement 1.4
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          // Stop observing once visible — animation plays once
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    if (frameRef.current) {
      observer.observe(frameRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const t = copy[locale];

  return (
    <section
      ref={frameRef}
      className={[
        "entry-frame",
        visible ? "is-visible opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        visible ? "transition-[opacity,transform] duration-[600ms]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={t.ariaLabel}
    >
      <span className="entry-frame-eyebrow">
        {locale === "uk" ? "Наступний крок" : "Next step"}
      </span>
      <h2>{t.heading}</h2>
      <p>{t.subheading}</p>
      <Button asChild size="lg" className="entry-frame-cta">
        <Link to="/" search={{ panel: "search" }}>
          {t.cta}
          <ArrowRight aria-hidden="true" className="ml-1" />
        </Link>
      </Button>
    </section>
  );
}
