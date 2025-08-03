<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Event Analytics</h2>
        <p class="text-gray-600">
          Comprehensive analytics and insights from sensor data
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <!-- <select
          v-model="selectedEventType"
          @change="loadAnalytics"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option
            v-for="option in eventTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select> -->
        <select
          v-model="selectedChildId"
          @change="loadAnalytics"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Children</option>
          <option
            v-for="childId in availableChildren"
            :key="childId"
            :value="childId"
          >
            Child {{ childId }}
          </option>
        </select>
        <select
          v-model="selectedTimeRange"
          @change="loadAnalytics"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
        <button
          @click="loadAnalytics"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <i
            class="fas fa-refresh mr-2"
            :class="{ 'animate-spin': loading }"
          ></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner animate-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Loading analytics data...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Overview Statistics -->
      <OverviewStatistics :analytics="analytics" />

      <!-- Sensor Values Line Chart -->
      <SensorValuesLineChart
        :sensor-values="analytics.sensorValues"
        :selected-event-type="selectedEventType"
        :selected-time-range="selectedTimeRange"
        :event-type-options="eventTypeOptions"
      />

      <!-- Charts Row -->
      <ChartsRow
        :analytics="analytics"
        :selected-event-type="selectedEventType"
        :selected-time-range="selectedTimeRange"
        :event-type-options="eventTypeOptions"
      />

      <!-- GPS Activity Map -->
      <GpsActivityMap
        :gps-events="gpsEventsForMap"
        :selected-child-id="selectedChildId"
      />

      <!-- Event Data Line Chart -->
      <EventDataTimeline
        :event-timeline="analytics.eventTimeline"
        :selected-event-type="selectedEventType"
        :selected-time-range="selectedTimeRange"
        :event-type-options="eventTypeOptions"
      />

      <!-- Sensor Data Distribution -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Sensor Data Distribution
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <i class="fas fa-heartbeat text-red-600 text-2xl mb-2"></i>
            <p class="text-sm font-medium text-gray-900">Heart Rate</p>
            <p class="text-xs text-gray-600">
              {{ analytics.sensorDistribution.heartRate }}%
            </p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                class="bg-red-600 h-2 rounded-full"
                :style="{ width: analytics.sensorDistribution.heartRate + '%' }"
              ></div>
            </div>
          </div>

          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <i class="fas fa-thermometer-half text-blue-600 text-2xl mb-2"></i>
            <p class="text-sm font-medium text-gray-900">Temperature</p>
            <p class="text-xs text-gray-600">
              {{ analytics.sensorDistribution.temperature }}%
            </p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                class="bg-blue-600 h-2 rounded-full"
                :style="{
                  width: analytics.sensorDistribution.temperature + '%',
                }"
              ></div>
            </div>
          </div>

          <div class="text-center p-4 bg-green-50 rounded-lg">
            <i class="fas fa-map-marker-alt text-green-600 text-2xl mb-2"></i>
            <p class="text-sm font-medium text-gray-900">GPS Location</p>
            <p class="text-xs text-gray-600">
              {{ analytics.sensorDistribution.gps }}%
            </p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                class="bg-green-600 h-2 rounded-full"
                :style="{ width: analytics.sensorDistribution.gps + '%' }"
              ></div>
            </div>
          </div>

          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <i class="fas fa-volume-up text-purple-600 text-2xl mb-2"></i>
            <p class="text-sm font-medium text-gray-900">Sound Level</p>
            <p class="text-xs text-gray-600">
              {{ analytics.sensorDistribution.sound }}%
            </p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                class="bg-purple-600 h-2 rounded-full"
                :style="{ width: analytics.sensorDistribution.sound + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Active Children -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Most Active Children
          </h3>
          <span class="text-sm text-gray-500">By event count</span>
        </div>
        <div class="overflow-auto max-h-64">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Rank
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Child ID
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Events
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Avg HR
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Activity Score
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(child, index) in analytics.topActiveChildren"
                :key="child.childId"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <span
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      :class="
                        index === 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : index === 1
                          ? 'bg-gray-100 text-gray-800'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      "
                    >
                      {{ index + 1 }}
                    </span>
                    <i
                      v-if="index < 3"
                      class="fas fa-trophy ml-2"
                      :class="
                        index === 0
                          ? 'text-yellow-500'
                          : index === 1
                          ? 'text-gray-400'
                          : 'text-orange-400'
                      "
                    ></i>
                  </div>
                </td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  {{ child.childId }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  {{ child.eventCount }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  {{ child.avgHeartRate }} bpm
                </td>
                <td class="px-4 py-2">
                  <div class="flex items-center">
                    <div class="flex-1 mr-2">
                      <div class="bg-gray-200 rounded-full h-2">
                        <div
                          class="bg-blue-600 h-2 rounded-full"
                          :style="{ width: child.activityScore + '%' }"
                        ></div>
                      </div>
                    </div>
                    <span class="text-sm text-gray-600"
                      >{{ child.activityScore }}%</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Health Alerts & Insights -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Health Insights
          </h3>
          <div class="space-y-3">
            <div
              v-for="insight in analytics.healthInsights"
              :key="insight.id"
              class="flex items-start p-3 rounded-lg"
              :class="
                insight.type === 'warning'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : insight.type === 'danger'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              "
            >
              <i
                class="fas mt-1 mr-3"
                :class="
                  insight.type === 'warning'
                    ? 'fa-exclamation-triangle text-yellow-600'
                    : insight.type === 'danger'
                    ? 'fa-exclamation-circle text-red-600'
                    : 'fa-info-circle text-blue-600'
                "
              ></i>
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ insight.title }}
                </p>
                <p class="text-xs text-gray-600">{{ insight.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Recent Activity Patterns
          </h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div class="flex items-center">
                <i class="fas fa-trending-up text-green-600 mr-3"></i>
                <span class="text-sm text-gray-900">Increased Activity</span>
              </div>
              <span class="text-xs text-gray-500"
                >{{ analytics.trends.increasedActivity }}% children</span
              >
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div class="flex items-center">
                <i class="fas fa-heart text-red-600 mr-3"></i>
                <span class="text-sm text-gray-900">Stable Heart Rate</span>
              </div>
              <span class="text-xs text-gray-500"
                >{{ analytics.trends.stableHeartRate }}% children</span
              >
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div class="flex items-center">
                <i class="fas fa-thermometer-half text-blue-600 mr-3"></i>
                <span class="text-sm text-gray-900">Normal Temperature</span>
              </div>
              <span class="text-xs text-gray-500"
                >{{ analytics.trends.normalTemperature }}% children</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && analytics.totalEvents === 0"
      class="text-center py-12"
    >
      <i class="fas fa-chart-bar text-gray-400 text-6xl mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Event Data</h3>
      <p class="text-gray-500">No events found for the selected time period.</p>
      <router-link
        to="/admin/events"
        class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View Events
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import * as echarts from "echarts";
import * as eventApi from "../../services/eventApi";
import SensorValuesLineChart from "../../components/SensorValuesLineChart.vue";
import EventDataTimeline from "../../components/EventDataTimeline.vue";
import OverviewStatistics from "../../components/OverviewStatistics.vue";
import ChartsRow from "../../components/ChartsRow.vue";
import GpsActivityMap from "../../components/GpsActivityMap.vue";

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
]);

