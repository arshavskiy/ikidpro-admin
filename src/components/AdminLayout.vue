<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-800">IKidPro Admin</h1>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-4">
        <div class="px-4 py-2">
          <h2
            class="text-sm font-semibold text-gray-600 uppercase tracking-wide"
          >
            API Management
          </h2>
        </div>

        <!-- Analytics & Reports -->
        <div class="mt-4">
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
            <i class="fas fa-analytics mr-2"></i>Analytics
          </div>
          <router-link
            v-for="route in analyticsRoutes"
            :key="route.name"
            :to="route.path"
            class="block px-6 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700': $route.path === route.path }"
          >
            <i :class="route.icon + ' mr-2'"></i>{{ route.label }}
          </router-link>
        </div>

        <!-- User Management -->
        <div class="mt-2">
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
            <i class="fas fa-users mr-2"></i>User Management
          </div>
          <router-link
            v-for="route in userRoutes"
            :key="route.name"
            :to="route.path"
            class="block px-6 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700': $route.path === route.path }"
          >
            <i :class="route.icon + ' mr-2'"></i>{{ route.label }}
          </router-link>
        </div>

        <!-- Child User Management -->
        <div class="mt-4">
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
            <i class="fas fa-child mr-2"></i>Child Management
          </div>
          <router-link
            v-for="route in childRoutes"
            :key="route.name"
            :to="route.path"
            class="block px-6 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700': $route.path === route.path }"
          >
            <i :class="route.icon + ' mr-2'"></i>{{ route.label }}
          </router-link>
        </div>

        <!-- Event Management -->
        <div class="mt-4">
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
            <i class="fas fa-chart-line mr-2"></i>Event Management
          </div>
          <router-link
            v-for="route in eventRoutes"
            :key="route.name"
            :to="route.path"
            class="block px-6 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700': $route.path === route.path }"
          >
            <i :class="route.icon + ' mr-2'"></i>{{ route.label }}
          </router-link>
        </div>

        <!-- System -->
        <div class="mt-4">
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
            <i class="fas fa-cog mr-2"></i>System
          </div>
          <router-link
            v-for="route in systemRoutes"
            :key="route.name"
            :to="route.path"
            class="block px-6 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            :class="{ 'bg-blue-100 text-blue-700': $route.path === route.path }"
          >
            <i :class="route.icon + ' mr-2'"></i>{{ route.label }}
          </router-link>
        </div>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-4 left-4">
        <button
          @click="logout"
          class="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">
              {{ pageTitle }}
            </h1>
            <p class="text-sm text-gray-600">{{ pageDescription }}</p>
          </div>
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
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const user = computed(() => userStore.user);

// Route definitions for sidebar menu

const analyticsRoutes = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: "fas fa-tachometer-alt",
  },
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
    label: "All Users",
    icon: "fas fa-list",
  },
  {
    name: "UserCreate",
    path: "/admin/users/create",
    label: "Add User",
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

const systemRoutes = [
  // {
  //   name: "DatabaseInfo",
  //   path: "/admin/system/database",
  //   label: "Database Info",
  //   icon: "fas fa-database",
  // },
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
const pageTitle = computed(() => {
  const titles = {
    "/admin/dashboard": "Dashboard",
    "/admin/users": "User Management",
    "/admin/users/create": "Create New User",
    "/admin/users/profiles": "User Profiles",
    "/admin/children": "Child Management",
    "/admin/children/create": "Create New Child",
    "/admin/children/by-parent": "Children by Parent",
    "/admin/events": "Event Management",
    "/admin/events/create": "Create New Event",
    "/admin/events/by-child": "Events by Child",
    "/admin/events/bulk": "Bulk Event Operations",
    "/admin/analytics/events": "Event Analytics",
    "/admin/analytics/users": "User Analytics",
    "/admin/system/database": "Database Information",
    "/admin/system/api-test": "API Testing",
    "/admin/system/logs": "System Logs",
  };
  return titles[route.path] || "Admin Panel";
});

const pageDescription = computed(() => {
  const descriptions = {
    "/admin/dashboard": "Overview of system metrics and recent activity",
    "/admin/users": "Manage user accounts and permissions",
    "/admin/users/create": "Add a new user to the system",
    "/admin/users/profiles": "View and edit user profile information",
    "/admin/children": "Manage child user accounts",
    "/admin/children/create": "Add a new child user",
    "/admin/children/by-parent": "View children grouped by parent",
    "/admin/events": "Manage sensor events and data",
    "/admin/events/create": "Add a new sensor event",
    "/admin/events/by-child": "View events filtered by child",
    "/admin/events/bulk": "Perform bulk operations on events",
    "/admin/analytics/events": "Event data analysis and insights",
    "/admin/analytics/users": "User behavior and statistics",
    "/admin/system/database": "Database health and collection info",
    "/admin/system/api-test": "Test API endpoints and functionality",
    "/admin/system/logs": "View system logs and errors",
  };
  return descriptions[route.path] || "Administrative interface for IKidPro API";
});

const logout = async () => {
  await userStore.logout();
  router.push("/login");
};
</script>

<style scoped>
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
