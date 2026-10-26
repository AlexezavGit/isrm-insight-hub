import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { BRIEFING_MILESTONES } from "./briefing-milestones";

describe("User-defined delivery payment milestones", () => {
  test("feasibility and agreement receive 30%", () => {
    assert.equal(BRIEFING_MILESTONES.find((step) => step.id === "feasibility")?.fraction, 0.3);
  });
  test("initial deployment and integration receive 50%", () => {
    assert.equal(
      BRIEFING_MILESTONES.find((step) => step.id === "initial-deployment")?.fraction,
      0.5,
    );
  });
  test("operations and handover receive 20%", () => {
    assert.equal(BRIEFING_MILESTONES.find((step) => step.id === "operations")?.fraction, 0.2);
  });
});
