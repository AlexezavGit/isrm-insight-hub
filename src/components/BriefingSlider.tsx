import { PresentationFeedback } from "./PresentationFeedback";
import { ClientHeader } from "./ClientHeader";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronsLeft, Pause, Play, Printer } from "lucide-react";
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
  // The owner has explicitly requested motion for this demonstration. Pause is always available.
  const [motionEnabled, setMotionEnabled] = useState(true);
  const reducedMotion = !motionEnabled;
  const content = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastSlide = slide === BRIEFING_SLIDES.length - 1;
  const { data } = useAccess();
  const current = BRIEFING_SLIDES[slide]!;
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
  }, [slide]);
  return (
    <main
      className={`client-briefing is-eight-slide-deck ${motionEnabled ? "is-motion-enabled" : "is-motion-paused"}`}
    >
      <div className="client-briefing-graph" aria-hidden="true">
        {mounted && (
          <BriefingNetworkBackdrop
            key={`${slide}:${data?.experts.length ?? 0}`}
            experts={data?.experts ?? []}
            slide={slide}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
      <ClientHeader
        generalPresentation
        signIn={false}
        motionControl={
          <button
            className="client-motion-toggle"
            aria-pressed={motionEnabled}
            aria-label={
              motionEnabled
                ? uk
                  ? "Призупинити анімацію"
                  : "Pause animation"
                : uk
                  ? "Увімкнути анімацію"
                  : "Play animation"
            }
            title={
              motionEnabled
                ? uk
                  ? "Призупинити анімацію"
                  : "Pause animation"
                : uk
                  ? "Увімкнути анімацію"
                  : "Play animation"
            }
            onClick={() => setMotionEnabled((value) => !value)}
          >
            {motionEnabled ? <Pause size={16} /> : <Play size={16} />}
          </button>
        }
      />
      <section
        className="client-slide-surface is-reading-slide"
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
            ? "Презентація роботи з професійною експертизою"
            : "Expertise and professional networks presentation"
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
              {String(BRIEFING_SLIDES.length).padStart(2, "0")}
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
          <BriefingVisual key={slide} index={slide} experts={data?.experts ?? []} locale={locale} />
          <div className="briefing-copy" aria-live="polite" aria-atomic="true">
            <p className="client-slide-body">{current.body[locale]}</p>
            {current.note[locale] && (
              <p className="briefing-boundary-note">{current.note[locale]}</p>
            )}
            {(slide === 4 || lastSlide) && (
              <a
                className="briefing-slide-action"
                href={
                  lastSlide
                    ? "/?view=map&sample=expertise&practice=search"
                    : "/?stage=configuration"
                }
              >
                {lastSlide
                  ? uk
                    ? "Спробувати демонстрацію"
                    : "Try the demonstration"
                  : uk
                    ? "Оглянути конфігуратор"
                    : "Explore the configurator"}
              </a>
            )}
            {lastSlide && <PresentationFeedback uk={uk} />}
          </div>
        </div>
        <footer className="client-slide-footer">
          <div className="client-slide-navigation">
            <button
              type="button"
              className="client-icon-button"
              disabled={slide === 0}
              onClick={() => setSlide((s) => (s === BRIEFING_SLIDES.length - 1 ? 0 : s - 1))}
              aria-label={
                lastSlide
                  ? uk
                    ? "На початок"
                    : "Back to start"
                  : uk
                    ? "Попередній слайд"
                    : "Previous slide"
              }
            >
              {lastSlide ? <ChevronsLeft /> : <ArrowLeft />}
            </button>
            <div className="client-slide-dots">
              {BRIEFING_SLIDES.map((s, i) => (
                <button
                  key={s.label.en}
                  type="button"
                  aria-label={`${uk ? "Слайд" : "Slide"} ${i + 1}`}
                  aria-current={slide === i ? "step" : undefined}
                  onClick={() => setSlide(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="client-icon-button"
              onClick={() => (lastSlide ? window.print() : setSlide((s) => s + 1))}
              aria-label={
                lastSlide
                  ? uk
                    ? "Друкувати презентацію"
                    : "Print presentation"
                  : uk
                    ? "Наступний слайд"
                    : "Next slide"
              }
            >
              {lastSlide ? <Printer /> : <ArrowRight />}
            </button>
          </div>
        </footer>
      </section>
      <section
        className="client-print-summary briefing-print-summary"
        aria-label={uk ? "Версія презентації для друку" : "Printable presentation"}
      >
        {BRIEFING_SLIDES.map((item, index) => (
          <article key={item.label.en} className="briefing-print-slide">
            <p className="briefing-print-kicker">
              INSIGHT HUB · {String(index + 1).padStart(2, "0")}
            </p>
            <h2>{item.title[locale]}</h2>
            <BriefingVisual index={index} experts={data?.experts ?? []} locale={locale} />
            <p>{item.body[locale]}</p>
            {item.note[locale] && <p className="briefing-print-note">{item.note[locale]}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}
