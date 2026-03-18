import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Background,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Check,
  Lock,
  Heart,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp,
  BookOpen,
  Moon,
  Star,
} from "lucide-react";
import { useSkillTree } from "@/hooks/use-skill-tree";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import dagre from "dagre";

// ── Dimension config ────────────────────────────────────────────────
interface DimCfg {
  Icon: LucideIcon;
  color: string;
  text: string;
  bg: string;
  border: string;
}

const DIM: Record<string, DimCfg> = {
  Health:        { Icon: Heart,      color: "#22c55e", text: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500" },
  Mind:          { Icon: Sparkles,   color: "#8b5cf6", text: "text-violet-500",  bg: "bg-violet-500",  border: "border-violet-500"  },
  Relationships: { Icon: Users,      color: "#ec4899", text: "text-pink-500",    bg: "bg-pink-500",    border: "border-pink-500"    },
  Work:          { Icon: Briefcase,  color: "#3b82f6", text: "text-blue-500",    bg: "bg-blue-500",    border: "border-blue-500"    },
  Finances:      { Icon: TrendingUp, color: "#eab308", text: "text-yellow-500",  bg: "bg-yellow-500",  border: "border-yellow-500"  },
  Learning:      { Icon: BookOpen,   color: "#06b6d4", text: "text-cyan-500",    bg: "bg-cyan-500",    border: "border-cyan-500"    },
  Rest:          { Icon: Moon,       color: "#818cf8", text: "text-indigo-400",  bg: "bg-indigo-400",  border: "border-indigo-400"  },
  Purpose:       { Icon: Star,       color: "#f97316", text: "text-orange-500",  bg: "bg-orange-500",  border: "border-orange-500"  },
};

// ── Skill tree data ─────────────────────────────────────────────────
type Tier = "entry" | "foundation" | "skill" | "advanced" | "mastery";

interface SkillDef {
  id: string;
  label: string;
  tier: Tier;
  unlock?: string[]; // parent node IDs — supports multiple parents
}

interface DimTree {
  dim: string;
  nodes: SkillDef[]; // flat list; relationships encoded in unlock[]
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH  (~35 nodes)
// Chain A: Sleep  Chain B: Fitness  Chain C: Nutrition
// Convergence nodes require nodes from multiple chains
// ─────────────────────────────────────────────────────────────────────────────
const HEALTH_NODES: SkillDef[] = [
  // ── Chain A: Sleep ──
  { id: "h_a1", label: "Track sleep hours",        tier: "entry"      },
  { id: "h_a2", label: "Set a bedtime alarm",       tier: "foundation", unlock: ["h_a1"] },
  { id: "h_a3", label: "7 hrs/night for a week",   tier: "skill",      unlock: ["h_a2"] },
  { id: "h_a4", label: "No caffeine after 2 pm",   tier: "skill",      unlock: ["h_a3"] },
  { id: "h_a5", label: "Cold shower habit",         tier: "advanced",   unlock: ["h_a4"] },
  { id: "h_a6", label: "30-day sleep streak",       tier: "advanced",   unlock: ["h_a5"] },
  { id: "h_a7", label: "Sleep mastery",             tier: "mastery",    unlock: ["h_a6"] },

  // ── Chain B: Fitness ──
  { id: "h_b1", label: "Daily 10-min walk",         tier: "entry"      },
  { id: "h_b2", label: "Walk 30 min/day",           tier: "foundation", unlock: ["h_b1"] },
  { id: "h_b3", label: "Run 1 mile",                tier: "skill",      unlock: ["h_b2"] },
  { id: "h_b4", label: "Run 5K",                    tier: "skill",      unlock: ["h_b3"] },
  { id: "h_b5", label: "Strength train 3×/week",   tier: "advanced",   unlock: ["h_b4"] },
  { id: "h_b6", label: "Run 10K",                   tier: "advanced",   unlock: ["h_b4"] },
  { id: "h_b7", label: "1-arm push-up",             tier: "mastery",    unlock: ["h_b5", "h_b6"] },

  // ── Chain C: Nutrition ──
  { id: "h_c1", label: "Log daily meals",           tier: "entry"      },
  { id: "h_c2", label: "Eat veggies every day",     tier: "foundation", unlock: ["h_c1"] },
  { id: "h_c3", label: "Cut processed sugar",       tier: "skill",      unlock: ["h_c2"] },
  { id: "h_c4", label: "Meal prep Sundays",         tier: "skill",      unlock: ["h_c2"] },
  { id: "h_c5", label: "Drink 2L water/day",        tier: "advanced",   unlock: ["h_c3", "h_c4"] },
  { id: "h_c6", label: "Nutrition mastery",         tier: "mastery",    unlock: ["h_c5"] },

  // ── Convergence: Sleep + Fitness ──
  { id: "h_x1", label: "Morning routine locked in", tier: "advanced",  unlock: ["h_a4", "h_b3"] },
  { id: "h_x2", label: "Athlete mindset",           tier: "advanced",  unlock: ["h_x1"] },

  // ── Convergence: Fitness + Nutrition ──
  { id: "h_x3", label: "Body recomposition",        tier: "advanced",  unlock: ["h_b5", "h_c5"] },

  // ── Convergence: Sleep + Nutrition ──
  { id: "h_x4", label: "Recovery optimised",        tier: "advanced",  unlock: ["h_a5", "h_c5"] },

  // ── Grand mastery: all three chains converge ──
  { id: "h_gm", label: "Holistic health master",    tier: "mastery",   unlock: ["h_a7", "h_b7", "h_c6", "h_x2", "h_x3", "h_x4"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// MIND  (~35 nodes)
// Chain A: Meditation  Chain B: Reading  Chain C: Journalling
// ─────────────────────────────────────────────────────────────────────────────
const MIND_NODES: SkillDef[] = [
  // ── Chain A: Meditation ──
  { id: "mi_a1", label: "5-min meditation",          tier: "entry"      },
  { id: "mi_a2", label: "Daily 10-min session",      tier: "foundation", unlock: ["mi_a1"] },
  { id: "mi_a3", label: "20-min daily",              tier: "skill",      unlock: ["mi_a2"] },
  { id: "mi_a4", label: "30-day streak",             tier: "skill",      unlock: ["mi_a3"] },
  { id: "mi_a5", label: "Guided breathwork",         tier: "advanced",   unlock: ["mi_a4"] },
  { id: "mi_a6", label: "Deep stillness",            tier: "mastery",    unlock: ["mi_a5"] },

  // ── Chain B: Reading ──
  { id: "mi_b1", label: "Read 10 pages/day",         tier: "entry"      },
  { id: "mi_b2", label: "Finish a non-fiction book", tier: "foundation", unlock: ["mi_b1"] },
  { id: "mi_b3", label: "Take structured notes",     tier: "skill",      unlock: ["mi_b2"] },
  { id: "mi_b4", label: "Teach what you learned",    tier: "skill",      unlock: ["mi_b3"] },
  { id: "mi_b5", label: "Read 24 books/year",        tier: "advanced",   unlock: ["mi_b4"] },
  { id: "mi_b6", label: "Thought leader",            tier: "mastery",    unlock: ["mi_b5"] },

  // ── Chain C: Journalling ──
  { id: "mi_c1", label: "Write 3 things grateful",  tier: "entry"      },
  { id: "mi_c2", label: "Daily journal habit",       tier: "foundation", unlock: ["mi_c1"] },
  { id: "mi_c3", label: "Weekly review journal",    tier: "skill",      unlock: ["mi_c2"] },
  { id: "mi_c4", label: "Monthly reflection",       tier: "skill",      unlock: ["mi_c3"] },
  { id: "mi_c5", label: "Annual life review",       tier: "advanced",   unlock: ["mi_c4"] },
  { id: "mi_c6", label: "Inner clarity master",     tier: "mastery",    unlock: ["mi_c5"] },

  // ── Chain D: Focus ──
  { id: "mi_d1", label: "Single-task for 25 min",   tier: "entry"      },
  { id: "mi_d2", label: "Pomodoro daily",            tier: "foundation", unlock: ["mi_d1"] },
  { id: "mi_d3", label: "90-min deep focus block",   tier: "skill",      unlock: ["mi_d2"] },
  { id: "mi_d4", label: "Phone-free mornings",       tier: "skill",      unlock: ["mi_d2"] },
  { id: "mi_d5", label: "4-hr deep work/day",        tier: "advanced",   unlock: ["mi_d3", "mi_d4"] },

  // ── Convergence: Meditation + Focus ──
  { id: "mi_x1", label: "Flow state on demand",      tier: "advanced",  unlock: ["mi_a5", "mi_d5"] },

  // ── Convergence: Reading + Journalling ──
  { id: "mi_x2", label: "Synthesis thinker",         tier: "advanced",  unlock: ["mi_b4", "mi_c4"] },

  // ── Convergence: all chains ──
  { id: "mi_gm", label: "Master of mind",            tier: "mastery",   unlock: ["mi_a6", "mi_b6", "mi_c6", "mi_x1", "mi_x2"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONSHIPS  (~35 nodes)
// Chain A: Family  Chain B: Friendship  Chain C: Romance  Chain D: Community
// ─────────────────────────────────────────────────────────────────────────────
const REL_NODES: SkillDef[] = [
  // ── Chain A: Family ──
  { id: "r_a1", label: "Call family weekly",          tier: "entry"      },
  { id: "r_a2", label: "Plan a family meal",          tier: "foundation", unlock: ["r_a1"] },
  { id: "r_a3", label: "Write a gratitude note",      tier: "skill",      unlock: ["r_a2"] },
  { id: "r_a4", label: "Resolve a conflict",          tier: "skill",      unlock: ["r_a3"] },
  { id: "r_a5", label: "Deep bond built",             tier: "advanced",   unlock: ["r_a4"] },
  { id: "r_a6", label: "Family pillar",               tier: "mastery",    unlock: ["r_a5"] },

  // ── Chain B: Friendship ──
  { id: "r_b1", label: "Text an old friend",          tier: "entry"      },
  { id: "r_b2", label: "Monthly friend hangout",      tier: "foundation", unlock: ["r_b1"] },
  { id: "r_b3", label: "Grow your network (10+)",     tier: "skill",      unlock: ["r_b2"] },
  { id: "r_b4", label: "Be a reliable friend",        tier: "skill",      unlock: ["r_b3"] },
  { id: "r_b5", label: "Mentor someone",              tier: "advanced",   unlock: ["r_b4"] },
  { id: "r_b6", label: "Community builder",           tier: "mastery",    unlock: ["r_b5"] },

  // ── Chain C: Romance / Partnership ──
  { id: "r_c1", label: "Share a daily check-in",      tier: "entry"      },
  { id: "r_c2", label: "Weekly date night",           tier: "foundation", unlock: ["r_c1"] },
  { id: "r_c3", label: "Love language practice",      tier: "skill",      unlock: ["r_c2"] },
  { id: "r_c4", label: "Shared 5-year vision",        tier: "skill",      unlock: ["r_c3"] },
  { id: "r_c5", label: "Deep partnership",            tier: "mastery",    unlock: ["r_c4"] },

  // ── Chain D: Social skills ──
  { id: "r_d1", label: "Meet someone new",            tier: "entry"      },
  { id: "r_d2", label: "Practice active listening",   tier: "foundation", unlock: ["r_d1"] },
  { id: "r_d3", label: "Give a public talk",          tier: "skill",      unlock: ["r_d2"] },
  { id: "r_d4", label: "Run a workshop",              tier: "advanced",   unlock: ["r_d3"] },

  // ── Convergence: Family + Friendship ──
  { id: "r_x1", label: "Support network built",       tier: "advanced",  unlock: ["r_a4", "r_b4"] },

  // ── Convergence: Friendship + Social ──
  { id: "r_x2", label: "Inspiring connector",         tier: "advanced",  unlock: ["r_b5", "r_d4"] },

  // ── Convergence: Romance + Family ──
  { id: "r_x3", label: "Nurturing home",              tier: "advanced",  unlock: ["r_a5", "r_c4"] },

  // ── Grand mastery ──
  { id: "r_gm", label: "Master of connection",        tier: "mastery",   unlock: ["r_a6", "r_b6", "r_c5", "r_x1", "r_x2", "r_x3"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORK  (~35 nodes)
// Chain A: Focus/Systems  Chain B: Skills  Chain C: Creation  Chain D: Leadership
// ─────────────────────────────────────────────────────────────────────────────
const WORK_NODES: SkillDef[] = [
  // ── Chain A: Systems ──
  { id: "w_a1", label: "Clear your workspace",       tier: "entry"      },
  { id: "w_a2", label: "Daily task list habit",      tier: "foundation", unlock: ["w_a1"] },
  { id: "w_a3", label: "Deep work 1 hr/day",         tier: "skill",      unlock: ["w_a2"] },
  { id: "w_a4", label: "Weekly review ritual",       tier: "skill",      unlock: ["w_a3"] },
  { id: "w_a5", label: "Ship a full project",        tier: "advanced",   unlock: ["w_a4"] },
  { id: "w_a6", label: "Operational excellence",     tier: "mastery",    unlock: ["w_a5"] },

  // ── Chain B: Skill building ──
  { id: "w_b1", label: "Learn a new tool",           tier: "entry"      },
  { id: "w_b2", label: "Complete an online course",  tier: "foundation", unlock: ["w_b1"] },
  { id: "w_b3", label: "Apply skill in a project",   tier: "skill",      unlock: ["w_b2"] },
  { id: "w_b4", label: "Get peer feedback",          tier: "skill",      unlock: ["w_b3"] },
  { id: "w_b5", label: "Recognised domain expert",   tier: "advanced",   unlock: ["w_b4"] },

  // ── Chain C: Creation / Launch ──
  { id: "w_c1", label: "Build a side project",       tier: "entry"      },
  { id: "w_c2", label: "Launch publicly (v0.1)",     tier: "foundation", unlock: ["w_c1"] },
  { id: "w_c3", label: "Get first 10 users",         tier: "skill",      unlock: ["w_c2"] },
  { id: "w_c4", label: "First revenue dollar",       tier: "skill",      unlock: ["w_c3"] },
  { id: "w_c5", label: "Recurring revenue",          tier: "advanced",   unlock: ["w_c4"] },
  { id: "w_c6", label: "Product-market fit",         tier: "mastery",    unlock: ["w_c5"] },

  // ── Chain D: Leadership ──
  { id: "w_d1", label: "Give a team update",         tier: "entry"      },
  { id: "w_d2", label: "Run a 1-on-1",               tier: "foundation", unlock: ["w_d1"] },
  { id: "w_d3", label: "Delegate a task",            tier: "skill",      unlock: ["w_d2"] },
  { id: "w_d4", label: "Hire first collaborator",    tier: "advanced",   unlock: ["w_d3"] },

  // ── Convergence: Systems + Skill ──
  { id: "w_x1", label: "High-leverage operator",     tier: "advanced",  unlock: ["w_a4", "w_b4"] },

  // ── Convergence: Creation + Leadership ──
  { id: "w_x2", label: "Founder mode unlocked",      tier: "advanced",  unlock: ["w_c4", "w_d3"] },

  // ── Convergence: Skill + Creation ──
  { id: "w_x3", label: "Technical founder",          tier: "advanced",  unlock: ["w_b5", "w_c4"] },

  // ── Grand mastery ──
  { id: "w_gm", label: "Visionary builder",          tier: "mastery",   unlock: ["w_a6", "w_c6", "w_x1", "w_x2", "w_x3"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// FINANCES  (~35 nodes)
// Chain A: Budgeting  Chain B: Saving  Chain C: Investing  Chain D: Income
// ─────────────────────────────────────────────────────────────────────────────
const FIN_NODES: SkillDef[] = [
  // ── Chain A: Budgeting ──
  { id: "fi_a1", label: "Track all spending",         tier: "entry"      },
  { id: "fi_a2", label: "Categorise expenses",        tier: "foundation", unlock: ["fi_a1"] },
  { id: "fi_a3", label: "Build a monthly budget",     tier: "skill",      unlock: ["fi_a2"] },
  { id: "fi_a4", label: "Stick to budget 3 months",  tier: "skill",      unlock: ["fi_a3"] },
  { id: "fi_a5", label: "Zero-based budget",          tier: "advanced",   unlock: ["fi_a4"] },
  { id: "fi_a6", label: "Budget mastery",             tier: "mastery",    unlock: ["fi_a5"] },

  // ── Chain B: Saving ──
  { id: "fi_b1", label: "Open a savings account",    tier: "entry"      },
  { id: "fi_b2", label: "Save 10% of income",        tier: "foundation", unlock: ["fi_b1"] },
  { id: "fi_b3", label: "1-month emergency fund",    tier: "skill",      unlock: ["fi_b2"] },
  { id: "fi_b4", label: "3-month emergency fund",    tier: "skill",      unlock: ["fi_b3"] },
  { id: "fi_b5", label: "6-month emergency fund",    tier: "advanced",   unlock: ["fi_b4"] },
  { id: "fi_b6", label: "Financial cushion master",  tier: "mastery",    unlock: ["fi_b5"] },

  // ── Chain C: Investing ──
  { id: "fi_c1", label: "Open brokerage account",    tier: "entry"      },
  { id: "fi_c2", label: "Buy first index fund",      tier: "foundation", unlock: ["fi_c1"] },
  { id: "fi_c3", label: "Auto-invest monthly",       tier: "skill",      unlock: ["fi_c2"] },
  { id: "fi_c4", label: "Max out tax-advantaged",    tier: "advanced",   unlock: ["fi_c3"] },
  { id: "fi_c5", label: "Portfolio rebalancing",     tier: "advanced",   unlock: ["fi_c4"] },
  { id: "fi_c6", label: "Wealth compounder",         tier: "mastery",    unlock: ["fi_c5"] },

  // ── Chain D: Income ──
  { id: "fi_d1", label: "Identify a side skill",     tier: "entry"      },
  { id: "fi_d2", label: "First freelance gig",       tier: "foundation", unlock: ["fi_d1"] },
  { id: "fi_d3", label: "Side income stream",        tier: "skill",      unlock: ["fi_d2"] },
  { id: "fi_d4", label: "Passive income flow",       tier: "advanced",   unlock: ["fi_d3"] },

  // ── Convergence: Budget + Saving ──
  { id: "fi_x1", label: "Debt-free baseline",        tier: "advanced",  unlock: ["fi_a4", "fi_b4"] },

  // ── Convergence: Saving + Investing ──
  { id: "fi_x2", label: "Wealth building engine",    tier: "advanced",  unlock: ["fi_b5", "fi_c4"] },

  // ── Convergence: Investing + Income ──
  { id: "fi_x3", label: "Multiple income streams",   tier: "advanced",  unlock: ["fi_c3", "fi_d3"] },

  // ── Grand mastery ──
  { id: "fi_gm", label: "Financial freedom",         tier: "mastery",   unlock: ["fi_a6", "fi_b6", "fi_c6", "fi_x1", "fi_x2", "fi_x3"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING  (~35 nodes)
// Chain A: Reading  Chain B: Courses  Chain C: Language  Chain D: Teaching
// ─────────────────────────────────────────────────────────────────────────────
const LEARN_NODES: SkillDef[] = [
  // ── Chain A: Reading ──
  { id: "l_a1", label: "Read 20 min/day",            tier: "entry"      },
  { id: "l_a2", label: "1 book per month",           tier: "foundation", unlock: ["l_a1"] },
  { id: "l_a3", label: "Speed reading basics",       tier: "skill",      unlock: ["l_a2"] },
  { id: "l_a4", label: "Book summaries habit",       tier: "skill",      unlock: ["l_a3"] },
  { id: "l_a5", label: "24 books in a year",         tier: "advanced",   unlock: ["l_a4"] },
  { id: "l_a6", label: "Voracious reader",           tier: "mastery",    unlock: ["l_a5"] },

  // ── Chain B: Courses / Skills ──
  { id: "l_b1", label: "Enrol in an online course",  tier: "entry"      },
  { id: "l_b2", label: "Finish first course",        tier: "foundation", unlock: ["l_b1"] },
  { id: "l_b3", label: "Apply the skill",            tier: "skill",      unlock: ["l_b2"] },
  { id: "l_b4", label: "Get certified",              tier: "skill",      unlock: ["l_b3"] },
  { id: "l_b5", label: "2nd certification",          tier: "advanced",   unlock: ["l_b4"] },
  { id: "l_b6", label: "Multi-skilled professional", tier: "mastery",    unlock: ["l_b5"] },

  // ── Chain C: Language ──
  { id: "l_c1", label: "Learn 5 words/day",          tier: "entry"      },
  { id: "l_c2", label: "Complete a language app level", tier: "foundation", unlock: ["l_c1"] },
  { id: "l_c3", label: "Basic conversation",         tier: "skill",      unlock: ["l_c2"] },
  { id: "l_c4", label: "Watch a film in target language", tier: "skill",  unlock: ["l_c3"] },
  { id: "l_c5", label: "Fluent speaker",             tier: "advanced",   unlock: ["l_c4"] },
  { id: "l_c6", label: "Bilingual",                  tier: "mastery",    unlock: ["l_c5"] },

  // ── Chain D: Teaching / Sharing ──
  { id: "l_d1", label: "Explain a concept to someone", tier: "entry"   },
  { id: "l_d2", label: "Write a how-to guide",        tier: "foundation", unlock: ["l_d1"] },
  { id: "l_d3", label: "Teach a workshop",            tier: "skill",      unlock: ["l_d2"] },
  { id: "l_d4", label: "Create an online course",     tier: "advanced",   unlock: ["l_d3"] },

  // ── Convergence: Reading + Courses ──
  { id: "l_x1", label: "Autodidact mindset",          tier: "advanced",  unlock: ["l_a4", "l_b4"] },

  // ── Convergence: Courses + Teaching ──
  { id: "l_x2", label: "Knowledge multiplier",        tier: "advanced",  unlock: ["l_b5", "l_d3"] },

  // ── Convergence: Language + Reading ──
  { id: "l_x3", label: "Cross-cultural scholar",      tier: "advanced",  unlock: ["l_a5", "l_c5"] },

  // ── Grand mastery ──
  { id: "l_gm", label: "Lifelong learner master",     tier: "mastery",   unlock: ["l_a6", "l_b6", "l_c6", "l_x1", "l_x2", "l_x3"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// REST  (~35 nodes)
// Chain A: Sleep hygiene  Chain B: Leisure  Chain C: Nature  Chain D: Digital detox
// ─────────────────────────────────────────────────────────────────────────────
const REST_NODES: SkillDef[] = [
  // ── Chain A: Sleep hygiene ──
  { id: "re_a1", label: "No screens 1 hr before bed", tier: "entry"      },
  { id: "re_a2", label: "Wind-down routine",           tier: "foundation", unlock: ["re_a1"] },
  { id: "re_a3", label: "Consistent wake time",        tier: "skill",      unlock: ["re_a2"] },
  { id: "re_a4", label: "Full rest day/week",          tier: "skill",      unlock: ["re_a3"] },
  { id: "re_a5", label: "Recover like an athlete",     tier: "advanced",   unlock: ["re_a4"] },
  { id: "re_a6", label: "Rest mastery",                tier: "mastery",    unlock: ["re_a5"] },

  // ── Chain B: Leisure / Hobbies ──
  { id: "re_b1", label: "Start a hobby",               tier: "entry"      },
  { id: "re_b2", label: "Dedicate 2 hrs/week",         tier: "foundation", unlock: ["re_b1"] },
  { id: "re_b3", label: "Share hobby with others",     tier: "skill",      unlock: ["re_b2"] },
  { id: "re_b4", label: "Grow the hobby",              tier: "skill",      unlock: ["re_b3"] },
  { id: "re_b5", label: "Join a hobby community",      tier: "advanced",   unlock: ["re_b4"] },
  { id: "re_b6", label: "Hobby master",                tier: "mastery",    unlock: ["re_b5"] },

  // ── Chain C: Nature ──
  { id: "re_c1", label: "Daily outdoor time",          tier: "entry"      },
  { id: "re_c2", label: "Weekly nature walk",          tier: "foundation", unlock: ["re_c1"] },
  { id: "re_c3", label: "Camp overnight",              tier: "skill",      unlock: ["re_c2"] },
  { id: "re_c4", label: "Multi-day hiking trip",       tier: "advanced",   unlock: ["re_c3"] },
  { id: "re_c5", label: "Nature immersion habit",      tier: "mastery",    unlock: ["re_c4"] },

  // ── Chain D: Digital detox ──
  { id: "re_d1", label: "Phone-free meals",            tier: "entry"      },
  { id: "re_d2", label: "Morning phone-free hour",     tier: "foundation", unlock: ["re_d1"] },
  { id: "re_d3", label: "Full digital detox day",      tier: "skill",      unlock: ["re_d2"] },
  { id: "re_d4", label: "Take a vacation (offline)",   tier: "mastery",    unlock: ["re_d3"] },

  // ── Convergence: Sleep + Digital detox ──
  { id: "re_x1", label: "Mindful evenings",            tier: "advanced",  unlock: ["re_a3", "re_d3"] },

  // ── Convergence: Leisure + Nature ──
  { id: "re_x2", label: "Outdoor recreation habit",   tier: "advanced",  unlock: ["re_b4", "re_c3"] },

  // ── Convergence: All ──
  { id: "re_gm", label: "Master of rest & renewal",   tier: "mastery",   unlock: ["re_a6", "re_b6", "re_c5", "re_d4", "re_x1", "re_x2"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE  (~35 nodes)
// Chain A: Values / Mission  Chain B: Gratitude  Chain C: Legacy  Chain D: Service
// ─────────────────────────────────────────────────────────────────────────────
const PURPOSE_NODES: SkillDef[] = [
  // ── Chain A: Values / Mission ──
  { id: "p_a1", label: "Write your core values",      tier: "entry"      },
  { id: "p_a2", label: "Write your personal mission",  tier: "foundation", unlock: ["p_a1"] },
  { id: "p_a3", label: "Align daily actions to values",tier: "skill",      unlock: ["p_a2"] },
  { id: "p_a4", label: "Define a 10-year vision",      tier: "skill",      unlock: ["p_a3"] },
  { id: "p_a5", label: "Build a life roadmap",         tier: "advanced",   unlock: ["p_a4"] },
  { id: "p_a6", label: "Live with full intention",     tier: "mastery",    unlock: ["p_a5"] },

  // ── Chain B: Gratitude ──
  { id: "p_b1", label: "Volunteer once",               tier: "entry"      },
  { id: "p_b2", label: "Gratitude journal daily",      tier: "foundation", unlock: ["p_b1"] },
  { id: "p_b3", label: "30-day gratitude streak",      tier: "skill",      unlock: ["p_b2"] },
  { id: "p_b4", label: "Express gratitude publicly",   tier: "skill",      unlock: ["p_b3"] },
  { id: "p_b5", label: "Cultivate abundance mindset",  tier: "advanced",   unlock: ["p_b4"] },
  { id: "p_b6", label: "Gratitude master",             tier: "mastery",    unlock: ["p_b5"] },

  // ── Chain C: Legacy ──
  { id: "p_c1", label: "Identify your impact area",   tier: "entry"      },
  { id: "p_c2", label: "Start a passion project",      tier: "foundation", unlock: ["p_c1"] },
  { id: "p_c3", label: "Help 10 people",               tier: "skill",      unlock: ["p_c2"] },
  { id: "p_c4", label: "Publish your story",           tier: "skill",      unlock: ["p_c3"] },
  { id: "p_c5", label: "Define your legacy statement", tier: "advanced",   unlock: ["p_c4"] },
  { id: "p_c6", label: "Legacy architect",             tier: "mastery",    unlock: ["p_c5"] },

  // ── Chain D: Service ──
  { id: "p_d1", label: "Monthly charity donation",     tier: "entry"      },
  { id: "p_d2", label: "Regular volunteering",         tier: "foundation", unlock: ["p_d1"] },
  { id: "p_d3", label: "Lead a community initiative",  tier: "skill",      unlock: ["p_d2"] },
  { id: "p_d4", label: "Create systemic change",       tier: "advanced",   unlock: ["p_d3"] },

  // ── Convergence: Values + Gratitude ──
  { id: "p_x1", label: "Authentic self",               tier: "advanced",  unlock: ["p_a4", "p_b4"] },

  // ── Convergence: Legacy + Service ──
  { id: "p_x2", label: "Impact multiplier",            tier: "advanced",  unlock: ["p_c4", "p_d3"] },

  // ── Convergence: Values + Legacy ──
  { id: "p_x3", label: "Mission-driven life",          tier: "advanced",  unlock: ["p_a5", "p_c5"] },

  // ── Grand mastery ──
  { id: "p_gm", label: "Purpose fulfilled",            tier: "mastery",   unlock: ["p_a6", "p_b6", "p_c6", "p_x1", "p_x2", "p_x3"] },
];

// ── Assemble TREES ──────────────────────────────────────────────────
const TREES: DimTree[] = [
  { dim: "Health",        nodes: HEALTH_NODES  },
  { dim: "Mind",          nodes: MIND_NODES    },
  { dim: "Relationships", nodes: REL_NODES      },
  { dim: "Work",          nodes: WORK_NODES    },
  { dim: "Finances",      nodes: FIN_NODES     },
  { dim: "Learning",      nodes: LEARN_NODES   },
  { dim: "Rest",          nodes: REST_NODES    },
  { dim: "Purpose",       nodes: PURPOSE_NODES },
];

// ── Compute total nodes once ────────────────────────────────────────
const TOTAL_NODES = TREES.reduce((sum, t) => sum + t.nodes.length, 0);

// ── Dagre layout ────────────────────────────────────────────────────
const NODE_W = 192;
const NODE_H = 80;

function getLayoutedElements(
  rawNodes: Node[],
  rawEdges: Edge[],
  direction = "TB",
): { nodes: Node[]; edges: Edge[] } {
  // BUG FIX: explicitly pass compound:false, multigraph:false to avoid dagre warnings
  const g = new dagre.graphlib.Graph({ compound: false, multigraph: false });
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, ranksep: 90, nodesep: 60 });

  rawNodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));

  // BUG FIX: dagre multigraph issue — deduplicate edges before adding
  const seenEdges = new Set<string>();
  rawEdges.forEach((e) => {
    const key = `${e.source}→${e.target}`;
    if (!seenEdges.has(key)) {
      seenEdges.add(key);
      g.setEdge(String(e.source), String(e.target));
    }
  });

  dagre.layout(g);

  return {
    nodes: rawNodes.map((n) => {
      const pos = g.node(n.id);
      return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
    }),
    edges: rawEdges,
  };
}

// ── Build React Flow graph from a DimTree ────────────────────────────
function buildGraph(
  dimTree: DimTree,
  completedIds: Set<string>,
): { nodes: Node[]; edges: Edge[] } {
  const cfg = DIM[dimTree.dim];
  const rawNodes: Node[] = [];
  const rawEdges: Edge[] = [];

  dimTree.nodes.forEach((skill) => {
    const done   = completedIds.has(skill.id);
    // BUG FIX: locked = false when there are no prerequisites (entry nodes always unlocked)
    const locked = skill.unlock
      ? !skill.unlock.every((pid) => completedIds.has(pid))
      : false;

    rawNodes.push({
      id: skill.id,
      type: "skillNode",
      position: { x: 0, y: 0 }, // dagre overwrites
      data: { skill, dim: dimTree.dim, done, locked, cfg },
      draggable: true,
    });

    if (skill.unlock) {
      skill.unlock.forEach((parentId) => {
        const parentDone = completedIds.has(parentId);
        rawEdges.push({
          id: `e-${parentId}-${skill.id}`,
          source: parentId,
          target: skill.id,
          style: {
            stroke: parentDone ? cfg.color : "hsl(var(--border))",
            strokeWidth: 2,
          },
          animated: parentDone && !done,
        });
      });
    }
  });

  return getLayoutedElements(rawNodes, rawEdges);
}

// ── Custom skill node ────────────────────────────────────────────────
const TIER_LABEL: Record<Tier, string> = {
  entry:      "Entry",
  foundation: "Foundation",
  skill:      "Skill",
  advanced:   "Advanced",
  mastery:    "Mastery",
};

// BUG FIX: type NodeProps correctly using the generic so data is typed
interface SkillNodeData extends Record<string, unknown> {
  skill: SkillDef;
  dim: string;
  done: boolean;
  locked: boolean;
  cfg: DimCfg;
  onToggle?: (id: string) => void;
}

function SkillNode({ data }: NodeProps<Node<SkillNodeData>>) {
  const { skill, done, locked, cfg, onToggle } = data;

  return (
    <div
      onClick={() => !locked && onToggle?.(skill.id)}
      className={cn(
        "relative w-48 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 select-none group",
        done
          ? `${cfg.bg} border-transparent cursor-pointer`
          : locked
          ? "border-border bg-card opacity-50 cursor-not-allowed"
          : "border-border bg-card hover:border-foreground/40 cursor-pointer",
      )}
    >
      {/* Target handle — multiple edges can land here */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-0 !bg-border"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider mb-0.5",
              done ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {TIER_LABEL[skill.tier]}
          </p>
          <p
            className={cn(
              "text-xs font-medium leading-snug",
              locked
                ? "text-muted-foreground/60"
                : done
                ? "text-white"
                : "text-foreground",
            )}
          >
            {skill.label}
          </p>
        </div>

        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
            done
              ? "bg-white/20 border-transparent"
              : locked
              ? "border-border opacity-40"
              : "border-border group-hover:border-foreground/50",
          )}
        >
          {done ? (
            <Check className="w-3 h-3 text-white" />
          ) : locked ? (
            <Lock className="w-2.5 h-2.5 text-muted-foreground/50" />
          ) : null}
        </div>
      </div>

      {/* Source handle — multiple edges can leave from here */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !border-0 !bg-border"
      />
    </div>
  );
}

// BUG FIX: memoize nodeTypes outside render to prevent React Flow remounting on every render
const nodeTypes = { skillNode: SkillNode } as const;

// ── Per-dimension React Flow panel ──────────────────────────────────
function DimFlow({
  dimTree,
  completedIds,
  onToggle,
}: {
  dimTree: DimTree;
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  // Recompute layout whenever completedIds changes (edge colors / animated props)
  const layout = useMemo(
    () => buildGraph(dimTree, completedIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dimTree, completedIds],
  );

  // Inject the toggle callback into each node's data
  const nodesWithCb = useMemo(
    () => layout.nodes.map((n) => ({ ...n, data: { ...n.data, onToggle } })),
    [layout.nodes, onToggle],
  );

  // BUG FIX: initialise with empty arrays; sync via effects to avoid stale-closure
  //          issues and double-render flicker from initialState + immediate effect.
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SkillNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(nodesWithCb as Node<SkillNodeData>[]);
  }, [nodesWithCb, setNodes]);

  useEffect(() => {
    setEdges(layout.edges);
  }, [layout.edges, setEdges]);

  const cfg = DIM[dimTree.dim];

  return (
    <div className="w-full h-[560px] rounded-2xl overflow-hidden border border-border bg-card">
      {/*
        BUG FIX:
        - Removed key from DimFlow wrapper — ReactFlowProvider remounts are controlled by
          the key in the parent; the inner ReactFlow keeps key={dimTree.dim} so fitView fires.
        - nodesConnectable={false} prevents the user from dragging new edges.
        - deleteKeyCode={null} prevents accidental deletion with Delete/Backspace key.
      */}
      <ReactFlow
        key={dimTree.dim}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={1.5}
        nodesConnectable={false}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(var(--border))" gap={24} size={1} />
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
          <cfg.Icon className={cn("w-4 h-4", cfg.text)} />
          <span className="text-sm font-semibold text-foreground">{dimTree.dim}</span>
        </div>
      </ReactFlow>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────
export default function Growth() {
  const { completedIds, toggle } = useSkillTree();
  const [activeDim, setActiveDim] = useState(0);

  // stable toggle ref to avoid unnecessary re-renders in DimFlow
  const stableToggle = useCallback((id: string) => toggle(id), [toggle]);

  const dimTree  = TREES[activeDim];
  const dimNodes = dimTree.nodes;

  const totalDone = TREES.flatMap((t) => t.nodes).filter((s) => completedIds.has(s.id)).length;
  const dimDone   = dimNodes.filter((s) => completedIds.has(s.id)).length;
  const dimTotal  = dimNodes.length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ── Overall header ── */}
      <div className="flex items-center justify-between border border-border rounded-2xl px-5 py-4 bg-card">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Growth Path
          </p>
          <p className="text-2xl font-semibold text-foreground tabular-nums mt-0.5">
            {totalDone}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}/ {TOTAL_NODES} nodes
            </span>
          </p>
        </div>

        {/* Circular progress ring */}
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" stroke="hsl(var(--border))" strokeWidth="5" fill="none" />
            <circle
              cx="28" cy="28" r="22"
              stroke="hsl(var(--foreground))" strokeWidth="5" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - totalDone / TOTAL_NODES)}`}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-foreground">
              {Math.round((totalDone / TOTAL_NODES) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Dimension tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {TREES.map((t, i) => {
          const cfg    = DIM[t.dim];
          const done   = t.nodes.filter((s) => completedIds.has(s.id)).length;
          const total  = t.nodes.length;
          const active = activeDim === i;
          return (
            <button
              key={t.dim}
              onClick={() => setActiveDim(i)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                active
                  ? `${cfg.bg} border-transparent text-white`
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <cfg.Icon className="w-3 h-3" />
              {t.dim}
              {done > 0 && (
                <span className={cn("tabular-nums", active ? "opacity-80" : cfg.text)}>
                  {done}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Dimension progress bar ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", DIM[dimTree.dim].bg)}
            style={{ width: `${dimTotal ? (dimDone / dimTotal) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {dimDone}/{dimTotal}
        </span>
      </div>

      {/* ── Legend ── */}
      <div className="flex gap-4 text-[11px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-border inline-block" />
          Locked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-foreground/40 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("w-3 h-3 rounded-full inline-block", DIM[dimTree.dim].bg)} />
          Completed
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          Drag to rearrange · Scroll to zoom
        </span>
      </div>

      {/* ── React Flow skill tree ── */}
      {/*
        BUG FIX: ReactFlowProvider wraps DimFlow (not the other way around).
        Key is on the Provider so the entire flow (including hooks) remounts on
        dimension switch, ensuring fitView fires cleanly and state is fresh.
      */}
      <ReactFlowProvider key={dimTree.dim}>
        <DimFlow
          dimTree={dimTree}
          completedIds={completedIds}
          onToggle={stableToggle}
        />
      </ReactFlowProvider>
    </div>
  );
}
