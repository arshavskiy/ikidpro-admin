import { defineStore } from "pinia";
import apiClient from "@/services/apiClient";

export const useRulesStore = defineStore("rules", {
  state: () => ({
    rules: [],
    loading: false,
    saving: false,
    error: null,
  }),
  actions: {
    async fetchRules() {
      this.loading = true;
      try {
        const res = await apiClient.get("/rules");
        this.rules = res.data?.data || res.data || [];
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async createRule(payload) {
      this.saving = true;
      try {
        const res = await apiClient.post("/rules", payload);
        const created = res.data?.data || res.data;
        if (created) this.rules.unshift(created);
      } finally {
        this.saving = false;
      }
    },
    async updateRule(id, payload) {
      this.saving = true;
      try {
        const res = await apiClient.put(`/rules/${id}`, payload);
        const updated = res.data?.data || res.data;
        const idx = this.rules.findIndex((r) => r._id === id);
        if (idx !== -1) this.rules[idx] = updated;
        fetchRules();

        console.log("Updated rule:", updated);
      } finally {
        this.saving = false;
      }
    },
    async deleteRule(id) {
      this.saving = true;
      try {
        await apiClient.delete(`/rules/${id}`);
        this.rules = this.rules.filter((r) => r._id !== id);
      } finally {
        this.saving = false;
      }
    },
  },
});
