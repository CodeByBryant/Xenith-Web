import { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Background,
  type NodeProps,
  type Connection,
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

// ── Dimension config ────────────────────────────────────────────────
interface DimCfg {
  Icon: LucideIcon;
  color: string;      // hex for React Flow edge colors
  text: string;       // tailwind text class
  bg: string;         // tailwind bg class (filled node)
  border: string;     // tailwind border class
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
// Each chain: root → prereq1 → prereq2 → ... → final mastery node
// unlock = array of node IDs that must be completed before this one is unlocked
interface SkillDef {
  id: string;
  label: string;
  tier: "entry" | "skill" | "mastery";
  unlock?: string[];
}

interface DimTree {
  dim: string;
  chains: SkillDef[][];
}

const TREES: DimTree[] = [
  {
    dim: "Health",
    chains: [
      [
        { id: "h1", label: "Track sleep", tier: "entry" },
        { id: "h2", label: "7 hrs/night streak", tier: "skill", unlock: ["h1"] },
        { id: "h3", label: "Cold shower habit", tier: "skill", unlock: ["h2"] },
        { id: "h4", label: "Sleep mastery", tier: "mastery", unlock: ["h3"] },
      ],
      [
        { id: "h5", label: "Daily walk", tier: "entry" },
        { id: "h6", label: "Run 1 mile", tier: "skill", unlock: ["h5"] },
        { id: "h7", label: "Run 5K", tier: "skill", unlock: ["h6"] },
        { id: "h8", label: "1 arm push-up", tier: "mastery", unlock: ["h7"] },
      ],
    ],
  },
  {
    dim: "Mind",
    chains: [
      [
        { id: "mi1", label: "5 min meditation", tier: "entry" },
        { id: "mi2", label: "20 min daily", tier: "skill", unlock: ["mi1"] },
        { id: "mi3", label: "30-day streak", tier: "skill", unlock: ["mi2"] },
        { id: "mi4", label: "Deep stillness", tier: "mastery", unlock: ["mi3"] },
      ],
      [
        { id: "mi5", label: "Read 10 pages/day", tier: "entry" },
        { id: "mi6", label: "Finish a book", tier: "skill", unlock: ["mi5"] },
        { id: "mi7", label: "Teach what you learned", tier: "skill", unlock: ["mi6"] },
        { id: "mi8", label: "Thought leader", tier: "mastery", unlock: ["mi7"] },
      ],
    ],
  },
  {
    dim: "Relationships",
    chains: [
      [
        { id: "r1", label: "Call family weekly", tier: "entry" },
        { id: "r2", label: "Write gratitude note", tier: "skill", unlock: ["r1"] },
        { id: "r3", label: "Resolve a conflict", tier: "skill", unlock: ["r2"] },
        { id: "r4", label: "Deep bond built", tier: "mastery", unlock: ["r3"] },
      ],
      [
        { id: "r5", label: "Meet someone new", tier: "entry" },
        { id: "r6", label: "Grow your network", tier: "skill", unlock: ["r5"] },
        { id: "r7", label: "Mentor someone", tier: "skill", unlock: ["r6"] },
        { id: "r8", label: "Community builder", tier: "mastery", unlock: ["r7"] },
      ],
    ],
  },
  {
    dim: "Work",
    chains: [
      [
        { id: "w1", label: "Clear workspace", tier: "entry" },
        { id: "w2", label: "Deep work 1hr/day", tier: "skill", unlock: ["w1"] },
        { id: "w3", label: "Weekly review", tier: "skill", unlock: ["w2"] },
        { id: "w4", label: "Ship a project", tier: "mastery", unlock: ["w3"] },
      ],
      [
        { id: "w5", label: "Learn a new tool", tier: "entry" },
        { id: "w6", label: "Build something", tier: "skill", unlock: ["w5"] },
        { id: "w7", label: "Launch publicly", tier: "skill", unlock: ["w6"] },
        { id: "w8", label: "Recurring revenue", tier: "mastery", unlock: ["w7"] },
      ],
    ],
  },
  {
    dim: "Finances",
    chains: [
      [
        { id: "fi1", label: "Track spending", tier: "entry" },
        { id: "fi2", label: "Build a budget", tier: "skill", unlock: ["fi1"] },
        { id: "fi3", label: "3-month emergency fund", tier: "skill", unlock: ["fi2"] },
        { id: "fi4", label: "Financial freedom", tier: "mastery", unlock: ["fi3"] },
      ],
      [
        { id: "fi5", label: "Open invest account", tier: "entry" },
        { id: "fi6", label: "Auto-invest monthly", tier: "skill", unlock: ["fi5"] },
        { id: "fi7", label: "Side income stream", tier: "skill", unlock: ["fi6"] },
        { id: "fi8", label: "Passive income flow", tier: "mastery", unlock: ["fi7"] },
      ],
    ],
  },
  {
    dim: "Learning",
    chains: [
      [
        { id: "l1", label: "Read 20 min/day", tier: "entry" },
        { id: "l2", label: "Finish a course", tier: "skill", unlock: ["l1"] },
        { id: "l3", label: "Apply the skill", tier: "skill", unlock: ["l2"] },
        { id: "l4", label: "Get certified", tier: "mastery", unlock: ["l3"] },
      ],
      [
        { id: "l5", label: "Learn 5 words/day", tier: "entry" },
        { id: "l6", label: "Basic conversation", tier: "skill", unlock: ["l5"] },
        { id: "l7", label: "Fluent speaker", tier: "skill", unlock: ["l6"] },
        { id: "l8", label: "Bilingual", tier: "mastery", unlock: ["l7"] },
      ],
    ],
  },
  {
    dim: "Rest",
    chains: [
      [
        { id: "re1", label: "No screens 1hr before bed", tier: "entry" },
        { id: "re2", label: "Wind-down routine", tier: "skill", unlock: ["re1"] },
        { id: "re3", label: "Full rest day weekly", tier: "skill", unlock: ["re2"] },
        { id: "re4", label: "Unplug weekend", tier: "mastery", unlock: ["re3"] },
      ],
      [
        { id: "re5", label: "Start a hobby", tier: "entry" },
        { id: "re6", label: "Dedicated hobby time", tier: "skill", unlock: ["re5"] },
        { id: "re7", label: "Grow the hobby", tier: "skill", unlock: ["re6"] },
        { id: "re8", label: "Take a vacation", tier: "mastery", unlock: ["re7"] },
      ],
    ],
  },
  {
    dim: "Purpose",
    chains: [
      [
        { id: "p1", label: "Write your values", tier: "entry" },
        { id: "p2", label: "Write your mission", tier: "skill", unlock: ["p1"] },
        { id: "p3", label: "Align daily actions", tier: "skill", unlock: ["p2"] },
        { id: "p4", label: "Live with intention", tier: "mastery", unlock: ["p3"] },
      ],
      [
        { id: "p5", label: "Volunteer once", tier: "entry" },
        { id: "p6", label: "Gratitude practice", tier: "skill", unlock: ["p5"] },
        { id: "p7", label: "Big project started", tier: "skill", unlock: ["p6"] },
        { id: "p8", label: "Define your legacy", tier: "mastery", unlock: ["p7"] },
      ],
    ],
  },
];

// ── Build nodes + edges for a dimension ────────────────────────────
function buildGraph(dimTree: DimTree, completedIds: Set<string>): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const cfg = DIM[dimTree.dim];

  dimTree.chains.forEach((chain, chainIdx) => {
    const xBase = chainIdx * 220;
    chain.forEach((skill, skillIdx) => {
      const allUnlocked = !skill.unlock || skill.unlock.every((id) => completedIds.has(id));
      const done = completedIds.has(skill.id);

      nodes.push({
        id: skill.id,
        type: "skillNode",
        position: { x: xBase, y: skillIdx * 110 },
        data: { skill, dim: dimTree.dim, done, locked: !allUnlocked, cfg },
        draggable: true,
      });

      if (skillIdx > 0) {
        const prev = chain[skillIdx - 1];
        const prevDone = completedIds.has(prev.id);
        edges.push({
          id: `e-${prev.id}-${skill.id}`,
          source: prev.id,
          target: skill.id,
          style: { stroke: prevDone ? cfg.color : "hsl(var(--border))", strokeWidth: 2 },
          animated: prevDone && !done,
        });
      }
    });
  });

  return { nodes, edges };
}

// ── Custom node component ───────────────────────────────────────────
interface SkillNodeData {
  skill: SkillDef;
  dim: string;
  done: boolean;
  locked: boolean;
  cfg: DimCfg;
  onToggle?: (id: string) => void;
}

function SkillNode({ data }: NodeProps) {
  const d = data as SkillNodeData;
  const { skill, done, locked, cfg } = d;

  const tierLabel =
    skill.tier === "mastery" ? "Mastery" :
    skill.tier === "skill" ? "Skill" : "Entry";

  return (
    <div
      onClick={() => !locked && d.onToggle?.(skill.id)}
      className={cn(
        "relative w-44 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none group",
        done
          ? `${cfg.border} bg-card`
          : locked
          ? "border-border bg-card opacity-50 cursor-not-allowed"
          : "border-border bg-card hover:border-foreground/40",
      )}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-0 !bg-border" />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-0.5",
            done ? cfg.text : "text-muted-foreground"
          )}>
            {tierLabel}
          </p>
          <p className={cn("text-xs font-medium leading-snug",
            locked ? "text-muted-foreground/60" : done ? "text-foreground" : "text-foreground"
          )}>
            {skill.label}
          </p>
        </div>

        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
          done ? `${cfg.bg} border-transparent` :
          locked ? "border-border opacity-40" : "border-border group-hover:border-foreground/50"
        )}>
          {done
            ? <Check className="w-3 h-3 text-white" />
            : locked
            ? <Lock className="w-2.5 h-2.5 text-muted-foreground/50" />
            : null
          }
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border-0 !bg-border" />
    </div>
  );
}

