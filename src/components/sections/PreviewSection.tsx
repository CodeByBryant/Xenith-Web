import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Plus, Play, Pause, RotateCcw, Flame, Droplets, Brain, Heart, Briefcase, Sparkles } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

const initialTasks: Task[] = [
  { id: 1, text: "Morning meditation - 10 min", completed: false, category: "Mind" },
  { id: 2, text: "Review quarterly goals", completed: false, category: "Work" },
  { id: 3, text: "Call mom", completed: false, category: "Relationships" },
  { id: 4, text: "Gym session - strength training", completed: false, category: "Health" },
  { id: 5, text: "Read 20 pages", completed: false, category: "Mind" },
];

const dimensions = [
  { name: "Health", icon: Heart, value: 75, color: "bg-foreground" },
  { name: "Mind", icon: Brain, value: 60, color: "bg-foreground" },
  { name: "Work", icon: Briefcase, value: 85, color: "bg-foreground" },
  { name: "Relationships", icon: Heart, value: 50, color: "bg-foreground" },
  { name: "Growth", icon: Sparkles, value: 70, color: "bg-foreground" },
];

const screens = [
  { id: "dashboard", title: "Dashboard", description: "Your daily command center" },
  { id: "intentions", title: "Intentions", description: "Plan with purpose" },
  { id: "focus", title: "Focus Timer", description: "Deep work made simple" },
  { id: "balance", title: "Life Balance", description: "Track all dimensions" },
];

export const PreviewSection = () => {
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [newTask, setNewTask] = useState("");
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, category: "Work" }]);
      setNewTask("");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <section id="preview" className="py-32 px-6 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-muted/50 to-transparent rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            An interactive glimpse into your intentional future.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Device mockup */}
          <div className="relative mx-auto max-w-4xl">
            {/* Browser frame */}
            <div className="glass rounded-2xl overflow-hidden shadow-2xl glow-border">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-secondary rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center font-mono">
                    app.xenith.io
                  </div>
                </div>
              </div>

              {/* Screen content */}
              <div className="aspect-[16/10] bg-background relative overflow-hidden p-6">
                <AnimatePresence mode="wait">
                  {activeScreen === "dashboard" && (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full grid grid-cols-3 gap-4"
                    >
                      {/* Left: Today's Focus */}
                      <div className="col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-serif font-medium">Today's Intentions</h3>
                          <span className="text-sm text-muted-foreground">{completedCount}/{tasks.length} complete</span>
                        </div>
                        <div className="space-y-2">
                          {tasks.slice(0, 4).map((task) => (
                            <motion.div
                              key={task.id}
                              layout
                              onClick={() => toggleTask(task.id)}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                task.completed 
                                  ? "bg-secondary/50 border-border" 
                                  : "bg-card border-border hover:border-foreground/20"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                task.completed ? "bg-foreground border-foreground" : "border-muted-foreground"
                              }`}>
                                {task.completed && <Check className="w-3 h-3 text-background" />}
                              </div>
                              <span className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                {task.text}
                              </span>
                              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                {task.category}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Stats */}
                      <div className="space-y-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-foreground" />
                            <span className="text-sm font-medium">Streak</span>
                          </div>
                          <div className="text-4xl font-serif font-bold">{streak}</div>
                          <div className="text-xs text-muted-foreground">days consistent</div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-5 h-5 text-foreground" />
                            <span className="text-sm font-medium">Focus Time</span>
                          </div>
                          <div className="text-4xl font-serif font-bold">4.5h</div>
                          <div className="text-xs text-muted-foreground">today</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === "intentions" && (
                    <motion.div
                      key="intentions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-serif font-medium">Set Your Intentions</h3>
                        <span className="text-sm text-muted-foreground">What matters today?</span>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTask()}
                          placeholder="Add a new intention..."
                          className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                        <button
                          onClick={addTask}
                          className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 space-y-2 overflow-auto">
                        {tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            layout
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              task.completed 
                                ? "bg-secondary/50 border-border" 
                                : "bg-card border-border hover:border-foreground/20"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              task.completed ? "bg-foreground border-foreground" : "border-muted-foreground"
                            }`}>
                              {task.completed && <Check className="w-3 h-3 text-background" />}
                            </div>
                            <span className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === "focus" && (
                    <motion.div
                      key="focus"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col items-center justify-center"
                    >
                      <h3 className="text-lg font-serif font-medium mb-2">Focus Session</h3>
                      <p className="text-sm text-muted-foreground mb-8">Deep work in progress</p>
                      
                      <div className="relative mb-8">
                        <div className="w-48 h-48 rounded-full border-4 border-secondary flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-mono font-bold">{formatTime(timerSeconds)}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {timerRunning ? "Focusing..." : "Ready"}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-foreground"
                          style={{
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((1 - timerSeconds / (25 * 60)) * 2 * Math.PI)}% ${50 - 50 * Math.cos((1 - timerSeconds / (25 * 60)) * 2 * Math.PI)}%, 50% 50%)`
                          }}
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setTimerRunning(!timerRunning)}
                          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
                        >
                          {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {timerRunning ? "Pause" : "Start"}
                        </button>
                        <button
                          onClick={resetTimer}
                          className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === "balance" && (
                    <motion.div
                      key="balance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-serif font-medium">Life Balance</h3>
                        <span className="text-sm text-muted-foreground">This week's progress</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {dimensions.map((dim, i) => (
                          <motion.div
                            key={dim.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-border rounded-xl p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <dim.icon className="w-4 h-4 text-foreground" />
                              <span className="text-sm font-medium">{dim.name}</span>
                              <span className="text-sm text-muted-foreground ml-auto">{dim.value}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${dim.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${dim.value}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Screen selector */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={`px-5 py-2.5 text-sm rounded-xl transition-all duration-200 font-medium ${
                  activeScreen === screen.id
                    ? "bg-foreground text-background shadow-lg"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {screen.title}
              </button>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            ↑ Click tabs to explore • Interact with the demo above ↑
          </p>
        </motion.div>
      </div>
    </section>
  );
};
