import { ClientHeader } from "./ClientHeader";
import { IsrmContextLinks } from "./IsrmContextLinks";
import { SLIDE_CONTEXT_KEYS } from "@/lib/isrm-context";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronsLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAccess } from "@/lib/access";
import { BriefingVisual } from "./BriefingVisual";
import { BRIEFING_SLIDES } from "@/lib/briefing-slides";
import { BriefingNetworkBackdrop } from "./BriefingNetworkBackdrop";
export function BriefingSlider() {
  const { locale } = useI18n();
  const uk = locale === "uk";
  const [slide, setSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const content = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastSlide = slide === BRIEFING_SLIDES.length - 1;
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
      <ClientHeader signIn={false} />
      <section
        className={`client-slide-surface ${lastSlide ? "is-final-slide" : "is-reading-slide"}`}
        onTouchStart={(e) => {
          swipeStart.current = null;
          if (
            e.touches.length !== 1 ||
            (e.target as HTMLElement).closest(
              "a, button, input, textarea, select, summary, details, [contenteditable=true]",
            )
          )
            return;
          const touch = e.touches[0]!;
          swipeStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
        }}
        onTouchCancel={() => {
          swipeStart.current = null;
        }}
        onTouchEnd={(e) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start || e.touches.length || e.changedTouches.length !== 1) return;
          const end = e.changedTouches[0]!,
            dx = end.clientX - start.x,
            dy = end.clientY - start.y;
          if (
            Math.abs(dx) < 48 ||
            Math.abs(dx) < Math.abs(dy) * 1.4 ||
            Date.now() - start.time > 1000
          )
            return;
          setSlide((s) => Math.max(0, Math.min(BRIEFING_SLIDES.length - 1, s + (dx < 0 ? 1 : -1))));
        }}
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
            <h1 id="briefing-title" aria-live="polite">
              {current.title[locale]}
            </h1>
          </div>
          <aside className="client-title-meta">
            <p className="client-eyebrow">{current.label[locale]}</p>
            <span aria-label={uk ? "Поточний слайд" : "Current slide"}>
              {String(slide + 1).padStart(2, "0")}
              <i />
              06
            </span>
          </aside>
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
            <p className="briefing-key-context">{current.insight[locale]}</p>
            <p className="briefing-principle">{current.principle[locale]}</p>
            {SLIDE_CONTEXT_KEYS[slide] && (
              <IsrmContextLinks context={SLIDE_CONTEXT_KEYS[slide]!} locale={locale} compact />
            )}
          </div>
          <BriefingVisual
            index={slide}
            slide={current}
            locale={locale}
            reducedMotion={reducedMotion}
          />
        </div>
        <footer className="client-slide-footer">
          {!lastSlide && (
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
                onClick={() => setSlide((s) => s + 1)}
                aria-label={uk ? "Наступний слайд" : "Next slide"}
              >
                <ArrowRight />
              </button>
            </div>
          )}
          {lastSlide && (
            <div className="client-inline-actions briefing-final-actions">
              <Link
                to="/"
                search={{ view: "map" }}
                className="client-button briefing-final-action briefing-explore-action"
              >
                {uk ? "Спробувати застосунок" : "Try the application"}
              </Link>
              <Link to="/scope" className="client-button briefing-final-action">
                {uk ? "Обсяг і бюджет" : "Scope & budget"}
              </Link>
              <button
                type="button"
                className="client-button briefing-final-action briefing-rewind"
                aria-label={uk ? "Повернутися на початок" : "Rewind to the beginning"}
                title={uk ? "На початок" : "Rewind"}
                onClick={() => setSlide(0)}
              >
                <ChevronsLeft aria-hidden="true" />
              </button>
            </div>
          )}
        </footer>
      </section>
    </main>
  );
}
