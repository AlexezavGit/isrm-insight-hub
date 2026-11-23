import test from "node:test";
import assert from "node:assert/strict";
import { buildNetwork } from "./network-model";
import {
  layoutNetwork,
  freeNetworkPositions,
  fitGraphView,
  interpolatePoint,
  transitionOrigins,
} from "./network-layout";
import type { Expert } from "./types";
const people = Array.from(
  { length: 45 },
  (_, i) =>
    ({
      id: i,
      code: "P" + i,
      displayName: "Profile " + i,
      verified: true,
      sector: "Risk",
      country: "UK",
      communityRole: "Member / participant",
      ukraineCategory: "Risk",
      primaryExpertise: "Risk consulting",
      tags: [],
      identityStatus: "Source record reviewed",
      confidence: "",
      crmStage: "",
      priority: "",
      ukraineTheme: "",
      evidence: "",
      contribution: "",
      potentialRole: "",
    }) as Expert,
);
const model = buildNetwork(
  people,
  { sector: true, theme: true, hub: true, researchQueue: false },
  "en",
);
test("the service wheel stays fixed while different people groups surface", () => {
  const a = layoutNetwork(model, "services", [], []),
    b = layoutNetwork(model, "services", ["research"], []),
    c = layoutNetwork(model, "services", ["contact", "groups"], []);
  for (const n of model.nodes.filter((n) => n.kind === "service")) {
    assert.deepEqual(a.get(n.id), b.get(n.id));
    assert.deepEqual(b.get(n.id), c.get(n.id));
    assert(Math.abs(Math.hypot(a.get(n.id)!.x, a.get(n.id)!.y) - 180) < 0.01);
  }
  assert.equal(
    new Set(
      people.map((p) => {
        const q = b.get(p.code)!;
        return q.x + ":" + q.y;
      }),
    ).size,
    45,
  );
  // A full cohort stays within the wheel's viewing area without moving the camera.
  for (const p of people) {
    const q = b.get(p.code)!;
    assert(Math.hypot(q.x, q.y) < 215);
  }
});

test("the proposed core anchors the configurator and leaves room for workflow labels", () => {
  const graph = buildNetwork(
    [],
    { sector: false, theme: false, hub: false, researchQueue: false },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false, includeProposedCore: true },
  );
  const ordered = layoutNetwork(graph, "services", [], [], "", false);
  assert.deepEqual(ordered.get("core:expertise-trust"), { x: 0, y: 0 });
  assert.equal(
    Math.round(Math.hypot(ordered.get("workflow:search")!.x, ordered.get("workflow:search")!.y)),
    200,
  );
  assert(Math.hypot(ordered.get("svc:search")!.x, ordered.get("svc:search")!.y) > 400);

  const free = freeNetworkPositions([...ordered.keys()], ordered, "");
  assert.deepEqual(free.get("core:expertise-trust"), { x: 0, y: 0 });
  assert.equal(free.size, ordered.size);

  const focused = layoutNetwork(graph, "services", [], [], "svc:search", false);
  assert.deepEqual(focused.get("svc:search"), { x: 0, y: 0 });
  assert.notDeepEqual(focused.get("core:expertise-trust"), { x: 0, y: 0 });
  assert(
    Math.hypot(focused.get("core:expertise-trust")!.x, focused.get("core:expertise-trust")!.y) >=
      200,
  );
});
test("fitting uses visible wheel and selected people, not distant invisible nodes", () => {
  const pos = layoutNetwork(model, "services", [], []);
  pos.set("invisible", { x: 100000, y: 100000 });
  const ids = model.nodes
    .filter((n) => ["isrm", "service", "workflow"].includes(n.kind))
    .map((n) => n.id);
  const view = fitGraphView(pos, ids, "isrm", 900, 600, false);
  assert(view.zoom > 0.8);
  assert(view.zoom < 1.6);
  assert.equal(view.x, 0);
  assert.equal(view.y, 0);
  const selected = fitGraphView(pos, ids, "svc:research", 900, 600);
  assert.equal(selected.x, pos.get("svc:research")!.x);
});

test("automatic expansion reaches readable labels while overview remains available", () => {
  const positions = layoutNetwork(model, "people", [], []);
  for (const width of [300, 600, 1200]) {
    const view = fitGraphView(positions, [...positions.keys()], "isrm", width, 500);
    assert(view.zoom >= 1.8);
    const overview = fitGraphView(positions, [...positions.keys()], "isrm", width, 500, false);
    assert(overview.zoom <= view.zoom);
  }
});

test("choosing a person rebuilds the node layout with that person at the centre", () => {
  const positions = layoutNetwork(model, "people", [], [], "P0");
  assert.deepEqual(positions.get("P0"), { x: 0, y: 0 });
  assert(Math.hypot(positions.get("sector:Risk")!.x, positions.get("sector:Risk")!.y) > 80);
  assert(Math.hypot(positions.get("P1")!.x, positions.get("P1")!.y) > 180);
});

test("structured people categories have separate expertise, sector and country rings", () => {
  const g = buildNetwork(
    people,
    {
      sector: true,
      theme: false,
      hub: false,
      researchQueue: false,
      specialisation: true,
      country: true,
      publicLeadership: true,
    },
    "en",
  );
  const points = layoutNetwork(g, "people", [], []);
  const radius = (id: string) => Math.hypot(points.get(id)!.x, points.get(id)!.y);
  const representatives = g.nodes.filter((node) => node.id.startsWith("public-person:"));
  assert(representatives.length > 0);
  assert(representatives.every((node) => radius(node.id) < radius("expertise:Risk consulting")));
  assert(radius("expertise:Risk consulting") < radius("sector:Risk"));
  assert(radius("sector:Risk") < radius("country:United Kingdom"));
  assert.deepEqual(points.get("isrm"), { x: 0, y: 0 });
});

