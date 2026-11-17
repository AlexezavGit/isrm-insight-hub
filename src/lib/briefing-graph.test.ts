import test from "node:test";
import assert from "node:assert/strict";
import { briefingGraph } from "./briefing-graph";
import type { Expert } from "./types";

const record = (code: string, primaryExpertise: string, verified = false) =>
  ({
    code,
    displayName: code,
    sector: "Risk",
    country: "UK",
    communityRole: "",
    ukraineCategory: "Unclassified",
    primaryExpertise,
    verified,
    tags: [],
  }) as Expert;

test("changing presentation layout retains the supplied people, including the research queue, and only category edges", () => {
  const input = [record("A", "Risk", true), record("B", "Risk"), record("C", "To assess")];
  const snapshot = briefingGraph(input, "expertise", "en");
  assert.deepEqual(
    snapshot.nodes
      .filter((n) => n.kind === "expert")
      .map((n) => n.id)
      .sort(),
    ["A", "B", "C"],
  );
  assert(snapshot.links.every((e) => e.kind === "category"));
  assert(!snapshot.links.some((e) => ["A", "B", "C"].includes(e.target)));
  assert.deepEqual([...snapshot.free.keys()].sort(), snapshot.nodes.map((n) => n.id).sort());
  assert(snapshot.nodes.every((n) => snapshot.positions.has(n.id)));
  assert.deepEqual([...snapshot.matched].sort(), ["A", "B"]);
  assert.equal(snapshot.category?.label, "Risk");
});

test("an unavailable category produces no invented selection, even when records exist", () => {
  const snapshot = briefingGraph([record("A", "To assess")], "expertise", "en");
  assert.equal(snapshot.category, undefined);
  assert.equal(snapshot.matched.size, 0);
  assert.equal(snapshot.nodes.filter((n) => n.kind === "expert").length, 1);
});

test("sector and expertise views use their own recorded attributes", () => {
  const snapshot = briefingGraph([record("A", "Humanitarian security")], "sectors", "uk");
  assert(snapshot.nodes.some((n) => n.id.startsWith("sector:")));
  assert(!snapshot.nodes.some((n) => n.id.startsWith("expertise:")));
  assert(!snapshot.nodes.some((n) => ["isrm", "service", "workflow"].includes(n.kind)));
});
