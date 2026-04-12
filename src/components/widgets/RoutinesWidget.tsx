import { useRoutines } from "@/hooks/use-routines";
import { Repeat, Clock } from "lucide-react";

export function RoutinesWidget() {
  const { routines } = useRoutines();
  const activeRoutines = routines.filter((r) => r.is_active);

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Repeat className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-foreground">Active Routines</h3>
      </div>

      {activeRoutines.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active routines</p>
      ) : (
        <div className="space-y-2">
          {activeRoutines.slice(0, 5).map((routine) => (
            <div key={routine.id} className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{routine.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">
                    {routine.time_of_day}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {routine.items?.length || 0} items
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
