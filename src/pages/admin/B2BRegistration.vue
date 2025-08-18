<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">B2B Registration</h2>
        <p class="text-gray-600">
          Manage business registrations and invite users
        </p>
      </div>
      <n-button @click="showCreateBusinessModal = true" type="primary">
        <template #icon>
          <i class="fas fa-plus"></i>
        </template>
        Create Business
      </n-button>
    </div>

    <!-- Business List -->
    <n-card>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Registered Businesses</h3>
        <n-input
          v-model:value="searchQuery"
          placeholder="Search businesses..."
          class="w-64"
        >
          <template #prefix>
            <i class="fas fa-search text-gray-400"></i>
          </template>
        </n-input>
      </div>

      <n-data-table
        :columns="businessColumns"
        :data="filteredBusinesses"
        :pagination="pagination"
        :loading="b2bStore.loading"
        :row-key="(row) => row._id"
      />
    </n-card>

    <!-- Create Business Modal -->
    <n-modal
      v-model:show="showCreateBusinessModal"
      preset="card"
      title="Create New Business"
      style="width: 600px"
    >
      <n-form
        ref="businessFormRef"
        :model="businessForm"
        :rules="businessRules"
        label-placement="left"
        label-width="120"
        require-mark-placement="right-hanging"
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
            :rows="3"
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
            :rows="3"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="showCreateBusinessModal = false"> Cancel </n-button>
          <n-button
            @click="createBusiness"
            type="primary"
            :loading="creatingBusiness"
          >
            Create Business
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- Invite Users Modal -->
    <n-modal
      v-model:show="showInviteUsersModal"
      preset="card"
      title="Invite Users to Business"
      style="width: 700px"
    >
      <div class="mb-4">
        <h4 class="text-lg font-medium text-gray-900 mb-2">
          {{ selectedBusiness?.name }}
        </h4>
        <p class="text-sm text-gray-600">Invite users to join this business</p>
      </div>

      <!-- Add New User Form -->
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <h5 class="text-md font-medium text-gray-900 mb-3">Add New User</h5>
        <div class="grid grid-cols-2 gap-4">
          <n-input v-model:value="newUser.firstName" placeholder="First Name" />
          <n-input v-model:value="newUser.lastName" placeholder="Last Name" />
          <n-input
            v-model:value="newUser.email"
            placeholder="Email"
            type="email"
          />
          <n-input v-model:value="newUser.phone" placeholder="Phone" />
        </div>
        <div class="mt-3">
          <n-button
            @click="addUserToList"
            type="primary"
            size="small"
            :disabled="!isValidNewUser"
          >
            <template #icon>
              <i class="fas fa-plus"></i>
            </template>
            Add to List
          </n-button>
        </div>
      </div>

      <!-- Users to Invite List -->
      <div class="mb-4">
        <h5 class="text-md font-medium text-gray-900 mb-3">
          Users to Invite ({{ usersToInvite.length }})
        </h5>
        <div
          v-if="usersToInvite.length === 0"
          class="text-gray-500 text-center py-4"
        >
          No users added yet
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(user, index) in usersToInvite"
            :key="index"
            class="flex items-center justify-between p-3 bg-white border rounded-lg"
          >
            <div>
              <div class="font-medium">
                {{ user.firstName }} {{ user.lastName }}
              </div>
              <div class="text-sm text-gray-600">
                {{ user.email }} • {{ user.phone }}
              </div>
            </div>
            <n-button
              @click="removeUserFromList(index)"
              size="small"
              type="error"
              ghost
            >
              <template #icon>
                <i class="fas fa-trash"></i>
              </template>
            </n-button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="showInviteUsersModal = false"> Cancel </n-button>
          <n-button
            @click="inviteUsers"
            type="primary"
            :loading="invitingUsers"
            :disabled="usersToInvite.length === 0"
          >
            Invite {{ usersToInvite.length }} User{{
              usersToInvite.length !== 1 ? "s" : ""
            }}
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- Business Details Modal -->
    <n-modal
      v-model:show="showBusinessDetailsModal"
      preset="card"
      title="Business Details"
      style="width: 800px"
    >
      <div v-if="selectedBusiness" class="space-y-6">
        <!-- Business Info -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-lg font-medium text-gray-900 mb-3">
            Business Information
          </h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Name</label>
              <p class="text-gray-900">{{ selectedBusiness.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Type</label>
              <p class="text-gray-900">{{ selectedBusiness.type }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Email</label>
              <p class="text-gray-900">{{ selectedBusiness.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Phone</label>
              <p class="text-gray-900">{{ selectedBusiness.phone }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Address</label>
              <p class="text-gray-900">{{ selectedBusiness.address }}</p>
            </div>
            <div class="col-span-2" v-if="selectedBusiness.description">
              <label class="text-sm font-medium text-gray-700"
                >Description</label
              >
              <p class="text-gray-900">{{ selectedBusiness.description }}</p>
            </div>
          </div>
          <!-- B2B API Action Buttons -->
          <div class="flex flex-wrap gap-2 mt-4">
            <n-button
              size="small"
              @click="fetchBusinessStats(selectedBusiness._id)"
              >Get Stats</n-button
            >
            <n-button
              size="small"
              @click="fetchBusinessById(selectedBusiness._id)"
              >Get By ID</n-button
            >
            <n-button size="small" @click="updateBusiness(selectedBusiness._id)"
              >Update</n-button
            >
            <n-button
              size="small"
              type="error"
              @click="deleteBusiness(selectedBusiness._id)"
              >Delete</n-button
            >
            <n-button size="small" @click="searchBusinesses">Search</n-button>
          </div>
        </div>

        <!-- Users List -->
        <div>
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-lg font-medium text-gray-900">Registered Users</h4>
            <n-button
              @click="openInviteUsersModal(selectedBusiness)"
              type="primary"
              size="small"
            >
              <template #icon>
                <i class="fas fa-plus"></i>
              </template>
              Invite Users
            </n-button>
          </div>

          <div
            v-if="selectedBusiness.users && selectedBusiness.users.length > 0"
          >
            <div class="space-y-2">
              <div
                v-for="user in selectedBusiness.users"
                :key="user._id"
                class="flex items-center justify-between p-3 bg-white border rounded-lg"
              >
                <div>
                  <div class="font-medium">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ user.email }} • {{ user.phone }}
                  </div>
                  <div class="text-xs text-gray-500">
                    Status:
                    <span :class="getStatusClass(user.status)">
                      {{ user.status }}
                    </span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <n-button
                    v-if="user.status === 'pending'"
                    @click="resendInvite(user._id)"
                    size="small"
                    type="info"
                    ghost
                  >
                    Resend Invite
                  </n-button>
                  <n-button
                    @click="removeUser(user._id)"
                    size="small"
                    type="error"
                    ghost
                  >
                    Remove
                  </n-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            No users registered yet
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button @click="showBusinessDetailsModal = false"> Close </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h, watch } from "vue";
import {
  NButton,
  NCard,
  NDataTable,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
} from "naive-ui";
import { useMessage } from "naive-ui";
import { useB2BStore } from "../../stores/b2bStore";

const message = useMessage();
const b2bStore = useB2BStore();

// Reactive data
const creatingBusiness = ref(false);
const invitingUsers = ref(false);
const searchQuery = ref("");
const showCreateBusinessModal = ref(false);
const showInviteUsersModal = ref(false);
const showBusinessDetailsModal = ref(false);
const selectedBusiness = ref(null);

// Business form
const businessFormRef = ref(null);
const businessForm = ref({
  name: "",
  type: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
});

// New user form
const newUser = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

// Users to invite list
const usersToInvite = ref([]);

// Business type options
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

// Business validation rules
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
};

// Get businesses from store
const businesses = computed(() => b2bStore.businesses);

watch(businesses, (val) => {
  console.log("Businesses changed:", val);
});

// Pagination
const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.value.page = page;
  },
  onUpdatePageSize: (pageSize) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
  },
});

