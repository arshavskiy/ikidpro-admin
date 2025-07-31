import { defineStore } from "pinia";
import * as api from "../services/eventApi";

export const useEventStore = defineStore("events", {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const res = await api.getAll();
        this.items = res.data;
        this.error = null;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async createItem(data) {
      try {
        await api.create(data);
        await this.fetchAll();
      } catch (e) {
        this.error = e.message;
      }
    },
    async updateItem(id, data) {
      try {
        await api.update(id, data);
        await this.fetchAll();
      } catch (e) {
        this.error = e.message;
      }
    },
    async deleteItem(id) {
      try {
        await api.remove(id);
        await this.fetchAll();
      } catch (e) {
        this.error = e.message;
      }
    },
  },
});
