import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { appRoutes as routes } from "./models-route";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const requiredRole = to.meta.requiredRole;

  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }

    //TODO: Implement redirect logic for non admin

    // if (requiredRole && userStore.role !== requiredRole) {
    //   next("/unauthorized");
    // } else {
    //   next();
    // }
  }

  next();
});

export default router;
