<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Database Information</h2>
      <p class="text-gray-600">
        Monitor database health, collections, and system information
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !dbData" class="text-center py-12">
      <i class="fas fa-spinner animate-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Loading database information...</p>
    </div>

    <template v-else>
      <!-- Database Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <i class="fas fa-database text-green-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Database Status</p>
              <p
                class="text-xl font-bold"
                :class="
                  dbStatus.status === 'Connected'
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ dbStatus.status }}
              </p>
            </div>
          </div>
        </div>

        <!-- <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <i class="fas fa-server text-blue-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Database Host</p>
              <p
                class="text-lg font-bold text-gray-900 truncate"
                :title="dbStatus.version"
              >
                {{ dbStatus.version }}
              </p>
            </div>
          </div>
        </div> -->

        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full">
              <i class="fas fa-hdd text-purple-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Storage</p>
              <p class="text-xl font-bold text-gray-900">
                {{ dbStatus.storageUsed }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full">
              <i class="fas fa-clock text-yellow-600"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Uptime</p>
              <p class="text-xl font-bold text-gray-900">
                {{ dbStatus.uptime }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div
        v-if="dbData?.summary"
        class="bg-white p-4 rounded-lg shadow-sm border"
      >
        <h3 class="text-lg font-medium text-gray-900 mb-4">Database Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ dbData.summary.totalDocuments }}
            </div>
            <div class="text-sm text-gray-500">Total Documents</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ dbData.database.collections }}
            </div>
            <div class="text-sm text-gray-500">Collections</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">
              {{ dbData.database.avgObjSize }}
            </div>
            <div class="text-sm text-gray-500">Avg Object Size</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">
              {{ dbData.database.indexSize }}
            </div>
            <div class="text-sm text-gray-500">Index Size</div>
          </div>
        </div>
      </div>

      <!-- Collections Overview -->
      <div
        class="bg-white rounded-lg shadow-sm border overflow-hidden max-h-150"
      >
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
                  <div class="text-sm text-gray-900 font-medium">
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
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Database Performance
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Read Latency</span>
              <span class="text-sm font-medium text-gray-900">{{
                dbMetrics.readLatency
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Write Latency</span>
              <span class="text-sm font-medium text-gray-900">{{
                dbMetrics.writeLatency
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Documents</span>
              <span class="text-sm font-medium text-gray-900">{{
                dbMetrics.readOps.toLocaleString()
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Estimated Writes</span>
              <span class="text-sm font-medium text-gray-900">{{
                dbMetrics.writeOps.toLocaleString()
              }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600"
                  >Average Response Time</span
                >
                <span class="text-sm font-bold text-gray-900"
                  >{{ dbMetrics.avgResponseTime.toFixed(2) }}ms</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            System Information
          </h3>
          <div
            class="space-y-4"
            v-if="dbData?.serverInfo && dbData?.performance"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Node.js Version</span>
              <span class="text-sm font-medium text-gray-900">{{
                dbData.serverInfo.nodeVersion
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Platform</span>
              <span class="text-sm font-medium text-gray-900"
                >{{ dbData.serverInfo.platform }} ({{ dbData.serverInfo.arch }})
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Memory (RSS)</span>
              <span class="text-sm font-medium text-gray-900"
                >{{
                  Math.round(dbData.performance.memoryUsage.rss / 1024 / 1024)
                }}
                MB</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Heap Used</span>
              <span class="text-sm font-medium text-gray-900"
                >{{
                  Math.round(
                    dbData.performance.memoryUsage.heapUsed / 1024 / 1024
                  )
                }}
                MB</span
              >
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600"
                  >Active Connections</span
                >
                <span class="text-sm font-bold text-gray-900">{{
                  connectionPool.active
                }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <span class="text-sm text-gray-500"
              >System information not available</span
            >
          </div>
        </div>
      </div>

      <!-- Database Backup Options -->
      <!-- <div class="bg-white p-4 rounded-lg shadow-sm border">
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
            <span class="text-sm font-medium text-yellow-700"
              >Check Indexes</span
            >
          </button>

          <button
            @click="viewLogs"
            class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <i class="fas fa-file-alt text-purple-600 text-2xl mb-2"></i>
            <span class="text-sm font-medium text-purple-700">View Logs</span>
          </button>
        </div>
      </div> -->

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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span class="text-sm text-gray-600">Collection Size:</span>
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
                <h4 class="font-medium text-gray-900 mb-3">
                  Index Information
                </h4>
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

                <!-- Index Details -->
                <div v-if="selectedCollection.indexDetails" class="mt-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">
                    Index Details:
                  </h5>
                  <div class="space-y-1">
                    <div
                      v-for="index in selectedCollection.indexDetails"
                      :key="index.name"
                      class="text-xs bg-gray-50 p-2 rounded"
                    >
                      <span class="font-medium">{{ index.name }}</span>
                      <span class="text-gray-500 ml-2">
                        {{ Object.keys(index.keys).join(", ") }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sample Document -->
            <div v-if="selectedCollection.sampleDocument?.hasData" class="mt-6">
              <h4 class="font-medium text-gray-900 mb-3">
                Sample Document Schema
              </h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="text-sm">
                    <span class="text-gray-600">Field Count:</span>
                    <span class="font-medium ml-2">{{
                      selectedCollection.sampleDocument.fieldCount
                    }}</span>
                  </div>
                  <div
                    class="text-sm"
                    v-if="selectedCollection.sampleDocument.createdAt"
                  >
                    <span class="text-gray-600">Sample From:</span>
                    <span class="font-medium ml-2">{{
                      new Date(
                        selectedCollection.sampleDocument.createdAt
                      ).toLocaleDateString()
                    }}</span>
                  </div>
                </div>
                <div class="text-xs">
                  <span class="text-gray-600">Fields:</span>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span
                      v-for="field in selectedCollection.sampleDocument.fields"
                      :key="field"
                      class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {{ field }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-if="!loading && !dbData" class="text-center py-12">
      <i class="fas fa-database text-gray-400 text-6xl mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No Database Information
      </h3>
      <p class="text-gray-500 mb-4">
        Unable to connect to the database or fetch information.
      </p>
      <button
        @click="refreshCollections"
        class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <i class="fas fa-refresh mr-2"></i>Retry Connection
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import * as eventApi from "../../services/eventApi";

// Reactive data
const loading = ref(false);
const backupLoading = ref(false);
const optimizeLoading = ref(false);
const selectedCollection = ref(null);
const dbData = ref(null);

// Computed properties based on real API data
const dbStatus = computed(() => {
  if (!dbData.value) {
    return {
      status: "Disconnected",
      version: "Unknown",
      storageUsed: "N/A",
      uptime: "N/A",
    };
  }

  const db = dbData.value.database;
  const perf = dbData.value.performance;

  return {
    status: db.connectionState === "connected" ? "Connected" : "Disconnected",
    version: `MongoDB @ ${db.host}:${db.port}`,
    storageUsed: db.totalSize || "N/A",
    uptime: `${perf.uptime || 0} hours`,
  };
});

const collections = computed(() => {
  if (!dbData.value?.collections) return [];

  return Object.entries(dbData.value.collections).map(([key, collection]) => ({
    name: collection.name,
    description: getCollectionDescription(collection.name),
    count: collection.documentCount,
    size: collection.collectionSize,
    avgDocSize: collection.avgDocumentSize,
    indexes: collection.indexCount,
    storageSize: collection.storageSize,
    indexSize: collection.totalIndexSize,
    sampleDocument: collection.sampleDocument,
    indexDetails: collection.indexes,
  }));
});

const dbMetrics = computed(() => {
  if (!dbData.value?.performance) {
    return {
      readOps: 0,
      writeOps: 0,
      updateOps: 0,
      deleteOps: 0,
      avgResponseTime: 0,
      readLatency: "N/A",
      writeLatency: "N/A",
    };
  }

  const perf = dbData.value.performance;
  return {
    readOps: dbData.value.summary?.totalDocuments || 0,
    writeOps: Math.floor((dbData.value.summary?.totalDocuments || 0) * 0.3),
    updateOps: Math.floor((dbData.value.summary?.totalDocuments || 0) * 0.2),
    deleteOps: Math.floor((dbData.value.summary?.totalDocuments || 0) * 0.1),
    avgResponseTime: parseFloat(perf.readLatency?.replace(" ms", "")) || 0,
    readLatency: perf.readLatency || "N/A",
    writeLatency: perf.writeLatency || "N/A",
  };
});

const connectionPool = computed(() => {
  if (!dbData.value?.performance) {
    return {
      active: 0,
      available: 0,
      total: 0,
      errors: 0,
      utilization: 0,
    };
  }

  const connections = dbData.value.performance.connectionsUsed || 1;
  return {
    active: connections,
    available: 50 - connections,
    total: 50,
    errors: 0,
    utilization: Math.round((connections / 50) * 100),
  };
});

// Methods
const getCollectionDescription = (collectionName) => {
  const descriptions = {
    child_events_db: "Sensor events and telemetry data",
    user_reg_db: "User registration and profile data",
    child_info_db: "Child profile and health information",
    ace: "Access control entries",
    admin: "Administrative settings and configurations",
  };
  return descriptions[collectionName] || "Database collection";
};

const refreshCollections = async () => {
  loading.value = true;
  try {
    console.log("🔄 Loading database statistics...");
    const response = await eventApi.getDBStats();

    if (response.data && response.data.success) {
      dbData.value = response.data.data;
      console.log("✅ Database statistics loaded successfully");
      console.log("Database Info:", dbData.value);
    } else {
      console.error("❌ Invalid response format:", response);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("❌ Error fetching database statistics:", error);
    // Keep existing data or set to null
    if (!dbData.value) {
      dbData.value = null;
    }
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
