import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as eventApi from "../services/eventApi";

export const useDbStatsStore = defineStore("dbStats", () => {
  // State
  const stats = ref({
    totalCollections: 0,
    totalDocuments: 0,
    totalSize: 0,
    collections: [],
    lastUpdated: null,
  });

  const loading = ref(false);
  const error = ref(null);

  // Actions
  const fetchDbStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await eventApi.getDBStats();
      stats.value = {
        ...response.data,
        lastUpdated: new Date().toISOString(),
      };
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch database statistics";
      console.error("Error fetching database stats:", err);
    } finally {
      loading.value = false;
    }
  };

  const refreshStats = async () => {
    await fetchDbStats();
  };

  const clearError = () => {
    error.value = null;
  };

  const resetStats = () => {
    stats.value = {
      totalCollections: 0,
      totalDocuments: 0,
      totalSize: 0,
      collections: [],
      lastUpdated: null,
    };
    error.value = null;
    loading.value = false;
  };

  // Getters
  const formattedSize = computed(() => {
    if (!stats.value.totalSize) return "0 B";

    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(stats.value.totalSize) / Math.log(1024));
    return (
      Math.round((stats.value.totalSize / Math.pow(1024, i)) * 100) / 100 +
      " " +
      sizes[i]
    );
  });

  const lastUpdatedFormatted = computed(() => {
    if (!stats.value.lastUpdated) return "Never";
    return new Date(stats.value.lastUpdated).toLocaleString();
  });

  const isStale = computed(() => {
    if (!stats.value.lastUpdated) return true;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return new Date(stats.value.lastUpdated).getTime() < fiveMinutesAgo;
  });

  return {
    // State
    stats,
    loading,
    error,

    // Actions
    fetchDbStats,
    refreshStats,
    clearError,
    resetStats,

    // Getters
    formattedSize,
    lastUpdatedFormatted,
    isStale,
  };
});
