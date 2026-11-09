
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Managers from './pages/Managers';
import Leaves from './pages/Leaves';
import AuditLogs from './pages/AuditLogs';
import Calendar from './pages/Calendar';
import LeavePolicy from './pages/LeavePolicy';
import LeaveAllocations from './pages/LeaveAllocations';

import Layout from './components/Layout';
import { isAuthenticated } from './services/authService';

function ProtectedLayout() {
    return isAuthenticated()
        ? <Layout />
        : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/managers" element={<Managers />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/leave-policy" element={<LeavePolicy />} />

                {/* Leave Allocation */}
                <Route
                    path="/leave-allocations"
                    element={<LeaveAllocations />}
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
