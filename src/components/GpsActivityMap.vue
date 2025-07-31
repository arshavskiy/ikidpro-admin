<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">GPS Activity Map</h3>
      <div class="flex items-center space-x-2">
        <select
          v-model="mapViewMode"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Children</option>
          <option value="individual">Individual Child</option>
        </select>
        <select
          v-if="mapViewMode === 'individual'"
          v-model="selectedMapChild"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Child</option>
          <option
            v-for="childId in availableMapChildren"
            :key="childId"
            :value="childId"
          >
            Child {{ childId }}
          </option>
        </select>
        <button
          @click="toggleHeatmap"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          :class="{ 'bg-blue-50 border-blue-300 text-blue-700': showHeatmap }"
        >
          <i class="fas fa-fire mr-1"></i>
          {{ showHeatmap ? "Hide" : "Show" }} Heatmap
        </button>
      </div>
    </div>

    <!-- Map Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div class="bg-green-50 p-3 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-map-marker-alt text-green-600 mr-2"></i>
          <div>
            <p class="text-sm text-gray-600">GPS Points</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ mapStats.totalGpsPoints }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-blue-50 p-3 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-route text-blue-600 mr-2"></i>
          <div>
            <p class="text-sm text-gray-600">Activity Paths</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ mapStats.activePaths }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-purple-50 p-3 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-expand-arrows-alt text-purple-600 mr-2"></i>
          <div>
            <p class="text-sm text-gray-600">Coverage Area</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ mapStats.coverageArea }} km²
            </p>
          </div>
        </div>
      </div>
      <div class="bg-orange-50 p-3 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-clock text-orange-600 mr-2"></i>
          <div>
            <p class="text-sm text-gray-600">Time Span</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ mapStats.timeSpan }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="relative">
      <div
        ref="mapContainer"
        class="w-full h-96 rounded-lg border border-gray-200"
        style="min-height: 400px"
      ></div>

      <!-- Loading Overlay -->
      <div
        v-if="mapLoading"
        class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
      >
        <div class="text-center">
          <i
            class="fas fa-spinner animate-spin text-2xl text-blue-600 mb-2"
          ></i>
          <p class="text-sm text-gray-600">Loading map data...</p>
        </div>
      </div>

      <!-- No Data Overlay -->
      <div
        v-if="!mapLoading && mapStats.totalGpsPoints === 0"
        class="absolute inset-0 bg-gray-50 flex items-center justify-center rounded-lg"
      >
        <div class="text-center">
          <i class="fas fa-map-marker-alt text-4xl text-gray-400 mb-4"></i>
          <h4 class="text-lg font-medium text-gray-900 mb-2">No GPS Data</h4>
          <p class="text-sm text-gray-600">
            No GPS location data found for the selected period.
          </p>
        </div>
      </div>
    </div>

    <!-- Map Legend -->
    <div class="mt-4 flex flex-wrap items-center gap-4 text-sm">
      <div class="flex items-center">
        <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
        <span class="text-gray-600">Activity Points</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-1 bg-red-500 mr-2"></div>
        <span class="text-gray-600">Movement Path</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
        <span class="text-gray-600">Start Point</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
        <span class="text-gray-600">End Point</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Props
const props = defineProps({
  gpsEvents: {
    type: Array,
    default: () => [],
  },
  selectedChildId: {
    type: String,
    default: "all",
  },
});

// Reactive data
const mapContainer = ref(null);
const map = ref(null);
const mapLoading = ref(true);
const mapViewMode = ref("all");
const selectedMapChild = ref("");
const showHeatmap = ref(false);

// Map layers and markers
const markersLayer = ref(null);
const pathsLayer = ref(null);
const heatmapLayer = ref(null);

// Computed properties
const availableMapChildren = computed(() => {
  const children = [
    ...new Set(props.gpsEvents.map((event) => event.aid)),
  ].filter(Boolean);
  return children.sort();
});

const filteredGpsEvents = computed(() => {
  let events = props.gpsEvents.filter(
    (event) =>
      event.latitude &&
      event.longitude &&
      !isNaN(event.latitude) &&
      !isNaN(event.longitude) &&
      Math.abs(event.latitude) <= 90 &&
      Math.abs(event.longitude) <= 180
  );

  if (mapViewMode.value === "individual" && selectedMapChild.value) {
    events = events.filter((event) => event.aid === selectedMapChild.value);
  }

  // Sort by timestamp for path creation
  return events.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
});

