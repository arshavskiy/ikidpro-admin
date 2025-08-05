<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-indigo-600 text-white px-8 py-6">
        <h1 class="text-3xl font-bold text-center">Create Your Account</h1>
        <p class="text-center text-indigo-100 mt-2">
          Join KidPro and keep your children safe
        </p>
      </div>

      <!-- Form Container -->
      <div class="p-8">
        <n-form
          ref="formRef"
          :model="parentForm"
          @submit.prevent="handleSubmit"
        >
          <!-- Parent Information Section -->
          <div class="border-b border-gray-200 pb-8">
            <h2
              class="text-2xl font-semibold text-gray-800 mb-6 flex items-center"
            >
              <svg
                class="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Parent Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <n-form-item
                  label="First Name"
                  path="firstName"
                  :validation-status="errors.firstName ? 'error' : undefined"
                  :feedback="errors.firstName"
                >
                  <n-input
                    v-model:value="parentForm.firstName"
                    placeholder="Enter your first name"
                  />
                </n-form-item>
              </div>

              <div>
                <n-form-item
                  label="Last Name"
                  path="lastName"
                  :validation-status="errors.lastName ? 'error' : undefined"
                  :feedback="errors.lastName"
                >
                  <n-input
                    v-model:value="parentForm.lastName"
                    placeholder="Enter your last name"
                  />
                </n-form-item>
              </div>

              <div>
                <n-form-item
                  label="Mobile Number"
                  path="mobile"
                  :validation-status="errors.mobile ? 'error' : undefined"
                  :feedback="errors.mobile"
                >
                  <n-input
                    v-model:value="parentForm.mobile"
                    placeholder="Enter your mobile number"
                  />
                </n-form-item>
              </div>

              <div>
                <n-form-item
                  label="Email Address"
                  path="email"
                  :validation-status="errors.email ? 'error' : undefined"
                  :feedback="errors.email"
                >
                  <n-input
                    v-model:value="parentForm.email"
                    type="email"
                    placeholder="Enter your email address"
                  />
                </n-form-item>
              </div>

              <div class="md:col-span-2">
                <n-form-item
                  label="Password"
                  path="password"
                  :validation-status="errors.password ? 'error' : undefined"
                  :feedback="errors.password"
                >
                  <n-input
                    v-model:value="parentForm.password"
                    type="password"
                    show-password-on="click"
                    placeholder="Create a strong password"
                  />
                </n-form-item>
              </div>
            </div>
          </div>

          <!-- Child Information Section -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-2xl font-semibold text-gray-800 flex items-center"
              >
                <svg
                  class="w-6 h-6 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Children Information
              </h2>
              <n-button
                type="primary"
                @click="addChild"
                class="flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Child
              </n-button>
            </div>

            <!-- Child Forms -->
            <div
              v-for="(child, index) in childrenForms"
              :key="child.id"
              class="border border-gray-200 rounded-lg p-6 mb-6"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-800">
                  Child {{ index + 1 }}
                </h3>
                <n-button
                  v-if="childrenForms.length > 1"
                  type="error"
                  text
                  @click="removeChild(index)"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </n-button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <n-form-item
                    :label="'First Name'"
                    :path="`child_${index}_firstName`"
                    :validation-status="
                      errors[`child_${index}_firstName`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_firstName`]"
                  >
                    <n-input
                      v-model:value="child.firstName"
                      placeholder="Child's first name"
                    />
                  </n-form-item>
                </div>

                <div>
                  <n-form-item
                    :label="'Last Name'"
                    :path="`child_${index}_lastName`"
                    :validation-status="
                      errors[`child_${index}_lastName`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_lastName`]"
                  >
                    <n-input
                      v-model:value="child.lastName"
                      placeholder="Child's last name"
                    />
                  </n-form-item>
                </div>

                <div>
                  <n-form-item
                    :label="'Gender'"
                    :path="`child_${index}_gender`"
                    :validation-status="
                      errors[`child_${index}_gender`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_gender`]"
                  >
                    <n-select
                      v-model:value="child.gender"
                      placeholder="Select gender"
                      :options="[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Non-binary', value: 'Non-binary' },
                        {
                          label: 'Prefer not to say',
                          value: 'Prefer not to say',
                        },
                      ]"
                    />
                  </n-form-item>
                </div>

                <div>
                  <n-form-item
                    :label="'Date of Birth'"
                    :path="`child_${index}_dateOfBirth`"
                    :validation-status="
                      errors[`child_${index}_dateOfBirth`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_dateOfBirth`]"
                  >
                    <n-input v-model:value="child.dateOfBirth" type="date" />
                  </n-form-item>
                </div>

                <div>
                  <n-form-item
                    :label="'Age'"
                    :path="`child_${index}_age`"
                    :validation-status="
                      errors[`child_${index}_age`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_age`]"
                  >
                    <n-input-number
                      v-model:value="child.age"
                      :min="0"
                      :max="18"
                      placeholder="Age"
                    />
                  </n-form-item>
                </div>

                <div>
                  <n-form-item
                    :label="'Height (cm)'"
                    :path="`child_${index}_height`"
                    :validation-status="
                      errors[`child_${index}_height`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_height`]"
                  >
                    <n-input-number
                      v-model:value="child.height"
                      :min="30"
                      :max="200"
                      placeholder="Height in cm"
                    />
                  </n-form-item>
                </div>

                <div>
                  <n-form-item
                    :label="'Weight (kg)'"
                    :path="`child_${index}_weight`"
                    :validation-status="
                      errors[`child_${index}_weight`] ? 'error' : undefined
                    "
                    :feedback="errors[`child_${index}_weight`]"
                  >
                    <n-input-number
                      v-model:value="child.weight"
                      :min="1"
                      :max="150"
                      placeholder="Weight in kg"
                    />
                  </n-form-item>
                </div>

                <div class="md:col-span-2">
                  <n-form-item :label="'Medical Conditions'">
                    <n-input
                      v-model:value="child.medicalConditionsInput"
                      placeholder="Separate multiple conditions with commas"
                    />
                    <template #feedback>
                      <p class="text-xs text-gray-500 mt-1">
                        Leave empty if none
                      </p>
                    </template>
                  </n-form-item>
                </div>

                <div class="md:col-span-2">
                  <n-form-item :label="'Physical/Mental Limitations'">
                    <n-input
                      v-model:value="child.limitationsInput"
                      placeholder="Separate multiple limitations with commas"
                    />
                    <template #feedback>
                      <p class="text-xs text-gray-500 mt-1">
                        Leave empty if none
                      </p>
                    </template>
                  </n-form-item>
                </div>

                <div class="lg:col-span-3">
                  <n-form-item :label="'Emergency Contact'">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <n-input
                        v-model:value="child.emergencyContact.name"
                        placeholder="Contact name"
                      />
                      <n-input
                        v-model:value="child.emergencyContact.phone"
                        placeholder="Phone number"
                      />
                      <n-input
                        v-model:value="child.emergencyContact.relationship"
                        placeholder="Relationship"
                      />
                    </div>
                  </n-form-item>
                </div>

                <div class="lg:col-span-3">
                  <n-form-item :label="'Additional Notes'">
                    <n-input
                      v-model:value="child.notes"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 5 }"
                      placeholder="Any additional information about the child"
                      maxlength="1000"
                      show-count
                    />
                  </n-form-item>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="submitError"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
          >
            {{ submitError }}
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-between pt-6">
            <router-link
              to="/login"
              class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Already have an account? Sign in
            </router-link>

            <n-button
              type="primary"
              size="large"
              :loading="loading"
              attr-type="submit"
              class="px-8"
            >
              {{ loading ? "Creating Account..." : "Create Account" }}
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { validateParentForm, validateChildForm } from "../utils/validation";
import { registerParentWithChildren } from "../services/registrationApi";
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NGrid,
  NGridItem,
} from "naive-ui";

