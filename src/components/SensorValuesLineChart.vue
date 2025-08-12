<template>
  <!-- Sensor Values Line Chart -->
  <div class="bg-white p-4 rounded-lg shadow-sm">
    <!-- Multi-Checkbox Sensor Selection -->
    <!-- <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-700 mb-3">
        Select Sensors to Display:
      </h4>
      <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        <label
          v-for="sensor in availableSensorOptions"
          :key="sensor.value"
          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          <input
            type="checkbox"
            :value="sensor.value"
            v-model="selectedSensors"
            @change="updateSensorSelection"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span class="text-sm text-gray-700">{{ sensor.label }}</span>
        </label>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <div class="text-xs text-gray-500">
          {{ selectedSensors.length }} of
          {{ availableSensorOptions.length }} sensors selected
        </div>
        <div class="space-x-2">
          <button
            @click="selectAllSensors"
            class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Select All
          </button>
          <button
            @click="clearAllSensors"
            class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div> -->

    <!-- ECharts Line Chart for Values -->
    <!-- <h3 class="text-lg font-medium text-gray-900 text-center">
      Sensor Values Over Time
    </h3> -->
    <div
      v-if="
        (isMoodMode && eventTimeline && eventTimeline.length > 0) ||
        (!isMoodMode && filteredChartData && filteredChartData.length > 0)
      "
      :style="{ height: chartHeight + 'px' }"
    >
      <v-chart :option="sensorValuesChartOption" :autoresize="true" />
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
import { computed, ref, watch } from "vue";
import VChart from "vue-echarts";
import * as echarts from "echarts";
import {
  availableSensorOptions as AVAILABLE_SENSOR_OPTIONS,
  sensorConfig as SENSOR_CONFIG,
  eventTypeToSensorKey as EVENTTYPE_TO_SENSORKEY,
} from "../models/models";

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
  // Use pre-aggregated timeline buckets for categorical series like mood
  eventTimeline: {
    type: Array,
    default: () => [],
  },
  chartHeight: {
    type: Number,
    default: 400, // Default height for the chart
  },
});

// Emits
const emit = defineEmits(["sensorSelectionChanged"]);

// Available sensor options for multi-checkbox selection
const availableSensorOptions = ref([...AVAILABLE_SENSOR_OPTIONS]);

// Selected sensors (reactive)
const selectedSensors = ref([
  "HeartRate",
  "Temperature",
  "SoundLevel",
  "EDA",
  "Speed_spm",
  "HRV",
  "Accuracy",
  "Steps",
  "Altitude",
  "Light",
  "Pressure",
  "Calories",
  "Bearing",
  "Sp02",
]);

// Methods for sensor selection
const updateSensorSelection = () => {
  emit("sensorSelectionChanged", selectedSensors.value);
};

const selectAllSensors = () => {
  selectedSensors.value = availableSensorOptions.value.map(
    (sensor) => sensor.value
  );
  updateSensorSelection();
};

const clearAllSensors = () => {
  selectedSensors.value = [];
  updateSensorSelection();
};

// Sensor configuration map (shared by helpers and series builder)
const sensorConfig = SENSOR_CONFIG;

// Map external event type keys to our sensor keys (only those we chart)
const eventTypeToSensorKey = EVENTTYPE_TO_SENSORKEY;

// Helper: get a single sensor's value from an event item
const getSensorValue = (sensorKey, item) => {
  const config = sensorConfig[sensorKey];
  if (config === 0) return null;
  if (Array.isArray(config.field)) {
    for (const field of config.field) {
      const v = item?.[field];
      if (v !== undefined && v !== null) return v;
    }
    return null;
  }
  const v = item?.[config.field];
  return v !== undefined && v !== null ? v : null;
};

// Raw and filtered chart data (keep only events that have any selected value)
const chartDataRaw = computed(
  () => props.sensorValues.chartData || props.sensorValues
);
// Effective selected sensors: follow external selectedEventTypes when provided
const effectiveSelectedSensors = computed(() => {
  if (Array.isArray(props.selectedEventTypes)) {
    // Explicitly respect an empty external selection: show no sensors
    if (props.selectedEventTypes.length === 0) return [];
    const mapped = props.selectedEventTypes
      .map((t) => eventTypeToSensorKey[t])
      .filter(Boolean);
    // Deduplicate and keep only known option values
    const allowed = new Set(availableSensorOptions.value.map((s) => s.value));
    return [...new Set(mapped)].filter((k) => allowed.has(k));
  }
  return selectedSensors.value;
});