const mapStats = computed(() => {
  const events = filteredGpsEvents.value;

  if (events.length === 0) {
    return {
      totalGpsPoints: 0,
      activePaths: 0,
      coverageArea: 0,
      timeSpan: "0 hours",
    };
  }

  // Calculate coverage area using bounding box
  const lats = events.map((e) => e.latitude);
  const lngs = events.map((e) => e.longitude);
  const latRange = Math.max(...lats) - Math.min(...lats);
  const lngRange = Math.max(...lngs) - Math.min(...lngs);

  // Rough area calculation (in km²)
  const coverageArea =
    Math.round(
      latRange *
        lngRange *
        111 *
        111 *
        Math.cos((Math.min(...lats) * Math.PI) / 180) *
        100
    ) / 100;

  // Calculate time span
  const timestamps = events.map((e) => new Date(e.Timestamp));
  const timeSpanMs = Math.max(...timestamps) - Math.min(...timestamps);
  const timeSpanHours = Math.round((timeSpanMs / (1000 * 60 * 60)) * 10) / 10;

  // Count unique children with GPS data
  const uniqueChildren = [...new Set(events.map((e) => e.aid))].filter(Boolean);

  return {
    totalGpsPoints: events.length,
    activePaths: uniqueChildren.length,
    coverageArea: coverageArea || 0.01,
    timeSpan:
      timeSpanHours > 24
        ? `${Math.round((timeSpanHours / 24) * 10) / 10} days`
        : `${timeSpanHours} hours`,
  };
});

// Methods
const initializeMap = async () => {
  try {
    mapLoading.value = true;

    // Determine center point from GPS data or use default
    let defaultLat = 37.7749; // San Francisco
    let defaultLng = -122.4194;
    let defaultZoom = 13;

    // If we have GPS data, center the map on the first valid point
    if (filteredGpsEvents.value.length > 0) {
      const firstEvent = filteredGpsEvents.value[0];
      defaultLat = firstEvent.latitude;
      defaultLng = firstEvent.longitude;
      defaultZoom = 15;
    }

    // Create map instance
    map.value = L.map(mapContainer.value).setView(
      [defaultLat, defaultLng],
      defaultZoom
    );

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.value);

    // Initialize layer groups
    markersLayer.value = L.layerGroup().addTo(map.value);
    pathsLayer.value = L.layerGroup().addTo(map.value);

    // Load GPS data
    await nextTick();
    updateMapData();
  } catch (error) {
    console.error("Error initializing map:", error);
  } finally {
    mapLoading.value = false;
  }
};

