import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyDraft,
  parseDraft,
  updateDraft,
  selectedServiceIds,
  buildClientSummary,
  emailHref,
} from "./client-draft";

test("workflow services are deduplicated and fallback removes incompatible selections", () => {
  let d = updateDraft(emptyDraft(), {
    workflowIds: ["engagement", "expertise"],
    serviceIds: ["research"],
  });
  const ids = selectedServiceIds(d);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes("research"));
  d = updateDraft(d, { mode: "graph" });
  assert.deepEqual(d.workflowIds, []);
  assert.deepEqual(d.serviceIds, []);
  assert.deepEqual(selectedServiceIds(d), ["search"]);
});
test("draft roundtrip preserves requests, group and selections independently of language", () => {
  const d = updateDraft(emptyDraft(), {
    workflowIds: ["expertise"],
    shortlist: ["DEMO-001"],
    groupName: "Panel",
    requests: [
      {
        id: "r1",
        kind: "workflow",
        title: "My process",
        description: "Exact client text\nSecond line",
      },
    ],
  });
  const restored = parseDraft(JSON.stringify(d));
  assert.deepEqual(restored, d);
  for (const locale of ["en", "uk"] as const) {
    const summary = buildClientSummary(d, locale);
    assert.ok(summary.includes("Exact client text\nSecond line"));
    assert.ok(summary.includes("Panel"));
    assert.ok(summary.includes("DEMO-001"));
  }
});
test("invalid storage is rejected rather than silently overwritten", () => {
  assert.throws(() => parseDraft("{broken"));
  assert.throws(() => parseDraft('{"version":99}'));
  assert.throws(() =>
    parseDraft(JSON.stringify({ ...emptyDraft(), serviceIds: ["unknown-service"] })),
  );
});
test("email handoff encodes the complete summary without claiming delivery", () => {
  const d = updateDraft(emptyDraft(), { notes: "A&B + 100%\nІнтеграція" });
  const url = new URL(emailHref(d, "uk"));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.searchParams.get("body"), buildClientSummary(d, "uk"));
});

import { clientQuote } from "./client-pricing";
test("approved scope prices add up and unpriced requirements stay unknown", () => {
  assert.equal(clientQuote(emptyDraft()), 26000);
  assert.equal(clientQuote(updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] })), 48000);
  const graph = updateDraft(emptyDraft(), { mode: "graph" });
  assert.equal(clientQuote(graph), 7500);
  assert.equal(clientQuote(updateDraft(graph, { serviceIds: ["groups", "contact", "research"] })), 18000);
  assert.equal(clientQuote(updateDraft(graph, { serviceIds: ["integration"] })), null);
});
test("fallback add-ons remain selectable without restoring workflows", () => {
  let d = updateDraft(emptyDraft(), { workflowIds: ["engagement"], mode: "graph" });
  d = updateDraft(d, { serviceIds: ["research", "groups"] });
  assert.ok(selectedServiceIds(d).includes("research"));
  assert.ok(selectedServiceIds(d).includes("review"));
  assert.deepEqual(d.workflowIds, []);
});

test("returning from graph fallback restores the complete base scope", () => {
  const d = updateDraft(updateDraft(emptyDraft(), { mode: "graph" }), { mode: "full" });
  assert.ok(selectedServiceIds(d).includes("research"));
  assert.ok(selectedServiceIds(d).includes("integration"));
});

test("changing scope invalidates a previously accepted budget", () => {
  const d = { ...emptyDraft(), budgetPosition: "approve" as const };
  assert.equal(updateDraft(d, { workflowIds: ["engagement"] }).budgetPosition, "discuss");
  assert.equal(
    updateDraft(d, {
      requests: [{ id: "new", kind: "service", title: "New", description: "Unestimated" }],
    }).budgetPosition,
    "discuss",
  );
  assert.ok(buildClientSummary(d, "en").includes("GBP 26000"));
});
