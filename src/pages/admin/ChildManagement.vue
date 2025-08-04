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
    <n-card>
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
    </n-card>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatisticsCard
        label="Total Children"
        :value="totalChildren"
        icon="fas fa-child"
        variant="blue"
      />

      <StatisticsCard
        label="Male/Female"
        :value="`${maleCount}/${femaleCount}`"
        icon="fas fa-venus-mars"
        variant="green"
      />

      <StatisticsCard
        label="Avg Age"
        :value="`${averageAge} years`"
        icon="fas fa-birthday-cake"
        variant="yellow"
      />

      <StatisticsCard
        label="With Conditions"
        :value="childrenWithConditions"
        icon="fas fa-heart"
        variant="red"
      />
    </div>

    <!-- Children Table -->
    <n-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-medium text-gray-900">All Children</h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>{{ filteredChildren.length }} total</span>
              <span
                v-if="checkedRowKeys.length > 0"
                class="text-blue-600 font-medium"
              >
                | {{ checkedRowKeys.length }} selected
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Column Visibility Selector -->
            <n-dropdown :options="columnOptions" @select="handleColumnSelect">
              <n-button type="default" size="small">
                <template #icon>
                  <i class="fas fa-columns"></i>
                </template>
                Show Columns ({{ visibleColumns.length }}/{{
                  availableColumns.length
                }})
              </n-button>
            </n-dropdown>

            <n-button
              v-if="checkedRowKeys.length > 0"
              type="error"
              size="small"
              @click="handleBulkDelete"
            >
              <template #icon>
                <i class="fas fa-trash"></i>
              </template>
              Delete Selected ({{ checkedRowKeys.length }})
            </n-button>
            <n-button
              @click="router.push('/admin/children/create')"
              type="primary"
              size="small"
            >
              <template #icon>
                <i class="fas fa-plus"></i>
              </template>
              Add Child
            </n-button>
          </div>
        </div>
      </template>

      <!-- Naive UI Data Table -->
      <n-data-table
        :columns="columns"
        :data="filteredChildren"
        :loading="loading"
        :row-key="rowKey"
        :checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
        :pagination="pagination"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        :bordered="false"
        striped
        size="medium"
        flex-height
        style="min-height: 600px"
        :scroll-x="1200"
      />
    </n-card>

    <!-- Child Detail Modal -->
    <n-modal
      v-model:show="showChildModal"
      preset="card"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      title="Child Details"
      size="huge"
      :bordered="false"
      segmented
    >
      <template #header-extra>
        <n-button
          @click="selectedChild = null"
          quaternary
          circle
          type="default"
        >
          <template #icon>
            <i class="fas fa-times"></i>
          </template>
        </n-button>
      </template>

      <div v-if="selectedChild" class="space-y-6">
        <!-- Child Profile Header -->
        <n-card title="Profile Overview" :bordered="false">
          <div class="flex items-center space-x-4">
            <n-avatar
              :size="80"
              round
              color="#8b5cf6"
              :style="{ backgroundColor: '#f3e8ff', color: '#8b5cf6' }"
            >
              {{
                (selectedChild.firstName?.[0] || "") +
                (selectedChild.lastName?.[0] || "")
              }}
            </n-avatar>
            <div>
              <h3 class="text-2xl font-bold text-gray-900">
                {{ selectedChild.firstName }} {{ selectedChild.lastName }}
              </h3>
              <div class="flex items-center space-x-4 mt-2">
                <n-tag type="success" size="medium">
                  ID: {{ selectedChild._id?.slice(-8) || "N/A" }}
                </n-tag>
                <n-tag type="info" size="medium">
                  AID: {{ selectedChild.aid || "N/A" }}
                </n-tag>
                <span class="text-lg text-gray-600">
                  {{ selectedChild.age || "N/A" }} years old
                </span>
              </div>
            </div>
          </div>
        </n-card>

        <!-- Information Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Basic Information Card -->
          <n-card title="Basic Information" :bordered="false">
            <template #header-extra>
              <i class="fas fa-user text-blue-600"></i>
            </template>
            <n-descriptions :column="1" size="small">
              <n-descriptions-item label="Full Name">
                {{ selectedChild.firstName }} {{ selectedChild.lastName }}
              </n-descriptions-item>
              <n-descriptions-item label="Gender">
                <n-tag
                  :type="
                    selectedChild.gender === 'Male'
                      ? 'info'
                      : selectedChild.gender === 'Female'
                      ? 'warning'
                      : 'default'
                  "
                  size="small"
                >
                  {{ selectedChild.gender || "Unknown" }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="Date of Birth">
                {{ formatDate(selectedChild.dateOfBirth) }}
              </n-descriptions-item>
              <n-descriptions-item label="Age">
                {{ selectedChild.age || "N/A" }} years
              </n-descriptions-item>
            </n-descriptions>
          </n-card>

          <!-- Physical Information Card -->
          <n-card title="Physical Information" :bordered="false">
            <template #header-extra>
              <i class="fas fa-weight text-green-600"></i>
            </template>
            <n-descriptions :column="1" size="small">
              <n-descriptions-item label="Height">
                {{
                  selectedChild.height
                    ? `${selectedChild.height} cm`
                    : "Not provided"
                }}
              </n-descriptions-item>
              <n-descriptions-item label="Weight">
                {{
                  selectedChild.weight
                    ? `${selectedChild.weight} kg`
                    : "Not provided"
                }}
              </n-descriptions-item>
              <n-descriptions-item label="Emergency Contact">
                <div
                  v-if="selectedChild.emergencyContact?.name"
                  class="space-y-1"
                >
                  <div class="font-medium">
                    {{ selectedChild.emergencyContact.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ selectedChild.emergencyContact.phone }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ selectedChild.emergencyContact.relationship }}
                  </div>
                </div>
                <span v-else class="text-gray-500">Not provided</span>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>

          <!-- Medical Information Card -->
          <n-card title="Medical Information" :bordered="false">
            <template #header-extra>
              <i class="fas fa-heartbeat text-red-600"></i>
            </template>
            <n-descriptions :column="1" size="small">
              <n-descriptions-item label="Medical Conditions">
                <div
                  v-if="selectedChild.medicalCondition?.length > 0"
                  class="space-y-2"
                >
                  <n-space size="small">
                    <n-tag
                      v-for="condition in selectedChild.medicalCondition"
                      :key="condition"
                      type="error"
                      size="small"
                    >
                      {{ condition }}
                    </n-tag>
                  </n-space>
                </div>
                <span v-else class="text-gray-500">None</span>
              </n-descriptions-item>
              <n-descriptions-item label="Limitations">
                <div
                  v-if="selectedChild.limitations?.length > 0"
                  class="space-y-2"
                >
                  <n-space size="small">
                    <n-tag
                      v-for="limitation in selectedChild.limitations"
                      :key="limitation"
                      type="warning"
                      size="small"
                    >
                      {{ limitation }}
                    </n-tag>
                  </n-space>
                </div>
                <span v-else class="text-gray-500">None</span>
              </n-descriptions-item>
              <n-descriptions-item label="Notes">
                <div class="text-sm">
                  {{ selectedChild.notes || "No notes available" }}
                </div>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <n-button @click="editChild(selectedChild)" type="primary">
            <template #icon>
              <i class="fas fa-edit"></i>
            </template>
            Edit Child
          </n-button>
          <n-button @click="selectedChild = null" type="default">
            Close
          </n-button>
        </div>
      </div>
    </n-modal>

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
import { ref, computed, onMounted, h, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
import {
  NButton,
  NTag,
  NAvatar,
  NSpace,
  NPopconfirm,
  NCard,
  NCheckbox,
  NDropdown,
  NModal,
  NDescriptions,
  NDescriptionsItem,
} from "naive-ui";
import * as childUserApi from "../../services/childUserApi";
import StatisticsCard from "../../components/StatisticsCard.vue";

const router = useRouter();
const message = useMessage();
const dialog = useDialog();

// Reactive data
const children = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedGenderFilter = ref("");
const selectedAgeFilter = ref("");
const selectedChild = ref(null);
const childToDelete = ref(null);
const showDeleteModal = ref(false);
const checkedRowKeys = ref([]);

// Modal visibility
const showChildModal = computed({
  get: () => !!selectedChild.value,
  set: (value) => {
    if (!value) selectedChild.value = null;
  },
});

// Column visibility state
const visibleColumns = ref([
  "childInfo",
  "aid",
  "ageGender",
  "physical",
  "parent",
  "medical",
  "actions",
]);

const availableColumns = [
  { key: "childInfo", title: "Child Info", default: true },
  { key: "aid", title: "AID", default: true },
  { key: "ageGender", title: "Age & Gender", default: true },
  { key: "physical", title: "Physical Info", default: true },
  { key: "parent", title: "Parent", default: true },
  { key: "medical", title: "Medical Info", default: true },
  { key: "actions", title: "Actions", default: true },
];

const fieldMappings = {
  aid: { title: "AID", default: true },
  age: { title: "Age", default: true, group: "basic" },
  gender: { title: "Gender", default: true, group: "basic" },
  dateOfBirth: { title: "Date of Birth", default: false, group: "basic" },
  height: { title: "Height", default: false, group: "physical" },
  weight: { title: "Weight", default: false, group: "physical" },
  firstName: { title: "First Name", default: false, group: "basic" },
  lastName: { title: "Last Name", default: false, group: "basic" },
  parentId: { title: "Parent ID", default: true, group: "family" },
  medicalCondition: {
    title: "Medical Conditions",
    default: true,
    group: "medical",
  },
  limitations: { title: "Limitations", default: false, group: "medical" },
  notes: { title: "Notes", default: false, group: "other" },
  emergencyContact: {
    title: "Emergency Contact",
    default: false,
    group: "contact",
  },
  _id: { title: "Database ID", default: false, group: "system" },
  createdAt: { title: "Created Date", default: false, group: "system" },
  updatedAt: { title: "Updated Date", default: false, group: "system" },
};

// Table configuration
const rowKey = (row) => row._id;

const pagination = ref({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  showQuickJumper: true,
  prefix: ({ itemCount }) => `Total: ${itemCount}`,
});

// Methods (defined early for use in render functions)
const viewChild = (child) => {
  selectedChild.value = child;
};

const editChild = (child) => {
  // Navigate to edit page
  router.push(`/admin/children/edit/${child._id}`);
};

const confirmDeleteSingle = async (child) => {
  try {
    await childUserApi.deleteChildUser(child._id);
    children.value = children.value.filter((c) => c._id !== child._id);
    message.success(
      `Successfully deleted ${child.firstName} ${child.lastName}`
    );
  } catch (error) {
    console.error("Error deleting child:", error);
    message.error("Failed to delete child. Please try again.");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getParentName = (parentId) => {
  // In a real implementation, you would look up the parent's name
  return "Parent";
};

// Table columns configuration
const allColumns = [
  {
    type: "selection",
    multiple: true,
    width: 40,
    fixed: "left",
  },
  {
    key: "childInfo",
    title: "Child Info",
    width: 150,
    render(row) {
      return h("div", { class: "flex items-center" }, [
        h(
          NAvatar,
          {
            round: true,
            size: 40,
            color: "#8b5cf6",
            style: { backgroundColor: "#f3e8ff", color: "#8b5cf6" },
          },
          {
            default: () =>
              (row.firstName?.[0] || "") + (row.lastName?.[0] || ""),
          }
        ),
        h("div", { class: "ml-3" }, [
          h(
            "div",
            { class: "font-medium text-gray-900" },
            `${row.firstName || ""} ${row.lastName || ""}`
          ),
          h(
            "div",
            { class: "text-sm text-gray-500" },
            `ID: ${row._id?.slice(-8) || "N/A"}`
          ),
        ]),
      ]);
    },
  },
  {
    key: "aid",
    title: "AID",
    width: 130,
    render(row) {
      return h(
        NTag,
        {
          type: "success",
          size: "small",
        },
        { default: () => row.aid || "N/A" }
      );
    },
  },
  {
    key: "ageGender",
    title: "Age & Gender",
    width: 120,
    render(row) {
      const genderIcon =
        row.gender === "Male" ? "♂" : row.gender === "Female" ? "♀" : "?";
      const genderColor =
        row.gender === "Male"
          ? "#3b82f6"
          : row.gender === "Female"
          ? "#ec4899"
          : "#6b7280";

      return h("div", {}, [
        h("div", { class: "font-medium" }, `${row.age || "N/A"} years`),
        h(
          "div",
          {
            class: "text-sm",
            style: { color: genderColor },
          },
          `${genderIcon} ${row.gender || "Unknown"}`
        ),
      ]);
    },
  },
  {
    key: "physical",
    title: "Physical Info",
    width: 150,
    render(row) {
      return h("div", {}, [
        h(
          "div",
          { class: "text-sm" },
          row.height || row.weight
            ? `${row.height || "N/A"}cm / ${row.weight || "N/A"}kg`
            : "Not provided"
        ),
        h(
          "div",
          { class: "text-xs text-gray-500" },
          `DOB: ${formatDate(row.dateOfBirth)}`
        ),
      ]);
    },
  },
  {
    key: "parent",
    title: "Parent",
    width: 150,
    render(row) {
      return h("div", {}, [
        h("div", { class: "text-sm font-medium" }, getParentName(row.parent)),
        h("div", { class: "text-xs text-gray-500" }, row.parentId || "N/A"),
      ]);
    },
  },
  {
    key: "medical",
    title: "Medical Info",
    width: 200,
    render(row) {
      if (row.medicalCondition?.length > 0) {
        const visibleConditions = row.medicalCondition.slice(0, 2);
        const remainingCount = row.medicalCondition.length - 2;
        const { height, weight } = row;

        return h("div", { class: "space-y-1" }, [
          h(
            NSpace,
            { size: "small" },
            {
              default: () =>
                visibleConditions.map((condition) =>
                  h(
                    NTag,
                    {
                      type: "error",
                      size: "small",
                      key: condition,
                    },
                    { default: () => condition }
                  )
                ),
            }
          ),
          remainingCount > 0 &&
            h(
              "div",
              { class: "text-xs text-gray-500" },
              `+${remainingCount} more`
            ),
          h(
            "div",
            { class: "text-xs text-gray-500" },
            height || weight
              ? `Height: ${height || "N/A"}cm, Weight: ${weight || "N/A"}kg`
              : "No physical info"
          ),
        ]);
      }
      return h("div", { class: "text-sm text-gray-500" }, "No conditions");
    },
  },
  {
    key: "actions",
    title: "Actions",
    width: 150,
    render(row) {
      const handleViewClick = () => {
        viewChild(row);
      };

      const handleEditClick = () => {
        editChild(row);
      };

      const handleDeleteClick = () => {
        return confirmDeleteSingle(row);
      };

      return h(
        NSpace,
        { size: "small" },
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                type: "info",
                secondary: true,
                onClick: handleViewClick,
              },
              {
                default: () => h("i", { class: "fas fa-eye" }),
              }
            ),
            h(
              NButton,
              {
                size: "small",
                type: "primary",
                secondary: true,
                onClick: handleEditClick,
              },
              {
                default: () => h("i", { class: "fas fa-edit" }),
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: handleDeleteClick,
              },
              {
                default: () => "Are you sure you want to delete this child?",
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: "small",
                      type: "error",
                      secondary: true,
                    },
                    {
                      default: () => h("i", { class: "fas fa-trash" }),
                    }
                  ),
              }
            ),
          ],
        }
      );
    },
  },
];

