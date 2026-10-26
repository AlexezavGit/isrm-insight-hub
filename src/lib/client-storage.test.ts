import { test } from "node:test";
import assert from "node:assert/strict";
import { loadClientDraft } from "./client-storage";
test("unavailable storage permits an in-memory draft", () => {
  const result = loadClientDraft({
    getItem() {
      throw new Error("denied");
    },
  });
  assert.equal(result.problem, "unavailable");
  assert.equal(result.draft.mode, "full");
});
test("corrupt legacy bytes are retained for recovery", () => {
  const result = loadClientDraft({
    getItem(key) {
      return key === "isrm-service-drafts-v1" ? "{broken" : null;
    },
  });
  assert.equal(result.problem, "invalid");
  assert.equal(result.backup["isrm-service-drafts-v1"], "{broken");
});
test("legacy descriptions migrate without modifying their saved source", () => {
  const raw = JSON.stringify({
    "A service": { need: "Exact description", behavior: "My actions", savedAt: "yesterday" },
  });
  const result = loadClientDraft({
    getItem(key) {
      return key === "isrm-service-deck-drafts-v1" ? raw : null;
    },
  });
  assert.equal(result.problem, null);
  assert.match(result.draft.requests[0]!.description, /Exact description/);
  assert.equal(result.backup["isrm-service-deck-drafts-v1"], raw);
});
