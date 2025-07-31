import { defineStore } from "pinia";
import { 
  getChildrenByParent, 
  registerChild, 
  updateChild, 
  deleteChild 
} from "../services/registrationApi";

export const useChildStore = defineStore("child", {
  state: () => ({
    children: [],
    loading: false,
    error: null,
  }),

  getters: {
    childrenCount: (state) => state.children.length,
    getChildById: (state) => (id) => state.children.find(child => child._id === id),
  },

  actions: {
    async fetchChildren(parentId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getChildrenByParent(parentId);
        this.children = response.children || response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to fetch children";
        console.error("Error fetching children:", error);
      } finally {
        this.loading = false;
      }
    },

    async addChild(childData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await registerChild(childData);
        const newChild = response.child || response;
        this.children.push(newChild);
        return newChild;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to add child";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateChild(childId, childData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await updateChild(childId, childData);
        const updatedChild = response.child || response;
        
        const index = this.children.findIndex(child => child._id === childId);
        if (index !== -1) {
          this.children[index] = updatedChild;
        }
        
        return updatedChild;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to update child";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeChild(childId) {
      this.loading = true;
      this.error = null;
      try {
        await deleteChild(childId);
        this.children = this.children.filter(child => child._id !== childId);
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to remove child";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearChildren() {
      this.children = [];
      this.error = null;
    },

    clearError() {
      this.error = null;
    }
  },
});

export default useChildStore;
