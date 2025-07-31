<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
        <p class="text-gray-600">Manage all registered users in the system</p>
      </div>
      <router-link
        to="/admin/users/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>Add New User
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name, email, or mobile..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="refreshUsers"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <i class="fas fa-refresh mr-2"></i>Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-users text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-user-check text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <i class="fas fa-child text-yellow-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Parents</p>
            <p class="text-2xl font-bold text-gray-900">{{ parentsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-calendar text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">New This Month</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ newUsersThisMonth }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden max-h-150">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">All Users</h3>
      </div>

      <div class="overflow-auto max-h-150">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User Info
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Children
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-blue-600 font-medium">
                      {{
                        (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
                      }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ user._id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
                <div class="text-sm text-gray-500">
                  {{ user.mobile || "No phone" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ user.children?.length || 0 }} children
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
              >
                <button
                  @click="viewUser(user)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editUser(user)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900"
                  :disabled="user._id === currentUserId"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-500">No users match your search criteria.</p>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">User Details</h3>
            <button
              @click="selectedUser = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >First Name</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ selectedUser.firstName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Last Name</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ selectedUser.lastName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <p class="mt-1 text-sm text-gray-900">{{ selectedUser.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Mobile</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ selectedUser.mobile || "Not provided" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Created At</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ formatDate(selectedUser.createdAt) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Updated At</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ formatDate(selectedUser.updatedAt) }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700"
              >Children Count</label
            >
            <p class="mt-1 text-sm text-gray-900">
              {{ selectedUser.children?.length || 0 }} children
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import * as userApi from "../../services/userApi";

const router = useRouter();
const userStore = useUserStore();

// Reactive data
const users = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedUser = ref(null);

// Computed properties
const currentUserId = computed(() => userStore.user?._id);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobile?.toString().includes(query)
  );
});

const totalUsers = computed(() => users.value.length);
const activeUsers = computed(
  () => users.value.filter((user) => user.isActive !== false).length
);
const parentsCount = computed(
  () => users.value.filter((user) => user.children?.length > 0).length
);
const newUsersThisMonth = computed(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return users.value.filter((user) => new Date(user.createdAt) >= startOfMonth)
    .length;
});

// Methods
const loadUsers = async () => {
  try {
    loading.value = true;
    console.log("🔄 Loading all users from API...");

    const response = await userApi.getAllUsers();
    users.value = response.data.data || response.data || [];

    console.log(`✅ Loaded ${users.value.length} users successfully`);
  } catch (error) {
    console.error("❌ Error loading users:", error);

    // Fallback to current user if API fails
    if (userStore.user) {
      users.value = [userStore.user];
      console.log("⚠️ Using current user as fallback");
    } else {
      users.value = [];
    }
  } finally {
    loading.value = false;
  }
};

const refreshUsers = () => {
  loadUsers();
};

const viewUser = (user) => {
  selectedUser.value = user;
};

const editUser = (user) => {
  // Navigate to edit page
  router.push(`/admin/users/edit/${user._id}`);
};

const deleteUser = async (user) => {
  if (user._id === currentUserId.value) {
    alert("You cannot delete your own account");
    return;
  }

  if (
    confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
    )
  ) {
    try {
      await userApi.deleteUser(user._id);
      users.value = users.value.filter((u) => u._id !== user._id);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lifecycle
onMounted(() => {
  loadUsers();
});
</script>
