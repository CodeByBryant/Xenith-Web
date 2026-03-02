import { Home, CheckSquare, Timer, BarChart3, User } from "lucide-react";

export type ScreenId = "splash" | "dashboard" | "intentions" | "dimensions" | "growth" | "focus" | "reflection" | "insights";

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const navItems: { id: ScreenId; icon: typeof Home }[] = [
  { id: "dashboard", icon: Home },
  { id: "intentions", icon: CheckSquare },
  { id: "focus", icon: Timer },
  { id: "insights", icon: BarChart3 },
  { id: "reflection", icon: User },
];

export const BottomNav = ({ activeScreen, onNavigate }: BottomNavProps) => {
  if (activeScreen === "splash") return null;

  return (
    <div className="absolute bottom-6 left-0 right-0 px-6 z-40">
      <div className="bg-demo-surface/90 backdrop-blur-xl rounded-2xl p-2 flex items-center justify-around border border-demo-border">
        {navItems.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              activeScreen === id
                ? "bg-demo-fg text-demo-bg"
                : "text-demo-subtle hover:text-demo-fg"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
};
