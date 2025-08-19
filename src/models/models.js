// Centralized data objects and helpers used across .vue files
import { h, ref } from "vue";

// Time range options for analytics views
export const timeRangeOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last year", value: "365" },
];

// Unified list of event types (used by dropdowns and charts)
export const eventTypeOptions = [
  { value: "all", label: "All Events" },
  { value: "HeartRate", label: "Heart Rate" },
  { value: "respiratoryRate", label: "Respiratory Rate" },
  { value: "Temperature", label: "Temperature" },
  { value: "HRV", label: "Heart Rate Variability" },
  { value: "Sp02", label: "SpO2" },
  // { value: "AccelX", label: "Accelerometer X" },
  // { value: "AccelY", label: "Accelerometer Y" },
  // { value: "AccelZ", label: "Accelerometer Z" },
  // { value: "GyroX", label: "Gyroscope X" },
  // { value: "GyroY", label: "Gyroscope Y" },
  // { value: "GyroZ", label: "Gyroscope Z" },
  { value: "EDA", label: "Electrodermal activity" },
  { value: "scl", label: "Conductance Level" },
  { value: "scr", label: "Conductance Responses" },
  { value: "SoundLevel", label: "Sound Level" },
  { value: "humidity", label: "Humidity" },
  // { value: "latitude", label: "GPS Latitude" },
  // { value: "longitude", label: "GPS Longitude" },
  // { value: "altitude", label: "GPS Altitude" },
  { value: "speed_mps", label: "Speed (m/s)" },
  // { value: "bearing_deg", label: "Bearing (degrees)" },
  { value: "accuracy_m", label: "GPS Accuracy" },
  { value: "satellites", label: "Satellites" },
  { value: "steps", label: "Steps" },
  { value: "calories", label: "Calories" },
  // { value: "magneticX", label: "Magnetometer X" },
  // { value: "magneticY", label: "Magnetometer Y" },
  // { value: "magneticZ", label: "Magnetometer Z" },
  { value: "pressure", label: "Pressure" },
  { value: "light", label: "Light Level" },
  { value: "mood", label: "Mood" },
  // { value: "gps", label: "GPS Location" },
  { value: "motion", label: "Motion" },
];

// Predicate to hide certain event types from multi-select dropdowns
export const shouldHideEventType = (val) => {
  const v = String(val || "").toLowerCase();
  return (
    v === "gps" ||
    v === "latitude" ||
    v === "longitude" ||
    v === "altitude" ||
    v === "satellites" ||
    v.includes("accel") ||
    v.includes("gyro") ||
    v.includes("magnetic") ||
    v.includes("pressure") ||
    v.includes("bearing_deg") ||
    v.includes("accuracy")
  );
};

// Body metrics suitable for rules engine and thresholds
export const bodyMetricOptions = [
  { label: "Heart Rate (bpm)", value: "HeartRate" },
  { label: "Heart Rate Variability", value: "HRV" },
  { label: "SpO2 (%)", value: "Sp02" },
  { label: "Temperature (°C)", value: "Temperature" },
  { label: "Electrodermal Activity (μS)", value: "EDA" },
  { label: "Skin Conductance Level", value: "scl" },
  { label: "Skin Conductance Response", value: "scr" },
  { label: "Respiratory Rate (breaths/min)", value: "respiratoryRate" },
  { label: "Sound Level (dB)", value: "SoundLevel" },
  { label: "Humidity (%)", value: "humidity" },
  { label: "Pressure (hPa)", value: "pressure" },
  { label: "Light Level (lux)", value: "light" },
  { label: "Steps", value: "steps" },
  { label: "Calories", value: "calories" },
  { label: "Accelerometer X (g)", value: "AccelX" },
  { label: "Accelerometer Y (g)", value: "AccelY" },
  { label: "Accelerometer Z (g)", value: "AccelZ" },
  { label: "Gyroscope X (°/s)", value: "GyroX" },
  { label: "Gyroscope Y (°/s)", value: "GyroY" },
  { label: "Gyroscope Z (°/s)", value: "GyroZ" },
  { label: "Magnetometer X (μT)", value: "magneticX" },
  { label: "Magnetometer Y (μT)", value: "magneticY" },
  { label: "Magnetometer Z (μT)", value: "magneticZ" },
  { label: "GPS Altitude (m)", value: "altitude" },
  { label: "Speed (m/s)", value: "speed_mps" },
  { label: "GPS Accuracy (m)", value: "accuracy_m" },
  { label: "Satellites Count", value: "satellites" },
];

