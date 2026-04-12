import { useFocusSessions } from "@/hooks/use-focus-sessions";
import { Timer } from "lucide-react";
import { format } from "date-fns";
import {
  getCompletedFocusSessionsThisWeek,
  getFocusDurationMinutes,
  getTotalFocusMinutes,
} from "@/lib/focus-metrics";

export function FocusSessionsWidget() {
  const { sessions } = useFocusSessions();
  const thisWeekSessions = getCompletedFocusSessionsThisWeek(sessions);
  const totalMinutes = getTotalFocusMinutes(thisWeekSessions);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-foreground">Focus This Week</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-foreground">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </p>
          <p className="text-sm text-muted-foreground">
            {thisWeekSessions.length} session{thisWeekSessions.length !== 1 ? "s" : ""}
          </p>
        </div>

        {thisWeekSessions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Recent Sessions</p>
            {thisWeekSessions.slice(0, 3).map((session) => {
              const actualDuration = getFocusDurationMinutes(session);
              
              return (
                <div key={session.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {format(new Date(session.started_at), "MMM d, h:mm a")}
                  </span>
                  <span className="text-foreground font-medium">
                    {actualDuration}m
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
