type LocalStore = Pick<Storage, "getItem" | "setItem">;
export const PROFILE_NOTES_KEY = "isrm-shortlist-notes";
export const PROFILE_STATUS_KEY = "isrm-profile-working-status-v1";
export const PROFILE_WORK_EVENT = "isrm-profile-work-changed";
export const WORKING_REVIEW_STATES = [
  { id: "none", en: "Not marked", uk: "Без позначки" },
  { id: "to-check", en: "Needs checking", uk: "Потребує перевірки" },
  { id: "for-review", en: "For professional review", uk: "На професійний розгляд" },
  { id: "reviewed-by-me", en: "Reviewed by me", uk: "Переглянуто мною" },
  { id: "follow-up", en: "Follow-up needed", uk: "Потрібна наступна дія" },
  { id: "on-hold", en: "On hold", uk: "Відкладено" },
] as const;
export type WorkingReviewState = (typeof WORKING_REVIEW_STATES)[number]["id"];
function record(store: LocalStore, key: string): Record<string, unknown> {
  const value: unknown = JSON.parse(store.getItem(key) || "{}");
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid local record");
  return value as Record<string, unknown>;
}
export function readProfileNotes(store: LocalStore): Record<string, string> {
  try {
    return Object.fromEntries(
      Object.entries(record(store, PROFILE_NOTES_KEY)).filter(([, v]) => typeof v === "string"),
    ) as Record<string, string>;
  } catch {
    return {};
  }
}
export function writeProfileNote(store: LocalStore, code: string, note: string) {
  store.setItem(
    PROFILE_NOTES_KEY,
    JSON.stringify({ ...record(store, PROFILE_NOTES_KEY), [code]: note }),
  );
}
export function restoreProfileNotes(
  store: LocalStore,
  codes: string[],
  notes: Record<string, string>,
) {
  const merged = record(store, PROFILE_NOTES_KEY);
  for (const code of codes) {
    delete merged[code];
    if (typeof notes[code] === "string") merged[code] = notes[code];
  }
  store.setItem(PROFILE_NOTES_KEY, JSON.stringify(merged));
  return readProfileNotes(store);
}
export function readWorkingStatus(store: LocalStore, code: string): WorkingReviewState {
  try {
    const value = record(store, PROFILE_STATUS_KEY)[code];
    return WORKING_REVIEW_STATES.find((s) => s.id === value)?.id ?? "none";
  } catch {
    return "none";
  }
}
export function writeWorkingStatus(store: LocalStore, code: string, status: WorkingReviewState) {
  if (!WORKING_REVIEW_STATES.some((s) => s.id === status)) throw new Error("Unknown working mark");
  store.setItem(
    PROFILE_STATUS_KEY,
    JSON.stringify({ ...record(store, PROFILE_STATUS_KEY), [code]: status }),
  );
}
