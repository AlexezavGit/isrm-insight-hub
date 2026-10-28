import test from "node:test";
import assert from "node:assert/strict";
import {
  expansionProgress,
  briefingApproach,
  directNeighbours,
  concentratorGroups,
  briefingGroups,
} from "./network-presentation";
import type { Expert } from "./types";

test("every slide retains recorded categories when community roles have not been supplied", () => {
  const experts = [
    {
      code: "P1",
      sector: "Risk",
      communityRole: "Member / participant",
      ukraineCategory: "Unclassified",
    },
  ] as Expert[];
  for (let slide = 0; slide < 6; slide++) {
    const groups = briefingGroups(experts, slide);
    assert.deepEqual(
      groups.map(([category]) => category),
      ["Risk"],
    );
    assert.equal(groups[0]![1][0]!.code, "P1");
  }
  assert.equal(briefingGroups([], 0).length, 0);
});

test("the live reveal starts at one point, unfolds over seconds and settles exactly", () => {
  assert.equal(expansionProgress(0, 0), 0);
  assert.equal(expansionProgress(150, 200), 0);
  assert(expansionProgress(800, 0) > 0);
  assert(expansionProgress(800, 0) < 1);
  assert(expansionProgress(2300, 0) > 1);
  assert.equal(expansionProgress(3400, 200), 1);
});
test("a slide approach remains visibly in motion before settling at four seconds", () => {
  assert(briefingApproach(0).scale >= 4);
  assert(briefingApproach(1600).scale > 1.4);
  assert(briefingApproach(3000).scale > 1);
  assert.deepEqual(briefingApproach(4000), { scale: 1, progress: 1 });
});
test("hover follows the supplied visible edges, without inventing indirect acquaintances", () => {
  const neighbours = directNeighbours(
    [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "D", target: "A" },
    ],
    "A",
  );
  assert.deepEqual([...neighbours].sort(), ["A", "B", "D"]);
  assert.equal(directNeighbours([], null).size, 0);
});
test("concentrators are categorised and never duplicate the separate person search", () => {
  const groups = concentratorGroups([
    { id: "P1", kind: "expert", label: "Person", size: 1 },
    { id: "country:UK", kind: "hub", label: "United Kingdom", size: 1 },
    { id: "expertise:Risk", kind: "theme", label: "Risk", size: 1 },
    { id: "sector:Consulting", kind: "sector", label: "Consulting", size: 1 },
    { id: "svc:search", kind: "service", label: "Search", size: 1 },
  ]);
  assert.equal(
    groups.flatMap((g) => g.nodes).some((n) => n.kind === "expert"),
    false,
  );
  assert.deepEqual(
    groups.map((g) => g.id),
    ["services", "expertise", "sectors", "countries"],
  );
});
