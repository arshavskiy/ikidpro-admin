import apiClient from "./apiClient";

// Add axios interceptor to include token
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register parent user
export const registerParent = async (parentData) => {
  try {
    const response = await apiClient.post("user/register", parentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register child user
export const registerChild = async (childData) => {
  try {
    const response = await apiClient.post("child-users", childData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register parent with children (combined operation)
export const registerParentWithChildren = async ({ parent, children }) => {
  try {
    // First register the parent
    const parentResponse = await registerParent(parent);
    const parentId =
      parentResponse.user?._id || parentResponse.user?.id || parentResponse._id;
    const token = parentResponse.user?.token || null;
    if (token) {
      sessionStorage.setItem("userToken", token);
    }

    if (!parentId) {
      throw new Error("Failed to get parent ID from registration response");
    }

    // Then register each child with the parent ID
    const childPromises = children.map((child) =>
      registerChild({
        ...child,
        parentId: parentId,
      })
    );

    const childrenResponse = await Promise.all(childPromises);

    return {
      parent: parentResponse,
      children: childrenResponse,
    };
  } catch (error) {
    // If parent registration fails, throw the error
    if (!error.response?.status || error.response.status >= 500) {
      throw new Error("Registration failed. Please try again later.");
    }

    // If it's a validation error or client error, throw the original error
    throw error;
  }
};

// Get all children for a parent
export const getChildrenByParent = async (parentId) => {
  try {
    const response = await apiClient.get(
      "child-users/parent/${parentId}/children"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update child information
export const updateChild = async (childId, childData) => {
  try {
    const response = await apiClient.put("child-users/${childId}", childData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete child
export const deleteChild = async (childId) => {
  try {
    const response = await apiClient.delete("child-users/${childId}");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  registerParent,
  registerChild,
  registerParentWithChildren,
  getChildrenByParent,
  updateChild,
  deleteChild,
};
