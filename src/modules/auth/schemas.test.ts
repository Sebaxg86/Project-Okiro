import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, safeRedirectPath } from "./schemas";

describe("authentication schemas", () => {
  it("accepts a valid email and password login", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success,
    ).toBe(true);
  });

  it("requires ten characters and matching passwords for registration", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Ada Lovelace",
        displayName: "Ada",
        birthDate: "1990-12-10",
        weightKg: "",
        timezone: "Europe/London",
        email: "user@example.com",
        password: "short",
        confirmPassword: "short",
        acceptedTerms: true,
      }).success,
    ).toBe(false);

    expect(
      registerSchema.safeParse({
        fullName: "Ada Lovelace",
        displayName: "Ada",
        birthDate: "",
        weightKg: "62.5",
        timezone: "Europe/London",
        email: "user@example.com",
        password: "strong-pass-123",
        confirmPassword: "different-pass",
        acceptedTerms: true,
      }).success,
    ).toBe(false);
  });

  it("requires acceptance of terms and privacy notice", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Ada Lovelace",
        displayName: "Ada",
        birthDate: "",
        weightKg: "62.5",
        timezone: "Europe/London",
        email: "user@example.com",
        password: "strong-pass-123",
        confirmPassword: "strong-pass-123",
        acceptedTerms: false,
      }).success,
    ).toBe(false);
  });

  it("validates optional birthday and initial weight", () => {
    const base = {
      fullName: "Ada Lovelace",
      displayName: "Ada",
      timezone: "Europe/London",
      email: "ada@example.com",
      password: "strong-pass-123",
      confirmPassword: "strong-pass-123",
      acceptedTerms: true as const,
    };

    expect(registerSchema.safeParse({ ...base, birthDate: "", weightKg: "" }).success).toBe(true);
    expect(registerSchema.safeParse({ ...base, birthDate: "2999-01-01", weightKg: "62" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, birthDate: "1990-01-01", weightKg: "8" }).success).toBe(false);
  });
});

describe("safeRedirectPath", () => {
  it("keeps same-origin paths and rejects protocol-relative redirects", () => {
    expect(safeRedirectPath("/app/history?day=today")).toBe("/app/history?day=today");
    expect(safeRedirectPath("//malicious.example")).toBe("/app");
    expect(safeRedirectPath("https://malicious.example")).toBe("/app");
  });
});
