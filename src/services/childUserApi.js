import apiClient from "./apiClient";

const API_BASE = "/child-users";

// Child User Management APIs
export const create = (childData) => apiClient.post(`${API_BASE}`, childData);
export const createChildUser = (childData) =>
  apiClient.post(`${API_BASE}`, childData);
export const getAll = (parentId = null) => {
  const url = parentId ? `${API_BASE}?parentId=${parentId}` : API_BASE;
  return apiClient.get(url);
};
export const getAllChildUsers = (parentId = null) => {
  const url = parentId ? `${API_BASE}?parentId=${parentId}` : API_BASE;
  return apiClient.get(url);
};
export const getCount = () => apiClient.get(`${API_BASE}/count`);
export const getChildUserById = (id) => apiClient.get(`${API_BASE}/id/${id}`);
export const updateChildUser = (id, childData) =>
  apiClient.put(`${API_BASE}/id/${id}`, childData);
export const deleteChildUser = (id) => apiClient.delete(`${API_BASE}/id/${id}`);
export const getChildUsersByParent = (parentId) =>
  apiClient.get(`${API_BASE}/parent/${parentId}/children`);

// Additional utility functions
export const getChildrenStats = () => apiClient.get(`${API_BASE}/stats`);
export const searchChildren = (query) =>
  apiClient.get(`${API_BASE}/search?q=${query}`);
