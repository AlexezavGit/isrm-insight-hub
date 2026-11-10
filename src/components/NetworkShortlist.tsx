import { useEffect, useState } from "react";
import { Network, X, ChevronDown, Flag, Download, Save, Settings, ArrowRight } from "lucide-react";
import type { Expert } from "@/lib/types";
import { readProfileNotes, restoreProfileNotes, PROFILE_WORK_EVENT } from "@/lib/profile-work";
import {
  CONTACT_INTERMEDIARIES,
  readContactPaths,
  removeContactPath,
  writeContactPath,
  type ContactIntermediary,
  type ContactPath,
  type ContactPathMap,
} from "@/lib/contact-paths";
import {
  findSavedShortlistSnapshot,
  readSavedShortlists,
  shortlistMarkdown,
  type SavedShortlistSnapshot,
} from "@/lib/network-shortlist";

export function NetworkShortlist({
  people,
  codes,
  name,
  onName,
  onInspect,
  onRemove,
  onClose,
  onSearch,
  onConfigure,
  onRestore,
  captureGraph,
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
  onConfigure?: () => void;
  onRestore: (codes: string[], name: string) => void;
  captureGraph: () => string;
  uk: boolean;
  example?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  onExpand: () => void;
}) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [projectName, setProjectName] = useState("");
  const [saved, setSaved] = useState(false);
  const [snapshots, setSnapshots] = useState<SavedShortlistSnapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [restoreError, setRestoreError] = useState(false);
  const [snapshotReadError, setSnapshotReadError] = useState(false);
  const [contactPaths, setContactPaths] = useState<ContactPathMap>({});
  const [recommendationVia, setRecommendationVia] = useState<
    Partial<Record<string, ContactIntermediary>>
  >({});
  const [contactPathError, setContactPathError] = useState(false);
  const selectedSnapshot = findSavedShortlistSnapshot(snapshots, selectedSnapshotId, name, codes);
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
      setSnapshots(readSavedShortlists(localStorage.getItem("isrm-saved-shortlists")));
    } catch {
      setSnapshotReadError(true);
    }
    if (example) {
      setContactPaths({});
      setContactPathError(false);
    } else {
      try {
        setContactPaths(readContactPaths(localStorage));
        setContactPathError(false);
      } catch {
        setContactPathError(true);
      }
    }
  }, [example]);
  const saveContactPath = (code: string, path: ContactPath) => {
    try {
      const next = example
        ? { ...contactPaths, [code]: path }
        : writeContactPath(localStorage, code, path);
      setContactPaths(next);
      setContactPathError(false);
    } catch {
      setContactPathError(true);
    }
  };
  const clearContactPath = (code: string) => {
    try {
      const next = example ? { ...contactPaths } : removeContactPath(localStorage, code);
      if (example) delete next[code];
      setContactPaths(next);
      setContactPathError(false);
    } catch {
      setContactPathError(true);
    }
  };
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
    setSaved(false);
    setSaveError(false);
    try {
      const image = captureGraph();
      if (!image.startsWith("data:image/png;base64,")) {
        setSaveError(true);
        return;
      }
      const key = "isrm-saved-shortlists";
      const existing = readSavedShortlists(localStorage.getItem(key));
      const currentNotes = readProfileNotes(localStorage);
      const savedList = {
        id: crypto.randomUUID(),
        name,
        codes: [...codes],
        followUp: flags.filter((code) => codes.includes(code)),
        notes: Object.fromEntries(
          codes.filter((code) => currentNotes[code]).map((code) => [code, currentNotes[code]]),
        ),
        image,
        createdAt: new Date().toISOString(),
      };
      const next = [...existing, savedList];
      localStorage.setItem(key, JSON.stringify(next));
      setSnapshots(next);
      setSelectedSnapshotId(savedList.id);
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
  const mappedCodes = codes.filter((code) => !!contactPaths[code]);
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
            : t("Shortlist name", "Назва відбору")}{" "}
          · {codes.length}
          <input
            value={name}
            onChange={(e) => {
              onName(e.target.value);
              setSaved(false);
            }}
            placeholder={t("Name this shortlist", "Назвіть відбір")}
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
              <section
                className="network-contact-route"
                aria-label={t("Contact route", "Шлях контакту")}
              >
                <h4>{t("Contact route", "Шлях контакту")}</h4>
                <div>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => saveContactPath(code, { kind: "direct", status: "prepared" })}
                  >
                    {t("Prepare safe direct contact", "Підготувати безпечний прямий контакт")}
                  </button>
                </div>
                <label>
                  {t("Request a recommendation through", "Запросити рекомендацію через")}
                  <select
                    value={recommendationVia[code] ?? ""}
                    disabled={disabled}
                    onChange={(event) => {
                      const intermediary = event.target.value;
                      setRecommendationVia((current) =>
                        CONTACT_INTERMEDIARIES.some((item) => item === intermediary)
                          ? { ...current, [code]: intermediary as ContactIntermediary }
                          : { ...current, [code]: undefined },
                      );
                    }}
                  >
                    <option value="">{t("Choose a route", "Оберіть шлях")}</option>
                    {CONTACT_INTERMEDIARIES.map((intermediary) => (
                      <option key={intermediary} value={intermediary}>
                        {intermediary === "specialty"
                          ? t("Specialty lead", "Лідер спеціалізації")
                          : intermediary === "practice"
                            ? t("Practice lead", "Лідер практики")
                            : t("Regional representative", "Регіональний представник")}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={disabled || !recommendationVia[code]}
                  onClick={() => {
                    const intermediary = recommendationVia[code];
                    if (intermediary)
                      saveContactPath(code, {
                        kind: "recommendation",
                        intermediary,
                        status: "prepared",
                      });
                  }}
                >
                  {t("Prepare recommendation request", "Підготувати запит рекомендації")}
                </button>
                {contactPaths[code] && (
                  <div className="network-contact-route-status" role="status">
                    <p>
                      {contactPaths[code].status === "prepared"
                        ? t(
                            "Route prepared in this browser; nothing was sent.",
                            "Шлях підготовлено в цьому браузері; нічого не надіслано.",
                          )
                        : t(
                            "You marked communication with this expert as started.",
                            "Ви позначили, що комунікацію з цим фахівцем розпочато.",
                          )}
                    </p>
                    {contactPaths[code].status === "prepared" && (
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          saveContactPath(code, { ...contactPaths[code]!, status: "in-contact" })
                        }
                      >
                        {t("Mark communication as started", "Позначити початок комунікації")}
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => clearContactPath(code)}
                    >
                      {t("Remove contact path", "Прибрати шлях контакту")}
                    </button>
                  </div>
                )}
              </section>
            </article>
          );
        })}
      </div>
      {codes.length > 0 && (
        <section className="network-contact-map" aria-labelledby="network-contact-map-title">
          <h3 id="network-contact-map-title">{t("My contact map", "Моя мапа контактів")}</h3>
          <p>
            {t(
              "The map separates possible routes from people you mark as being in communication with. Shared expertise alone does not establish a connection.",
              "Мапа відрізняє можливі шляхи від людей, з якими ви позначили комунікацію. Спільна експертиза сама по собі не встановлює зв’язок.",
            )}
          </p>
          {contactPathError && (
            <p role="alert">
              {t(
                "Contact paths could not be saved or read in this browser. Existing data was not overwritten.",
                "Не вдалося прочитати або зберегти шляхи контактів у цьому браузері. Наявні дані не перезаписано.",
              )}
            </p>
          )}
          {mappedCodes.length > 0 ? (
            <ul className="network-contact-map-paths">
              {mappedCodes.map((code) => {
                const person = people.find((item) => item.code === code);
                const path = contactPaths[code]!;
                return (
                  <li key={code}>
                    <span className="network-contact-map-path">
                      <span>{t("You", "Ви")}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                      {path.kind === "recommendation" && (
                        <>
                          <span>
                            {path.intermediary === "specialty"
                              ? t("Specialty lead", "Лідер спеціалізації")
                              : path.intermediary === "practice"
                                ? t("Practice lead", "Лідер практики")
                                : t("Regional representative", "Регіональний представник")}
                          </span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </>
                      )}
                      <span>
                        {person?.displayName || code}
                        {person?.primaryExpertise ? ` · ${person.primaryExpertise}` : ""}
                      </span>
                    </span>
                    <small>
                      {path.status === "prepared"
                        ? t(
                            "Potential route · prepared locally, not sent",
                            "Можливий шлях · підготовлено локально, не надіслано",
                          )
                        : path.kind === "direct"
                          ? t(
                              "Direct · communication marked by you",
                              "Напряму · комунікацію позначили ви",
                            )
                          : t(
                              "Via recommendation · communication marked by you",
                              "Через рекомендацію · комунікацію позначили ви",
                            )}
                    </small>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>
              {t(
                "No contact routes have been recorded for this shortlist yet.",
                "Для цього відбору ще не зафіксовано шляхів контакту.",
              )}
            </p>
          )}
          <small>
            {t(
              "Demonstration only: routes are stored in this browser. No message is sent; intermediary roles have no assigned representatives, and communication status is your own record.",
              "Лише демонстрація: шляхи зберігаються в цьому браузері. Повідомлення не надсилається; ролям посередників не призначено конкретних представників, а статус комунікації — ваша власна позначка.",
            )}
          </small>
        </section>
      )}
      {!example && codes.length > 0 && (
        <section className="network-project-invite" aria-labelledby="network-project-invite-title">
          <h3 id="network-project-invite-title">
            {t("Invite this group to a project", "Запросити цю групу до проєкту")}
          </h3>
          <label>
            {t("Project name", "Назва проєкту")}
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder={t("Enter a project name", "Введіть назву проєкту")}
              disabled={disabled}
            />
          </label>
          <div>
            <button type="button" disabled aria-describedby="network-project-invite-note">
              {t("Send invitations", "Надіслати запрошення")}
            </button>
            {onConfigure && (
              <button type="button" onClick={onConfigure}>
                <Settings size={14} />
                {t("Configure services", "Налаштувати сервіси")}
              </button>
            )}
          </div>
          <p id="network-project-invite-note">
            {t(
              "Invitations are in development and cannot be sent in this demo. Configure services to define this group's needs; a future release may require Premium.",
              "Надсилання запрошень ще розробляється й недоступне в демо. Налаштуйте сервіси, щоб визначити потреби групи; у майбутній версії функція може вимагати Premium.",
            )}
          </p>
        </section>
      )}
      <footer>
        {snapshotReadError && (
          <small role="alert">
            {t(
              "Saved shortlist data could not be read. Existing browser data was not overwritten.",
              "Не вдалося прочитати збережені відбори. Наявні дані браузера не перезаписано.",
            )}
          </small>
        )}
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
                setSelectedSnapshotId(list.id);
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
        {selectedSnapshot && (
          <figure
            className="network-shortlist-saved-map"
            aria-label={t("Saved shortlist graph snapshot", "Збережений знімок графа відбору")}
          >
            {selectedSnapshot.image ? (
              <img
                src={selectedSnapshot.image}
                alt={
                  t("Saved graph snapshot for ", "Збережений знімок графа для ") +
                  selectedSnapshot.name
                }
              />
            ) : (
              <figcaption>
                {t(
                  "This earlier shortlist was saved without a graph snapshot.",
                  "Цей раніше збережений відбір не містить знімка графа.",
                )}
              </figcaption>
            )}
            {selectedSnapshot.image && (
              <figcaption>
                {t("Saved graph snapshot · ", "Збережений знімок графа · ") + selectedSnapshot.name}
              </figcaption>
            )}
          </figure>
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
              "Could not capture the graph and save this shortlist. Download Markdown to retain the selection.",
              "Не вдалося зняти граф і зберегти відбір. Завантажте Markdown, щоб зберегти список.",
            )}
          </small>
        )}
      </footer>
    </aside>
  );
}
