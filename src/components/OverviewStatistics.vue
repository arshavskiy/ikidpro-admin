<template>
  <!-- Overview Statistics -->
  <div class="space-y-6">
    <!-- Overview Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-chart-line text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Events</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ analytics.totalEvents }}
            </p>
            <p class="text-xs text-gray-500">in selected period</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-users text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Children</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ analytics.activeChildren }}
            </p>
            <p class="text-xs text-gray-500">with recorded data</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <i class="fas fa-calendar-day text-yellow-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Avg Daily Events</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ analytics.avgDailyEvents }}
            </p>
            <p class="text-xs text-gray-500">per day</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-clock text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Peak Hour</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ analytics.peakHour }}:00
            </p>
            <p class="text-xs text-gray-500">most active time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Metrics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Heart Rate Stats</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Average HR:</span>
            <span class="text-sm font-medium"
              >{{ analytics.heartRate.average }} bpm</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Max HR:</span>
            <span class="text-sm font-medium text-red-600"
              >{{ analytics.heartRate.max }} bpm</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Min HR:</span>
            <span class="text-sm font-medium text-blue-600"
              >{{ analytics.heartRate.min }} bpm</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Total Readings:</span>
            <span class="text-sm font-medium">{{
              analytics.heartRate.count
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Temperature Stats
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Average Temp:</span>
            <span class="text-sm font-medium"
              >{{ analytics.temperature.average }}°C</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Max Temp:</span>
            <span class="text-sm font-medium text-red-600"
              >{{ analytics.temperature.max }}°C</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Min Temp:</span>
            <span class="text-sm font-medium text-blue-600"
              >{{ analytics.temperature.min }}°C</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Total Readings:</span>
            <span class="text-sm font-medium">{{
              analytics.temperature.count
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Activity Overview
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">GPS Locations:</span>
            <span class="text-sm font-medium">{{
              analytics.activity.gpsCount
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Sound Events:</span>
            <span class="text-sm font-medium">{{
              analytics.activity.soundCount
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Motion Events:</span>
            <span class="text-sm font-medium">{{
              analytics.activity.motionCount
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Avg Sound Level:</span>
            <span class="text-sm font-medium"
              >{{ analytics.activity.avgSoundLevel }} dB</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  analytics: {
    type: Object,
    required: true,
  },
});
</script>