const nodeTypes = { skillNode: SkillNode };

// ── Per-dimension flow ──────────────────────────────────────────────
function DimFlow({ dimTree, completedIds, onToggle }: {
  dimTree: DimTree;
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const { nodes: initNodes, edges: initEdges } = buildGraph(dimTree, completedIds);

  // Inject toggle into each node's data
  const nodesWithCb = initNodes.map((n) => ({
    ...n,
    data: { ...n.data, onToggle },
  }));

  const [nodes, , onNodesChange] = useNodesState(nodesWithCb);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const onConnect = useCallback((params: Connection) => setEdges((ed) => addEdge(params, ed)), [setEdges]);

  const cfg = DIM[dimTree.dim];

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-border bg-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(var(--border))" gap={20} size={1} />
        {/* Dimension label overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
          <cfg.Icon className={cn("w-4 h-4", cfg.text)} />
          <span className="text-sm font-semibold text-foreground">{dimTree.dim}</span>
        </div>
      </ReactFlow>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────
const TOTAL_NODES = TREES.reduce((a, t) => a + t.chains.reduce((b, c) => b + c.length, 0), 0);

export default function Growth() {
  const { completedIds, toggle } = useSkillTree();
  const [activeDim, setActiveDim] = useState(0);

  const dimTree = TREES[activeDim];
  const totalDone = TREES.flatMap((t) => t.chains.flat()).filter((s) => completedIds.has(s.id)).length;
  const dimDone = dimTree.chains.flat().filter((s) => completedIds.has(s.id)).length;
  const dimTotal = dimTree.chains.flat().length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Overall header */}
      <div className="flex items-center justify-between border border-border rounded-2xl px-5 py-4 bg-card">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Growth Path</p>
          <p className="text-2xl font-semibold text-foreground tabular-nums mt-0.5">
            {totalDone}
            <span className="text-sm font-normal text-muted-foreground"> / {TOTAL_NODES} nodes</span>
          </p>
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90">
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

      {/* Dimension tabs */}
      <div className="flex gap-2 flex-wrap">
        {TREES.map((t, i) => {
          const cfg = DIM[t.dim];
          const done = t.chains.flat().filter((s) => completedIds.has(s.id)).length;
          const total = t.chains.flat().length;
          const isActive = activeDim === i;
          return (
            <button
              key={t.dim}
              onClick={() => setActiveDim(i)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                isActive
                  ? `${cfg.bg} border-transparent text-white`
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <cfg.Icon className="w-3 h-3" />
              {t.dim}
              {done > 0 && (
                <span className={cn("tabular-nums", isActive ? "opacity-80" : cfg.text)}>
                  {done}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress bar for active dim */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", DIM[dimTree.dim].bg)}
            style={{ width: `${(dimDone / dimTotal) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">{dimDone}/{dimTotal}</span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[11px] text-muted-foreground">
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

      {/* React Flow skill tree */}
      <ReactFlowProvider>
        <DimFlow
          key={dimTree.dim}
          dimTree={dimTree}
          completedIds={completedIds}
          onToggle={toggle}
        />
      </ReactFlowProvider>
    </div>
  );
}
