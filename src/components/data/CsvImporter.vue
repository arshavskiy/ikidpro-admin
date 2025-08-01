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
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select data type</option>
        <option value="users">Users</option>
        <option value="children">Children</option>
        <option value="events">Events</option>
      </select>
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
        class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto"
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
      <div class="flex space-x-2">
        <button
          @click="autoMapFields"
          class="text-xs text-blue-600 hover:text-blue-800"
        >
          Auto-Map Similar Names
        </button>
        <button
          @click="clearAllMappings"
          class="text-xs text-gray-600 hover:text-gray-800"
        >
          Clear All Mappings
        </button>
        <button
          @click="mapAllFields"
          class="text-xs text-green-600 hover:text-green-800"
        >
          Map All Fields
        </button>
      </div>

      <!-- Mapping Summary -->
      <div class="text-xs text-gray-600">
        Mapped: {{ mappedFieldsCount }} / {{ csvHeaders.length }} fields
      </div>
    </div>

    <!-- Preview -->
    <div v-if="csvPreview.length > 0" class="space-y-4">
      <h4 class="text-sm font-medium text-gray-700">Preview (First 5 rows)</h4>
      <div class="overflow-x-auto border border-gray-200 rounded">
        <table class="min-w-full divide-y divide-gray-200">
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
              v-for="(row, rowIndex) in csvDataRows.slice(0, 5)"
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
          loading || csvPreview.length === 0 || mappedFieldsCount === 0
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
import { ref, reactive, computed } from "vue";
import * as userApi from "../../services/userApi";
import * as childUserApi from "../../services/childUserApi";
import * as eventApi from "../../services/eventApi";

const emit = defineEmits(["import-success", "import-error"]);

// Reactive data
const selectedFile = ref(null);
const selectedDataType = ref("");
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
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "isActive", label: "Active" },
  ],
  children: [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "parentId", label: "Parent ID" },
    { key: "isActive", label: "Active" },
  ],
  events: [
    { key: "aid", label: "Child ID" },
    { key: "Timestamp", label: "Timestamp" },
    { key: "HeartRate", label: "Heart Rate" },
    { key: "HRV", label: "HRV" },
    { key: "TemperatureC", label: "Temperature (°C)" },
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

// Field mapping methods
const getDbFieldLabel = (fieldKey) => {
  const field = availableDbFields.value.find((f) => f.key === fieldKey);
  return field ? field.label : fieldKey;
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
    csvPreview.value = parseCSV(text);
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
    if (!row[headers.indexOf("aid")]) {
      errors.push("Child ID is required");
    }
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
          await eventApi.create(record);
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
