import apiClient from "./apiClient";

// B2B Business API endpoints
export const b2bApi = {
  // Get all businesses
  getAll: () => apiClient.get("/b2b/businesses"),

  // Get business by ID
  getById: (id) => apiClient.get(`/b2b/businesses/${id}`),

  // Create new business
  create: (businessData) => apiClient.post("/b2b/businesses", businessData),

  createInvitedBusiness: (businessData) => {
    // apiClient.post("/b2b/invites/register", businessData),
    return apiClient.post("/b2b/businesses/invite", businessData);
  },

  // Update business
  update: (id, businessData) =>
    apiClient.put(`/b2b/businesses/${id}`, businessData),

  // Delete business
  delete: (id) => apiClient.delete(`/b2b/businesses/${id}`),

  // Invite users to business
  inviteUsers: (businessId, users) =>
    apiClient.post(`/b2b/businesses/${businessId}/invite`, { users }),

  inviteBusiness: (email, name) =>
    apiClient.post(`/b2b/businesses/invite`, {
      email,
      name,
      invitedBy: JSON.parse(sessionStorage.getItem("user"))?._id || null,
    }),

  // Resend invitation
  resendInvite: (businessId, userId) =>
    apiClient.post(
      `/b2b/businesses/${businessId}/users/${userId}/resend-invite`
    ),

  // Remove user from business
  removeUser: (id, userId) =>
    apiClient.delete(`/b2b/businesses/${id}/users/${userId}`),

  // Update user status
  updateUserStatus: (id, userId, status) =>
    apiClient.patch(`/b2b/businesses/${id}/users/${userId}/status`, {
      status,
    }),

  // Search businesses
  search: (query) =>
    apiClient.get("/b2b/businesses/search", { params: { q: query } }),

  // Get business statistics
  getStats: () => apiClient.get("/b2b/statistics"),

  // Get all business invites
  fetchBusinessInvites: () => apiClient.get("/b2b/invites"),
};

// B2B User API endpoints
export const b2bUserApi = {
  // Get all users across all businesses
  getAll: () => apiClient.get("/b2b/users"),

  // Get user by ID
  getById: (id) => apiClient.get(`/b2b/users/${id}`),

  // Update user profile
  update: (id, userData) => apiClient.put(`/b2b/users/${id}`, userData),

  // Delete user
  delete: (id) => apiClient.delete(`/b2b/users/${id}`),

  // Accept invitation
  acceptInvite: (token, data) =>
    apiClient.post("/b2b/users/accept-invite", { token, ...data }),

  // Decline invitation
  declineInvite: (token) =>
    apiClient.post("/b2b/users/decline-invite", { token }),
};