// Reactive data
const loading = ref(false);
const selectedTimeRange = ref(30);
const selectedEventType = ref("all");
const selectedChildId = ref("all");
const availableChildren = ref([]);

// Event type options
const eventTypeOptions = [
  { value: "all", label: "All Events" },
  { value: "HeartRate", label: "Heart Rate" },
  { value: "HRV", label: "Heart Rate Variability" },
  { value: "AccelX", label: "Accelerometer X" },
  { value: "AccelY", label: "Accelerometer Y" },
  { value: "AccelZ", label: "Accelerometer Z" },
  { value: "GyroX", label: "Gyroscope X" },
  { value: "GyroY", label: "Gyroscope Y" },
  { value: "GyroZ", label: "Gyroscope Z" },
  { value: "EDA", label: "Electrodermal Activity" },
  { value: "Temperature", label: "Temperature" },
  { value: "SoundLevel", label: "Sound Level" },
  { value: "latitude", label: "GPS Latitude" },
  { value: "longitude", label: "GPS Longitude" },
  { value: "altitude", label: "GPS Altitude" },
  { value: "speed_mps", label: "Speed (m/s)" },
  { value: "bearing_deg", label: "Bearing (degrees)" },
  { value: "accuracy_m", label: "GPS Accuracy" },
  { value: "satellites", label: "Satellites" },
  { value: "steps", label: "Steps" },
  { value: "calories", label: "Calories" },
  { value: "speed", label: "Speed" },
  { value: "magneticX", label: "Magnetometer X" },
  { value: "magneticY", label: "Magnetometer Y" },
  { value: "magneticZ", label: "Magnetometer Z" },
  { value: "pressure", label: "Pressure" },
  { value: "light", label: "Light Level" },
  { value: "gps", label: "GPS Location" },
  { value: "motion", label: "Motion/Acceleration" },
];
const analytics = ref({
  totalEvents: 0,
  activeChildren: 0,
  avgDailyEvents: 0,
  peakHour: 0,
  heartRate: {
    average: 0,
    max: 0,
    min: 0,
    count: 0,
  },
  temperature: {
    average: 0,
    max: 0,
    min: 0,
    count: 0,
  },
  activity: {
    gpsCount: 0,
    soundCount: 0,
    motionCount: 0,
    avgSoundLevel: 0,
  },
  dailyTrend: [],
  hourlyDistribution: [],
  eventTimeline: [],
  sensorValues: [],
  sensorDistribution: {
    heartRate: 0,
    temperature: 0,
    gps: 0,
    sound: 0,
    motion: 0,
    eda: 0,
    hrv: 0,
    gyro: 0,
    magnetic: 0,
    pressure: 0,
    light: 0,
    steps: 0,
    calories: 0,
    altitude: 0,
    speed: 0,
    bearing: 0,
    accuracy: 0,
    satellites: 0,
  },
  topActiveChildren: [],
  healthInsights: [],
  trends: {
    increasedActivity: 0,
    stableHeartRate: 0,
    normalTemperature: 0,
  },
});

