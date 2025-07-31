import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("userToken"),
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post("/api/admin/login", credentials);
        this.token = response.data.data.token;
        localStorage.setItem("userToken", this.token);
        this.user = response.data.data.admin;
        debugger;
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post("/api/auth/register", userData);
        this.token = response.data.token;
        if (this.token) {
          localStorage.setItem("userToken", this.token);
          await this.fetchUserInfo();
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserInfo() {
      if (!this.token) return;

      try {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = response.data.user;
      } catch (error) {
        this.error = error.response?.data?.message;
        this.logout();
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("userToken");
    },
  },
});
