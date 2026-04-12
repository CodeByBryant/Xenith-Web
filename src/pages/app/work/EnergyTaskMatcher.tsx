import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, X, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEnergyLogs } from "@/hooks/use-energy-logs";
import type { EnergyLog } from "@/lib/types";
import { toast } from "sonner";

const TASK_TYPES = ["Deep Work", "Meetings", "Admin", "Creative", "Communication", "Learning"];

// Energy level colors with intensity-based opacity
const getEnergyColor = (level: number) => {
  const intensity = level / 5;
  return {
    bg: `rgba(59, 130, 246, ${0.1 + intensity * 0.15})`, // blue with increasing opacity
    border: `rgba(59, 130, 246, ${0.2 + intensity * 0.6})`,
    text: level >= 4 ? "text-blue-600" : level >= 3 ? "text-blue-500" : "text-blue-400",
  };
};

export default function EnergyTaskMatcher() {
  const [showAdd, setShowAdd] = useState(false);
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());
  
  // Form state
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [taskType, setTaskType] = useState("");

  const { logs, isLoading, add, remove } = useEnergyLogs();

  const resetForm = () => {
    setLogDate(new Date().toISOString().split("T")[0]);
    setTimeOfDay("");
    setEnergyLevel(null);
    setTaskType("");
  };

  const handleSubmit = async () => {
    if (!timeOfDay || energyLevel === null || !taskType) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await add({
        log_date: logDate,
        time_of_day: timeOfDay,
        energy_level: energyLevel,
        task_type: taskType,
      });
      toast.success("Energy log added");
      resetForm();
      setShowAdd(false);
    } catch (error) {
      toast.error("Failed to add log");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Log deleted");
    } catch (error) {
      toast.error("Failed to delete log");
    }
  };

  const toggleDate = (date: string) => {
    setCollapsedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const groupedLogs = logs?.reduce((acc, log) => {
    if (!acc[log.log_date]) acc[log.log_date] = [];
    acc[log.log_date].push(log);
    return acc;
  }, {} as Record<string, EnergyLog[]>) || {};

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Energy-Task Matcher</h1>
              <p className="text-xs text-muted-foreground">Timeline view of energy patterns</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAdd(!showAdd)}
            size="sm"
            variant={showAdd ? "outline" : "default"}
            className="rounded-xl"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>

        {/* Compact Add Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="px-6 py-4 space-y-3">
                <div className="flex gap-3">
                  <Input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="rounded-lg text-sm flex-1"
                  />
                  <Input
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="rounded-lg text-sm flex-1"
                  />
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEnergyLevel(level)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border",
                        energyLevel === level
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-secondary/50 border-border hover:border-blue-500/40"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {TASK_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTaskType(type)}
                      className={cn(
                        "px-2 py-1.5 rounded-lg text-xs font-medium transition-all border",
                        taskType === type
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-secondary/50 border-border hover:border-blue-500/40"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!timeOfDay || energyLevel === null || !taskType}
                  className="w-full rounded-lg h-8 text-sm"
                >
                  Add Log
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline View */}
      <div className="mx-4 mt-4 space-y-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Loading...</div>
        ) : Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12">
            No logs yet. Start tracking your energy patterns!
          </div>
        ) : (
          Object.entries(groupedLogs)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, dayLogs]) => {
              const isCollapsed = collapsedDates.has(date);
              const sortedLogs = [...dayLogs].sort((a, b) => 
                a.time_of_day.localeCompare(b.time_of_day)
              );

              return (
                <div key={date} className="bg-card border border-border rounded-xl overflow-hidden">
                  {/* Date Header */}
                  <button
                    onClick={() => toggleDate(date)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="font-medium text-sm">
                        {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {dayLogs.length} {dayLogs.length === 1 ? "log" : "logs"}
                    </span>
                  </button>

                  {/* Timeline */}
                  {!isCollapsed && (
                    <div className="border-t border-border">
                      {sortedLogs.map((log, index) => {
                        const colors = getEnergyColor(log.energy_level);
                        return (
                          <div
                            key={log.id}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors group",
                              index !== sortedLogs.length - 1 && "border-b border-border/50"
                            )}
                          >
                            {/* Time Marker */}
                            <div className="flex-shrink-0 w-16 pt-0.5">
                              <span className="text-xs font-medium text-muted-foreground">
                                {log.time_of_day}
                              </span>
                            </div>

                            {/* Timeline Line */}
                            <div className="flex-shrink-0 flex flex-col items-center pt-1">
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ 
                                  backgroundColor: colors.border,
                                  boxShadow: `0 0 0 3px ${colors.bg}`
                                }}
                              />
                              {index !== sortedLogs.length - 1 && (
                                <div 
                                  className="w-px h-full mt-1"
                                  style={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex items-start justify-between gap-3 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Energy Badge */}
                                <div
                                  className={cn("px-2 py-0.5 rounded-md text-xs font-medium", colors.text)}
                                  style={{ 
                                    backgroundColor: colors.bg,
                                    border: `1px solid ${colors.border}`
                                  }}
                                >
                                  Level {log.energy_level}
                                </div>
                                
                                {/* Task Type */}
                                <span className="text-sm text-foreground font-medium">
                                  {log.task_type}
                                </span>
                              </div>

                              {/* Delete Button */}
                              <Button
                                onClick={() => handleDelete(log.id)}
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 rounded-md"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed px-4">
        Track energy patterns to optimize task scheduling. Use this data to inform your weekly Work dimension score.
      </p>
    </div>
  );
}
