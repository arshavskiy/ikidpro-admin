<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">Database Statistics</h3>
      <div class="flex space-x-2">
        <button
          @click="refreshStats"
          :disabled="loading"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <i
            class="fas fa-refresh mr-1"
            :class="{ 'animate-spin': loading }"
          ></i>
          Refresh
        </button>
        <span
          v-if="isStale"
          class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"
        >
          Data may be stale
        </span>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded mb-4">
      <p class="text-sm text-red-600">{{ error }}</p>
      <button
        @click="clearError"
        class="text-xs text-red-800 hover:underline mt-1"
      >
        Clear error
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !stats.totalCollections" class="text-center py-8">
      <i class="fas fa-spinner animate-spin text-2xl text-blue-600 mb-2"></i>
      <p class="text-gray-600">Loading database statistics...</p>
    </div>

    <!-- Stats Display -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center p-4 bg-blue-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">
          {{ stats.totalCollections }}
        </div>
        <div class="text-sm text-gray-600">Collections</div>
      </div>

      <div class="text-center p-4 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">
          {{ stats.totalDocuments?.toLocaleString() || 0 }}
        </div>
        <div class="text-sm text-gray-600">Documents</div>
      </div>

      <div class="text-center p-4 bg-purple-50 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">
          {{ formattedSize }}
        </div>
        <div class="text-sm text-gray-600">Total Size</div>
      </div>
    </div>

    <!-- Collections List -->
    <div v-if="stats.collections && stats.collections.length > 0" class="mt-6">
      <h4 class="text-md font-medium text-gray-900 mb-3">Collections</h4>
      <div class="space-y-2">
        <div
          v-for="collection in stats.collections"
          :key="collection.name"
          class="flex justify-between items-center p-3 bg-gray-50 rounded"
        >
          <div>
            <div class="font-medium text-gray-900">{{ collection.name }}</div>
            <div class="text-sm text-gray-500">
              {{ collection.documentCount?.toLocaleString() || 0 }} documents
            </div>
          </div>
          <div class="text-sm text-gray-600">
            {{ formatSize(collection.collectionSize) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Last Updated -->
    <div class="mt-4 text-xs text-gray-500 text-center">
      Last updated: {{ lastUpdatedFormatted }}
    </div>
  </div>
</template>

<script setup>
import { useDbStatsStore } from "../stores/dbStatsStore";

// Use the store
const dbStatsStore = useDbStatsStore();
const {
  stats,
  loading,
  error,
  refreshStats,
  clearError,
  formattedSize,
  lastUpdatedFormatted,
  isStale,
} = dbStatsStore;

// Helper function for formatting sizes
const formatSize = (bytes) => {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};
</script>
