import apiClient from "./apiClient";

const API_BASE = "/child-users";

// Child User Management APIs
export const createChildUser = (childData) =>
  apiClient.post(`${API_BASE}`, childData);
export const getAllChildUsers = (parentId = null) => {
  const url = parentId ? `${API_BASE}?parentId=${parentId}` : API_BASE;
  return apiClient.get(url);
};
export const getChildUserById = (id) => apiClient.get(`${API_BASE}/${id}`);
export const updateChildUser = (id, childData) =>
  apiClient.put(`${API_BASE}/${id}`, childData);
export const deleteChildUser = (id) => apiClient.delete(`${API_BASE}/${id}`);
export const getChildUsersByParent = (parentId) =>
  apiClient.get(`${API_BASE}/parent/${parentId}/children`);

// Additional utility functions
export const getChildrenStats = () => apiClient.get(`${API_BASE}/stats`);
export const searchChildren = (query) =>
  apiClient.get(`${API_BASE}/search?q=${query}`);
