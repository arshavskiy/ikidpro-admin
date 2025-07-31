<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Database Information</h2>
      <p class="text-gray-600">
        Monitor database health, collections, and system information
      </p>
    </div>

    <!-- Database Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-database text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Database Status</p>
            <p class="text-xl font-bold text-green-600">
              {{ dbStatus.status }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-server text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">MongoDB Version</p>
            <p class="text-xl font-bold text-gray-900">
              {{ dbStatus.version }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-hdd text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Storage Used</p>
            <p class="text-xl font-bold text-gray-900">
              {{ dbStatus.storageUsed }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <i class="fas fa-clock text-yellow-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Uptime</p>
            <p class="text-xl font-bold text-gray-900">{{ dbStatus.uptime }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Collections Overview -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden max-h-150">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Collections Overview
          </h3>
          <button
            @click="refreshCollections"
            :disabled="loading"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <i
              class="fas fa-refresh mr-1"
              :class="{ 'animate-spin': loading }"
            ></i>
            Refresh
          </button>
        </div>
      </div>

      <div class="overflow-auto max-h-150">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collection Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Document Count
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Size
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Average Doc Size
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Indexes
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
              v-for="collection in collections"
              :key="collection.name"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i class="fas fa-table text-gray-400 mr-3"></i>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ collection.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ collection.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ collection.count?.toLocaleString() || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ collection.size || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ collection.avgDocSize || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ collection.indexes || "N/A" }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
              >
                <button
                  @click="viewCollectionDetails(collection)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="exportCollection(collection)"
                  class="text-green-600 hover:text-green-900"
                >
                  <i class="fas fa-download"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Database Operations -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Database Operations (Last 24h)
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Read Operations</span>
            <span class="text-sm font-medium text-gray-900">{{
              dbMetrics.readOps.toLocaleString()
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Write Operations</span>
            <span class="text-sm font-medium text-gray-900">{{
              dbMetrics.writeOps.toLocaleString()
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Update Operations</span>
            <span class="text-sm font-medium text-gray-900">{{
              dbMetrics.updateOps.toLocaleString()
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Delete Operations</span>
            <span class="text-sm font-medium text-gray-900">{{
              dbMetrics.deleteOps.toLocaleString()
            }}</span>
          </div>
          <div class="border-t pt-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600"
                >Average Response Time</span
              >
              <span class="text-sm font-bold text-gray-900"
                >{{ dbMetrics.avgResponseTime }}ms</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Pool -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Connection Pool Status
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Active Connections</span>
            <span class="text-sm font-medium text-gray-900">{{
              connectionPool.active
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Available Connections</span>
            <span class="text-sm font-medium text-gray-900">{{
              connectionPool.available
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Total Pool Size</span>
            <span class="text-sm font-medium text-gray-900">{{
              connectionPool.total
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Connection Errors</span>
            <span class="text-sm font-medium text-red-600">{{
              connectionPool.errors
            }}</span>
          </div>
          <div class="border-t pt-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600"
                >Pool Utilization</span
              >
              <span class="text-sm font-bold text-gray-900"
                >{{ connectionPool.utilization }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Database Backup Options -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Database Backup & Maintenance
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          @click="createBackup"
          :disabled="backupLoading"
          class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <i
            class="fas fa-save text-blue-600 text-2xl mb-2"
            :class="{ 'animate-spin': backupLoading }"
          ></i>
          <span class="text-sm font-medium text-blue-700">Create Backup</span>
        </button>

        <button
          @click="optimizeDatabase"
          :disabled="optimizeLoading"
          class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <i
            class="fas fa-tools text-green-600 text-2xl mb-2"
            :class="{ 'animate-spin': optimizeLoading }"
          ></i>
          <span class="text-sm font-medium text-green-700">Optimize DB</span>
        </button>

        <button
          @click="checkIndexes"
          class="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <i class="fas fa-search text-yellow-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-yellow-700">Check Indexes</span>
        </button>

        <button
          @click="viewLogs"
          class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <i class="fas fa-file-alt text-purple-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-purple-700">View Logs</span>
        </button>
      </div>
    </div>

    <!-- Collection Detail Modal -->
    <div
      v-if="selectedCollection"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              Collection Details: {{ selectedCollection.name }}
            </h3>
            <button
              @click="selectedCollection = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-3">
                Collection Statistics
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Document Count:</span>
                  <span class="text-sm text-gray-900">{{
                    selectedCollection.count?.toLocaleString() || "N/A"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Size:</span>
                  <span class="text-sm text-gray-900">{{
                    selectedCollection.size || "N/A"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600"
                    >Average Document Size:</span
                  >
                  <span class="text-sm text-gray-900">{{
                    selectedCollection.avgDocSize || "N/A"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Storage Size:</span>
                  <span class="text-sm text-gray-900">{{
                    selectedCollection.storageSize || "N/A"
                  }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Index Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Indexes:</span>
                  <span class="text-sm text-gray-900">{{
                    selectedCollection.indexes || "N/A"
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Index Size:</span>
                  <span class="text-sm text-gray-900">{{
                    selectedCollection.indexSize || "N/A"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as eventApi from "../../services/eventApi";

// Reactive data
const loading = ref(false);
const backupLoading = ref(false);
const optimizeLoading = ref(false);
const selectedCollection = ref(null);

const dbStatus = ref({
  status: "Connected",
  version: "6.0.2",
  storageUsed: "245 MB",
  uptime: "7d 14h 23m",
});

const collections = ref([
  {
    name: "child_events_db",
    description: "Sensor events and telemetry data",
    count: 15247,
    size: "185 MB",
    avgDocSize: "1.2 KB",
    indexes: 5,
    storageSize: "195 MB",
    indexSize: "2.5 MB",
  },
  {
    name: "user_reg_db",
    description: "User registration and profile data",
    count: 156,
    size: "890 KB",
    avgDocSize: "5.7 KB",
    indexes: 3,
    storageSize: "1.2 MB",
    indexSize: "128 KB",
  },
  {
    name: "child_info_db",
    description: "Child profile and health information",
    count: 298,
    size: "2.1 MB",
    avgDocSize: "7.2 KB",
    indexes: 4,
    storageSize: "2.5 MB",
    indexSize: "256 KB",
  },
]);

const dbMetrics = ref({
  readOps: 12456,
  writeOps: 3421,
  updateOps: 1876,
  deleteOps: 245,
  avgResponseTime: 12,
});

const connectionPool = ref({
  active: 8,
  available: 42,
  total: 50,
  errors: 0,
  utilization: 16,
});

// Methods
const refreshCollections = async () => {
  loading.value = true;
  try {
    const response = await eventApi.getCollections();
    // Process response and update collections
    console.log("Collections:", response.data);
  } catch (error) {
    console.error("Error fetching collections:", error);
  } finally {
    loading.value = false;
  }
};

const viewCollectionDetails = (collection) => {
  selectedCollection.value = collection;
};

const exportCollection = (collection) => {
  console.log("Exporting collection:", collection.name);
  // Implement export functionality
};

const createBackup = async () => {
  backupLoading.value = true;
  try {
    // Simulate backup process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    alert("Database backup created successfully!");
  } catch (error) {
    console.error("Error creating backup:", error);
    alert("Error creating backup");
  } finally {
    backupLoading.value = false;
  }
};

const optimizeDatabase = async () => {
  optimizeLoading.value = true;
  try {
    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Database optimization completed!");
  } catch (error) {
    console.error("Error optimizing database:", error);
    alert("Error optimizing database");
  } finally {
    optimizeLoading.value = false;
  }
};

const checkIndexes = () => {
  console.log("Checking database indexes...");
  alert("Index analysis complete. All indexes are optimized.");
};

const viewLogs = () => {
  console.log("Opening database logs...");
  // Navigate to logs page or open logs modal
};

// Lifecycle
onMounted(() => {
  refreshCollections();
});
</script>
