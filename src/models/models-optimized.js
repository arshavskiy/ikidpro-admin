// Centralized and optimized data models
import { h, ref } from "vue";

// Core sensor configuration - single source of truth
export const SENSOR_TYPES = {
  HeartRate: {
    label: "Heart Rate",
    field: "heartRate",
    dataField: "HeartRate",
    icon: "fa-heartbeat",
    color: "#ef4444",
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    barClass: "bg-red-600",
    yAxisIndex: 0,
  },
  HRV: {
    label: "Heart Rate Variability",
    field: "hrv",
    dataField: "HRV",
    icon: "fa-wave-square",
    color: "#f59e0b",
    iconClass: "text-amber-600",
    bgClass: "bg-amber-50",
    barClass: "bg-amber-600",
    yAxisIndex: 0,
  },
  Sp02: {
    label: "SpO2",
    field: "spo2",
    dataField: ["Sp02", "spo2"],
    icon: "fa-percentage",
    color: "#06b6d4",
    iconClass: "text-sky-600",
    bgClass: "bg-sky-50",
    barClass: "bg-sky-600",
    yAxisIndex: 0,
  },
  Temperature: {
    label: "Temperature",
    field: "temperature",
    dataField: ["Temperature", "TemperatureC"],
    icon: "fa-thermometer-half",
    color: "#3b82f6",
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
    barClass: "bg-blue-600",
    yAxisIndex: 1,
  },
  SoundLevel: {
    label: "Sound Level",
    field: "sound",
    dataField: "SoundLevel",
    icon: "fa-volume-up",
    color: "#8b5cf6",
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
    barClass: "bg-purple-600",
    yAxisIndex: 0,
  },
  EDA: {
    label: "Electrodermal Activity",
    field: "eda",
    dataField: "EDA",
    icon: "fa-bolt",
    color: "#7c3aed",
    iconClass: "text-violet-600",
    bgClass: "bg-violet-50",
    barClass: "bg-violet-600",
    yAxisIndex: 0,
  },
  scl: {
    label: "Conductance Level",
    field: "scl",
    dataField: "scl",
    icon: "fa-wave-square",
    color: "#059669",
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    barClass: "bg-emerald-600",
    yAxisIndex: 0,
  },
  scr: {
    label: "Conductance Responses",
    field: "scr",
    dataField: "scr",
    icon: "fa-wave-square",
    color: "#0ea5e9",
    iconClass: "text-teal-600",
    bgClass: "bg-teal-50",
    barClass: "bg-teal-600",
    yAxisIndex: 0,
  },
  respiratoryRate: {
    label: "Respiratory Rate",
    field: "respiratoryRate",
    dataField: "respiratoryRate",
    icon: "fa-lungs",
    color: "#14b8a6",
    iconClass: "text-cyan-600",
    bgClass: "bg-cyan-50",
    barClass: "bg-cyan-600",
    yAxisIndex: 0,
  },
  humidity: {
    label: "Humidity",
    field: "humidity",
    dataField: "humidity",
    icon: "fa-water",
    color: "#3b82f6",
    iconClass: "text-blue-700",
    bgClass: "bg-blue-50",
    barClass: "bg-blue-700",
    yAxisIndex: 0,
  },
  // Motion sensors (grouped)
  motion: {
    label: "Motion",
    field: "motion",
    dataField: ["AccelX", "AccelY", "AccelZ"],
    icon: "fa-running",
    color: "#14b8a6",
    iconClass: "text-teal-600",
    bgClass: "bg-teal-50",
    barClass: "bg-teal-600",
    yAxisIndex: 0,
    transform: "magnitude",
    hidden: true, // Hide individual components from dropdowns
  },
  AccelX: {
    label: "Accelerometer X",
    field: "accelX",
    dataField: "AccelX",
    hidden: true,
  },
  AccelY: {
    label: "Accelerometer Y",
    field: "accelY",
    dataField: "AccelY",
    hidden: true,
  },
  AccelZ: {
    label: "Accelerometer Z",
    field: "accelZ",
    dataField: "AccelZ",
    hidden: true,
  },
  // Gyroscope sensors (grouped)
  GyroX: {
    label: "Gyroscope X",
    field: "gyroX",
    dataField: "GyroX",
    hidden: true,
  },
  GyroY: {
    label: "Gyroscope Y",
    field: "gyroY",
    dataField: "GyroY",
    hidden: true,
  },
  GyroZ: {
    label: "Gyroscope Z",
    field: "gyroZ",
    dataField: "GyroZ",
    hidden: true,
  },
  // GPS sensors (grouped)
  gps: {
    label: "GPS Location",
    field: "gps",
    dataField: ["latitude", "longitude"],
    icon: "fa-map-marker-alt",
    color: "#10b981",
    iconClass: "text-green-600",
    bgClass: "bg-green-50",
    barClass: "bg-green-600",
    yAxisIndex: 0,
  },
  latitude: {
    label: "GPS Latitude",
    field: "latitude",
    dataField: "latitude",
    hidden: true,
  },
  longitude: {
    label: "GPS Longitude",
    field: "longitude",
    dataField: "longitude",
    hidden: true,
  },
  altitude: {
    label: "GPS Altitude",
    field: "altitude",
    dataField: "altitude",
    icon: "fa-mountain",
    color: "#0f766e",
    iconClass: "text-teal-700",
    bgClass: "bg-teal-50",
    barClass: "bg-teal-700",
    yAxisIndex: 1,
  },
  // Additional sensors
  mood: {
    label: "Mood",
    field: "mood",
    dataField: "mood",
    icon: "fa-smile",
    color: "#ec4899",
    iconClass: "text-pink-600",
    bgClass: "bg-pink-50",
    barClass: "bg-pink-600",
    yAxisIndex: 0,
  },
  steps: {
    label: "Steps",
    field: "steps",
    dataField: "steps",
    icon: "fa-shoe-prints",
    color: "#365314",
    iconClass: "text-green-800",
    bgClass: "bg-green-50",
    barClass: "bg-green-800",
    yAxisIndex: 0,
  },
  calories: {
    label: "Calories",
    field: "calories",
    dataField: "calories",
    icon: "fa-fire",
    color: "#92400e",
    iconClass: "text-orange-600",
    bgClass: "bg-orange-50",
    barClass: "bg-orange-600",
    yAxisIndex: 0,
  },
  // Less common sensors with minimal config
  speed_mps: {
    label: "Speed (m/s)",
    field: "speed",
    dataField: ["speed_mps", "speed"],
    hidden: true,
  },
  bearing_deg: {
    label: "Bearing (degrees)",
    field: "bearing",
    dataField: "bearing_deg",
    hidden: true,
  },
  accuracy_m: {
    label: "GPS Accuracy",
    field: "accuracy",
    dataField: "accuracy_m",
    hidden: true,
  },
  satellites: {
    label: "Satellites",
    field: "satellites",
    dataField: "satellites",
    hidden: true,
  },
  magneticX: {
    label: "Magnetometer X",
    field: "magneticX",
    dataField: "magneticX",
    hidden: true,
  },
  magneticY: {
    label: "Magnetometer Y",
    field: "magneticY",
    dataField: "magneticY",
    hidden: true,
  },
  magneticZ: {
    label: "Magnetometer Z",
    field: "magneticZ",
    dataField: "magneticZ",
    hidden: true,
  },
  pressure: {
    label: "Pressure",
    field: "pressure",
    dataField: "pressure",
    hidden: true,
  },
  light: {
    label: "Light Level",
    field: "light",
    dataField: "light",
    hidden: true,
  },
};

