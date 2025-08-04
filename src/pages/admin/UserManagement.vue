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
    <Card>
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name, email, or mobile..."
            class="w-full px-3 py-2border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="refreshUsers"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <i class="fas fa-refresh mr-2"></i>Refresh
        </button>
      </div>
    </Card>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatisticsCard
        label="Total Users"
        :value="totalUsers"
        icon="fas fa-users"
        variant="blue"
      />

      <StatisticsCard
        label="Active Users"
        :value="activeUsers"
        icon="fas fa-user-check"
        variant="green"
      />

      <StatisticsCard
        label="Parents"
        :value="parentsCount"
        icon="fas fa-child"
        variant="yellow"
      />

      <StatisticsCard
        label="New This Month"
        :value="newUsersThisMonth"
        icon="fas fa-calendar"
        variant="purple"
      />
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-smoverflow-hidden max-h-150">
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
                  class="text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editUser(user)"
                  class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900 cursor-pointer"
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

    <!-- User Delete Modal -->
    <div
      v-if="showDeleteModal && userToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="p-6">
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>

          <h3 class="text-lg font-medium text-gray-900 text-center mb-2">
            Delete User
          </h3>

          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete
            <span class="font-semibold text-gray-900">
              {{ userToDelete.firstName }} {{ userToDelete.lastName }} </span
            >? This action cannot be undone and will permanently remove all
            associated data.
          </p>

          <div class="bg-gray-50border-gray-200 rounded-md p-4 mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">User Details</h4>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span class="font-medium">Name:</span>
                <span
                  >{{ userToDelete.firstName }}
                  {{ userToDelete.lastName }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Email:</span>
                <span>{{ userToDelete.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">User ID:</span>
                <span>{{ userToDelete._id }}</span>
              </div>
              <div v-if="userToDelete.mobile" class="flex justify-between">
                <span class="font-medium">Mobile:</span>
                <span>{{ userToDelete.mobile }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Children:</span>
                <span>{{ userToDelete.children?.length || 0 }} children</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Joined:</span>
                <span>{{ formatDate(userToDelete.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50border-yellow-200 rounded-md p-4 mb-6">
            <div class="flex">
              <i
                class="fas fa-exclamation-triangle text-yellow-400 mr-3 mt-0.5"
              ></i>
              <div>
                <h4 class="text-sm font-medium text-yellow-800">Warning</h4>
                <p class="text-sm text-yellow-700 mt-1">
                  Deleting this user will permanently remove:
                </p>
                <ul class="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>User account and login credentials</li>
                  <li>All associated children profiles</li>
                  <li>All sensor data and events for their children</li>
                  <li>Analytics and reports</li>
                  <li>Account history and preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-whiteborder-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleting"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <i v-if="deleting" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-trash mr-2"></i>
              {{ deleting ? "Deleting..." : "Delete User" }}
            </button>
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
import Card from "../../components/Card.vue";
import StatisticsCard from "../../components/StatisticsCard.vue";

const router = useRouter();
const userStore = useUserStore();

// Reactive data
const users = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedUser = ref(null);
const userToDelete = ref(null);
const showDeleteModal = ref(false);
const deleting = ref(false);

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

const deleteUser = (user) => {
  if (user._id === currentUserId.value) {
    alert("You cannot delete your own account");
    return;
  }

  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  try {
    deleting.value = true;
    await userApi.deleteUser(userToDelete.value._id);
    users.value = users.value.filter((u) => u._id !== userToDelete.value._id);
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Error deleting user");
  } finally {
    deleting.value = false;
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
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
