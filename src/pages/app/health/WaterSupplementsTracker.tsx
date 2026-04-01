import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Plus,
  X,
  Trash2,
  Check,
  Pill,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  useWater,
  useSupplements,
  useSupplementLogs,
} from "@/hooks/use-water-supplements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}
function offsetDate(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}
function formatDate(d: Date) {
  const today = new Date();
  const ds = d.toDateString();
  if (ds === today.toDateString()) return "Today";
  if (ds === offsetDate(today, -1).toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── WaterTracker ────────────────────────────────────────────────────────────
function WaterTracker({ date }: { date: Date }) {
  const { logs, totalMl, addWater, isAdding, removeLog } = useWater(date);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const quickAmounts = [250, 500, 750, 1000];
  const goalMl = 2500; // Default 2.5L goal
  const progress = Math.min((totalMl / goalMl) * 100, 100);

  const handleQuickAdd = async (ml: number) => {
    try {
      await addWater(ml);
      toast.success(`Added ${ml}ml water`);
    } catch {
      toast.error("Failed to log water");
    }
  };

  const handleCustomAdd = async () => {
    const amount = parseInt(customAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await addWater(amount);
      toast.success(`Added ${amount}ml water`);
      setCustomAmount("");
      setShowCustomInput(false);
    } catch {
      toast.error("Failed to log water");
    }
  };

  const handleRemove = async (logId: string, amount: number) => {
    try {
      await removeLog(logId);
      toast.success(`Removed ${amount}ml`);
    } catch {
      toast.error("Failed to remove log");
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress ring */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <svg width={90} height={90} className="-rotate-90">
              <circle
                cx={45}
                cy={45}
                r={38}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth={6}
              />
              <circle
                cx={45}
                cy={45}
                r={38}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={6}
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplet className="w-5 h-5 text-blue-500 mb-0.5" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-foreground">
              {(totalMl / 1000).toFixed(1)}L
            </p>
            <p className="text-sm text-muted-foreground">
              of {goalMl / 1000}L goal
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {logs.length} log{logs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((ml) => (
          <button
            key={ml}
            onClick={() => handleQuickAdd(ml)}
            disabled={isAdding}
            className="bg-card border border-border rounded-xl px-3 py-3 hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <p className="text-sm font-semibold text-foreground">{ml}ml</p>
            <p className="text-[10px] text-muted-foreground">
              +{(ml / 1000).toFixed(1)}L
            </p>
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <AnimatePresence>
        {showCustomInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <Input
              type="number"
              placeholder="Custom amount (ml)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
              className="flex-1"
            />
            <Button onClick={handleCustomAdd} disabled={isAdding} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowCustomInput(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Custom Amount
          </Button>
        )}
      </AnimatePresence>

      {/* Recent logs */}
      {logs.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Recent Logs
          </p>
          <div className="space-y-1.5">
            {logs.slice(-5).reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-sm text-foreground">
                    {log.amount_ml}ml
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.logged_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => handleRemove(log.id, log.amount_ml)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SupplementManager ───────────────────────────────────────────────────────
function SupplementManager() {
  const { supplements, addSupplement, removeSupplement, isAdding } = useSupplements();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Enter supplement name");
      return;
    }
    try {
      await addSupplement({
        name: name.trim(),
        dosage: dosage.trim() || undefined,
        unit: unit.trim() || undefined,
      });
      toast.success("Supplement added");
      setName("");
      setDosage("");
      setUnit("");
      setShowAddForm(false);
    } catch {
      toast.error("Failed to add supplement");
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will remove all logs.`)) return;
    try {
      await removeSupplement(id);
      toast.success("Supplement removed");
    } catch {
      toast.error("Failed to remove supplement");
    }
  };

  const activeSupplements = supplements.filter((s) => s.active);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Your Supplements ({activeSupplements.length})
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? (
            <>
              <X className="w-3.5 h-3.5 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-xl p-4 space-y-3"
          >
            <Input
              placeholder="Supplement name (e.g., Vitamin D3)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Dosage (e.g., 5000)"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
              <Input
                placeholder="Unit (e.g., IU)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAdd}
              disabled={isAdding}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? "Adding..." : "Add Supplement"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supplements list */}
      {activeSupplements.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Pill className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No supplements added yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeSupplements.map((supp) => (
            <div
              key={supp.id}
              className="flex items-center justify-between px-3 py-2.5 bg-card border border-border rounded-xl"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Pill className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {supp.name}
                  </p>
                  {(supp.dosage || supp.unit) && (
                    <p className="text-xs text-muted-foreground">
                      {supp.dosage} {supp.unit}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemove(supp.id, supp.name)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SupplementTracker ───────────────────────────────────────────────────────
function SupplementTracker({ date }: { date: Date }) {
  const { supplements } = useSupplements();
  const { logs, logSupplement, isLogging } = useSupplementLogs(date);

  const activeSupplements = supplements.filter((s) => s.active);

  const isTaken = (suppId: string) => {
    return logs.find((log) => log.supplement_id === suppId)?.taken || false;
  };

  const handleToggle = async (suppId: string) => {
    const current = isTaken(suppId);
    try {
      await logSupplement({ supplementId: suppId, taken: !current });
      toast.success(current ? "Marked as not taken" : "Marked as taken");
    } catch {
      toast.error("Failed to update");
    }
  };

  if (activeSupplements.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Add supplements above to track daily intake
        </p>
      </div>
    );
  }

  const takenCount = activeSupplements.filter((s) => isTaken(s.id)).length;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-1">Daily Progress</p>
        <p className="text-2xl font-bold text-foreground">
          {takenCount} / {activeSupplements.length}
        </p>
        <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{
              width: `${(takenCount / activeSupplements.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {activeSupplements.map((supp) => {
          const taken = isTaken(supp.id);
          return (
            <button
              key={supp.id}
              onClick={() => handleToggle(supp.id)}
              disabled={isLogging}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                taken
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-card border-border hover:bg-secondary",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    taken
                      ? "bg-green-500 border-green-500"
                      : "border-muted-foreground",
                  )}
                >
                  {taken && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {supp.name}
                  </p>
                  {(supp.dosage || supp.unit) && (
                    <p className="text-xs text-muted-foreground">
                      {supp.dosage} {supp.unit}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function WaterSupplementsTracker() {
  const [date, setDate] = useState(new Date());
  const [tab, setTab] = useState<"water" | "supplements">("water");

  const isToday = toDateStr(date) === toDateStr();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Date nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setDate((d) => offsetDate(d, -1))}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-foreground">
          {formatDate(date)}
        </span>
        <button
          onClick={() => setDate((d) => offsetDate(d, 1))}
          disabled={isToday}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary p-1 rounded-xl">
        <button
          onClick={() => setTab("water")}
          className={cn(
            "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            tab === "water"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Droplet className="w-4 h-4 inline mr-2" />
          Water
        </button>
        <button
          onClick={() => setTab("supplements")}
          className={cn(
            "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            tab === "supplements"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Pill className="w-4 h-4 inline mr-2" />
          Supplements
        </button>
      </div>

      {/* Content */}
      {tab === "water" && <WaterTracker date={date} />}
      {tab === "supplements" && (
        <div className="space-y-6">
          <SupplementManager />
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-3">
              Daily Tracking
            </p>
            <SupplementTracker date={date} />
          </div>
        </div>
      )}
    </div>
  );
}
