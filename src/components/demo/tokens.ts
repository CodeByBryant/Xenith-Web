/**
 * Demo palette tokens — single source of truth for all colors used in the
 * phone mockup and its screens.
 *
 * Phone-UI neutrals are also registered in tailwind.config.ts under the
 * `demo` namespace so they can be used as Tailwind utility classes
 * (e.g. `bg-demo-surface`, `text-demo-subtle`).
 *
 * Dimension / category colors are used both as Tailwind classes
 * (e.g. `text-demo-dim-health`) and as inline `color` prop values passed to
 * SVG elements in RadarChart.
 */

/** Phone-shell neutral scale (always dark — the mockup is a fixed dark UI). */
export const DEMO_COLORS = {
  bg: "#0a0a0a",
  surface: "#1a1a1a",
  border: "#2a2a2a",
  elevated: "#3a3a3a",
  muted: "#4a4a4a",
  subtle: "#6a6a6a",
  tertiary: "#a0a0a0",
  fg: "#fafafa",
  /** Semi-transparent foreground used for the radar chart fill area. */
  fgAlpha10: "rgba(250, 250, 250, 0.1)",
  /** Dynamic-Island camera dot. */
  camera: "#0d3b66",
} as const;

/** Life-dimension / category colours (also used by skill bars in GrowthScreen). */
export const DIMENSION_COLORS = {
  health: "#22c55e",
  mind: "#8b5cf6",
  relationships: "#ec4899",
  work: "#3b82f6",
  finances: "#eab308",
  learning: "#06b6d4",
  rest: "#6366f1",
  purpose: "#f97316",
  /** Trend-down / danger indicator. */
  danger: "#ef4444",
} as const;
