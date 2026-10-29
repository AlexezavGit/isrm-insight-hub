import type { Expert } from "./types";
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