// Mapping from event type to distribution category and presentation
export const distributionMap = {
  HeartRate: {
    distKey: "heartRate",
    label: "Heart Rate",
    icon: "fa-heartbeat",
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    barClass: "bg-red-600",
  },
  HRV: {
    distKey: "hrv",
    label: "HRV",
    icon: "fa-wave-square",
    iconClass: "text-amber-600",
    bgClass: "bg-amber-50",
    barClass: "bg-amber-600",
  },
  Sp02: {
    distKey: "spo2",
    label: "SpO2",
    icon: "fa-percentage",
    iconClass: "text-sky-600",
    bgClass: "bg-sky-50",
    barClass: "bg-sky-600",
  },
  EDA: {
    distKey: "eda",
    label: "EDA",
    icon: "fa-bolt",
    iconClass: "text-violet-600",
    bgClass: "bg-violet-50",
    barClass: "bg-violet-600",
  },
  Temperature: {
    distKey: "temperature",
    label: "Temperature",
    icon: "fa-thermometer-half",
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
    barClass: "bg-blue-600",
  },
  scl: {
    distKey: "scl",
    label: "SCL",
    icon: "fa-wave-square",
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    barClass: "bg-emerald-600",
  },
  scr: {
    distKey: "scr",
    label: "SCR",
    icon: "fa-wave-square",
    iconClass: "text-teal-600",
    bgClass: "bg-teal-50",
    barClass: "bg-teal-600",
  },
  respiratoryRate: {
    distKey: "respiratoryRate",
    label: "Respiratory Rate",
    icon: "fa-lungs",
    iconClass: "text-cyan-600",
    bgClass: "bg-cyan-50",
    barClass: "bg-cyan-600",
  },
  humidity: {
    distKey: "humidity",
    label: "Humidity",
    icon: "fa-water",
    iconClass: "text-blue-700",
    bgClass: "bg-blue-50",
    barClass: "bg-blue-700",
  },
  SoundLevel: {
    distKey: "sound",
    label: "Sound Level",
    icon: "fa-volume-up",
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
    barClass: "bg-purple-600",
  },
  motion: {
    distKey: "motion",
    label: "Motion",
    icon: "fa-running",
    iconClass: "text-teal-600",
    bgClass: "bg-teal-50",
    barClass: "bg-teal-600",
  },
  pressure: {
    distKey: "pressure",
    label: "Pressure",
    icon: "fa-tachometer-alt",
    iconClass: "text-purple-700",
    bgClass: "bg-purple-50",
    barClass: "bg-purple-700",
  },
  light: {
    distKey: "light",
    label: "Light",
    icon: "fa-lightbulb",
    iconClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
    barClass: "bg-yellow-600",
  },
  mood: {
    distKey: "mood",
    label: "Mood",
    icon: "fa-smile",
    iconClass: "text-pink-600",
    bgClass: "bg-pink-50",
    barClass: "bg-pink-600",
  },
  steps: {
    distKey: "steps",
    label: "Steps",
    icon: "fa-shoe-prints",
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    barClass: "bg-emerald-600",
  },
  calories: {
    distKey: "calories",
    label: "Calories",
    icon: "fa-fire",
    iconClass: "text-orange-600",
    bgClass: "bg-orange-50",
    barClass: "bg-orange-600",
  },
  speed_mps: {
    distKey: "speed",
    label: "Speed",
    icon: "fa-tachometer-alt",
    iconClass: "text-rose-600",
    bgClass: "bg-rose-50",
    barClass: "bg-rose-600",
  },
  accuracy_m: {
    distKey: "accuracy",
    label: "Accuracy",
    icon: "fa-bullseye",
    iconClass: "text-indigo-700",
    bgClass: "bg-indigo-50",
    barClass: "bg-indigo-700",
  },
  satellites: {
    distKey: "satellites",
    label: "Satellites",
    icon: "fa-satellite",
    iconClass: "text-slate-600",
    bgClass: "bg-slate-50",
    barClass: "bg-slate-600",
  },
};