// Generated configurations from SENSOR_TYPES
export const eventTypeOptions = [
  { value: "all", label: "All Events" },
  ...Object.entries(SENSOR_TYPES)
    .filter(([_, config]) => !config.hidden)
    .map(([key, config]) => ({ value: key, label: config.label })),
];

export const distributionMap = Object.fromEntries(
  Object.entries(SENSOR_TYPES)
    .filter(([_, config]) => config.field && config.icon)
    .map(([key, config]) => [
      key,
      {
        distKey: config.field,
        label: config.label,
        icon: config.icon,
        iconClass: config.iconClass,
        bgClass: config.bgClass,
        barClass: config.barClass,
      },
    ])
);

export const distKeyToEventTypes = Object.fromEntries(
  Object.entries(SENSOR_TYPES)
    .filter(([_, config]) => config.field)
    .map(([key, config]) => [config.field, [key]])
);

export const sensorConfig = Object.fromEntries(
  Object.entries(SENSOR_TYPES)
    .filter(([_, config]) => config.field && config.color)
    .map(([key, config]) => [
      key,
      {
        field: config.dataField,
        color: config.color,
        yAxisIndex: config.yAxisIndex || 0,
        ...(config.transform && { transform: config.transform }),
      },
    ])
);

export const eventTypeToSensorKey = Object.fromEntries(
  Object.entries(SENSOR_TYPES)
    .filter(([_, config]) => config.field)
    .map(([key, config]) => [key, key])
);

