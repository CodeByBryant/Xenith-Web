import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { Activity } from "lucide-react";

const DIMENSION_COLORS: Record<string, string> = {
  health: "bg-red-500",
  mind: "bg-purple-500",
  relationships: "bg-pink-500",
  work: "bg-blue-500",
  finances: "bg-green-500",
  learning: "bg-yellow-500",
  purpose: "bg-indigo-500",
  rest: "bg-cyan-500",
};

export function DimensionsWidget() {
  const { scores } = useDimensionScores();

  // Get only the latest score for each dimension
  const latestScores = scores.reduce((acc, score) => {
    if (!acc[score.dimension] || new Date(score.updated_at) > new Date(acc[score.dimension].updated_at)) {
      acc[score.dimension] = score;
    }
    return acc;
  }, {} as Record<string, typeof scores[0]>);

  const latestScoresArray = Object.values(latestScores);

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-foreground">Life Dimensions</h3>
      </div>

      <div className="space-y-2">
        {latestScoresArray.map((score) => (
          <div key={score.dimension} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm capitalize text-foreground">
                  {score.dimension}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {score.score}/10
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${DIMENSION_COLORS[score.dimension] || "bg-gray-500"}`}
                  style={{ width: `${(score.score / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
