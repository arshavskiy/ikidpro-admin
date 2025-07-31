<template>
  <Modal
    :isVisible="isVisible"
    :title="title"
    :type="type"
    :showConfirm="true"
    :showCancel="true"
    :confirmText="confirmText"
    :cancelText="cancelText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <template #content>
      <div class="space-y-4">
        <!-- Action Description -->
        <div v-if="description" class="text-sm text-gray-600">
          {{ description }}
        </div>

        <!-- Action-specific content -->
        <div
          v-if="actionType === 'bulk-delete'"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-red-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Warning: Bulk Delete Operation
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>
                  You are about to delete
                  {{ selectedItems?.length || 0 }} items. This action cannot be
                  undone.
                </p>
                <ul
                  v-if="selectedItems?.length <= 5"
                  class="mt-2 list-disc list-inside"
                >
                  <li v-for="item in selectedItems" :key="item.id || item._id">
                    {{
                      item.name ||
                      `${item.firstName} ${item.lastName}` ||
                      item.title ||
                      item.id
                    }}
                  </li>
                </ul>
                <p v-else-if="selectedItems?.length > 5" class="mt-2">
                  And {{ selectedItems.length - 5 }} more items...
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="actionType === 'export'" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Export Format</label
            >
            <select
              v-model="exportFormat"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Include Fields</label
            >
            <div class="mt-2 space-y-2">
              <div
                v-for="field in availableFields"
                :key="field.key"
                class="flex items-center"
              >
                <input
                  :id="`field-${field.key}`"
                  v-model="selectedFields"
                  :value="field.key"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  :for="`field-${field.key}`"
                  class="ml-2 block text-sm text-gray-900"
                >
                  {{ field.label }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="actionType === 'import'" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Import File</label
            >
            <input
              type="file"
              @change="handleFileSelect"
              accept=".csv,.json,.xlsx"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div v-if="selectedFile" class="text-sm text-gray-600">
            Selected: {{ selectedFile.name }} ({{
              formatFileSize(selectedFile.size)
            }})
          </div>
        </div>

        <div v-else-if="actionType === 'api-test'" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >API Endpoint</label
            >
            <select
              v-model="selectedEndpoint"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select an endpoint...</option>
              <option
                v-for="endpoint in apiEndpoints"
                :key="endpoint.path"
                :value="endpoint"
              >
                {{ endpoint.method }} {{ endpoint.path }} -
                {{ endpoint.description }}
              </option>
            </select>
          </div>
          <div
            v-if="
              selectedEndpoint?.method === 'POST' ||
              selectedEndpoint?.method === 'PUT'
            "
          >
            <label class="block text-sm font-medium text-gray-700"
              >Request Body (JSON)</label
            >
            <textarea
              v-model="requestBody"
              rows="4"
              placeholder='{"key": "value"}'
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
            ></textarea>
          </div>
        </div>

        <!-- Custom content slot -->
        <slot name="action-content"></slot>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import Modal from "./Modal.vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Quick Action",
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "info",
  },
  actionType: {
    type: String,
    required: true,
    validator: (value) =>
      ["bulk-delete", "export", "import", "api-test", "custom"].includes(value),
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  availableFields: {
    type: Array,
    default: () => [],
  },
  apiEndpoints: {
    type: Array,
    default: () => [],
  },
  confirmText: {
    type: String,
    default: "Execute",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
});

const emit = defineEmits(["confirm", "cancel", "close"]);

// Export-related data
const exportFormat = ref("csv");
const selectedFields = ref([]);

// Import-related data
const selectedFile = ref(null);

// API test-related data
const selectedEndpoint = ref(null);
const requestBody = ref("{}");

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleConfirm = () => {
  const data = {
    actionType: props.actionType,
    selectedItems: props.selectedItems,
  };

  // Add action-specific data
  switch (props.actionType) {
    case "export":
      data.format = exportFormat.value;
      data.fields = selectedFields.value;
      break;
    case "import":
      data.file = selectedFile.value;
      break;
    case "api-test":
      data.endpoint = selectedEndpoint.value;
      data.body = requestBody.value;
      break;
  }

  emit("confirm", data);
};

const handleCancel = () => {
  // Reset form data
  exportFormat.value = "csv";
  selectedFields.value = [];
  selectedFile.value = null;
  selectedEndpoint.value = null;
  requestBody.value = "{}";

  emit("cancel");
  emit("close");
};
</script>
