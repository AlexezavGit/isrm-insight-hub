import test from "node:test";
import assert from "node:assert/strict";
import { EMPTY } from "./filters";
import { workspaceSelection } from "./workspace-selection";
import type { Expert } from "./types";
const person = (code: string, more: Partial<Expert> = {}): Expert => ({
  id: 1,
  code,
  displayName: code,
  sector: "Advisory",
  country: "Ukraine",
  identityStatus: "",
  verified: false,
  confidence: "",
  communityRole: "",
  crmStage: "",
  priority: "",
  tags: [],
  primaryExpertise: "Risk",
  ukraineTheme: "",
  ukraineCategory: "",
  evidence: "",
  contribution: "",
  potentialRole: "",
  ...more,
});
const people = [
  person("A", { verified: true }),
  person("B", { country: "Portugal" }),
  person("C", { primaryExpertise: "Research" }),
];
test("sample depends on expertise alone; other criteria narrow review independently", () => {
  const result = workspaceSelection(
    people,
    { ...EMPTY, expertise: "Risk", country: "Portugal", q: "B" },
    { source: "any" },
  );
  assert.deepEqual(
    result.sample.map((p) => p.code),
    ["A", "B"],
  );
  assert.deepEqual(
    result.review.map((p) => p.code),
    ["B"],
  );
  assert.equal(workspaceSelection(people, { ...EMPTY, country: "Portugal" }, {}).sample.length, 3);
});
test("unavailable AI review yields an empty review without losing the expertise sample", () => {
  const result = workspaceSelection(people, { ...EMPTY, expertise: "Risk" }, { ai: "yes" });
  assert.equal(result.sample.length, 2);
  assert.equal(result.review.length, 0);
});
test("source flag is not AI or peer review; missing membership is unknown", () => {
  assert.deepEqual(
    workspaceSelection(people, EMPTY, { source: "yes" }).review.map((p) => p.code),
    ["A"],
  );
  assert.equal(workspaceSelection(people, EMPTY, { peer: "yes" }).review.length, 0);
  assert.equal(workspaceSelection(people, EMPTY, { membership: "yes" }).review.length, 0);
  assert.equal(workspaceSelection(people, EMPTY, { membership: "unknown" }).review.length, 3);
});
test("restricted organisation metadata supports filtering without exposing its name", () => {
  const result = workspaceSelection(
    [person("D", { organizationAvailability: "restricted" })],
    EMPTY,
    { organisation: "yes" },
  );
  assert.equal(result.review.length, 1);
  assert.equal(result.review[0]?.organization, undefined);
});
test("selecting an organisation filters exact recorded names without widening to text search", () => {
  const result = workspaceSelection(
    [
      person("A", { organization: "North Risk Group" }),
      person("B", { organization: "North Risk Group Europe" }),
      person("C", { organization: "Other" }),
    ],
    { ...EMPTY, organization: "North Risk Group" },
    {},
  );
  assert.deepEqual(
    result.review.map((item) => item.code),
    ["A"],
  );
});
