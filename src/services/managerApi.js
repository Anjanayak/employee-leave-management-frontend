
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";

// Manager identity is extracted from the JWT by the backend.
// No manager ID is required in GET request URLs.
export const managerId = Number(
  import.meta.env.VITE_MANAGER_ID || 2
);

const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request.
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("elms_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// Handle authentication errors.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(
        new CustomEvent("elms:unauthorized")
      );
    }

    return Promise.reject(error);
  }
);

// Extract data from ApiResponse<T>.
const unwrap = (response) => {
  const body = response.data;

  return body &&
    Object.prototype.hasOwnProperty.call(body, "data")
    ? body.data
    : body;
};

export const managerApi = {
  managerId,

  // GET pending leave requests for authenticated manager.
  async getPending() {
    const response = await client.get(
      "/api/manager/decisions/pending"
    );

    return unwrap(response);
  },

  // GET decision history for authenticated manager.
  async getHistory() {
    const response = await client.get(
      "/api/manager/decisions/history"
    );

    return unwrap(response);
  },

  // POST approve/reject decision.
  async submitDecision(payload) {
    const response = await client.post(
      "/api/manager/decisions",
      payload
    );

    return unwrap(response);
  },

  // GET actual notification delivery records for authenticated manager.
  async getNotifications() {
    const response = await client.get("/api/notifications/manager");
    return unwrap(response);
  },
};

export default client;
