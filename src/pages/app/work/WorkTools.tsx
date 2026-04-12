import { Link } from "react-router-dom";
import { TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkTools() {
  const tools = [
    {
      title: "Win/Loss Journal",
      description: "Learn from every outcome",
      icon: TrendingUp,
      path: "/app/dimensions/work/wins-losses",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Energy-Task Matcher",
      description: "Match tasks to your energy patterns",
      icon: Zap,
      path: "/app/dimensions/work/energy-tasks",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Work Tools</h1>
          <p className="text-sm text-muted-foreground">
            Optimize performance, learn from outcomes
          </p>
        </div>

        <div className="grid gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2.5 rounded-xl", tool.iconBg)}>
                    <Icon className={cn("w-5 h-5", tool.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed">
          Pro tip — use these tools to inform your weekly Work dimension score.
          Consistent logging here should reflect in a higher self-rating.
        </p>
      </div>
    </div>
  );
}
