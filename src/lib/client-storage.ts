import { DRAFT_KEY, emptyDraft, parseDraft, type ClientDraft } from "./client-draft";
export function loadClientDraft(storage: Pick<Storage, "getItem">): {
  draft: ClientDraft;
  problem: "invalid" | "unavailable" | null;
  backup: Record<string, string>;
} {
  const backup: Record<string, string> = {};
  try {
    for (const key of [DRAFT_KEY, "isrm-service-drafts-v1", "isrm-service-deck-drafts-v1"]) {
      const value = storage.getItem(key);
      if (value !== null) backup[key] = value;
    }
  } catch {
    return { draft: emptyDraft(), problem: "unavailable", backup };
  }
  try {
    if (backup[DRAFT_KEY]) return { draft: parseDraft(backup[DRAFT_KEY]), problem: null, backup };
    const draft = emptyDraft();
    for (const key of ["isrm-service-drafts-v1", "isrm-service-deck-drafts-v1"]) {
      const raw = backup[key];
      if (!raw) continue;
      const legacy: unknown = JSON.parse(raw);
      if (!legacy || typeof legacy !== "object" || Array.isArray(legacy))
        throw new Error("Invalid legacy draft");
      for (const [title, fields] of Object.entries(legacy)) {
        if (!fields || typeof fields !== "object" || Array.isArray(fields)) continue;
        const description = Object.entries(fields)
          .filter(([k, v]) => typeof v === "string" && !["status", "savedAt"].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n");
        if (description)
          draft.requests.push({ id: `${key}:${title}`, kind: "service", title, description });
      }
    }
    return { draft, problem: null, backup };
  } catch {
    return { draft: emptyDraft(), problem: "invalid", backup };
  }
}
