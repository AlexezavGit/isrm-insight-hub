import test from "node:test";
import assert from "node:assert/strict";
import type { Expert } from "./types";
import {
  DEFAULT_MAP_LAYERS,
  searchMap,
  configurationMap,
  recordedMember,
  recordedChapterHead,
  matchesStatus,
  illustrativeRecords,
  WORKSPACE_WORKFLOWS,
  SEARCH_WORKFLOW,
  workflowAdditionalServiceIds,
  workflowRequiredServiceIds,
  personMapLabel,
} from "./workspace-map";
import { readWorkspaceMaps } from "./workspace-storage";
import { EMPTY } from "./filters";
const record = (code: string, more: Partial<Expert> = {}): Expert => ({
  id: 1,
  code,
  displayName: "Coded test profile",
  sector: "Recorded sector",
  country: "Ukraine",
  identityStatus: "Confirmed",
  verified: true,
  confidence: "Source field",
  communityRole: "Member / participant",
  crmStage: "",
  priority: "",
  tags: [],
  primaryExpertise: "Recorded specialisation",
  ukraineTheme: "",
  ukraineCategory: "",
  evidence: "",
  contribution: "",
  potentialRole: "",
  ...more,
});
test("overview retains unreviewed records and distinguishes expertise from economic sector without an ISRM hub", () => {
  const data = [record("TEST-A"), record("TEST-B", { verified: false })];
  const map = searchMap(data, DEFAULT_MAP_LAYERS, false, 1000, 600);
  assert.equal(map.nodes.filter((n) => n.kind === "person").length, 2);
  assert(
    map.nodes.some((n) => n.kind === "expertise" && n.label.includes("Recorded specialisation")),
  );
  assert(map.nodes.some((n) => n.kind === "sector" && n.label.includes("Recorded sector")));
  assert(!map.nodes.some((n) => n.id === "isrm" || n.label === "ISRM"));
  assert(personMapLabel(data[0]!, false).startsWith("Recorded specialisation · TEST-A"));
});
test("source confirmation and generic role labels cannot establish AI/peer review or attributed ISRM membership", () => {
  const e = record("TEST-A");
  assert(!matchesStatus(e, "ai"));
  assert(!matchesStatus(e, "peer"));
  assert(!recordedMember(e));
  assert(!recordedMember({ ...e, communityRole: "Member" }));
  assert(recordedMember({ ...e, communityRole: "ISRM Member" }));
  assert(!recordedChapterHead({ ...e, communityRole: "Chapter head" }));
  assert(recordedChapterHead({ ...e, communityRole: "ISRM chapter head" }));
  assert(
    !recordedChapterHead({
      ...e,
      communityRole: "Chapter participant",
      role: "Head of finance",
      organization: "ISRM",
    }),
  );
});
test("configuration has named capabilities and non-interactive field-availability illustrations, with no ISRM hub", () => {
  const e = [record("TEST-A"), record("TEST-B", { evidence: "Supplied evidence" })];
  assert.equal(illustrativeRecords("research", e, []).length, 1);
  assert.equal(illustrativeRecords("evidence", e, []).length, 1);
  assert.equal(illustrativeRecords("groups", e, []).length, 0);
  assert.deepEqual(
    illustrativeRecords("contact", e, ["TEST-B"]).map((person) => person.code),
    ["TEST-B"],
  );
  const map = configurationMap(e, false, 1000, 600, "research", null, false, []);
  assert(map.nodes.some((n) => n.kind === "illustration"));
  assert(!map.nodes.some((n) => n.kind === "person" || n.id === "isrm"));
  assert(map.nodes.filter((n) => n.kind === "illustration").every((n) => !n.code));
  const dependencies = configurationMap(e, false, 1000, 600, "research", null, true, []);
  assert(!dependencies.nodes.some((n) => n.kind === "illustration"));
});
test("cycle keeps the actual workflow order and closes the repeatable scenario", () => {
  const flow = WORKSPACE_WORKFLOWS[0]!;
  const map = configurationMap([], false, 1000, 600, "search", flow.id, false, []);
  assert.deepEqual(
    map.nodes.filter((n) => n.kind === "function").map((n) => n.functionId),
    flow.serviceIds,
  );
  assert.equal(map.links.at(-1)?.target, "function:" + flow.serviceIds[0]);
  assert(!map.nodes.some((n) => n.kind === "workflow" || n.id === "isrm"));
});
test("derived examples list only incremental functions and inherit the foundation once", () => {
  for (const id of ["engagement", "expertise", "monitoring"]) {
    const additional = workflowAdditionalServiceIds(id);
    const required = workflowRequiredServiceIds(id);
    assert.deepEqual(
      required.filter((serviceId) => SEARCH_WORKFLOW.serviceIds.includes(serviceId)),
      [...SEARCH_WORKFLOW.serviceIds],
    );
    assert(additional.every((serviceId) => !SEARCH_WORKFLOW.serviceIds.includes(serviceId)));
    assert.deepEqual(required, [...new Set([...SEARCH_WORKFLOW.serviceIds, ...additional])]);
  }
  assert.deepEqual(workflowAdditionalServiceIds("search"), [...SEARCH_WORKFLOW.serviceIds]);
  assert.deepEqual(workflowRequiredServiceIds("unknown"), []);
});
test("saved searches round-trip filters, layers, status requirements and the actual image; malformed data is rejected", () => {
  const s = {
    id: "test-map",
    name: "Test search",
    filters: { ...EMPTY, country: "Ukraine" },
    layers: { ...DEFAULT_MAP_LAYERS, countries: false },
    status: { ai: "unknown", peer: "any", membership: "yes", chapter: "any" },
    image: "data:image/png;base64,AA==",
    codes: ["TEST-A"],
    anchor: "country:Ukraine",
  };
  assert.deepEqual(readWorkspaceMaps(JSON.stringify([s])), [s]);
  const legacy = { ...s };
  delete legacy.anchor;
  assert.deepEqual(readWorkspaceMaps(JSON.stringify([legacy])), [legacy]);
  assert.throws(() => readWorkspaceMaps(JSON.stringify([{ ...s, filters: { q: 4 } }])));
  assert.throws(() =>
    readWorkspaceMaps(JSON.stringify([{ ...s, image: "https://external.example/profile.png" }])),
  );
  assert.throws(() => readWorkspaceMaps("{unreadable"));
});

