import { describe, expect, it } from "vitest";
import {
  consolidateWeek,
  focusDailyXp,
  hydrationDailyXp,
  mealBaseXp,
  rankFromScore,
  sleepDurationXp,
  workoutBaseXp,
  xpRequiredForNextLevel,
} from "./rules";

describe("activity XP rules", () => {
  it("scores structured and recovery workouts by duration", () => {
    expect(workoutBaseXp(19, "strength")).toBe(0);
    expect(workoutBaseXp(45, "strength")).toBe(70);
    expect(workoutBaseXp(90, "strength")).toBe(80);
    expect(workoutBaseXp(45, "walking")).toBe(30);
  });

  it("scores sleep duration without rewarding more than ten hours", () => {
    expect(sleepDurationXp(450)).toBe(30);
    expect(sleepDurationXp(320)).toBe(-10);
    expect(sleepDurationXp(250)).toBe(-25);
    expect(sleepDurationXp(620)).toBe(0);
  });

  it("uses neutral meal classifications and snack rules", () => {
    expect(mealBaseXp("lunch", "balanced")).toBe(10);
    expect(mealBaseXp("dinner", "out_of_plan")).toBe(-8);
    expect(mealBaseXp("snack", "balanced")).toBe(2);
    expect(mealBaseXp("snack", "out_of_plan")).toBe(-3);
  });

  it("caps hydration and focused work tiers", () => {
    expect(hydrationDailyXp(2500, 2500)).toBe(15);
    expect(hydrationDailyXp(5000, 2500)).toBe(15);
    expect(focusDailyXp(24)).toBe(0);
    expect(focusDailyXp(90)).toBe(40);
  });
});

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
