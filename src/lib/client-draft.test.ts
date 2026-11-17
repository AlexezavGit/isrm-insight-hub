import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyDraft,
  parseDraft,
  updateDraft,
  selectedServiceIds,
  buildClientSummary,
  emailHref,
  includeClientRequest,
} from "./client-draft";
import { serviceSelectionChanges } from "./tailored-scope";
import { buildClientMarkdown, scopeDocumentSections } from "./scope-document";

test("service selections directly define the estimate request, independently of workflow examples", () => {
  const draft = updateDraft(
    emptyDraft(),
    serviceSelectionChanges(
      updateDraft(emptyDraft(), { workflowIds: ["engagement", "expertise"] }),
      ["search", "groups", "research"],
    ),
  );

  assert.equal(draft.mode, "full");
  assert.deepEqual(draft.workflowIds, []);
  assert.deepEqual([...selectedServiceIds(draft)].sort(), ["groups", "research", "search"]);

  const workflowOnly = updateDraft(emptyDraft(), { workflowIds: ["engagement"] });
  assert.deepEqual(selectedServiceIds(workflowOnly), []);
});

test("changing selected functions clears a previous scope confirmation", () => {
  const selected = updateDraft(emptyDraft(), {
    packageServices: { core: ["search", "groups"] },
  });
  const confirmed = updateDraft(selected, { scopeConfirmed: true });

  assert.equal(confirmed.scopeConfirmed, true);
  assert.equal(
    updateDraft(confirmed, { notes: "Please call in the afternoon." }).scopeConfirmed,
    true,
  );
  assert.equal(
    updateDraft(confirmed, { packageServices: { core: ["search"] } }).scopeConfirmed,
    false,
  );
  assert.equal(updateDraft(confirmed, { serviceIds: ["research"] }).scopeConfirmed, false);
});

test("summary identifies included and omitted functions without approving workflows or quoting prices", () => {
  const draft = updateDraft(
    emptyDraft(),
    serviceSelectionChanges(emptyDraft(), ["search", "groups"]),
  );

  for (const locale of ["en", "uk"] as const) {
    const summary = buildClientSummary(draft, locale);
    assert.match(
      summary,
      locale === "en" ? /SELECTED SERVICE FUNCTIONS/ : /ОБРАНІ СЕРВІСНІ ФУНКЦІЇ/,
    );
    assert.match(
      summary,
      locale === "en" ? /NOT INCLUDED IN THIS REQUEST/ : /НЕ ВКЛЮЧЕНО ДО ЦЬОГО ЗАПИТУ/,
    );
    assert.doesNotMatch(summary, /£33,600|£34,944|30%|50%|20%|33600/);
    assert.doesNotMatch(summary, /SELECTED WORKFLOWS|WORKFLOW APPROVAL/i);
  }
});

test("budget ceiling is recorded as the client's limit, not as a project estimate", () => {
  const draft = updateDraft(emptyDraft(), {
    budgetPosition: "limit",
    budgetCeiling: "18000",
    currency: "EUR",
  });
  const summary = buildClientSummary(draft, "en");

  assert.match(summary, /EUR 18000/);
  assert.match(summary, /client's limit, not a cost estimate/i);
  assert.doesNotMatch(summary, /£33,600|£34,944|GBP 18000/);
});

test("custom functions are included or omitted consistently across exports", () => {
  const request = {
    id: "member-survey",
    kind: "service" as const,
    title: "Member survey",
    description: "Agree recipients and permissions before launch.",
  };
  const included = includeClientRequest(emptyDraft(), request);
  const excluded = updateDraft(included, { customIncluded: false });

  assert.equal(included.customIncluded, true);
  assert.equal(included.scopeConfirmed, false);
  for (const locale of ["en", "uk"] as const) {
    assert(buildClientSummary(included, locale).includes(request.description));
    assert(buildClientMarkdown(included, locale).includes(request.description));
    assert(!buildClientSummary(excluded, locale).includes(request.description));
  }
});

test("email, Markdown and print summary preserve the same confirmed request and notes", () => {
  const draft = updateDraft(
    emptyDraft(),
    serviceSelectionChanges(emptyDraft(), ["search", "groups"]),
  );
  const confirmed = updateDraft(draft, {
    scopeConfirmed: true,
    notes: "Keep this note.\nSecond line.",
    budgetPosition: "limit",
    budgetCeiling: "25000",
    currency: "GBP",
  });
  const summary = buildClientSummary(confirmed, "en");
  const markdown = buildClientMarkdown(confirmed, "en");

  assert.equal(new URL(emailHref(confirmed, "en")).searchParams.get("body"), summary);
  assert.match(markdown, /## SELECTED SERVICE FUNCTIONS/);
  assert.match(markdown, /Confirmed for preparation of an estimate/);
  assert.match(markdown, /Keep this note\./);
  assert(
    scopeDocumentSections(summary).sections.some((section) =>
      section.lines.some((line) => line.includes("Keep this note.")),
    ),
  );
  assert.match(summary, /Confirmed for preparation of an estimate/);
  assert.match(summary, /GBP 25000/);
});

test("legacy stored drafts receive safe defaults and old budget approval is not carried forward", () => {
  const draft = emptyDraft();
  const { scopeConfirmed, ...legacyDraft } = draft;

  assert.equal(scopeConfirmed, false);
  assert.equal(parseDraft(JSON.stringify(legacyDraft)).scopeConfirmed, false);
  const migrated = parseDraft(
    JSON.stringify({ ...draft, budgetPosition: "approve", scopeConfirmed: true }),
  );
  assert.equal(migrated.budgetPosition, "discuss");
  assert.equal(migrated.scopeConfirmed, false);
});

test("invalid storage is rejected rather than silently overwritten", () => {
  assert.throws(() => parseDraft("{broken"));
  assert.throws(() => parseDraft('{"version":99}'));
  assert.throws(() =>
    parseDraft(JSON.stringify({ ...emptyDraft(), serviceIds: ["unknown-service"] })),
  );
});

test("email handoff encodes the complete summary without claiming delivery", () => {
  const draft = updateDraft(emptyDraft(), { notes: "A&B + 100%\nІнтеграція" });
  const url = new URL(emailHref(draft, "uk"));

  assert.equal(url.protocol, "mailto:");
  assert.equal(url.searchParams.get("body"), buildClientSummary(draft, "uk"));
  assert.match(
    buildClientSummary(draft, "uk"),
    /не є замовленням робіт чи прийняттям остаточної ціни/,
  );
});
