import apiClient from "./apiClient";

const API_BASE = "/auth";

// User Authentication APIs
export const register = (userData) =>
  apiClient.post(`${API_BASE}/register`, userData);
export const login = (credentials) =>
  apiClient.post(`${API_BASE}/login`, credentials);
export const logout = () => apiClient.post(`${API_BASE}/logout`);
export const me = () => apiClient.get(`${API_BASE}/me`);
export const refresh = () => apiClient.post(`${API_BASE}/refresh`);

// Admin User Management APIs
export const getAllUsers = () => apiClient.get(`${API_BASE}/all`);
export const getUserById = (id) => apiClient.get(`${API_BASE}/${id}`);
export const updateUser = (id, userData) =>
  apiClient.put(`${API_BASE}/${id}`, userData);
export const deleteUser = (id) => apiClient.delete(`${API_BASE}/${id}`);
export const getUserStats = () => apiClient.get(`${API_BASE}/stats`);
