import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "@/hooks/use-transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Housing",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Subscriptions",
  "Other",
] as const;

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
  "Other",
] as const;

function getMonthStr(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthStr: string) {
  const [year, month] = monthStr.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function TransactionTracker() {
  const [monthOffset, setMonthOffset] = useState(0);
  const currentMonth = getMonthStr(monthOffset);
  const { transactions, isLoading, isAdding, add, remove } = useTransactions(currentMonth);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!amount || !category) {
      toast.error("Amount and category required");
      return;
    }

    try {
      await add({
        amount: parseFloat(amount),
        type,
        category,
        description: description || undefined,
      });
      setAmount("");
      setCategory("");
      setDescription("");
      toast.success("Transaction logged");
    } catch {
      toast.error("Failed to log transaction");
    }
  };

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);
    const net = income - expenses;

    const categoryTotals = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(String(t.amount));
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amt]) => ({ category: cat, amount: amt }));

    return { income, expenses, net, topCategories };
  }, [transactions]);

  const currentCategories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isCurrentMonth = monthOffset === 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((o) => o - 1)}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">
          {formatMonthLabel(currentMonth)}
        </h2>
        <button
          onClick={() => setMonthOffset((o) => o + 1)}
          disabled={monthOffset >= 0}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-xs text-muted-foreground">Income</p>
          </div>
          <p className="text-xl font-bold text-foreground">${stats.income.toFixed(0)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            <p className="text-xs text-muted-foreground">Expenses</p>
          </div>
          <p className="text-xl font-bold text-foreground">${stats.expenses.toFixed(0)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-blue-500" />
            <p className="text-xs text-muted-foreground">Net</p>
          </div>
          <p className={cn(
            "text-xl font-bold",
            stats.net >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {stats.net >= 0 ? "+" : ""}${stats.net.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Top spending categories */}
      {stats.topCategories.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Top Spending
          </h3>
          <div className="space-y-2">
            {stats.topCategories.map(({ category, amount }) => (
              <div key={category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{category}</span>
                  <span className="text-muted-foreground">${amount.toFixed(0)}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${(amount / stats.topCategories[0].amount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add transaction form */}
      {isCurrentMonth && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Log Transaction</h3>

          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                type === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Expense
            </button>
            <button
              onClick={() => setType("income")}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                type === "income"
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Amount</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {currentCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "py-1.5 px-3 rounded-lg text-xs font-medium transition-all text-left",
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Description (optional)</label>
            <Input
              placeholder="What was it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm"
            />
          </div>

          <Button onClick={handleAdd} disabled={isAdding} className="w-full">
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" />
                Log Transaction
              </>
            )}
          </Button>
        </div>
      )}

      {/* Transaction list */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Transactions ({transactions.length})
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions this month
          </p>
        ) : (
          <AnimatePresence>
            {transactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 px-3 py-3 bg-card border border-border rounded-xl"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    t.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10"
                  )}
                >
                  {t.type === "income" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t.category}
                      </p>
                      {t.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(t.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-base font-semibold tabular-nums",
                          t.type === "income" ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {t.type === "income" ? "+" : "-"}$
                        {parseFloat(String(t.amount)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
