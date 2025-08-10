<template>
  <div class="space-y-4">
    <!-- File Upload Area -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
      :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
    >
      <div v-if="!selectedFile">
        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
        <p class="text-lg font-medium text-gray-700 mb-2">
          Drop your CSV file here
        </p>
        <p class="text-sm text-gray-500 mb-4">
          or click to browse and select a file
        </p>
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="hidden"
        />
        <button
          @click="$refs.fileInput.click()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Select CSV File
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center justify-center space-x-3">
          <i class="fas fa-file-csv text-3xl text-green-600"></i>
          <div class="text-left">
            <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>
        <button
          @click="clearFile"
          class="text-sm text-red-600 hover:text-red-800"
        >
          Remove file
        </button>
      </div>
    </div>

    <!-- Data Type Selection -->
    <div v-if="selectedFile">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Data Type <span class="text-red-500">*</span>
      </label>
      <select
        v-model="selectedDataType"
        @change="onDataTypeChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select data type</option>
        <option value="users">Users</option>
        <option value="children">Children</option>
        <option value="events">Events</option>
      </select>
    </div>

    <!-- Child Selector (for Events that need child association) -->
    <div v-if="selectedFile && selectedDataType === 'events'">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Select Child <span class="text-red-500">*</span>
      </label>
      <select
        v-model="selectedChildId"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :disabled="loadingChildren"
      >
        <option value="">
          {{ loadingChildren ? "Loading children..." : "Select a child" }}
        </option>
        <option
          v-for="child in childrenList"
          :key="child.aid"
          :value="child.aid"
        >
          {{ child.firstName }} {{ child.lastName }} (ID: {{ child.aid }})
        </option>
      </select>
      <p class="text-xs text-gray-500 mt-1">
        This child will be associated with all imported events
      </p>
    </div>

    <!-- Import Options -->
    <div v-if="selectedFile && selectedDataType">
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">Import Options</h4>

        <label class="flex items-center">
          <input
            v-model="importOptions.skipFirstRow"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700"
            >Skip first row (headers)</span
          >
        </label>

        <label class="flex items-center">
          <input
            v-model="importOptions.validateData"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700"
            >Validate data before import</span
          >
        </label>

        <label class="flex items-center">
          <input
            v-model="importOptions.updateExisting"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700"
            >Update existing records</span
          >
        </label>
      </div>
    </div>

    <!-- Field Mapping -->
    <div
      v-if="selectedFile && selectedDataType && csvPreview.length > 0"
      class="space-y-3"
    >
      <h4 class="text-sm font-medium text-gray-700">Field Mapping</h4>
      <p class="text-xs text-gray-500">Map CSV columns to database fields</p>

      <div
        class="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 max-h-100 overflow-y-auto"
      >
        <div
          v-for="(csvField, index) in csvHeaders"
          :key="index"
          class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">
              CSV Column: "{{ csvField }}"
            </label>
            <select
              v-model="fieldMapping[csvField]"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Skip this field --</option>
              <option
                v-for="dbField in availableDbFields"
                :key="dbField.key"
                :value="dbField.key"
              >
                {{ dbField.label }}
              </option>
            </select>
          </div>
          <div class="flex-shrink-0">
            <input
              type="checkbox"
              :checked="fieldMapping[csvField] && fieldMapping[csvField] !== ''"
              @change="toggleFieldMapping(csvField, $event.target.checked)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex">
        <NButton type="success" class="mr-2" @click="autoMapFields">
          Auto-Map Similar Names
        </NButton>
        <NButton type="success" class="mr-2" @click="clearAllMappings">
          Clear All Mappings
        </NButton>
        <NButton type="success" @click="mapAllFields"> Map All Fields </NButton>
      </div>

      <!-- Mapping Summary -->
      <div class="text-xs text-gray-600">
        Mapped: {{ mappedFieldsCount }} / {{ csvHeaders.length }} fields
      </div>
    </div>

    <!-- Preview -->
    <div v-if="csvPreview.length > 0" class="space-y-4 rounded">
      <h4 class="text-sm font-medium text-gray-700">Preview</h4>
      <div
        class="overflow-x-auto border border-gray-200 overflow-y-auto max-h-110"
      >
        <table class="min-w-full divide-y divide-gray-200 max-h-110">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="(header, index) in csvHeaders"
                :key="index"
                class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="{
                  'bg-green-100':
                    fieldMapping[header] && fieldMapping[header] !== '',
                }"
              >
                {{ header }}
                <div
                  v-if="fieldMapping[header]"
                  class="text-xs text-green-600 font-normal"
                >
                  → {{ getDbFieldLabel(fieldMapping[header]) }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(row, rowIndex) in csvDataRows"
              :key="rowIndex"
              class="hover:bg-gray-50"
            >
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                :class="{
                  'bg-green-50':
                    fieldMapping[csvHeaders[cellIndex]] &&
                    fieldMapping[csvHeaders[cellIndex]] !== '',
                }"
                :title="cell"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-sm text-gray-500">
        Total rows: {{ csvDataRows.length }}
        <span v-if="mappedFieldsCount > 0" class="text-green-600">
          ({{ mappedFieldsCount }} fields mapped)
        </span>
      </p>
    </div>

    <!-- Import Button -->
    <div
      v-if="selectedFile && selectedDataType"
      class="flex justify-end space-x-3"
    >
      <button
        @click="previewCsv"
        :disabled="loading"
        class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
      >
        <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
        Preview Data
      </button>
      <button
        @click="importCsv"
        :disabled="
          loading ||
          csvPreview.length === 0 ||
          (selectedDataType === 'events' && !selectedChildId)
        "
        class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
        Import Data ({{ mappedFieldsCount }} fields mapped)
      </button>
    </div>

    <!-- Progress Bar -->
    <div v-if="importing" class="space-y-2">
      <div class="flex justify-between text-sm text-gray-600">
        <span>Importing...</span>
        <span>{{ importProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: importProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="errors.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-red-700">Import Errors</h4>
      <div
        class="max-h-32 overflow-y-auto bg-red-50 border border-red-200 rounded p-3"
      >
        <div
          v-for="(error, index) in errors"
          :key="index"
          class="text-sm text-red-600 mb-1"
        >
          Row {{ error.row }}: {{ error.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import * as userApi from "../../services/userApi";
import * as childUserApi from "../../services/childUserApi";
import * as eventApi from "../../services/eventApi";

const emit = defineEmits(["import-success", "import-error"]);

// Reactive data
const selectedFile = ref(null);
const selectedDataType = ref("");
const selectedChildId = ref("");
const childrenList = ref([]);
const loadingChildren = ref(false);
const csvPreview = ref([]);
const fieldMapping = ref({});
const loading = ref(false);
const importing = ref(false);
const importProgress = ref(0);
const errors = ref([]);
const isDragOver = ref(false);

const importOptions = reactive({
  skipFirstRow: true,
  validateData: true,
  updateExisting: false,
});

// Field definitions (same as CsvExporter)
const fieldDefinitions = {
  users: [
    { key: "firstName", label: "First Name", value: "firstName" },
    { key: "lastName", label: "Last Name", value: "lastName" },
    { key: "email", label: "Email", value: "email" },
    { key: "phone", label: "Phone", value: "phone" },
    { key: "role", label: "Role", value: "role" },
    { key: "isActive", label: "Active", value: "isActive" },
  ],
  children: [
    { key: "firstName", label: "First Name", value: "firstName" },
    { key: "lastName", label: "Last Name", value: "lastName" },
    { key: "dateOfBirth", label: "Date of Birth", value: "dateOfBirth" },
    { key: "gender", label: "Gender", value: "gender" },
    { key: "parentId", label: "Parent ID", value: "parentId" },
    { key: "isActive", label: "Active", value: "isActive" },
    { key: "aid", label: "App ID", value: "aid" },
  ],
  events: [
    { key: "parentId", label: "Parent ID", value: "parentId" },
    { key: "aid", label: "Child ID", value: "aid" },
    { key: "Timestamp", label: "Timestamp", value: "Timestamp" },
    { key: "HeartRate", label: "Heart Rate", value: "HeartRate" },
    { key: "HRV", label: "Heart Rate Variability", value: "HRV" },
    { key: "Sp02", label: "SpO2", value: "Sp02" },
    { key: "AccelX", label: "Accelerometer X", value: "AccelX" },
    { key: "AccelY", label: "Accelerometer Y", value: "AccelY" },
    { key: "AccelZ", label: "Accelerometer Z", value: "AccelZ" },
    { key: "GyroX", label: "Gyroscope X", value: "GyroX" },
    { key: "GyroY", label: "Gyroscope Y", value: "GyroY" },
    { key: "GyroZ", label: "Gyroscope Z", value: "GyroZ" },
    { key: "EDA", label: "Electrodermal Activity", value: "EDA" },
    { key: "Temperature", label: "Temperature", value: "Temperature" },
    { key: "scl", label: "SCL", value: "scl" },
    { key: "scr", label: "SCR", value: "scr" },
    {
      key: "respiratoryRate",
      label: "Respiratory Rate",
      value: "respiratoryRate",
    },
    { key: "humidity", label: "Humidity", value: "humidity" },
    { key: "SoundLevel", label: "Sound Level (dB)", value: "SoundLevel" },
    { key: "latitude", label: "GPS Latitude", value: "latitude" },
    { key: "longitude", label: "GPS Longitude", value: "longitude" },
    { key: "altitude", label: "GPS Altitude", value: "altitude" },
    { key: "speed_mps", label: "Speed (m/s)", value: "speed_mps" },
    { key: "bearing_deg", label: "Bearing (degrees)", value: "bearing_deg" },
    { key: "accuracy_m", label: "GPS Accuracy (m)", value: "accuracy_m" },
    { key: "satellites", label: "Satellites", value: "satellites" },
    { key: "steps", label: "Steps", value: "steps" },
    { key: "calories", label: "Calories", value: "calories" },
    { key: "speed", label: "Speed", value: "speed" },
    { key: "magneticX", label: "Magnetometer X", value: "magneticX" },
    { key: "magneticY", label: "Magnetometer Y", value: "magneticY" },
    { key: "magneticZ", label: "Magnetometer Z", value: "magneticZ" },
    { key: "pressure", label: "Pressure", value: "pressure" },
    { key: "light", label: "Light Level", value: "light" },
    // Legacy field for backwards compatibility
    { key: "Temperature", label: "Temperature (Legacy)", value: "Temperature" },
  ],
};

// Computed properties
const csvHeaders = computed(() => {
  return csvPreview.value.length > 0 && importOptions.skipFirstRow
    ? csvPreview.value[0]
    : [];
});

const csvDataRows = computed(() => {
  return csvPreview.value.length > 0 && importOptions.skipFirstRow
    ? csvPreview.value.slice(1)
    : csvPreview.value;
});

const availableDbFields = computed(() => {
  return fieldDefinitions[selectedDataType.value] || [];
});

const mappedFieldsCount = computed(() => {
  return Object.values(fieldMapping.value).filter(
    (mapping) => mapping && mapping !== ""
  ).length;
});

// Watchers
watch(selectedChildId, async (newChildId) => {
  // Refresh preview when child selection changes (for events)
  if (
    selectedDataType.value === "events" &&
    selectedFile.value &&
    csvPreview.value.length > 0
  ) {
    await previewCsv();
  }
});

// Field mapping methods
const getDbFieldLabel = (fieldKey) => {
  const field = availableDbFields.value.find((f) => f.key === fieldKey);
  return field ? field.value : fieldKey;
};

const toggleFieldMapping = (csvField, isChecked) => {
  if (!isChecked) {
    fieldMapping.value[csvField] = "";
  }
};

const autoMapFields = () => {
  csvHeaders.value.forEach((csvField) => {
    const normalizedCsvField = csvField.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchingDbField = availableDbFields.value.find((dbField) => {
      const normalizedDbField = dbField.key
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      return (
        normalizedDbField === normalizedCsvField ||
        normalizedDbField.includes(normalizedCsvField) ||
        normalizedCsvField.includes(normalizedDbField)
      );
    });

    if (matchingDbField) {
      fieldMapping.value[csvField] = matchingDbField.key;
    }
  });
};

const clearAllMappings = () => {
  fieldMapping.value = {};
};

const mapAllFields = () => {
  csvHeaders.value.forEach((csvField, index) => {
    if (index < availableDbFields.value.length) {
      fieldMapping.value[csvField] = availableDbFields.value[index].key;
    }
  });
};

// Methods
const onDataTypeChange = async () => {
  // Reset child selection when data type changes
  selectedChildId.value = "";

  // Load children list if events is selected
  if (selectedDataType.value === "events") {
    await loadChildren();
  }
};

const loadChildren = async () => {
  loadingChildren.value = true;
  try {
    const response = await childUserApi.getAllChildUsers();
    childrenList.value = response.data.data || [];

    // If there's only one child, auto-select it
    if (childrenList.value.length === 1) {
      selectedChildId.value = childrenList.value[0].aid;
    }
  } catch (error) {
    console.error("Error loading children:", error);
    childrenList.value = [];
  } finally {
    loadingChildren.value = false;
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].type === "text/csv") {
    selectedFile.value = files[0];
    csvPreview.value = [];
    errors.value = [];
  }
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
    csvPreview.value = [];
    errors.value = [];
  }
};

const clearFile = () => {
  selectedFile.value = null;
  csvPreview.value = [];
  selectedDataType.value = "";
  selectedChildId.value = "";
  childrenList.value = [];
  fieldMapping.value = {};
  errors.value = [];
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const parseCSV = (text) => {
  const lines = text.split("\n");
  const result = [];

  for (let line of lines) {
    line = line.trim();
    if (line) {
      // Simple CSV parsing - handles quoted fields
      const row = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && !inQuotes) {
          inQuotes = true;
        } else if (char === '"' && inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else if (char === '"' && inQuotes) {
          inQuotes = false;
        } else if (char === "," && !inQuotes) {
          row.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }

      row.push(current.trim());
      result.push(row);
    }
  }

  return result;
};

const previewCsv = async () => {
  if (!selectedFile.value) return;

  loading.value = true;
  errors.value = [];

  try {
    const text = await selectedFile.value.text();
    let parsedData = parseCSV(text);

    // If we're importing events and have a selected child, add aid column if missing
    if (
      selectedDataType.value === "events" &&
      selectedChildId.value &&
      parsedData.length > 0
    ) {
      const headers = parsedData[0];
      const aidIndex = headers.findIndex(
        (header) => header.toLowerCase() === "aid"
      );
      const parentIdIndex = headers.findIndex(
        (header) => header.toLowerCase() === "parentid"
      );

      // Get the selected child's parent ID
      const selectedChild = childrenList.value.find(
        (child) => child.aid === selectedChildId.value
      );
      const parentId = selectedChild ? selectedChild.parentId : null;

      // If aid column doesn't exist, add it
      if (aidIndex === -1) {
        // Add 'aid' to headers
        headers.push("aid");

        // Add selected child ID to all data rows
        for (let i = 1; i < parsedData.length; i++) {
          parsedData[i].push(selectedChildId.value);
        }
      } else {
        // If aid column exists but has empty values, fill with selected child ID
        for (let i = 1; i < parsedData.length; i++) {
          if (
            !parsedData[i][aidIndex] ||
            parsedData[i][aidIndex].trim() === ""
          ) {
            parsedData[i][aidIndex] = selectedChildId.value;
          }
        }
      }

      // If parentId column doesn't exist and we have a parent ID, add it
      if (parentIdIndex === -1 && parentId) {
        // Add 'parentId' to headers
        headers.push("parentId");

        // Add parent ID to all data rows
        for (let i = 1; i < parsedData.length; i++) {
          parsedData[i].push(parentId);
        }
      } else if (parentIdIndex !== -1 && parentId) {
        // If parentId column exists but has empty values, fill with parent ID
        for (let i = 1; i < parsedData.length; i++) {
          if (
            !parsedData[i][parentIdIndex] ||
            parsedData[i][parentIdIndex].trim() === ""
          ) {
            parsedData[i][parentIdIndex] = parentId;
          }
        }
      }
    }

    csvPreview.value = parsedData;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    errors.value = [{ row: 0, message: "Failed to parse CSV file" }];
  } finally {
    loading.value = false;
  }
};

const validateRow = (row, headers, dataType) => {
  const errors = [];

  if (dataType === "users") {
    // Validate user data
    if (
      !row[headers.indexOf("email")] ||
      !row[headers.indexOf("email")].includes("@")
    ) {
      errors.push("Invalid email address");
    }
    if (!row[headers.indexOf("firstName")]) {
      errors.push("First name is required");
    }
    if (!row[headers.indexOf("lastName")]) {
      errors.push("Last name is required");
    }
  } else if (dataType === "children") {
    // Validate children data
    if (!row[headers.indexOf("firstName")]) {
      errors.push("First name is required");
    }
    if (!row[headers.indexOf("lastName")]) {
      errors.push("Last name is required");
    }
    if (!row[headers.indexOf("dateOfBirth")]) {
      errors.push("Date of birth is required");
    }
  } else if (dataType === "events") {
    // Validate event data
    if (!row[headers.indexOf("Timestamp")]) {
      errors.push("Timestamp is required");
    }
  }

  return errors;
};

const importCsv = async () => {
  if (
    !selectedFile.value ||
    !selectedDataType.value ||
    csvPreview.value.length === 0
  ) {
    return;
  }

  // Additional validation for events
  if (selectedDataType.value === "events" && !selectedChildId.value) {
    errors.value = [
      { row: 0, message: "Please select a child for event data import" },
    ];
    return;
  }

  importing.value = true;
  importProgress.value = 0;
  errors.value = [];

  try {
    const data = csvPreview.value;
    const headers = data[0];
    const rows = importOptions.skipFirstRow ? data.slice(1) : data;

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + (importOptions.skipFirstRow ? 2 : 1);

      try {
        // Validate if enabled
        if (importOptions.validateData) {
          const rowErrors = validateRow(row, headers, selectedDataType.value);
          if (rowErrors.length > 0) {
            errors.value.push({
              row: rowNumber,
              message: rowErrors.join(", "),
              data: row.join(", "),
            });
            errorCount++;
            continue;
          }
        }

        // Convert row to object using field mappings
        const record = {};
        headers.forEach((header, index) => {
          const dbField = fieldMapping.value[header];
          if (dbField && dbField !== "") {
            const value = row[index];
            if (value !== undefined && value !== "") {
              record[dbField] = value;
            }
          }
        });

        // Only import if we have mapped fields
        if (Object.keys(record).length === 0) {
          errors.value.push({
            row: rowNumber,
            message: "No mapped fields found for this row",
            data: row.join(", "),
          });
          errorCount++;
          continue;
        }

        // Import based on data type
        if (selectedDataType.value === "users") {
          await userApi.create(record);
        } else if (selectedDataType.value === "children") {
          await childUserApi.create(record);
        } else if (selectedDataType.value === "events") {
          const selectedChild = childrenList.value.find(
            (child) => child.aid === selectedChildId.value
          );

          // Get the selected child's parent ID
          const parentId = selectedChild ? selectedChild.parentId : null;

          // For events, ensure the selected child ID and parent ID are used
          const eventRecord = {
            ...record,
            aid: selectedChildId.value, // Override aid with selected child ID
            parentId: parentId, // Add parent ID from selected child
          };
          await eventApi.create(eventRecord);
        }

        successCount++;
      } catch (error) {
        console.error(`Error importing row ${rowNumber}:`, error);
        errors.value.push({
          row: rowNumber,
          message:
            error.response?.data?.error || error.message || "Import failed",
          data: row.join(", "),
        });
        errorCount++;
      }

      // Update progress
      importProgress.value = Math.round(((i + 1) / rows.length) * 100);

      // Small delay to prevent overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // Emit success event
    emit("import-success", {
      fileName: selectedFile.value.name,
      type: selectedDataType.value,
      recordsProcessed: successCount,
      errors: errors.value,
    });

    // Clear form if successful
    if (errorCount === 0) {
      clearFile();
    }
  } catch (error) {
    console.error("Import error:", error);
    emit("import-error", {
      message: error.message || "Import failed",
    });
  } finally {
    importing.value = false;
    importProgress.value = 0;
  }
};

// Drag and drop event handlers
const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};
</script>
