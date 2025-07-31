import axios from "axios";

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request for debugging
    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      {
        headers: config.headers,
        hasToken: !!token,
      }
    );

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
      {
        status: response.status,
        data: response.data,
      }
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`,
      {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      }
    );

    // If token is invalid, redirect to login
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("userToken");
      // You might want to redirect to login page here
      console.warn("🔒 Token invalid, removed from storage");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
