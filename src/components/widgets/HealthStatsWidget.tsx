import { useProfile } from "@/hooks/use-profile";
import { Heart, Droplet, Flame } from "lucide-react";

export function HealthStatsWidget() {
  const { profile } = useProfile();

  const tdee = profile?.tdee || 0;
  const height = profile?.height || 0;
  const weight = profile?.weight || 0;
  const unitPreference = profile?.unit_preference || "metric";

  const displayWeight = unitPreference === "imperial" && weight 
    ? Math.round(weight * 2.20462) 
    : Math.round(weight);
  
  const displayHeight = unitPreference === "imperial" && height
    ? `${Math.floor(height / 30.48)}'${Math.round((height % 30.48) / 2.54)}"`
    : `${Math.round(height)}cm`;

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-foreground">Health Stats</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tdee > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-xs text-muted-foreground">TDEE</p>
            </div>
            <p className="text-lg font-bold text-foreground">{Math.round(tdee)}</p>
            <p className="text-xs text-muted-foreground">cal/day</p>
          </div>
        )}
        
        {weight > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Droplet className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Weight</p>
            </div>
            <p className="text-lg font-bold text-foreground">{displayWeight}</p>
            <p className="text-xs text-muted-foreground">
              {unitPreference === "imperial" ? "lbs" : "kg"}
            </p>
          </div>
        )}

        {height > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Height</p>
            <p className="text-lg font-bold text-foreground">{displayHeight}</p>
          </div>
        )}
      </div>
    </div>
  );
}