// Computed columns based on visibility
const columns = computed(() => {
  const selectionColumn = allColumns[0]; // Always include selection column
  const filteredColumns = allColumns
    .slice(1)
    .filter((col) => visibleColumns.value.includes(col.key));
  return [selectionColumn, ...filteredColumns];
});

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

// Column options for dropdown
const columnOptions = computed(() => [
  {
    key: "show-all",
    label: "Show All Columns",
    icon: () => h("i", { class: "fas fa-eye text-blue-600" }),
  },
  {
    key: "reset-default",
    label: "Reset to Default",
    icon: () => h("i", { class: "fas fa-undo text-orange-600" }),
  },
  {
    type: "divider",
  },
  ...availableColumns.map((col) => ({
    key: col.key,
    label: col.title,
    disabled: false,
    icon: () =>
      h("i", {
        class: visibleColumns.value.includes(col.key)
          ? "fas fa-check-square text-green-600"
          : "fas fa-square text-gray-400",
      }),
  })),
]);

// Methods
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys;
};

const handleColumnSelect = (key) => {
  if (key === "show-all") {
    showAllColumns();
  } else if (key === "reset-default") {
    showDefaultColumns();
  } else if (visibleColumns.value.includes(key)) {
    // Don't allow hiding all columns
    if (visibleColumns.value.length > 1) {
      visibleColumns.value = visibleColumns.value.filter((col) => col !== key);
    }
  } else {
    visibleColumns.value.push(key);
  }
};