// Computed properties
const filteredBusinesses = computed(() => {
  if (!searchQuery.value) return businesses.value;

  const query = searchQuery.value.toLowerCase();
  return businesses.value.filter(
    (business) =>
      business.name.toLowerCase().includes(query) ||
      business.type.toLowerCase().includes(query) ||
      business.email.toLowerCase().includes(query) ||
      business.address.toLowerCase().includes(query)
  );
});

const isValidNewUser = computed(() => {
  return (
    newUser.value.firstName &&
    newUser.value.lastName &&
    newUser.value.email &&
    newUser.value.phone
  );
});

// Table columns
const businessColumns = [
  {
    title: "Business Name",
    key: "name",
    render: (row) => {
      return h("div", [
        h("div", { class: "font-medium text-gray-900" }, row.name),
        h("div", { class: "text-sm text-gray-500" }, row.type),
      ]);
    },
  },
  {
    title: "Contact",
    key: "contact",
    render: (row) => {
      return h("div", [
        h("div", { class: "text-gray-900" }, row.email),
        h("div", { class: "text-sm text-gray-500" }, row.phone),
      ]);
    },
  },
  {
    title: "Address",
    key: "address",
    ellipsis: true,
  },
  {
    title: "Users",
    key: "users",
    render: (row) => {
      const activeUsers =
        row.users?.filter((u) => u.status === "active").length || 0;
      const pendingUsers =
        row.users?.filter((u) => u.status === "pending").length || 0;
      return h("div", [
        h("div", { class: "text-gray-900" }, `${activeUsers} active`),
        h("div", { class: "text-sm text-gray-500" }, `${pendingUsers} pending`),
      ]);
    },
  },
  {
    title: "Created",
    key: "createdAt",
    render: (row) => {
      return h(
        "div",
        { class: "text-gray-500" },
        new Date(row.createdAt).toLocaleDateString()
      );
    },
  },
  {
    title: "Actions",
    width: "550px",
    key: "actions",
    render: (row) => {
      return h("div", { class: "flex space-x-2" }, [
        h(
          NButton,
          {
            size: "small",
            onClick: () => openBusinessDetails(row),
          },
          { default: () => "View Details" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            ghost: true,
            onClick: () => openInviteUsersModal(row),
          },
          { default: () => "Invite Users" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "info",
            ghost: true,
            onClick: () => fetchBusinessStats(row._id),
          },
          { default: () => "Get Stats" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "info",
            ghost: true,
            onClick: () => fetchBusinessById(row._id),
          },
          { default: () => "Get By ID" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "warning",
            ghost: true,
            onClick: () => updateBusiness(row._id),
          },
          { default: () => "Update" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            ghost: true,
            onClick: () => deleteBusiness(row._id),
          },
          { default: () => "Delete" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "default",
            ghost: true,
            onClick: () => searchBusinesses(),
          },
          { default: () => "Search" }
        ),
      ]);
    },
  },
];

