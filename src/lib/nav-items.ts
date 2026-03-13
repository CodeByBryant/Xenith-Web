import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Timer,
  RotateCw,
  BookOpen,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import React from "react";

export type NavItem = {
  label: string;
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  exact?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/app", icon: LayoutDashboard, exact: true },
  { label: "Intentions", path: "/app/intentions", icon: CheckSquare },
  { label: "Life Dimensions", path: "/app/dimensions", icon: Activity },
  { label: "Focus Timer", path: "/app/focus", icon: Timer },
  { label: "Routines", path: "/app/routines", icon: RotateCw },
  { label: "Reflection", path: "/app/reflection", icon: BookOpen },
  { label: "Insights", path: "/app/insights", icon: BarChart2 },
  { label: "Growth Path", path: "/app/growth", icon: TrendingUp },
];