// Timeline mapping
export const typeToTimeline = Object.fromEntries(
  Object.entries(SENSOR_TYPES)
    .filter(([_, config]) => config.field && config.color)
    .map(([key, config]) => [
      key,
      {
        field: config.field,
        label: config.label,
        color: config.color,
      },
    ])
);

// Other configurations
export const timeRangeOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last year", value: "365" },
];

export const shouldHideEventType = (val) => {
  const v = String(val || "").toLowerCase();
  return (
    SENSOR_TYPES[val]?.hidden ||
    v === "gps" ||
    v === "motion" ||
    v.includes("accel") ||
    v.includes("gyro") ||
    v.includes("magnetic")
  );
};

// Default analytics structure
export const getDefaultAnalytics = () => ({
  totalEvents: 0,
  activeChildren: 0,
  avgDailyEvents: 0,
  peakHour: 0,
  heartRate: { average: 0, max: 0, min: 0, count: 0 },
  temperature: { average: 0, max: 0, min: 0, count: 0 },
  activity: { gpsCount: 0, soundCount: 0, motionCount: 0, avgSoundLevel: 0 },
  dailyTrend: [],
  hourlyDistribution: [],
  eventTimeline: [],
  sensorValues: [],
  sensorDistribution: Object.fromEntries(
    Object.entries(SENSOR_TYPES)
      .filter(([_, config]) => config.field)
      .map(([key, config]) => [config.field, key === "mood" ? {} : 0])
  ),
  topActiveChildren: [],
  healthInsights: [],
  trends: { increasedActivity: 0, stableHeartRate: 0, normalTemperature: 0 },
});

// API endpoints
export const API_ENDPOINTS = {
  auth: [
    { name: "Register User", method: "POST", url: "/auth/register" },
    { name: "Login User", method: "POST", url: "/auth/login" },
    { name: "Get Current User", method: "GET", url: "/auth/me" },
  ],
  users: [
    { name: "Get All Users", method: "GET", url: "/users" },
    { name: "Create User", method: "POST", url: "/users" },
    {
      name: "Get User by ID",
      method: "GET",
      url: "/user/id/:id",
      params: ["id"],
    },
    { name: "Update User", method: "PUT", url: "/user/id/:id", params: ["id"] },
    {
      name: "Delete User",
      method: "DELETE",
      url: "/user/id/:id",
      params: ["id"],
    },
  ],
  children: [
    { name: "Create Child", method: "POST", url: "/child-users" },
    { name: "Get All Children", method: "GET", url: "/child-users" },
    {
      name: "Get Child by ID",
      method: "GET",
      url: "/child-users/id/:id",
      params: ["id"],
    },
    {
      name: "Get Children by Parent",
      method: "GET",
      url: "/child-users/parent/:parentId/children",
      params: ["parentId"],
    },
  ],
  events: [
    { name: "Create Event", method: "POST", url: "/event" },
    { name: "Get All Events", method: "GET", url: "/event" },
    {
      name: "Get Events by Child",
      method: "GET",
      url: "/event/child/:childId",
      params: ["childId"],
    },
  ],
};

// Navigation menu
export const menuOptions = [
  {
    label: "Analytics",
    key: "analytics",
    icon: () => h("i", { class: "fas fa-chart-bar" }),
    children: [
      {
        label: "Event Statistics",
        key: "/admin/analytics/events",
        icon: () => h("i", { class: "fas fa-chart-bar" }),
      },
    ],
  },
  {
    label: "User Management",
    key: "users",
    icon: () => h("i", { class: "fas fa-users" }),
    children: [
      {
        label: "All Parents",
        key: "/admin/users",
        icon: () => h("i", { class: "fas fa-list" }),
      },
      {
        label: "Add Parent",
        key: "/admin/users/create",
        icon: () => h("i", { class: "fas fa-plus" }),
      },
      {
        label: "All Children",
        key: "/admin/children",
        icon: () => h("i", { class: "fas fa-child" }),
      },
      {
        label: "Add Child",
        key: "/admin/children/create",
        icon: () => h("i", { class: "fas fa-plus" }),
      },
    ],
  },
  {
    label: "Event Management",
    key: "events",
    icon: () => h("i", { class: "fas fa-chart-line" }),
    children: [
      {
        label: "All Events",
        key: "/admin/events",
        icon: () => h("i", { class: "fas fa-list" }),
      },
      {
        label: "Add Event",
        key: "/admin/events/create",
        icon: () => h("i", { class: "fas fa-plus" }),
      },
      {
        label: "By Child",
        key: "/admin/events/by-child",
        icon: () => h("i", { class: "fas fa-child" }),
      },
    ],
  },
  {
    label: "System",
    key: "system",
    icon: () => h("i", { class: "fas fa-cog" }),
    children: [
      {
        label: "Database Info",
        key: "/admin/system/database",
        icon: () => h("i", { class: "fas fa-database" }),
      },
      {
        label: "API Testing",
        key: "/admin/system/api-test",
        icon: () => h("i", { class: "fas fa-flask" }),
      },
      {
        label: "Waitlist",
        key: "/admin/waitlist",
        icon: () => h("i", { class: "fas fa-clipboard-list" }),
      },
    ],
  },
];

