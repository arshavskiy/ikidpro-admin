<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Data Export</h2>
        <p class="text-gray-600">
          Export your data to CSV files for backup or analysis
        </p>
      </div>
      <div class="flex space-x-2">
        <router-link
          to="/admin/data/management"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Data Management
        </router-link>
        <button
          @click="exportAllData"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-file-export mr-2"></i>Export All Data
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatisticsCard
        label="Total Users"
        :value="stats.users"
        icon="fas fa-users"
        variant="blue"
      />

      <StatisticsCard
        label="Total Children"
        :value="stats.children"
        icon="fas fa-child"
        variant="green"
      />

      <StatisticsCard
        label="Total Events"
        :value="stats.events"
        icon="fas fa-chart-line"
        variant="purple"
      />
    </div>

    <!-- CSV Export Section -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <i class="fas fa-download mr-2 text-green-600"></i>CSV Export
      </h3>

      <CsvExporter
        @export-success="handleExportSuccess"
        @export-error="handleExportError"
      />
    </div>

    <!-- Recent Export History -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <i class="fas fa-history mr-2 text-gray-600"></i>Recent Export History
      </h3>

      <div v-if="exportHistory.length === 0" class="text-center py-8">
        <i class="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-500">No export history available</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date & Time
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                File Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Records
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                File Size
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in exportHistory"
              :key="item.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(item.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.fileName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="getTypeColor(item.type)"
                >
                  {{ item.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.recordCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.fileSize }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusColor(item.status)"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="p-3 bg-green-50border-green-200 rounded">
      <p class="text-sm text-green-600">{{ successMessage }}</p>
    </div>

    <div v-if="errorMessage" class="p-3 bg-red-50border-red-200 rounded">
      <p class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CsvExporter from "../../components/data/CsvExporter.vue";
import StatisticsCard from "../../components/StatisticsCard.vue";
import * as userApi from "../../services/userApi";
import * as childUserApi from "../../services/childUserApi";
import * as eventApi from "../../services/eventApi";

// Reactive data
const stats = ref({
  users: 0,
  children: 0,
  events: 0,
});

const exportHistory = ref([]);
const successMessage = ref("");
const errorMessage = ref("");

// Methods
const loadStats = async () => {
  try {
    const [usersRes, childrenRes, eventsRes] = await Promise.all([
      userApi.getCount(),
      childUserApi.getCount(),
      eventApi.getCount(),
    ]);

    stats.value = {
      users: usersRes.data?.count || 0,
      children: childrenRes.data?.count || 0,
      events: eventsRes.data?.count || 0,
    };
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

const loadExportHistory = () => {
  // Load from localStorage for now
  const history = localStorage.getItem("csvExportHistory");
  if (history) {
    exportHistory.value = JSON.parse(history);
  }
};

const handleExportSuccess = (data) => {
  successMessage.value = `Successfully exported ${data.recordCount} records to ${data.fileName}`;
  errorMessage.value = "";

  // Add to history
  const historyItem = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    fileName: data.fileName,
    type: data.type,
    recordCount: data.recordCount,
    fileSize: data.fileSize || "Unknown",
    status: "Success",
  };

  exportHistory.value.unshift(historyItem);
  localStorage.setItem("csvExportHistory", JSON.stringify(exportHistory.value));

  // Clear message after 5 seconds
  setTimeout(() => {
    successMessage.value = "";
  }, 5000);
};

const handleExportError = (error) => {
  errorMessage.value = error.message || "Export failed";
  successMessage.value = "";

  // Clear message after 5 seconds
  setTimeout(() => {
    errorMessage.value = "";
  }, 5000);
};

const exportAllData = async () => {
  try {
    // This would trigger a comprehensive export
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `ikidpro_complete_export_${timestamp}.zip`;

    // For now, just show a message
    successMessage.value = `Export initiated. ${filename} will be downloaded shortly.`;

    // In a real implementation, you would call an API endpoint that generates
    // a comprehensive export of all data
  } catch (error) {
    errorMessage.value = "Failed to export data";
  }
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const getTypeColor = (type) => {
  const colors = {
    users: "bg-blue-100 text-blue-800",
    children: "bg-green-100 text-green-800",
    events: "bg-purple-100 text-purple-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getStatusColor = (status) => {
  const colors = {
    Success: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    "Partial Success": "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Lifecycle
onMounted(() => {
  loadExportHistory();
  loadStats();
});
</script>
