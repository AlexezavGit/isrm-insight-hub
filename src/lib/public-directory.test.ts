import test from "node:test";
import assert from "node:assert/strict";
import {
  ISRM_PUBLIC_DIRECTORY,
  publicLeadershipGraph,
  publicRoleId,
  publicRole,
} from "./public-directory";
import { buildNetwork } from "./network-model";
import { layoutNetwork } from "./network-layout";

test("public institutional layer has source-backed roles, separate ids, complete links and positions", () => {
  const graph = publicLeadershipGraph(),
    ids = new Set(graph.nodes.map((n) => n.id)),
    points = layoutNetwork(graph, "people", [], [], "", false);
  assert.equal(ids.size, graph.nodes.length);
  assert(graph.links.every((e) => ids.has(e.source) && ids.has(e.target)));
  assert(graph.nodes.every((n) => points.has(n.id)));
  assert(!graph.nodes.some((n) => n.kind === "expert" || n.expert));
  const ireland = ISRM_PUBLIC_DIRECTORY.entries.find((u) => u.id === "ireland-chapter")!;
  assert(
    ireland.people.some((p) => p.name === "Garry Bergin" && p.role === "Ireland Chapter Chair"),
  );
  assert(
    ireland.people.some(
      (p) => p.name === "Paul Kellett" && p.role === "Ireland Chapter Vice-Chair",
    ),
  );
  assert.equal(publicRole(publicRoleId("Rob Currie"))!.appearances.length, 2);
  const caribbean = ISRM_PUBLIC_DIRECTORY.entries.find((u) => u.id === "caribbean-chapter")!;
  assert.equal(caribbean.people[0]!.role, "Caribbean Chapter");
  assert(!caribbean.people[0]!.role.includes("Chair"));
  assert.equal(publicRole(publicRoleId("Ivor Terret"))!.portraitAvailable, false);
});
test("enabling official roles does not create research profiles or imply private identity links", () => {
  const base = { sector: false, theme: false, hub: false, researchQueue: true };
  const sample = buildNetwork([], base, "en", {}, { includeHub: false });
  const withRoles = buildNetwork(
    [],
    { ...base, publicLeadership: true },
    "en",
    {},
    { includeHub: false },
  );
  assert.equal(
    sample.nodes.filter((n) => n.kind === "expert").length,
    withRoles.nodes.filter((n) => n.kind === "expert").length,
  );
  assert(
    withRoles.links
      .filter((e) => e.kind.startsWith("public-"))
      .every((e) => e.source.startsWith("public-") && /^(public-|country:)/.test(e.target)),
  );
});
