import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Monitor,
  Palette,
  Zap,
  Globe,
  Database,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Cpu,
  Clock,
  ArrowLeft,
  Layers,
  Bug,
  Wifi,
  HardDrive,
  Package,
  ToggleLeft,
  Accessibility,
  Trash2,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────
interface DevInfo {
  viewport: { width: number; height: number; breakpoint: string };
  theme: string;
  route: string;
  environment: string;
  buildMode: string;
  react: string;
  fps: number;
  memory: { used: number; total: number } | null;
  supabaseStatus: "connected" | "disconnected" | "no-config";
  timestamp: string;
}

interface ConnectionInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────
const getBreakpoint = (w: number) => {
  if (w < 640) return "xs";
  if (w < 768) return "sm";
  if (w < 1024) return "md";
  if (w < 1280) return "lg";
  if (w < 1536) return "xl";
  return "2xl";
};

const getTheme = () => {
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "system-dark"
    : "system-light";
};

const getSupabaseStatus = (): DevInfo["supabaseStatus"] => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) return "no-config";
  return "connected";
};

// ─── Section Card ────────────────────────────────────────────────────
const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-white/80 hover:text-white transition-colors"
      >
        <Icon className="w-4 h-4" />
        <span className="flex-1 text-left uppercase tracking-wider text-xs">
          {title}
        </span>
        {open ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2 border-t border-white/5 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Row ─────────────────────────────────────────────────────────────
const Row = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-white/50">{label}</span>
    <span className={`text-white/90 ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);

// ─── Status Badge ────────────────────────────────────────────────────
const StatusBadge = ({
  status,
}: {
  status: "connected" | "disconnected" | "no-config";
}) => {
  const colors = {
    connected: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    disconnected: "bg-red-500/20 text-red-400 border-red-500/30",
    "no-config": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };
  const labels = {
    connected: "Connected",
    disconnected: "Disconnected",
    "no-config": "No Config",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border ${colors[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "connected"
            ? "bg-emerald-400"
            : status === "disconnected"
              ? "bg-red-400"
              : "bg-amber-400"
        }`}
      />
      {labels[status]}
    </span>
  );
};

