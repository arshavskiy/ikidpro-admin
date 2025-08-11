import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { appRoutes as routes } from "../models/models";

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
