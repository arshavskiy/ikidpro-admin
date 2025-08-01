<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Child Management</h2>
        <p class="text-gray-600">Manage all child users in the system</p>
      </div>
      <router-link
        to="/admin/children/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>Add New Child
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search children by name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          v-model="selectedGenderFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        <select
          v-model="selectedAgeFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Ages</option>
          <option value="0-2">0-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="6-8">6-8 years</option>
          <option value="9-12">9-12 years</option>
          <option value="13-18">13-18 years</option>
        </select>
        <button
          @click="refreshChildren"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <i class="fas fa-refresh mr-2"></i>Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-child text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Children</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalChildren }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-venus-mars text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Male/Female</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ maleCount }}/{{ femaleCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <i class="fas fa-birthday-cake text-yellow-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Avg Age</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ averageAge }} years
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded-full">
            <i class="fas fa-heart text-red-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">With Conditions</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ childrenWithConditions }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Children Table -->
    <div
      v-if="!loading && filteredChildren.length > 0"
      class="bg-white rounded-lg shadow-sm border overflow-hidden max-h-150"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">All Children</h3>
      </div>

      <div class="overflow-y-auto max-h-150">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Child Info
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                AID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Age & Gender
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Physical Info
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Parent
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Medical Info
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
              v-for="child in filteredChildren"
              :key="child._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-purple-600 font-medium">
                      {{
                        (child.firstName?.[0] || "") +
                        (child.lastName?.[0] || "")
                      }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ child.firstName }} {{ child.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ child._id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ child.aid || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ child.age || "N/A" }} years old
                </div>
                <div class="text-sm text-gray-500">{{ child.gender }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ child.height || "N/A" }}cm / {{ child.weight || "N/A" }}kg
                </div>
                <div class="text-sm text-gray-500">
                  DOB: {{ formatDate(child.dateOfBirth) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ getParentName(child.parentId) }}
                </div>
                <div class="text-sm text-gray-500">{{ child.parentId }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  v-if="child.medicalCondition?.length > 0"
                  class="space-y-1"
                >
                  <span
                    v-for="condition in child.medicalCondition.slice(0, 2)"
                    :key="condition"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-1"
                  >
                    {{ condition }}
                  </span>
                  <div
                    v-if="child.medicalCondition.length > 2"
                    class="text-xs text-gray-500"
                  >
                    +{{ child.medicalCondition.length - 2 }} more
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">No conditions</div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
              >
                <button
                  @click="viewChild(child)"
                  class="text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editChild(child)"
                  class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteChild(child)"
                  class="text-red-600 hover:text-red-900 cursor-pointer"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && filteredChildren.length === 0"
        class="text-center py-12"
      >
        <i class="fas fa-child text-gray-400 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No children found
        </h3>
        <p class="text-gray-500" v-if="children.length === 0">
          No children are registered in the system yet.
        </p>
        <p class="text-gray-500" v-else>
          No children match your search criteria.
        </p>
        <router-link
          to="/admin/children/create"
          class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add First Child
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-500">Loading children...</p>
      </div>
    </div>

    <!-- Child Detail Modal -->
    <div
      v-if="selectedChild"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Child Details</h3>
            <button
              @click="selectedChild = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-3 gap-6">
            <!-- Basic Info -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Basic Information</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Full Name</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedChild.firstName }} {{ selectedChild.lastName }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Gender</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedChild.gender }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Date of Birth</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDate(selectedChild.dateOfBirth) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Age</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedChild.age }} years
                </p>
              </div>
            </div>

            <!-- Physical Info -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Physical Information</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Height</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedChild.height || "Not provided" }} cm
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Weight</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedChild.weight || "Not provided" }} kg
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Emergency Contact</label
                >
                <div
                  v-if="selectedChild.emergencyContact?.name"
                  class="mt-1 text-sm text-gray-900"
                >
                  <p>{{ selectedChild.emergencyContact.name }}</p>
                  <p>{{ selectedChild.emergencyContact.phone }}</p>
                  <p>{{ selectedChild.emergencyContact.relationship }}</p>
                </div>
                <p v-else class="mt-1 text-sm text-gray-500">Not provided</p>
              </div>
            </div>

            <!-- Medical Info -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Medical Information</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Medical Conditions</label
                >
                <div
                  v-if="selectedChild.medicalCondition?.length > 0"
                  class="mt-1 space-y-1"
                >
                  <span
                    v-for="condition in selectedChild.medicalCondition"
                    :key="condition"
                    class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mr-1 mb-1"
                  >
                    {{ condition }}
                  </span>
                </div>
                <p v-else class="mt-1 text-sm text-gray-500">None</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Limitations</label
                >
                <div
                  v-if="selectedChild.limitations?.length > 0"
                  class="mt-1 space-y-1"
                >
                  <span
                    v-for="limitation in selectedChild.limitations"
                    :key="limitation"
                    class="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mr-1 mb-1"
                  >
                    {{ limitation }}
                  </span>
                </div>
                <p v-else class="mt-1 text-sm text-gray-500">None</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Notes</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedChild.notes || "No notes" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Delete Modal -->
    <div
      v-if="showDeleteModal && childToDelete"
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
            Delete Child
          </h3>

          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete
            <span class="font-semibold text-gray-900">
              {{ childToDelete.firstName }} {{ childToDelete.lastName }} </span
            >? This action cannot be undone and will permanently remove all
            associated data.
          </p>

          <div
            class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6"
          >
            <div class="flex">
              <i
                class="fas fa-exclamation-triangle text-yellow-400 mr-3 mt-0.5"
              ></i>
              <div>
                <h4 class="text-sm font-medium text-yellow-800">Warning</h4>
                <p class="text-sm text-yellow-700 mt-1">
                  Deleting this child will also remove:
                </p>
                <ul class="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>All associated events and sensor data</li>
                  <li>Medical records and conditions</li>
                  <li>Emergency contact information</li>
                  <li>Any related analytics data</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <i class="fas fa-trash mr-2"></i>
              Delete Child
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
import * as childUserApi from "../../services/childUserApi";

