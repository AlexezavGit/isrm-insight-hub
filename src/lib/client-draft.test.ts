import { test } from "node:test";
import assert from "node:assert/strict";
import { RESPONSE_CONTACT, responseEmailHref } from "./client-response";
import {
  SCOPE_DELIVERY_HEADING,
  SCOPE_DELIVERY_STATUS,
  scopeDeliveryNotes,
} from "./scope-delivery-notes";
import {
  emptyDraft,
  parseDraft,
  updateDraft,
  selectedServiceIds,
  buildClientSummary,
  emailHref,
  includeClientRequest,
} from "./client-draft";

test("re-including an existing survey restores it without duplicates or changing the fallback", () => {
  const request = {
    id: "member-survey",
    kind: "service" as const,
    title: "Member survey",
    description: "Agree recipients and permissions before launch.",
  };
  const before = updateDraft(emptyDraft(), {
    mode: "graph",
    requests: [request],
    customIncluded: false,
  });
  const after = includeClientRequest(before, request);
  assert.equal(after.mode, "graph");
  assert.equal(after.customIncluded, true);
  assert.deepEqual(after.requests, [request]);
  assert.equal(clientQuote(after), clientQuote(before));
  assert.equal(after.budgetPosition, "discuss");
  for (const locale of ["en", "uk"] as const) {
    const summary = buildClientSummary(after, locale);
    assert(summary.includes(request.description));
    assert(buildClientMarkdown(after, locale).includes(request.description));
    assert(
      scopeDocumentSections(summary).sections.some((s) => s.lines.includes(request.description)),
    );
    assert.equal(new URL(emailHref(after, locale)).searchParams.get("body"), summary);
  }
  assert.match(
    buildClientSummary(after, "en"),
    /Excluded from the selected simpler option and its price/,
  );
  assert(!buildClientSummary(before, "en").includes(request.description));
});

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
  assert.equal(url.pathname, RESPONSE_CONTACT.email);
  assert.equal(url.searchParams.get("body"), buildClientSummary(d, "uk"));
});

test("board responses do not export obsolete identity fields and long-message handoff uses the same recipient", () => {
  const draft = updateDraft(emptyDraft(), {
    name: "Legacy name to omit",
    email: "legacy@example.invalid",
  });
  for (const locale of ["en", "uk"] as const) {
    const summary = buildClientSummary(draft, locale);
    assert(!summary.includes("Legacy name to omit"));
    assert(!summary.includes("legacy@example.invalid"));
    assert.equal(
      new URL(responseEmailHref("Attach the full request")).pathname,
      new URL(emailHref(draft, locale)).pathname,
    );
  }
});

test("delivery arrangements remain one complete section in all exports and routes without changing the quote", () => {
  for (const [mode, expected] of [
    ["full", 33600],
    ["graph", 10080],
    ["research-only", null],
  ] as const) {
    const draft = updateDraft(emptyDraft(), { mode });
    for (const locale of ["en", "uk"] as const) {
      const summary = buildClientSummary(draft, locale);
      const sections = scopeDocumentSections(summary).sections.filter(
        (section) => section.title === SCOPE_DELIVERY_HEADING[locale],
      );
      assert.equal(sections.length, 1);
      assert(sections[0]!.lines.includes(SCOPE_DELIVERY_STATUS[locale]));
      const paragraphs = sections[0]!.lines.filter((line) => line.startsWith("• "));
      assert.equal(paragraphs.length, 5);
      for (const note of scopeDeliveryNotes(locale)) {
        assert(paragraphs.some((line) => line.includes(note.body)));
        assert(buildClientMarkdown(draft, locale).includes(note.body));
      }
      assert.equal(new URL(emailHref(draft, locale)).searchParams.get("body"), summary);
      assert.equal(clientQuote(draft), expected);
    }
  }
});