// Computed properties
const gpsEventsForMap = computed(() => {
  // Get all events that have GPS data from the loadAnalytics function
  // We'll store this in a new reactive variable
  return allEventsWithGps.value;
});

// Add reactive variable to store all events for map
const allEventsWithGps = ref([]);

// Methods
const loadAnalytics = async () => {
  try {
    loading.value = true;
    console.log("🔄 Loading analytics data...");

    // Load events data
    const response = await eventApi.getAll();
    const allEvents = response.data || [];

    // Get unique children for selector
    const uniqueChildren = [...new Set(allEvents.map((e) => e.aid))].filter(
      Boolean
    );
    availableChildren.value = uniqueChildren.sort();

    // Filter events by selected time range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - selectedTimeRange.value);
    let filteredEvents = allEvents.filter(
      (event) => new Date(event.Timestamp) >= cutoffDate
    );

    // Filter by event type
    if (selectedEventType.value !== "all") {
      filteredEvents = filteredEvents.filter((event) => {
        switch (selectedEventType.value) {
          case "HeartRate":
            return event.HeartRate !== null && event.HeartRate !== undefined;
          case "HRV":
            return event.HRV !== null && event.HRV !== undefined;
          case "AccelX":
            return event.AccelX !== null && event.AccelX !== undefined;
          case "AccelY":
            return event.AccelY !== null && event.AccelY !== undefined;
          case "AccelZ":
            return event.AccelZ !== null && event.AccelZ !== undefined;
          case "GyroX":
            return event.GyroX !== null && event.GyroX !== undefined;
          case "GyroY":
            return event.GyroY !== null && event.GyroY !== undefined;
          case "GyroZ":
            return event.GyroZ !== null && event.GyroZ !== undefined;
          case "EDA":
            return event.EDA !== null && event.EDA !== undefined;
          case "TemperatureC":
            return (
              event.TemperatureC !== null && event.TemperatureC !== undefined
            );
          case "SoundLevel":
            return event.SoundLevel !== null && event.SoundLevel !== undefined;
          case "latitude":
            return event.latitude !== null && event.latitude !== undefined;
          case "longitude":
            return event.longitude !== null && event.longitude !== undefined;
          case "altitude":
            return event.altitude !== null && event.altitude !== undefined;
          case "speed_mps":
            return event.speed_mps !== null && event.speed_mps !== undefined;
          case "bearing_deg":
            return (
              event.bearing_deg !== null && event.bearing_deg !== undefined
            );
          case "accuracy_m":
            return event.accuracy_m !== null && event.accuracy_m !== undefined;
          case "satellites":
            return event.satellites !== null && event.satellites !== undefined;
          case "steps":
            return event.steps !== null && event.steps !== undefined;
          case "calories":
            return event.calories !== null && event.calories !== undefined;
          case "speed":
            return event.speed !== null && event.speed !== undefined;
          case "magneticX":
            return event.magneticX !== null && event.magneticX !== undefined;
          case "magneticY":
            return event.magneticY !== null && event.magneticY !== undefined;
          case "magneticZ":
            return event.magneticZ !== null && event.magneticZ !== undefined;
          case "pressure":
            return event.pressure !== null && event.pressure !== undefined;
          case "light":
            return event.light !== null && event.light !== undefined;
          case "gps":
            return event.latitude && event.longitude;
          case "motion":
            return event.AccelX || event.AccelY || event.AccelZ;
          default:
            return true;
        }
      });
    }

    // Filter by child ID
    if (selectedChildId.value !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.aid === selectedChildId.value
      );
    }

    // Store GPS events for the map (include all GPS events regardless of other filters)
    const gpsEvents = allEvents.filter(
      (event) =>
        event.latitude &&
        event.longitude &&
        !isNaN(event.latitude) &&
        !isNaN(event.longitude)
    );

    console.log(
      `📍 Found ${gpsEvents.length} GPS events out of ${allEvents.length} total events`
    );

    // Apply time range filter to GPS events
    const cutoffDateForGps = new Date();
    cutoffDateForGps.setDate(
      cutoffDateForGps.getDate() - selectedTimeRange.value
    );
    allEventsWithGps.value = gpsEvents.filter(
      (event) => new Date(event.Timestamp) >= cutoffDateForGps
    );

    // Apply child filter to GPS events if selected
    if (selectedChildId.value !== "all") {
      allEventsWithGps.value = allEventsWithGps.value.filter(
        (event) => event.aid === selectedChildId.value
      );
    }

    console.log(
      `📍 GPS events for map: ${allEventsWithGps.value.length} after filters`
    );

    // Calculate analytics
    analytics.value = calculateAnalytics(filteredEvents);

    console.log("✅ Analytics data loaded successfully");
  } catch (error) {
    console.error("❌ Error loading analytics:", error);
    // Initialize with default values on error
    analytics.value = getDefaultAnalytics();
  } finally {
    loading.value = false;
  }
};