const selectAll = () => {
  checkedRowKeys.value = filteredChildren.value.map((child) => child._id);
};

const selectNone = () => {
  checkedRowKeys.value = [];
};

const showAllColumns = () => {
  visibleColumns.value = availableColumns.map((col) => col.key);
};

const showDefaultColumns = () => {
  visibleColumns.value = availableColumns
    .filter((col) => col.default)
    .map((col) => col.key);
};

const handlePageChange = (page) => {
  pagination.value.page = page;
};

const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize;
  pagination.value.page = 1; // Reset to first page when changing page size
};

const handleBulkDelete = () => {
  if (checkedRowKeys.value.length === 0) return;

  dialog.warning({
    title: "Confirm Bulk Delete",
    content: `Are you sure you want to delete ${checkedRowKeys.value.length} selected children? This action cannot be undone.`,
    positiveText: "Delete All",
    negativeText: "Cancel",
    onPositiveClick: confirmBulkDelete,
  });
};

const confirmBulkDelete = async () => {
  try {
    loading.value = true;
    const deletePromises = checkedRowKeys.value.map((id) =>
      childUserApi.deleteChildUser(id)
    );

    await Promise.all(deletePromises);

    // Remove deleted children from the list
    children.value = children.value.filter(
      (child) => !checkedRowKeys.value.includes(child._id)
    );

    checkedRowKeys.value = [];
    message.success(`Successfully deleted ${deletePromises.length} children`);
  } catch (error) {
    console.error("Error deleting children:", error);
    message.error("Failed to delete some children. Please try again.");
  } finally {
    loading.value = false;
  }
};

// const confirmDeleteSingle = async (child) => {
//   try {
//     await childUserApi.deleteChildUser(child._id);
//     children.value = children.value.filter((c) => c._id !== child._id);
//     message.success(
//       `Successfully deleted ${child.firstName} ${child.lastName}`
//     );
//   } catch (error) {
//     console.error("Error deleting child:", error);
//     message.error("Failed to delete child. Please try again.");
//   }
// };

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

// Lifecycle
onMounted(() => {
  loadChildren();
});

// Watch for filter changes and clear selection
watch([searchQuery, selectedGenderFilter, selectedAgeFilter], () => {
  checkedRowKeys.value = [];
});
</script>
