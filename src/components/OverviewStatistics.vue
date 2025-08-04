<template>
  <!-- Overview Statistics -->
  <div class="space-y-6">
    <!-- Overview Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatisticsCard
        :value="analytics.totalEvents"
        label="Total Events"
        icon="fa-chart-line"
        variant="blue"
        subtitle="in selected period"
        subtitle-class="text-xs text-gray-500"
      />

      <StatisticsCard
        :value="analytics.activeChildren"
        label="Active Children"
        icon="fa-users"
        variant="green"
        subtitle="with recorded data"
        subtitle-class="text-xs text-gray-500"
      />

      <StatisticsCard
        :value="analytics.avgDailyEvents"
        label="Avg Daily Events"
        icon="fa-calendar-day"
        variant="yellow"
        subtitle="per day"
        subtitle-class="text-xs text-gray-500"
      />

      <StatisticsCard
        :value="`${analytics.peakHour}:00`"
        label="Peak Hour"
        icon="fa-clock"
        variant="purple"
        subtitle="most active time"
        subtitle-class="text-xs text-gray-500"
      />
    </div>

    <!-- Health Metrics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
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
      </Card>

      <Card>
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
      </Card>

      <Card>
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
      </Card>
    </div>
  </div>
</template>

<script setup>
import StatisticsCard from "./StatisticsCard.vue";
import Card from "./Card.vue";

// Props
const props = defineProps({
  analytics: {
    type: Object,
    required: true,
  },
});
</script>
