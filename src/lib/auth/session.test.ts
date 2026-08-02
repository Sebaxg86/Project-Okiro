import { describe, expect, it } from "vitest";
import { INACTIVITY_LIMIT_MS, sessionIsInactive, shouldRefreshActivity } from "./session";

const now = new Date("2026-08-02T20:00:00.000Z");

describe("session inactivity", () => {
  it("keeps sessions open through fifteen days of inactivity", () => {
    expect(sessionIsInactive(new Date(now.getTime() - INACTIVITY_LIMIT_MS + 1).toISOString(), now)).toBe(false);
  });

  it("expires sessions at fifteen full days without activity", () => {
    expect(sessionIsInactive(new Date(now.getTime() - INACTIVITY_LIMIT_MS).toISOString(), now)).toBe(true);
  });

  it("limits activity writes while retaining the rolling inactivity window", () => {
    expect(shouldRefreshActivity(new Date(now.getTime() - 4 * 60 * 1000).toISOString(), now)).toBe(false);
    expect(shouldRefreshActivity(new Date(now.getTime() - 5 * 60 * 1000).toISOString(), now)).toBe(true);
  });
});
