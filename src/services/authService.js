
import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);

  const data = response.data;

  // Store JWT token
  localStorage.setItem("token", data.accessToken);

  // Store logged-in user information
  localStorage.setItem("user", JSON.stringify({
    userId: data.userId,
    email: data.email,
    role: data.role,
  }));

  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
    