// Reverse mapping: distribution category to event types for selections
export const distKeyToEventTypes = {
  heartRate: ["HeartRate"],
  hrv: ["HRV"],
  spo2: ["Sp02"],
  eda: ["EDA"],
  temperature: ["Temperature"],
  scl: ["scl"],
  scr: ["scr"],
  respiratoryRate: ["respiratoryRate"],
  humidity: ["humidity"],
  sound: ["SoundLevel"],
  gps: ["gps", "latitude", "longitude"],
  motion: ["AccelX", "AccelY", "AccelZ", "motion"],
  gyro: ["GyroX", "GyroY", "GyroZ"],
  magnetic: ["magneticX", "magneticY", "magneticZ"],
  pressure: ["pressure"],
  light: ["light"],
  mood: ["mood"],
  steps: ["steps"],
  calories: ["calories"],
  altitude: ["altitude"],
  speed: ["speed_mps", "speed"],
  bearing: ["bearing_deg"],
  accuracy: ["accuracy_m"],
  satellites: ["satellites"],
};

// Default analytics shape
export const getDefaultAnalytics = {
  totalEvents: 0,
  activeChildren: 0,
  avgDailyEvents: 0,
  peakHour: 0,
  heartRate: {
    average: 0,
    max: 0,
    min: 0,
    count: 0,
  },
  temperature: {
    average: 0,
    max: 0,
    min: 0,
    count: 0,
  },
  activity: {
    gpsCount: 0,
    soundCount: 0,
    motionCount: 0,
    avgSoundLevel: 0,
  },
  dailyTrend: [],
  hourlyDistribution: [],
  eventTimeline: [],
  sensorValues: [],
  sensorDistribution: {
    heartRate: 0,
    temperature: 0,
    spo2: 0,
    scl: 0,
    scr: 0,
    respiratoryRate: 0,
    humidity: 0,
    gps: 0,
    sound: 0,
    motion: 0,
    eda: 0,
    hrv: 0,
    gyro: 0,
    magnetic: 0,
    pressure: 0,
    light: 0,
    steps: 0,
    calories: 0,
    altitude: 0,
    speed: 0,
    bearing: 0,
    accuracy: 0,
    satellites: 0,
  },
  topActiveChildren: [],
  healthInsights: [],
  trends: {
    increasedActivity: 0,
    stableHeartRate: 0,
    normalTemperature: 0,
  },
};

export const availableEventColumns = [
  { key: "timestamp", title: "Timestamp", default: true },
  { key: "childId", title: "Child ID", default: true },
  { key: "heartRate", title: "Heart Rate", default: true },
  { key: "location", title: "Location", default: true },
  { key: "temperature", title: "Temperature", default: true },
  { key: "soundLevel", title: "Sound Level", default: true },
  { key: "hrv", title: "HRV", default: false },
  { key: "eda", title: "EDA", default: false },
  { key: "altitude", title: "Altitude", default: false },
  { key: "speed", title: "Speed", default: false },
  { key: "accelerometer", title: "Accelerometer", default: false },
  { key: "gyroscope", title: "Gyroscope", default: false },
  { key: "accelX", title: "Accel X", default: false },
  { key: "accelY", title: "Accel Y", default: false },
  { key: "accelZ", title: "Accel Z", default: false },
  { key: "gyroX", title: "Gyro X", default: false },
  { key: "gyroY", title: "Gyro Y", default: false },
  { key: "gyroZ", title: "Gyro Z", default: false },
  { key: "parentId", title: "Parent ID", default: false },
  { key: "batteryLevel", title: "Battery Level", default: false },
  { key: "signalStrength", title: "Signal Strength", default: false },
  { key: "actions", title: "Actions", default: true },
  { key: "mood", title: "Mood", default: true },
  { key: "rules", title: "Mood", default: true },
];

// API endpoint definitions
export const userEndpoints = [
  // Auth
  { name: "Register User", method: "POST", url: "/auth/register" },
  { name: "Login User", method: "POST", url: "/auth/login" },
  { name: "Logout User", method: "POST", url: "/auth/logout" },
  { name: "Get Current User (me)", method: "GET", url: "/auth/me" },
  { name: "Refresh Token", method: "POST", url: "/auth/refresh" },
  { name: "User Stats", method: "GET", url: "/auth/stats" },
  // Admin user management
  { name: "Get All Users", method: "GET", url: "/users" },
  { name: "Get User Count", method: "GET", url: "/users/count" },
  {
    name: "Get User by ID",
    method: "GET",
    url: "/user/id/:id",
    params: ["id"],
  },
  { name: "Create User", method: "POST", url: "/users" },
  {
    name: "Update User",
    method: "PUT",
    url: "/user/id/:id",
    params: ["id"],
  },
  {
    name: "Delete User",
    method: "DELETE",
    url: "/user/id/:id",
    params: ["id"],
  },
];