const calculateAnalytics = (events) => {
  const totalEvents = events.length;
  const uniqueChildren = [...new Set(events.map((e) => e.aid))].filter(Boolean);

  // Calculate heart rate stats
  const heartRateEvents = events.filter((e) => e.HeartRate);
  const heartRates = heartRateEvents.map((e) => e.HeartRate);

  // Calculate temperature stats
  const temperatureEvents = events.filter((e) => e.Temperature);
  const temperatures = temperatureEvents.map((e) => e.Temperature);

  // Calculate daily trend
  const dailyTrend = calculateDailyTrend(events, selectedTimeRange.value);

  // Calculate hourly distribution
  const hourlyData = events.reduce((acc, event) => {
    const hour = new Date(event.Timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  const peakHour = Object.keys(hourlyData).reduce(
    (a, b) => (hourlyData[a] > hourlyData[b] ? a : b),
    0
  );

  // Create 24-hour array for visualization
  const hourlyDistribution = Array.from(
    { length: 24 },
    (_, hour) => hourlyData[hour] || 0
  );

  // Calculate sensor distribution
  const gpsEvents = events.filter((e) => e.latitude && e.longitude).length;
  const soundEvents = events.filter((e) => e.SoundLevel).length;
  const motionEvents = events.filter(
    (e) => e.AccelX || e.AccelY || e.AccelZ
  ).length;
  const edaEvents = events.filter((e) => e.EDA).length;
  const hRVEvents = events.filter((e) => e.HRV).length;
  const gyroEvents = events.filter((e) => e.GyroX || e.GyroY || e.GyroZ).length;
  const magneticEvents = events.filter(
    (e) => e.magneticX || e.magneticY || e.magneticZ
  ).length;
  const pressureEvents = events.filter((e) => e.pressure).length;
  const lightEvents = events.filter((e) => e.light).length;
  const stepsEvents = events.filter((e) => e.steps).length;
  const caloriesEvents = events.filter((e) => e.calories).length;
  const altitudeEvents = events.filter((e) => e.altitude).length;
  const speedEvents = events.filter((e) => e.speed_mps || e.speed).length;
  const bearingEvents = events.filter((e) => e.bearing_deg).length;
  const accuracyEvents = events.filter((e) => e.accuracy_m).length;
  const satellitesEvents = events.filter((e) => e.satellites).length;

  // Calculate top active children
  const childrenActivity = uniqueChildren
    .map((childId) => {
      const childEvents = events.filter((e) => e.aid === childId);
      const childHeartRates = childEvents
        .filter((e) => e.HeartRate)
        .map((e) => e.HeartRate);
      const avgHeartRate =
        childHeartRates.length > 0
          ? Math.round(
              childHeartRates.reduce((a, b) => a + b, 0) /
                childHeartRates.length
            )
          : 0;

      return {
        childId,
        eventCount: childEvents.length,
        avgHeartRate,
        activityScore: Math.min(
          100,
          Math.round((childEvents.length / totalEvents) * 100 * 10)
        ),
      };
    })
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 10);

  // Calculate event timeline
  const eventTimeline = calculateEventTimeline(events, selectedTimeRange.value);

  // Calculate sensor values over time
  const sensorValues = calculateSensorValues(events, selectedTimeRange.value);

  // Generate health insights
  const healthInsights = generateHealthInsights(
    events,
    heartRates,
    temperatures
  );

  return {
    totalEvents,
    activeChildren: uniqueChildren.length,
    avgDailyEvents: Math.round(totalEvents / selectedTimeRange.value),
    peakHour: parseInt(peakHour),
    heartRate: {
      average:
        heartRates.length > 0
          ? Math.round(
              heartRates.reduce((a, b) => a + b, 0) / heartRates.length
            )
          : 0,
      max: heartRates.length > 0 ? Math.max(...heartRates) : 0,
      min: heartRates.length > 0 ? Math.min(...heartRates) : 0,
      count: heartRates.length,
    },
    temperature: {
      average:
        temperatures.length > 0
          ? Math.round(
              (temperatures.reduce((a, b) => a + b, 0) / temperatures.length) *
                10
            ) / 10
          : 0,
      max: temperatures.length > 0 ? Math.max(...temperatures) : 0,
      min: temperatures.length > 0 ? Math.min(...temperatures) : 0,
      count: temperatures.length,
    },
    activity: {
      gpsCount: gpsEvents,
      soundCount: soundEvents,
      motionCount: motionEvents,
      avgSoundLevel:
        soundEvents > 0
          ? Math.round(
              events
                .filter((e) => e.SoundLevel)
                .reduce((acc, e) => acc + e.SoundLevel, 0) / soundEvents
            )
          : 0,
    },
    dailyTrend,
    hourlyDistribution,
    eventTimeline,
    sensorValues,
    sensorDistribution: {
      heartRate:
        totalEvents > 0
          ? Math.round((heartRateEvents.length / totalEvents) * 100)
          : 0,
      temperature:
        totalEvents > 0
          ? Math.round((temperatureEvents.length / totalEvents) * 100)
          : 0,
      gps: totalEvents > 0 ? Math.round((gpsEvents / totalEvents) * 100) : 0,
      sound:
        totalEvents > 0 ? Math.round((soundEvents / totalEvents) * 100) : 0,
      motion:
        totalEvents > 0 ? Math.round((motionEvents / totalEvents) * 100) : 0,
      eda: totalEvents > 0 ? Math.round((edaEvents / totalEvents) * 100) : 0,
      hrv: totalEvents > 0 ? Math.round((hRVEvents / totalEvents) * 100) : 0,
      gyro: totalEvents > 0 ? Math.round((gyroEvents / totalEvents) * 100) : 0,
      magnetic:
        totalEvents > 0 ? Math.round((magneticEvents / totalEvents) * 100) : 0,
      pressure:
        totalEvents > 0 ? Math.round((pressureEvents / totalEvents) * 100) : 0,
      light:
        totalEvents > 0 ? Math.round((lightEvents / totalEvents) * 100) : 0,
      steps:
        totalEvents > 0 ? Math.round((stepsEvents / totalEvents) * 100) : 0,
      calories:
        totalEvents > 0 ? Math.round((caloriesEvents / totalEvents) * 100) : 0,
      altitude:
        totalEvents > 0 ? Math.round((altitudeEvents / totalEvents) * 100) : 0,
      speed:
        totalEvents > 0 ? Math.round((speedEvents / totalEvents) * 100) : 0,
      bearing:
        totalEvents > 0 ? Math.round((bearingEvents / totalEvents) * 100) : 0,
      accuracy:
        totalEvents > 0 ? Math.round((accuracyEvents / totalEvents) * 100) : 0,
      satellites:
        totalEvents > 0
          ? Math.round((satellitesEvents / totalEvents) * 100)
          : 0,
    },
    topActiveChildren: childrenActivity,
    healthInsights,
    trends: {
      increasedActivity: Math.round(Math.random() * 30 + 60), // Placeholder
      stableHeartRate: Math.round(Math.random() * 20 + 75), // Placeholder
      normalTemperature: Math.round(Math.random() * 15 + 80), // Placeholder
    },
  };
};

const calculateDailyTrend = (events, days) => {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.Timestamp);
      return eventDate.toDateString() === date.toDateString();
    });
    trend.push(dayEvents.length);
  }
  return trend;
};

