<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Event Management</h2>
        <p class="text-gray-600">
          Manage sensor events and data collected from devices
        </p>
      </div>
      <router-link
        to="/admin/events/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>Add New Event
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by child ID or parent ID..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          v-model="startDate"
          type="date"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="endDate"
          type="date"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="selectedSensorFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sensors</option>
          <option value="heartrate">Heart Rate</option>
          <option value="heartrate">HRV</option>
          <option value="gps">GPS Data</option>
          <option value="accelerometer">Accelerometer</option>
          <option value="gyroscope">Gyroscope</option>
          <option value="temperature">Temperature</option>
          <option value="sound">Sound Level</option>
        </select>
        <button
          @click="refreshEvents"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <i class="fas fa-refresh mr-2"></i>Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <i class="fas fa-chart-line text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Events</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalEvents }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded-full">
            <i class="fas fa-heartbeat text-red-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Heart Rate Events</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ heartRateEvents }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <i class="fas fa-map-marker-alt text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">GPS Events</p>
            <p class="text-2xl font-bold text-gray-900">{{ gpsEvents }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <i class="fas fa-thermometer-half text-yellow-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Temperature Events</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ temperatureEvents }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <i class="fas fa-calendar text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Today's Events</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayEvents }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden max-h-150">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">All Events</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="exportEvents"
              class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              <i class="fas fa-download mr-1"></i>Export
            </button>
            <button
              @click="bulkDeleteSelected"
              v-if="selectedEvents.length > 0"
              class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              <i class="fas fa-trash mr-1"></i>Delete Selected ({{
                selectedEvents.length
              }})
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-auto max-h-150">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="allSelected"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Timestamp
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Child ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Heart Rate
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Temperature
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sound Level
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
              v-for="event in filteredEvents"
              :key="event._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :value="event._id"
                  v-model="selectedEvents"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDateTime(event.Timestamp) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ event.aid }}
                </div>
                <div class="text-sm text-gray-500">
                  Parent: {{ event.parentId }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ event.HeartRate || "N/A" }}
                  <span v-if="event.HeartRate" class="text-xs text-gray-500"
                    >bpm</span
                  >
                </div>
                <div class="text-sm text-gray-500">
                  HRV: {{ event.HRV || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  v-if="event.latitude && event.longitude"
                  class="text-sm text-gray-900"
                >
                  {{ event.latitude.toFixed(4) }},
                  {{ event.longitude.toFixed(4) }}
                </div>
                <div v-else class="text-sm text-gray-500">No GPS data</div>
                <div v-if="event.altitude" class="text-sm text-gray-500">
                  Alt: {{ event.altitude }}m
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ event.Temperature || "N/A" }}
                  <span v-if="event.Temperature" class="text-xs text-gray-500"
                    >°C</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ event.SoundLevel || "N/A" }}
                  <span v-if="event.SoundLevel" class="text-xs text-gray-500"
                    >dB</span
                  >
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
              >
                <button
                  @click="viewEvent(event)"
                  class="text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editEvent(event)"
                  class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteEvent(event)"
                  class="text-red-600 hover:text-red-900 cursor-pointer"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to
          {{ Math.min(currentPage * pageSize, totalEvents) }} of
          {{ totalEvents }} events
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm">{{ currentPage }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage * pageSize >= totalEvents"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEvents.length === 0" class="text-center py-12">
        <i class="fas fa-chart-line text-gray-400 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p class="text-gray-500">No events match your search criteria.</p>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <div
      v-if="selectedEvent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Event Details</h3>
            <button
              @click="selectedEvent = null"
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
                  >Timestamp</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDateTime(selectedEvent.Timestamp) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Child ID</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.aid }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Parent ID</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.parentId }}
                </p>
              </div>
            </div>

            <!-- Sensor Data -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Sensor Data</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Heart Rate</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.HeartRate || "N/A" }} bpm
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >HRV</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.HRV || "N/A" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >EDA</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.EDA || "N/A" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Temperature</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.Temperature || "N/A" }}°C
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Sound Level</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.SoundLevel || "N/A" }} dB
                </p>
              </div>
            </div>

            <!-- Motion & Location -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Motion & Location</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >GPS Coordinates</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{
                    selectedEvent.latitude && selectedEvent.longitude
                      ? `${selectedEvent.latitude}, ${selectedEvent.longitude}`
                      : "N/A"
                  }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Altitude</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.altitude || "N/A" }} m
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Speed</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedEvent.speed_mps || "N/A" }} m/s
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Accelerometer (X,Y,Z)</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{
                    [
                      selectedEvent.AccelX,
                      selectedEvent.AccelY,
                      selectedEvent.AccelZ,
                    ]
                      .filter((v) => v !== null && v !== undefined)
                      .join(", ") || "N/A"
                  }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Gyroscope (X,Y,Z)</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{
                    [
                      selectedEvent.GyroX,
                      selectedEvent.GyroY,
                      selectedEvent.GyroZ,
                    ]
                      .filter((v) => v !== null && v !== undefined)
                      .join(", ") || "N/A"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Delete Modal -->
    <div
      v-if="eventToDelete"
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
            Delete Event
          </h3>

          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete this sensor event? This action
            cannot be undone and will permanently remove the data.
          </p>

          <div class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">
              Event Details
            </h4>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span class="font-medium">Timestamp:</span>
                <span>{{ formatDateTime(eventToDelete.Timestamp) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Child ID:</span>
                <span>{{ eventToDelete.aid }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Parent ID:</span>
                <span>{{ eventToDelete.parentId }}</span>
              </div>
              <div v-if="eventToDelete.HeartRate" class="flex justify-between">
                <span class="font-medium">Heart Rate:</span>
                <span>{{ eventToDelete.HeartRate }} bpm</span>
              </div>
              <div
                v-if="eventToDelete.Temperature"
                class="flex justify-between"
              >
                <span class="font-medium">Temperature:</span>
                <span>{{ eventToDelete.Temperature }}°C</span>
              </div>
              <div
                v-if="eventToDelete.latitude && eventToDelete.longitude"
                class="flex justify-between"
              >
                <span class="font-medium">Location:</span>
                <span
                  >{{ eventToDelete.latitude.toFixed(4) }},
                  {{ eventToDelete.longitude.toFixed(4) }}</span
                >
              </div>
            </div>
          </div>

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
                  Deleting this event will permanently remove:
                </p>
                <ul class="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>All sensor data (heart rate, temperature, GPS, etc.)</li>
                  <li>Motion data (accelerometer, gyroscope)</li>
                  <li>Environmental data (sound levels, EDA)</li>
                  <li>Associated analytics and reports</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="eventToDelete = null"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteEvent"
              :disabled="deleting"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <i v-if="deleting" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-trash mr-2"></i>
              {{ deleting ? "Deleting..." : "Delete Event" }}
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
import * as eventApi from "../../services/eventApi";

const router = useRouter();

// Reactive data
const events = ref([]);
const loading = ref(false);
const deleting = ref(false);
const searchQuery = ref("");
const startDate = ref("");
const endDate = ref("");
const selectedSensorFilter = ref("");
const selectedEvent = ref(null);
const eventToDelete = ref(null);
const selectedEvents = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);

// Computed properties
const filteredEvents = computed(() => {
  let filtered = events.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.aid?.toLowerCase().includes(query) ||
        event.parentId?.toLowerCase().includes(query)
    );
  }

  // Date range filter
  if (startDate.value) {
    filtered = filtered.filter(
      (event) => new Date(event.Timestamp) >= new Date(startDate.value)
    );
  }
  if (endDate.value) {
    filtered = filtered.filter(
      (event) => new Date(event.Timestamp) <= new Date(endDate.value)
    );
  }

  // Sensor filter
  if (selectedSensorFilter.value) {
    switch (selectedSensorFilter.value) {
      case "heartrate":
        filtered = filtered.filter(
          (event) => event.HeartRate !== null && event.HeartRate !== undefined
        );
        break;
      case "gps":
        filtered = filtered.filter(
          (event) => event.latitude && event.longitude
        );
        break;
      case "accelerometer":
        filtered = filtered.filter(
          (event) => event.AccelX || event.AccelY || event.AccelZ
        );
        break;
      case "gyroscope":
        filtered = filtered.filter(
          (event) => event.GyroX || event.GyroY || event.GyroZ
        );
        break;
      case "temperature":
        filtered = filtered.filter(
          (event) =>
            event.Temperature !== null && event.Temperature !== undefined
        );
        break;
      case "sound":
        filtered = filtered.filter(
          (event) => event.SoundLevel !== null && event.SoundLevel !== undefined
        );
        break;
    }
  }

  // Pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filtered.slice(start, end);
});

const totalEvents = computed(() => events.value.length);
const heartRateEvents = computed(
  () => events.value.filter((event) => event.HeartRate).length
);
const gpsEvents = computed(
  () => events.value.filter((event) => event.latitude && event.longitude).length
);
const temperatureEvents = computed(
  () => events.value.filter((event) => event.Temperature).length
);
const todayEvents = computed(() => {
  const today = new Date().toDateString();
  return events.value.filter(
    (event) => new Date(event.Timestamp).toDateString() === today
  ).length;
});

const allSelected = computed(() => {
  return (
    filteredEvents.value.length > 0 &&
    selectedEvents.value.length === filteredEvents.value.length
  );
});

// Methods
const loadEvents = async () => {
  try {
    loading.value = true;
    const response = await eventApi.getAll();
    events.value = response.data;
  } catch (error) {
    console.error("Error loading events:", error);
    events.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshEvents = () => {
  currentPage.value = 1;
  loadEvents();
};

const viewEvent = (event) => {
  selectedEvent.value = event;
};

const editEvent = (event) => {
  router.push({ name: "EventEdit", params: { id: event._id } });
};

const deleteEvent = (event) => {
  eventToDelete.value = event;
};

const confirmDeleteEvent = async () => {
  if (!eventToDelete.value) return;

  try {
    deleting.value = true;
    await eventApi.remove(eventToDelete.value._id);
    events.value = events.value.filter(
      (e) => e._id !== eventToDelete.value._id
    );
    eventToDelete.value = null;
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Error deleting event");
  } finally {
    deleting.value = false;
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedEvents.value = [];
  } else {
    selectedEvents.value = filteredEvents.value.map((event) => event._id);
  }
};

const bulkDeleteSelected = async () => {
  if (
    confirm(
      `Are you sure you want to delete ${selectedEvents.value.length} selected events?`
    )
  ) {
    try {
      // Implement bulk delete
      for (const eventId of selectedEvents.value) {
        await eventApi.remove(eventId);
      }
      events.value = events.value.filter(
        (event) => !selectedEvents.value.includes(event._id)
      );
      selectedEvents.value = [];
    } catch (error) {
      console.error("Error bulk deleting events:", error);
      alert("Error deleting events");
    }
  }
};

const exportEvents = () => {
  // Implement CSV export
  console.log("Export events");
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalEvents.value) {
    currentPage.value++;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Lifecycle
onMounted(() => {
  loadEvents();
});
</script>
