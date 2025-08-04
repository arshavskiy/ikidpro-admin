// ECharts configuration - centralized to prevent duplicate registrations
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  BrushComponent,
} from "echarts/components";

// Flag to prevent duplicate registrations
let isRegistered = false;

export const initECharts = () => {
  if (isRegistered) {
    console.log("ECharts components already registered, skipping...");
    return;
  }

  try {
    // Register ECharts components
    use([
      CanvasRenderer,
      BarChart,
      LineChart,
      PieChart,
      ScatterChart,
      TitleComponent,
      TooltipComponent,
      LegendComponent,
      GridComponent,
      DataZoomComponent,
      ToolboxComponent,
      BrushComponent,
    ]);

    isRegistered = true;
    console.log("ECharts components registered successfully");
  } catch (error) {
    console.warn("ECharts registration warning:", error.message);
    // Don't throw error, just warn - components might already be registered
    isRegistered = true;
  }
};

export default initECharts;
