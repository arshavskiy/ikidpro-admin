<template>
  <Modal
    :isVisible="isVisible"
    :title="title"
    :type="type"
    :showConfirm="true"
    :showCancel="true"
    :confirmText="confirmText"
    :cancelText="cancelText"
    @confirm="handleSubmit"
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <template #content>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <slot name="form-content">
          <!-- Default form content -->
          <div v-for="field in fields" :key="field.name" class="space-y-2">
            <!-- Text Input -->
            <div
              v-if="
                field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'password'
              "
            >
              <label
                :for="field.name"
                class="block text-sm font-medium text-gray-700"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <input
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type"
                :placeholder="field.placeholder"
                :required="field.required"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Number Input -->
            <div v-else-if="field.type === 'number'">
              <label
                :for="field.name"
                class="block text-sm font-medium text-gray-700"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <input
                :id="field.name"
                v-model.number="formData[field.name]"
                type="number"
                :min="field.min"
                :max="field.max"
                :step="field.step"
                :placeholder="field.placeholder"
                :required="field.required"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Date Input -->
            <div v-else-if="field.type === 'date'">
              <label
                :for="field.name"
                class="block text-sm font-medium text-gray-700"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <input
                :id="field.name"
                v-model="formData[field.name]"
                type="date"
                :required="field.required"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Select Input -->
            <div v-else-if="field.type === 'select'">
              <label
                :for="field.name"
                class="block text-sm font-medium text-gray-700"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <select
                :id="field.name"
                v-model="formData[field.name]"
                :required="field.required"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">
                  {{ field.placeholder || "Select an option" }}
                </option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'">
              <label
                :for="field.name"
                class="block text-sm font-medium text-gray-700"
              >
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <textarea
                :id="field.name"
                v-model="formData[field.name]"
                :rows="field.rows || 3"
                :placeholder="field.placeholder"
                :required="field.required"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'">
              <div class="flex items-center">
                <input
                  :id="field.name"
                  v-model="formData[field.name]"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  :for="field.name"
                  class="ml-2 block text-sm text-gray-900"
                >
                  {{ field.label }}
                </label>
              </div>
            </div>
          </div>
        </slot>
      </form>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import Modal from "./Modal.vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Form",
  },
  type: {
    type: String,
    default: "info",
  },
  fields: {
    type: Array,
    default: () => [],
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  confirmText: {
    type: String,
    default: "Save",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
});

const emit = defineEmits(["submit", "cancel", "close"]);

const formData = ref({});

// Initialize form data
const initializeForm = () => {
  const data = { ...props.initialData };

  // Initialize with default values for fields
  props.fields.forEach((field) => {
    if (!(field.name in data)) {
      if (field.type === "checkbox") {
        data[field.name] = false;
      } else if (field.type === "number") {
        data[field.name] = field.default || 0;
      } else {
        data[field.name] = field.default || "";
      }
    }
  });

  formData.value = data;
};

// Watch for changes in initialData
watch(
  () => props.initialData,
  () => {
    initializeForm();
  },
  { immediate: true, deep: true }
);

// Watch for changes in fields
watch(
  () => props.fields,
  () => {
    initializeForm();
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", { ...formData.value });
};

const handleCancel = () => {
  emit("cancel");
  emit("close");
};
</script>

<style scoped>
/* Custom styles for form elements */
.form-group {
  margin-bottom: 1rem;
}
</style>