const calculateEventTimeline = (events, days) => {
  const timeline = [];
  const dataPoints = Math.min(days <= 7 ? days * 4 : days, 100); // 4 points per day for <= 7 days, otherwise daily
  const intervalHours = days <= 7 ? 6 : 24; // 6-hour intervals for short periods, daily for longer

  for (let i = dataPoints - 1; i >= 0; i--) {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() - i * intervalHours);

    const startTime = new Date(endTime);
    startTime.setHours(startTime.getHours() - intervalHours);

    const periodEvents = events.filter((event) => {
      const eventTime = new Date(event.Timestamp);
      return eventTime >= startTime && eventTime < endTime;
    });

    // Calculate aggregated data for this time period
    const heartRateEvents = periodEvents.filter((e) => e.HeartRate);
    const temperatureEvents = periodEvents.filter((e) => e.Temperature);
    const soundEvents = periodEvents.filter((e) => e.SoundLevel);
    const gpsEvents = periodEvents.filter((e) => e.latitude && e.longitude);
    const motionEvents = periodEvents.filter(
      (e) => e.AccelX || e.AccelY || e.AccelZ
    );

    timeline.push({
      timestamp: endTime.toISOString(),
      eventCount: periodEvents.length,
      heartRate:
        heartRateEvents.length > 0
          ? Math.round(
              heartRateEvents.reduce((sum, e) => sum + e.HeartRate, 0) /
                heartRateEvents.length
            )
          : 0,
      temperature:
        temperatureEvents.length > 0
          ? Math.round(
              (temperatureEvents.reduce((sum, e) => sum + e.Temperature, 0) /
                temperatureEvents.length) *
                10
            ) / 10
          : 0,
      soundLevel:
        soundEvents.length > 0
          ? Math.round(
              soundEvents.reduce((sum, e) => sum + e.SoundLevel, 0) /
                soundEvents.length
            )
          : 0,
      gpsCount: gpsEvents.length,
      motionCount: motionEvents.length,
    });
  }

  return timeline;
};

