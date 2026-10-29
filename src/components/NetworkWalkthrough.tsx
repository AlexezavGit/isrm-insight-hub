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
          <aside
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
                <span>{state.playing ? t("Pause", "Пауза") : t("Play", "Відтворити")}</span>
              </button>
              <button
                aria-label={t("Next step", "Наступний крок")}
                disabled={state.index === steps.length - 1}
                onClick={() => onChange({ ...state, index: state.index + 1, playing: false })}
              >
                <ChevronRight size={17} />
              </button>
              <button onClick={onTakeOver}>
                <Hand size={16} />
                {t("Take over", "Керувати самому")}
              </button>
              <button onClick={() => setDetails(!details)} aria-expanded={details}>
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
          </aside>,
        )}
    </>
  );
}
