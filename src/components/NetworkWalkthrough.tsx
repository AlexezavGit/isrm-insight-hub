import { placeCoach, type HighlightRect } from "@/lib/walkthrough-placement";
import { useEffect, useRef, useState, type RefObject, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, X, ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { SEARCH_REPLAY, CONFIGURATION_REPLAY, type Experience } from "@/lib/network-experience";

export interface WalkthroughState {
  kind: Experience;
  index: number;
  playing: boolean;
}
export function NetworkWalkthrough({
  state,
  host,
  experience,
  onStart,
  onChange,
  onClose,
  onTakeOver,
  uk,
  available,
}: {
  state: WalkthroughState | null;
  host: RefObject<HTMLElement | null>;
  experience: Experience;
  onStart: () => void;
  onChange: (state: WalkthroughState) => void;
  onClose: () => void;
  onTakeOver: () => void;
  uk: boolean;
  available: boolean;
}) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [details, setDetails] = useState(false);
  const [invite, setInvite] = useState(false);
  const [spot, setSpot] = useState<HighlightRect | null>(null);
  const [position, setPosition] = useState({ x: 12, y: 12 });
  const coach = useRef<HTMLElement>(null);
  const replayKind = state?.kind,
    replayIndex = state?.index;
  useEffect(() => {
    if (!replayKind || replayIndex === undefined) {
      setSpot(null);
      return;
    }
    const id = (replayKind === "configuration" ? CONFIGURATION_REPLAY : SEARCH_REPLAY)[replayIndex]
      ?.id;
    const selectors: Record<string, string> = {
      country: '[data-filter-field="country"]',
      sector: '[data-filter-field="sector"]',
      expertise: '[data-filter-field="expertise"]',
      mini: ".network-profile-toolbar",
      status: ".network-record-statuses",
      "full-expertise": '[data-profile-field="expertise"]',
      "full-evidence": '[data-profile-field="evidence"]',
      request: ".network-research-preview",
      findings: ".network-research-preview",
      first: ".network-shortlist-panel header",
      connections: "[data-coach-node]",
      second: ".network-profile-toolbar",
      result:
        replayKind === "configuration"
          ? ".network-example-proposal"
          : ".network-shortlist-panel header",
      core: '.network-capability-tree [data-service-id="search"]',
      service: ".network-service-description",
      workflow: ".network-workflow-hint",
      tailor: ".network-add-request",
      intro: replayKind === "configuration" ? ".network-capability-tree" : "[data-coach-node]",
    };
    const measure = () => {
      const target = host.current?.querySelector<HTMLElement>(
        selectors[id || ""] || ".network-canvas",
      );
      const rect = target?.getBoundingClientRect();
      const visible =
        rect &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight;
      const next = visible
        ? {
            x: Math.max(4, rect.left - 6),
            y: Math.max(4, rect.top - 6),
            width: Math.min(rect.width + 12, window.innerWidth - 8),
            height: Math.min(rect.height + 12, window.innerHeight - 8),
          }
        : null;
      setSpot((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
      const width = coach.current?.offsetWidth || Math.min(330, window.innerWidth - 24),
        height = coach.current?.offsetHeight || 146;
      const rail = host.current?.querySelector(".network-bottom-rail")?.getBoundingClientRect();
      const canvas = host.current?.querySelector(".network-canvas")?.getBoundingClientRect();
      let location = placeCoach(
        window.innerWidth,
        (rail?.top ?? window.innerHeight) - 6,
        next,
        width,
        height,
      );
      if (canvas && canvas.width >= width + 16) {
        const candidate = { x: canvas.left + 8, y: Math.max(8, canvas.bottom - height - 8) };
        if (
          !next ||
          candidate.x + width < next.x ||
          candidate.x > next.x + next.width ||
          candidate.y + height < next.y ||
          candidate.y > next.y + next.height
        )
          location = candidate;
      }
      setPosition((current) =>
        current.x === location.x && current.y === location.y ? current : location,
      );
    };
    const target = host.current?.querySelector<HTMLElement>(
      selectors[id || ""] || ".network-canvas",
    );
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });
    measure();
    const timer = window.setInterval(measure, 180);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", measure);
    };
  }, [replayIndex, replayKind, host, details]);
  const trigger = useRef<HTMLButtonElement>(null);
  const steps = state?.kind === "configuration" ? CONFIGURATION_REPLAY : SEARCH_REPLAY;
  const current = state ? steps[state.index] : null;
  useEffect(() => {
    try {
      setInvite(localStorage.getItem("isrm-replay-seen-v2") !== "1");
    } catch {
      setInvite(true);
    }
  }, []);
  const dismiss = () => {
    try {
      localStorage.setItem("isrm-replay-seen-v2", "1");
    } catch {
      /* Optional help preference. */
    }
    setInvite(false);
    onClose();
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!state) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [state, onClose]);
  const portal = (node: ReactNode) => createPortal(node, host.current ?? document.body);
  return (
    <>
      <button
        ref={trigger}
        className="network-survey-link"
        onClick={() => {
          setInvite(false);
          onStart();
        }}
      >
        <Play size={13} aria-hidden="true" />
        {experience === "configuration"
          ? t("Watch the configurator", "Переглянути конфігуратор")
          : t("Watch the search cycle", "Переглянути цикл пошуку")}
      </button>
      {invite &&
        !state &&
        portal(
          <div className="network-replay-invite">
            <button
              onClick={() => {
                setInvite(false);
                onStart();
              }}
            >
              {t("First visit? Watch a complete example", "Вперше тут? Подивіться повний приклад")}
            </button>
            <button onClick={dismiss} aria-label={t("Dismiss invitation", "Закрити запрошення")}>
              <X size={15} />
            </button>
          </div>,
        )}
      {state &&
        current &&
        portal(
          <>
            {spot && (
              <svg className="network-replay-dimmer" aria-hidden="true">
                <defs>
                  <mask id="network-replay-spotlight">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={spot.x}
                      y={spot.y}
                      width={spot.width}
                      height={spot.height}
                      rx="10"
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="#020e18"
                  fillOpacity=".66"
                  mask="url(#network-replay-spotlight)"
                />
                <rect
                  x={spot.x}
                  y={spot.y}
                  width={spot.width}
                  height={spot.height}
                  rx="10"
                  fill="none"
                  stroke="#e4c777"
                  strokeWidth="2"
                />
              </svg>
            )}
            <aside
              ref={coach}
              style={{ left: position.x, top: position.y }}
              className={`network-replay-coach ${details ? "is-expanded" : ""}`}
              aria-label={t("Guided demonstration", "Демонстрація з поясненнями")}
            >
              <div className="network-replay-copy" aria-live={state.playing ? "off" : "polite"}>
                <small>
                  {state.kind === "configuration"
                    ? t("Configuration example", "Приклад конфігурації")
                    : t("Search example", "Приклад пошуку")}{" "}
                  · {state.index + 1}/{steps.length}
                </small>
                <strong>{uk ? current.uk : current.en}</strong>
                <p>{uk ? current.textUk : current.textEn}</p>
                {details && state.kind === "prototype" && !available && (
                  <p>
                    {t(
                      "No accessible profiles are available. The demonstration will not invent results.",
                      "Доступних профілів немає. Демонстрація не вигадуватиме результати.",
                    )}
                  </p>
                )}
              </div>
              <div className="network-replay-controls">
                <button
                  aria-label={t("Previous step", "Попередній крок")}
                  disabled={state.index === 0}
                  onClick={() => onChange({ ...state, index: state.index - 1, playing: false })}
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  aria-label={
                    state.playing
                      ? t("Pause demonstration", "Призупинити демонстрацію")
                      : t("Play demonstration", "Відтворити демонстрацію")
                  }
                  onClick={() => onChange({ ...state, playing: !state.playing })}
                >
                  {state.playing ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button
                  aria-label={t("Next step", "Наступний крок")}
                  disabled={state.index === steps.length - 1}
                  onClick={() => onChange({ ...state, index: state.index + 1, playing: false })}
                >
                  <ChevronRight size={17} />
                </button>
                <button
                  onClick={onTakeOver}
                  aria-label={t("Take over", "Керувати самому")}
                  title={t("Take over", "Керувати самому")}
                >
                  <Hand size={16} />
                </button>
                <button
                  onClick={() => setDetails(!details)}
                  aria-expanded={details}
                  aria-label={t("Show full explanation", "Повне пояснення")}
                  title={t("Show full explanation", "Повне пояснення")}
                >
                  {t("About", "Про показ")}
                </button>
                <button
                  onClick={dismiss}
                  aria-label={t(
                    "Close example and restore your work",
                    "Закрити приклад і повернути свою роботу",
                  )}
                >
                  <X size={17} />
                </button>
              </div>
              {details && (
                <p className="network-replay-disclaimer">
                  {t(
                    "The example runs in a temporary workspace. No messages are sent, no external AI query is made, and your saved group and proposal choices stay unchanged. Take over explicitly keeps the displayed selection.",
                    "Приклад працює в тимчасовому просторі. Повідомлення не надсилаються, зовнішній AI-запит не виконується, збережена група й позиції пропозиції не змінюються. «Керувати самому» явно залишає показаний відбір.",
                  )}
                </p>
              )}
            </aside>
          </>,
        )}
    </>
  );
}
