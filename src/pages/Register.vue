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
        <form @submit.prevent="handleSubmit" class="space-y-8">
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
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >First Name</label
                >
                <input
                  v-model="parentForm.firstName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500': errors.firstName }"
                  placeholder="Enter your first name"
                />
                <p v-if="errors.firstName" class="text-red-600 text-sm mt-1">
                  {{ errors.firstName }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Last Name</label
                >
                <input
                  v-model="parentForm.lastName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500': errors.lastName }"
                  placeholder="Enter your last name"
                />
                <p v-if="errors.lastName" class="text-red-600 text-sm mt-1">
                  {{ errors.lastName }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Mobile Number</label
                >
                <input
                  v-model="parentForm.mobile"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500': errors.mobile }"
                  placeholder="Enter your mobile number"
                />
                <p v-if="errors.mobile" class="text-red-600 text-sm mt-1">
                  {{ errors.mobile }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Email Address</label
                >
                <input
                  v-model="parentForm.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500': errors.email }"
                  placeholder="Enter your email address"
                />
                <p v-if="errors.email" class="text-red-600 text-sm mt-1">
                  {{ errors.email }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  v-model="parentForm.password"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  :class="{ 'border-red-500': errors.password }"
                  placeholder="Create a strong password"
                />
                <p v-if="errors.password" class="text-red-600 text-sm mt-1">
                  {{ errors.password }}
                </p>
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
              <button
                type="button"
                @click="addChild"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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
              </button>
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
                <button
                  v-if="childrenForms.length > 1"
                  type="button"
                  @click="removeChild(index)"
                  class="text-red-600 hover:text-red-800 transition-colors"
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
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >First Name</label
                  >
                  <input
                    v-model="child.firstName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{
                      'border-red-500': errors[`child_${index}_firstName`],
                    }"
                    placeholder="Child's first name"
                  />
                  <p
                    v-if="errors[`child_${index}_firstName`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_firstName`] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Last Name</label
                  >
                  <input
                    v-model="child.lastName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{
                      'border-red-500': errors[`child_${index}_lastName`],
                    }"
                    placeholder="Child's last name"
                  />
                  <p
                    v-if="errors[`child_${index}_lastName`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_lastName`] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Gender</label
                  >
                  <select
                    v-model="child.gender"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{
                      'border-red-500': errors[`child_${index}_gender`],
                    }"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <p
                    v-if="errors[`child_${index}_gender`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_gender`] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Date of Birth</label
                  >
                  <input
                    v-model="child.dateOfBirth"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{
                      'border-red-500': errors[`child_${index}_dateOfBirth`],
                    }"
                  />
                  <p
                    v-if="errors[`child_${index}_dateOfBirth`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_dateOfBirth`] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Age</label
                  >
                  <input
                    v-model.number="child.age"
                    type="number"
                    min="0"
                    max="18"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{ 'border-red-500': errors[`child_${index}_age`] }"
                    placeholder="Age"
                  />
                  <p
                    v-if="errors[`child_${index}_age`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_age`] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Height (cm)</label
                  >
                  <input
                    v-model.number="child.height"
                    type="number"
                    min="30"
                    max="200"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{
                      'border-red-500': errors[`child_${index}_height`],
                    }"
                    placeholder="Height in cm"
                  />
                  <p
                    v-if="errors[`child_${index}_height`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_height`] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Weight (kg)</label
                  >
                  <input
                    v-model.number="child.weight"
                    type="number"
                    min="1"
                    max="150"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{
                      'border-red-500': errors[`child_${index}_weight`],
                    }"
                    placeholder="Weight in kg"
                  />
                  <p
                    v-if="errors[`child_${index}_weight`]"
                    class="text-red-600 text-xs mt-1"
                  >
                    {{ errors[`child_${index}_weight`] }}
                  </p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Medical Conditions</label
                  >
                  <input
                    v-model="child.medicalConditionsInput"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Separate multiple conditions with commas"
                  />
                  <p class="text-xs text-gray-500 mt-1">Leave empty if none</p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Physical/Mental Limitations</label
                  >
                  <input
                    v-model="child.limitationsInput"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Separate multiple limitations with commas"
                  />
                  <p class="text-xs text-gray-500 mt-1">Leave empty if none</p>
                </div>

                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Emergency Contact</label
                  >
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      v-model="child.emergencyContact.name"
                      type="text"
                      class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contact name"
                    />
                    <input
                      v-model="child.emergencyContact.phone"
                      type="tel"
                      class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Phone number"
                    />
                    <input
                      v-model="child.emergencyContact.relationship"
                      type="text"
                      class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Relationship"
                    />
                  </div>
                </div>

                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Additional Notes</label
                  >
                  <textarea
                    v-model="child.notes"
                    rows="3"
                    maxlength="1000"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Any additional information about the child"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ child.notes?.length || 0 }}/1000 characters
                  </p>
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

            <button
              type="submit"
              :disabled="loading"
              class="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
              <span v-else>Create Account</span>
            </button>
          </div>
        </form>
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

export default {
  name: "Register",
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
