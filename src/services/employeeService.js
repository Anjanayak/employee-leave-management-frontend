
import api from "./api";

// Get logged-in employee profile
export const getMyProfile = async () => {
  const response = await api.get("/api/employees/me");
  return response.data;
};

// Update logged-in employee profile
export const updateMyProfile = async (profileData) => {
  const response = await api.put("/api/employees/me", profileData);
  return response.data;
};

// Apply for leave
export const applyForLeave = async (leaveData) => {
  const response = await api.post(
    "/api/employees/me/leaves",
    leaveData
  );
  return response.data;
};

// Get logged-in employee's leave history
export const getMyLeaveHistory = async () => {
  const response = await api.get("/api/employees/me/leaves");
  return response.data;
};

// Get leave summary
export const getLeaveSummary = async () => {
  const response = await api.get("/api/employees/me/leaves/summary");
  return response.data;
};

// Get details of a particular leave application
export const getLeaveDetails = async (leaveId) => {
  const response = await api.get(
    `/api/employees/me/leaves/${leaveId}`
  );
  return response.data;
};

// Cancel a pending leave application
export const cancelLeave = async (leaveId) => {
  const response = await api.patch(
    `/api/employees/me/leaves/${leaveId}/cancel`
  );
  return response.data;
};
