<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">API Testing Interface</h2>
      <p class="text-gray-600">
        Test all available API endpoints directly from the admin panel
      </p>

      <!-- Token Status -->
      <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i class="fas fa-key text-blue-600"></i>
            <span class="text-sm font-medium text-blue-800"
              >Authentication Status:</span
            >
            <span
              class="text-sm"
              :class="hasToken ? 'text-green-600' : 'text-red-600'"
            >
              {{ hasToken ? "✓ Token Available" : "✗ No Token Found" }}
            </span>
          </div>
          <button
            @click="refreshTokenStatus"
            class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            <i class="fas fa-refresh mr-1"></i>Refresh
          </button>
        </div>
        <div v-if="hasToken" class="mt-2 text-xs text-gray-600">
          <span class="font-medium">Token Preview:</span>
          <span class="font-mono bg-gray-100 px-1 rounded">
            {{ tokenPreview }}
          </span>
        </div>
        <p class="text-xs text-blue-600 mt-1">
          All requests will automatically include the authentication token if
          available.
        </p>
      </div>
    </div>

    <!-- API Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- User APIs -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center mb-4">
          <i class="fas fa-users text-blue-600 text-xl mr-3"></i>
          <h3 class="text-lg font-medium text-gray-900">User APIs</h3>
        </div>
        <div class="space-y-2">
          <button
            v-for="endpoint in userEndpoints"
            :key="endpoint.name"
            @click="testEndpoint(endpoint)"
            class="w-full text-left px-3 py-2 text-sm rounded border hover:bg-gray-50"
            :class="getMethodClass(endpoint.method)"
          >
            <span class="font-mono text-xs mr-2">{{ endpoint.method }}</span>
            {{ endpoint.name }}
          </button>
        </div>
      </div>

      <!-- Child User APIs -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center mb-4">
          <i class="fas fa-child text-purple-600 text-xl mr-3"></i>
          <h3 class="text-lg font-medium text-gray-900">Child User APIs</h3>
        </div>
        <div class="space-y-2">
          <button
            v-for="endpoint in childEndpoints"
            :key="endpoint.name"
            @click="testEndpoint(endpoint)"
            class="w-full text-left px-3 py-2 text-sm rounded border hover:bg-gray-50"
            :class="getMethodClass(endpoint.method)"
          >
            <span class="font-mono text-xs mr-2">{{ endpoint.method }}</span>
            {{ endpoint.name }}
          </button>
        </div>
      </div>

      <!-- Event APIs -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center mb-4">
          <i class="fas fa-chart-line text-green-600 text-xl mr-3"></i>
          <h3 class="text-lg font-medium text-gray-900">Event APIs</h3>
        </div>
        <div class="space-y-2">
          <button
            v-for="endpoint in eventEndpoints"
            :key="endpoint.name"
            @click="testEndpoint(endpoint)"
            class="w-full text-left px-3 py-2 text-sm rounded border hover:bg-gray-50"
            :class="getMethodClass(endpoint.method)"
          >
            <span class="font-mono text-xs mr-2">{{ endpoint.method }}</span>
            {{ endpoint.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- API Testing Interface -->
    <div
      v-if="selectedEndpoint"
      class="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Test API Endpoint</h3>
        <button
          @click="selectedEndpoint = null"
          class="text-gray-400 hover:text-gray-600"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Request Configuration -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Endpoint</label
            >
            <div class="flex items-center space-x-2">
              <span
                class="px-2 py-1 text-xs font-mono rounded"
                :class="getMethodClass(selectedEndpoint.method)"
              >
                {{ selectedEndpoint.method }}
              </span>
              <span class="font-mono text-sm text-gray-600">{{
                selectedEndpoint.url
              }}</span>
            </div>
          </div>

          <div v-if="selectedEndpoint.params">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >URL Parameters</label
            >
            <div class="space-y-2">
              <div
                v-for="param in selectedEndpoint.params"
                :key="param"
                class="flex items-center space-x-2"
              >
                <label class="text-sm text-gray-600 w-20">{{ param }}:</label>
                <input
                  v-model="requestParams[param]"
                  type="text"
                  class="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                  :placeholder="`Enter ${param}`"
                />
              </div>
            </div>
          </div>

          <div v-if="['POST', 'PUT'].includes(selectedEndpoint.method)">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Request Body (JSON)</label
            >
            <textarea
              v-model="requestBody"
              rows="10"
              class="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
              placeholder="Enter JSON request body..."
            ></textarea>
          </div>

          <div class="flex space-x-2">
            <button
              @click="sendRequest"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
              Send Request
            </button>
            <button
              @click="clearResponse"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Response -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Response</label
            >
            <div v-if="response" class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-600">Status:</span>
                <span
                  class="px-2 py-1 text-xs rounded"
                  :class="getStatusClass(response.status)"
                >
                  {{ response.status }} {{ response.statusText }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-600">Time:</span>
                <span class="text-sm text-gray-800"
                  >{{ response.duration }}ms</span
                >
              </div>
            </div>
          </div>

          <div v-if="response">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Request Headers Sent</label
            >
            <pre
              class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto"
              >{{ formatJSON(lastRequestHeaders) }}</pre
            >
          </div>

          <div v-if="response">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Response Headers</label
            >
            <pre
              class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto"
              >{{ formatHeaders(response.headers) }}</pre
            >
          </div>

          <div v-if="response">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Response Body</label
            >
            <pre
              class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto"
              >{{ formatJSON(response.data) }}</pre
            >
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded">
            <h4 class="text-sm font-medium text-red-800 mb-1">Error</h4>
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sample Request Bodies -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Sample Request Bodies
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Admin Login</h4>
          <pre
            class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto"
            >{{ samples.adminLogin }}</pre
          >
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            User Registration
          </h4>
          <pre
            class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto"
            >{{ samples.userRegistration }}</pre
          >
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Child User</h4>
          <pre
            class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto"
            >{{ samples.childUser }}</pre
          >
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Event Data</h4>
          <pre
            class="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto"
            >{{ samples.eventData }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import apiClient from "../../services/apiClient";

// Reactive data
const selectedEndpoint = ref(null);
const requestParams = ref({});
const requestBody = ref("");
const response = ref(null);
const error = ref("");
const loading = ref(false);
const lastRequestHeaders = ref({});

// Computed properties
const hasToken = computed(() => {
  return !!sessionStorage.getItem("userToken");
});

const tokenPreview = computed(() => {
  const token = sessionStorage.getItem("userToken");
  if (!token) return "";
  return token.substring(0, 20) + "..." + token.substring(token.length - 10);
});

// API endpoint definitions
const userEndpoints = [
  { name: "Register User", method: "POST", url: "/auth/register" },
  { name: "Admin Login", method: "POST", url: "/admin/login" },
  { name: "Login User", method: "POST", url: "/auth/login" },
  { name: "Get Current User", method: "GET", url: "/auth/me" },
  { name: "Get All Users", method: "GET", url: "/users" },
  {
    name: "Get Users by ID",
    method: "GET",
    url: "/user/id/:id",
    params: ["id"],
  },
  { name: "Logout User", method: "POST", url: "/auth/logout" },
  { name: "Refresh Token", method: "POST", url: "/auth/refresh" },
  {
    name: "Delete User",
    method: "DELETE",
    url: "/users/:id",
    params: ["id"],
  },
];

const childEndpoints = [
  { name: "Create Child", method: "POST", url: "/child-users" },
  { name: "Get All Children", method: "GET", url: "/child-users" },
  {
    name: "Get Child by ID",
    method: "GET",
    url: "/child-users/:id",
    params: ["id"],
  },
  {
    name: "Update Child",
    method: "PUT",
    url: "/child-users/:id",
    params: ["id"],
  },
  {
    name: "Delete Child",
    method: "DELETE",
    url: "/child-users/:id",
    params: ["id"],
  },
  {
    name: "Get Children by Parent",
    method: "GET",
    url: "/child-users/parent/:parentId/children",
    params: ["parentId"],
  },
];

const eventEndpoints = [
  { name: "Create Event", method: "POST", url: "/event" },
  { name: "Get All Events", method: "GET", url: "/event" },
  { name: "Get Event Count", method: "GET", url: "/event/count" },
  { name: "Get Collections", method: "GET", url: "/event/dbs" },
  {
    name: "Get Event by ID",
    method: "GET",
    url: "/event/:id",
    params: ["id"],
  },
  {
    name: "Get Events by Child",
    method: "GET",
    url: "/event/child/:aid",
    params: ["aid"],
  },
  {
    name: "Update Event",
    method: "PUT",
    url: "/event/:id",
    params: ["id"],
  },
  {
    name: "Delete Event",
    method: "DELETE",
    url: "/event/:id",
    params: ["id"],
  },
  {
    name: "Bulk Update Events",
    method: "PUT",
    url: "/event/bulkUpdateByParam",
  },
  {
    name: "Update by Child ID",
    method: "PUT",
    url: "/event/update-by-child-id/:aid",
    params: ["aid"],
  },
];

// Sample request bodies
const samples = ref({
  adminLogin: JSON.stringify(
    {
      email: "admin@watchforme.com",
      password: "adminPassword123",
    },
    null,
    2
  ),

  userRegistration: JSON.stringify(
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "securePassword123",
      mobile: 1234567890,
    },
    null,
    2
  ),

  childUser: JSON.stringify(
    {
      firstName: "Emma",
      lastName: "Smith",
      gender: "Female",
      dateOfBirth: "2015-05-15",
      age: 8,
      height: 125,
      weight: 25,
      medicalCondition: ["Asthma"],
      limitations: [],
      emergencyContact: {
        name: "Jane Smith",
        phone: "1234567890",
        relationship: "Mother",
      },
      parentId: "6883f6ffaec95a456a7ea119",
      aid: "child123",
    },
    null,
    2
  ),

  eventData: JSON.stringify(
    {
      Timestamp: new Date().toISOString(),
      HeartRate: 85,
      HRV: 42,
      AccelX: 0.2,
      AccelY: 0.1,
      AccelZ: 9.8,
      GyroX: 0.1,
      GyroY: 0.0,
      GyroZ: 0.05,
      EDA: 2.5,
      TemperatureC: 36.7,
      SoundLevel: 45,
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 10,
      speed_mps: 0,
      bearing_deg: 0,
      accuracy_m: 5,
      satellites: 8,
      aid: "child123",
      parentId: "6883f6ffaec95a456a7ea119",
    },
    null,
    2
  ),
});

// Methods
const testEndpoint = (endpoint) => {
  selectedEndpoint.value = { ...endpoint };
  requestParams.value = {};
  requestBody.value = "";
  response.value = null;
  error.value = "";

  // Set sample request body for POST/PUT requests
  if (["POST", "PUT"].includes(endpoint.method)) {
    if (endpoint.url.includes("/admin/login")) {
      requestBody.value = samples.value.adminLogin;
    } else if (endpoint.url.includes("/auth/register")) {
      requestBody.value = samples.value.userRegistration;
    } else if (endpoint.url.includes("/child-users")) {
      requestBody.value = samples.value.childUser;
    } else if (endpoint.url.includes("/event")) {
      requestBody.value = samples.value.eventData;
    }
  }
};

const sendRequest = async () => {
  loading.value = true;
  error.value = "";

  try {
    const startTime = Date.now();

    // Build URL with parameters
    let url = selectedEndpoint.value.url;
    if (selectedEndpoint.value.params) {
      selectedEndpoint.value.params.forEach((param) => {
        if (requestParams.value[param]) {
          url = url.replace(`:${param}`, requestParams.value[param]);
        }
      });
    }

    // Check if token exists and log it
    const token = sessionStorage.getItem("userToken");
    console.log("🔑 Token check:", {
      hasToken: !!token,
      tokenLength: token?.length,
    });

    // Prepare request config
    const config = {
      method: selectedEndpoint.value.method.toLowerCase(),
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Manually add Authorization header if token exists (as backup)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request body for POST/PUT
    if (
      ["POST", "PUT"].includes(selectedEndpoint.value.method) &&
      requestBody.value
    ) {
      try {
        config.data = JSON.parse(requestBody.value);
      } catch (e) {
        throw new Error("Invalid JSON in request body");
      }
    }

    console.log("📤 Sending request with config:", {
      method: config.method,
      url: config.url,
      headers: config.headers,
      hasData: !!config.data,
    });

    // Store headers for debugging
    lastRequestHeaders.value = { ...config.headers };

    // Send request using apiClient (which includes token automatically)
    const result = await apiClient(config);
    const endTime = Date.now();

    response.value = {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers,
      data: result.data,
      duration: endTime - startTime,
    };
  } catch (err) {
    const endTime = Date.now();

    if (err.response) {
      response.value = {
        status: err.response.status,
        statusText: err.response.statusText,
        headers: err.response.headers,
        data: err.response.data,
        duration: endTime - startTime,
      };
    } else {
      error.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};

const clearResponse = () => {
  response.value = null;
  error.value = "";
};

const refreshTokenStatus = () => {
  // Force reactivity update by accessing sessionStorage directly
  const token = sessionStorage.getItem("userToken");
  console.log("🔄 Token refresh check:", {
    hasToken: !!token,
    length: token?.length,
  });
};

const getMethodClass = (method) => {
  const classes = {
    GET: "bg-green-100 text-green-800",
    POST: "bg-blue-100 text-blue-800",
    PUT: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
  };
  return classes[method] || "bg-gray-100 text-gray-800";
};

const getStatusClass = (status) => {
  if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
  if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800";
  if (status >= 500) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const formatJSON = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return data;
  }
};

const formatHeaders = (headers) => {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};
</script>
