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
    <div v-if="sensorValues && sensorValues.length > 0" class="h-106">
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

// Emits
const emit = defineEmits(["sensorSelectionChanged"]);

// Available sensor options for multi-checkbox selection
const availableSensorOptions = ref([
  { value: "HeartRate", label: "Heart Rate" },
  { value: "HRV", label: "HRV" },
  { value: "Temperature", label: "Temperature" },
  { value: "SoundLevel", label: "Sound Level" },
  { value: "EDA", label: "EDA" },
  { value: "Altitude", label: "Altitude" },
  { value: "Speed_spm", label: "Speed" },
  { value: "Bearing", label: "Bearing" },
  { value: "Accuracy", label: "Accuracy" },
  { value: "Steps", label: "Steps" },
  { value: "Calories", label: "Calories" },
  { value: "Pressure", label: "Pressure" },
  { value: "Light", label: "Light Level" },
  { value: "altitude", label: "GPS Altitude" },
]);

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

// Computed properties for ECharts options
const sensorValuesChartOption = computed(() => ({
  title: {
    text: `Sensor Values Over Time (${
      selectedSensors.value.length === 0
        ? "No Sensors Selected"
        : selectedSensors.value.length === availableSensorOptions.value.length
        ? "All Sensors"
        : selectedSensors.value.length > 3
        ? `${selectedSensors.value.length} Sensors`
        : selectedSensors.value
            .map((sensorValue) => {
              const sensor = availableSensorOptions.value.find(
                (s) => s.value === sensorValue
              );
              return sensor ? sensor.label : sensorValue;
            })
            .join(", ")
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
  // Use selected sensors from checkboxes
  return selectedSensors.value.map((sensorValue) => {
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
    default:
      return "";
  }
};

const getSensorValuesYAxis = () => {
  if (selectedSensors.value.length === 0) {
    return {
      type: "value",
      name: "No Sensors Selected",
    };
  }

  // Group sensors by similar units for better Y-axis organization
  const hasTemperature = selectedSensors.value.includes("Temperature");
  const hasLocation = selectedSensors.value.some((s) =>
    ["Altitude", "Bearing"].includes(s)
  );
  const hasOtherSensors = selectedSensors.value.some(
    (s) => !["Temperature", "Altitude", "Bearing"].includes(s)
  );

  if (hasTemperature && (hasLocation || hasOtherSensors)) {
    return [
      {
        type: "value",
        name: "Primary Sensors",
        position: "left",
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "Temperature / Location",
        position: "right",
        axisLabel: {
          formatter: "{value}",
        },
      },
    ];
  } else {
    const sensorLabels = selectedSensors.value
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
          ? `${selectedSensors.value.length} Sensors`
          : sensorLabels,
      nameLocation: "middle",
      nameGap: 50,
    };
  }
};

const getSensorValuesSeries = () => {
  const chartData = props.sensorValues.chartData || props.sensorValues;

  if (
    !chartData ||
    chartData.length === 0 ||
    selectedSensors.value.length === 0
  ) {
    return [];
  }

  // Define sensor mapping and colors
  const sensorConfig = {
    HeartRate: {
      field: "heartRate",
      color: "#ef4444",
      yAxisIndex: 0,
    },
    HRV: {
      field: "hrv",
      color: "#f59e0b",
      yAxisIndex: 0,
    },
    Temperature: {
      field: ["temperatureC", "temperature"],
      color: "#3b82f6",
      yAxisIndex: 1,
    },
    SoundLevel: {
      field: "soundLevel",
      color: "#8b5cf6",
      yAxisIndex: 0,
    },
    EDA: {
      field: "eda",
      color: "#7c3aed",
      yAxisIndex: 0,
    },
    Altitude: {
      field: "altitude",
      color: "#0f766e",
      yAxisIndex: 1,
    },
    Speed: {
      field: ["speed_mps", "speed"],
      color: "#be123c",
      yAxisIndex: 0,
    },
    Bearing: {
      field: "bearing_deg",
      color: "#a21caf",
      yAxisIndex: 1,
    },
    Accuracy: {
      field: "accuracy_m",
      color: "#9333ea",
      yAxisIndex: 0,
    },
    Steps: {
      field: "steps",
      color: "#365314",
      yAxisIndex: 0,
    },
    Calories: {
      field: "calories",
      color: "#92400e",
      yAxisIndex: 0,
    },
    Pressure: {
      field: "pressure",
      color: "#581c87",
      yAxisIndex: 0,
    },
    Light: {
      field: "light",
      color: "#fbbf24",
      yAxisIndex: 0,
    },
  };

  // Determine Y-axis assignment based on selected sensors
  const hasTemperature = selectedSensors.value.includes("Temperature");
  const hasLocation = selectedSensors.value.some((s) =>
    ["Altitude", "Bearing"].includes(s)
  );
  const useSecondaryAxis = hasTemperature || hasLocation;

  return selectedSensors.value
    .map((sensorValue) => {
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

      return {
        name: seriesName,
        type: "line",
        yAxisIndex: yAxisIndex,
        smooth: true,
        data: chartData.map((item) => {
          if (Array.isArray(config.field)) {
            // Try multiple field names
            for (const field of config.field) {
              if (item[field] !== undefined && item[field] !== null) {
                return item[field];
              }
            }
            return null;
          } else {
            return item[config.field] || null;
          }
        }),
        itemStyle: { color: config.color },
        lineStyle: { width: 2 },
        connectNulls: false,
      };
    })
    .filter(Boolean); // Remove null entries
};
</script>
