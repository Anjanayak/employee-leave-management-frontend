
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const links = [
    ['/', 'Dashboard'],
    ['/employees', 'Employees'],
    ['/managers', 'Managers'],
    ['/leaves', 'Leave Requests'],
    ['/calendar', 'Holiday Calendar'],
    ['/leave-policy', 'Leave Policy'],
    ['/leave-allocations', 'Leave Allocation'],
    ['/audit-logs', 'Audit Logs'],
];

export default function Layout() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-mark">L</span>
                    <div>
                        <strong>LeaveFlow</strong>
                        <small>ADMIN CONSOLE</small>
                    </div>
                </div>

                <nav>
                    {links.map(([to, label]) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <span className="online-dot" /> Admin Service
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div>
                        <span className="eyebrow">
                            EMPLOYEE LEAVE MANAGEMENT
                        </span>
                        <strong>Administration</strong>
                    </div>

                    <button
                        className="button button-light"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