const calculateSensorValues = (events, days) => {
  const values = [];

  // Sort all events by timestamp
  const sortedEvents = events
    .filter((event) => event.Timestamp)
    .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

  // Include ALL events in the sensor values list
  sortedEvents.forEach((event) => {
    const timestamp = new Date(event.Timestamp);

    values.push({
      timestamp: timestamp.toISOString(),
      heartRate: event.HeartRate || null,
      hrv: event.HRV || null,
      accelX: event.AccelX || null,
      accelY: event.AccelY || null,
      accelZ: event.AccelZ || null,
      gyroX: event.GyroX || null,
      gyroY: event.GyroY || null,
      gyroZ: event.GyroZ || null,
      eda: event.EDA || null,
      temperatureC: event.TemperatureC || null,
      soundLevel: event.SoundLevel || null,
      latitude: event.latitude || null,
      longitude: event.longitude || null,
      altitude: event.altitude || null,
      speed_mps: event.speed_mps || null,
      bearing_deg: event.bearing_deg || null,
      accuracy_m: event.accuracy_m || null,
      satellites: event.satellites || null,
      steps: event.steps || null,
      calories: event.calories || null,
      speed: event.speed || null,
      magneticX: event.magneticX || null,
      magneticY: event.magneticY || null,
      magneticZ: event.magneticZ || null,
      pressure: event.pressure || null,
      light: event.light || null,
      // Legacy fields for backwards compatibility
      gpsLat: event.latitude || null,
      gpsLng: event.longitude || null,
      temperature: event.TemperatureC || event.Temperature || null,
      // Additional event data
      eventId: event._id || event.id,
      childId: event.aid,
      batteryLevel: event.BatteryLevel || null,
      signalStrength: event.SignalStrength || null,
      deviceId: event.DeviceId || null,
    });
  });

  // If there are too many events for chart performance,
  // we can still provide sampling for the chart while keeping all data available
  const maxChartPoints = 1000;
  if (values.length > maxChartPoints) {
    console.log(
      `📊 Sensor values: ${values.length} total events, sampling ${maxChartPoints} for chart performance`
    );

    // Create a sampled version for chart rendering
    const interval = Math.floor(values.length / maxChartPoints);
    const sampledForChart = [];

    for (let i = 0; i < values.length; i += interval) {
      sampledForChart.push(values[i]);
    }

    // Store both full data and sampled data
    values.chartData = sampledForChart;
    values.fullData = values.slice(); // Copy of all events
  } else {
    // Use all data for chart if under the limit
    values.chartData = values;
    values.fullData = values.slice();
  }

  return values;
};