const router = useRouter();

// Reactive data
const children = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedGenderFilter = ref("");
const selectedAgeFilter = ref("");
const selectedChild = ref(null);
const childToDelete = ref(null);
const showDeleteModal = ref(false);

// Computed properties
const filteredChildren = computed(() => {
  let filtered = children.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (child) =>
        child.firstName?.toLowerCase().includes(query) ||
        child.lastName?.toLowerCase().includes(query)
    );
  }

  // Gender filter
  if (selectedGenderFilter.value) {
    filtered = filtered.filter(
      (child) => child.gender === selectedGenderFilter.value
    );
  }

  // Age filter
  if (selectedAgeFilter.value) {
    const [minAge, maxAge] = selectedAgeFilter.value.split("-").map(Number);
    filtered = filtered.filter((child) => {
      const age = child.age;
      return age >= minAge && age <= maxAge;
    });
  }

  return filtered;
});

const totalChildren = computed(() => children.value.length);
const maleCount = computed(
  () => children.value.filter((child) => child.gender === "Male").length
);
const femaleCount = computed(
  () => children.value.filter((child) => child.gender === "Female").length
);
const averageAge = computed(() => {
  const ages = children.value
    .filter((child) => child.age)
    .map((child) => child.age);
  return ages.length > 0
    ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)
    : 0;
});
const childrenWithConditions = computed(
  () =>
    children.value.filter((child) => child.medicalCondition?.length > 0).length
);

// Methods
const loadChildren = async () => {
  try {
    loading.value = true;
    console.log("🔄 Loading all children from API...");

    const response = await childUserApi.getAllChildUsers();
    console.log("📋 API Response:", response.data);

    // Extract children data from API response
    children.value = response.data.data || response.data || [];

    console.log(`✅ Loaded ${children.value.length} children successfully`);
  } catch (error) {
    console.error("❌ Error loading children:", error);

    // Show more detailed error information
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    // Initialize with empty array on error
    children.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshChildren = () => {
  loadChildren();
};

const viewChild = (child) => {
  selectedChild.value = child;
};

const editChild = (child) => {
  console.log("Edit child:", child);
  // Navigate to edit page
  router.push(`/admin/children/edit/${child._id}`);
};

const deleteChild = (child) => {
  childToDelete.value = child;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!childToDelete.value) return;

  try {
    await childUserApi.deleteChildUser(childToDelete.value._id);
    children.value = children.value.filter(
      (c) => c._id !== childToDelete.value._id
    );
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting child:", error);
    alert("Error deleting child");
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  childToDelete.value = null;
};

const getParentName = (parentId) => {
  // In a real implementation, you would look up the parent's name
  return "Parent Name";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Lifecycle
onMounted(() => {
  loadChildren();
});
</script>
