import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveAccess, buildExperts } from "./experts.server";

test("private network denies guest data and names/codes never grant board access", () => {
  assert.deepEqual(buildExperts("guest"), []);
  assert.equal(resolveAccess("").level, "guest");
  assert.equal(resolveAccess("EXP-004").level, "guest");
  assert.equal(resolveAccess("not-a-password").level, "guest");
});
test("server-configured board password grants named profiles without direct phone access", () => {
  const previous = process.env["ISRM_BOARD_CODE"];
  process.env["ISRM_BOARD_CODE"] = "test-only-board-access";
  try {
    assert.equal(resolveAccess("test-only-board-access").level, "referral");
    const records = buildExperts("referral");
    assert.ok(records.length > 0);
    assert.ok(records.some((r) => Boolean(r.organization)));
    assert.ok(records.every((r) => r.phone === undefined));
  } finally {
    if (previous === undefined) delete process.env["ISRM_BOARD_CODE"];
    else process.env["ISRM_BOARD_CODE"] = previous;
  }
});
