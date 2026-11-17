import test from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_PATHS_KEY,
  readContactPaths,
  removeContactPath,
  writeContactPath,
} from "./contact-paths";

const storage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
};

test("contact routes are stored by shortlisted person and can be removed", () => {
  const store = storage();
  const routes = writeContactPath(store, "EXP-001", {
    kind: "recommendation",
    intermediary: "regional",
    status: "prepared",
  });
  assert.deepEqual(routes, {
    "EXP-001": {
      kind: "recommendation",
      intermediary: "regional",
      status: "prepared",
    },
  });
  assert.deepEqual(readContactPaths(store), routes);
  assert.deepEqual(removeContactPath(store, "EXP-001"), {});
});

test("invalid contact path data is rejected without overwriting browser storage", () => {
  const raw = JSON.stringify({ "EXP-001": { kind: "recommendation", intermediary: "unknown" } });
  const store = storage({ [CONTACT_PATHS_KEY]: raw });
  assert.throws(() => readContactPaths(store));
  assert.throws(() =>
    writeContactPath(store, "EXP-002", {
      kind: "recommendation",
      intermediary: "unknown",
      status: "prepared",
    } as never),
  );
  assert.equal(store.getItem(CONTACT_PATHS_KEY), raw);
});
