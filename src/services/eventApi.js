import apiClient from "./apiClient";

const API_BASE = "/event"; // Use relative path for proxy
const API_STATS = "/admin/database-stats"; // Use relative path for proxy

// Set your API token here
// const API_TOKEN = `$2b$10$6i8D.ydndOqoiiO1hXUTweIEzJycyNnDF/pMCvlck./eByU5QVNOm`;

// Set default header for all axios requests
// apiClient.defaults.headers.common["x-api-key"] = API_TOKEN;

// Add axios interceptor to include token
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAll = () => apiClient.get(`${API_BASE}/`);
export const getCount = () => apiClient.get(`${API_BASE}/count`);
export const getCollections = () => apiClient.get(`${API_BASE}/dbs`);
export const getDBStats = () => apiClient.get(`${API_STATS}`);
export const getByChildId = (childId, filter = "") =>
  apiClient.get(
    `${API_BASE}/child/${childId}${filter ? `?filter=${filter}` : ""}`
  );
export const getById = (id) => apiClient.get(`${API_BASE}/${id}`);
export const create = (data) => apiClient.post(`${API_BASE}/`, data);
export const update = (id, data) => apiClient.put(`${API_BASE}/${id}`, data);
export const remove = (id) => apiClient.delete(`${API_BASE}/${id}`);
