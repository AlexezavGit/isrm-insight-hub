import test from "node:test";
import assert from "node:assert/strict";
import { canonicalCountry, referenceOptions } from "./network-reference";
import { buildNetwork } from "./network-model";
import { applyFilters, EMPTY } from "./filters";
import type { Expert } from "./types";
const profile = (country: string) =>
  ({
    code: "P1",
    displayName: "P1",
    country,
    sector: "Security / risk / resilience",
    primaryExpertise: "Risk consulting",
    communityRole: "Member / participant",
    identityStatus: "Confirmed",
    verified: true,
    tags: [],
    ukraineCategory: "Unclassified",
    id: 1,
    confidence: "",
    crmStage: "",
    priority: "",
    ukraineTheme: "",
    evidence: "",
    contribution: "",
    potentialRole: "",
  }) as Expert;

test("country reference includes every coded country/territory even without records", () => {
  const options = referenceOptions([], "country", "en");
  assert.equal(options.length, 249);
  assert(options.some((o) => o.value === "Japan" && o.count === 0));
  assert.equal(new Set(options.map((o) => o.value)).size, 249);
});
test("country counts combine equivalent labels without inventing countries from ambiguous records", () => {
  const options = referenceOptions(
    [profile("Велика Британія"), profile("UK"), profile("США / Канада")],
    "country",
    "uk",
  );
  assert.equal(options.find((o) => o.value === "United Kingdom")?.count, 2);
  assert.equal(options.find((o) => o.value === "United States")?.count, 0);
  assert.equal(options.find((o) => o.value === "Canada")?.count, 0);
  assert.equal(options.find((o) => o.value === "США / Канада")?.count, 1);
  assert.equal(canonicalCountry("Велика Британія"), "United Kingdom");
});
test("filters accept country aliases and allow a genuine zero result", () => {
  assert.equal(
    applyFilters([profile("Велика Британія")], { ...EMPTY, country: "United Kingdom" }).length,
    1,
  );
  assert.equal(applyFilters([profile("UK")], { ...EMPTY, country: "Japan" }).length, 0);
});
test("proposed review states remain empty rather than inferred from source verification", () => {
  const options = referenceOptions([profile("UK")], "reviewStatus", "en");
  assert.equal(options.find((o) => o.value === "Confirmed")?.count, 1);
  assert.equal(options.find((o) => o.value === "AI OSINT verified")?.count, 0);
  assert.equal(options.find((o) => o.value === "Out of compliance")?.count, 0);
});
test("ISRM is pinned and a selected empty category has no invented relationships", () => {
  const model = buildNetwork(
    [],
    { sector: true, theme: true, hub: true, researchQueue: false },
    "en",
    { country: "Japan" },
  );
  const root = model.nodes.find((n) => n.id === "isrm")!;
  assert.deepEqual([root.x, root.y, root.fx, root.fy], [0, 0, 0, 0]);
  assert.equal(model.nodes.find((n) => n.id === "country:Japan")?.size, 0);
  assert(!model.links.some((l) => l.source === "country:Japan" || l.target === "country:Japan"));
});
