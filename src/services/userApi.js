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
export const getAll = () => apiClient.get(`users`);
export const getAllUsers = () => apiClient.get(`users`);
export const getCount = () => apiClient.get(`users/count`);
export const getUserById = (id) => apiClient.get(`user/id/${id}`);
export const create = (userData) => apiClient.post(`users`, userData);
export const updateUser = (id, userData) =>
  apiClient.put(`user/id/${id}`, userData);
export const deleteUser = (id) => apiClient.delete(`user/id/${id}`);
export const getUserStats = () => apiClient.get(`${API_BASE}/stats`);
