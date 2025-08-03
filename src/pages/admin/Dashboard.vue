<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
      <p class="text-gray-600">
        Overview of system metrics and recent activity
      </p>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-users text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ stats.totalUsers }}
            </p>
            <p class="text-sm text-green-600">
              +{{ stats.newUsersToday }} today
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-child text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Children</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ stats.totalChildren }}
            </p>
            <p class="text-sm text-green-600">
              +{{ stats.newChildrenToday }} today
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-chart-line text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Events</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ stats.totalEvents.toLocaleString() }}
            </p>
            <p class="text-sm text-green-600">
              +{{ stats.newEventsToday }} today
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded-full">
            <i class="fas fa-heartbeat text-red-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Devices</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ stats.activeDevices }}
            </p>
            <p class="text-sm text-gray-500">Last 24h</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <router-link
          to="/admin/users/create"
          class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <i class="fas fa-user-plus text-blue-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-blue-700">Add User</span>
        </router-link>

        <router-link
          to="/admin/children/create"
          class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <i class="fas fa-child text-purple-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-purple-700">Add Child</span>
        </router-link>

        <router-link
          to="/admin/events/create"
          class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <i class="fas fa-plus text-green-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-green-700">Add Event</span>
        </router-link>

        <!-- <router-link
          to="/admin/system/database"
          class="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <i class="fas fa-database text-yellow-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-yellow-700">Database</span>
        </router-link> -->

        <router-link
          to="/admin/analytics/events"
          class="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <i class="fas fa-chart-bar text-indigo-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-indigo-700">Analytics</span>
        </router-link>

        <router-link
          to="/admin/system/api-test"
          class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <i class="fas fa-flask text-gray-600 text-2xl mb-2"></i>
          <span class="text-sm font-medium text-gray-700">API Test</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity and Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Events -->
      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Recent Events</h3>
          <router-link
            to="/admin/events"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            View all →
          </router-link>
        </div>
        <div class="space-y-3">
          <div
            v-for="event in recentEvents"
            :key="event._id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">
                  Child: {{ event.aid }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDateTime(event.Timestamp) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-900">{{ event.HeartRate }} bpm</p>
              <p class="text-xs text-gray-500">{{ event.Temperature }}°C</p>
            </div>
          </div>
          <div
            v-if="recentEvents.length === 0"
            class="text-center text-gray-500 py-4"
          >
            No recent events
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="bg-white p-4 rounded-lg shadow-sm border">
        <h3 class="text-lg font-medium text-gray-900 mb-4">System Health</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Database Status</span>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <div class="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></div>
              Connected
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">API Response Time</span>
            <span class="text-sm font-medium text-gray-900"
              >{{ systemHealth.apiResponseTime }}ms</span
            >
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Active Connections</span>
            <span class="text-sm font-medium text-gray-900">{{
              systemHealth.activeConnections
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Memory Usage</span>
            <span class="text-sm font-medium text-gray-900"
              >{{ systemHealth.memoryUsage }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Recent Activity Timeline
      </h3>
      <div class="flow-root">
        <ul class="-mb-8">
          <li
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="relative pb-8"
          >
            <div
              v-if="index !== recentActivity.length - 1"
              class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            ></div>
            <div class="relative flex space-x-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full"
                :class="activity.iconBg"
              >
                <i :class="activity.icon + ' text-white text-sm'"></i>
              </div>
              <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                <div>
                  <p class="text-sm text-gray-900">{{ activity.message }}</p>
                </div>
                <div class="text-right text-sm whitespace-nowrap text-gray-500">
                  {{ activity.time }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as eventApi from "../../services/eventApi";
import * as userApi from "../../services/userApi";
import * as childUserApi from "../../services/childUserApi";

// Reactive data
const stats = ref({
  totalUsers: 0,
  newUsersToday: 0,
  totalChildren: 0,
  newChildrenToday: 0,
  totalEvents: 0,
  newEventsToday: 0,
  activeDevices: 0,
});

const recentEvents = ref([]);
const recentActivity = ref([]);
const systemHealth = ref({
  apiResponseTime: 120,
  activeConnections: 45,
  memoryUsage: 68,
});

// Methods
const loadDashboardData = async () => {
  try {
    // Load statistics
    const [eventsResponse, eventsCountResponse] = await Promise.all([
      eventApi.getAll(),
      eventApi.getCount(),
    ]);

    const events = eventsResponse.data;
    stats.value.totalEvents = events.length;

    // Get recent events (last 10)
    recentEvents.value = events
      .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
      .slice(0, 5);

    // Calculate today's events
    const today = new Date().toDateString();
    stats.value.newEventsToday = events.filter(
      (event) => new Date(event.Timestamp).toDateString() === today
    ).length;

    // Sample data for other stats (replace with actual API calls)
    stats.value.totalUsers = 25;
    stats.value.newUsersToday = 2;
    stats.value.totalChildren = 42;
    stats.value.newChildrenToday = 3;
    stats.value.activeDevices = 18;

    // Generate recent activity
    generateRecentActivity();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Use sample data if API fails
    loadSampleData();
  }
};

const loadSampleData = () => {
  stats.value = {
    totalUsers: 156,
    newUsersToday: 5,
    totalChildren: 298,
    newChildrenToday: 8,
    totalEvents: 15247,
    newEventsToday: 342,
    activeDevices: 89,
  };

  recentEvents.value = [];
  generateRecentActivity();
};

const generateRecentActivity = () => {
  recentActivity.value = [
    {
      message: "New user registration: John Doe",
      time: "2 minutes ago",
      icon: "fas fa-user-plus",
      iconBg: "bg-blue-500",
    },
    {
      message: "Child profile created for Emma Smith",
      time: "15 minutes ago",
      icon: "fas fa-child",
      iconBg: "bg-purple-500",
    },
    {
      message: "High heart rate alert for Child ID: C001",
      time: "32 minutes ago",
      icon: "fas fa-heartbeat",
      iconBg: "bg-red-500",
    },
    {
      message: "Bulk event data imported (500 records)",
      time: "1 hour ago",
      icon: "fas fa-upload",
      iconBg: "bg-green-500",
    },
    {
      message: "Database backup completed successfully",
      time: "3 hours ago",
      icon: "fas fa-database",
      iconBg: "bg-yellow-500",
    },
  ];
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lifecycle
onMounted(() => {
  loadDashboardData();

  // Refresh data every 30 seconds
  setInterval(loadDashboardData, 30000);
});
</script>
