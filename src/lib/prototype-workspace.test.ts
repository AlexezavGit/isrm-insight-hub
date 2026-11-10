import test from "node:test";
import assert from "node:assert/strict";
import {
  initialWorkspace,
  changeWorkspace,
  openWorkspacePanels,
  prototypeLayout,
  type WorkspaceAction,
} from "./prototype-workspace";

test("search, inspection and addition replace the pair and preserve the shortlist neighbour when expanded", () => {
  let s = initialWorkspace();
  assert.deepEqual(openWorkspacePanels(s), []);
  s = changeWorkspace(s, { type: "search" });
  assert.deepEqual(openWorkspacePanels(s), ["search", "results"]);
  s = changeWorkspace(s, { type: "inspect", origin: "results" });
  assert.deepEqual(openWorkspacePanels(s), ["results", "profile"]);
  s = changeWorkspace(s, { type: "full", full: true });
  s = changeWorkspace(s, { type: "add" });
  assert.equal(s.full, false);
  assert.deepEqual(openWorkspacePanels(s), ["profile", "shortlist"]);
  s = changeWorkspace(s, { type: "full", full: true });
  assert.equal(s.origin, "shortlist");
  assert.deepEqual(openWorkspacePanels(s), ["profile", "shortlist"]);
  s = changeWorkspace(s, { type: "inspect", origin: "shortlist" });
  assert.equal(s.full, false);
  assert.deepEqual(openWorkspacePanels(s), ["profile", "shortlist"]);
});

test("show graph and collapse retain recoverable context; close removes the spine without deleting the remembered view", () => {
  let s = changeWorkspace(initialWorkspace("search"), { type: "inspect" });
  s = changeWorkspace(s, { type: "graph" });
  assert.deepEqual(openWorkspacePanels(s), []);
  assert(s.known.includes("search") && s.known.includes("profile"));
  s = changeWorkspace(s, { type: "restore", panel: "profile" });
  assert.deepEqual(openWorkspacePanels(s), ["results", "profile"]);
  s = changeWorkspace(s, { type: "close", panel: "results" });
  assert(s.closed.includes("results"));
  s = changeWorkspace(s, { type: "restore", panel: "search" });
  assert.deepEqual(openWorkspacePanels(s), ["search", "results"]);
});

test("reopening a shortlist focuses it immediately rather than toggling a hidden open flag", () => {
  let s = changeWorkspace(initialWorkspace("search"), { type: "inspect" });
  s = changeWorkspace(s, { type: "add" });
  s = changeWorkspace(s, { type: "graph" });
  s = changeWorkspace(s, { type: "shortlist" });
  assert.deepEqual(openWorkspacePanels(s), ["profile", "shortlist"]);
  assert.equal(s.focus, "shortlist");
  assert.deepEqual(changeWorkspace(s, { type: "shortlist" }), s);
});

test("all action sequences retain at most a working pair; narrow layouts and full dossiers yield neighbours to spines", () => {
  const actions: WorkspaceAction[] = [
    { type: "search" },
    { type: "inspect" },
    { type: "add" },
    { type: "graph" },
    { type: "full", full: true },
    ...(["search", "results", "profile", "shortlist"] as const).flatMap(
      (panel) =>
        [
          { type: "close", panel },
          { type: "collapse", panel },
          { type: "restore", panel },
        ] as WorkspaceAction[],
    ),
  ];
  const widths = { search: 300, results: 300, profile: 560, shortlist: 330 };
  for (const a of actions)
    for (const b of actions)
      for (const c of actions) {
        const s = [a, b, c].reduce(changeWorkspace, initialWorkspace());
        assert(openWorkspacePanels(s).length <= 2);
        for (const viewport of [390, 1100, 1440]) {
          const layout = prototypeLayout(viewport, s, widths);
          assert(layout.panels.length <= (viewport < 1100 ? 1 : 2));
          assert(layout.width <= viewport);
          assert(layout.panels.every((p) => !layout.rails.includes(p)));
          if (viewport >= 1100) assert(layout.graph >= 280);
        }
      }
});
