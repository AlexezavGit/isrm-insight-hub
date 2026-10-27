import test from "node:test";
import assert from "node:assert/strict";
import { buildNetwork, relatedPeople } from "./network-model";
import type { Expert } from "./types";
const person = (code: string, extra: Partial<Expert> = {}) =>
  ({
    code,
    displayName: code,
    sector: "Risk",
    country: "UK",
    communityRole: "Member / participant",
    ukraineCategory: "Unclassified",
    primaryExpertise: "Risk",
    verified: true,
    tags: [],
    ...extra,
  }) as Expert;
test("one graph retains people and services while using only supplied organisations", () => {
  const g = buildNetwork(
    [person("A"), person("B", { organization: "Acme" })],
    { sector: true, theme: true, hub: true, researchQueue: false, organization: true },
    "en",
  );
  assert(g.nodes.some((n) => n.id === "isrm"));
  assert(g.nodes.some((n) => n.id === "A"));
  assert(g.nodes.some((n) => n.id === "svc:research"));
  assert(g.nodes.some((n) => n.label === "Acme" && n.kind === "organisation"));
  assert.equal(g.nodes.filter((n) => n.kind === "organisation").length, 1);
  const ids = new Set(g.nodes.map((n) => n.id));
  assert(g.links.every((l) => ids.has(l.source) && ids.has(l.target)));
  assert(!g.links.some((l) => l.source === "A" && l.target === "B"));
});
test("empty and filtered graphs never contain phantom people or dangling edges", () => {
  const g = buildNetwork([], { sector: true, theme: true, hub: true, researchQueue: false }, "uk");
  assert.equal(g.nodes.filter((n) => n.kind === "expert").length, 0);
  assert.equal(relatedPeople(g, ["svc:research"]).size, 0);
  const h = buildNetwork(
    [person("A", { verified: false })],
    { sector: true, theme: true, hub: true, researchQueue: false },
    "en",
  );
  assert(!h.nodes.some((n) => n.id === "A"));
});
test("workflow coverage is deduplicated and cannot imply acquaintance or AI verification", () => {
  const g = buildNetwork(
    [person("A"), person("B")],
    { sector: true, theme: true, hub: true, researchQueue: true, rank: true },
    "en",
  );
  assert.equal(relatedPeople(g, ["workflow:core"]).size, 2);
  assert(!g.nodes.some((n) => /AI.*verified|out of compliance/i.test(n.label)));
});

test("all workflow entry paths retain service exclusions", async () => {
  const { workflowServices } = await import("./network-model");
  assert(!workflowServices("expertise", ["research"]).includes("research"));
  assert(!workflowServices("core", ["contact"]).includes("contact"));
  assert.deepEqual(workflowServices("unknown", []), []);
});
