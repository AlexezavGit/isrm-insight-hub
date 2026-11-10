import { useEffect, useState } from "react";
import {
  Bot,
  Users,
  BadgeCheck,
  Flag,
  FileCheck2,
  Lock,
  Info,
  Pencil,
  ChevronRight,
} from "lucide-react";
import type { Expert } from "@/lib/types";
import { readProfileNotes, writeProfileNote } from "@/lib/profile-work";
import { hasRecordedContent } from "@/lib/dossier-content";
import { recordedMember, recordedChapterHead } from "@/lib/workspace-map";
import { canonicalCountry } from "@/lib/network-reference";

export function WorkspacePerson({
  expert: e,
  uk,
  full,
  ready,
}: {
  expert: Expert;
  uk: boolean;
  full: boolean;
  ready: boolean;
}) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [request, setRequest] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setNote(readProfileNotes(localStorage)[e.code] ?? "");
    setRequest(null);
    setSaved(false);
    setError("");
  }, [e.code]);
  const unknown = t("No assessment supplied", "Оцінки не надано");
  const statuses = [
    {
      id: "source",
      icon: FileCheck2,
      label: t("Source-record confirmation", "Підтвердження у джерелі"),
      active: e.verified,
      detail: e.verified
        ? t(
            "The supplied record carries a confirmation flag. This is not self-confirmation or accreditation.",
            "У наданому записі є позначка підтвердження. Це не самопідтвердження чи акредитація.",
          )
        : t("No source confirmation flag supplied.", "Позначки підтвердження у джерелі немає."),
    },
    {
      id: "ai",
      icon: Bot,
      label: t("AI review", "Перевірка ШІ"),
      active: false,
      detail: t(
        "AI research is not connected. No AI review was performed here.",
        "ШІ-дослідження не підключено. Перевірка ШІ тут не проводилася.",
      ),
    },
    {
      id: "peer",
      icon: Users,
      label: t("Peer recommendations", "Рекомендації колег"),
      active: false,
      detail: unknown,
    },
    {
      id: "member",
      icon: BadgeCheck,
      label: t("Association membership", "Членство в асоціації"),
      active: recordedMember(e),
      detail: recordedMember(e)
        ? e.communityRole
        : t(
            "Membership is not established by the available fields. This does not mean non-membership.",
            "Доступні поля не підтверджують членства. Це не означає, що персона не є членом.",
          ),
    },
    {
      id: "chapter",
      icon: Flag,
      label: t("Chapter head", "Керівник чаптеру"),
      active: recordedChapterHead(e),
      detail: recordedChapterHead(e) ? e.communityRole : unknown,
    },
  ];
  return (
    <div className="workspace-person">
      <dl className="workspace-person-facts">
        <div>
          <dt>{t("Expertise", "Експертиза")}</dt>
          <dd>
            {hasRecordedContent(e.primaryExpertise)
              ? e.primaryExpertise
              : t("Not supplied", "Не вказано")}
          </dd>
        </div>
        <div>
          <dt>{t("Market sector", "Сектор ринку")}</dt>
          <dd>
            <span>{t("Needs clarification", "Потребує уточнення")}</span>
            <details className="workspace-inline-info">
              <summary
                aria-label={t("About the sector field", "Про поле сектора")}
                data-hint={t("View the source category", "Переглянути категорію джерела")}
              >
                <Info size={16} />
              </summary>
              <p>
                <Info size={15} /> {t("Source category: ", "Категорія джерела: ")}
                {e.sector}.{" "}
                {t(
                  "This classification mixes practice areas and organisation types; no market-sector mapping has been validated.",
                  "Ця класифікація змішує напрями практики й типи організацій; відповідність ринковим секторам не підтверджена.",
                )}
              </p>
            </details>
          </dd>
        </div>
        <div>
          <dt>{t("Country", "Країна")}</dt>
          <dd
            data-hint={t(
              "Phone-code country, not a verified working or residential location",
              "Країна телефонного коду, не перевірене місце роботи чи проживання",
            )}
          >
            {uk ? e.country : canonicalCountry(e.country)}
          </dd>
        </div>
        <div>
          <dt>{t("Company / organisation", "Компанія / організація")}</dt>
          <dd>
            {e.organization ||
              (e.organizationAvailability === "restricted" ? (
                <>
                  <Lock size={16} />
                  {t("Restricted", "Приховано")}
                </>
              ) : (
                t("Not supplied", "Не вказано")
              ))}
          </dd>
        </div>
      </dl>
      <div
        className="workspace-person-statuses"
        aria-label={t("Profile assessments", "Оцінки профілю")}
      >
        {statuses.map((s) => (
          <details key={s.id} className={s.active ? "is-recorded" : "is-unknown"}>
            <summary
              aria-label={s.label}
              data-hint={
                s.label +
                " · " +
                (s.active
                  ? t("Source flag present", "Є позначка джерела")
                  : t("Not established", "Не встановлено"))
              }
            >
              <s.icon size={22} />
              <span aria-hidden="true">{s.active ? "✓" : "?"}</span>
            </summary>
            <div>
              <strong>{s.label}</strong>
              <p>
                <Info size={15} /> {s.detail}
              </p>
              {s.id === "source" && full && hasRecordedContent(e.evidence) && <p>{e.evidence}</p>}
              {s.id === "source" && full && e.source && (
                <a href={e.source} target="_blank" rel="noreferrer">
                  {t("Open supplied source", "Відкрити надане джерело")}
                </a>
              )}
            </div>
          </details>
        ))}
      </div>
      {hasRecordedContent(e.ukraineTheme) && !/not assessed/i.test(e.ukraineTheme) && (
        <section className="workspace-local-experience">
          <h3>{t("Localised experience: Ukraine", "Локалізований досвід: Україна")}</h3>
          {full && e.caseTheme && <p>{e.caseTheme}</p>}
        </section>
      )}
      {full && (
        <div className="workspace-person-detail">
          {[
            [t("Experience", "Досвід"), e.ukraineTheme],
            [t("Evidence", "Доказова база"), e.evidence],
            [t("International relevance", "Міжнародна релевантність"), e.internationalRelevance],
            [t("Potential contribution", "Можливий внесок"), e.contribution],
          ]
            .filter(([, value]) => hasRecordedContent(value))
            .map(([label, value]) => (
              <section key={label}>
                <h3>{label}</h3>
                <p>{value}</p>
              </section>
            ))}
          {e.source && (
            <a href={e.source} target="_blank" rel="noreferrer">
              {t("Open supplied source", "Відкрити надане джерело")}
            </a>
          )}
        </div>
      )}
      <details className="workspace-person-notes" open={full || undefined}>
        <summary>{t("Notes", "Нотатки")}</summary>
        <label>
          <span className="sr-only">{t("Notes", "Нотатки")}</span>
          <textarea
            value={note}
            rows={3}
            disabled={!ready}
            placeholder={t("Add a note…", "Додайте нотатку…")}
            onChange={(event) => {
              setNote(event.target.value);
              try {
                writeProfileNote(localStorage, e.code, event.target.value);
                setError("");
              } catch {
                setError(
                  t(
                    "Your note could not be saved. Keep a copy before leaving.",
                    "Не вдалося зберегти нотатку. Збережіть копію перед виходом.",
                  ),
                );
              }
            }}
          />
        </label>
        <small>
          <Info size={14} />{" "}
          {t(
            "Saved only in this browser; source record is unchanged.",
            "Зберігається лише в цьому браузері; вихідний запис не змінюється.",
          )}
        </small>
      </details>
      <details className="workspace-person-requests" open>
        <summary>{t("Requests", "Запити")}</summary>
        {[
          { label: t("Research with AI", "Дослідити разом із ШІ"), icon: Bot },
          { label: t("Request peer recommendations", "Запитати рекомендації колег"), icon: Users },
          { label: t("Suggest dossier changes", "Запропонувати зміни до досьє"), icon: Pencil },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => {
              setRequest(action.label);
              setBody("");
              setSaved(false);
            }}
          >
            <action.icon size={19} />
            <span>{action.label}</span>
            <ChevronRight size={15} />
          </button>
        ))}
        {request && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              try {
                const key = "isrm-profile-request-drafts-v1";
                const old: unknown = JSON.parse(localStorage.getItem(key) || "[]");
                if (!Array.isArray(old)) throw Error("Invalid draft collection");
                localStorage.setItem(
                  key,
                  JSON.stringify([...old, { code: e.code, request, text: body }]),
                );
                setSaved(true);
                setError("");
              } catch {
                setError(
                  t(
                    "Draft could not be saved. Copy your text before closing.",
                    "Чернетку не вдалося зберегти. Скопіюйте текст перед закриттям.",
                  ),
                );
              }
            }}
          >
            <h4>{request}</h4>
            <label>
              {t("Request details", "Зміст запиту")}
              <textarea
                rows={3}
                required
                value={body}
                onChange={(event) => {
                  setBody(event.target.value);
                  setSaved(false);
                }}
              />
            </label>
            <p className="workspace-boundary">
              <Info size={14} />{" "}
              {t(
                "Browser-local draft. No external research or message is sent.",
                "Локальна чернетка. Зовнішнє дослідження не запускається, повідомлення не надсилається.",
              )}
            </p>
            <button type="submit" disabled={!ready}>
              {t("Save draft", "Зберегти чернетку")}
            </button>
            {saved && (
              <p role="status">
                {t("Draft saved in this browser", "Чернетку збережено в цьому браузері")}
              </p>
            )}
          </form>
        )}
      </details>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
