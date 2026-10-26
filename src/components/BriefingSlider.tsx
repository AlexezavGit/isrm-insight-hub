import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAccess } from "@/lib/access";
import { ClientAccessibility } from "./ClientAccessibility";
import { AccessControl } from "./AppShell";
import { BriefingVisual } from "./BriefingVisual";
import { BRIEFING_SLIDES } from "@/lib/briefing-slides";
import { BriefingNetworkBackdrop } from "./BriefingNetworkBackdrop";
import { DataUseNotice } from "./DataUseNotice";
export function BriefingSlider() {
  const { locale } = useI18n();
  const uk = locale === "uk";
  const [slide, setSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const content = useRef<HTMLDivElement>(null);
  const { data } = useAccess();
  const current = BRIEFING_SLIDES[slide]!;
  useEffect(() => {
    setMounted(true);
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
  }, [slide]);
  return (
    <main className="client-briefing">
      <div className="client-briefing-graph" aria-hidden="true">
        {mounted && (
          <BriefingNetworkBackdrop
            experts={data?.experts ?? []}
            slide={slide}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
      <header className="client-topbar">
        <Link to="/proposal" className="client-wordmark">
          ISRM <span>INSIGHT HUB</span>
        </Link>
        <div className="client-topbar-actions">
          <ClientAccessibility />
          <AccessControl />
        </div>
      </header>
      <section
        className="client-slide-surface"
        aria-roledescription={uk ? "Презентація" : "carousel"}
        aria-label={
          uk
            ? "Відповідь Девіду Рубенсу та правлінню ISRM"
            : "A response to David Rubens and the ISRM Strategic Board"
        }
        onKeyDown={(e) => {
          if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable=true]"))
            return;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            setSlide((s) => Math.min(BRIEFING_SLIDES.length - 1, s + 1));
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setSlide((s) => Math.max(0, s - 1));
          }
        }}
      >
        <header className="client-slide-topline">
          <div>
            <p className="client-eyebrow">{current.label[locale]}</p>
            <h1 id="briefing-title" aria-live="polite">
              {current.title[locale]}
            </h1>
          </div>
          <span aria-label={uk ? "Поточний слайд" : "Current slide"}>
            {String(slide + 1).padStart(2, "0")}
            <i />
            06
          </span>
        </header>
        <div
          className="client-slide-content"
          ref={content}
          tabIndex={0}
          role="region"
          aria-labelledby="briefing-title"
        >
          <div className="briefing-copy" aria-live="polite" aria-atomic="true">
            {current.projectName && (
              <p className="briefing-project-name">{current.projectName[locale]}</p>
            )}
            <p className="client-slide-body">{current.body[locale]}</p>
            <p className="briefing-principle">{current.principle[locale]}</p>
            <p className="client-slide-note">{current.note[locale]}</p>
          </div>
          <BriefingVisual index={slide} slide={current} locale={locale} />
        </div>
        <footer className="client-slide-footer">
          <div className="client-slide-navigation">
            <button
              className="client-icon-button"
              disabled={slide === 0}
              onClick={() => setSlide((s) => s - 1)}
              aria-label={uk ? "Попередній слайд" : "Previous slide"}
            >
              <ArrowLeft />
            </button>
            <div className="client-slide-dots">
              {BRIEFING_SLIDES.map((s, i) => (
                <button
                  key={s.label.en}
                  aria-label={`${uk ? "Слайд" : "Slide"} ${i + 1}`}
                  aria-current={slide === i ? "step" : undefined}
                  onClick={() => setSlide(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="client-icon-button"
              disabled={slide === BRIEFING_SLIDES.length - 1}
              onClick={() => setSlide((s) => s + 1)}
              aria-label={uk ? "Наступний слайд" : "Next slide"}
            >
              <ArrowRight />
            </button>
          </div>
          <div className="client-inline-actions">
            <Link to="/scope" className="client-text-button">
              {uk ? "Обсяг і бюджет" : "Scope & budget"}
            </Link>
            <Link to="/" search={{ view: "map" }} className="client-button">
              {uk ? "Дослідити інструмент" : "Explore the tool"}
              <ArrowRight size={18} />
            </Link>
          </div>
        </footer>
      </section>
      <div className="client-backdrop-caption">
        <p>
          {uk
            ? "Брифінг для обговорення · Передана вибірка · Тематичні зв’язки"
            : "Executive discussion · Supplied sample · Thematic relationships"}
        </p>
        <DataUseNotice />
      </div>
    </main>
  );
}
