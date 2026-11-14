import { strict as assert } from "node:assert";
import { test } from "node:test";
import { networkSymbolKind } from "./network-symbols";
import { MAP_SYMBOLS, mapSymbolPath } from "./map-symbols";

test("category prefixes keep their meaning despite shared legacy node kinds", () => {
  assert.equal(networkSymbolKind({ id: "country:Portugal", kind: "hub" }), "country");
  assert.equal(networkSymbolKind({ id: "expertise:Risk management", kind: "theme" }), "expertise");
  assert.equal(networkSymbolKind({ id: "sector:Advisory", kind: "sector" }), "sector");
});
test("live and SVG glyphs resolve to the legend's shapes", () => {
  for (const [kind, expected] of [
    ["expert", "circle"],
    ["organisation", "square"],
    ["sector", "triangle"],
    ["theme", "hexagon"],
    ["status", "diamond"],
    ["service", "rounded"],
    ["workflow", "hexagon"],
  ] as const) {
    const symbol = networkSymbolKind({ id: kind, kind });
    assert.equal(MAP_SYMBOLS[symbol].shape, expected);
    assert.ok(mapSymbolPath(symbol, 7).startsWith("M"));
    assert.ok(!mapSymbolPath(symbol, 7).includes("NaN"));
  }
});
