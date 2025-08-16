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
    <n-card>
      <div class="flex gap-2">
        <div class="flex-1 min-w-64">
          <n-input
            v-model:value="searchQuery"
            placeholder="Search by child ID or parent ID..."
            clearable
          />
        </div>
        <!-- child filter (multi-select) -->
        <n-select
          multiple
          v-model:value="selectedChildIds"
          @update:value="onChildChange"
          :options="childOptions"
          placeholder="Select Children"
          :style="{ minWidth: '240px' }"
        />
        <!-- date range filter -->
        <n-date-picker
          v-model:value="selectedDateRange"
          type="daterange"
          clearable
          :update-value-on-close="true"
          :actions="['confirm']"
          @update:value="onDateRangeChange"
          :style="{ minWidth: '280px' }"
        />
        <n-select
          v-model:value="selectedSensorFilter"
          :options="sensorFilterOptions"
          placeholder="All Sensors"
        />
        <!-- date range filter -->

        <n-button @click="refreshEvents" type="default">
          <template #icon>
            <i class="fas fa-refresh"></i>
          </template>
          Refresh
        </n-button>
      </div>
    </n-card>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <StatisticsCard
        label="Total Events"
        :value="totalEvents"
        icon="fas fa-chart-line"
        variant="blue"
      />

      <StatisticsCard
        label="Filtered Events"
        :value="filteredEventsCount"
        icon="fas fa-list"
        variant="green"
      />

      <StatisticsCard
        label="Heart Rate Events"
        :value="heartRateEvents"
        icon="fas fa-heartbeat"
        variant="red"
      />

      <StatisticsCard
        label="Temperature Events"
        :value="temperatureEvents"
        icon="fas fa-thermometer-half"
        variant="yellow"
      />

      <StatisticsCard
        label="Today's Events"
        :value="todayEvents"
        icon="fas fa-calendar"
        variant="purple"
      />
    </div>

    <!-- Events Table -->
    <n-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-medium text-gray-900">All Events</h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>{{ filteredEvents.length }} total</span>
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
                  availableEventColumns.length
                }})
              </n-button>
            </n-dropdown>

            <n-button @click="exportEvents" type="success" size="small">
              <template #icon>
                <i class="fas fa-download"></i>
              </template>
              Export
            </n-button>
            <n-button
              @click="handleBulkDelete"
              v-if="checkedRowKeys.length > 0"
              type="error"
              size="small"
            >
              <template #icon>
                <i class="fas fa-trash"></i>
              </template>
              Delete Selected ({{ checkedRowKeys.length }})
            </n-button>
          </div>
        </div>
      </template>

      <!-- Naive UI Data Table -->
      <n-data-table
        :columns="columns"
        :data="filteredEvents"
        :loading="loading"
        :row-key="rowKey"
        :checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
        :pagination="paginationConfig"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        :bordered="false"
        striped
        size="medium"
        flex-height
        style="min-height: 600px"
      />
    </n-card>

    <!-- Event Detail Modal -->
    <n-modal
      v-model:show="showEventModal"
      preset="card"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      title="Event Details"
      size="huge"
      :bordered="false"
      segmented
    >
      <template #header-extra>
        <n-button
          @click="selectedEvent = null"
          quaternary
          circle
          type="default"
        >
          <template #icon>
            <i class="fas fa-times"></i>
          </template>
        </n-button>
      </template>

      <div v-if="selectedEvent" class="space-y-6">
        <!-- Event Overview Header -->
        <n-card title="Event Overview" :bordered="false">
          <div class="flex items-center space-x-4">
            <div
              class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full"
            >
              <i class="fas fa-chart-line text-2xl text-blue-600"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900">
                Event #{{ selectedEvent._id || "N/A" }}
              </h3>
              <div class="flex items-center space-x-4 mt-2">
                <n-tag type="info" size="medium">
                  Child: {{ selectedEvent.aid || "N/A" }}
                </n-tag>
                <n-tag type="success" size="medium">
                  {{ formatDateTime(selectedEvent.Timestamp) }}
                </n-tag>
              </div>
            </div>
          </div>
        </n-card>

        <!-- Information Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Basic Information Card -->
          <n-card title="Basic Information" :bordered="false">
            <template #header-extra>
              <i class="fas fa-info-circle text-blue-600"></i>
            </template>
            <n-descriptions :column="1" size="small">
              <n-descriptions-item label="Timestamp">
                {{ formatDateTime(selectedEvent.Timestamp) }}
              </n-descriptions-item>
              <n-descriptions-item label="Event ID">
                <n-tag type="info" size="small">
                  {{ selectedEvent._id || "N/A" }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="Child ID">
                <n-tag type="info" size="small">
                  {{ selectedEvent.aid || "N/A" }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="Parent ID">
                {{ selectedEvent.parentId || "N/A" }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>

          <!-- Sensor Data Card -->
          <n-card title="Sensor Data" :bordered="false">
            <template #header-extra>
              <i class="fas fa-heartbeat text-red-600"></i>
            </template>
            <n-descriptions :column="1" size="small">
              <n-descriptions-item label="Heart Rate">
                <span
                  v-if="selectedEvent.HeartRate"
                  class="font-medium text-red-600"
                >
                  {{ selectedEvent.HeartRate }} bpm
                </span>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
              <n-descriptions-item label="HRV">
                {{ selectedEvent.HRV || "N/A" }}
              </n-descriptions-item>
              <n-descriptions-item label="EDA">
                {{ selectedEvent.EDA || "N/A" }}
              </n-descriptions-item>
              <n-descriptions-item label="Temperature">
                <span
                  v-if="selectedEvent.Temperature"
                  class="font-medium text-orange-600"
                >
                  {{ selectedEvent.Temperature }}°C
                </span>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
              <n-descriptions-item label="Sound Level">
                <span
                  v-if="selectedEvent.SoundLevel"
                  class="font-medium text-purple-600"
                >
                  {{ selectedEvent.SoundLevel }} dB
                </span>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>

          <!-- Motion & Location Card -->
          <n-card title="Motion & Location" :bordered="false">
            <template #header-extra>
              <i class="fas fa-map-marker-alt text-green-600"></i>
            </template>
            <n-descriptions :column="1" size="small">
              <n-descriptions-item label="GPS Coordinates">
                <div v-if="selectedEvent.latitude && selectedEvent.longitude">
                  <div class="font-medium text-green-600">
                    {{ selectedEvent.latitude.toFixed(6) }},
                    {{ selectedEvent.longitude.toFixed(6) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    <a
                      :href="`https://maps.google.com/?q=${selectedEvent.latitude},${selectedEvent.longitude}`"
                      target="_blank"
                      class="text-blue-500 hover:underline"
                    >
                      View on Map
                      <i class="fas fa-external-link-alt text-xs"></i>
                    </a>
                  </div>
                </div>
                <span v-else class="text-gray-500">No GPS data</span>
              </n-descriptions-item>
              <n-descriptions-item label="Altitude">
                <span v-if="selectedEvent.altitude" class="font-medium">
                  {{ selectedEvent.altitude }} m
                </span>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
              <n-descriptions-item label="Speed">
                <span v-if="selectedEvent.speed_mps" class="font-medium">
                  {{ selectedEvent.speed_mps }} m/s
                </span>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
              <n-descriptions-item label="Accelerometer (X,Y,Z)">
                <div
                  v-if="
                    selectedEvent.AccelX ||
                    selectedEvent.AccelY ||
                    selectedEvent.AccelZ
                  "
                >
                  <div class="font-mono text-sm">
                    {{
                      [
                        selectedEvent.AccelX?.toFixed(3),
                        selectedEvent.AccelY?.toFixed(3),
                        selectedEvent.AccelZ?.toFixed(3),
                      ]
                        .filter((v) => v !== undefined)
                        .join(", ")
                    }}
                  </div>
                </div>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
              <n-descriptions-item label="Gyroscope (X,Y,Z)">
                <div
                  v-if="
                    selectedEvent.GyroX ||
                    selectedEvent.GyroY ||
                    selectedEvent.GyroZ
                  "
                >
                  <div class="font-mono text-sm">
                    {{
                      [
                        selectedEvent.GyroX?.toFixed(3),
                        selectedEvent.GyroY?.toFixed(3),
                        selectedEvent.GyroZ?.toFixed(3),
                      ]
                        .filter((v) => v !== undefined)
                        .join(", ")
                    }}
                  </div>
                </div>
                <span v-else class="text-gray-500">N/A</span>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <n-button @click="editEvent(selectedEvent)" type="primary">
            <template #icon>
              <i class="fas fa-edit"></i>
            </template>
            Edit Event
          </n-button>
          <n-button @click="selectedEvent = null" type="default">
            Close
          </n-button>
        </div>
      </div>
    </n-modal>

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
import { ref, computed, onMounted, h, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
import {
  NButton,
  NTag,
  NSpace,
  NPopconfirm,
  NCard,
  NDataTable,
  NDropdown,
  NModal,
  NDescriptions,
  NDescriptionsItem,
  NInput,
  NSelect,
  NDatePicker,
} from "naive-ui";
import { useEventStore } from "../../stores/eventStore";
import StatisticsCard from "../../components/StatisticsCard.vue";

import { availableEventColumns } from "../../models/models";

const router = useRouter();
const message = useMessage();
const dialog = useDialog();
const eventStore = useEventStore();

// Sensor filter options
const sensorFilterOptions = [
  { label: "All Sensors", value: "" },
  { label: "Heart Rate", value: "heartrate" },
  { label: "HRV", value: "hrv" },
  { label: "GPS Data", value: "gps" },
  { label: "Accelerometer", value: "accelerometer" },
  { label: "Gyroscope", value: "gyroscope" },
  { label: "Temperature", value: "temperature" },
  { label: "Sound Level", value: "sound" },
];

// Reactive data
const events = ref([]);
const loading = ref(false);
const deleting = ref(false);
const searchQuery = ref("");
const selectedDateRange = ref(null);
const selectedSensorFilter = ref("");
const selectedEvent = ref(null);
const eventToDelete = ref(null);
const selectedEvents = ref([]);
const checkedRowKeys = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);

// Child filter support
const selectedChildIds = ref(["all"]);
const availableChildren = ref([]);

// Modal visibility
const showEventModal = computed({
  get: () => !!selectedEvent.value,
  set: (value) => {
    if (!value) selectedEvent.value = null;
  },
});

// Column visibility state
const visibleColumns = ref([
  "childId",
  "heartRate",
  "temperature",
  "rules",
  "actions",
]);

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

// Table columns configuration
const allColumns = [
  {
    type: "selection",
    width: 10,
  },
  {
    title: "Timestamp",
    key: "timestamp",
    width: 40,
    render(row) {
      return h("div", { class: "text-sm" }, formatDateTime(row?.Timestamp));
    },
  },
  {
    title: "Child ID",
    key: "childId",
    width: 50,
    render(row) {
      return h("div", {}, [
        h(
          "div",
          { class: "text-sm font-medium text-gray-900" },
          row.aid || "N/A"
        ),
        h(
          "div",
          { class: "text-xs text-gray-500" },
          `Parent: ${row.parentId || "N/A"}`
        ),
      ]);
    },
  },
  {
    title: "Rules",
    key: "rules",
    width: 60,
    render(row) {
      return h("div", {}, [
        h(
          "div",
          { class: "text-sm" },
          row.rules
            ? `${Object.keys(row.rules)} : ${row.rules[Object.keys(row.rules)]}`
            : "N/A"
        ),
      ]);
    },
  },
  {
    title: "Heart Rate",
    key: "heartRate",
    width: 30,
    render(row) {
      return h("div", {}, [
        h(
          "div",
          { class: "text-sm" },
          row.HeartRate ? `${row.HeartRate} bpm` : "N/A"
        ),
        h(
          "div",
          { class: "text-xs text-gray-500" },
          `HRV: ${row.HRV || "N/A"}`
        ),
      ]);
    },
  },
  {
    title: "Location",
    key: "location",
    width: 50,
    render(row) {
      if (row.latitude && row.longitude) {
        return h("div", {}, [
          h(
            "div",
            { class: "text-sm" },
            `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}`
          ),
          row.altitude &&
            h(
              "div",
              { class: "text-xs text-gray-500" },
              `Alt: ${row.altitude}m`
            ),
        ]);
      }
      return h("div", { class: "text-sm text-gray-500" }, "No GPS data");
    },
  },
  {
    title: "Temperature",
    key: "temperature",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.Temperature ? `${row.Temperature}°C` : "N/A"
      );
    },
  },
  {
    title: "Sound Level",
    key: "soundLevel",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.SoundLevel ? `${row.SoundLevel} dB` : "N/A"
      );
    },
  },
  {
    title: "HRV",
    key: "hrv",
    width: 50,
    render(row) {
      return h("div", { class: "text-sm" }, row.HRV ? `${row.HRV}` : "N/A");
    },
  },
  {
    title: "EDA",
    key: "eda",
    width: 50,
    render(row) {
      return h("div", { class: "text-sm" }, row.EDA ? `${row.EDA}` : "N/A");
    },
  },
  {
    title: "Altitude",
    key: "altitude",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.altitude ? `${row.altitude}m` : "N/A"
      );
    },
  },
  {
    title: "Speed",
    key: "speed",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.speed_mps ? `${row.speed_mps} m/s` : "N/A"
      );
    },
  },
  {
    title: "Accelerometer",
    key: "accelerometer",
    width: 50,
    render(row) {
      const values = [row.AccelX, row.AccelY, row.AccelZ]
        .filter((v) => v !== null && v !== undefined)
        .map((v) => v?.toFixed(2))
        .join(", ");
      return h("div", { class: "text-sm" }, values || "N/A");
    },
  },
  {
    title: "Gyroscope",
    key: "gyroscope",
    width: 50,
    render(row) {
      const values = [row.GyroX, row.GyroY, row.GyroZ]
        .filter((v) => v !== null && v !== undefined)
        .map((v) => v?.toFixed(2))
        .join(", ");
      return h("div", { class: "text-sm" }, values || "N/A");
    },
  },
  {
    title: "Accel X",
    key: "accelX",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.AccelX !== null && row.AccelX !== undefined
          ? row.AccelX.toFixed(2)
          : "N/A"
      );
    },
  },
  {
    title: "Accel Y",
    key: "accelY",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.AccelY !== null && row.AccelY !== undefined
          ? row.AccelY.toFixed(2)
          : "N/A"
      );
    },
  },
  {
    title: "Accel Z",
    key: "accelZ",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.AccelZ !== null && row.AccelZ !== undefined
          ? row.AccelZ.toFixed(2)
          : "N/A"
      );
    },
  },
  {
    title: "Gyro X",
    key: "gyroX",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.GyroX !== null && row.GyroX !== undefined
          ? row.GyroX.toFixed(2)
          : "N/A"
      );
    },
  },
  {
    title: "Gyro Y",
    key: "gyroY",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.GyroY !== null && row.GyroY !== undefined
          ? row.GyroY.toFixed(2)
          : "N/A"
      );
    },
  },
  {
    title: "Gyro Z",
    key: "gyroZ",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.GyroZ !== null && row.GyroZ !== undefined
          ? row.GyroZ.toFixed(2)
          : "N/A"
      );
    },
  },
  {
    title: "Parent ID",
    key: "parentId",
    width: 50,
    render(row) {
      return h("div", { class: "text-sm" }, row.parentId || "N/A");
    },
  },
  {
    title: "Battery Level",
    key: "batteryLevel",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.batteryLevel ? `${row.batteryLevel}%` : "N/A"
      );
    },
  },
  {
    title: "Signal Strength",
    key: "signalStrength",
    width: 50,
    render(row) {
      return h(
        "div",
        { class: "text-sm" },
        row.signalStrength ? `${row.signalStrength} dBm` : "N/A"
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 30,
    fixed: "right",
    render(row) {
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
                onClick: () => viewEvent(row),
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
                onClick: () => editEvent(row),
              },
              {
                default: () => h("i", { class: "fas fa-edit" }),
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => confirmDeleteSingle(row),
              },
              {
                default: () => "Are you sure you want to delete this event?",
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
  const selectionColumn = allColumns[0]; // Selection column (always first)
  const actionsColumn = allColumns[allColumns.length - 1]; // Actions column (always last)

  // Filter other columns based on visibility (exclude selection and actions)
  const filteredColumns = allColumns
    .slice(1, -1) // Skip selection (first) and actions (last)
    .filter((col) => visibleColumns.value.includes(col.key));

  // Always include actions column if it's in visible columns
  const finalColumns = [selectionColumn, ...filteredColumns];
  if (visibleColumns.value.includes("actions")) {
    finalColumns.push(actionsColumn);
  }

  return finalColumns;
});

// Computed properties
const filteredEvents = computed(() => {
  let filtered = events.value;

  debugger;

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
  if (selectedDateRange.value && Array.isArray(selectedDateRange.value)) {
    const [startMs, endMs] = selectedDateRange.value;
    const start = startMs ? new Date(startMs) : null;
    const end = endMs ? new Date(endMs) : null;
    if (start || end) {
      filtered = filtered.filter((event) => {
        const t = new Date(event.Timestamp);
        return (!start || t >= start) && (!end || t <= end);
      });
    }
  }

  // Child filter
  const selChildren = selectedChildIds.value || [];
  if (selChildren.length > 0 && !selChildren.includes("all")) {
    const cset = new Set(selChildren);
    filtered = filtered.filter((event) => cset.has(event.aid));
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

  return filtered;
});

// Update pagination to work with filtered data
const paginationConfig = computed(() => ({
  page: pagination.value.page,
  pageSize: pagination.value.pageSize,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  showQuickJumper: true,
  itemCount: filteredEvents.value.length,
  prefix: ({ itemCount }) => `Total: ${itemCount}`,
}));

const totalEvents = computed(() => events.value.length);
const filteredEventsCount = computed(() => filteredEvents.value.length);
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

// Child options for the multi-select dropdown
const childOptions = computed(() => {
  return [
    { label: "All Children", value: "all" },
    ...availableChildren.value.map((childId) => ({
      label: `Child ${String(childId).slice(0, 8)}`,
      value: childId,
    })),
  ];
});

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
  ...availableEventColumns.map((col) => ({
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

const handlePageChange = (page) => {
  pagination.value.page = page;
  currentPage.value = page;
};

const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize;
  pagination.value.page = 1;
  currentPage.value = 1;
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

const showAllColumns = () => {
  visibleColumns.value = availableEventColumns.map((col) => col.key);
};

const showDefaultColumns = () => {
  visibleColumns.value = availableEventColumns
    .filter((col) => col.default)
    .map((col) => col.key);
};

const handleBulkDelete = () => {
  if (checkedRowKeys.value.length === 0) return;

  dialog.warning({
    title: "Confirm Bulk Delete",
    content: `Are you sure you want to delete ${checkedRowKeys.value.length} selected events? This action cannot be undone.`,
    positiveText: "Delete All",
    negativeText: "Cancel",
    onPositiveClick: confirmBulkDelete,
  });
};

const confirmBulkDelete = async () => {
  try {
    loading.value = true;
    const deletePromises = checkedRowKeys.value.map((id) =>
      eventStore.deleteItem(id)
    );

    await Promise.all(deletePromises);

    // Remove deleted events from the list
    events.value = events.value.filter(
      (event) => !checkedRowKeys.value.includes(event._id)
    );

    checkedRowKeys.value = [];
    message.success(`Successfully deleted ${deletePromises.length} events`);
  } catch (error) {
    console.error("Error deleting events:", error);
    message.error("Failed to delete some events. Please try again.");
  } finally {
    loading.value = false;
  }
};

const confirmDeleteSingle = async (event) => {
  try {
    await eventStore.deleteItem(event._id);
    events.value = events.value.filter((e) => e._id !== event._id);
    message.success(`Successfully deleted event`);
  } catch (error) {
    console.error("Error deleting event:", error);
    message.error("Failed to delete event. Please try again.");
  }
};

const loadEvents = async () => {
  try {
    loading.value = true;
    await eventStore.fetchAll();
    events.value = eventStore.events;

    // Populate available children for the filter
    const uniqueChildren = [...new Set(events.value.map((e) => e.aid))].filter(
      Boolean
    );
    availableChildren.value = uniqueChildren.sort();
  } catch (error) {
    console.error("Error loading events:", error);
    events.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshEvents = () => {
  pagination.value.page = 1;
  checkedRowKeys.value = [];
  loadEvents();
};

// Handle date range changes
const onDateRangeChange = (val) => {
  selectedDateRange.value = val;
  // loadEvents();
};

// Handle child selection changes
const onChildChange = () => {
  // Normalize selection: if 'all' is selected alongside others, drop 'all'
  if (
    Array.isArray(selectedChildIds.value) &&
    selectedChildIds.value.includes("all") &&
    selectedChildIds.value.length > 1
  ) {
    selectedChildIds.value = selectedChildIds.value.filter((v) => v !== "all");
  }
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
    await eventStore.deleteItem(eventToDelete.value._id);
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

const exportEvents = () => {
  // Implement CSV export
  console.log("Export events");
  router.push("/admin/data/export?type=events");
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
onMounted(async () => {
  try {
    await loadEvents();
  } catch (error) {
    console.error("Error during component mount:", error);
  }
});

// Watch for filter changes and reset pagination
watch([searchQuery, selectedDateRange, selectedChildIds], () => {
  pagination.value.page = 1;
  checkedRowKeys.value = [];
});
</script>