const filteredChartData = computed(() => {
  const data = Array.isArray(chartDataRaw.value) ? chartDataRaw.value : [];
  if (
    !effectiveSelectedSensors.value ||
    effectiveSelectedSensors.value.length === 0
  )
    return [];
  return data.filter((item) =>
    effectiveSelectedSensors.value.some(
      (key) => getSensorValue(key, item) !== null
    )
  );
});

// Mood mode: when only "mood" is selected, render a categorical count series using timeline buckets
const isMoodMode = computed(() =>
  Array.isArray(effectiveSelectedSensors.value)
    ? effectiveSelectedSensors.value.length === 1 &&
      effectiveSelectedSensors.value.includes("mood")
    : false
);
const moodTimeline = computed(() =>
  Array.isArray(props.eventTimeline) ? props.eventTimeline : []
);
const moodXAxis = computed(() =>
  moodTimeline.value.map((item) =>
    new Date(item.timestamp).toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  )
);
const moodSeries = computed(() => {
  const labelSet = new Set();
  for (const pt of moodTimeline.value) {
    const mc = pt?.moodCount || {};
    for (const k of Object.keys(mc)) labelSet.add(k);
  }
  const labels = Array.from(labelSet);
  return labels.map((label) => ({
    name: label,
    type: "line",
    smooth: true,
    data: moodTimeline.value.map((pt) => pt?.moodCount?.[label] ?? 0),
    connectNulls: true,
    lineStyle: { width: 2 },
  }));
});

