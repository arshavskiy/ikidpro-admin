<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create New Child</h2>
      <p class="text-gray-600">Add a new child profile to the system</p>
    </div>

    <!-- Child Creation Form -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <form @submit.prevent="createChild" class="space-y-6">
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

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Gender <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.gender"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <!-- Date of Birth -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Age -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                v-model="form.age"
                type="number"
                min="0"
                max="18"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter age"
              />
            </div>

            <!-- Parent ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Parent <span class="text-red-500">*</span>
              </label>
              <p class="text-xs text-gray-500 mb-2">
                Select the parent who will be responsible for this child
                <i
                  v-if="loadingParents"
                  class="fas fa-spinner animate-spin ml-1"
                ></i>
              </p>
              <div class="space-y-2">
                <!-- Parent Selection Dropdown -->
                <select
                  v-model="form.parentId"
                  required
                  :disabled="loadingParents || showManualParentId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {{
                      loadingParents ? "Loading parents..." : "Select a parent"
                    }}
                  </option>
                  <option
                    v-for="parent in availableParents"
                    :key="parent._id"
                    :value="parent._id"
                  >
                    {{ parent.firstName }} {{ parent.lastName }}
                    <span class="text-gray-500">({{ parent.email }})</span>
                  </option>
                  <option
                    v-if="!loadingParents && availableParents.length === 0"
                    value=""
                    disabled
                  >
                    No parents found
                  </option>
                </select>

                <!-- Manual Entry Toggle -->
                <div class="flex items-center space-x-2">
                  <input
                    id="manualParentId"
                    v-model="showManualParentId"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    @change="handleManualToggle"
                  />
                  <label for="manualParentId" class="text-sm text-gray-600">
                    Enter Parent ID manually
                  </label>
                </div>

                <!-- Manual Parent ID Input -->
                <input
                  v-if="showManualParentId"
                  v-model="form.parentId"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter parent's MongoDB ObjectId"
                />
              </div>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                v-model="form.height"
                type="number"
                min="30"
                max="200"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter height in centimeters"
              />
            </div>

            <!-- Weight -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                v-model="form.weight"
                type="number"
                min="1"
                max="150"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter weight in kilograms"
              />
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <div class="flex items-center space-x-2 mb-2">
                <input
                  v-model="newMedicalCondition"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter medical condition"
                  @keyup.enter="addMedicalCondition"
                />
                <button
                  type="button"
                  @click="addMedicalCondition"
                  class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
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
            </div>

            <!-- Limitations -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Physical/Mental Limitations
              </label>
              <div class="flex items-center space-x-2 mb-2">
                <input
                  v-model="newLimitation"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter limitation"
                  @keyup.enter="addLimitation"
                />
                <button
                  type="button"
                  @click="addLimitation"
                  class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                v-model="form.emergencyContact.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                v-model="form.emergencyContact.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <input
                v-model="form.emergencyContact.relationship"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mother, Father, Guardian"
              />
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            maxlength="1000"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter any additional notes (max 1000 characters)"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ form.notes.length }}/1000 characters
          </p>
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
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            Create Child Profile
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as childUserApi from "../../services/childUserApi";
import * as userApi from "../../services/userApi";

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