const generateHealthInsights = (events, heartRates, temperatures) => {
  const insights = [];

  if (heartRates.length > 0) {
    const avgHR = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;
    if (avgHR > 100) {
      insights.push({
        id: 1,
        type: "warning",
        title: "Elevated Heart Rate Detected",
        description: `Average heart rate of ${Math.round(
          avgHR
        )} BPM is above normal range.`,
      });
    } else if (avgHR < 60) {
      insights.push({
        id: 2,
        type: "info",
        title: "Low Heart Rate Observed",
        description: `Average heart rate of ${Math.round(
          avgHR
        )} BPM may indicate rest periods.`,
      });
    }
  }

  if (temperatures.length > 0) {
    const avgTemp =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    if (avgTemp > 38) {
      insights.push({
        id: 3,
        type: "danger",
        title: "High Temperature Alert",
        description: `Average temperature of ${avgTemp.toFixed(
          1
        )}°C may indicate fever.`,
      });
    }
  }

  const recentEvents = events.filter((e) => {
    const eventDate = new Date(e.Timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return eventDate >= yesterday;
  });

  if (recentEvents.length === 0) {
    insights.push({
      id: 4,
      type: "warning",
      title: "No Recent Activity",
      description: "No sensor data received in the last 24 hours.",
    });
  }

  return insights;
};

const getDefaultAnalytics = () => ({
  totalEvents: 0,
  activeChildren: 0,
  avgDailyEvents: 0,
  peakHour: 0,
  heartRate: { average: 0, max: 0, min: 0, count: 0 },
  temperature: { average: 0, max: 0, min: 0, count: 0 },
  activity: { gpsCount: 0, soundCount: 0, motionCount: 0, avgSoundLevel: 0 },
  dailyTrend: [],
  hourlyDistribution: [],
  eventTimeline: [],
  sensorValues: [],
  sensorDistribution: {
    heartRate: 0,
    temperature: 0,
    gps: 0,
    sound: 0,
    motion: 0,
    eda: 0,
    hrv: 0,
    gyro: 0,
    magnetic: 0,
    pressure: 0,
    light: 0,
    steps: 0,
    calories: 0,
    altitude: 0,
    speed: 0,
    bearing: 0,
    accuracy: 0,
    satellites: 0,
  },
  topActiveChildren: [],
  healthInsights: [],
  trends: { increasedActivity: 0, stableHeartRate: 0, normalTemperature: 0 },
});

// Lifecycle
onMounted(() => {
  loadAnalytics();
});
</script>
