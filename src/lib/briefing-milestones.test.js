import { describe, expect, test } from "bun:test";
import { BRIEFING_MILESTONES } from "./briefing-milestones";

describe("User-defined delivery payment milestones", () => {
  test("feasibility and agreement receive 30%", () => {
    expect(BRIEFING_MILESTONES.find((step) => step.id === "feasibility")?.fraction).toBe(0.3);
  });
  test("initial deployment and integration receive 50%", () => {
    expect(BRIEFING_MILESTONES.find((step) => step.id === "initial-deployment")?.fraction).toBe(0.5);
  });
  test("operations and handover receive 20%", () => {
    expect(BRIEFING_MILESTONES.find((step) => step.id === "operations")?.fraction).toBe(0.2);
  });
});