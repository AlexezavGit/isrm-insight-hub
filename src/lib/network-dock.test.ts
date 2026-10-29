import test from "node:test";
import assert from "node:assert/strict";
import * as dock from "./network-dock";
import { missingRequirementFields } from "./service-request-frame";
import { shortlistMarkdown } from "./network-shortlist";
import type { Expert } from "./types";

test("two inspection panels leave a usable graph and yield the search rail when space is tight", () => {
  const result = dock.inspectionLayout(1100, true, true, 300, { profile: 330, shortlist: 330 });
  assert.equal(result.left, 0);
  assert(result.graph >= 380);
  assert(result.profile >= 260 && result.shortlist >= 260);
});
test("dragging and window shrinking cannot consume the graph working area", () => {
  for (const width of [1100, 1280, 1440, 1920]) {
    const result = dock.inspectionLayout(width, true, true, 300, {
      profile: 9999,
      shortlist: 9999,
    });
    assert(result.graph >= 380);
    assert(result.profile >= 260 && result.profile <= 560);
    assert(result.shortlist >= 260 && result.shortlist <= 560);
    assert(result.left + result.profile + result.shortlist + result.graph + 24 <= width);
  }
});
test("a single panel can widen without overlapping search and compact screens retain a graph strip", () => {
  const desktop = dock.inspectionLayout(1440, true, false, 300, { profile: 560, shortlist: 330 });
  assert.equal(desktop.profile, 560);
  assert(desktop.graph >= 380);
  const phone = dock.inspectionLayout(390, true, true, 300, { profile: 560, shortlist: 560 });
  assert.equal(phone.compact, true);
  assert.equal(phone.width, 326);
  assert.equal(phone.graph, 390);
  assert.equal(
    dock.inspectionLayout(1100, false, false, 250, { profile: 330, shortlist: 330 }).width,
    0,
  );
});
test("requirement validation reports the specific missing inputs instead of a silent disabled save", () => {
  assert.deepEqual(missingRequirementFields(" ", { need: "", outcome: "" }), [
    "title",
    "need",
    "outcome",
  ]);
  assert.deepEqual(missingRequirementFields("Survey", { need: "  Map expertise ", outcome: " " }), [
    "outcome",
  ]);
  assert.deepEqual(
    missingRequirementFields("Survey", { need: "Map expertise", outcome: "Reviewed responses" }),
    [],
  );
});
test("shortlist export includes only selected accessible records and their own notes", () => {
  const people = [
    {
      code: "A",
      displayName: "Selected",
      primaryExpertise: "Risk",
      sector: "Security",
      country: "Ukraine",
      identityStatus: "Source confirmed",
      phone: "PRIVATE",
    },
    { code: "B", displayName: "Not selected" },
  ] as Expert[];
  const text = shortlistMarkdown(
    people,
    ["A"],
    "Board enquiry",
    { A: "Ask about availability", B: "Not for export" },
    ["A"],
    false,
  );
  assert(text.includes("Selected"));
  assert(text.includes("Ask about availability"));
  assert(
    !text.includes("Not selected") && !text.includes("Not for export") && !text.includes("PRIVATE"),
  );
  assert(text.includes("Follow-up"));
});
