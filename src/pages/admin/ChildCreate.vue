<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create New Child</h2>
      <p class="text-gray-600">Add a new child profile to the system</p>
    </div>

    <!-- Child Creation Form -->
    <NCard>
      <n-form @submit.prevent="createChild" :model="form" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
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

            <!-- Gender -->
            <div>
              <n-form-item label="Gender" path="gender" required>
                <n-select
                  v-model:value="form.gender"
                  placeholder="Select gender"
                  :options="[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Non-binary', value: 'Non-binary' },
                    { label: 'Prefer not to say', value: 'Prefer not to say' },
                  ]"
                />
              </n-form-item>
            </div>

            <!-- Date of Birth -->
            <div>
              <n-form-item label="Date of Birth" path="dateOfBirth">
                <n-input v-model:value="form.dateOfBirth" type="date" />
              </n-form-item>
            </div>

            <!-- Age -->
            <div>
              <n-form-item label="Age" path="age">
                <n-input-number
                  v-model:value="form.age"
                  :min="0"
                  :max="18"
                  placeholder="Enter age"
                />
              </n-form-item>
            </div>

            <!-- Parent ID -->
            <div>
              <n-form-item label="Parent" path="parentId" required>
                <template #feedback>
                  <p class="text-xs text-gray-500 mb-2">
                    Select the parent who will be responsible for this child
                    <i
                      v-if="loadingParents"
                      class="fas fa-spinner animate-spin ml-1"
                    ></i>
                  </p>
                </template>
                <div class="space-y-2">
                  <!-- Parent Selection Dropdown -->
                  <n-select
                    v-model:value="form.parentId"
                    :disabled="loadingParents || showManualParentId"
                    placeholder="Select a parent"
                    :loading="loadingParents"
                    :options="
                      availableParents.map((parent) => ({
                        label: `${parent.firstName} ${parent.lastName} (${parent.email})`,
                        value: parent._id,
                      }))
                    "
                  />

                  <!-- Manual Entry Toggle -->
                  <div class="flex items-center space-x-2">
                    <n-checkbox
                      v-model:checked="showManualParentId"
                      @update:checked="handleManualToggle"
                    />
                    <label class="text-sm text-gray-600">
                      Enter Parent ID manually
                    </label>
                  </div>

                  <!-- Manual Parent ID Input -->
                  <n-input
                    v-if="showManualParentId"
                    v-model:value="form.parentId"
                    placeholder="Enter parent's MongoDB ObjectId"
                  />
                </div>
              </n-form-item>
            </div>
          </div>
        </div>

        <!-- Physical Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Physical Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Height -->
            <div>
              <n-form-item label="Height (cm)" path="height">
                <n-input-number
                  v-model:value="form.height"
                  :min="30"
                  :max="200"
                  placeholder="Enter height in centimeters"
                />
              </n-form-item>
            </div>

            <!-- Weight -->
            <div>
              <n-form-item label="Weight (kg)" path="weight">
                <n-input-number
                  v-model:value="form.weight"
                  :min="1"
                  :max="150"
                  :step="0.1"
                  placeholder="Enter weight in kilograms"
                />
              </n-form-item>
            </div>
          </div>
        </div>

        <!-- Medical Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Medical Information
          </h3>
          <div class="space-y-4">
            <!-- Medical Conditions -->
            <div>
              <n-form-item label="Medical Conditions" path="medicalCondition">
                <div class="flex items-center space-x-2 mb-2">
                  <n-input
                    v-model:value="newMedicalCondition"
                    placeholder="Enter medical condition"
                    @keyup.enter="addMedicalCondition"
                    class="flex-1"
                  />
                  <n-button type="primary" @click="addMedicalCondition">
                    Add
                  </n-button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(condition, index) in form.medicalCondition"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    {{ condition }}
                    <button
                      type="button"
                      @click="removeMedicalCondition(index)"
                      class="ml-2 text-red-600 hover:text-red-800"
                    >
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </span>
                </div>
              </n-form-item>
            </div>

            <!-- Limitations -->
            <div>
              <n-form-item
                label="Physical/Mental Limitations"
                path="limitations"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <n-input
                    v-model:value="newLimitation"
                    placeholder="Enter limitation"
                    @keyup.enter="addLimitation"
                    class="flex-1"
                  />
                  <n-button type="primary" @click="addLimitation">
                    Add
                  </n-button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(limitation, index) in form.limitations"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {{ limitation }}
                    <button
                      type="button"
                      @click="removeLimitation(index)"
                      class="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </span>
                </div>
              </n-form-item>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Emergency Contact
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <n-form-item label="Contact Name" path="emergencyContact.name">
                <n-input
                  v-model:value="form.emergencyContact.name"
                  placeholder="Enter contact name"
                />
              </n-form-item>
            </div>

            <div>
              <n-form-item label="Phone Number" path="emergencyContact.phone">
                <n-input
                  v-model:value="form.emergencyContact.phone"
                  placeholder="Enter phone number"
                />
              </n-form-item>
            </div>

            <div>
              <n-form-item
                label="Relationship"
                path="emergencyContact.relationship"
              >
                <n-input
                  v-model:value="form.emergencyContact.relationship"
                  placeholder="e.g., Mother, Father, Guardian"
                />
              </n-form-item>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <n-form-item label="Additional Notes" path="notes">
            <n-input
              v-model:value="form.notes"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="Enter any additional notes (max 1000 characters)"
              maxlength="1000"
              show-count
            />
          </n-form-item>
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
            to="/admin/children"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </router-link>
          <n-button type="primary" :loading="loading" attr-type="submit">
            Create Child Profile
          </n-button>
        </div>
      </n-form>
    </NCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as childUserApi from "../../services/childUserApi";
