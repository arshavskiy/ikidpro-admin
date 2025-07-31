<template>
  <!-- Charts Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Daily Events Chart -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Daily Events Trend</h3>
        <div class="text-sm text-gray-500">
          Last {{ selectedTimeRange }} days
        </div>
      </div>

      <!-- ECharts Bar Chart -->
      <div v-if="analytics.dailyTrend.length > 0" class="h-80">
        <v-chart
          :option="dailyTrendChartOption"
          :autoresize="true"
          class="h-full w-full"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="h-80 flex items-center justify-center bg-gray-50 rounded"
      >
        <div class="text-center">
          <i class="fas fa-chart-line text-gray-400 text-3xl mb-2"></i>
          <p class="text-gray-500 text-sm">No event data available</p>
          <p class="text-gray-400 text-xs mt-1">for the selected time period</p>
        </div>
      </div>
    </div>

    <!-- Hourly Distribution Chart -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          Hourly Activity Distribution
        </h3>
        <div class="text-sm text-gray-500">24-hour pattern</div>
      </div>

      <!-- ECharts Bar Chart -->
      <div v-if="analytics.hourlyDistribution.length > 0" class="h-80">
        <v-chart
          :option="hourlyDistributionChartOption"
          :autoresize="true"
          class="h-full w-full"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="h-80 flex items-center justify-center bg-gray-50 rounded"
      >
        <div class="text-center">
          <i class="fas fa-clock text-gray-400 text-3xl mb-2"></i>
          <p class="text-gray-500 text-sm">No hourly data available</p>
          <p class="text-gray-400 text-xs mt-1">for the selected time period</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import * as echarts from "echarts";

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
]);

// Props
const props = defineProps({
  analytics: {
    type: Object,
    required: true,
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
const dailyTrendChartOption = computed(() => ({
  title: {
    text: `Daily Events Trend (${
      props.selectedEventType === "all"
        ? "All Events"
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
    formatter: (params) => {
      const dataIndex = params[0].dataIndex;
      const value = params[0].value;
      const date = formatDayLabel(dataIndex, props.selectedTimeRange);
      return `${date}<br/>Events: ${value}`;
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: props.analytics.dailyTrend.map((_, index) =>
      formatDayLabel(index, props.selectedTimeRange)
    ),
    axisLabel: {
      rotate: 45,
      fontSize: 12,
    },
  },
  yAxis: {
    type: "value",
    name: "Events",
    nameLocation: "middle",
    nameGap: 40,
  },
  series: [
    {
      name: "Events",
      type: "bar",
      data: props.analytics.dailyTrend,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#3b82f6" },
          { offset: 1, color: "#1d4ed8" },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#2563eb" },
            { offset: 1, color: "#1e40af" },
          ]),
        },
      },
    },
  ],
  dataZoom:
    props.analytics.dailyTrend.length > 30
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

const hourlyDistributionChartOption = computed(() => ({
  title: {
    text: `Hourly Activity Distribution (${
      props.selectedEventType === "all"
        ? "All Events"
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
    formatter: (params) => {
      const hour = params[0].dataIndex;
      const value = params[0].value;
      const isPeak = hour === props.analytics.peakHour;
      return `${hour}:00 - ${hour + 1}:00<br/>Events: ${value}${
        isPeak ? "<br/>🏆 Peak Hour" : ""
      }`;
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    axisLabel: {
      fontSize: 12,
      interval: 1,
    },
  },
  yAxis: {
    type: "value",
    name: "Events",
    nameLocation: "middle",
    nameGap: 40,
  },
  series: [
    {
      name: "Events",
      type: "bar",
      data: props.analytics.hourlyDistribution.map((value, hour) => ({
        value,
        itemStyle: {
          color:
            hour === props.analytics.peakHour
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#ef4444" },
                  { offset: 1, color: "#dc2626" },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#60a5fa" },
                  { offset: 1, color: "#3b82f6" },
                ]),
          borderRadius: [4, 4, 0, 0],
        },
      })),
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#1d4ed8" },
            { offset: 1, color: "#1e40af" },
          ]),
        },
      },
    },
  ],
}));

// Helper function
const formatDayLabel = (daysAgo, totalDays) => {
  const date = new Date();
  date.setDate(date.getDate() - (totalDays - 1 - daysAgo));

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else if (totalDays <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};
</script>
