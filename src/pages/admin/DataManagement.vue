<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Data Management</h2>
        <p class="text-gray-600">Import and export data using CSV files</p>
      </div>
      <div class="flex space-x-2">
        <n-button @click="showTemplateModal = true" type="success">
          <template #icon>
            <i class="fas fa-download"></i>
          </template>
          Download Templates
        </n-button>
        <n-button @click="$router.push('/admin/data/export')" type="primary">
          <template #icon>
            <i class="fas fa-file-export"></i>
          </template>
          Data Export
        </n-button>
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

    <!-- CSV Import Section -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <i class="fas fa-upload mr-2 text-blue-600"></i>CSV Import
      </h3>

      <CsvImporter
        @import-success="handleImportSuccess"
        @import-error="handleImportError"
      />
    </div>

    <!-- Recent Import History -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
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
                <n-button
                  @click="viewImportDetails(item)"
                  type="info"
                  size="small"
                  secondary
                >
                  <template #icon>
                    <i class="fas fa-eye"></i>
                  </template>
                </n-button>
                <n-button
                  v-if="item.errors && item.errors.length > 0"
                  @click="downloadErrorReport(item)"
                  type="warning"
                  size="small"
                  secondary
                  style="margin-left: 8px"
                >
                  <template #icon>
                    <i class="fas fa-exclamation-triangle"></i>
                  </template>
                </n-button>
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
          <div
            @click="downloadTemplate('users')"
            class="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <i class="fas fa-users text-blue-600 mr-3"></i>
            <div class="text-left">
              <div class="font-medium text-gray-900">Users Template</div>
              <div class="text-sm text-gray-500">
                Template for importing user data
              </div>
            </div>
          </div>

          <div
            @click="downloadTemplate('children')"
            class="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
          >
            <i class="fas fa-child text-green-600 mr-3"></i>
            <div class="text-left">
              <div class="font-medium text-gray-900">Children Template</div>
              <div class="text-sm text-gray-500">
                Template for importing children data
              </div>
            </div>
          </div>

          <div
            @click="downloadTemplate('events')"
            class="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <i class="fas fa-chart-line text-purple-600 mr-3"></i>
            <div class="text-left">
              <div class="font-medium text-gray-900">Events Template</div>
              <div class="text-sm text-gray-500">
                Template for importing sensor events
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end">
          <n-button @click="showTemplateModal = false" type="default">
            Close
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { NButton } from "naive-ui";
import CsvImporter from "../../components/data/CsvImporter.vue";
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
      ["aid", "Timestamp", "HeartRate", "Temperature", "latitude", "longitude"],
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
