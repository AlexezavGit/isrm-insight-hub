import { applyFilters, EMPTY, type Filters } from "./filters";
import { recordedChapterHead, recordedMember } from "./workspace-map";
import type { Expert } from "./types";

export function workspaceSelection(
  people: Expert[],
  filters: Filters,
  statuses: Record<string, string>,
) {
  const sample = applyFilters(people, { ...EMPTY, expertise: filters.expertise ?? "" });
  const review = applyFilters(sample, filters).filter((person) =>
    Object.entries(statuses).every(([key, value]) => {
      if (value === "any") return true;
      const recorded =
        key === "membership"
          ? recordedMember(person)
          : key === "chapter"
            ? recordedChapterHead(person)
            : key === "source"
              ? person.verified
              : key === "organisation"
                ? !!person.organization || person.organizationAvailability === "restricted"
                : false; // No AI or peer-review decisions exist in this API.
      return value === "yes" ? recorded : !recorded;
    }),
  );
  return { sample, review };
}