// Methods
const createBusiness = async () => {
  try {
    await businessFormRef.value?.validate();
    creatingBusiness.value = true;

    await b2bStore.createBusiness(businessForm.value);
    message.success("Business created successfully!");
    showCreateBusinessModal.value = false;
    resetBusinessForm();
  } catch (error) {
    console.error("Error creating business:", error);
    message.error("Failed to create business");
  } finally {
    creatingBusiness.value = false;
  }
};

// B2B API UI Button Methods
const fetchBusinessStats = async (id) => {
  try {
    await b2bStore.fetchBusinessStats(id);
    message.success("Fetched business stats");
  } catch (error) {
    message.error("Failed to fetch stats");
  }
};
const fetchBusinessById = async (id) => {
  try {
    await b2bStore.fetchBusinessById(id);
    message.success("Fetched business by ID");
  } catch (error) {
    message.error("Failed to fetch business");
  }
};
const updateBusiness = async (id) => {
  try {
    await b2bStore.updateBusiness(id, businessForm.value);
    message.success("Business updated");
  } catch (error) {
    message.error("Failed to update business");
  }
};
const deleteBusiness = async (id) => {
  try {
    await b2bStore.deleteBusiness(id);
    message.success("Business deleted");
  } catch (error) {
    message.error("Failed to delete business");
  }
};
const searchBusinesses = async () => {
  try {
    await b2bStore.searchBusinesses(searchQuery.value);
    message.success("Search complete");
  } catch (error) {
    message.error("Search failed");
  }
};

const resetBusinessForm = () => {
  businessForm.value = {
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
  };
  businessFormRef.value?.restoreValidation();
};

const openBusinessDetails = (business) => {
  selectedBusiness.value = business;
  showBusinessDetailsModal.value = true;
};

const openInviteUsersModal = (business) => {
  selectedBusiness.value = business;
  usersToInvite.value = [];
  showInviteUsersModal.value = true;
};

const addUserToList = () => {
  if (!isValidNewUser.value) return;

  usersToInvite.value.push({
    ...newUser.value,
    _id: Date.now().toString(),
  });

  // Reset form
  newUser.value = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  message.success("User added to invite list");
};

const removeUserFromList = (index) => {
  usersToInvite.value.splice(index, 1);
};

const inviteUsers = async () => {
  try {
    invitingUsers.value = true;

    await b2bStore.inviteUsers(selectedBusiness.value._id, usersToInvite.value);
    message.success(
      `${usersToInvite.value.length} user(s) invited successfully!`
    );
    showInviteUsersModal.value = false;
    usersToInvite.value = [];
  } catch (error) {
    console.error("Error inviting users:", error);
    message.error("Failed to invite users");
  } finally {
    invitingUsers.value = false;
  }
};

const resendInvite = async (userId) => {
  try {
    await b2bStore.resendInvite(selectedBusiness.value._id, userId);
    message.success("Invite resent successfully!");
  } catch (error) {
    console.error("Error resending invite:", error);
    message.error("Failed to resend invite");
  }
};

const removeUser = async (userId) => {
  try {
    await b2bStore.removeUser(selectedBusiness.value._id, userId);
    message.success("User removed successfully!");
  } catch (error) {
    console.error("Error removing user:", error);
    message.error("Failed to remove user");
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
    case "pending":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs";
    case "inactive":
      return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
    default:
      return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs";
  }
};

// Lifecycle
onMounted(async () => {
  // Load businesses data from store
  await b2bStore.fetchBusinesses();
  console.log("Businesses loaded:", b2bStore.businesses);
  console.log("Businesses loaded:", businesses.value);
});
</script>
