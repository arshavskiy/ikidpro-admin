<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create New Parent</h2>
      <p class="text-gray-600">Add a new user account to the system</p>
    </div>

    <!-- User Creation Form -->
    <NCard>
      <n-form @submit.prevent="createUser" :model="form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <div>
            <n-form-item label="First Name" path="firstName" required>
              <n-input
                v-model:value="form.firstName"
                placeholder="Enter first name"
              />
            </n-form-item>
          </div>

          <!-- Last Name -->
          <div>
            <n-form-item label="Last Name" path="lastName" required>
              <n-input
                v-model:value="form.lastName"
                placeholder="Enter last name"
              />
            </n-form-item>
          </div>

          <!-- Email -->
          <div>
            <n-form-item label="Email Address" path="email" required>
              <n-input
                v-model:value="form.email"
                type="email"
                placeholder="Enter email address"
              />
            </n-form-item>
          </div>

          <!-- Mobile -->
          <div>
            <n-form-item label="Mobile Number" path="mobile">
              <n-input
                v-model:value="form.mobile"
                placeholder="Enter mobile number"
              />
            </n-form-item>
          </div>

          <!-- Password -->
          <div>
            <n-form-item label="Password" path="password" required>
              <n-input
                v-model:value="form.password"
                type="password"
                show-password-on="click"
                placeholder="Enter password"
              />
            </n-form-item>
          </div>

          <!-- Confirm Password -->
          <div>
            <n-form-item
              label="Confirm Password"
              path="confirmPassword"
              required
            >
              <n-input
                v-model:value="form.confirmPassword"
                type="password"
                show-password-on="click"
                placeholder="Confirm password"
              />
            </n-form-item>
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
          <n-button type="primary" :loading="loading" attr-type="submit">
            Create User
          </n-button>
        </div>
      </n-form>
    </NCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as userApi from "../../services/userApi";
import { NForm, NFormItem, NInput, NButton, useMessage } from "naive-ui";

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
    // router.push("/admin/users");

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
