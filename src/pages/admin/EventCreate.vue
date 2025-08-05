<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Create New Event</h2>
        <p class="text-gray-600">Add a new sensor event to the system</p>
      </div>
      <router-link
        to="/admin/events"
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>Back to Events
      </router-link>
    </div>

    <!-- Event Creation Form -->
    <NCard>
      <form @submit.prevent="createEvent" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {{ child.firstName }} {{ child.lastName }} ({{ child.aid }})
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
                step="any"
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
                step="any"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter HRV value"
              />
            </div>

            <!-- Temperature -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                v-model.number="form.Temperature"
                type="number"
                step="any"
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
                step="any"
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
                step="any"
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
                    step="any"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Y-Axis</label>
                  <input
                    v-model.number="form.AccelY"
                    type="number"
                    step="any"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Z-Axis</label>
                  <input
                    v-model.number="form.AccelZ"
                    type="number"
                    step="any"
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
                    step="any"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Y-Axis</label>
                  <input
                    v-model.number="form.GyroY"
                    type="number"
                    step="any"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.000"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Z-Axis</label>
                  <input
                    v-model.number="form.GyroZ"
                    type="number"
                    step="any"
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
                step="any"
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
                step="any"
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
                step="any"
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
                step="any"
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
                step="any"
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
                step="any"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of satellites"
              />
            </div>
          </div>
        </div>

        <!-- Quick Fill Options -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Quick Fill Options
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              @click="fillSampleData('resting')"
              class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <i class="fas fa-bed text-blue-600 text-2xl mb-2"></i>
              <span class="text-sm font-medium text-blue-700"
                >Resting Data</span
              >
            </button>

            <button
              type="button"
              @click="fillSampleData('active')"
              class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <i class="fas fa-running text-green-600 text-2xl mb-2"></i>
              <span class="text-sm font-medium text-green-700"
                >Active Data</span
              >
            </button>

            <button
              type="button"
              @click="fillSampleData('gps')"
              class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <i
                class="fas fa-map-marker-alt text-purple-600 text-2xl mb-2"
              ></i>
              <span class="text-sm font-medium text-purple-700"
                >Sample GPS</span
              >
            </button>
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
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-sm text-gray-700 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            Create Event
          </button>
        </div>
      </form>
    </NCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as eventApi from "../../services/eventApi";
import * as childUserApi from "../../services/childUserApi";

const router = useRouter();

// Reactive data
const form = ref({
  aid: "",
  Timestamp: "",
  HeartRate: null,
  HRV: null,
  AccelX: null,
  AccelY: null,
  AccelZ: null,
  GyroX: null,
  GyroY: null,
  GyroZ: null,
  EDA: null,
  Temperature: null,
  SoundLevel: null,
  latitude: null,
  longitude: null,
  altitude: null,
  speed_mps: null,
  bearing_deg: null,
  accuracy_m: null,
  satellites: null,
});

const availableChildren = ref([]);
const loading = ref(false);
const error = ref("");
const success = ref("");

// Computed properties
const isFormValid = computed(() => {
  return form.value.aid && form.value.Timestamp;
});

// Methods
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

const fillSampleData = (type) => {
  const now = new Date();
  const timestamp = new Date(
    now.getTime() - Math.random() * 24 * 60 * 60 * 1000
  );

  // Set timestamp
  form.value.Timestamp = timestamp.toISOString().slice(0, 16);

  switch (type) {
    case "resting":
      form.value.HeartRate = Math.floor(Math.random() * 20) + 60; // 60-80 BPM
      form.value.HRV = Math.random() * 20 + 30; // 30-50
      form.value.Temperature = Math.random() * 2 + 36.5; // 36.5-38.5°C
      form.value.SoundLevel = Math.random() * 20 + 30; // 30-50 dB
      form.value.AccelX = (Math.random() - 0.5) * 0.2; // Small movements
      form.value.AccelY = (Math.random() - 0.5) * 0.2;
      form.value.AccelZ = 0.98 + (Math.random() - 0.5) * 0.1; // Mostly gravity
      break;

    case "active":
      form.value.HeartRate = Math.floor(Math.random() * 40) + 120; // 120-160 BPM
      form.value.HRV = Math.random() * 15 + 15; // 15-30
      form.value.Temperature = Math.random() * 1.5 + 37; // 37-38.5°C
      form.value.SoundLevel = Math.random() * 30 + 50; // 50-80 dB
      form.value.AccelX = (Math.random() - 0.5) * 2; // Larger movements
      form.value.AccelY = (Math.random() - 0.5) * 2;
      form.value.AccelZ = 0.5 + (Math.random() - 0.5) * 1;
      form.value.GyroX = (Math.random() - 0.5) * 200;
      form.value.GyroY = (Math.random() - 0.5) * 200;
      form.value.GyroZ = (Math.random() - 0.5) * 200;
      form.value.speed_mps = Math.random() * 3 + 1; // 1-4 m/s
      form.value.EDA = (() => {
        const raw = 2 + Math.random() * 2;
        const decimalPlaces = Math.floor(Math.random() * 3) + 2; // 2 to 4
        return parseFloat(raw.toFixed(decimalPlaces));
      })();
      break;

    case "gps":
      // Sample coordinates (New York City area)
      form.value.latitude = 40.7589 + (Math.random() - 0.5) * 0.01;
      form.value.longitude = -73.9851 + (Math.random() - 0.5) * 0.01;
      form.value.altitude = Math.random() * 50 + 10; // 10-60m
      form.value.speed_mps = Math.random() * 2;
      form.value.bearing_deg = Math.random() * 360;
      form.value.accuracy_m = Math.random() * 10 + 2; // 2-12m
      form.value.satellites = Math.floor(Math.random() * 8) + 4; // 4-12 satellites
      break;
  }
};

const createEvent = async () => {
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

    // eventData.parentId = form.value.parentId._id || null;

    await eventApi.create(eventData);
    success.value = "Event created successfully!";

    // Reset form after success
    // setTimeout(() => {
    //   router.push("/admin/events");
    // }, 2000);
  } catch (err) {
    console.error("❌ Error creating event:", err);
    error.value = err.response?.data?.error || "Error creating event";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    aid: "",
    Timestamp: "",
    HeartRate: null,
    HRV: null,
    AccelX: null,
    AccelY: null,
    AccelZ: null,
    GyroX: null,
    GyroY: null,
    GyroZ: null,
    EDA: null,
    Temperature: null,
    SoundLevel: null,
    latitude: null,
    longitude: null,
    altitude: null,
    speed_mps: null,
    bearing_deg: null,
    accuracy_m: null,
    satellites: null,
  };
  error.value = "";
  success.value = "";
};

// Set default timestamp to now
const setDefaultTimestamp = () => {
  const now = new Date();
  form.value.Timestamp = now.toISOString().slice(0, 16);
};

// Lifecycle
onMounted(() => {
  loadChildren();
  setDefaultTimestamp();
});
</script>
