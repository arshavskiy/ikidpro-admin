import { defineStore } from "pinia";
import axios from "axios";
import apiClient from "../services/apiClient";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: sessionStorage.getItem("userToken"),
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
        const response = await apiClient.post("/admin/login", credentials);
        this.token = response.data.data.token;
        sessionStorage.setItem("userToken", this.token);
        this.user = response.data.data.admin;
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
        const response = await apiClient.post("/auth/register", userData);
        this.token = response.data.token;
        if (this.token) {
          sessionStorage.setItem("userToken", this.token);
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
        const response = await apiClient.get("/auth/me", {
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
      sessionStorage.removeItem("userToken");
    },
  },
});
