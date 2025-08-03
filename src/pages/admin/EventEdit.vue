<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Edit Event</h2>
        <p class="text-gray-600">Modify sensor event data</p>
      </div>
      <router-link
        to="/admin/events"
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>Back to Events
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loadingEvent" class="text-center py-12">
      <i class="fas fa-spinner animate-spin text-gray-400 text-4xl mb-4"></i>
      <p class="text-gray-500">Loading event data...</p>
    </div>

    <!-- Event Edit Form -->
    <div v-else-if="form" class="bg-white p-6 rounded-lg shadow-sm border">
      <form @submit.prevent="updateEvent" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Event ID (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Event ID
              </label>
              <input
                :value="eventId"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <!-- Child ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Child ID <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.aid"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a child</option>
                <option
                  v-for="child in availableChildren"
                  :key="child._id"
                  :value="child._id"
                >
                  {{ child.firstName }} {{ child.lastName }} ({{ child._id }})
                </option>
              </select>
            </div>

            <!-- Timestamp -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Timestamp <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.Timestamp"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Physiological Data -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Physiological Sensors
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Heart Rate -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (BPM)
              </label>
              <input
                v-model.number="form.HeartRate"
                type="number"
                min="40"
                max="220"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter heart rate"
              />
            </div>

            <!-- HRV -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate Variability (HRV)
              </label>
              <input
                v-model.number="form.HRV"
                type="number"
                min="0"
                max="200"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter HRV value"
              />
            </div>

            <!-- Temperature -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°C)
              </label>
              <input
                v-model.number="form.Temperature"
                type="number"
                min="30"
                max="45"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter temperature"
              />
            </div>

            <!-- EDA -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Electrodermal Activity (EDA)
              </label>
              <input
                v-model.number="form.EDA"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter EDA value"
              />
            </div>

            <!-- Sound Level -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sound Level (dB)
              </label>
              <input
                v-model.number="form.SoundLevel"
                type="number"
                min="0"
                max="150"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter sound level"
              />
            </div>
          </div>
        </div>

        <!-- Motion Sensors -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Motion Sensors</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            <!-- Accelerometer -->
            <div class="col-span-2 md:col-span-3">
              <h4 class="text-sm font-medium text-gray-700 mb-3">
                Accelerometer (g)
              </h4>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">X-Axis</label>
                  <input
                    v-model.number="form.AccelX"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Y-Axis</label>
                  <input
                    v-model.number="form.AccelY"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Z-Axis</label>
                  <input
                    v-model.number="form.AccelZ"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
              </div>
            </div>

            <!-- Gyroscope -->
            <div class="col-span-2 md:col-span-3">
              <h4 class="text-sm font-medium text-gray-700 mb-3">
                Gyroscope (°/s)
              </h4>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">X-Axis</label>
                  <input
                    v-model.number="form.GyroX"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Y-Axis</label>
                  <input
                    v-model.number="form.GyroY"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Z-Axis</label>
                  <input
                    v-model.number="form.GyroZ"
                    type="number"
                    step="0.001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GPS Location -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">GPS Location</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Latitude -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                v-model.number="form.latitude"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 40.712776"
              />
            </div>

            <!-- Longitude -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                v-model.number="form.longitude"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., -74.005974"
              />
            </div>

            <!-- Altitude -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Altitude (m)
              </label>
              <input
                v-model.number="form.altitude"
                type="number"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter altitude"
              />
            </div>

            <!-- Speed -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Speed (m/s)
              </label>
              <input
                v-model.number="form.speed_mps"
                type="number"
                step="0.1"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter speed"
              />
            </div>

            <!-- Additional GPS Data -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Bearing (degrees)
              </label>
              <input
                v-model.number="form.bearing_deg"
                type="number"
                step="0.1"
                min="0"
                max="360"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bearing"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Accuracy (m)
              </label>
              <input
                v-model.number="form.accuracy_m"
                type="number"
                step="0.1"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter accuracy"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Satellites
              </label>
              <input
                v-model.number="form.satellites"
                type="number"
                min="0"
                max="50"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of satellites"
              />
            </div>
          </div>
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
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link
            to="/admin/events"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            Update Event
          </button>
        </div>
      </form>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
      <p class="text-gray-500">The requested event could not be loaded.</p>
      <router-link
        to="/admin/events"
        class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Events
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as eventApi from "../../services/eventApi";
import * as childUserApi from "../../services/childUserApi";

const router = useRouter();
const route = useRoute();

// Reactive data
const form = ref(null);
const availableChildren = ref([]);
const loading = ref(false);
const loadingEvent = ref(true);
const error = ref("");
const success = ref("");
const eventId = ref(route.params.id);

// Computed properties
const isFormValid = computed(() => {
  return form.value && form.value.aid && form.value.Timestamp;
});

// Methods
const loadEvent = async () => {
  try {
    loadingEvent.value = true;
    const response = await eventApi.getById(eventId.value);
    const event = response.data;

    // Convert timestamp for datetime-local input
    if (event.Timestamp) {
      event.Timestamp = new Date(event.Timestamp).toISOString().slice(0, 16);
    }

    form.value = event;
  } catch (err) {
    console.error("Error loading event:", err);
    error.value = "Failed to load event data";
    form.value = null;
  } finally {
    loadingEvent.value = false;
  }
};

const loadChildren = async () => {
  try {
    const response = await childUserApi.getAllChildUsers();
    console.log("📋 API Response:", response.data);
    availableChildren.value = response.data.data || response.data || [];
  } catch (err) {
    console.error("Error loading children:", err);
    availableChildren.value = [];
  }
};

const updateEvent = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    // Prepare event data, removing null/undefined values
    const eventData = {};
    Object.keys(form.value).forEach((key) => {
      if (
        form.value[key] !== null &&
        form.value[key] !== undefined &&
        form.value[key] !== ""
      ) {
        eventData[key] = form.value[key];
      }
    });

    // Convert timestamp to proper format
    if (eventData.Timestamp) {
      eventData.Timestamp = new Date(eventData.Timestamp).toISOString();
    }

    await eventApi.update(eventId.value, eventData);
    success.value = "Event updated successfully!";

    // Redirect after success
    setTimeout(() => {
      router.push("/admin/events");
    }, 2000);
  } catch (err) {
    console.error("❌ Error updating event:", err);
    error.value = err.response?.data?.error || "Error updating event";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadEvent();
  loadChildren();
});
</script>
