<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border">
    <div v-if="title" class="mb-4">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
});
</script>
