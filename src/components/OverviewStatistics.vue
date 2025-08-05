<template>
  <!-- Overview Statistics -->
  <div class="space-y-6">
    <!-- Overview Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatisticsCard
        :value="analytics.totalEvents"
        label="Total Events"
        icon="fas fa-chart-line"
        variant="blue"
        subtitle="in selected period"
        subtitle-class="text-xs text-gray-500"
      />

      <StatisticsCard
        :value="analytics.activeChildren"
        label="Active Children"
        icon="fas fa-users"
        variant="green"
        subtitle="with recorded data"
        subtitle-class="text-xs text-gray-500"
      />

      <StatisticsCard
        :value="analytics.avgDailyEvents"
        label="Avg Daily Events"
        icon="fas fa-calendar"
        variant="yellow"
        subtitle="per day"
        subtitle-class="text-xs text-gray-500"
      />

      <StatisticsCard
        :value="`${analytics.peakHour}:00`"
        label="Peak Hour"
        icon="fas fa-clock"
        variant="purple"
        subtitle="most active time"
        subtitle-class="text-xs text-gray-500"
      />
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
