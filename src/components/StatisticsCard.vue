<template>
  <n-card>
    <div class="flex items-center">
      <div :class="iconWrapperClass">
        <i :class="iconClass"></i>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-500">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        <p v-if="subtitle" :class="subtitleClass">{{ subtitle }}</p>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { computed } from "vue";
import { NCard } from "naive-ui";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: "blue",
    validator: (value) =>
      ["blue", "green", "yellow", "red", "purple", "gray"].includes(value),
  },
  subtitle: {
    type: String,
    default: null,
  },
  subtitleClass: {
    type: String,
    default: "text-sm text-green-600",
  },
});

const iconWrapperClass = computed(() => {
  const baseClass = "p-3 rounded-full";
  const variants = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    red: "bg-red-100",
    purple: "bg-purple-100",
    gray: "bg-gray-100",
  };
  return `${baseClass} ${variants[props.variant]}`;
});

const iconClass = computed(() => {
  const variants = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    purple: "text-purple-600",
    gray: "text-gray-600",
  };
  return `${props.icon} ${variants[props.variant]}`;
});
</script>
