<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Data Management</h2>
        <p class="text-gray-600">Import and export data using CSV files</p>
      </div>
      <div class="flex space-x-2">
        <button
          @click="showTemplateModal = true"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <i class="fas fa-download mr-2"></i>Download Templates
        </button>
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
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-users text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.users }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-child text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Children</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.children }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-chart-line text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Events</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.events }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CSV Import/Export Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- CSV Import -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          <i class="fas fa-upload mr-2 text-blue-600"></i>CSV Import
        </h3>

        <CsvImporter
          @import-success="handleImportSuccess"
          @import-error="handleImportError"
        />
      </div>

      <!-- CSV Export -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          <i class="fas fa-download mr-2 text-green-600"></i>CSV Export
        </h3>

        <CsvExporter
          @export-success="handleExportSuccess"
          @export-error="handleExportError"
        />
      </div>
    </div>

    <!-- Recent Import History -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <i class="fas fa-history mr-2 text-gray-600"></i>Recent Import History
      </h3>

      <div v-if="importHistory.length === 0" class="text-center py-8">
        <i class="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-500">No import history available</p>
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
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in importHistory"
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
                {{ item.recordsProcessed }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusColor(item.status)"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewImportDetails(item)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="item.errors && item.errors.length > 0"
                  @click="downloadErrorReport(item)"
                  class="text-red-600 hover:text-red-900"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="successMessage"
      class="p-3 bg-green-50 border border-green-200 rounded"
    >
      <p class="text-sm text-green-600">{{ successMessage }}</p>
    </div>

    <div
      v-if="errorMessage"
      class="p-3 bg-red-50 border border-red-200 rounded"
    >
      <p class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Template Download Modal -->
    <div
      v-if="showTemplateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Download CSV Templates
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <button
            @click="downloadTemplate('users')"
            class="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i class="fas fa-users text-blue-600 mr-3"></i>
            <div class="text-left">
              <div class="font-medium text-gray-900">Users Template</div>
              <div class="text-sm text-gray-500">
                Template for importing user data
              </div>
            </div>
          </button>

          <button
            @click="downloadTemplate('children')"
            class="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <i class="fas fa-child text-green-600 mr-3"></i>
            <div class="text-left">
              <div class="font-medium text-gray-900">Children Template</div>
              <div class="text-sm text-gray-500">
                Template for importing children data
              </div>
            </div>
          </button>

          <button
            @click="downloadTemplate('events')"
            class="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <i class="fas fa-chart-line text-purple-600 mr-3"></i>
            <div class="text-left">
              <div class="font-medium text-gray-900">Events Template</div>
              <div class="text-sm text-gray-500">
                Template for importing sensor events
              </div>
            </div>
          </button>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end">
          <button
            @click="showTemplateModal = false"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CsvImporter from "../../components/data/CsvImporter.vue";
import CsvExporter from "../../components/data/CsvExporter.vue";
import * as userApi from "../../services/userApi";
import * as childUserApi from "../../services/childUserApi";
import * as eventApi from "../../services/eventApi";

// Reactive data
const stats = ref({
  users: 0,
  children: 0,
  events: 0,
});

const importHistory = ref([]);
const successMessage = ref("");
const errorMessage = ref("");
const showTemplateModal = ref(false);

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

const loadImportHistory = () => {
  // Load from localStorage for now
  const history = localStorage.getItem("csvImportHistory");
  if (history) {
    importHistory.value = JSON.parse(history);
  }
};

const handleImportSuccess = (data) => {
  successMessage.value = `Successfully imported ${data.recordsProcessed} records from ${data.fileName}`;
  errorMessage.value = "";

  // Add to history
  const historyItem = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    fileName: data.fileName,
    type: data.type,
    recordsProcessed: data.recordsProcessed,
    status: "Success",
    errors: data.errors || [],
  };

  importHistory.value.unshift(historyItem);
  localStorage.setItem("csvImportHistory", JSON.stringify(importHistory.value));

  // Reload stats
  loadStats();

  // Clear message after 5 seconds
  setTimeout(() => {
    successMessage.value = "";
  }, 5000);
};

const handleImportError = (error) => {
  errorMessage.value = error.message || "Import failed";
  successMessage.value = "";

  // Clear message after 5 seconds
  setTimeout(() => {
    errorMessage.value = "";
  }, 5000);
};

const handleExportSuccess = (data) => {
  successMessage.value = `Successfully exported ${data.recordCount} records to ${data.fileName}`;
  errorMessage.value = "";

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

const downloadTemplate = (type) => {
  const templates = {
    users: [
      ["firstName", "lastName", "email", "phone", "role", "isActive"],
      ["John", "Doe", "john.doe@example.com", "+1234567890", "parent", "true"],
      [
        "Jane",
        "Smith",
        "jane.smith@example.com",
        "+0987654321",
        "admin",
        "true",
      ],
    ],
    children: [
      [
        "firstName",
        "lastName",
        "dateOfBirth",
        "gender",
        "parentId",
        "isActive",
      ],
      ["Alice", "Doe", "2018-05-15", "female", "parent_user_id", "true"],
      ["Bob", "Smith", "2020-08-22", "male", "parent_user_id", "true"],
    ],
    events: [
      [
        "aid",
        "Timestamp",
        "HeartRate",
        "TemperatureC",
        "latitude",
        "longitude",
      ],
      ["child_id", "2024-01-15T10:30:00Z", "85", "36.8", "40.7128", "-74.0060"],
      ["child_id", "2024-01-15T10:35:00Z", "92", "37.0", "40.7130", "-74.0062"],
    ],
  };

  const csvContent = templates[type]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${type}_template.csv`;
  link.click();
  window.URL.revokeObjectURL(url);

  showTemplateModal.value = false;
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

const viewImportDetails = (item) => {
  // Open modal or navigate to details page
  console.log("View import details:", item);
};

const downloadErrorReport = (item) => {
  if (item.errors && item.errors.length > 0) {
    const csvContent = [
      ["Row", "Error", "Data"],
      ...item.errors.map((error) => [error.row, error.message, error.data]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `error_report_${item.fileName}_${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
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
  loadStats();
  loadImportHistory();
});
</script>
