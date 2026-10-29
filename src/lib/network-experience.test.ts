import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseSearchExample,
  constellation,
  rotatePoint,
  researchFindings,
  personStatuses,
  resolveReplayExit,
} from "./network-experience";
import type { Expert } from "./types";

test("closing or switching away from a replay restores the original view and leaves saved selections alone", () => {
  const original = { country: "Ukraine", openWorkflow: "expertise", disabled: ["contact"] };
  const demo = { country: "United Kingdom", openWorkflow: "core", disabled: [] };
  const exit = resolveReplayExit(original, demo, ["saved"], ["example"], false);
  assert.deepEqual(exit.view, original);
  assert.deepEqual(exit.selection, ["saved"]);
  assert.deepEqual(original.disabled, ["contact"]);
});
test("taking over retains current controls and explicitly merges the example without duplicating saved people", () => {
  const original = { country: "Ukraine" },
    current = { country: "Poland" };
  const exit = resolveReplayExit(original, current, ["P1"], ["P1", "P2"], true);
  assert.deepEqual(exit.view, current);
  assert.deepEqual(exit.selection, ["P1", "P2"]);
});

const profile = (code: string, overrides: Partial<Expert> = {}) =>
  ({
    code,
    verified: true,
    country: "Україна",
    sector: "Security",
    primaryExpertise: "Crisis management",
    identityStatus: "Confirmed",
    evidence: "",
    communityRole: "Member",
    tags: [],
    ...overrides,
  }) as Expert;

test("a worked example uses accessible supplied profiles and never invents a missing second person", () => {
  const first = profile("P1"),
    second = profile("P2");
  assert.deepEqual(
    chooseSearchExample([first, second])?.people.map((p) => p.code),
    ["P1", "P2"],
  );
  assert.equal(chooseSearchExample([]), null);
  assert.equal(chooseSearchExample([first])?.people.length, 1);
});
test("rotation preserves the centre and distance", () => {
  const rotated = rotatePoint({ x: 20, y: 0 }, Math.PI / 2);
  assert(Math.abs(rotated.x) < 0.0001);
  assert(Math.abs(rotated.y - 20) < 0.0001);
  assert.deepEqual(rotatePoint({ x: 0, y: 0 }, 2), { x: 0, y: 0 });
});
test("a group constellation is stable for reordered members and changes with its members", () => {
  const a = profile("P1"),
    b = profile("P2");
  assert.deepEqual(constellation([a, b]), constellation([b, a]));
  assert.notDeepEqual(constellation([a]), constellation([a, b]));
  assert.equal(constellation([]).nodes.length, 1);
});
test("research preview exposes only already accessible facts and statuses do not imply new verification", () => {
  const e = profile("P1");
  assert(!researchFindings(e).some((f) => f.id === "source"));
  assert.equal(
    researchFindings({ ...e, source: "https://example.org/source" }).find((f) => f.id === "source")
      ?.value,
    "https://example.org/source",
  );
  const statuses = personStatuses(e, false);
  for (const id of ["human", "ai", "compliance"])
    assert.equal(statuses.find((s) => s.id === id)?.recorded, false);
});
