import { describe, expect, it } from "vitest";
import { profileSchema, weightSchema } from "./schemas";

describe("profile schemas", () => {
  it("accepts private profile information", () => {
    expect(profileSchema.safeParse({ fullName: "Sebastián Chairez", displayName: "Sebas", birthDate: "1990-06-15", timezone: "America/Mexico_City", unitSystem: "metric" }).success).toBe(true);
  });

  it("validates metric and imperial weight ranges", () => {
    expect(weightSchema.safeParse({ measuredOn: "2026-08-02", weight: "72.5", unitSystem: "metric" }).success).toBe(true);
    expect(weightSchema.safeParse({ measuredOn: "2026-08-02", weight: "160", unitSystem: "imperial" }).success).toBe(true);
    expect(weightSchema.safeParse({ measuredOn: "2026-08-02", weight: "8", unitSystem: "metric" }).success).toBe(false);
  });
});

