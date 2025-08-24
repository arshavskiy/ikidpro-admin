<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-indigo-600 text-white px-8 py-6">
        <h1 class="text-3xl font-bold text-center">Accept Your Invitation</h1>
        <p class="text-center text-indigo-100 mt-2">
          Welcome! Complete your details to join the KidPro Admin system.
        </p>
      </div>

      <!-- Form Container -->
      <div class="p-8">
        <n-form
          ref="formRef"
          :model="form"
          @submit.prevent="handleInviteSubmit"
        >
          <div class="grid grid-cols-1 gap-6">
            <!-- <n-form-item
              label="First Name"
              path="firstName"
              :validation-status="errors.firstName ? 'error' : undefined"
              :feedback="errors.firstName"
            >
              <n-input
                v-model:value="form.firstName"
                placeholder="Enter your first name"
                autocomplete="given-name"
              />
            </n-form-item>

            <n-form-item
              label="Last Name"
              path="lastName"
              :validation-status="errors.lastName ? 'error' : undefined"
              :feedback="errors.lastName"
            >
              <n-input
                v-model:value="form.lastName"
                placeholder="Enter your last name"
                autocomplete="family-name"
              />
            </n-form-item> -->

            <n-form-item
              label="Email Address"
              path="email"
              :validation-status="errors.email ? 'error' : undefined"
              :feedback="errors.email"
            >
              <n-input
                v-model:value="form.email"
                type="email"
                placeholder="Your email address"
                disabled
                autocomplete="email"
              />
            </n-form-item>

            <n-form-item
              label="Password"
              path="password"
              :validation-status="errors.password ? 'error' : undefined"
              :feedback="errors.password"
            >
              <n-input
                v-model:value="form.password"
                type="password"
                show-password-on="click"
                placeholder="Create a strong password"
                autocomplete="new-password"
              />
            </n-form-item>

            <n-form-item
              label="Confirm Password"
              path="confirmPassword"
              :validation-status="errors.confirmPassword ? 'error' : undefined"
              :feedback="errors.confirmPassword"
            >
              <n-input
                v-model:value="form.confirmPassword"
                type="password"
                show-password-on="click"
                placeholder="Re-enter your password"
                autocomplete="new-password"
              />
            </n-form-item>

            <n-form-item label="Password Requirements" show-feedback="false">
              <ul class="text-xs text-gray-600 list-disc ml-4">
                <li>At least 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </n-form-item>
          </div>

          <!-- Error Message -->
          <div
            v-if="submitError"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4"
          >
            {{ submitError }}
          </div>

          <!-- Submit/Decline Buttons -->
          <div class="flex items-center justify-between pt-6">
            <n-button
              type="error"
              text
              :loading="declining"
              @click="handleDecline"
            >
              Decline Invitation
            </n-button>
            <n-button
              type="primary"
              size="large"
              :loading="loading"
              attr-type="submit"
              class="px-8"
            >
              {{ loading ? "Accepting..." : "Accept Invitation" }}
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";
import { useB2BStore } from "@/stores/b2bStore";
import apiClient from "@/services/apiClient";

const b2bStore = useB2BStore();

const route = useRoute();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({});
const loading = ref(false);
const declining = ref(false);
const submitError = ref("");

const inviteToken = ref("");

function validateForm() {
  errors.value = {};
  let valid = true;

  // if (!form.firstName) {
  //   errors.value.firstName = "First name is required.";
  //   valid = false;
  // }
  // if (!form.lastName) {
  //   errors.value.lastName = "Last name is required.";
  //   valid = false;
  // }
  if (!form.password) {
    errors.value.password = "Password is required.";
    valid = false;
  } else if (form.password.length < 8) {
    errors.value.password = "Password must be at least 8 characters.";
    valid = false;
  } else if (!/[A-Z]/.test(form.password)) {
    errors.value.password = "Password must contain an uppercase letter.";
    valid = false;
  } else if (!/[a-z]/.test(form.password)) {
    errors.value.password = "Password must contain a lowercase letter.";
    valid = false;
  } else if (!/[0-9]/.test(form.password)) {
    errors.value.password = "Password must contain a number.";
    valid = false;
  } else if (!/[^A-Za-z0-9]/.test(form.password)) {
    errors.value.password = "Password must contain a special character.";
    valid = false;
  }
  if (!form.confirmPassword) {
    errors.value.confirmPassword = "Please confirm your password.";
    valid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match.";
    valid = false;
  }
  return valid;
}

async function handleInviteSubmit() {
  submitError.value = "";
  if (!validateForm()) {
    submitError.value = "Please fix the validation errors before submitting.";
    return;
  }
  loading.value = true;
  try {
    await b2bStore.acceptInvite({
      token: inviteToken.value,
      data: form,
    });

    setTimeout(() => {
      router.push("/b2b/login?email=" + form.email);
    }, 3000);
  } catch (error) {
    submitError.value =
      error?.response?.data?.message || "Failed to accept invitation.";
  } finally {
    loading.value = false;
  }
}

async function handleDecline() {
  declining.value = true;
  submitError.value = "";
  try {
    await b2bStore.declineInvite({ token: inviteToken.value });
    router.push("/login");
  } catch (error) {
    submitError.value =
      error?.response?.data?.message || "Failed to decline invitation.";
  } finally {
    declining.value = false;
  }
}

const getInviteData = async () => {
  if (!inviteToken.value) return;
  try {
    const response = await apiClient.get(`/b2b/invite/${inviteToken.value}`);
    const data = response.data.data || response.data;
    // Populate form fields if available
    if (data?.email) form.email = data.email;
    if (data?.businessId) form.businessId = data.businessId;
    // Add other fields as needed
    return data;
  } catch (error) {
    console.error("Failed to fetch invite data:", error);
    return null;
  }
};

// Optionally call getInviteData on mount to prefill form
onMounted(async () => {
  inviteToken.value = route.query.token || "";
  if (inviteToken.value) {
    await getInviteData();
  }
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
