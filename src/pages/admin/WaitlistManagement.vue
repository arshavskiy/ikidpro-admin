<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Waitlist Management</h2>
        <p class="text-gray-600">Manage and monitor waitlist signups</p>
      </div>
      <div class="flex space-x-2">
        <n-button @click="refreshData" :loading="loading" type="primary">
          <template #icon>
            <i class="fas fa-sync-alt"></i>
          </template>
          Refresh
        </n-button>
        <n-button @click="exportWaitlist" type="success">
          <template #icon>
            <i class="fas fa-download"></i>
          </template>
          Export CSV
        </n-button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <n-card>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <i class="fas fa-users text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Subscribers</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalSubscribers || 0 }}
            </p>
          </div>
        </div>
      </n-card>

      <n-card>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <i class="fas fa-user-plus text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Recent Signups</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.recentSignups || 0 }}
            </p>
          </div>
        </div>
      </n-card>

      <n-card>
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <i class="fas fa-user-slash text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Inactive Users</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalInactive || 0 }}
            </p>
          </div>
        </div>
      </n-card>

      <n-card>
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 rounded-lg">
            <i class="fas fa-clock text-orange-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Last Updated</p>
            <p class="text-sm font-bold text-gray-900">
              {{ formatDateTime(stats.lastUpdated) }}
            </p>
          </div>
        </div>
      </n-card>
    </div>

    <!-- Source Breakdown -->
    <n-card v-if="stats.sourceBreakdown && stats.sourceBreakdown.length > 0">
      <template #header>
        <h3 class="text-lg font-medium">Signup Sources</h3>
      </template>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="source in stats.sourceBreakdown"
          :key="source._id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center">
            <n-tag :type="getSourceType(source._id)" size="small">
              {{ source._id || "Unknown" }}
            </n-tag>
          </div>
          <span class="font-bold text-gray-900">{{ source.count }}</span>
        </div>
      </div>
    </n-card>

    <!-- Filters and Search -->
    <n-card>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <n-input
          v-model:value="searchQuery"
          placeholder="Search by name or email..."
          @input="handleSearch"
          clearable
        >
          <template #prefix>
            <i class="fas fa-search text-gray-400"></i>
          </template>
        </n-input>

        <n-select
          v-model:value="sourceFilter"
          placeholder="Filter by source"
          @update:value="handleFilter"
          clearable
          :options="sourceOptions"
        >
        </n-select>

        <n-date-picker
          v-model:value="dateRange"
          type="daterange"
          placeholder="Select date range"
          @update:value="handleDateFilter"
          clearable
        />

        <n-button @click="clearFilters" secondary>
          <template #icon>
            <i class="fas fa-times"></i>
          </template>
          Clear Filters
        </n-button>
      </div>
    </n-card>

    <!-- Waitlist Table -->
    <n-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Waitlist Entries</h3>
          <n-badge :value="filteredData.length" type="info">
            <span>Total Entries</span>
          </n-badge>
        </div>
      </template>

      <n-data-table
        :columns="columns"
        :data="paginatedData"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row._id"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </n-card>

    <!-- Delete Confirmation Modal -->
    <n-modal v-model:show="showDeleteModal">
      <n-card
        style="width: 400px"
        title="Confirm Deletion"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button @click="showDeleteModal = false" quaternary circle>
            <template #icon>
              <i class="fas fa-times"></i>
            </template>
          </n-button>
        </template>

        <p class="text-gray-600 mb-4">
          Are you sure you want to remove
          <strong>{{ selectedEntry?.email }}</strong> from the waitlist?
        </p>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <n-button @click="showDeleteModal = false">Cancel</n-button>
            <n-button @click="confirmDelete" type="error" :loading="deleting">
              Delete
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Entry Details Modal -->
    <n-modal v-model:show="showDetailsModal">
      <n-card
        style="width: 600px"
        title="Waitlist Entry Details"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button @click="showDetailsModal = false" quaternary circle>
            <template #icon>
              <i class="fas fa-times"></i>
            </template>
          </n-button>
        </template>

        <div v-if="selectedEntry" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Name</label
              >
              <p class="text-gray-900">{{ selectedEntry.name || "N/A" }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <p class="text-gray-900">{{ selectedEntry.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Source</label
              >
              <n-tag :type="getSourceType(selectedEntry.source)">
                {{ selectedEntry.source || "Unknown" }}
              </n-tag>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Signup Date</label
              >
              <p class="text-gray-900">
                {{ formatDateTime(selectedEntry.createdAt) }}
              </p>
            </div>
          </div>

          <div v-if="selectedEntry.notes">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Notes</label
            >
            <p class="text-gray-900 bg-gray-50 p-3 rounded">
              {{ selectedEntry.notes }}
            </p>
          </div>
        </div>
      </n-card>
    </n-modal>

    <!-- Edit Notes Modal -->
    <n-modal v-model:show="showEditNotesModal">
      <n-card
        style="width: 600px"
        title="Edit Notes"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button @click="showEditNotesModal = false" quaternary circle>
            <template #icon>
              <i class="fas fa-times"></i>
            </template>
          </n-button>
        </template>

        <div v-if="selectedEntry" class="space-y-4">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              Editing notes for: <strong>{{ selectedEntry.email }}</strong>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <n-input
              v-model:value="editingNotes"
              placeholder="Enter notes for this waitlist entry..."
              :rows="6"
              show-count
              :maxlength="500"
              clearable
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <n-button @click="showEditNotesModal = false">Cancel</n-button>
            <n-button @click="updateNotes" type="primary" :loading="deleting">
              Save Notes
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import {
  NCard,
  NButton,
  NInput,
  NSelect,
  NDatePicker,
  NDataTable,
  NBadge,
  NModal,
  NTag,
  useMessage,
} from "naive-ui";
import apiClient from "@/services/apiClient";

// Reactive data
const loading = ref(false);
const deleting = ref(false);
const waitlistData = ref([]);
const stats = ref({});
const searchQuery = ref("");
const sourceFilter = ref(null);
const dateRange = ref(null);
const showDeleteModal = ref(false);
const showDetailsModal = ref(false);
const showEditNotesModal = ref(false);
const selectedEntry = ref(null);
const editingNotes = ref("");

const message = useMessage();

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
  showQuickJumper: true,
  prefix({ itemCount }) {
    return `Total ${itemCount} entries`;
  },
});

// Table columns
const columns = [
  {
    title: "Name",
    key: "name",
    width: 150,
    render(row) {
      return row.name || "N/A";
    },
  },
  {
    title: "Email",
    key: "email",
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "Source",
    key: "source",
    width: 120,
    render(row) {
      return h(
        NTag,
        {
          type: getSourceType(row.source),
        },
        {
          default: () => row.source || "Unknown",
        }
      );
    },
  },
  {
    title: "Signup Date",
    key: "createdAt",
    width: 180,
    render(row) {
      return formatDateTime(row.createdAt);
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 200,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "info",
            secondary: true,
            onClick: () => viewDetails(row),
            style: { marginRight: "4px" },
          },
          {
            icon: () => h("i", { class: "fas fa-eye" }),
            default: () => "View",
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "warning",
            secondary: true,
            onClick: () => editNotes(row),
            style: { marginRight: "4px" },
          },
          {
            icon: () => h("i", { class: "fas fa-edit" }),
            default: () => "Notes",
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            secondary: true,
            onClick: () => deleteEntry(row),
          },
          {
            icon: () => h("i", { class: "fas fa-trash" }),
            default: () => "Delete",
          }
        ),
      ];
    },
  },
];

