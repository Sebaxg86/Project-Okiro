import { describe, expect, it } from "vitest";
import { activitySchema } from "./schemas";

const base = { localDate: "2026-08-02", idempotencyKey: "mutation-123", recordId: "" };

describe("activity schemas", () => {
  it("accepts all five MVP record types", () => {
    expect(activitySchema.safeParse({ ...base, kind: "workout", time: "08:00", durationMinutes: "45", workoutType: "strength", intensity: "moderate", title: "", notes: "" }).success).toBe(true);
    expect(activitySchema.safeParse({ ...base, kind: "sleep", sleepTime: "23:30", wakeTime: "07:30", quality: "4", interruptions: "", notes: "" }).success).toBe(true);
    expect(activitySchema.safeParse({ ...base, kind: "meal", time: "14:00", mealType: "lunch", description: "Arroz y verduras", classification: "balanced", notes: "" }).success).toBe(true);
    expect(activitySchema.safeParse({ ...base, kind: "hydration", time: "10:00", amountMl: "500" }).success).toBe(true);
    expect(activitySchema.safeParse({ ...base, kind: "focus", time: "09:00", durationMinutes: "50", focusType: "programming", objective: "Implementar registros", projectName: "Okiro", notes: "" }).success).toBe(true);
  });

  it("rejects invalid durations and missing focus objectives", () => {
    expect(activitySchema.safeParse({ ...base, kind: "workout", time: "08:00", durationMinutes: "0", workoutType: "strength", intensity: "moderate", title: "", notes: "" }).success).toBe(false);
    expect(activitySchema.safeParse({ ...base, kind: "focus", time: "09:00", durationMinutes: "50", focusType: "programming", objective: "", projectName: "", notes: "" }).success).toBe(false);
  });

  it("accepts predefined and custom intelligence activity records", () => {
    expect(activitySchema.safeParse({ ...base, kind: "focus", time: "09:00", durationMinutes: "50", focusType: "chess", objective: "Resolver problemas tácticos", projectName: "", notes: "" }).success).toBe(true);
    expect(activitySchema.safeParse({ ...base, kind: "focus", time: "09:00", durationMinutes: "30", focusType: "custom", objective: "Practicar debate", projectName: "", notes: "" }).success).toBe(true);
  });
});
