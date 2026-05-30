import axios from "axios";
import { toast } from "sonner";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const workspaceId = localStorage.getItem("activeWorkspaceId");
  if (workspaceId && !config.headers["X-Workspace-Id"]) {
    config.headers["X-Workspace-Id"] = workspaceId;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.config?.skipErrorToast) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        (status === 429
          ? "Too many requests. Please try again later."
          : error.message || "Something went wrong. Please try again.");

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const register = async (name, email, password, referralCode) => {
  const response = await API.post(
    "/auth/register",
    { name, email, password, referralCode },
    { skipErrorToast: true }
  );
  return response.data;
};

export const login = async (email, password) => {
  const response = await API.post(
    "/auth/login",
    { email, password },
    { skipErrorToast: true }
  );
  return response.data;
};

export const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/auth/me", { skipErrorToast: true });
  return response.data;
};

export const generateExtension = async (prompt) => {
  const response = await API.post("/generate", { prompt });
  return response.data;
};

export const getProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

export const getProject = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};

export const getTemplates = async ({ category, search } = {}) => {
  const params = {};
  if (category) params.category = category;
  if (search?.trim()) params.search = search.trim();
  const response = await API.get("/templates", { params });
  return response.data;
};

export const getTemplate = async (id) => {
  const response = await API.get(`/templates/${id}`);
  return response.data;
};

export const createTemplate = async (payload) => {
  const response = await API.post("/templates", payload);
  return response.data;
};

export const updateTemplate = async (id, payload) => {
  const response = await API.put(`/templates/${id}`, payload);
  return response.data;
};

export const deleteTemplate = async (id) => {
  const response = await API.delete(`/templates/${id}`);
  return response.data;
};

export const getDownloadHistory = async (limit) => {
  const response = await API.get("/downloads", {
    params: limit ? { limit } : undefined,
  });
  return response.data;
};

export const getDownloadAnalytics = async () => {
  const response = await API.get("/downloads/analytics");
  return response.data;
};

export const getBilling = async () => {
  const response = await API.get("/billing");
  return response.data;
};

export const createCheckoutSession = async (plan) => {
  const response = await API.post("/billing/checkout", { plan });
  return response.data;
};

export const createBillingPortalSession = async () => {
  const response = await API.post("/billing/portal");
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await API.post("/billing/cancel");
  return response.data;
};

export const resumeSubscription = async () => {
  const response = await API.post("/billing/resume");
  return response.data;
};

export const changeSubscriptionPlan = async (plan) => {
  const response = await API.post("/billing/change-plan", { plan });
  return response.data;
};

// Workspaces
export const getWorkspaces = async () => {
  const response = await API.get("/workspaces");
  return response.data;
};

export const createWorkspace = async (payload) => {
  const response = await API.post("/workspaces", payload);
  return response.data;
};

export const activateWorkspace = async (workspaceId) => {
  const response = await API.post(`/workspaces/${workspaceId}/activate`);
  return response.data;
};

export const getWorkspaceMembers = async (workspaceId) => {
  const response = await API.get(`/workspaces/${workspaceId}/members`);
  return response.data;
};

export const inviteWorkspaceMember = async (workspaceId, email, role) => {
  const response = await API.post(`/workspaces/${workspaceId}/members`, {
    email,
    role,
  });
  return response.data;
};

export const removeWorkspaceMember = async (workspaceId, userId) => {
  const response = await API.delete(
    `/workspaces/${workspaceId}/members/${userId}`
  );
  return response.data;
};

// Marketplace
export const getMarketplaceTemplates = async (params) => {
  const response = await API.get("/marketplace/templates", { params });
  return response.data;
};

export const publishToMarketplace = async (templateId) => {
  const response = await API.post(`/marketplace/templates/${templateId}/publish`);
  return response.data;
};

export const rateMarketplaceTemplate = async (templateId, rating) => {
  const response = await API.post(`/marketplace/templates/${templateId}/rate`, {
    rating,
  });
  return response.data;
};

// Chat
export const getChatConversations = async () => {
  const response = await API.get("/chat/conversations");
  return response.data;
};

export const createChatConversation = async (payload) => {
  const response = await API.post("/chat/conversations", payload);
  return response.data;
};

export const getChatMessages = async (conversationId) => {
  const response = await API.get(`/chat/conversations/${conversationId}/messages`);
  return response.data;
};

export const sendChatMessage = async (conversationId, content) => {
  const response = await API.post(
    `/chat/conversations/${conversationId}/messages`,
    { content }
  );
  return response.data;
};

export const deleteChatConversation = async (conversationId) => {
  const response = await API.delete(`/chat/conversations/${conversationId}`);
  return response.data;
};

// Project sharing & versions
export const shareProject = async (projectId, email, role) => {
  const response = await API.post(`/projects/${projectId}/share`, {
    email,
    role,
  });
  return response.data;
};

export const setProjectVisibility = async (projectId, visibility, workspaceId) => {
  const response = await API.patch(`/projects/${projectId}/visibility`, {
    visibility,
    workspaceId,
  });
  return response.data;
};

export const getProjectVersions = async (projectId) => {
  const response = await API.get(`/projects/${projectId}/versions`);
  return response.data;
};

export const restoreProjectVersion = async (projectId, versionNumber) => {
  const response = await API.post(
    `/projects/${projectId}/versions/${versionNumber}/restore`
  );
  return response.data;
};

// Analytics & referrals
export const getMyAnalytics = async () => {
  const response = await API.get("/analytics/me");
  return response.data;
};

export const getMyReferrals = async () => {
  const response = await API.get("/analytics/referrals");
  return response.data;
};

// Admin
export const getAdminOverview = async () => {
  const response = await API.get("/admin/overview");
  return response.data;
};

export const getAdminUsers = async (page = 1) => {
  const response = await API.get("/admin/users", { params: { page } });
  return response.data;
};

export default API;