export const childEndpoints = [
  { name: "Create Child", method: "POST", url: "/child-users" },
  { name: "Get All Children", method: "GET", url: "/child-users" },
  { name: "Get Child Count", method: "GET", url: "/child-users/count" },
  {
    name: "Get Child by ID",
    method: "GET",
    url: "/child-users/id/:id",
    params: ["id"],
  },
  {
    name: "Update Child",
    method: "PUT",
    url: "/child-users/id/:id",
    params: ["id"],
  },
  {
    name: "Delete Child",
    method: "DELETE",
    url: "/child-users/id/:id",
    params: ["id"],
  },
  {
    name: "Get Children by Parent",
    method: "GET",
    url: "/child-users/parent/:parentId/children",
    params: ["parentId"],
  },
  { name: "Children Stats", method: "GET", url: "/child-users/stats" },
  {
    name: "Search Children",
    method: "GET",
    url: "/child-users/search?q=:query",
    params: ["query"],
  },
];

export const eventEndpoints = [
  { name: "Create Event", method: "POST", url: "/event" },
  { name: "Get All Events", method: "GET", url: "/event" },
  { name: "Get Event Count", method: "GET", url: "/event/count" },
  { name: "Get Collections", method: "GET", url: "/event/dbs" },
  { name: "Get DB Stats", method: "GET", url: "/admin/database-stats" },
  {
    name: "Get Event by ID",
    method: "GET",
    url: "/event/:id",
    params: ["id"],
  },
  {
    name: "Get Events by Child",
    method: "GET",
    url: "/event/child/:childId",
    params: ["childId"],
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
];

export const samples = ref({
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
      Temperature: 36.7,
      SoundLevel: 45,
      mood: "active",
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

// Default event form template (fields supported by EventCreate)
export const defaultEventForm = {
  aid: "",
  Timestamp: "",
  HeartRate: null,
  HRV: null,
  Sp02: null,
  AccelX: null,
  AccelY: null,
  AccelZ: null,
  GyroX: null,
  GyroY: null,
  GyroZ: null,
  EDA: null,
  scl: null,
  scr: null,
  respiratoryRate: null,
  Temperature: null,
  SoundLevel: null,
  humidity: null,
  pressure: null,
  light: null,
  mood: null,
  steps: null,
  calories: null,
  magneticX: null,
  magneticY: null,
  magneticZ: null,
  latitude: null,
  longitude: null,
  altitude: null,
  speed_mps: null,
  bearing_deg: null,
  accuracy_m: null,
  satellites: null,
};

// Admin Sidebar Menu Options
export const menuOptions = [
  {
    label: "Analytics",
    key: "/admin/analytics/events",
    icon: () => h("i", { class: "fas fa-chart-bar" }),
    // children: [
    //   {
    //     label: "Event Statistics",
    //     key: "/admin/analytics/events",
    //     icon: () => h("i", { class: "fas fa-chart-bar" }),
    //   },
    // ],
  },
  {
    label: "Events",
    key: "/admin/events",
    icon: () => h("i", { class: "fas fa-chart-line" }),
    // children: [
    //   {
    //     label: "Events Profiles",
    //     key: "/admin/events",
    //     icon: () => h("i", { class: "fas fa-list" }),
    //   },
    // ],
  },
  {
    label: "Users",
    key: "/admin/children",
    icon: () => h("i", { class: "fas fa-child" }),
    children: [
      {
        label: "Parents",
        key: "/admin/users",
        icon: () => h("i", { class: "fas fa-list" }),
      },

      {
        label: "Children Profiles",
        key: "/admin/children",
        icon: () => h("i", { class: "fas fa-list" }),
      },
    ],
  },
  {
    label: "B2B Management",
    key: "/admin/b2b/registration",
    icon: () => h("i", { class: "fas fa-database" }),
    children: [
      {
        label: "Registration",
        key: "/admin/b2b/registration",
        icon: () => h("i", { class: "fas fa-building" }),
      },
    ],
  },
  {
    label: "Admin Management",
    key: "data",
    icon: () => h("i", { class: "fas fa-database" }),
    children: [
      {
        label: "Data Import",
        key: "/admin/data/management",
        icon: () => h("i", { class: "fas fa-file-upload" }),
      },
      {
        label: "Data Export",
        key: "/admin/data/export",
        icon: () => h("i", { class: "fas fa-file-download" }),
      },
      {
        label: "Rules Engine",
        key: "/admin/data/rules",
        icon: () => h("i", { class: "fas fa-project-diagram" }),
      },
      {
        label: "Waitlist",
        key: "/admin/waitlist",
        icon: () => h("i", { class: "fas fa-clipboard-list" }),
      },
      // {
      //   label: "B2B Registration",
      //   key: "/admin/b2b",
      //   icon: () => h("i", { class: "fas fa-building" }),
      // },
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
    ],
  },
];

// Full router route table (for src/router/index.js)
export const appRoutes = [
  {
    path: "/",
    name: "EventsList",
    component: () => import("../pages/admin/EventManagement.vue"),
  },
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
        path: "users/profiles",
        name: "UserProfiles",
        component: () => import("../pages/admin/UserManagement.vue"),
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
        path: "b2b/registration",
        name: "Registration",
        component: () => import("../pages/b2b/B2BRegistration.vue"),
      },
      {
        path: "data/export",
        name: "DataExport",
        component: () => import("../pages/admin/DataExport.vue"),
      },
      {
        path: "data/rules",
        name: "RulesEngine",
        component: () => import("../pages/admin/rules/RulesEngine.vue"),
      },
      {
        path: "waitlist",
        name: "WaitlistManagement",
        component: () => import("../pages/admin/WaitlistManagement.vue"),
      },

      {
        path: "b2b",
        name: "B2BRegistration",
        component: () => import("../pages/admin/B2BRegistration.vue"),
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

// SensorValuesLineChart settings
export const availableSensorOptions = [
  { value: "HeartRate", label: "Heart Rate" },
  { value: "HRV", label: "HRV" },
  { value: "Temperature", label: "Temperature" },
  { value: "SoundLevel", label: "Sound Level" },
  { value: "EDA", label: "EDA" },
  { value: "scl", label: "SCL" },
  { value: "scr", label: "SCR" },
  { value: "motion", label: "Motion" },
  { value: "Sp02", label: "Sp02" },
  { value: "Humidity", label: "Humidity" },
  { value: "Altitude", label: "Altitude" },
  { value: "Speed_spm", label: "Speed" },
  { value: "Bearing", label: "Bearing" },
  { value: "Accuracy", label: "Accuracy" },
  { value: "Steps", label: "Steps" },
  { value: "Calories", label: "Calories" },
  { value: "Pressure", label: "Pressure" },
  { value: "Light", label: "Light Level" },
  { value: "mood", label: "Mood" },
  { value: "altitude", label: "GPS Altitude" },
];

export const sensorConfig = {
  HeartRate: { field: "heartRate", color: "#ef4444", yAxisIndex: 0 },
  HRV: { field: "hrv", color: "#f59e0b", yAxisIndex: 0 },
  Temperature: {
    field: ["temperatureC", "temperature"],
    color: "#3b82f6",
    yAxisIndex: 1,
  },
  SoundLevel: { field: "soundLevel", color: "#8b5cf6", yAxisIndex: 0 },
  EDA: { field: "eda", color: "#7c3aed", yAxisIndex: 0 },
  Sp02: { field: ["spo2", "Sp02"], color: "#7c3aed", yAxisIndex: 0 },
  Humidity: { field: "humidity", color: "#06b6d4", yAxisIndex: 0 },
  scl: { field: "scl", color: "#059669", yAxisIndex: 0 },
  scr: { field: "scr", color: "#0ea5e9", yAxisIndex: 0 },
  motion: {
    field: ["accelX", "accelY", "accelZ"],
    color: "#14b8a6",
    yAxisIndex: 0,
    transform: "magnitude",
  },
  Altitude: { field: "altitude", color: "#0f766e", yAxisIndex: 1 },
  Speed: { field: ["speed_mps", "speed"], color: "#be123c", yAxisIndex: 0 },
  Speed_spm: { field: ["speed_mps", "speed"], color: "#be123c", yAxisIndex: 0 },
  Bearing: { field: "bearing_deg", color: "#a21caf", yAxisIndex: 1 },
  Accuracy: { field: "accuracy_m", color: "#9333ea", yAxisIndex: 0 },
  Steps: { field: "steps", color: "#365314", yAxisIndex: 0 },
  Calories: { field: "calories", color: "#92400e", yAxisIndex: 0 },
  Pressure: { field: "pressure", color: "#581c87", yAxisIndex: 0 },
  Light: { field: "light", color: "#fbbf24", yAxisIndex: 0 },
  mood: { field: "mood", color: "#ec4899", yAxisIndex: 0 },
};

export const eventTypeToSensorKey = {
  HeartRate: "HeartRate",
  HRV: "HRV",
  Temperature: "Temperature",
  TemperatureC: "Temperature",
  SoundLevel: "SoundLevel",
  EDA: "EDA",
  humidity: "Humidity",
  scl: "scl",
  scr: "scr",
  motion: "motion",
  Sp02: "Sp02",
  altitude: "Altitude",
  bearing_deg: "Bearing",
  accuracy_m: "Accuracy",
  steps: "Steps",
  calories: "Calories",
  pressure: "Pressure",
  light: "Light",
  mood: "mood",
  speed_mps: "Speed_spm",
};

// EventDataTimeline mapping
export const typeToTimeline = {
  HeartRate: { field: "heartRate", label: "Heart Rate", color: "#ef4444" },
  HRV: { field: "hrv", label: "HRV", color: "#f59e0b" },
  Sp02: { field: "spo2", label: "SpO2", color: "#06b6d4" },
  Temperature: { field: "temperature", label: "Temperature", color: "#3b82f6" },
  SoundLevel: { field: "soundLevel", label: "Sound Level", color: "#8b5cf6" },
  scl: { field: "scl", label: "SCL", color: "#059669" },
  scr: { field: "scr", label: "SCR", color: "#0ea5e9" },
  respiratoryRate: {
    field: "respiratoryRate",
    label: "Respiratory Rate",
    color: "#14b8a6",
  },
  humidity: { field: "humidity", label: "Humidity", color: "#3b82f6" },
  mood: { field: "mood", label: "Mood", color: "#ec4899" },
  gps: { field: "gpsCount", label: "GPS Points", color: "#10b981" },
  motion: { field: "motionCount", label: "Motion Events", color: "#14b8a6" },
};

// CSV Templates for DataManagement
export const csvTemplates = {
  users: [
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "role",
      "isActive",
      "createdAt",
      "updatedAt",
    ],
    [
      "John",
      "Doe",
      "john.doe@example.com",
      "+1234567890",
      "parent",
      "true",
      "2024-01-01T00:00:00Z",
      "2024-01-01T00:00:00Z",
    ],
  ],
  events: [
    [
      "aid",
      "Timestamp",
      "HeartRate",
      "HRV",
      "Sp02",
      "respiratoryRate",
      "Temperature",
      "SoundLevel",
      "EDA",
      "scl",
      "scr",
      "humidity",
      "AccelX",
      "AccelY",
      "AccelZ",
      "GyroX",
      "GyroY",
      "GyroZ",
      "magneticX",
      "magneticY",
      "magneticZ",
      "pressure",
      "light",
      "mood",
      "steps",
      "calories",
      "latitude",
      "longitude",
      "altitude",
      "speed_mps",
      "bearing_deg",
      "accuracy_m",
      "satellites",
    ],
    [
      "child_001",
      "2024-05-01T12:00:00Z",
      "75",
      "40",
      "98",
      "14",
      "36.8",
      "42",
      "2.45",
      "2.10",
      "0.25",
      "55",
      "0.01",
      "0.00",
      "0.98",
      "10",
      "-5",
      "3",
      "0.05",
      "0.02",
      "0.03",
      "1013.2",
      "250",
      "active",
      "1200",
      "80",
      "40.7128",
      "-74.0060",
      "15.5",
      "1.2",
      "180",
      "5.0",
      "8",
    ],
  ],
};
