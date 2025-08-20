// Full router route table (for src/router/index.js)
export const appRoutes = [
  {
    path: "/",
    name: "EventsList",
    component: () => import("../pages/admin/EventManagement.vue"),
    meta: { requiresAuth: true, requiredRole: ["user", "admin"] },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/invite",
    name: "InviteAccept",
    component: () => import("../pages/b2b/B2BInviteAccept.vue"),
    meta: { requiresAuth: false },
    props: (route) => ({ token: route.query.token }), // Pass token param from URL as prop
  },
  {
    path: "/b2b/login",
    name: "b2b_login",
    component: () => import("../pages/Login.vue"),
    props: () => ({ type: "B2B" }),
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
    meta: { requiredRole: "admin" },
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
