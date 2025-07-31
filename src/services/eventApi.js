import axios from "axios";

const API_BASE = "/api/event"; // Use relative path for proxy

// Set your API token here
// const API_TOKEN = `$2b$10$6i8D.ydndOqoiiO1hXUTweIEzJycyNnDF/pMCvlck./eByU5QVNOm`;

// Set default header for all axios requests
// axios.defaults.headers.common["x-api-key"] = API_TOKEN;

// Add axios interceptor to include token
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAll = () => axios.get(`${API_BASE}/`);
export const getCount = () => axios.get(`${API_BASE}/count`);
export const getCollections = () => axios.get(`${API_BASE}/dbs`);
export const getByChildId = (childId, filter = "") =>
  axios.get(`${API_BASE}/child/${childId}${filter ? `?filter=${filter}` : ""}`);
export const getById = (id) => axios.get(`${API_BASE}/${id}`);
export const create = (data) => axios.post(`${API_BASE}/`, data);
export const update = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const remove = (id) => axios.delete(`${API_BASE}/${id}`);
