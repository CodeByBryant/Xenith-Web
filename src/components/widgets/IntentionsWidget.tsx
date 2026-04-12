import { useIntentions } from "@/hooks/use-intentions";
import { Target, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

export function IntentionsWidget() {
  const { intentions } = useIntentions();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayIntentions = intentions.filter((i) => i.date === today);

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-foreground">Today's Intentions</h3>
      </div>

      {todayIntentions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No intentions set for today</p>
      ) : (
        <div className="space-y-2">
          {todayIntentions.map((intention) => (
            <div key={intention.id} className="flex items-start gap-2">
              {intention.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${intention.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {intention.text}
                </p>
                {intention.reminder_time && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ⏰ {intention.reminder_time}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
