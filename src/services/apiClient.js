import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// console.log(import.meta.env.VITE_API_BASE_URL);

// Flag to track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue = [];

// Function to process the failed queue after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Attempting to refresh token...");

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {
        refreshToken: refreshToken,
      }
    );

    const { token, refreshToken: newRefreshToken } = response.data;

    // Update tokens in storage
    sessionStorage.setItem("userToken", token);
    if (newRefreshToken) {
      sessionStorage.setItem("refreshToken", newRefreshToken);
    }

    console.log("✅ Token refreshed successfully");
    return token;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    // Clear all tokens if refresh fails
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("refreshToken");

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw error;
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("userToken");
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

// Response interceptor to handle errors and token refresh
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
  async (error) => {
    const originalRequest = error.config;

    console.error(
      `❌ API Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`,
      {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      }
    );

    // Handle token refresh for 401/403 errors
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // Check if the error message indicates an invalid token
      const errorMessage = error.response?.data?.message || "";
      const isInvalidToken =
        errorMessage.toLowerCase().includes("invalid token") ||
        errorMessage.toLowerCase().includes("token expired") ||
        error.response?.status === 403;

      if (isInvalidToken) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshToken();
          processQueue(null, newToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // If refresh fails, clear tokens and redirect
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("refreshToken");
          console.warn("🔒 Token refresh failed, redirecting to login");

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // For other errors or if not a token issue, just reject
    return Promise.reject(error);
  }
);

export default apiClient;
