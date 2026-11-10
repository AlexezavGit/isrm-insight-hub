import type { Expert } from "./types";

export interface SavedShortlistSnapshot {
  id: string;
  name: string;
  codes: string[];
  followUp?: string[];
  notes?: Record<string, string>;
  image?: string;
  createdAt?: string;
}

export function findSavedShortlistSnapshot(
  snapshots: SavedShortlistSnapshot[],
  selectedId: string,
  name: string,
  codes: string[],
): SavedShortlistSnapshot | undefined {
  const matchesCurrentSelection = (snapshot: SavedShortlistSnapshot) =>
    snapshot.name === name &&
    snapshot.codes.length === codes.length &&
    snapshot.codes.every((code, index) => code === codes[index]);
  return (
    snapshots.find((snapshot) => snapshot.id === selectedId && matchesCurrentSelection(snapshot)) ??
    snapshots.slice().reverse().find(matchesCurrentSelection)
  );
}

export function readSavedShortlists(raw: string | null): SavedShortlistSnapshot[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Invalid saved shortlist collection");
  return parsed.map((item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item))
      throw new Error("Invalid saved shortlist");
    const snapshot = item as Record<string, unknown>,
      image = snapshot["image"];
    if (
      typeof snapshot["id"] !== "string" ||
      typeof snapshot["name"] !== "string" ||
      !Array.isArray(snapshot["codes"]) ||
      !snapshot["codes"].every((code) => typeof code === "string") ||
      (image !== undefined &&
        (typeof image !== "string" || !image.startsWith("data:image/png;base64,")))
    )
      throw new Error("Invalid saved shortlist");
    const followUp = Array.isArray(snapshot["followUp"])
        ? snapshot["followUp"].filter((code): code is string => typeof code === "string")
        : undefined,
      notes =
        snapshot["notes"] &&
        typeof snapshot["notes"] === "object" &&
        !Array.isArray(snapshot["notes"])
          ? (Object.fromEntries(
              Object.entries(snapshot["notes"]).filter(([, value]) => typeof value === "string"),
            ) as Record<string, string>)
          : undefined;
    return {
      id: snapshot["id"],
      name: snapshot["name"],
      codes: snapshot["codes"],
      ...(followUp ? { followUp } : {}),
      ...(notes ? { notes } : {}),
      ...(typeof image === "string" ? { image } : {}),
      ...(typeof snapshot["createdAt"] === "string" ? { createdAt: snapshot["createdAt"] } : {}),
    };
  });
}

export function shortlistMarkdown(
  people: Expert[],
  codes: string[],
  name: string,
  notes: Record<string, string>,
  flags: string[],
  uk: boolean,
) {
  const t = (en: string, ua: string) => (uk ? ua : en);
  return [
    "# " + (name || t("Shortlist", "Відбір")),
    t(
      "Selection from the supplied sample. Shared categories do not establish a personal recommendation.",
      "Відбір із переданої вибірки. Спільні категорії не підтверджують особистої рекомендації.",
    ),
    ...codes.map((code) => {
      const p = people.find((x) => x.code === code);
      return [
        "## " + (p?.displayName || code),
        p
          ? [
              p.primaryExpertise,
              p.sector,
              p.country,
              t("Source record: ", "Статус джерела: ") + p.identityStatus,
            ]
              .filter(Boolean)
              .join("\n")
          : t("Not in the accessible sample", "Немає в доступній вибірці"),
        flags.includes(code) ? t("Follow-up: marked by you", "Увага: ваша позначка") : "",
        notes[code] ? t("Your note: ", "Ваша нотатка: ") + notes[code] : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    }),
  ].join("\n\n");
}
