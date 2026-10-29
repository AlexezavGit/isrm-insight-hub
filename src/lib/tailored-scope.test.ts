import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyDraft,
  updateDraft,
  parseDraft,
  selectedServiceIds,
  buildClientSummary,
} from "./client-draft";
import { clientQuote, clientQuoteRange, clientPriceLines } from "./client-pricing";
import { packageChanges, packageServiceIds } from "./tailored-scope";
import { buildNetwork, serviceCovers } from "./network-model";
import { recordedPath } from "./network-path";
import { placeCoach } from "./walkthrough-placement";
import type { Expert } from "./types";

test("tailored core exclusions survive storage and require a new estimate rather than an invented discount", () => {
  const original = emptyDraft();
  const ids = packageServiceIds(original, "core").filter((id) => id !== "research");
  const changed = updateDraft(original, packageChanges(original, "core", ids));
  const restored = parseDraft(JSON.stringify(changed));
  assert(!selectedServiceIds(restored).includes("research"));
  assert.equal(clientQuote(restored), null);
  assert.equal(clientPriceLines(restored, "en")[0]?.value, 33600);
  assert.equal(restored.budgetPosition, "discuss");
  assert.equal(clientQuote(original), 33600);
});
test("tailored workflow additions persist in proposal exports while unchanged packages keep their reference amounts", () => {
  let d = updateDraft(emptyDraft(), { workflowIds: ["engagement"] });
  d = updateDraft(d, packageChanges(d, "engagement", ["research", "survey"]));
  assert.deepEqual(packageServiceIds(parseDraft(JSON.stringify(d)), "engagement"), [
    "research",
    "survey",
  ]);
  assert.equal(clientPriceLines(d, "en").find((x) => x.id === "engagement")?.value, 11340);
  assert.equal(clientQuoteRange(d).low, 44940);
  assert(buildClientSummary(d, "en").includes("Tailored composition"));
  const legacy = JSON.parse(JSON.stringify(emptyDraft()));
  delete legacy.packageServices;
  assert.deepEqual(parseDraft(JSON.stringify(legacy)).packageServices, {});
});
test("illustrative coverage contains partial and overlapping audiences without claiming recorded participation", () => {
  const experts = Array.from(
    { length: 30 },
    (_, i) =>
      ({
        code: "P" + i,
        displayName: "P" + i,
        verified: true,
        sector: "Risk",
        tags: [],
      }) as unknown as Expert,
  );
  const covered = experts.filter((p) => serviceCovers("search", p));
  assert(covered.length > 0 && covered.length < experts.length);
  assert(experts.some((p) => serviceCovers("search", p) && serviceCovers("groups", p)));
  assert(
    experts.every((p) =>
      [
        "search",
        "groups",
        "research",
        "review",
        "evidence",
        "contact",
        "integration",
        "survey",
        "publishing",
      ].some((id) => serviceCovers(id, p)),
    ),
  );
});
test("a connection path uses supplied category links and cannot invent an introduction through ISRM or common service coverage", () => {
  const people = [
    { code: "A", displayName: "A", sector: "Risk", country: "UK", verified: true, tags: [] },
    { code: "B", displayName: "B", sector: "Risk", country: "UK", verified: true, tags: [] },
    { code: "C", displayName: "C", sector: "Energy", country: "UK", verified: true, tags: [] },
  ] as unknown as Expert[];
  const model = buildNetwork(
    people,
    { sector: true, theme: false, hub: false, researchQueue: false },
    "en",
  );
  assert.deepEqual(recordedPath(model, "A", "B"), ["A", "sector:Risk", "B"]);
  assert.deepEqual(recordedPath(model, "A", "C"), []);
});
test("coach placement avoids a highlighted field and stays within the visible workspace", () => {
  const target = { x: 20, y: 40, width: 280, height: 110 };
  const result = placeCoach(390, 720, target, 320, 140);
  assert(result.x >= 8 && result.x + 320 <= 382);
  assert(result.y >= 8 && result.y + 140 <= 712);
  assert(result.y >= target.y + target.height + 8 || result.x >= target.x + target.width + 8);
});
