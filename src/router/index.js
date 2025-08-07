import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import Login from "../pages/admin/createUserWithChild.vue";
import Register from "../pages/Register.vue";

const routes = [
  {
    path: "/",
    name: "EventsList",
    component: () => import("../pages/admin/EventManagement.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false },
  },
  // Admin routes
  {
    path: "/admin",
    component: () => import("../components/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      // {
      //   path: "dashboard",
      //   name: "Dashboard",
      //   component: () => import("../pages/admin/Dashboard.vue"),
      // },
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
        component: () => import("../pages/admin/UserManagement.vue"), // Reuse with different filter
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
      // {
      //   path: "analytics/users",
      //   name: "UserStats",
      //   component: () => import("../pages/admin/UserAnalytics.vue"),
      // },
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
  // Catch-all route: redirect to dashboard if no route matches
  {
    path: "/:pathMatch(.*)*",
    redirect: "/admin/analytics/events",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }
  }

  next();
});

export default router;
