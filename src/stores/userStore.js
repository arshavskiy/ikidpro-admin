import { defineStore } from "pinia";
import axios from "axios";
import apiClient from "../services/apiClient";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: sessionStorage.getItem("userToken"),
    user: null,
    loading: false,
    error: null,
    role: "user",
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(type, { ...credentials }) {
      this.loading = true;
      this.error = null;
      let response = {};

      try {
        if (type === "B2B") {
          response = await apiClient.post("/b2b/users/login", credentials);
        } else response = await apiClient.post("/admin/login", credentials);

        this.token = response.data?.data?.token;
        this.user = response.data?.data?.admin;
        this.role = this.user.role || "user";

        //TODO: Implement redirect logic for non admin

        if (type === "B2B") {
          this.user = response.data?.data?.user;
          this.role = response.data?.data?.role;
        }

        debugger;

        sessionStorage.setItem("userToken", this.token);
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