test("workspace layout places recorded people and categories without an artificial centre node", () => {
  const projection = buildNetwork(
    people.slice(0, 3),
    {
      sector: true,
      theme: false,
      hub: false,
      researchQueue: true,
      specialisation: true,
    },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false },
  );
  const positions = layoutNetwork(projection, "people", [], [], "", false);
  assert(!positions.has("isrm"));
  for (const node of projection.nodes) assert(positions.has(node.id), node.id);
  assert(Math.abs(positions.get("sector:Risk")!.x) < 1e-10);
  assert.equal(positions.get("sector:Risk")!.y, -310);
  assert(Math.hypot(positions.get("P0")!.x, positions.get("P0")!.y) > 200);
});

test("the workspace keeps category rings outside the complete people sample during category focus", async () => {
  const { buildExperts } = await import("./experts.server");
  const model = buildNetwork(
    buildExperts("guest"),
    {
      sector: true,
      theme: false,
      hub: false,
      researchQueue: true,
      specialisation: true,
      country: true,
      publicLeadership: true,
    },
    "en",
    {},
    { includeHub: false, includeServiceCoverage: false },
  );
  const rings = ["expertise:", "sector:", "country:"].map((prefix) =>
    model.nodes.filter((node) => node.id.startsWith(prefix)).map((node) => node.id),
  );
  const peopleAndRepresentatives = model.nodes.filter(
    (node) => node.kind === "expert" || node.id.startsWith("public-person:"),
  );
  const arrange = (anchor: string) =>
    layoutNetwork(model, "people", [], [], anchor, false, {
      keepPeopleInsideRings: true,
    });
  const overview = arrange("");
  for (const anchor of ["", ...rings.map((ids) => ids[0]!)]) {
    const positions = arrange(anchor);
    assert.deepEqual(positions, overview);
    const radius = (id: string) => Math.hypot(positions.get(id)!.x, positions.get(id)!.y);
    let edge = Math.max(...peopleAndRepresentatives.map((node) => radius(node.id)));
    for (const ring of rings) {
      assert(ring.length > 0);
      assert(Math.min(...ring.map(radius)) - edge > 30);
      for (const id of ring) assert.deepEqual(positions.get(id), overview.get(id));
      edge = Math.max(...ring.map(radius));
    }
    const visible = [...positions.keys()];
    const camera = fitGraphView(positions, visible, anchor, 288, 212, false, 0.08);
    assert.deepEqual({ x: camera.x, y: camera.y }, positions.get(anchor) ?? { x: 0, y: 0 });
    for (const { x, y } of positions.values()) {
      assert(Math.abs(x - camera.x) * camera.zoom < 144);
      assert(Math.abs(y - camera.y) * camera.zoom < 106);
    }
  }
});

test("the dispersed opening layout is deterministic, spread around the anchor, and non-collapsed", () => {
  const positions = layoutNetwork(model, "people", [], [], "P0");
  const ids = model.nodes.map((node) => node.id);
  const first = freeNetworkPositions(ids, positions, "P0");
  const second = freeNetworkPositions([...ids].reverse(), positions, "P0");
  assert.deepEqual(first, second);
  assert.deepEqual(first.get("P0"), { x: 0, y: 0 });
  assert.equal(first.size, ids.length);
  assert(new Set([...first.values()].map(({ x, y }) => `${x}:${y}`)).size, ids.length);
  assert([...first.values()].some((point) => Math.hypot(point.x, point.y) > 180));
  assert(![...first.values()].every((point) => Math.hypot(point.x, point.y) < 10));
});

test("the ordered transition interpolates continuously from the live layout to fixed positions", () => {
  const from = { x: -120, y: 80 };
  const to = { x: 240, y: -160 };
  assert.deepEqual(interpolatePoint(from, to, 0), from);
  assert.deepEqual(interpolatePoint(from, to, 1), to);
  const middle = interpolatePoint(from, to, 0.5);
  assert(middle.x > from.x && middle.x < to.x);
  assert(middle.y < from.y && middle.y > to.y);
  assert.deepEqual(interpolatePoint(from, to, -1), from);
  assert.deepEqual(interpolatePoint(from, to, 2), to);
});

test("new nodes begin at an existing visible neighbour instead of appearing at their destination", () => {
  const previous = new Map([
    ["anchor", { x: 0, y: 0 }],
    ["neighbour", { x: 40, y: 25 }],
    ["unrelated", { x: -30, y: 15 }],
  ]);
  const targets = new Map([
    ["anchor", { x: 0, y: 0 }],
    ["neighbour", { x: 120, y: 0 }],
    ["new-node", { x: 200, y: 80 }],
    ["orphan", { x: -90, y: 60 }],
  ]);
  const origins = transitionOrigins(
    ["anchor", "neighbour", "new-node", "orphan"],
    [
      { source: "new-node", target: "neighbour" },
      { source: "new-node", target: "anchor" },
    ],
    previous,
    targets,
    "anchor",
  );
  assert.deepEqual(origins.get("new-node"), previous.get("anchor"));
  assert.deepEqual(origins.get("orphan"), { x: 0, y: 0 });
  assert.deepEqual(origins.get("neighbour"), previous.get("neighbour"));
});

test("disconnected additions start at the nearest previously visible node", () => {
  const previous = new Map([
    ["departing-node", { x: -40, y: 20 }],
    ["distant-node", { x: 300, y: 240 }],
  ]);
  const targets = new Map([["arriving-node", { x: -55, y: 35 }]]);
  const origins = transitionOrigins(["arriving-node"], [], previous, targets, "missing-anchor");
  assert.deepEqual(origins.get("arriving-node"), previous.get("departing-node"));
});
