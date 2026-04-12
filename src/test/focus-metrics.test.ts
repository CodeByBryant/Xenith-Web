import { describe, it, expect } from "vitest";
import {
  getCompletedFocusSessionsThisWeek,
  getFocusDurationMinutes,
  getTotalFocusMinutes,
  isFocusSessionOnDate,
  type FocusSessionLike,
} from "@/lib/focus-metrics";

function session(partial: Partial<FocusSessionLike>): FocusSessionLike {
  return {
    duration_minutes: 25,
    started_at: "2026-04-07T10:00:00.000Z",
    completed_at: "2026-04-07T10:25:00.000Z",
    ...partial,
  };
}

describe("focus-metrics", () => {
  it("uses elapsed time when completed_at exists", () => {
    const value = getFocusDurationMinutes(
      session({
        duration_minutes: 25,
        started_at: "2026-04-07T10:00:00.000Z",
        completed_at: "2026-04-07T10:05:00.000Z",
      }),
    );

    expect(value).toBe(5);
  });

  it("falls back to duration_minutes when completed_at is null", () => {
    const value = getFocusDurationMinutes(
      session({
        duration_minutes: 45,
        completed_at: null,
      }),
    );

    expect(value).toBe(45);
  });

  it("filters only completed sessions in the current week", () => {
    const now = new Date("2026-04-10T12:00:00.000Z");
    const sessions = [
      session({
        started_at: "2026-04-07T10:00:00.000Z",
        completed_at: "2026-04-07T10:25:00.000Z",
      }),
      session({
        started_at: "2026-04-08T10:00:00.000Z",
        completed_at: null,
      }),
      session({
        started_at: "2026-04-01T10:00:00.000Z",
        completed_at: "2026-04-01T10:20:00.000Z",
      }),
    ];

    const currentWeekCompleted = getCompletedFocusSessionsThisWeek(sessions, now);
    expect(currentWeekCompleted).toHaveLength(1);
    expect(getTotalFocusMinutes(currentWeekCompleted)).toBe(25);
  });

  it("matches session date using local date semantics", () => {
    const targetDate = new Date("2026-04-07T12:00:00.000Z");
    expect(
      isFocusSessionOnDate(
        session({ started_at: "2026-04-07T01:00:00.000Z" }),
        targetDate,
      ),
    ).toBe(true);
  });
});
