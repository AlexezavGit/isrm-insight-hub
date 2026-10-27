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
  assert.deepEqual(selectedServiceIds(d), ["search", "groups", "review", "evidence"]);
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

import { clientQuote, CLIENT_APPROVED_PRICES } from "./client-pricing";
test("approved scope prices add up and unpriced requirements stay unknown", () => {
  assert.equal(clientQuote(emptyDraft()), 33600);
  assert.equal(
    clientQuote(updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] })),
    33600,
  );
  const graph = updateDraft(emptyDraft(), { mode: "graph" });
  assert.equal(clientQuote(graph), 10080);
  assert.equal(
    clientQuote(updateDraft(graph, { serviceIds: ["groups", "contact", "research"] })),
    null,
  );
  assert.equal(clientQuote(updateDraft(graph, { serviceIds: ["integration"] })), 10080);
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
  assert.ok(buildClientSummary(d, "en").includes("GBP 33600"));
});

test("workflow interest is unpriced in the exported proposal", () => {
  const d = updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] });
  const summary = buildClientSummary(d, "uk");
  assert.equal(clientQuote(d), clientQuote(emptyDraft()));
  assert.match(summary, /ПОГОДЖУЮ · ДОДАТИ ДО РОЗРАХУНКІВ У ПРОПОЗИЦІЇ/);
  assert.doesNotMatch(summary, /GBP 10000|GBP 12000/);
});

test("workflow interest never changes an agreed core amount", () => {
  const prices = { ...CLIENT_APPROVED_PRICES, base: 30000 };
  assert.equal(clientQuote(emptyDraft(), prices), 30000);
  assert.equal(
    clientQuote(updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] }), prices),
    30000,
  );
});

test("fallback replaces all higher selections and charges only optional researcher integration", () => {
  const before = updateDraft(emptyDraft(), {
    workflowIds: ["engagement", "expertise"],
    integrationInterest: true,
  });
  const fallback = updateDraft(before, { mode: "graph" });
  assert.deepEqual(fallback.workflowIds, []);
  assert.equal(fallback.integrationInterest, false);
  assert.deepEqual(fallback.serviceIds, []);
  const prices = {
    ...CLIENT_APPROVED_PRICES,
    base: 30000,
    graph: 9000,
    addons: { research: 2000 },
  };
  assert.equal(clientQuote(fallback, prices), 9000);
  const integrated = updateDraft(fallback, { serviceIds: ["research"] });
  assert.equal(clientQuote(integrated, prices), 11000);
  assert.equal(clientQuote(integrated, { ...prices, addons: { research: 0 } }), 9000);
  assert.equal(clientQuote(integrated, { ...prices, addons: { research: null } }), null);
  assert.doesNotMatch(buildClientSummary(fallback, "uk"), /погоджую опрацювання AI-консультанта/);
});
test("legacy drafts default next-iteration interest to false", () => {
  const { integrationInterest, ...legacy } = emptyDraft();
  assert.equal(parseDraft(JSON.stringify(legacy)).integrationInterest, false);
});

test("fallback research integration and individual requests are mutually exclusive", () => {
  let d = updateDraft(emptyDraft(), { mode: "graph" });
  d = updateDraft(d, { serviceIds: ["research"] });
  d = updateDraft(d, { oneOffResearch: true });
  assert.equal(d.oneOffResearch, true);
  assert.ok(!d.serviceIds.includes("research"));
  d = updateDraft(d, { serviceIds: ["research"] });
  assert.equal(d.oneOffResearch, false);
  assert.ok(d.serviceIds.includes("research"));
});

import { buildClientMarkdown, scopeDocumentSections } from "./scope-document";
test("Markdown and structured print retain the canonical request", () => {
  const d = updateDraft(emptyDraft(), {
    notes: "Зберегти цей рядок",
    requests: [
      {
        id: "scope-manual",
        kind: "workflow",
        title: "My requirement",
        description: "Exact request",
      },
    ],
  });
  const md = buildClientMarkdown(d, "en");
  assert.ok(md.startsWith("# ISRM"));
  assert.ok(md.includes("## SERVICES"));
  assert.ok(md.includes("Exact request"));
  assert.ok(md.includes("Зберегти цей рядок"));
  const parsed = scopeDocumentSections(buildClientSummary(d, "en"));
  assert.ok(
    parsed.sections.some(
      (s) => s.title === "CUSTOM REQUESTS" && s.lines.some((l) => l.includes("Exact request")),
    ),
  );
});

test("a new draft starts with an indicative approve preference; changing the scope still requires review", () => {
  const d = emptyDraft();
  assert.equal(d.budgetPosition, "approve");
  assert.equal(
    updateDraft(d, {
      requests: [
        {
          id: "custom",
          kind: "service",
          title: "Mailing",
          description: "Permission-based member mailing",
        },
      ],
    }).budgetPosition,
    "discuss",
  );
  assert.equal(
    parseDraft(JSON.stringify({ ...d, budgetPosition: "limit", budgetCeiling: "20000" }))
      .budgetPosition,
    "limit",
  );
});

test("a custom graph request is retained in the shared email, Markdown and PDF source", async () => {
  const { buildClientMarkdown, scopeDocumentSections } = await import("./scope-document");
  const d = updateDraft(emptyDraft(), {
    requests: [
      {
        id: "preview-check",
        kind: "workflow",
        title: "Member enquiry review",
        description: "Check permission, record the review and retain the outcome.",
      },
    ],
  });
  const summary = buildClientSummary(d, "en");
  assert(summary.includes("Member enquiry review"));
  assert(
    buildClientMarkdown(d, "en").includes(
      "Check permission, record the review and retain the outcome.",
    ),
  );
  assert(
    scopeDocumentSections(summary).sections.some((s) =>
      s.lines.some((l) => l.includes("Member enquiry review")),
    ),
  );
});
