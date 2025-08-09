<template>
  <!-- Event Data Line Chart -->
  <div class="bg-white p-4 rounded-lg shadow-sm">
    <h3 class="text-lg font-medium text-gray-900 text-center">
      Sensors over time
    </h3>
    <!-- <h3 class="text-sm text-gray-500">
        {{
          selectedEventType === "all"
            ? "All sensors"
            : eventTypeOptions.find((opt) => opt.value === selectedEventType)
                ?.label
        }}
        over time
      </h3> -->
    <!-- ECharts Line Chart -->
    <div v-if="eventTimeline && eventTimeline.length > 0" class="h-96">
      <v-chart
        :option="eventTimelineChartOption"
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
        <i class="fas fa-chart-line text-gray-400 text-3xl mb-2"></i>
        <p class="text-gray-500 text-sm">No timeline data available</p>
        <p class="text-gray-400 text-xs mt-1">for the selected filters</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts";

// Props
const props = defineProps({
  eventTimeline: {
    type: Array,
    default: () => [],
  },
  selectedEventType: {
    type: String,
    default: "all",
  },
  // New: multi-selection of event types to show many series
  selectedEventTypes: {
    type: Array,
    default: () => [],
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

// Map event types to timeline fields and nice labels
const typeToTimeline = {
  HeartRate: { field: "heartRate", label: "Heart Rate", color: "#ef4444" },
  HRV: { field: "hrv", label: "HRV", color: "#f59e0b" },
  Temperature: {
    field: "temperature",
    label: "Temperature",
    color: "#3b82f6",
  },
  SoundLevel: {
    field: "soundLevel",
    label: "Sound Level",
    color: "#8b5cf6",
  },
  gps: { field: "gpsCount", label: "GPS Points", color: "#10b981" },
  motion: { field: "motionCount", label: "Motion Events", color: "#14b8a6" },
};

// Effective selection for this chart: prefer multi-select when provided
const effectiveSelectedTypes = computed(() =>
  Array.isArray(props.selectedEventTypes)
    ? props.selectedEventTypes.filter((t) => !!typeToTimeline[t])
    : []
);

// Computed properties for ECharts options
const eventTimelineChartOption = computed(() => ({
  title: {
    // text:
    //   effectiveSelectedTypes.value.length > 0
    //     ? "Sensors over time"
    //     : props.selectedEventType === "all"
    //     ? ""
    //     : props.eventTypeOptions.find(
    //         (opt) => opt.value === props.selectedEventType
    //       )?.label || "",
    // left: "center",
    // textStyle: {
    //   fontSize: 16,
    //   fontWeight: "bold",
    // },
  },
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      let result = `${params[0].axisValue}<br/>`;
      params.forEach((param) => {
        result += `${param.seriesName}: ${param.value}<br/>`;
      });
      return result;
    },
  },
  legend: {
    data: getTimelineSeriesNames(),
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
    data: props.eventTimeline.map((item) =>
      new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: props.selectedTimeRange <= 7 ? "2-digit" : undefined,
        minute: props.selectedTimeRange <= 7 ? "2-digit" : undefined,
      })
    ),
    axisLabel: {
      rotate: props.selectedTimeRange > 30 ? 45 : 0,
      fontSize: 12,
    },
  },
  yAxis: {
    type: "value",
    name: effectiveSelectedTypes.value.length > 1 ? "Values" : getYAxisLabel(),
    nameLocation: "middle",
    nameGap: 50,
  },
  series: getTimelineSeries(),
  dataZoom:
    props.eventTimeline.length > 50
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

// Helper functions for timeline chart
const getTimelineSeriesNames = () => {
  if (effectiveSelectedTypes.value.length > 0) {
    return effectiveSelectedTypes.value.map((t) => typeToTimeline[t].label);
  }

  debugger;
  if (props.selectedEventType === "all") {
    return ["Heart Rate", "Temperature", "Sound Level", "Motion Events"];
  } else {
    return [
      props.eventTypeOptions.find(
        (opt) => opt.value === props.selectedEventType
      )?.label || "Events",
    ];
  }
};

const getYAxisLabel = () => {
  if (effectiveSelectedTypes.value.length > 1) return "Values";
  const t =
    effectiveSelectedTypes.value[0] ||
    (props.selectedEventType !== "all" ? props.selectedEventType : null);
  switch (t) {
    case "HeartRate":
      return "BPM";
    case "HRV":
      return "ms";
    case "Temperature":
      return "°C";
    case "SoundLevel":
      return "dB";
    case "gps":
      return "GPS Points";
    case "motion":
      return "Motion Events";
    default:
      return "Event Count";
  }
};

const getTimelineSeries = () => {
  if (!props.eventTimeline || props.eventTimeline.length === 0) {
    return [];
  }

  // Multi-series mode: use selectedEventTypes
  if (effectiveSelectedTypes.value.length > 0) {
    return effectiveSelectedTypes.value.map((t) => {
      const meta = typeToTimeline[t];
      return {
        name: meta.label,
        type: "line",
        smooth: true,
        data: props.eventTimeline.map((item) => item[meta.field] || 0),
        itemStyle: { color: meta.color },
        lineStyle: { width: 2 },
      };
    });
  }

  // Fallback to previous single/all behavior
  if (props.selectedEventType === "all") {
    return [
      {
        name: "Heart Rate",
        type: "line",
        smooth: true,
        data: props.eventTimeline.map((item) => item.heartRate || 0),
        itemStyle: { color: "#ef4444" },
        lineStyle: { width: 2 },
      },
      {
        name: "Temperature",
        type: "line",
        smooth: true,
        data: props.eventTimeline.map((item) => item.temperature || 0),
        itemStyle: { color: "#3b82f6" },
        lineStyle: { width: 2 },
      },
      {
        name: "Sound Level",
        type: "line",
        smooth: true,
        data: props.eventTimeline.map((item) => item.soundLevel || 0),
        itemStyle: { color: "#8b5cf6" },
        lineStyle: { width: 2 },
      },
      {
        name: "Motion Events",
        type: "line",
        smooth: true,
        data: props.eventTimeline.map((item) => item.motionCount || 0),
        itemStyle: { color: "#10b981" },
        lineStyle: { width: 2 },
      },
    ];
  } else {
    const seriesName =
      props.eventTypeOptions.find(
        (opt) => opt.value === props.selectedEventType
      )?.label || "Events";
    return [
      {
        name: seriesName,
        type: "line",
        smooth: true,
        data: props.eventTimeline.map((item) => {
          switch (props.selectedEventType) {
            case "HeartRate":
              return item.heartRate || 0;
            case "HRV":
              return item.hrv || 0;
            case "Temperature":
              return item.temperature || 0;
            case "SoundLevel":
              return item.soundLevel || 0;
            case "gps":
              return item.gpsCount || 0;
            case "motion":
              return item.motionCount || 0;
            default:
              return item.eventCount || 0;
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
      },
    ];
  }
};
</script>
