import test from "node:test";
import assert from "node:assert/strict";
import { buildNetwork } from "./network-model";
import { layoutNetwork, fitGraphView } from "./network-layout";
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
test("fitting uses visible wheel and selected people, not distant invisible nodes", () => {
  const pos = layoutNetwork(model, "services", [], []);
  pos.set("invisible", { x: 100000, y: 100000 });
  const ids = model.nodes
    .filter((n) => ["isrm", "service", "workflow"].includes(n.kind))
    .map((n) => n.id);
  const view = fitGraphView(pos, ids, "isrm", 900, 600);
  assert(view.zoom > 0.8);
  assert(view.zoom < 1.6);
  assert.equal(view.x, 0);
  assert.equal(view.y, 0);
  const selected = fitGraphView(pos, ids, "svc:research", 900, 600);
  assert.equal(selected.x, pos.get("svc:research")!.x);
});

test("choosing a person rebuilds the node layout with that person at the centre", () => {
  const positions = layoutNetwork(model, "people", [], [], "P0");
  assert.deepEqual(positions.get("P0"), { x: 0, y: 0 });
  assert(Math.hypot(positions.get("sector:Risk")!.x, positions.get("sector:Risk")!.y) > 80);
  assert(Math.hypot(positions.get("P1")!.x, positions.get("P1")!.y) > 180);
});
