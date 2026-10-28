import test from "node:test";
import assert from "node:assert/strict";
import { GUIDE_STEPS, guideNext } from "./network-guide";

test("a guided shortlist requires a real profile and a real addition", () => {
  assert.equal(guideNext(0, false, false), 1);
  assert.equal(guideNext(1, false, false), 1);
  assert.equal(guideNext(1, true, false), 2);
  assert.equal(guideNext(2, true, false), 3);
  // An unrelated existing shortlist must not complete this profile's task.
  assert.equal(guideNext(3, true, false), 3);
  assert.equal(guideNext(3, true, true), 4);
  assert.equal(guideNext(4, true, true), null);
});

test("each of five steps offers the same task in both languages", () => {
  assert.equal(GUIDE_STEPS.length, 5);
  assert.deepEqual(
    GUIDE_STEPS.map((step) => step.id),
    ["search", "connections", "dossier", "save", "shortlist"],
  );
  for (const step of GUIDE_STEPS) {
    assert(step.title.en && step.title.uk && step.body.en && step.body.uk);
  }
});
