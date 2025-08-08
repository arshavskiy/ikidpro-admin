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
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600"
                >Welcome, {{ user?.firstName || "Admin" }}</span
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

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const user = computed(() => userStore.user);

// Selected menu key based on current route
const selectedKey = computed(() => route.path);

// Menu options for Naive UI
const menuOptions = [
  {
    label: "Analytics",
    key: "analytics",
    icon: () => h("i", { class: "fas fa-chart-bar" }),
    children: [
      {
        label: "Event Statistics",
        key: "/admin/analytics/events",
        icon: () => h("i", { class: "fas fa-chart-bar" }),
      },
    ],
  },
  {
    label: "Parent Management",
    key: "users",
    icon: () => h("i", { class: "fas fa-users" }),
    children: [
      {
        label: "All Parents",
        key: "/admin/users",
        icon: () => h("i", { class: "fas fa-list" }),
      },
      {
        label: "Add Parent User",
        key: "/admin/users/create",
        icon: () => h("i", { class: "fas fa-plus" }),
      },
      {
        label: "User Profiles",
        key: "/admin/users/profiles",
        icon: () => h("i", { class: "fas fa-id-card" }),
      },
    ],
  },
  {
    label: "Child Management",
    key: "children",
    icon: () => h("i", { class: "fas fa-child" }),
    children: [
      {
        label: "All Children",
        key: "/admin/children",
        icon: () => h("i", { class: "fas fa-list" }),
      },
      {
        label: "Add Child",
        key: "/admin/children/create",
        icon: () => h("i", { class: "fas fa-plus" }),
      },
      {
        label: "By Parent",
        key: "/admin/children/by-parent",
        icon: () => h("i", { class: "fas fa-family" }),
      },
    ],
  },
  {
    label: "Event Management",
    key: "events",
    icon: () => h("i", { class: "fas fa-chart-line" }),
    children: [
      {
        label: "All Events",
        key: "/admin/events",
        icon: () => h("i", { class: "fas fa-list" }),
      },
      {
        label: "Add Event",
        key: "/admin/events/create",
        icon: () => h("i", { class: "fas fa-plus" }),
      },
      {
        label: "By Child",
        key: "/admin/events/by-child",
        icon: () => h("i", { class: "fas fa-child" }),
      },
    ],
  },
  {
    label: "Data Management",
    key: "data",
    icon: () => h("i", { class: "fas fa-database" }),
    children: [
      {
        label: "Data Import",
        key: "/admin/data/management",
        icon: () => h("i", { class: "fas fa-file-upload" }),
      },
      {
        label: "Data Export",
        key: "/admin/data/export",
        icon: () => h("i", { class: "fas fa-file-download" }),
      },
      {
        label: "Waitlist Management",
        key: "/admin/waitlist",
        icon: () => h("i", { class: "fas fa-clipboard-list" }),
      },
    ],
  },
  {
    label: "System",
    key: "system",
    icon: () => h("i", { class: "fas fa-cog" }),
    children: [
      {
        label: "Database Info",
        key: "/admin/system/database",
        icon: () => h("i", { class: "fas fa-database" }),
      },
      {
        label: "API Testing",
        key: "/admin/system/api-test",
        icon: () => h("i", { class: "fas fa-flask" }),
      },
    ],
  },
];

// Handle menu selection
const handleMenuSelect = (key) => {
  if (key.startsWith("/admin/")) {
    router.push(key);
  }
};

// Route definitions for sidebar menu (keeping for compatibility)

const analyticsRoutes = [
  // {
  //   name: "Dashboard",
  //   path: "/admin/dashboard",
  //   label: "Dashboard",
  //   icon: "fas fa-tachometer-alt",
  // },
  {
    name: "EventStats",
    path: "/admin/analytics/events",
    label: "Event Statistics",
    icon: "fas fa-chart-bar",
  },
  // {
  //   name: "UserStats",
  //   path: "/admin/analytics/users",
  //   label: "User Statistics",
  //   icon: "fas fa-chart-pie",
  // },
];

const userRoutes = [
  {
    name: "UsersList",
    path: "/admin/users",
    label: "All Parents",
    icon: "fas fa-list",
  },
  {
    name: "UserCreate",
    path: "/admin/users/create",
    label: "Add Parent User",
    icon: "fas fa-plus",
  },
  {
    name: "UserProfiles",
    path: "/admin/users/profiles",
    label: "User Profiles",
    icon: "fas fa-id-card",
  },
];

const childRoutes = [
  {
    name: "ChildrenList",
    path: "/admin/children",
    label: "All Children",
    icon: "fas fa-list",
  },
  {
    name: "ChildCreate",
    path: "/admin/children/create",
    label: "Add Child",
    icon: "fas fa-plus",
  },
  {
    name: "ChildByParent",
    path: "/admin/children/by-parent",
    label: "By Parent",
    icon: "fas fa-family",
  },
];

const eventRoutes = [
  {
    name: "EventsList",
    path: "/admin/events",
    label: "All Events",
    icon: "fas fa-list",
  },
  {
    name: "EventCreate",
    path: "/admin/events/create",
    label: "Add Event",
    icon: "fas fa-plus",
  },
  {
    name: "EventsByChild",
    path: "/admin/events/by-child",
    label: "By Child",
    icon: "fas fa-child",
  },
  // {
  //   name: "EventsBulk",
  //   path: "/admin/events/bulk",
  //   label: "Bulk Operations",
  //   icon: "fas fa-tasks",
  // },
];

const dataRoutes = [
  {
    name: "DataManagement",
    path: "/admin/data/management",
    label: "Data Import",
    icon: "fas fa-file-upload",
  },
  {
    name: "DataExport",
    path: "/admin/data/export",
    label: "Data Export",
    icon: "fas fa-file-download",
  },
  {
    name: "WaitlistManagement",
    path: "/admin/waitlist",
    label: "Waitlist Management",
    icon: "fas fa-clipboard-list",
  },
];

const systemRoutes = [
  {
    name: "DatabaseInfo",
    path: "/admin/system/database",
    label: "Database Info",
    icon: "fas fa-database",
  },
  {
    name: "ApiTesting",
    path: "/admin/system/api-test",
    label: "API Testing",
    icon: "fas fa-flask",
  },
  // {
  //   name: "SystemLogs",
  //   path: "/admin/system/logs",
  //   label: "System Logs",
  //   icon: "fas fa-file-alt",
  // },
];

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
