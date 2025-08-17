import { defineStore } from "pinia";
import * as api from "../services/eventApi";
import * as userApi from "../services/userApi";
import * as childUserApi from "../services/childUserApi";

export const useEventStore = defineStore("events", {
  state: () => ({
    events: [],
    loading: false,
    error: null,
    // Analytics state
    parentsById: {},
    childrenById: {},
    childParentMap: {},
    availableParents: [],
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const res = await api.getAll();
        this.events = res.data;
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

    // Analytics methods
    async fetchAnalyticsData() {
      this.loading = true;
      try {
        const [response, usersRes, childUsersRes] = await Promise.all([
          api.getAll(),
          userApi.getAll().catch(() => null),
          childUserApi.getAll().catch(() => null),
        ]);

        this.events = response.data || [];

        // Build parents map from users list (if available)
        if (usersRes && Array.isArray(usersRes.data?.data)) {
          const map = {};
          usersRes.data.data.forEach((u) => {
            const id = u?._id || u?.id;
            if (!id) return;
            const nameParts = [u?.firstName, u?.lastName].filter(Boolean);
            const name = nameParts.length
              ? nameParts.join(" ")
              : u?.name || u?.email || u?.mobile || String(id);
            map[id] = { id, label: name, raw: u };
          });
          this.parentsById = map;
        }

        // Build children map from child users list (if available)
        if (childUsersRes) {
          const raw = Array.isArray(childUsersRes.data?.data)
            ? childUsersRes.data.data
            : Array.isArray(childUsersRes.data)
            ? childUsersRes.data
            : [];
          const cmap = {};
          raw.forEach((c) => {
            const cid = c?.aid || c?._id || c?.id;
            if (!cid) return;
            const nameParts = [c?.firstName, c?.lastName].filter(Boolean);
            const label = nameParts.length
              ? nameParts.join(" ")
              : c?.name || c?.nickname || String(cid);
            cmap[cid] = { id: cid, label, raw: c };
          });
          this.childrenById = cmap;
        }

        // Build parent list and child->parent map from the complete dataset
        const parents = [...new Set(this.events.map((e) => e.parentId))].filter(
          Boolean
        );
        this.availableParents = parents.sort();

        const map = {};
        this.events.forEach((e) => {
          if (e.aid && e.parentId) map[e.aid] = e.parentId;
        });

        // Merge mapping from children list if present
        Object.values(this.childrenById).forEach((c) => {
          const pid = c.raw?.parentId;
          if (c.id && pid && !map[c.id]) map[c.id] = pid;
        });
        this.childParentMap = map;

        this.error = null;
        return {
          events: this.events,
          parentsById: this.parentsById,
          childrenById: this.childrenById,
          childParentMap: this.childParentMap,
          availableParents: this.availableParents,
        };
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
