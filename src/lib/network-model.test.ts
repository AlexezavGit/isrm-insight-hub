import test from "node:test";
import assert from "node:assert/strict";
import {
  buildNetwork,
  relatedPeople,
  categoryNeighbors,
  networkNeighborhood,
} from "./network-model";
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
  assert.equal(relatedPeople(g, ["workflow:search"]).size, 2);
  assert(!g.nodes.some((n) => /AI.*verified|out of compliance/i.test(n.label)));
});

test("all workflow entry paths retain service exclusions", async () => {
  const { workflowServices } = await import("./network-model");
  assert(!workflowServices("expertise", ["research"]).includes("research"));
  assert(workflowServices("expertise", []).includes("search"));
  assert(!workflowServices("core", ["contact"]).includes("contact"));
  assert.deepEqual(workflowServices("unknown", []), []);
});

test("derived workflows share one search foundation and link only their added capabilities", () => {
  const graph = buildNetwork(
    [],
    { sector: false, theme: false, hub: false, researchQueue: false },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false },
  );
  const nodes = graph.nodes.filter((node) => node.kind === "workflow");
  assert.equal(nodes.filter((node) => node.id === "workflow:search").length, 1);
  assert(!nodes.some((node) => node.id === "workflow:core"));
  for (const id of ["engagement", "expertise", "monitoring"]) {
    assert(
      graph.links.some(
        (link) =>
          link.source === `workflow:${id}` &&
          link.target === "workflow:search" &&
          link.kind === "foundation",
      ),
    );
    assert(
      !graph.links.some(
        (link) =>
          link.source === `workflow:${id}` &&
          ["svc:search", "svc:review", "svc:groups", "svc:contact"].includes(link.target),
      ),
      `${id} must not repeat base capabilities`,
    );
  }
  const neighborhood = networkNeighborhood(graph, "workflow:engagement");
  assert(neighborhood.distances.has("workflow:search"));
  assert(neighborhood.distances.has("svc:search"));
  assert(neighborhood.distances.has("svc:survey"));
});

test("the proposed conceptual core is explicit and connects only to the base search workflow", () => {
  const graph = buildNetwork(
    [],
    { sector: false, theme: false, hub: false, researchQueue: false },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false, includeProposedCore: true },
  );
  const core = graph.nodes.find((node) => node.id === "core:expertise-trust");
  assert.equal(core?.kind, "core");
  assert.match(core?.label ?? "", /Proposed core/i);
  assert(
    graph.links.some(
      (link) =>
        link.source === "core:expertise-trust" &&
        link.target === "workflow:search" &&
        link.kind === "core",
    ),
  );
  assert(
    !graph.links.some(
      (link) => link.source === "core:expertise-trust" && link.target !== "workflow:search",
    ),
  );
  const neighborhood = networkNeighborhood(graph, "core:expertise-trust");
  assert(neighborhood.distances.has("workflow:search"));
  assert(neighborhood.distances.has("svc:search"));
});

test("person exploration follows shared recorded categories without using universal service or sample edges", () => {
  const g = buildNetwork(
    [person("A"), person("B"), person("C", { sector: "Energy" })],
    { sector: true, theme: false, hub: false, researchQueue: false },
    "en",
  );
  const connected = categoryNeighbors(g, "A");
  assert(connected.has("B"), "a shared recorded sector provides a two-step path");
  assert(connected.has("sector:Risk"));
  assert(!connected.has("C"), "shared sample provenance is not a personal connection");
  assert(!connected.has("isrm"));
  assert(!connected.has("svc:search"));
});

test("phone-code country remains visible but does not expand or clutter a focused person view", () => {
  const g = buildNetwork(
    [person("A"), person("B"), person("C", { sector: "Humanitarian" })],
    {
      sector: true,
      theme: false,
      hub: false,
      country: true,
      researchQueue: false,
    },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false },
  );
  const neighborhood = networkNeighborhood(g, "A");
  assert(neighborhood.distances.has("country:United Kingdom"));
  assert(neighborhood.distances.has("sector:Risk"));
  assert(neighborhood.distances.has("B"), "shared recorded sector remains explorable");
  assert(!neighborhood.distances.has("C"), "phone-code country does not create a peer path");
  assert(
    neighborhood.links.some(
      (edge) => edge.source === "A" && edge.target === "country:United Kingdom",
    ),
    "the focused person's country attribute remains visible",
  );
  assert(
    !neighborhood.links.some(
      (edge) =>
        (edge.source === "B" && edge.target === "country:United Kingdom") ||
        (edge.target === "B" && edge.source === "country:United Kingdom"),
    ),
    "a peer reached through another category is not linked by country as a second explanation",
  );
});

test("record status never falls back to a professional role", () => {
  const g = buildNetwork(
    [person("A", { identityStatus: "", communityRole: "Board" })],
    { sector: false, theme: false, hub: false, rank: true, researchQueue: false },
    "en",
  );
  assert(!g.nodes.some((n) => n.id === "record-status:Board"));
});

test("workspace projection omits the permanent hub and illustrative person-service coverage", () => {
  const g = buildNetwork(
    [person("A", { communityRole: "ISRM member", role: "ISRM chapter chair" }), person("B")],
    {
      sector: true,
      theme: false,
      hub: false,
      researchQueue: true,
      membership: true,
      chapter: true,
    },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false },
  );
  const ids = new Set(g.nodes.map((node) => node.id));
  assert(!ids.has("isrm"));
  assert(ids.has("workflow:search"));
  assert(ids.has("membership:recorded"));
  assert(ids.has("chapter:recorded"));
  assert(g.links.some((link) => link.source === "workflow:search" && link.target === "svc:search"));
  assert(!g.links.some((link) => link.kind === "coverage"));
  assert(!g.links.some((link) => link.source === "A" && link.target.startsWith("svc:")));
  assert(!g.links.some((link) => link.source === "isrm" || link.target === "isrm"));
});
