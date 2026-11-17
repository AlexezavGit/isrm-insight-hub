import type { Expert } from "./types";

const unprepared = new Set([
  "",
  "—",
  "-",
  "not assessed",
  "to assess",
  "unclassified",
  "not supplied",
  "not recorded",
  "unknown",
  "ukraine-related experience",
  "unqualified / research pending",
]);
export function hasRecordedContent(value: string | undefined | null) {
  return !unprepared.has((value ?? "").trim().toLowerCase());
}
export function hasDossierDetails(e: Expert) {
  return [
    e.evidence,
    e.source,
    e.contribution,
    e.potentialRole,
    e.caseTheme,
    e.internationalRelevance,
    e.ukraineTheme,
    ...(e.tags ?? []),
  ].some(hasRecordedContent);
}