// Computed properties for ECharts options
const sensorValuesChartOption = computed(() =>
  isMoodMode.value
    ? {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: { backgroundColor: "#6a7985" },
          },
          formatter: (params) => {
            let result = `${params?.[0]?.axisValue || ""}<br/>`;
            params
              .filter((p) => p.value !== null && p.value !== undefined)
              .forEach((param) => {
                result += `${param.seriesName}: ${param.value}<br/>`;
              });
            return result;
          },
        },
        legend: { data: moodSeries.value.map((s) => s.name), top: 30 },
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
          data: moodXAxis.value,
          axisLabel: {
            rotate: props.selectedTimeRange > 30 ? 45 : 0,
            fontSize: 12,
          },
        },
        yAxis: { type: "value", name: "Mood Count" },
        series: moodSeries.value,
        dataZoom:
          moodTimeline.value.length > 50
            ? [{ type: "slider", show: true, start: 70, end: 100 }]
            : [],
      }
    : {
        // title: {
        //   text: `${
        //     effectiveSelectedSensors.value.length === 0
        //       ? "No Sensors Selected"
        //       : effectiveSelectedSensors.value.length ===
        //         availableSensorOptions.value.length
        //       ? "All Sensors"
        //       : effectiveSelectedSensors.value.length > 3
        //       ? ``
        //       : effectiveSelectedSensors.value
        //           .map((sensorValue) => {
        //             const sensor = availableSensorOptions.value.find(
        //               (s) => s.value === sensorValue
        //             );
        //             return sensor ? sensor.label : sensorValue;
        //           })
        //           .join(", ")
        //   }`,
        //   left: "center",
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: "bold",
        //   },
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          formatter: (params) => {
            let result = `${params?.[0]?.axisValue || ""}<br/>`;
            params
              .filter((p) => p.value !== null && p.value !== undefined)
              .forEach((param) => {
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
          data: filteredChartData.value.map((item) =>
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
          filteredChartData.value.length > 50
            ? [
                {
                  type: "slider",
                  show: true,
                  start: 70,
                  end: 100,
                },
              ]
            : [],
      }
);

// Helper functions for sensor values chart
const getSensorValuesSeriesNames = () => {
  // Use selected sensors from checkboxes
  return effectiveSelectedSensors.value.map((sensorValue) => {
    const sensor = availableSensorOptions.value.find(
      (s) => s.value === sensorValue
    );
    return sensor ? sensor.label : sensorValue;
  });
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
    case "Accel X":
    case "Accel Y":
    case "Accel Z":
      return " g";
    case "Gyro X":
    case "Gyro Y":
    case "Gyro Z":
      return " °/s";
    case "EDA":
      return " μS";
    case "SpO2":
    case "Sp02":
      return " %";
    case "SCL":
      return " μS";
    case "SCR":
      return " μS";
    case "GPS Latitude":
    case "GPS Longitude":
      return "°";
    case "Altitude":
      return " m";
    case "Speed":
      return " m/s";
    case "Bearing":
      return "°";
    case "Accuracy":
      return " m";
    case "Satellites":
      return "";
    case "Steps":
      return " steps";
    case "Calories":
      return " cal";
    case "Magnetic X":
    case "Magnetic Y":
    case "Magnetic Z":
      return " μT";
    case "Pressure":
      return " hPa";
    case "Light Level":
      return " lux";
    case "Motion/Acceleration":
      return " g";
    default:
      return "";
  }
};

const getSensorValuesYAxis = () => {
  if (effectiveSelectedSensors.value.length === 0) {
    return {
      type: "value",
      name: "No Sensors Selected",
    };
  }

  // Decide if we need a secondary axis: if any of Temperature/Altitude/Bearing is selected
  const hasTemperature = effectiveSelectedSensors.value.includes("Temperature");
  const hasLocationOnly = effectiveSelectedSensors.value.some((s) =>
    ["Altitude", "Bearing"].includes(s)
  );
  const needSecondaryAxis = hasTemperature || hasLocationOnly;

  if (needSecondaryAxis) {
    return [
      {
        type: "value",
        name: "Primary Sensors",
        position: "left",
        axisLabel: { formatter: "{value}" },
      },
      {
        type: "value",
        name: "Temperature / Location",
        position: "right",
        axisLabel: { formatter: "{value}" },
      },
    ];
  }

  // Single axis case
  const sensorLabels = effectiveSelectedSensors.value
    .map((sensorValue) => {
      const sensor = availableSensorOptions.value.find(
        (s) => s.value === sensorValue
      );
      return sensor ? sensor.label : sensorValue;
    })
    .join(", ");

  return {
    type: "value",
    name:
      sensorLabels.length > 50
        ? `${effectiveSelectedSensors.value.length} Sensors`
        : sensorLabels,
    nameLocation: "middle",
    nameGap: 50,
  };
};

const getSensorValuesSeries = () => {
  const chartData = filteredChartData.value;

  if (
    !chartData ||
    chartData.length === 0 ||
    effectiveSelectedSensors.value.length === 0
  ) {
    return [];
  }

  // Determine Y-axis assignment based on selected sensors
  const hasTemperature = effectiveSelectedSensors.value.includes("Temperature");
  const hasLocation = effectiveSelectedSensors.value.some((s) =>
    ["Altitude", "Bearing"].includes(s)
  );
  const useSecondaryAxis = hasTemperature || hasLocation;

  return effectiveSelectedSensors.value
    .map((sensorValue) => {
      // Skip mood in default numeric series; mood uses a separate categorical mode
      if (sensorValue === "mood") return null;
      const config = sensorConfig[sensorValue];
      if (!config) return null;

      const sensor = availableSensorOptions.value.find(
        (s) => s.value === sensorValue
      );
      const seriesName = sensor ? sensor.label : sensorValue;

      // Determine which Y-axis to use
      let yAxisIndex = 0;
      if (
        useSecondaryAxis &&
        (sensorValue === "Temperature" ||
          sensorValue === "Altitude" ||
          sensorValue === "Bearing")
      ) {
        yAxisIndex = 1;
      }

      // Build data array with optional transform for motion magnitude
      let dataArr = chartData.map((item) => getSensorValue(sensorValue, item));
      if (sensorValue === "motion") {
        dataArr = chartData.map((item) => {
          const ax = item?.accelX ?? item?.AccelX ?? 0;
          const ay = item?.accelY ?? item?.AccelY ?? 0;
          const az = item?.accelZ ?? item?.AccelZ ?? 0;
          const mag = Math.sqrt(ax * ax + ay * ay + az * az);
          return mag || null;
        });
      }

      return {
        name: seriesName,
        type: "line",
        yAxisIndex,
        smooth: true,
        data: dataArr,
        itemStyle: { color: config.color },
        lineStyle: { width: 2 },
        connectNulls: false,
      };
    })
    .filter(Boolean); // Remove null entries
};
</script>
