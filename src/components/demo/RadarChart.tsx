import { motion } from "framer-motion";
import { DEMO_COLORS } from "./tokens";

export interface Dimension {
  name: string;
  value: number;
  color: string;
}

interface RadarChartProps {
  dimensions: Dimension[];
  size?: number;
  onDimensionClick?: (index: number) => void;
}

export const RadarChart = ({ dimensions, size = 200, onDimensionClick }: RadarChartProps) => {
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const numPoints = dimensions.length;
  
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = radius + 25;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Create the filled polygon path
  const polygonPoints = dimensions
    .map((dim, i) => {
      const point = getPoint(i, dim.value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  // Grid circles
  const gridCircles = [2, 4, 6, 8, 10];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid circles */}
      {gridCircles.map((value) => (
        <circle
          key={value}
          cx={center}
          cy={center}
          r={(value / 10) * radius}
          fill="none"
          stroke={DEMO_COLORS.border}
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const point = getPoint(i, 10);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke={DEMO_COLORS.border}
            strokeWidth="1"
          />
        );
      })}

      {/* Filled area */}
      <motion.polygon
        points={polygonPoints}
        fill={DEMO_COLORS.fgAlpha10}
        stroke={DEMO_COLORS.fg}
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Data points with colors */}
      {dimensions.map((dim, i) => {
        const point = getPoint(i, dim.value);
        return (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={dim.color}
            stroke={DEMO_COLORS.bg}
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => onDimensionClick?.(i)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.3 }}
          />
        );
      })}

      {/* Labels */}
      {dimensions.map((dim, i) => {
        const labelPoint = getLabelPoint(i);
        return (
          <motion.text
            key={i}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] fill-demo-tertiary font-medium cursor-pointer"
            onClick={() => onDimensionClick?.(i)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 + 0.3 }}
          >
            {dim.name}
          </motion.text>
        );
      })}
    </svg>
  );
};
