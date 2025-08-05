<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Data Management</h2>
        <p class="text-gray-600">Import and export data using CSV files</p>
      </div>
      <div class="flex space-x-2">
        <div class="mr-4">
          <n-button @click="showTemplateModal = true" type="success">
            <template #icon>
              <i class="fas fa-download"></i>
            </template>
            Download Templates
          </n-button>
        </div>
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
    <NCard>
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        <i class="fas fa-upload mr-2 text-blue-600"></i>CSV Import
      </h3>

      <CsvImporter
        @import-success="handleImportSuccess"
        @import-error="handleImportError"
      />
    </NCard>

    <!-- Recent Import History -->
    <NCard>
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
    </NCard>

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
import { NCard } from "naive-ui";

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
      [
        "firstName",
        "lastName",
        "email",
        "phone",
        "role",
        "isActive",
        "createdAt",
        "updatedAt",
      ],
      [
        "John",
        "Doe",
        "john.doe@example.com",
        "+1234567890",
        "parent",
        "true",
        "2024-01-01T00:00:00Z",
        "2024-01-01T00:00:00Z",
      ],
      [
        "Jane",
        "Smith",
        "jane.smith@example.com",
        "+0987654321",
        "parent",
        "true",
        "2024-01-02T00:00:00Z",
        "2024-01-02T00:00:00Z",
      ],
      [
        "Mike",
        "Johnson",
        "mike.johnson@example.com",
        "+1122334455",
        "admin",
        "true",
        "2024-01-03T00:00:00Z",
        "2024-01-03T00:00:00Z",
      ],
      [
        "Sarah",
        "Wilson",
        "sarah.wilson@example.com",
        "+5566778899",
        "parent",
        "true",
        "2024-01-04T00:00:00Z",
        "2024-01-04T00:00:00Z",
      ],
    ],
    children: [
      [
        "firstName",
        "lastName",
        "dateOfBirth",
        "age",
        "gender",
        "height",
        "weight",
        "parentId",
        "medicalCondition",
        "limitations",
        "emergencyContact",
        "notes",
        "isActive",
        "createdAt",
        "updatedAt",
      ],
      [
        "Alice",
        "Doe",
        "2018-05-15",
        "6",
        "Female",
        "115",
        "22.5",
        "parent_user_id_1",
        "Asthma",
        "",
        "Mary Doe - +1234567891 (Mother)",
        "Needs inhaler at school",
        "true",
        "2024-01-01T00:00:00Z",
        "2024-01-01T00:00:00Z",
      ],
      [
        "Bob",
        "Smith",
        "2020-08-22",
        "4",
        "Male",
        "98",
        "16.8",
        "parent_user_id_2",
        "",
        "ADHD",
        "Tom Smith - +0987654322 (Father)",
        "Requires extra attention during activities",
        "true",
        "2024-01-02T00:00:00Z",
        "2024-01-02T00:00:00Z",
      ],
      [
        "Emma",
        "Johnson",
        "2019-03-10",
        "5",
        "Female",
        "105",
        "19.2",
        "parent_user_id_3",
        "Food allergies",
        "Mobility impairment",
        "Lisa Johnson - +1122334456 (Mother)",
        "Allergic to nuts and dairy",
        "true",
        "2024-01-03T00:00:00Z",
        "2024-01-03T00:00:00Z",
      ],
      [
        "Liam",
        "Wilson",
        "2021-11-05",
        "3",
        "Male",
        "92",
        "14.5",
        "parent_user_id_4",
        "",
        "",
        "David Wilson - +5566778890 (Father)",
        "Very active child",
        "true",
        "2024-01-04T00:00:00Z",
        "2024-01-04T00:00:00Z",
      ],
    ],
    events: [
      [
        "aid",
        "Timestamp",
        "HeartRate",
        "HRV",
        "Temperature",
        "AccelX",
        "AccelY",
        "AccelZ",
        "GyroX",
        "GyroY",
        "GyroZ",
        "magneticX",
        "magneticY",
        "magneticZ",
        "latitude",
        "longitude",
        "altitude",
        "speed_mps",
        "speed",
        "bearing_deg",
        "accuracy_m",
        "satellites",
        "SoundLevel",
        "pressure",
        "light",
        "EDA",
        "steps",
        "calories",
        "BatteryLevel",
        "SignalStrength",
        "DeviceId",
      ],
      [
        "CHILD-001",
        "2024-01-15T10:30:00Z",
        "85",
        "45.2",
        "36.8",
        "0.2",
        "-0.1",
        "9.8",
        "0.05",
        "-0.02",
        "0.01",
        "25.4",
        "-12.8",
        "48.6",
        "40.7128",
        "-74.0060",
        "10.5",
        "1.2",
        "4.3",
        "180.5",
        "3.2",
        "8",
        "65.2",
        "1013.25",
        "450",
        "2.8",
        "1250",
        "85",
        "75",
        "-65",
        "DEV001",
      ],
      [
        "CHILD-001",
        "2024-01-15T10:35:00Z",
        "92",
        "38.7",
        "37.0",
        "0.8",
        "0.3",
        "9.7",
        "0.12",
        "0.08",
        "-0.03",
        "26.1",
        "-13.2",
        "49.1",
        "40.7130",
        "-74.0062",
        "11.2",
        "2.1",
        "7.6",
        "185.2",
        "2.8",
        "9",
        "68.5",
        "1013.18",
        "480",
        "3.2",
        "1320",
        "92",
        "74",
        "-63",
        "DEV001",
      ],
      [
        "CHILD-002",
        "2024-01-15T10:30:00Z",
        "78",
        "52.1",
        "36.5",
        "-0.1",
        "0.4",
        "9.9",
        "-0.02",
        "0.06",
        "0.04",
        "24.8",
        "-11.9",
        "47.3",
        "34.0522",
        "-118.2437",
        "45.8",
        "0.8",
        "2.9",
        "90.3",
        "4.1",
        "12",
        "58.9",
        "1015.42",
        "380",
        "1.9",
        "850",
        "72",
        "82",
        "-58",
        "DEV002",
      ],
      [
        "CHILD-002",
        "2024-01-15T10:35:00Z",
        "88",
        "44.6",
        "36.7",
        "0.5",
        "-0.2",
        "9.6",
        "0.08",
        "-0.04",
        "0.02",
        "25.3",
        "-12.5",
        "48.2",
        "34.0525",
        "-118.2440",
        "46.1",
        "1.5",
        "5.4",
        "95.8",
        "3.7",
        "11",
        "62.3",
        "1015.38",
        "420",
        "2.4",
        "920",
        "78",
        "81",
        "-56",
        "DEV002",
      ],
      [
        "CHILD-003",
        "2024-01-15T10:30:00Z",
        "95",
        "41.3",
        "37.2",
        "1.2",
        "0.7",
        "9.4",
        "0.18",
        "0.15",
        "-0.08",
        "27.2",
        "-14.1",
        "50.5",
        "51.5074",
        "-0.1278",
        "25.3",
        "3.2",
        "11.5",
        "270.4",
        "2.1",
        "7",
        "72.8",
        "1008.65",
        "520",
        "4.1",
        "1850",
        "108",
        "68",
        "-72",
        "DEV003",
      ],
      [
        "CHILD-003",
        "2024-01-15T10:35:00Z",
        "102",
        "39.8",
        "37.4",
        "1.8",
        "1.1",
        "9.2",
        "0.25",
        "0.22",
        "-0.12",
        "28.1",
        "-14.8",
        "51.2",
        "51.5077",
        "-0.1281",
        "26.8",
        "4.1",
        "14.8",
        "275.1",
        "1.8",
        "8",
        "76.2",
        "1008.58",
        "550",
        "4.8",
        "1920",
        "115",
        "67",
        "-70",
        "DEV003",
      ],
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