const sourceOptions = [
  { value: "landing-page", label: "Landing Page" },
  { value: "website", label: "Website" },
  { value: "social-media", label: "Social Media" },
  { value: "referral", label: "Referral" },
];

// Computed properties
const filteredData = computed(() => {
  let filtered = [...waitlistData.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (entry) =>
        (entry.name && entry.name.toLowerCase().includes(query)) ||
        (entry.email && entry.email.toLowerCase().includes(query))
    );
  }

  // Source filter
  if (sourceFilter.value) {
    filtered = filtered.filter((entry) => entry.source === sourceFilter.value);
  }

  // Date range filter
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value;
    filtered = filtered.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const paginatedData = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredData.value.slice(start, end);
});

// Methods
const fetchWaitlistData = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/waitlist");
    waitlistData.value = response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    message.error("Failed to load waitlist data");
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const response = await apiClient.get("/waitlist/stats");
    stats.value = response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Don't show error for stats as it's not critical
  }
};

const refreshData = async () => {
  await Promise.all([fetchWaitlistData(), fetchStats()]);
};

const handleSearch = () => {
  pagination.value.page = 1;
};

const handleFilter = () => {
  pagination.value.page = 1;
};

const handleDateFilter = () => {
  pagination.value.page = 1;
};

const clearFilters = () => {
  searchQuery.value = "";
  sourceFilter.value = null;
  dateRange.value = null;
  pagination.value.page = 1;
};

const handlePageChange = (page) => {
  pagination.value.page = page;
};

const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize;
  pagination.value.page = 1;
};

const viewDetails = (entry) => {
  selectedEntry.value = entry;
  showDetailsModal.value = true;
};

const editNotes = (entry) => {
  selectedEntry.value = entry;
  editingNotes.value = entry.notes || "";
  showEditNotesModal.value = true;
};

const updateNotes = async () => {
  if (!selectedEntry.value) return;

  deleting.value = true; // Reuse the deleting state for loading
  try {
    await apiClient.put(`/waitlist/${selectedEntry.value._id}/notes`, {
      notes: editingNotes.value,
    });

    // Update the local data
    const index = waitlistData.value.findIndex(
      (entry) => entry._id === selectedEntry.value._id
    );
    if (index !== -1) {
      waitlistData.value[index].notes = editingNotes.value;
    }

    message.success("Notes updated successfully");
    showEditNotesModal.value = false;
    selectedEntry.value = null;
    editingNotes.value = "";
  } catch (error) {
    console.error("Error updating notes:", error);
    message.error("Failed to update notes");
  } finally {
    deleting.value = false;
  }
};

const deleteEntry = (entry) => {
  selectedEntry.value = entry;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!selectedEntry.value) return;

  deleting.value = true;
  try {
    await apiClient.delete(`/waitlist/${selectedEntry.value._id}`);
    message.success("Entry deleted successfully");
    showDeleteModal.value = false;
    selectedEntry.value = null;
    await refreshData();
  } catch (error) {
    console.error("Error deleting entry:", error);
    message.error("Failed to delete entry");
  } finally {
    deleting.value = false;
  }
};

const exportWaitlist = () => {
  const csvContent = [
    ["Name", "Email", "Source", "Notes", "Signup Date"],
    ...filteredData.value.map((entry) => [
      entry.name || "",
      entry.email || "",
      entry.source || "",
      entry.notes || "",
      formatDateTime(entry.createdAt),
    ]),
  ]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `waitlist_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const getSourceType = (source) => {
  const types = {
    "landing-page": "info",
    website: "success",
    "social-media": "warning",
    referral: "primary",
  };
  return types[source] || "default";
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
};

// Lifecycle
onMounted(() => {
  refreshData();
});

// Update pagination total when filtered data changes
computed(() => {
  pagination.value.itemCount = filteredData.value.length;
  return filteredData.value.length;
});
</script>
