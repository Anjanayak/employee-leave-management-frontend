import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("elms_token") || "");
  const [managerName, setManagerName] = useState(() => localStorage.getItem("elms_manager_name") || "Manager");
  const login = (value, name) => {
    localStorage.setItem("elms_token", value.trim());
    localStorage.setItem("elms_manager_name", name?.trim() || "Manager");
    setToken(value.trim()); setManagerName(name?.trim() || "Manager");
  };
  const logout = () => {
    localStorage.removeItem("elms_token"); localStorage.removeItem("elms_manager_name");
    setToken(""); setManagerName("Manager");
  };
  const value = useMemo(() => ({ token, managerName, login, logout }), [token, managerName]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);