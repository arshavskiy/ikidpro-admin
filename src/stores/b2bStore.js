import { defineStore } from "pinia";
import { b2bApi, b2bUserApi } from "@/services/b2bApi"; // Adjust the import path as necessary

export const useB2BStore = defineStore("b2b", {
  state: () => ({
    businesses: [],
    invitedBusinesses: [],
    loading: false,
    error: null,
  }),

  getters: {
    getBusinessById: (state) => (id) => {
      return state.businesses.find((business) => business._id === id);
    },

    getBusinessesByType: (state) => (type) => {
      return state.businesses.filter((business) => business.type === type);
    },

    getTotalBusinesses: (state) => {
      return state.businesses.length;
    },

    getTotalUsers: (state) => {
      return state.businesses.reduce((total, business) => {
        return total + (business.users?.length || 0);
      }, 0);
    },
  },

  actions: {
    // Fetch all business invites
    async fetchBusinessInvites() {
      this.loading = true;
      this.error = null;
      try {
        const response = await b2bApi.fetchBusinessInvites();
        // Return invites array (response.data.invites or response.data.data.invites)
        this.invitedBusinesses =
          response.data.data.invitations || response.data.businesses;
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching business invites:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // Fetch all businesses
    async fetchBusinesses() {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        const response = await b2bApi.getAll();
        this.businesses =
          response.data.data.businesses || response.data.businesses;
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching businesses:", error);
      } finally {
        this.loading = false;
      }
    },

    // Invite business
    async inviteBusiness({ email, name }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await b2bApi.inviteBusiness(email, name);
        if (!res.ok) {
          throw new Error("Failed to send invite");
        }
        return await res.json();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new business
    async createBusiness(businessData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await b2bApi.createInvitedBusiness(businessData);
        const newBusiness = response.data.data || response.data;
        // this.businesses.unshift(newBusiness);
        return newBusiness;
      } catch (error) {
        this.error = error.message;
        console.error("Error creating business:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update business
    async updateBusiness(id, businessData) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        const response = await b2bApi.update(id, businessData);
        const updatedBusiness = response.data.data || response.data;
        // Mock update
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // const businessIndex = this.businesses.findIndex((b) => b._id === id);
        // if (businessIndex > -1) {
        //   this.businesses[businessIndex] = {
        //     ...this.businesses[businessIndex],
        //     ...businessData,
        //     updatedAt: new Date().toISOString(),
        //   };
        //   return this.businesses[businessIndex];
        // }
        // throw new Error("Business not found");
      } catch (error) {
        this.error = error.message;
        console.error("Error updating business:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete business
    async deleteBusiness(id) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await b2bApi.delete(id);

        // Mock deletion
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // const businessIndex = this.businesses.findIndex((b) => b._id === id);
        // if (businessIndex > -1) {
        //   this.businesses.splice(businessIndex, 1);
        // }
      } catch (error) {
        this.error = error.message;
        console.error("Error deleting business:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Invite users to business
    async inviteUsers(businessId, users) {
      this.loading = true;
      this.error = null;

      try {
        const response = await b2bApi.inviteUsers(businessId, users);
        let invitedUsers = response.data.data || response.data;

        const business = this.businesses.find((b) => b._id === businessId);
        if (!business) {
          throw new Error("Business not found");
        }

        if (!business.users) {
          business.users = [];
        }

        invitedUsers = users.map((user) => ({
          ...user,
          _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          status: "pending",
          invitedAt: new Date().toISOString(),
          joinedAt: null,
        }));

        business.users.push(...invitedUsers);
        return invitedUsers;
      } catch (error) {
        this.error = error.message;
        console.error("Error inviting users:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Resend invitation
    async resendInvite(businessId, userId) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await b2bApi.resendInvite(businessId, userId);

        // Mock resend
        // await new Promise((resolve) => setTimeout(resolve, 500));

        const business = this.businesses.find((b) => b._id === businessId);
        if (business && business.users) {
          const user = business.users.find((u) => u._id === userId);
          if (user) {
            user.invitedAt = new Date().toISOString();
          }
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error resending invite:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Remove user from business
    async removeUser(businessId, userId) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await b2bApi.removeUser(businessId, userId);

        // Mock removal
        // await new Promise((resolve) => setTimeout(resolve, 500));

        const business = this.businesses.find((b) => b._id === businessId);
        if (business && business.users) {
          const userIndex = business.users.findIndex((u) => u._id === userId);
          if (userIndex > -1) {
            business.users.splice(userIndex, 1);
          }
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error removing user:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update user status
    async updateUserStatus(businessId, userId, status) {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await b2bApi.updateUserStatus(businessId, userId, status);

        // Mock status update
        // await new Promise((resolve) => setTimeout(resolve, 500));

        const business = this.businesses.find((b) => b._id === businessId);
        if (business && business.users) {
          const user = business.users.find((u) => u._id === userId);
          if (user) {
            user.status = status;
            if (status === "active" && !user.joinedAt) {
              user.joinedAt = new Date().toISOString();
            }
          }
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error updating user status:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Search businesses
    searchBusinesses(query) {
      if (!query) return this.businesses;

      const searchTerm = query.toLowerCase();
      return this.businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(searchTerm) ||
          business.type.toLowerCase().includes(searchTerm) ||
          business.email.toLowerCase().includes(searchTerm) ||
          business.address.toLowerCase().includes(searchTerm) ||
          business.description?.toLowerCase().includes(searchTerm)
      );
    },

    // Get business statistics
    getBusinessStats() {
      const totalBusinesses = this.businesses.length;
      const totalUsers = this.getTotalUsers;
      const activeUsers = this.businesses.reduce((total, business) => {
        return (
          total +
          (business.users?.filter((u) => u.status === "active").length || 0)
        );
      }, 0);
      const pendingUsers = this.businesses.reduce((total, business) => {
        return (
          total +
          (business.users?.filter((u) => u.status === "pending").length || 0)
        );
      }, 0);

      const businessTypes = this.businesses.reduce((acc, business) => {
        acc[business.type] = (acc[business.type] || 0) + 1;
        return acc;
      }, {});

      return {
        totalBusinesses,
        totalUsers,
        activeUsers,
        pendingUsers,
        businessTypes,
      };
    },

    async acceptInvite({ token, data }) {
      this.loading = true;
      this.error = null;
      try {
        debugger;
        // Call the b2bApi acceptInvite endpoint
        const response = await b2bUserApi.acceptInvite(token, {
          ...data,
        });
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Decline user invitation
    async declineInvite(token) {
      this.loading = true;
      this.error = null;
      try {
        const response = await b2bUserApi.declineInvite(token);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Clear error
    clearError() {
      this.error = null;
    },
  },
});
