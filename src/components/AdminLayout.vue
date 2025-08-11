<template>
  <div
    class="main_screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
  >
    <div class="flex flex-1 main_layout">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg">
        <div class="p-5">
          <h1 class="text-xl font-bold text-gray-800">IKidPro Admin</h1>
        </div>

        <!-- Navigation Menu -->
        <div class="mt-4">
          <n-menu
            :value="selectedKey"
            :options="menuOptions"
            @update:value="handleMenuSelect"
            :default-expand-all="true"
            :accordion="false"
            :indent="24"
            class="admin-menu"
          />

          <div class="logout-button">
            <n-button
              @click="logout"
              type="error"
              size="small"
              class="w-full mt-4"
            >
              <template #icon>
                <i class="fas fa-sign-out-alt"></i>
              </template>
              Logout
            </n-button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-6 py-4">
            <div class="flex items-center justify-end space-x-4">
              <span class="text-sm text-gray-600">
                Welcome, {{ user?.firstName || "Admin" }}</span
              >
              <div
                class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-user text-white text-xs"></i>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { NMenu, NButton } from "naive-ui";
import { menuOptions } from "../models/models";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const user = computed(() => userStore.user);

// Selected menu key based on current route
const selectedKey = computed(() => route.path);

// Handle menu selection
const handleMenuSelect = (key) => {
  if (key.startsWith("/admin/")) {
    router.push(key);
  }
};

// Computed page title and description based on current route

const logout = async () => {
  await userStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.logout-button {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 0 16px;
}

/* Custom styling for admin menu */
:deep(.admin-menu) {
  --n-item-height: 32px !important;
  --n-item-text-color: #6b7280;
  --n-item-text-color-hover: #1d4ed8;
  --n-item-text-color-active: #1d4ed8;
  --n-item-color-hover: #dbeafe;
  --n-item-color-active: #dbeafe;
  --n-arrow-color: #6b7280;
  --n-arrow-color-hover: #1d4ed8;
  --n-arrow-color-active: #1d4ed8;
}

:deep(.admin-menu .n-menu-item-content) {
  padding-left: 16px !important;
}

:deep(.admin-menu .n-menu-item-content .n-menu-item-content__icon) {
  margin-right: 8px;
}

:deep(.admin-menu .n-menu-item-content .n-menu-item-content__icon i) {
  font-size: 12px;
}

:deep(.admin-menu .n-submenu-children .n-menu-item-content) {
  padding-left: 40px !important;
}

/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: #f1f1f1;
}

nav::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
