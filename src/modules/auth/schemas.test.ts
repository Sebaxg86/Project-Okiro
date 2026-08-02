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
        email: "user@example.com",
        password: "short",
        confirmPassword: "short",
        acceptedTerms: true,
      }).success,
    ).toBe(false);

    expect(
      registerSchema.safeParse({
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
        email: "user@example.com",
        password: "strong-pass-123",
        confirmPassword: "strong-pass-123",
        acceptedTerms: false,
      }).success,
    ).toBe(false);
  });
});

describe("safeRedirectPath", () => {
  it("keeps same-origin paths and rejects protocol-relative redirects", () => {
    expect(safeRedirectPath("/app/history?day=today")).toBe("/app/history?day=today");
    expect(safeRedirectPath("//malicious.example")).toBe("/app");
    expect(safeRedirectPath("https://malicious.example")).toBe("/app");
  });
});