export default {
  name: "Register",
  components: {
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
    NButton,
    NGrid,
    NGridItem,
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    // Reactive form data
    const parentForm = reactive({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
    });

    const childrenForms = ref([createEmptyChild()]);
    const errors = ref({});
    const loading = ref(false);
    const submitError = ref("");

    // Helper function to create empty child object
    function createEmptyChild() {
      return {
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        age: "",
        height: "",
        weight: "",
        medicalConditionsInput: "",
        limitationsInput: "",
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
        notes: "",
      };
    }

    // Add new child form
    function addChild() {
      childrenForms.value.push(createEmptyChild());
    }

    // Remove child form
    function removeChild(index) {
      if (childrenForms.value.length > 1) {
        childrenForms.value.splice(index, 1);
        // Clear related errors
        Object.keys(errors.value).forEach((key) => {
          if (key.startsWith(`child_${index}_`)) {
            delete errors.value[key];
          }
        });
      }
    }

    // Validate entire form
    function validateForm() {
      errors.value = {};
      let isValid = true;

      // Validate parent form
      const parentValidation = validateParentForm(parentForm);
      if (!parentValidation.isValid) {
        Object.assign(errors.value, parentValidation.errors);
        isValid = false;
      }

      // Validate each child form
      childrenForms.value.forEach((child, index) => {
        const childData = {
          ...child,
          medicalCondition: child.medicalConditionsInput
            ? child.medicalConditionsInput
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          limitations: child.limitationsInput
            ? child.limitationsInput
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
        };

        const childValidation = validateChildForm(childData);
        if (!childValidation.isValid) {
          Object.keys(childValidation.errors).forEach((key) => {
            errors.value[`child_${index}_${key}`] = childValidation.errors[key];
          });
          isValid = false;
        }
      });

      return isValid;
    }

    // Handle form submission
    async function handleSubmit() {
      submitError.value = "";

      if (!validateForm()) {
        submitError.value =
          "Please fix the validation errors before submitting.";
        return;
      }

      loading.value = true;

      try {
        // Prepare children data
        const childrenData = childrenForms.value.map((child) => ({
          firstName: child.firstName,
          lastName: child.lastName,
          gender: child.gender,
          dateOfBirth: child.dateOfBirth,
          age: child.age,
          height: child.height,
          weight: child.weight,
          medicalCondition: child.medicalConditionsInput
            ? child.medicalConditionsInput
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          limitations: child.limitationsInput
            ? child.limitationsInput
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          emergencyContact: child.emergencyContact,
          notes: child.notes,
        }));

        // Register parent and children
        await registerParentWithChildren({
          parent: parentForm,
          children: childrenData,
        });

        // Auto-login after successful registration
        await userStore.login({
          email: parentForm.email,
          password: parentForm.password,
        });

        // Redirect to kids page
        // router.push("/kids");
      } catch (error) {
        submitError.value =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
      } finally {
        loading.value = false;
      }
    }

    return {
      parentForm,
      childrenForms,
      errors,
      loading,
      submitError,
      addChild,
      removeChild,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
