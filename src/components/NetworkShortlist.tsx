import { useEffect, useState } from "react";
import { Network, X, ChevronDown, Flag, Download, Save } from "lucide-react";
import type { Expert } from "@/lib/types";
import { readProfileNotes, restoreProfileNotes, PROFILE_WORK_EVENT } from "@/lib/profile-work";
import { shortlistMarkdown } from "@/lib/network-shortlist";

export function NetworkShortlist({
  people,
  codes,
  name,
  onName,
  onInspect,
  onRemove,
  onClose,
  onSearch,
  onRestore,
  uk,
  example = false,
  disabled = false,
  expanded = false,
  onExpand,
}: {
  people: Expert[];
  codes: string[];
  name: string;
  onName: (name: string) => void;
  onInspect: (code: string) => void;
  onRemove: (code: string) => void;
  onClose: () => void;
  onSearch: () => void;
  onRestore: (codes: string[], name: string) => void;
  uk: boolean;
  example?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  onExpand: () => void;
}) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [snapshots, setSnapshots] = useState<
    {
      id: string;
      name: string;
      codes: string[];
      followUp?: string[];
      notes?: Record<string, string>;
    }[]
  >([]);
  const [saveError, setSaveError] = useState(false);
  const [restoreError, setRestoreError] = useState(false);
  useEffect(() => setSaved(false), [codes, name]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("isrm-shortlist-notes") || "{}");
      setNotes(
        example
          ? {}
          : stored && typeof stored === "object" && !Array.isArray(stored)
            ? (Object.fromEntries(
                Object.entries(stored).filter(([, v]) => typeof v === "string"),
              ) as Record<string, string>)
            : {},
      );
      setFlags(
        JSON.parse(localStorage.getItem("isrm-shortlist-follow-up") || "[]").filter(
          (x: unknown) => typeof x === "string",
        ),
      );
      const lists = JSON.parse(localStorage.getItem("isrm-saved-shortlists") || "[]");
      if (Array.isArray(lists))
        setSnapshots(
          lists.filter(
            (x) =>
              typeof x?.id === "string" &&
              typeof x?.name === "string" &&
              Array.isArray(x?.codes) &&
              x.codes.every((c: unknown) => typeof c === "string"),
          ),
        );
    } catch {
      /* Local follow-up only. */
    }
  }, [example]);
  const toggle = (code: string) => {
    const next = flags.includes(code) ? flags.filter((x) => x !== code) : [...flags, code];
    setFlags(next);
    setSaved(false);
    if (!example)
      try {
        localStorage.setItem("isrm-shortlist-follow-up", JSON.stringify(next));
      } catch {
        /* Optional local preference. */
      }
  };
  const save = () => {
    try {
      const key = "isrm-saved-shortlists";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(existing)) {
        setSaveError(true);
        return;
      }
      const currentNotes = readProfileNotes(localStorage);
      const savedList = {
        id: crypto.randomUUID(),
        name,
        codes: [...codes],
        followUp: flags.filter((code) => codes.includes(code)),
        notes: Object.fromEntries(
          codes.filter((code) => currentNotes[code]).map((code) => [code, currentNotes[code]]),
        ),
        createdAt: new Date().toISOString(),
      };
      const next = [...existing, savedList];
      localStorage.setItem(key, JSON.stringify(next));
      setSnapshots(next);
      setSaved(true);
      setSaveError(false);
    } catch {
      setSaved(false);
      setSaveError(true);
    }
  };
  const download = () => {
    let currentNotes = notes;
    if (!example) {
      try {
        currentNotes = readProfileNotes(localStorage);
      } catch {
        /* Retain notes already loaded. */
      }
    }
    const text = shortlistMarkdown(people, codes, name, currentNotes, flags, uk);
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ISRM_shortlist.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <aside
      className={`network-shortlist-panel ${expanded ? "is-expanded" : ""}`}
      aria-label={t("Selected profiles listing", "Лістинг відібраних профілів")}
      tabIndex={0}
    >
      <header>
        <label>
          {example
            ? t("Example group name", "Назва групи прикладу")
            : t("Group name", "Назва групи")}{" "}
          · {codes.length}
          <input
            value={name}
            onChange={(e) => {
              onName(e.target.value);
              setSaved(false);
            }}
            placeholder={t("Name the group", "Назвіть групу")}
            disabled={disabled}
          />
        </label>
        <div className="network-shortlist-tools">
          <button onClick={onSearch}>
            <Network size={15} />
            {t("Continue search", "Продовжити пошук")}
          </button>
          <button
            onClick={onExpand}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? t("Collapse shortlist", "Згорнути відбір")
                : t("Expand shortlist", "Розгорнути відбір")
            }
          >
            <ChevronDown size={16} />
            <span>{expanded ? t("Narrower", "Вужче") : t("More room", "Ширше")}</span>
          </button>
          <button onClick={onClose} aria-label={t("Hide shortlist", "Сховати відбір")}>
            <X size={17} />
          </button>
        </div>
      </header>
      <div className="network-shortlist-cards">
        {!codes.length && (
          <p>
            {t(
              "Open a profile and choose Add to shortlist. Only selected profiles appear here.",
              "Відкрийте профіль і натисніть «Додати до відбору». Тут з’являться лише відібрані профілі.",
            )}
          </p>
        )}
        {codes.map((code) => {
          const p = people.find((x) => x.code === code);
          return (
            <article key={code}>
              <button
                className="network-shortlist-person"
                disabled={!p}
                onClick={() => onInspect(code)}
              >
                {p?.displayName || code}
              </button>
              <div>
                <button
                  aria-pressed={flags.includes(code)}
                  onClick={() => toggle(code)}
                  disabled={disabled}
                >
                  <Flag size={13} />
                  {flags.includes(code)
                    ? t("Follow-up marked", "Потребує уваги")
                    : t("Mark for follow-up", "Позначити для уваги")}
                </button>
                <button onClick={() => onRemove(code)} disabled={disabled}>
                  {t("Remove", "Прибрати")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <footer>
        {restoreError && (
          <small role="alert">
            {t(
              "The selection opened, but its saved notes could not be restored in this browser.",
              "Відбір відкрито, але його збережені нотатки відновити в браузері не вдалося.",
            )}
          </small>
        )}
        <small>
          {example
            ? t(
                "Temporary example · your saved group is unchanged",
                "Тимчасовий приклад · ваша збережена група не змінена",
              )
            : t(
                "Stored only in this browser. Open saved shortlists below; download Markdown for a separate file. Working marks are not verification decisions.",
                "Лише в цьому браузері. Збережені відбори відкриваються нижче; Markdown завантажує окремий файл. Робочі позначки не є висновками перевірки.",
              )}
        </small>
        {!example && snapshots.length > 0 && (
          <select
            aria-label={t("Open a saved shortlist", "Відкрити збережений відбір")}
            value=""
            disabled={disabled}
            onChange={(event) => {
              const list = snapshots.find((s) => s.id === event.target.value);
              if (list) {
                const restored = (list.followUp ?? []).filter(
                  (code) => typeof code === "string" && list.codes.includes(code),
                );
                setFlags(restored);
                const restoredNotes = Object.fromEntries(
                  Object.entries(list.notes ?? {}).filter(
                    ([code, value]) => list.codes.includes(code) && typeof value === "string",
                  ),
                ) as Record<string, string>;
                try {
                  localStorage.setItem("isrm-shortlist-follow-up", JSON.stringify(restored));
                  setNotes(restoreProfileNotes(localStorage, list.codes, restoredNotes));
                  setRestoreError(false);
                } catch {
                  setRestoreError(true);
                }
                window.dispatchEvent(new Event(PROFILE_WORK_EVENT));
                onRestore(list.codes, list.name);
                setSaved(false);
              }
            }}
          >
            <option value="">{t("Saved shortlists", "Збережені відбори")}</option>
            {snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || t("Untitled group", "Група без назви")} · {s.codes.length}
              </option>
            ))}
          </select>
        )}
        {!example && (
          <button onClick={save} disabled={disabled || !codes.length}>
            <Save size={14} />
            {saved
              ? t("Saved in this browser", "Збережено в цьому браузері")
              : t("Save this shortlist in the browser", "Зберегти відбір у браузері")}
          </button>
        )}
        <button onClick={download} disabled={!codes.length}>
          <Download size={14} />
          Markdown
        </button>
        {saveError && (
          <small role="alert">
            {t(
              "Could not save this shortlist. Download Markdown to retain this selection.",
              "Не вдалося зберегти відбір. Завантажте Markdown, щоб залишити цей відбір.",
            )}
          </small>
        )}
      </footer>
    </aside>
  );
}
