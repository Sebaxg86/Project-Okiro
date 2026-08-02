import { describe, expect, it } from "vitest";
import { goalSettingsSchema, profileSchema, weightSchema } from "./schemas";

describe("profile schemas", () => {
  it("accepts private profile information", () => {
    expect(profileSchema.safeParse({ fullName: "Sebastián Chairez", displayName: "Sebas", birthDate: "1990-06-15", timezone: "America/Mexico_City", unitSystem: "metric" }).success).toBe(true);
  });

  it("validates metric and imperial weight ranges", () => {
    expect(weightSchema.safeParse({ measuredOn: "2026-08-02", weight: "72.5", unitSystem: "metric" }).success).toBe(true);
    expect(weightSchema.safeParse({ measuredOn: "2026-08-02", weight: "160", unitSystem: "imperial" }).success).toBe(true);
    expect(weightSchema.safeParse({ measuredOn: "2026-08-02", weight: "8", unitSystem: "metric" }).success).toBe(false);
  });

  it("accepts valid cycle parameters and rejects invalid sleep ranges", () => {
    const goals = {
      exerciseDaysTarget: "4",
      intelligenceDaysTarget: "3",
      intelligenceActivityType: "reading",
      intelligenceCustomLabel: "",
      hydrationTargetMl: "2500",
      sleepMinHours: "7",
      sleepMaxHours: "9",
      sleepTargetTime: "23:30",
      expectedMainMeals: "3",
      flexibleMealsPerWeek: "2",
    };
    expect(goalSettingsSchema.safeParse(goals).success).toBe(true);
    expect(goalSettingsSchema.safeParse({ ...goals, sleepMinHours: "10", sleepMaxHours: "7" }).success).toBe(false);
  });
});