import * as userApi from "../../services/userApi";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NCheckbox,
  useMessage,
} from "naive-ui";

const router = useRouter();

// Reactive data
const form = ref({
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  age: null,
  height: null,
  weight: null,
  medicalCondition: [],
  limitations: [],
  parentId: "",
  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
  notes: "",
});

const newMedicalCondition = ref("");
const newLimitation = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

// Parent selection
const availableParents = ref([]);
const showManualParentId = ref(false);
const loadingParents = ref(false);

// Methods
const loadParents = async () => {
  try {
    loadingParents.value = true;
    const response = await userApi.getAllUsers();
    // Filter to show only parent users (you might want to adjust this filter based on your user roles)
    availableParents.value = response.data.data || [];
  } catch (err) {
    console.error("Error loading parents:", err);
    error.value = "Failed to load parents list";
  } finally {
    loadingParents.value = false;
  }
};

const handleManualToggle = () => {
  // Clear parentId when switching to manual mode
  if (showManualParentId.value) {
    form.value.parentId = "";
  }
};

const addMedicalCondition = () => {
  if (newMedicalCondition.value.trim()) {
    form.value.medicalCondition.push(newMedicalCondition.value.trim());
    newMedicalCondition.value = "";
  }
};

const removeMedicalCondition = (index) => {
  form.value.medicalCondition.splice(index, 1);
};

const addLimitation = () => {
  if (newLimitation.value.trim()) {
    form.value.limitations.push(newLimitation.value.trim());
    newLimitation.value = "";
  }
};

const removeLimitation = (index) => {
  form.value.limitations.splice(index, 1);
};

const createChild = async () => {
  error.value = "";
  success.value = "";

  loading.value = true;

  try {
    const childData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      gender: form.value.gender,
      dateOfBirth: form.value.dateOfBirth || undefined,
      age: form.value.age || undefined,
      height: form.value.height || undefined,
      weight: form.value.weight || undefined,
      medicalCondition: form.value.medicalCondition,
      limitations: form.value.limitations,
      parentId: form.value.parentId,
      emergencyContact: {
        name: form.value.emergencyContact.name || undefined,
        phone: form.value.emergencyContact.phone || undefined,
        relationship: form.value.emergencyContact.relationship || undefined,
      },
      notes: form.value.notes || undefined,
    };

    // Remove empty emergencyContact if all fields are empty
    if (
      !childData.emergencyContact.name &&
      !childData.emergencyContact.phone &&
      !childData.emergencyContact.relationship
    ) {
      delete childData.emergencyContact;
    }

    childData.aid = "CHILD-" + Date.now(); // Assuming parentId is the parent's MongoDB ObjectId

    await childUserApi.createChildUser(childData);
    success.value = "Child profile created successfully!";

    // router.push("/admin/children");

    // Reset form
    // form.value = {
    //   firstName: "",
    //   lastName: "",
    //   gender: "",
    //   dateOfBirth: "",
    //   age: null,
    //   height: null,
    //   weight: null,
    //   medicalCondition: [],
    //   limitations: [],
    //   parentId: "",
    //   emergencyContact: {
    //     name: "",
    //     phone: "",
    //     relationship: "",
    //   },
    //   notes: "",
    // };
  } catch (err) {
    error.value = err.response?.data?.error || "Error creating child profile";
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  loadParents();
});
</script>