test("the full supplied overview keeps every public record as a distinct, separated node", async () => {
  const { buildExperts } = await import("./experts.server");
  const records = buildExperts("guest");
  for (const [width, height] of [
    [1000, 600],
    [240, 525],
  ]) {
    const map = searchMap(records, DEFAULT_MAP_LAYERS, false, width!, height!);
    const people = map.nodes.filter((n) => n.kind === "person");
    assert.deepEqual(new Set(people.map((n) => n.code)), new Set(records.map((r) => r.code)));
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const a = people[i]!,
          b = people[j]!;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        assert(distance > a.size + b.size + 6, `overlapping records: ${a.id}, ${b.id}`);
      }
    }
  }
});

test("the largest capability illustration retains actual available records without merging their glyphs", async () => {
  const { buildExperts } = await import("./experts.server");
  const records = buildExperts("guest");
  const expected = illustrativeRecords("integration", records, []);
  const map = configurationMap(records, false, 1000, 600, "integration", null, false, []);
  const people = map.nodes.filter((n) => n.kind === "illustration");
  assert.equal(people.length, expected.length);
  assert(people.length > 0);
  for (let i = 0; i < people.length; i++)
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i]!,
        b = people[j]!;
      assert(Math.hypot(a.x - b.x, a.y - b.y) > a.size + b.size + 6);
    }
  assert(people.every((n) => !n.code));
  assert(
    map.links
      .filter((e) => e.kind === "illustration")
      .every((e) => e.target === "function:integration"),
  );
});
