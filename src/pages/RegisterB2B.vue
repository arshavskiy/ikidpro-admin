<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
  >
    <n-card class="w-full max-w-xl">
      <h2 class="text-2xl font-bold mb-2 text-gray-900 text-center">
        Register New Business
      </h2>
      <p class="text-gray-600 mb-6 text-center">
        Create a new business account for B2B access
      </p>
      <n-form
        ref="businessFormRef"
        :model="businessForm"
        :rules="businessRules"
        label-placement="left"
        label-width="120"
        require-mark-placement="right-hanging"
        @submit.prevent="handleRegister"
      >
        <n-form-item label="Business Name" path="name">
          <n-input
            v-model:value="businessForm.name"
            placeholder="Enter business name"
          />
        </n-form-item>

        <n-form-item label="Business Type" path="type">
          <n-select
            v-model:value="businessForm.type"
            :options="businessTypeOptions"
            placeholder="Select business type"
          />
        </n-form-item>
        <n-form-item label="Address" path="address">
          <n-input
            v-model:value="businessForm.address"
            type="textarea"
            placeholder="Enter business address"
            :rows="2"
          />
        </n-form-item>
        <n-form-item label="Phone" path="phone">
          <n-input
            v-model:value="businessForm.phone"
            placeholder="Enter business phone"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="businessForm.email"
            placeholder="Enter business email"
            type="email"
          />
        </n-form-item>
        <n-form-item label="Website" path="website">
          <n-input
            v-model:value="businessForm.website"
            placeholder="Enter business website (optional)"
          />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            v-model:value="businessForm.description"
            type="textarea"
            placeholder="Enter business description (optional)"
            :rows="2"
          />
        </n-form-item>
        <span>
          <n-form-item label="User first name" path="firstname">
            <n-input
              v-model:value="businessForm.firstname"
              placeholder="Enter user first name"
            />
          </n-form-item>

          <n-form-item label="User last name" path="lastName">
            <n-input
              v-model:value="businessForm.lastName"
              placeholder="Enter user last name"
            />
          </n-form-item>

          <n-form-item label="User Phone" path="phone">
            <n-input
              v-model:value="businessForm.user_phone"
              placeholder="Enter business phone"
            />
          </n-form-item>
          <n-form-item label="User Email" path="email">
            <n-input
              v-model:value="businessForm.user_email"
              placeholder="Enter User email"
              type="email"
            />
          </n-form-item>
          <n-form-item label="User Password" path="password">
            <n-input
              v-model:value="businessForm.password"
              placeholder="Enter password"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item>
          <n-form-item label="Confirm Password" path="confirmPassword">
            <n-input
              v-model:value="businessForm.confirmPassword"
              placeholder="Confirm password"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item>
        </span>

        <div
          v-if="submitError"
          class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4"
        >
          {{ submitError }}
        </div>
        <div class="flex justify-end mt-6">
          <n-button type="primary" :loading="loading" attr-type="submit"
            >Register Business</n-button
          >
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NCard, NForm, NFormItem, NInput, NSelect, NButton } from "naive-ui";
import { useB2BStore } from "@/stores/b2bStore";

const router = useRouter();
const route = useRoute();
const b2bStore = useB2BStore();

const businessFormRef = ref(null);
const loading = ref(false);
const submitError = ref("");

const businessForm = ref({
  firstname: "",
  lastName: "",
  user_phone: "",
  user_email: "",
  password: "",
  confirmPassword: "",
  name: "",
  type: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  password: "",
  confirmPassword: "",
});

const token = route.query.token || "";

const businessTypeOptions = [
  { label: "Clinic", value: "clinic" },
  { label: "Hospital", value: "hospital" },
  { label: "School", value: "school" },
  { label: "Daycare", value: "daycare" },
  { label: "Pediatric Center", value: "pediatric_center" },
  { label: "Rehabilitation Center", value: "rehabilitation_center" },
  { label: "Mental Health Clinic", value: "mental_health_clinic" },
  { label: "Sports Center", value: "sports_center" },
  { label: "Other", value: "other" },
];

const businessRules = {
  name: {
    required: true,
    message: "Business name is required",
    trigger: "blur",
  },
  type: {
    required: true,
    message: "Business type is required",
    trigger: "change",
  },
  address: {
    required: true,
    message: "Business address is required",
    trigger: "blur",
  },
  phone: {
    required: true,
    message: "Business phone is required",
    trigger: "blur",
  },
  email: {
    required: true,
    message: "Business email is required",
    trigger: "blur",
    type: "email",
  },
  password: {
    required: true,
    min: 8,
    message: "Password is required (min 8 characters)",
    trigger: "blur",
    validator(rule, value) {
      if (!value || value.length < 8) {
        return new Error("Password must be at least 8 characters");
      }
      return true;
    },
  },
  confirmPassword: {
    required: true,
    message: "Please confirm your password",
    trigger: "blur",
    validator(rule, value) {
      if (!value) {
        return new Error("Please confirm your password");
      }
      if (value !== businessForm.value.password) {
        return new Error("Passwords do not match");
      }
      return true;
    },
  },
};

async function handleRegister() {
  submitError.value = "";
  try {
    await businessFormRef.value?.validate();
    loading.value = true;
    businessForm.value.token = token;
    await b2bStore.createBusiness(businessForm.value);
    router.push("/b2b");
  } catch (error) {
    submitError.value = error?.message || "Failed to register business.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>
