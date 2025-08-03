<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Edit User</h2>
        <p class="text-gray-600">Update user information and settings</p>
      </div>
      <router-link
        to="/admin/users"
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>Back to Users
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loadingUser" class="text-center py-12">
      <i class="fas fa-spinner animate-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Loading user data...</p>
    </div>

    <!-- User Edit Form -->
    <div v-else-if="user" class="bg-white p-4 rounded-lg shadow-sm border">
      <form @submit.prevent="updateUser" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter last name"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <!-- Mobile -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                v-model="form.mobile"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter mobile number"
              />
            </div>
          </div>
        </div>

        <!-- Password Section -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Password Management
          </h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="flex items-center">
              <i class="fas fa-info-circle text-blue-600 mr-2"></i>
              <p class="text-sm text-blue-800">
                Leave password fields empty to keep the current password
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter new password"
                  minlength="6"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i
                    class="fas text-gray-400 hover:text-gray-600"
                    :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
                :class="{
                  'border-red-300':
                    form.password &&
                    form.confirmPassword &&
                    form.password !== form.confirmPassword,
                }"
              />
              <p
                v-if="
                  form.password &&
                  form.confirmPassword &&
                  form.password !== form.confirmPassword
                "
                class="text-sm text-red-600 mt-1"
              >
                Passwords do not match
              </p>
            </div>
          </div>
        </div>

        <!-- Account Status -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="isActive"
                v-model="form.isActive"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="isActive" class="ml-2 block text-sm text-gray-900">
                Active Account
              </label>
            </div>
            <p class="text-xs text-gray-500">
              Inactive users cannot log in to the system
            </p>
          </div>
        </div>

        <!-- User Statistics (Read-only) -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Account Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-gray-500 mb-1">
                User ID
              </label>
              <p class="text-sm font-mono text-gray-900">{{ user._id }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-gray-500 mb-1">
                Created
              </label>
              <p class="text-sm text-gray-900">
                {{ formatDate(user.createdAt) }}
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p class="text-sm text-gray-900">
                {{ formatDate(user.updatedAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Children Information -->
        <div v-if="user.children && user.children.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Associated Children
          </h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <i class="fas fa-child text-blue-600 mr-2"></i>
              <span class="text-sm font-medium text-blue-800">
                This user has {{ user.children.length }} child(ren) associated
              </span>
            </div>
            <router-link
              to="/admin/children/by-parent"
              class="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View children details →
            </router-link>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="success"
          class="p-3 bg-green-50 border border-green-200 rounded"
        >
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link
            to="/admin/users"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-sm text-gray-700 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            Update User
          </button>
        </div>
      </form>
    </div>

    <!-- User Not Found -->
    <div v-else class="text-center py-12">
      <i class="fas fa-user-slash text-gray-400 text-6xl mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
      <p class="text-gray-500 mb-4">
        The requested user could not be found or you don't have permission to
        edit it.
      </p>
      <router-link
        to="/admin/users"
        class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Users
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import * as userApi from "../../services/userApi";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// Reactive data
const user = ref(null);
const loadingUser = ref(false);
const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  isActive: true,
});

// Computed properties
const isFormValid = computed(() => {
  const baseValid =
    form.value.firstName.trim() &&
    form.value.lastName.trim() &&
    form.value.email.trim();

  // If password is being changed, check password validation
  if (form.value.password) {
    return (
      baseValid &&
      form.value.password.length >= 6 &&
      form.value.password === form.value.confirmPassword
    );
  }

  return baseValid;
});

const currentUserId = computed(() => userStore.user?._id);

// Methods
const loadUser = async () => {
  try {
    loadingUser.value = true;
    const userId = route.params.id;

    console.log("🔄 Loading user data for ID:", userId);

    const response = await userApi.getUserById(userId);
    user.value = response.data.data || response;

    // Populate form with user data
    form.value = {
      firstName: user.value.firstName || "",
      lastName: user.value.lastName || "",
      email: user.value.email || "",
      mobile: user.value.mobile || "",
      password: "",
      confirmPassword: "",
      isActive: user.value.isActive !== false, // Default to true if not specified
    };

    console.log("✅ User data loaded successfully");
  } catch (err) {
    console.error("❌ Error loading user:", err);
    error.value = "Failed to load user data";
    user.value = null;
  } finally {
    loadingUser.value = false;
  }
};

const updateUser = async () => {
  error.value = "";
  success.value = "";

  // Prevent users from editing their own account (optional safety measure)
  if (user.value._id === currentUserId.value) {
    error.value = "You cannot edit your own account from this interface";
    return;
  }

  // Validate password if being changed
  if (
    form.value.password &&
    form.value.password !== form.value.confirmPassword
  ) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;

  try {
    const updateData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      mobile: form.value.mobile || undefined,
      isActive: form.value.isActive,
    };

    // Only include password if it's being changed
    if (form.value.password) {
      updateData.password = form.value.password;
    }

    await userApi.updateUser(user.value._id, updateData);
    success.value = "User updated successfully!";

    // Reload user data to reflect changes
    setTimeout(() => {
      loadUser();
    }, 1000);
  } catch (err) {
    console.error("❌ Error updating user:", err);
    error.value = err.response?.data?.error || "Error updating user";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  if (user.value) {
    form.value = {
      firstName: user.value.firstName || "",
      lastName: user.value.lastName || "",
      email: user.value.email || "",
      mobile: user.value.mobile || "",
      password: "",
      confirmPassword: "",
      isActive: user.value.isActive !== false,
    };
  }
  error.value = "";
  success.value = "";
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
  loadUser();
});
</script>
