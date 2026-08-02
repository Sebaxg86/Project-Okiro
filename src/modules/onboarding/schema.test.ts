import { describe, expect, it } from "vitest";
import { onboardingSchema } from "./schema";

const validOnboarding = {
  timezone: "America/Mexico_City",
  unitSystem: "metric",
  exerciseDaysTarget: "5",
  programmingDaysTarget: "3",
  hydrationTargetMl: "2500",
  sleepMinHours: "7",
  sleepMaxHours: "9",
  sleepTargetTime: "23:30",
  expectedMainMeals: "3",
  flexibleMealsPerWeek: "2",
};

describe("onboardingSchema", () => {
  it("accepts the documented default goals", () => {
    expect(onboardingSchema.safeParse(validOnboarding).success).toBe(true);
  });

  it("rejects inverted sleep ranges and out-of-range goals", () => {
    expect(onboardingSchema.safeParse({ ...validOnboarding, sleepMinHours: "10", sleepMaxHours: "7" }).success).toBe(false);
    expect(onboardingSchema.safeParse({ ...validOnboarding, exerciseDaysTarget: "9" }).success).toBe(false);
  });
});

