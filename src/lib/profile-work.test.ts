import test from "node:test";
import assert from "node:assert/strict";
import {
  readProfileNotes,
  writeProfileNote,
  readWorkingStatus,
  writeWorkingStatus,
  restoreProfileNotes,
} from "./profile-work";
const storage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
};
test("dossier notes reuse the shortlist store without overwriting another profile", () => {
  const store = storage({ "isrm-shortlist-notes": JSON.stringify({ A: "Existing note" }) });
  writeProfileNote(store, "B", "Follow up");
  assert.deepEqual(readProfileNotes(store), { A: "Existing note", B: "Follow up" });
  writeWorkingStatus(store, "B", "for-review");
  assert.equal(readWorkingStatus(store, "B"), "for-review");
  assert.equal(readWorkingStatus(store, "A"), "none");
  assert.equal(readProfileNotes(store).A, "Existing note");
});
test("corrupt storage is readable as empty but is not silently overwritten", () => {
  const store = storage({ "isrm-shortlist-notes": "broken" });
  assert.deepEqual(readProfileNotes(store), {});
  assert.throws(() => writeProfileNote(store, "B", "New"));
  assert.equal(store.getItem("isrm-shortlist-notes"), "broken");
});
test("unknown review marks cannot become recorded verification or compliance", () => {
  const store = storage({ "isrm-profile-working-status-v1": JSON.stringify({ A: "AI verified" }) });
  assert.equal(readWorkingStatus(store, "A"), "none");
  assert.throws(() => writeWorkingStatus(store, "A", "AI verified" as never));
});

test("restoring one saved selection preserves notes for profiles outside it", () => {
  const store = storage({
    "isrm-shortlist-notes": JSON.stringify({
      A: "Newer note",
      B: "Keep me",
      C: "Clear in snapshot",
    }),
  });
  const restored = restoreProfileNotes(store, ["A", "C"], {
    A: "Saved note",
    B: "Ignore snapshot outsider",
  });
  assert.deepEqual(restored, { A: "Saved note", B: "Keep me" });
});
