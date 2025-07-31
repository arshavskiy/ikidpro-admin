import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import KidProCrud from "../pages/KidPage.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

// Admin components
import AdminLayout from "../components/AdminLayout.vue";
import Dashboard from "../pages/admin/Dashboard.vue";
import UserManagement from "../pages/admin/UserManagement.vue";
import ChildManagement from "../pages/admin/ChildManagement.vue";
import EventManagement from "../pages/admin/EventManagement.vue";

const routes = [
  {
    path: "/",
    redirect: "/admin/dashboard",
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
  {
    path: "/kids",
    name: "Kids",
    component: KidProCrud,
    meta: { requiresAuth: true },
  },
  // Admin routes
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "users",
        name: "UsersList",
        component: UserManagement,
      },
      {
        path: "users/create",
        name: "UserCreate",
        component: () => import("../pages/admin/UserCreate.vue"),
      },
      {
        path: "users/profiles",
        name: "UserProfiles",
        component: UserManagement, // Reuse with different filter
      },
      {
        path: "children",
        name: "ChildrenList",
        component: ChildManagement,
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
        component: EventManagement,
      },
      {
        path: "events/create",
        name: "EventCreate",
        component: () => import("../pages/admin/EventCreate.vue"),
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
    redirect: "/admin/dashboard",
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
