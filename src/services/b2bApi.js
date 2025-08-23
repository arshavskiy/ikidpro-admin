import apiClient from "./apiClient";

// B2B Business API endpoints
export const b2bApi = {
  // Get all businesses
  getAll: () => apiClient.get("/b2b/businesses"),

  // Get business by ID
  getById: (id) => apiClient.get(`/b2b/businesses/${id}`),

  // Create new business
  create: (businessData) => apiClient.post("/b2b/businesses", businessData),

  createInvitedBusiness: (businessData) =>
    apiClient.post("/b2b/invites/register", businessData),

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
  removeUser: (businessId, userId) =>
    apiClient.delete(`/b2b/businesses/${businessId}/users/${userId}`),

  // Update user status
  updateUserStatus: (businessId, userId, status) =>
    apiClient.patch(`/b2b/businesses/${businessId}/users/${userId}/status`, {
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
  acceptInvite: (inviteToken, data) =>
    apiClient.post("/b2b/users/accept-invite", { inviteToken, ...data }),

  // Decline invitation
  declineInvite: (inviteToken) =>
    apiClient.post("/b2b/users/decline-invite", { inviteToken }),
};
