import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, X } from "lucide-react";
import { GUIDE_STEPS, GUIDE_STORAGE_KEY, guideNext } from "@/lib/network-guide";

export function NetworkGuide({
  step,
  onStep,
  uk,
  profileAvailable,
  profileShortlisted,
}: {
  step: number | null;
  onStep: (step: number | null) => void;
  uk: boolean;
  profileAvailable: boolean;
  profileShortlisted: boolean;
}) {
  const [invite, setInvite] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const t = (en: string, ua: string) => (uk ? ua : en);
  useEffect(() => {
    try {
      setInvite(!localStorage.getItem(GUIDE_STORAGE_KEY));
    } catch {
      setInvite(true);
    }
  }, []);
  const finish = () => {
    try {
      localStorage.setItem(GUIDE_STORAGE_KEY, "seen");
    } catch {
      /* Replay still works without storage. */
    }
    setInvite(false);
    onStep(null);
    trigger.current?.focus();
  };
  useEffect(() => {
    if (step !== null) heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (step === null) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      try {
        localStorage.setItem(GUIDE_STORAGE_KEY, "seen");
      } catch {
        /* Optional browser preference. */
      }
      setInvite(false);
      onStep(null);
      trigger.current?.focus();
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [step, onStep]);
  const current = step === null ? null : GUIDE_STEPS[step];
  return (
    <>
      <button
        ref={trigger}
        className="network-survey-link network-guide-trigger"
        onClick={() => onStep(0)}
      >
        <HelpCircle size={15} aria-hidden="true" /> {t("Guide", "Як користуватися")}
      </button>
      {invite &&
        step === null &&
        createPortal(
          <div className="network-guide-invite">
            <button onClick={() => onStep(0)}>
              {t(
                "New here? Find expertise in five steps",
                "Вперше тут? Знайдіть експертизу за п’ять кроків",
              )}
            </button>
            <button onClick={finish} aria-label={t("Dismiss invitation", "Закрити запрошення")}>
              <X size={16} />
            </button>
          </div>,
          document.body,
        )}
      {current &&
        step !== null &&
        createPortal(
          <section
            className={`network-guide-card ${step === 2 || step === 3 ? "is-profile-step" : ""}`}
            role="region"
            aria-labelledby="network-guide-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                finish();
              }
            }}
          >
            <div className="network-guide-progress">
              <span>
                {t("A first useful result", "Перший корисний результат")} · {step + 1} /{" "}
                {GUIDE_STEPS.length}
              </span>
              <button onClick={finish}>{t("Skip", "Пропустити")}</button>
            </div>
            <h2 ref={heading} tabIndex={-1} id="network-guide-title">
              {current.title[uk ? "uk" : "en"]}
            </h2>
            <p>{current.body[uk ? "uk" : "en"]}</p>
            {step === 1 && !profileAvailable && (
              <p role="status">
                {t(
                  "No profiles match. Go back and broaden your search.",
                  "Профілів не знайдено. Поверніться й розширте пошук.",
                )}
              </p>
            )}
            {step === 3 && !profileShortlisted && (
              <p className="network-guide-task">
                {t(
                  "Add a profile to continue, or skip the guide.",
                  "Додайте профіль для продовження або пропустіть підказки.",
                )}
              </p>
            )}
            <nav aria-label={t("Guide steps", "Кроки підказок")}>
              <button disabled={step === 0} onClick={() => onStep(step - 1)}>
                {t("Back", "Назад")}
              </button>
              <button
                disabled={guideNext(step, profileAvailable, profileShortlisted) === step}
                onClick={() => {
                  const next = guideNext(step, profileAvailable, profileShortlisted);
                  if (next === null) finish();
                  else onStep(next);
                }}
              >
                {step === 4
                  ? t("Finish", "Завершити")
                  : step === 1
                    ? t("Review a sample profile", "Переглянути профіль вибірки")
                    : step === 3
                      ? t("Review shortlist", "Переглянути відбір")
                      : t("Next", "Далі")}
              </button>
            </nav>
          </section>,
          document.body,
        )}
    </>
  );
}