// Sample data
export const samples = ref({
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
      Temperature: 36.7,
      SoundLevel: 45,
      aid: "child123",
    },
    null,
    2
  ),
});

// Default event form (only essential fields)
export const defaultEventForm = {
  aid: "",
  Timestamp: "",
  ...Object.fromEntries(
    Object.entries(SENSOR_TYPES)
      .filter(([_, config]) => config.dataField)
      .flatMap(([key, config]) => {
        const fields = Array.isArray(config.dataField)
          ? config.dataField
          : [config.dataField];
        return fields.map((field) => [field, null]);
      })
  ),
};

// Router configuration
export const appRoutes = [
  // {
  //   path: "/",
  //   name: "EventsList",
  //   component: () => import("../pages/admin/EventManagement.vue"),
  // },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/admin/createUserWithChild.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/admin",
    component: () => import("../components/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "users",
        name: "UsersList",
        component: () => import("../pages/admin/UserManagement.vue"),
      },
      {
        path: "users/create",
        name: "UserCreate",
        component: () => import("../pages/admin/UserCreate.vue"),
      },
      {
        path: "users/edit/:id",
        name: "UserEdit",
        component: () => import("../pages/admin/UserEdit.vue"),
      },
      {
        path: "children",
        name: "ChildrenList",
        component: () => import("../pages/admin/ChildManagement.vue"),
      },
      {
        path: "children/create",
        name: "ChildCreate",
        component: () => import("../pages/admin/ChildCreate.vue"),
      },
      {
        path: "children/edit/:id",
        name: "ChildEdit",
        component: () => import("../pages/admin/ChildEdit.vue"),
      },
      {
        path: "children/by-parent",
        name: "ChildByParent",
        component: () => import("../pages/admin/ChildByParent.vue"),
      },
      {
        path: "events",
        name: "EventsList",
        component: () => import("../pages/admin/EventManagement.vue"),
      },
      {
        path: "events/create",
        name: "EventCreate",
        component: () => import("../pages/admin/EventCreate.vue"),
      },
      {
        path: "events/edit/:id",
        name: "EventEdit",
        component: () => import("../pages/admin/EventEdit.vue"),
      },
      {
        path: "events/by-child",
        name: "EventsByChild",
        component: () => import("../pages/admin/EventsByChild.vue"),
      },
      {
        path: "events/bulk",
        name: "EventsBulk",
        component: () => import("../pages/admin/EventsBulk.vue"),
      },
      {
        path: "data/management",
        name: "DataManagement",
        component: () => import("../pages/admin/DataManagement.vue"),
      },
      {
        path: "data/export",
        name: "DataExport",
        component: () => import("../pages/admin/DataExport.vue"),
      },
      {
        path: "waitlist",
        name: "WaitlistManagement",
        component: () => import("../pages/admin/WaitlistManagement.vue"),
      },
      {
        path: "analytics/events",
        name: "EventStats",
        component: () => import("../pages/admin/EventAnalytics.vue"),
      },
      {
        path: "system/database",
        name: "DatabaseInfo",
        component: () => import("../pages/admin/DatabaseInfo.vue"),
      },
      {
        path: "system/api-test",
        name: "ApiTesting",
        component: () => import("../pages/admin/ApiTesting.vue"),
      },
      {
        path: "system/logs",
        name: "SystemLogs",
        component: () => import("../pages/admin/SystemLogs.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/admin/analytics/events" },
];

// CSV templates for data import/export
export const csvTemplates = {
  users: [
    ["firstName", "lastName", "email", "phone", "role", "isActive"],
    ["John", "Doe", "john.doe@example.com", "+1234567890", "parent", "true"],
  ],
  events: [
    ["aid", "Timestamp", "HeartRate", "Temperature", "SoundLevel"],
    ["child_001", "2024-05-01T12:00:00Z", "75", "36.8", "42"],
  ],
};

// Legacy compatibility exports (keep only what's actively used)
export const userEndpoints = API_ENDPOINTS.users;
export const childEndpoints = API_ENDPOINTS.children;
export const eventEndpoints = API_ENDPOINTS.events;
export const availableSensorOptions = eventTypeOptions.slice(1); // Remove "all" option
