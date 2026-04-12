import { endOfWeek, isSameDay, startOfWeek } from "date-fns";

export interface FocusSessionLike {
  duration_minutes: number | null;
  started_at: string;
  completed_at: string | null;
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function isFocusSessionCompleted(session: FocusSessionLike): boolean {
  return !!session.completed_at;
}

export function getFocusDurationMinutes(session: FocusSessionLike): number {
  const startedAt = toDate(session.started_at);
  const completedAt = toDate(session.completed_at);

  if (startedAt && completedAt) {
    const elapsed = Math.floor(
      (completedAt.getTime() - startedAt.getTime()) / 60000,
    );
    if (elapsed > 0) return elapsed;
  }

  return Math.max(0, session.duration_minutes ?? 0);
}

export function isFocusSessionOnDate(
  session: FocusSessionLike,
  date: Date = new Date(),
): boolean {
  const startedAt = toDate(session.started_at);
  return !!startedAt && isSameDay(startedAt, date);
}

export function isFocusSessionInCurrentWeek(
  session: FocusSessionLike,
  now: Date = new Date(),
): boolean {
  const startedAt = toDate(session.started_at);
  if (!startedAt) return false;

  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  return startedAt >= weekStart && startedAt <= weekEnd;
}

export function getCompletedFocusSessionsThisWeek<T extends FocusSessionLike>(
  sessions: T[],
  now: Date = new Date(),
): T[] {
  return sessions.filter(
    (session) =>
      isFocusSessionCompleted(session) &&
      isFocusSessionInCurrentWeek(session, now),
  );
}

export function getTotalFocusMinutes(sessions: FocusSessionLike[]): number {
  return sessions.reduce(
    (sum, session) => sum + getFocusDurationMinutes(session),
    0,
  );
}
