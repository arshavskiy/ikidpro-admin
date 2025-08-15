import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // timeout: 5 * 60 * 1000,
});

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

console.log("VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL);

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

    // Show success toast for successful responses
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;

    // Only show toast for certain operations to avoid spam
    if (method === "POST" || method === "PUT" || method === "DELETE") {
      let successMessage = `${method} request successful`;

      // Customize message based on endpoint
      if (url.includes("/auth/login")) {
        successMessage = "✅ Login successful! Welcome back!";
      } else if (url.includes("/auth/register")) {
        successMessage = "✅ Registration successful! Account created!";
      } else if (url.includes("/auth/refresh")) {
        successMessage = "🔄 Token refreshed successfully!";
      } else if (method === "POST") {
        successMessage = "✅ Data created successfully!";
      } else if (method === "PUT") {
        successMessage = "✅ Data updated successfully!";
      } else if (method === "DELETE") {
        successMessage = "✅ Data deleted successfully!";
      }

      if (response.data?.data.updated) {
        successMessage +=
          "\n" +
          `<strong>${response.data?.data.updated} updated events</strong>`;
      }

      toast(successMessage, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
    }

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

    // Show error toast for all errors
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    const status = error.response?.status;
    const resError = error.response?.data?.error;

    let toastMessage = `❌ Error: ${errorMessage}`;

    // Customize error message based on status code
    if (status === 401) {
      toastMessage = "🔒 Authentication required. Please login again.";
    } else if (status === 403) {
      toastMessage = "⛔ Access denied. Insufficient permissions.";
    } else if (status === 404) {
      toastMessage = "🔍 Resource not found.";
    } else if (status === 500) {
      toastMessage = "🚨 Server error. Please try again later.";
    } else if (status >= 400 && status < 500) {
      toastMessage = `⚠️ ${errorMessage}\n ${resError}`;
    } else if (status >= 500) {
      toastMessage = "🚨 Server error. Please contact support.";
    }

    // Don't show toast for token refresh errors to avoid spam
    if (!error.config?.url?.includes("/auth/refresh")) {
      toast(toastMessage, {
        theme: "auto",
        type: "error",
        dangerouslyHTMLString: true,
      });
    }

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

          // Show success toast for token refresh
          toast("🔄 Session renewed successfully!", {
            theme: "auto",
            type: "info",
            dangerouslyHTMLString: true,
          });

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Show error toast for failed token refresh
          toast("🔒 Session expired. Please login again.", {
            theme: "auto",
            type: "warning",
            dangerouslyHTMLString: true,
          });

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
