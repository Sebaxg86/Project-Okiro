import { describe, expect, it } from "vitest";
import {
  consolidateWeek,
  rankFromScore,
  xpRequiredForNextLevel,
} from "./rules";

describe("consolidateWeek", () => {
  it("applies the weekly penalty cap", () => {
    expect(
      consolidateWeek({ positiveXp: 780, bonusXp: 110, penaltyXp: 370 }),
    ).toMatchObject({ appliedPenalty: 300, consolidatedXp: 590 });
  });

  it("never creates negative consolidated XP or debt", () => {
    expect(
      consolidateWeek({ positiveXp: 80, bonusXp: 0, penaltyXp: 200 }),
    ).toMatchObject({ netXp: -120, consolidatedXp: 0 });
  });
});

describe("rankFromScore", () => {
  it("returns the mathematical rank with enough data", () => {
    expect(rankFromScore(96, 92)).toBe("S");
    expect(rankFromScore(72, 84)).toBe("B");
  });

  it("caps rank B below 80% coverage and C below 60%", () => {
    expect(rankFromScore(98, 75)).toBe("B");
    expect(rankFromScore(98, 52)).toBe("C");
  });
});

describe("xpRequiredForNextLevel", () => {
  it("uses the specified linear level curve", () => {
    expect(xpRequiredForNextLevel(1)).toBe(400);
    expect(xpRequiredForNextLevel(12)).toBe(1_060);
  });
});
