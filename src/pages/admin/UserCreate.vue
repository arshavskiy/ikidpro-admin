<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create New User</h2>
      <p class="text-gray-600">Add a new user account to the system</p>
    </div>

    <!-- User Creation Form -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <form @submit.prevent="createUser" class="space-y-6">
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

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm password"
            />
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
        <div class="flex justify-end space-x-4">
          <router-link
            to="/admin/users"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as userApi from "../../services/userApi";

const router = useRouter();

// Reactive data
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");
const success = ref("");

// Methods
const createUser = async () => {
  error.value = "";
  success.value = "";

  // Validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (form.value.password.length < 8) {
    error.value = "Password must be at least 8 characters long";
    return;
  }

  loading.value = true;

  try {
    const userData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
    };

    await userApi.register(userData);
    success.value = "User created successfully!";
    router.push("/admin/users");

    // Reset form
    // form.value = {
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   mobile: "",
    //   password: "",
    //   confirmPassword: "",
    // };

    // Redirect after success
  } catch (err) {
    error.value = err.response?.data?.error || "Error creating user";
  } finally {
    loading.value = false;
  }
};
</script>
