import { useEffect, useState } from "react";
import type { Expert } from "@/lib/types";
import { personStatuses, researchFindings } from "@/lib/network-experience";

export function NetworkProfile({
  expert: e,
  uk,
  full,
  onFull,
  shortlisted,
  onToggle,
  onGroup,
  onConnections,
  ready,
  replayResearch,
  highlight,
}: {
  expert: Expert;
  uk: boolean;
  full: boolean;
  onFull: (full: boolean) => void;
  shortlisted: boolean;
  onToggle: () => void;
  onGroup: () => void;
  onConnections: () => void;
  ready: boolean;
  replayResearch?: "request" | "findings" | undefined;
  highlight?: string | undefined;
}) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [research, setResearch] = useState<"idle" | "request" | "findings">("idle");
  useEffect(() => setResearch("idle"), [e.code]);
  useEffect(() => {
    if (research !== "request" || replayResearch) return;
    const timer = window.setTimeout(() => setResearch("findings"), 2800);
    return () => window.clearTimeout(timer);
  }, [research, replayResearch]);
  const phase = replayResearch ?? research;
  const findings = researchFindings(e);
  return (
    <>
      <div className="network-profile-toolbar">
        <button className="network-context-action" onClick={() => onFull(!full)}>
          {full ? t("Mini dossier", "Міні-досьє") : t("Full dossier", "Повне досьє")}
        </button>
        <button className="network-context-action" onClick={onGroup}>
          {t("Your shortlist", "Ваш відбір")}
        </button>
      </div>
      <h2>{e.displayName}</h2>
      {e.organization && (
        <p>
          {e.role} · {e.organization}
        </p>
      )}
      <section
        data-profile-field="expertise"
        className={highlight === "expertise" ? "is-coached-field" : ""}
      >
        {full && <h3>{t("Expertise", "Експертиза")}</h3>}
        <p>{e.primaryExpertise}</p>
        <p>
          {e.sector} · {e.country}
        </p>
      </section>
      <details className="network-record-statuses" open>
        <summary>{t("Recorded statuses and assessments", "Зафіксовані статуси й оцінки")}</summary>
        <dl>
          {personStatuses(e, uk).map((s) => (
            <div key={s.id}>
              <dt>{s.label}</dt>
              <dd data-recorded={s.recorded}>{s.value}</dd>
            </div>
          ))}
        </dl>
        <small>
          {t(
            "Source-record confirmation does not constitute a recommendation or accreditation.",
            "Підтвердження запису у джерелі не є рекомендацією чи акредитацією.",
          )}
        </small>
      </details>
      {full && (
        <>
          <section
            data-profile-field="evidence"
            className={highlight === "evidence" ? "is-coached-field" : ""}
          >
            <h3>{t("Evidence and source", "Доказова база й джерело")}</h3>
            <p>
              {e.evidence ||
                t("Not supplied at this access level", "Не надано для цього рівня доступу")}
            </p>
            {e.source && (
              <a href={e.source} target="_blank" rel="noreferrer">
                {t("Open supplied source", "Відкрити надане джерело")}
              </a>
            )}
            <dl>
              <dt>{t("Confidence · source field", "Впевненість · вихідне поле")}</dt>
              <dd>{e.confidence || t("Not supplied", "Не надано")}</dd>
              <dt>{t("Engagement stage · source field", "Етап взаємодії · вихідне поле")}</dt>
              <dd>{e.crmStage || t("Not supplied", "Не надано")}</dd>
            </dl>
          </section>
          {[
            [t("Ukraine-related experience", "Досвід, пов’язаний з Україною"), e.ukraineTheme],
            [t("Case theme", "Тема кейсу"), e.caseTheme],
            [t("International relevance", "Міжнародна релевантність"), e.internationalRelevance],
            [t("Potential contribution", "Можливий внесок"), e.contribution],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <section key={label}>
                <h3>{label}</h3>
                <p>{value}</p>
              </section>
            ))}
        </>
      )}
      {full && (e.linkedin || e.phone) && (
        <section>
          <h3>{t("Available contact details", "Доступні контактні дані")}</h3>
          {e.linkedin && (
            <a href={e.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {e.phone && <p>{e.phone}</p>}
        </section>
      )}
      <section className="network-research-preview" aria-live="polite">
        <button
          className="network-context-action"
          onClick={() => setResearch("request")}
          disabled={phase === "request" || !!replayResearch}
        >
          {t("Preview AI OSINT research", "Переглянути дослідження AI OSINT")}
        </button>
        <small>
          {t(
            "Process demonstration. AI OSINT awaits connection; no external search or new verification is performed.",
            "Демонстрація процесу. AI OSINT очікує підключення; зовнішній пошук і нова перевірка не проводяться.",
          )}
        </small>
        {phase === "request" && (
          <p role="status">
            {t(
              "Preparing an example request → reading accessible supplied fields → preparing for professional review…",
              "Підготовка прикладу запиту → читання доступних полів запису → підготовка до перевірки фахівцем…",
            )}
          </p>
        )}
        {phase === "findings" && (
          <div>
            <h3>{t("Found in the supplied record", "Знайдено в переданому записі")}</h3>
            {findings.map((f) => (
              <p key={f.id}>
                <strong>{uk ? f.uk : f.en}</strong>
                <br />
                <mark>{f.value}</mark>
              </p>
            ))}
            <small>
              {t(
                "These fields have not been newly obtained or independently verified. No source record has been overwritten.",
                "Ці поля не отримано заново й не перевірено незалежно. Вихідний запис не перезаписано.",
              )}
            </small>
          </div>
        )}
      </section>
      <button
        className="network-folder-button"
        data-guide-target="save"
        disabled={!ready}
        onClick={onToggle}
      >
        {shortlisted
          ? t("In your shortlist · remove", "У відборі · прибрати")
          : t("Add to shortlist", "Додати до відбору")}
      </button>
      <button className="network-context-action" onClick={onConnections}>
        {t("Explore this person’s connections", "Дослідити зв’язки цієї персони")}
      </button>
    </>
  );
}
