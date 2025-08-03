<template>
  <!-- Sensor Values Line Chart -->
  <div class="bg-white p-6 rounded-lg shadow-sm border">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">Sensor Values Over Time</h3>
      <div class="text-sm text-gray-500">Real-time sensor measurements</div>
    </div>

    <!-- ECharts Line Chart for Values -->
    <div v-if="sensorValues && sensorValues.length > 0" class="h-96">
      <v-chart
        :option="sensorValuesChartOption"
        :autoresize="true"
        class="h-full w-full"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="h-96 flex items-center justify-center bg-gray-50 rounded"
    >
      <div class="text-center">
        <i class="fas fa-chart-area text-gray-400 text-3xl mb-2"></i>
        <p class="text-gray-500 text-sm">No sensor values available</p>
        <p class="text-gray-400 text-xs mt-1">for the selected period</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import * as echarts from "echarts";

// Register ECharts components
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
]);

// Props
const props = defineProps({
  sensorValues: {
    type: [Array, Object],
    default: () => [],
  },
  selectedEventType: {
    type: String,
    default: "all",
  },
  selectedTimeRange: {
    type: Number,
    default: 30,
  },
  eventTypeOptions: {
    type: Array,
    default: () => [],
  },
});

// Computed properties for ECharts options
const sensorValuesChartOption = computed(() => ({
  title: {
    text: `Sensor Values Over Time (${
      props.selectedEventType === "all"
        ? "All Sensors"
        : props.eventTypeOptions.find(
            (opt) => opt.value === props.selectedEventType
          )?.label
    })`,
    left: "center",
    textStyle: {
      fontSize: 16,
      fontWeight: "bold",
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
    formatter: (params) => {
      let result = `${params[0].axisValue}<br/>`;
      params.forEach((param) => {
        const unit = getSensorUnit(param.seriesName);
        result += `${param.seriesName}: ${param.value}${unit}<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: getSensorValuesSeriesNames(),
    top: 30,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "15%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: (props.sensorValues.chartData || props.sensorValues).map((item) =>
      new Date(item.timestamp).toLocaleTimeString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    axisLabel: {
      rotate: props.selectedTimeRange > 30 ? 45 : 0,
      fontSize: 12,
    },
  },
  yAxis: getSensorValuesYAxis(),
  series: getSensorValuesSeries(),
  dataZoom:
    (props.sensorValues.chartData || props.sensorValues).length > 50
      ? [
          {
            type: "slider",
            show: true,
            start: 70,
            end: 100,
          },
        ]
      : [],
}));

// Helper functions for sensor values chart
const getSensorValuesSeriesNames = () => {
  if (props.selectedEventType === "all") {
    return ["Heart Rate", "HRV", "Temperature", "Sound Level"];
  } else {
    return [
      props.eventTypeOptions.find(
        (opt) => opt.value === props.selectedEventType
      )?.label || "Values",
    ];
  }
};

const getSensorUnit = (seriesName) => {
  switch (seriesName) {
    case "Heart Rate":
      return " BPM";
    case "HRV":
      return " ms";
    case "Temperature":
      return "°C";
    case "Sound Level":
      return " dB";
    default:
      return "";
  }
};

const getSensorValuesYAxis = () => {
  if (props.selectedEventType === "all") {
    return [
      {
        type: "value",
        name: "Heart Rate (BPM) / HRV (ms)",
        position: "left",
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "Temperature (°C)",
        position: "right",
        axisLabel: {
          formatter: "{value}°C",
        },
      },
    ];
  } else {
    const unit = getSensorUnit(
      props.eventTypeOptions.find(
        (opt) => opt.value === props.selectedEventType
      )?.label
    );
    return {
      type: "value",
      name: `${
        props.eventTypeOptions.find(
          (opt) => opt.value === props.selectedEventType
        )?.label
      }${unit}`,
      nameLocation: "middle",
      nameGap: 50,
    };
  }
};

const getSensorValuesSeries = () => {
  const chartData = props.sensorValues.chartData || props.sensorValues;

  if (!chartData || chartData.length === 0) {
    return [];
  }

  if (props.selectedEventType === "all") {
    return [
      {
        name: "Heart Rate",
        type: "line",
        yAxisIndex: 0,
        smooth: true,
        data: chartData.map((item) => item.heartRate || null),
        itemStyle: { color: "#ef4444" },
        lineStyle: { width: 2 },
        connectNulls: false,
      },
      {
        name: "HRV",
        type: "line",
        yAxisIndex: 0,
        smooth: true,
        data: chartData.map((item) => item.hrv || null),
        itemStyle: { color: "#f59e0b" },
        lineStyle: { width: 2 },
        connectNulls: false,
      },
      {
        name: "Temperature",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        data: chartData.map((item) => item.temperature || null),
        itemStyle: { color: "#3b82f6" },
        lineStyle: { width: 2 },
        connectNulls: false,
      },
      {
        name: "Sound Level",
        type: "line",
        yAxisIndex: 0,
        smooth: true,
        data: chartData.map((item) => item.soundLevel || null),
        itemStyle: { color: "#8b5cf6" },
        lineStyle: { width: 2 },
        connectNulls: false,
      },
    ];
  } else {
    const seriesName =
      props.eventTypeOptions.find(
        (opt) => opt.value === props.selectedEventType
      )?.label || "Values";
    return [
      {
        name: seriesName,
        type: "line",
        smooth: true,
        data: chartData.map((item) => {
          switch (props.selectedEventType) {
            case "HeartRate":
              return item.heartRate || null;
            case "HRV":
              return item.hrv || null;
            case "Temperature":
              return item.temperature || null;
            case "SoundLevel":
              return item.soundLevel || null;
            default:
              return null;
          }
        }),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#3b82f6" },
            { offset: 1, color: "#1d4ed8" },
          ]),
        },
        lineStyle: { width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.1)" },
          ]),
        },
        connectNulls: false,
      },
    ];
  }
};
</script>
