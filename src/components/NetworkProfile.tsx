import { useEffect, useState } from "react";
import type { Expert } from "@/lib/types";
import { personStatuses, researchFindings } from "@/lib/network-experience";
import { Link } from "@tanstack/react-router";
import {
  PROFILE_WORK_EVENT,
  WORKING_REVIEW_STATES,
  readProfileNotes,
  readWorkingStatus,
  writeProfileNote,
  writeWorkingStatus,
  type WorkingReviewState,
} from "@/lib/profile-work";
import type { ServiceId } from "@/lib/client-catalog";

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
  example = false,
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
  example?: boolean;
}) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [note, setNote] = useState("");
  const [workingStatus, setWorkingStatus] = useState<WorkingReviewState>("none");
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const load = () => {
      try {
        setNote(example ? "" : readProfileNotes(localStorage)[e.code] || "");
        setWorkingStatus(example ? "none" : readWorkingStatus(localStorage, e.code));
        setStorageError(false);
      } catch {
        setNote("");
        setWorkingStatus("none");
        setStorageError(true);
      }
    };
    load();
    window.addEventListener(PROFILE_WORK_EVENT, load);
    return () => window.removeEventListener(PROFILE_WORK_EVENT, load);
  }, [e.code, example]);
  const phase = replayResearch ?? "idle";
  const findings = researchFindings(e);
  const configurationAction = (id: ServiceId, en: string, ua: string) => (
    <Link
      className="network-context-action"
      to="/"
      search={{ view: "map", stage: "configuration", capability: id }}
    >
      {t(en, ua)}
    </Link>
  );
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
      <small className="network-profile-code">{e.code}</small>
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
      <details className="network-record-statuses" open={full || undefined}>
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
            [t("Recorded expertise tags", "Записані напрями експертизи"), e.tags?.join("; ")],
            [t("Potential role · source field", "Можлива роль · вихідне поле"), e.potentialRole],
            [t("Priority · source field", "Пріоритет · вихідне поле"), e.priority],
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
      {full && (
        <section className="network-profile-work">
          <h3>{t("Your working record", "Ваша робота з профілем")}</h3>
          <label>
            {t("Working review mark", "Робоча позначка перегляду")}
            <select
              value={workingStatus}
              disabled={example || !ready}
              onChange={(event) => {
                const status = event.target.value as WorkingReviewState;
                setWorkingStatus(status);
                try {
                  writeWorkingStatus(localStorage, e.code, status);
                  setStorageError(false);
                } catch {
                  setStorageError(true);
                }
              }}
            >
              {WORKING_REVIEW_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {uk ? s.uk : s.en}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Your notes and next action", "Ваші нотатки й наступна дія")}
            <textarea
              rows={5}
              value={note}
              disabled={example || !ready}
              onChange={(event) => {
                const value = event.target.value;
                setNote(value);
                try {
                  writeProfileNote(localStorage, e.code, value);
                  setStorageError(false);
                } catch {
                  setStorageError(true);
                }
              }}
            />
          </label>
          <small>
            {t(
              "Personal working notes in this browser, not a change to the source record or a verification decision.",
              "Особисті робочі нотатки в цьому браузері. Вони не змінюють вихідний запис і не є рішенням щодо верифікації.",
            )}
          </small>
          {storageError && (
            <p role="alert">
              {t(
                "The change is visible in this panel but could not be saved in this browser.",
                "Зміну видно в панелі, але зберегти її в браузері не вдалося.",
              )}
            </p>
          )}
          <h3>
            {t(
              "Further actions · agree the capability",
              "Подальші дії · погодити функціональність",
            )}
          </h3>
          {configurationAction(
            "research",
            "Request research · configure connection",
            "Замовити дослідження · погодити підключення",
          )}
          {configurationAction(
            "review",
            "Arrange professional verification",
            "Погодити професійну перевірку",
          )}
          {configurationAction(
            "contact",
            "Request an introduction or recommendation",
            "Запросити знайомство чи рекомендацію",
          )}
          {configurationAction(
            "groups",
            "Move between named groups",
            "Переміщувати між іменованими групами",
          )}
          {configurationAction(
            "integration",
            "Manage Board, Chapter and member roles",
            "Керувати ролями правління, чаптерів і членів",
          )}
          {configurationAction(
            "evidence",
            "Update or correct the dossier",
            "Доповнювати чи виправляти досьє",
          )}
          <Link className="network-context-action" to="/scope" hash="scope-core-title">
            {t("Review scope and budget limits", "Погодити обсяг та бюджетні ліміти")}
          </Link>
          <small>
            {t(
              "These operations require an agreed service connection. Following a link does not send a request or perform a check.",
              "Ці операції потребують погодженого підключення сервісів. Перехід не надсилає запит і не виконує перевірку.",
            )}
          </small>
        </section>
      )}
      {(full || replayResearch) && (
        <section className="network-research-preview" aria-live="polite">
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
      )}
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
