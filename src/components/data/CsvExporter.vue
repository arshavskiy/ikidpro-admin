<template>
  <div class="space-y-4">
    <!-- Export Type Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Data Type <span class="text-red-500">*</span>
      </label>
      <select
        v-model="selectedDataType"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select data type to export</option>
        <option value="users">Users</option>
        <option value="children">Children</option>
        <option value="events">Events</option>
      </select>
    </div>

    <!-- Export Options -->
    <div v-if="selectedDataType" class="space-y-4">
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">Export Options</h4>

        <label class="flex items-center">
          <input
            v-model="exportOptions.includeHeaders"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700">Include column headers</span>
        </label>

        <label class="flex items-center">
          <input
            v-model="exportOptions.includeInactive"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700"
            >Include inactive records</span
          >
        </label>
      </div>

      <!-- Date Range Filter (for events) -->
      <div v-if="selectedDataType === 'events'" class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">Date Range</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Start Date</label>
            <input
              v-model="dateRange.start"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">End Date</label>
            <input
              v-model="dateRange.end"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Field Selection -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">Fields to Export</h4>
        <div class="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          <label
            v-for="field in availableFields"
            :key="field.key"
            class="flex items-center"
          >
            <input
              v-model="selectedFields"
              :value="field.key"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">{{ field.label }}</span>
          </label>
        </div>
        <div class="flex space-x-2">
          <button
            @click="selectAllFields"
            class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Select All
          </button>
          <button
            @click="deselectAllFields"
            class="text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="previewData.length > 0" class="space-y-2">
        <h4 class="text-sm font-medium text-gray-700">Preview</h4>
        <div
          class="overflow-x-auto border border-gray-200 overflow-y-auto max-h-110"
        >
          <table class="min-w-full divide-y divide-gray-200 max-h-110">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="field in selectedFields"
                  :key="field"
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ getFieldLabel(field) }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(record, index) in previewData"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td
                  v-for="field in selectedFields"
                  :key="field"
                  class="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                  :title="formatFieldValue(record[field])"
                >
                  {{ formatFieldValue(record[field]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500">
          Total records to export: {{ totalRecords }}
        </p>
      </div>
    </div>

    <!-- Export Actions -->
    <div
      v-if="selectedDataType && selectedFields.length > 0"
      class="flex justify-end space-x-3"
    >
      <button
        @click="generatePreview"
        :disabled="loading"
        class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
      >
        <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
        Preview Export
      </button>
      <button
        @click="exportData"
        :disabled="loading || exporting"
        class="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        <i v-if="exporting" class="fas fa-spinner animate-spin mr-2"></i>
        <i v-else class="fas fa-download mr-2"></i>
        Export CSV
      </button>
    </div>

    <!-- Progress Bar -->
    <div v-if="exporting" class="space-y-2">
      <div class="flex justify-between text-sm text-gray-600">
        <span>Exporting...</span>
        <span>{{ exportProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-green-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: exportProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from "vue";
import * as userApi from "../../services/userApi";
import * as childUserApi from "../../services/childUserApi";
import * as eventApi from "../../services/eventApi";

const emit = defineEmits(["export-success", "export-error"]);

// Reactive data
const selectedDataType = ref("");
const selectedFields = ref([]);
const previewData = ref([]);
const totalRecords = ref(0);
const loading = ref(false);
const exporting = ref(false);
const exportProgress = ref(0);

const exportOptions = reactive({
  includeHeaders: true,
  includeInactive: false,
});

const dateRange = reactive({
  start: "",
  end: "",
});

// Field definitions
const fieldDefinitions = {
  users: [
    { key: "_id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "isActive", label: "Active" },
    { key: "createdAt", label: "Created Date" },
    { key: "updatedAt", label: "Updated Date" },
  ],
  children: [
    { key: "_id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "parentId", label: "Parent ID" },
    { key: "isActive", label: "Active" },
    { key: "createdAt", label: "Created Date" },
    { key: "updatedAt", label: "Updated Date" },
  ],
  events: [
    { key: "_id", label: "ID" },
    { key: "aid", label: "Child ID" },
    { key: "Timestamp", label: "Timestamp" },
    { key: "HeartRate", label: "Heart Rate" },
    { key: "HRV", label: "HRV" },
    { key: "Temperature", label: "Temperature (°C)" },
    { key: "SoundLevel", label: "Sound Level (dB)" },
    { key: "AccelX", label: "Accel X" },
    { key: "AccelY", label: "Accel Y" },
    { key: "AccelZ", label: "Accel Z" },
    { key: "GyroX", label: "Gyro X" },
    { key: "GyroY", label: "Gyro Y" },
    { key: "GyroZ", label: "Gyro Z" },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" },
    { key: "altitude", label: "Altitude" },
    { key: "speed_mps", label: "Speed (m/s)" },
  ],
};

// Computed properties
const availableFields = computed(() => {
  return fieldDefinitions[selectedDataType.value] || [];
});

// Methods
const selectAllFields = () => {
  selectedFields.value = availableFields.value.map((field) => field.key);
};

const deselectAllFields = () => {
  selectedFields.value = [];
};

const getFieldLabel = (fieldKey) => {
  const field = availableFields.value.find((f) => f.key === fieldKey);
  return field ? field.label : fieldKey;
};

const formatFieldValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const generatePreview = async () => {
  if (!selectedDataType.value || selectedFields.value.length === 0) return;

  loading.value = true;
  try {
    let response;

    if (selectedDataType.value === "users") {
      response = await userApi.getAll();
    } else if (selectedDataType.value === "children") {
      response = await childUserApi.getAll();
    } else if (selectedDataType.value === "events") {
      // Apply date range filter for events
      let url = "";
      if (dateRange.start || dateRange.end) {
        const params = new URLSearchParams();
        if (dateRange.start) params.append("startDate", dateRange.start);
        if (dateRange.end) params.append("endDate", dateRange.end);
        url = `?${params.toString()}`;
      }
      response = await eventApi.getAll(url);
    }

    let data = response.data?.data || response.data || [];

    // Filter inactive records if not included
    if (!exportOptions.includeInactive && selectedDataType.value !== "events") {
      data = data.filter((record) => record.isActive !== false);
    }

    previewData.value = data;
    totalRecords.value = data.length;
  } catch (error) {
    console.error("Error generating preview:", error);
    emit("export-error", {
      message: "Failed to generate preview",
    });
  } finally {
    loading.value = false;
  }
};

const exportData = async () => {
  if (!selectedDataType.value || selectedFields.value.length === 0) return;

  exporting.value = true;
  exportProgress.value = 0;

  try {
    // Generate preview if not already done
    if (previewData.value.length === 0) {
      await generatePreview();
    }

    const data = previewData.value;
    const csvRows = [];

    // Add headers if enabled
    if (exportOptions.includeHeaders) {
      const headers = selectedFields.value.map((field) => getFieldLabel(field));
      csvRows.push(headers);
    }

    // Add data rows
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const row = selectedFields.value.map((field) => {
        const value = formatFieldValue(record[field]);
        // Escape quotes and wrap in quotes if contains comma or quote
        if (
          value.includes('"') ||
          value.includes(",") ||
          value.includes("\n")
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(row);

      // Update progress
      exportProgress.value = Math.round(((i + 1) / data.length) * 100);

      // Small delay to prevent UI blocking
      if (i % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
    }

    // Create CSV content
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${selectedDataType.value}_export_${timestamp}.csv`;

    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);

    // Emit success event
    emit("export-success", {
      fileName: filename,
      recordCount: data.length,
      type: selectedDataType.value,
    });
  } catch (error) {
    console.error("Export error:", error);
    emit("export-error", {
      message: error.message || "Export failed",
    });
  } finally {
    exporting.value = false;
    exportProgress.value = 0;
  }
};

// Watch for data type changes
watch(selectedDataType, (newType) => {
  if (newType) {
    // Select common fields by default
    const commonFields = ["_id", "firstName", "lastName"];
    if (newType === "events") {
      selectedFields.value = ["aid", "Timestamp", "HeartRate", "Temperature"];
    } else {
      selectedFields.value = availableFields.value
        .filter((field) => commonFields.includes(field.key))
        .map((field) => field.key);
    }

    // Clear preview
    previewData.value = [];
    totalRecords.value = 0;
  }
});
</script>
