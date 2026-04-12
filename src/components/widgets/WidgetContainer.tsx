import { IntentionsWidget } from "./IntentionsWidget";
import { DimensionsWidget } from "./DimensionsWidget";
import { FocusSessionsWidget } from "./FocusSessionsWidget";
import { RoutinesWidget } from "./RoutinesWidget";
import { HealthStatsWidget } from "./HealthStatsWidget";
import { X } from "lucide-react";

export interface WidgetConfig {
  id: string;
  type: string;
}

interface WidgetContainerProps {
  widgets: WidgetConfig[];
  onRemove?: (id: string) => void;
}

export function WidgetContainer({ widgets, onRemove }: WidgetContainerProps) {
  const renderWidget = (widget: WidgetConfig) => {
    const widgetContent = (() => {
      switch (widget.type) {
        case "intentions":
          return <IntentionsWidget />;
        case "dimensions":
          return <DimensionsWidget />;
        case "focus":
          return <FocusSessionsWidget />;
        case "routines":
          return <RoutinesWidget />;
        case "health":
          return <HealthStatsWidget />;
        default:
          return null;
      }
    })();

    if (!widgetContent) return null;

    return (
      <div key={widget.id} className="relative group">
        {widgetContent}
        {onRemove && (
          <button
            onClick={() => onRemove(widget.id)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-card border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            title="Remove widget"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  if (widgets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {widgets.map((widget) => renderWidget(widget))}
    </div>
  );
}

export const WIDGET_TYPES = [
  { id: "intentions", name: "Today's Intentions", icon: "Target" },
  { id: "dimensions", name: "Life Dimensions", icon: "Activity" },
  { id: "focus", name: "Focus Sessions", icon: "Timer" },
  { id: "routines", name: "Active Routines", icon: "Repeat" },
  { id: "health", name: "Health Stats", icon: "Heart" },
];
