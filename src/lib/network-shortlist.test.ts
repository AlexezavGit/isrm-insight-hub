import { test } from "node:test";
import assert from "node:assert/strict";
import { findSavedShortlistSnapshot, readSavedShortlists } from "./network-shortlist";

test("saved shortlist snapshots preserve legacy entries and graph images", () => {
  const image = "data:image/png;base64,c25hcHNob3Q=";
  const snapshots = readSavedShortlists(
    JSON.stringify([
      { id: "legacy", name: "Earlier group", codes: ["EXP-001"] },
      { id: "current", name: "Current group", codes: ["EXP-004"], image },
    ]),
  );
  assert.equal(snapshots[0]?.image, undefined);
  assert.equal(snapshots[1]?.image, image);
});

test("invalid saved shortlist data is rejected without coercing it", () => {
  assert.throws(() => readSavedShortlists("{broken"));
  assert.throws(() =>
    readSavedShortlists(JSON.stringify([{ id: "bad", name: "Bad", codes: [], image: "text" }])),
  );
});

test("the selected duplicate shortlist snapshot takes precedence over older matches", () => {
  const older = { id: "older", name: "Same group", codes: ["EXP-004"] };
  const newer = {
    id: "newer",
    name: "Same group",
    codes: ["EXP-004"],
    image: "data:image/png;base64,c25hcHNob3Q=",
  };
  assert.equal(
    findSavedShortlistSnapshot([older, newer], "newer", "Same group", ["EXP-004"]),
    newer,
  );
  assert.equal(findSavedShortlistSnapshot([older, newer], "", "Same group", ["EXP-004"]), newer);
});