// ─── Dev Page ────────────────────────────────────────────────────────
const DevPage = () => {
  const [info, setInfo] = useState<DevInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [localStorageItems, setLocalStorageItems] = useState<
    { key: string; size: string }[]
  >([]);
  const networkInfo = (navigator as Navigator & { connection?: ConnectionInfo })
    .connection;

  // Scan localStorage
  useEffect(() => {
    const items: { key: string; size: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || "";
        items.push({
          key,
          size: `${(new Blob([val]).size / 1024).toFixed(1)}KB`,
        });
      }
    }
    setLocalStorageItems(items);
  }, []);

  // FPS tracking
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Gather info
  const gather = useCallback(() => {
    const perf = (
      performance as unknown as {
        memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
      }
    ).memory;
    setInfo({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: getBreakpoint(window.innerWidth),
      },
      theme: getTheme(),
      route: window.location.pathname,
      environment: import.meta.env.MODE,
      buildMode: import.meta.env.DEV ? "development" : "production",
      react: "18.3",
      fps,
      memory: perf
        ? {
            used: Math.round(perf.usedJSHeapSize / 1048576),
            total: Math.round(perf.jsHeapSizeLimit / 1048576),
          }
        : null,
      supabaseStatus: getSupabaseStatus(),
      timestamp: new Date().toLocaleTimeString(),
    });
  }, [fps]);

  useEffect(() => {
    gather();
    const handleResize = () => gather();
    window.addEventListener("resize", handleResize);
    const interval = setInterval(gather, 2000);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [gather]);

  const copyDebugInfo = () => {
    if (!info) return;
    const text = JSON.stringify(info, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!info) return null;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6 md:p-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
                <Bug className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Dev Panel</h1>
                <p className="text-xs text-white/40">
                  Runtime diagnostics & debug info
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-white/40 mr-4">
              <Clock className="w-3 h-3" />
              <span className="font-mono">{info.timestamp}</span>
            </div>
            <motion.button
              onClick={copyDebugInfo}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/60">
            {info.environment}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/60">
            React v{info.react}
          </span>
          <StatusBadge status={info.supabaseStatus} />
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
              info.fps >= 55
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : info.fps >= 30
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {info.fps} FPS
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
        {/* Environment */}
        <Section title="Environment" icon={Globe}>
          <Row label="Mode" value={info.environment} />
          <Row label="Build" value={info.buildMode} />
          <Row label="React" value={`v${info.react}`} />
          <Row label="Route" value={info.route} mono />
        </Section>

        {/* Viewport */}
        <Section title="Viewport" icon={Monitor}>
          <Row
            label="Size"
            value={`${info.viewport.width} × ${info.viewport.height}`}
            mono
          />
          <Row label="Breakpoint" value={info.viewport.breakpoint} />
          <div className="mt-2 flex gap-1.5">
            {["xs", "sm", "md", "lg", "xl", "2xl"].map((bp) => (
              <span
                key={bp}
                className={`px-2 py-1 rounded text-[10px] font-mono font-medium transition-colors ${
                  bp === info.viewport.breakpoint
                    ? "bg-blue-500/30 text-blue-300 border border-blue-500/40"
                    : "bg-white/5 text-white/30 border border-white/5"
                }`}
              >
                {bp}
              </span>
            ))}
          </div>
        </Section>

        {/* Theme */}
        <Section title="Theme" icon={Palette}>
          <Row label="Current" value={info.theme} />
          <div className="mt-2 grid grid-cols-6 gap-2">
            {[
              "--background",
              "--foreground",
              "--primary",
              "--secondary",
              "--accent",
              "--muted",
            ].map((v) => (
              <div key={v} className="text-center">
                <div
                  className="aspect-square rounded-lg border border-white/10 mb-1"
                  style={{ backgroundColor: `hsl(var(${v}))` }}
                />
                <span className="text-[9px] text-white/30 font-mono">
                  {v.replace("--", "")}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Performance */}
        <Section title="Performance" icon={Zap}>
          <Row label="FPS" value={`${info.fps}`} mono />
          <div className="mt-1">
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  info.fps >= 55
                    ? "bg-emerald-500"
                    : info.fps >= 30
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(100, (info.fps / 60) * 100)}%`,
                }}
              />
            </div>
          </div>
          {info.memory && (
            <>
              <Row
                label="JS Heap"
                value={`${info.memory.used}MB / ${info.memory.total}MB`}
                mono
              />
              <div className="mt-1">
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-300"
                    style={{
                      width: `${(info.memory.used / info.memory.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </Section>

        {/* Supabase */}
        <Section title="Supabase" icon={Database}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Status</span>
            <StatusBadge status={info.supabaseStatus} />
          </div>
          {info.supabaseStatus === "no-config" && (
            <p className="text-[11px] text-amber-400/70 mt-2 leading-relaxed">
              Set{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                VITE_SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
              </code>{" "}
              in{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                .env.local
              </code>
            </p>
          )}
        </Section>

        {/* System */}
        <Section title="System" icon={Cpu}>
          <Row
            label="User Agent"
            value={navigator.userAgent.slice(0, 50) + "…"}
          />
          <Row label="Language" value={navigator.language} />
          <Row label="Online" value={navigator.onLine ? "Yes" : "No"} />
          <Row label="Cores" value={`${navigator.hardwareConcurrency}`} />
        </Section>

        {/* Network */}
        <Section title="Network" icon={Wifi}>
          <Row label="Online" value={navigator.onLine ? "Yes" : "No"} />
          <Row
            label="Effective type"
            value={networkInfo?.effectiveType || "unknown"}
          />
          <Row
            label="Downlink"
            value={`${networkInfo?.downlink || "?"} Mbps`}
            mono
          />
          <Row label="RTT" value={`${networkInfo?.rtt || "?"}ms`} mono />
          <Row label="Save data" value={networkInfo?.saveData ? "Yes" : "No"} />
        </Section>

        {/* localStorage */}
        <Section title="Local Storage" icon={HardDrive} defaultOpen={false}>
          <Row label="Keys" value={`${localStorageItems.length}`} mono />
          <Row
            label="Total size"
            value={`${localStorageItems.reduce((s, i) => s + parseFloat(i.size), 0).toFixed(1)}KB`}
            mono
          />
          {localStorageItems.length > 0 && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {localStorageItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between text-[10px] py-1 border-b border-white/5"
                >
                  <span className="text-white/50 font-mono truncate max-w-[180px]">
                    {item.key}
                  </span>
                  <span className="text-white/30 font-mono">{item.size}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear all
          </button>
        </Section>

        {/* Feature Flags */}
        <Section title="Feature Flags" icon={ToggleLeft}>
          {[
            { flag: "Supabase", on: isSupabaseConfigured },
            {
              flag: "Dark mode",
              on: document.documentElement.classList.contains("dark"),
            },
            { flag: "Dev panel", on: import.meta.env.DEV },
            { flag: "HTTPS", on: location.protocol === "https:" },
            { flag: "Service Worker", on: "serviceWorker" in navigator },
          ].map(({ flag, on }) => (
            <div
              key={flag}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-white/50">{flag}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  on
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-white/30 border border-white/10"
                }`}
              >
                {on ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </Section>

        {/* Dependencies */}
        <Section title="Stack" icon={Package} defaultOpen={false}>
          {[
            { name: "React", version: "18.3" },
            { name: "React Router", version: "6.30" },
            { name: "Framer Motion", version: "12.x" },
            { name: "Tailwind CSS", version: "3.4" },
            { name: "Vite", version: "5.4" },
            { name: "Supabase JS", version: "2.x" },
            { name: "Radix UI", version: "latest" },
            { name: "Recharts", version: "2.15" },
          ].map(({ name, version }) => (
            <Row key={name} label={name} value={version} mono />
          ))}
        </Section>

        {/* Accessibility */}
        <Section title="Accessibility" icon={Accessibility} defaultOpen={false}>
          <Row
            label="prefers-reduced-motion"
            value={
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "reduce"
                : "no-preference"
            }
          />
          <Row
            label="prefers-contrast"
            value={
              window.matchMedia("(prefers-contrast: more)").matches
                ? "more"
                : "no-preference"
            }
          />
          <Row
            label="prefers-color-scheme"
            value={
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            }
          />
          <Row
            label="forced-colors"
            value={
              window.matchMedia("(forced-colors: active)").matches
                ? "active"
                : "none"
            }
          />
        </Section>

        {/* Quick Links */}
        <Section title="Quick Links" icon={Layers}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Features", href: "/#features" },
              { label: "Demo", href: "/#preview" },
              { label: "Pricing", href: "/#pricing" },
              { label: "Start", href: "/#start" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors text-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/20 font-mono">
          xenith-dev · {info.buildMode} · {info.timestamp}
        </p>
      </div>
    </div>
  );
};

// ─── Export ──────────────────────────────────────────────────────────
export default DevPage;
