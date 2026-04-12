import { describe, it, expect } from "vitest";
import { hasCompletedOnboarding } from "@/lib/onboarding";

describe("hasCompletedOnboarding", () => {
  it("returns true when profile onboarding is completed", () => {
    expect(hasCompletedOnboarding(true, false)).toBe(true);
  });

  it("respects local completion flag when profile value is false", () => {
    expect(hasCompletedOnboarding(false, true)).toBe(true);
  });

  it("returns false when both profile and local flags are false", () => {
    expect(hasCompletedOnboarding(false, false)).toBe(false);
  });

  it("falls back to local flag when profile data is unavailable", () => {
    expect(hasCompletedOnboarding(undefined, true)).toBe(true);
    expect(hasCompletedOnboarding(undefined, false)).toBe(false);
  });
});