const updateMapData = () => {
  if (!map.value || !markersLayer.value || !pathsLayer.value) return;

  // Clear existing layers
  markersLayer.value.clearLayers();
  pathsLayer.value.clearLayers();

  const events = filteredGpsEvents.value;

  console.log("📍 GPS Map: Processing", events.length, "GPS events");

  if (events.length === 0) {
    console.log("📍 GPS Map: No GPS events to display");
    return;
  }

  // Group events by child for path creation
  const childrenEvents = {};
  events.forEach((event) => {
    const childId = event.aid || "unknown";
    if (!childrenEvents[childId]) {
      childrenEvents[childId] = [];
    }
    childrenEvents[childId].push(event);
  });

  // Color palette for different children
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];
  let colorIndex = 0;

  let bounds = L.latLngBounds();
  let hasValidBounds = false;

  // Process each child's path
  Object.entries(childrenEvents).forEach(([childId, childEvents]) => {
    const color = colors[colorIndex % colors.length];
    colorIndex++;

    if (childEvents.length === 0) return;

    // Sort events by timestamp
    const sortedEvents = childEvents.sort(
      (a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)
    );

    // Create path coordinates
    const pathCoords = sortedEvents.map((event) => [
      event.latitude,
      event.longitude,
    ]);

    // Add coordinates to bounds
    pathCoords.forEach((coord) => {
      bounds.extend(coord);
      hasValidBounds = true;
    });

    // Create polyline for movement path
    if (pathCoords.length > 1) {
      const polyline = L.polyline(pathCoords, {
        color: color,
        weight: 3,
        opacity: 0.7,
      }).addTo(pathsLayer.value);

      polyline.bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold text-gray-900">Child ${childId}</h4>
          <p class="text-sm text-gray-600">Path with ${
            pathCoords.length
          } GPS points</p>
          <p class="text-xs text-gray-500">
            From: ${new Date(sortedEvents[0].Timestamp).toLocaleString()}<br>
            To: ${new Date(
              sortedEvents[sortedEvents.length - 1].Timestamp
            ).toLocaleString()}
          </p>
        </div>
      `);
    }

    // Add start point marker (green)
    if (sortedEvents.length > 0) {
      const startEvent = sortedEvents[0];
      const startMarker = L.circleMarker(
        [startEvent.latitude, startEvent.longitude],
        {
          radius: 8,
          fillColor: "#10B981",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }
      ).addTo(markersLayer.value);

      startMarker.bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold text-green-700">Start Point</h4>
          <p class="text-sm text-gray-900">Child ${childId}</p>
          <p class="text-xs text-gray-600">${new Date(
            startEvent.Timestamp
          ).toLocaleString()}</p>
          ${
            startEvent.HeartRate
              ? `<p class="text-xs text-gray-600">Heart Rate: ${startEvent.HeartRate} BPM</p>`
              : ""
          }
          ${
            startEvent.TemperatureC
              ? `<p class="text-xs text-gray-600">Temperature: ${startEvent.TemperatureC}°C</p>`
              : ""
          }
        </div>
      `);
    }

    // Add end point marker (orange) if different from start
    if (sortedEvents.length > 1) {
      const endEvent = sortedEvents[sortedEvents.length - 1];
      const endMarker = L.circleMarker(
        [endEvent.latitude, endEvent.longitude],
        {
          radius: 8,
          fillColor: "#F59E0B",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }
      ).addTo(markersLayer.value);

      endMarker.bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold text-orange-700">End Point</h4>
          <p class="text-sm text-gray-900">Child ${childId}</p>
          <p class="text-xs text-gray-600">${new Date(
            endEvent.Timestamp
          ).toLocaleString()}</p>
          ${
            endEvent.HeartRate
              ? `<p class="text-xs text-gray-600">Heart Rate: ${endEvent.HeartRate} BPM</p>`
              : ""
          }
          ${
            endEvent.TemperatureC
              ? `<p class="text-xs text-gray-600">Temperature: ${endEvent.TemperatureC}°C</p>`
              : ""
          }
        </div>
      `);
    }

    // Add activity points for significant events (every 10th point to avoid clutter)
    sortedEvents.forEach((event, index) => {
      if (index % Math.max(1, Math.floor(sortedEvents.length / 20)) === 0) {
        const marker = L.circleMarker([event.latitude, event.longitude], {
          radius: 4,
          fillColor: color,
          color: "#ffffff",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6,
        }).addTo(markersLayer.value);

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold text-gray-900">Activity Point</h4>
            <p class="text-sm text-gray-900">Child ${childId}</p>
            <p class="text-xs text-gray-600">${new Date(
              event.Timestamp
            ).toLocaleString()}</p>
            <p class="text-xs text-gray-600">Lat: ${event.latitude.toFixed(
              6
            )}, Lng: ${event.longitude.toFixed(6)}</p>
            ${
              event.HeartRate
                ? `<p class="text-xs text-gray-600">Heart Rate: ${event.HeartRate} BPM</p>`
                : ""
            }
            ${
              event.TemperatureC
                ? `<p class="text-xs text-gray-600">Temperature: ${event.TemperatureC}°C</p>`
                : ""
            }
            ${
              event.SoundLevel
                ? `<p class="text-xs text-gray-600">Sound Level: ${event.SoundLevel} dB</p>`
                : ""
            }
          </div>
        `);
      }
    });
  });

  // Fit map to show all markers if we have valid bounds
  if (hasValidBounds && bounds.isValid()) {
    map.value.fitBounds(bounds, { padding: [20, 20] });
  }
};

const toggleHeatmap = () => {
  showHeatmap.value = !showHeatmap.value;
  // Heatmap implementation would go here if needed
  // This would require additional libraries like leaflet.heat
};

// Watchers
watch(
  [filteredGpsEvents, mapViewMode, selectedMapChild],
  () => {
    if (map.value) {
      updateMapData();
    }
  },
  { deep: true }
);

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initializeMap();
  });
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
/* Override Leaflet's default styles to work better with Tailwind */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0.5rem;
}

:deep(.leaflet-popup-content) {
  margin: 0;
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
}
</style>