import {
  clientQuote,
  CLIENT_APPROVED_PRICES,
  clientQuoteRange,
  clientPriceLines,
} from "./client-pricing";
test("individual research replaces development selections and remains unpriced in the receipt and exports", () => {
  const before = updateDraft(emptyDraft(), {
    workflowIds: ["engagement"],
    integrationInterest: true,
  });
  const draft = updateDraft(before, { mode: "research-only" });
  assert.deepEqual(draft.workflowIds, []);
  assert.equal(draft.integrationInterest, false);
  assert.equal(clientQuote(draft), null);
  for (const locale of ["en", "uk"] as const) {
    const lines = clientPriceLines(draft, locale);
    assert.equal(lines.length, 1);
    assert.equal(lines[0]!.value, null);
    assert.match(lines[0]!.title, locale === "en" ? /Research on request/ : /Разові дослідження/);
    const summary = buildClientSummary(draft, locale);
    assert(summary.includes(lines[0]!.title));
    assert.match(
      summary,
      locale === "en"
        ? /Indicative priced scope: To estimate/
        : /Індикативна сума оцінених позицій: До оцінки/,
    );
    assert.equal(new URL(emailHref(draft, locale)).searchParams.get("body"), summary);
  }
});
test("approved scope prices add up and unpriced requirements stay unknown", () => {
  assert.equal(clientQuote(emptyDraft()), 33600);
  assert.equal(
    clientQuote(updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] })),
    58380,
  );
  const graph = updateDraft(emptyDraft(), { mode: "graph" });
  assert.equal(clientQuote(graph), 10080);
  assert.equal(
    clientQuote(updateDraft(graph, { serviceIds: ["groups", "contact", "research"] })),
    15120,
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
  assert.ok(buildClientSummary(d, "en").includes("£33,600"));
});

test("workflow indicative prices are included in the exported proposal", () => {
  const d = updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] });
  const summary = buildClientSummary(d, "uk");
  assert.equal(clientQuote(d), 58380);
  assert.match(summary, /ПОГОДЖУЮ · ДОДАТИ ДО РОЗРАХУНКІВ У ПРОПОЗИЦІЇ/);
  assert.doesNotMatch(summary, /GBP 10000|GBP 12000/);
});

test("workflow prices add to the core without altering its own amount", () => {
  const prices = { ...CLIENT_APPROVED_PRICES, base: 30000 };
  assert.equal(clientQuote(emptyDraft(), prices), 30000);
  assert.equal(
    clientQuote(updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] }), prices),
    54780,
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

test("choosing a workflow from fallback restores the core and retains the requested workflow", () => {
  const fallback = updateDraft(emptyDraft(), {
    mode: "graph",
    requests: [{ id: "keep", kind: "service", title: "Keep", description: "Retain this request" }],
  });
  const next = updateDraft(fallback, { mode: "full", workflowIds: ["engagement"] });
  assert.equal(next.mode, "full");
  assert.deepEqual(next.workflowIds, ["engagement"]);
  assert.equal(next.requests[0]?.id, "keep");
  assert.equal(clientQuoteRange(next).low, 44940);
  assert.equal(clientQuote(next), null);
});

test("the future monitoring workflow survives storage and appears in all proposal exports", () => {
  const draft = updateDraft(emptyDraft(), { workflowIds: ["monitoring"] });
  assert.deepEqual(parseDraft(JSON.stringify(draft)).workflowIds, ["monitoring"]);
  assert.equal(clientQuote(draft), 42000);
  assert.match(buildClientSummary(draft, "en"), /Situational awareness & expert briefings/);
  assert.match(buildClientMarkdown(draft, "en"), /Future workflow/);
});

test("fallback researcher integration has an indicative amount and core never charges it twice", () => {
  assert.equal(clientQuote(emptyDraft()), 33600);
  const fallback = updateDraft(emptyDraft(), { mode: "graph" });
  assert.equal(clientQuote(updateDraft(fallback, { serviceIds: ["research"] })), 15120);
});

test("unknown requests keep the known subtotal visible and do not masquerade as zero", () => {
  const d = updateDraft(emptyDraft(), {
    workflowIds: ["engagement"],
    requests: [{ id: "custom", kind: "service", title: "Custom", description: "To scope" }],
  });
  assert.equal(clientQuote(d), null);
  assert.deepEqual(clientQuoteRange(d), { low: 44940, high: 46738, pending: true });
});

test("the restored requirement template retains all supplied fields in scope, Markdown and email", async () => {
  const { serviceFrameText } = await import("./service-request-frame");
  const description = serviceFrameText(
    {
      userRole: "Chapter Board",
      need: "Find an appropriate colleague",
      behavior: "Review then introduce",
      outcome: "An agreed introduction",
      dataIntegration: "Permission before contact",
      acceptance: "The recipient confirms the next step",
    },
    "en",
  );
  const d = updateDraft(emptyDraft(), {
    requests: [{ id: "template", kind: "workflow", title: "A chapter enquiry", description }],
  });
  for (const text of [
    buildClientSummary(d, "en"),
    buildClientMarkdown(d, "en"),
    new URL(emailHref(d, "en")).searchParams.get("body")!,
  ]) {
    assert(text.includes("Chapter Board"));
    assert(text.includes("Permission before contact"));
    assert(text.includes("The recipient confirms the next step"));
  }
});
