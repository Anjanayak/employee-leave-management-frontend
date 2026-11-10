import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ManagerProvider } from "./context/ManagerContext";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PendingLeaves from "./pages/PendingLeaves";
import LeaveDetails from "./pages/LeaveDetails";
import DecisionHistory from "./pages/DecisionHistory";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Protected><AppLayout /></Protected>}>
      <Route index element={<Dashboard />} />
      <Route path="pending-leaves" element={<PendingLeaves />} />
      <Route path="leaves/:id" element={<LeaveDetails />} />
      <Route path="decision-history" element={<DecisionHistory />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
export default function App() {
  return <BrowserRouter><AuthProvider><ManagerProvider><AppRoutes /></ManagerProvider></AuthProvider></BrowserRouter>;
}