<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <!-- Icon -->
            <div
              v-if="type"
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="iconClasses"
            >
              <i :class="iconType" class="text-xl"></i>
            </div>

            <!-- Content -->
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                v-if="title"
              >
                {{ title }}
              </h3>
              <div class="mt-2">
                <slot name="content">
                  <p class="text-sm text-gray-500" v-if="message">
                    {{ message }}
                  </p>
                </slot>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <slot name="actions">
            <!-- Default actions -->
            <button
              v-if="showConfirm"
              @click="$emit('confirm')"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              :class="confirmButtonClasses"
            >
              {{ confirmText }}
            </button>

            <button
              v-if="showCancel"
              @click="$emit('cancel')"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ cancelText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "info", // info, warning, error, success, question
    validator: (value) =>
      ["info", "warning", "error", "success", "question"].includes(value),
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["confirm", "cancel", "close"]);

const iconClasses = computed(() => {
  const classes = {
    info: "bg-blue-100",
    warning: "bg-yellow-100",
    error: "bg-red-100",
    success: "bg-green-100",
    question: "bg-purple-100",
  };
  return classes[props.type] || classes.info;
});

const iconType = computed(() => {
  const icons = {
    info: "fas fa-info-circle text-blue-600",
    warning: "fas fa-exclamation-triangle text-yellow-600",
    error: "fas fa-times-circle text-red-600",
    success: "fas fa-check-circle text-green-600",
    question: "fas fa-question-circle text-purple-600",
  };
  return icons[props.type] || icons.info;
});

const confirmButtonClasses = computed(() => {
  const classes = {
    info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    error: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    question: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
  };
  return classes[props.type] || classes.info;
});

const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    emit("close");
  }
};
</script>

<style scoped>
/* Custom animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
