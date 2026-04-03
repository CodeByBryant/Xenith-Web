import { Users, Lightbulb, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function MindTools() {
  const tools = [
    {
      title: "Thought Audit",
      description: "Log intrusive thoughts, tag patterns",
      icon: Lightbulb,
      path: "/app/mind/thought-audit",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Daily Gratitude",
      description: "Three things, every morning",
      icon: Heart,
      path: "/app/mind/gratitude",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Mind Tools</h1>
          <p className="text-sm text-muted-foreground">
            Track thoughts, practice gratitude, build mental clarity
          </p>
        </div>

        <div className="grid gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg ${tool.bgColor}`}>
                    <Icon className={`w-5 h-5 ${tool.color}`} />
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
      </div>
    </div>
  );
}
