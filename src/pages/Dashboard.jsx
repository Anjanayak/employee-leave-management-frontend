
import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  CalendarPlus,
  History,
  LogOut,
  Menu,
  X,
  Building2,
  BriefcaseBusiness,
  Hash,
  Mail,
  LoaderCircle,
  RefreshCw
} from "lucide-react";

import { getMyProfile } from "../services/employeeService";
import { logout } from "../services/authService";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch latest employee profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();
      setEmployee(data);

    } catch (err) {
      console.error("Profile fetch error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        logout();
        navigate("/login");
        return;
      }

      setError("Unable to load your profile. Please try again.");

    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Load profile when dashboard opens
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: UserRound
    },
    {
      name: "Apply Leave",
      path: "/apply-leave",
      icon: CalendarPlus
    },
    {
      name: "Leave History",
      path: "/leave-history",
      icon: History
    }
  ];

  const fullName = employee
    ? `${employee.firstName || ""} ${employee.lastName || ""}`.trim()
    : "";

  return (
    <div className="dashboard-layout">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">

          <div className="brand-logo">EL</div>

          <div>
            <h2>Employee Portal</h2>
            <span>WORKSPACE</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>

        <div className="sidebar-section-label">
          MAIN MENU
        </div>

        <nav className="sidebar-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {employee?.firstName?.charAt(0) || "E"}
            </div>

            <div className="sidebar-user-info">
              <strong>{fullName || "Employee"}</strong>
              <span>{employee?.role || "EMPLOYEE"}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>

        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="header-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="header-right">
            <span className="header-role">
              EMPLOYEE PORTAL
            </span>

            <div className="header-avatar">
              {employee?.firstName?.charAt(0) || "E"}
            </div>
          </div>

        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">

          {loading ? (

            <div className="dashboard-state">
              <LoaderCircle
                className="loading-icon"
                size={30}
              />
              <p>Loading your dashboard...</p>
            </div>

          ) : error ? (

            <div className="dashboard-error">
              <p>{error}</p>

              <button onClick={fetchProfile}>
                Try again
              </button>
            </div>

          ) : employee ? (

            <>

              {/* Welcome Section */}
              <section className="welcome-section">

                <div>
                  <span className="welcome-eyebrow">
                    EMPLOYEE WORKSPACE
                  </span>

                  <h1>
                    Welcome back, {employee.firstName}!
                  </h1>

                  <p>
                    Here's your employee profile overview.
                  </p>
                </div>

                <div className="welcome-actions">

                  <button
                    className="dashboard-refresh-button"
                    onClick={fetchProfile}
                    disabled={loading}
                    title="Refresh employee information"
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </button>

                  <div className="welcome-icon">
                    <LayoutDashboard size={28} />
                  </div>

                </div>

              </section>

              {/* Employee Profile Banner */}
              <section className="profile-banner">

                <div className="profile-banner-avatar">
                  {employee.firstName?.charAt(0)}
                  {employee.lastName?.charAt(0)}
                </div>

                <div className="profile-banner-info">
                  <h2>{fullName}</h2>
                  <p>{employee.designation}</p>
                  <span>{employee.department}</span>
                </div>

                <button
                  className="profile-view-button"
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </button>

              </section>

              {/* Employee Overview */}
              <section className="dashboard-section">

                <div className="section-heading">
                  <div>
                    <h2>Employee Overview</h2>
                    <p>
                      Your registered employee information
                    </p>
                  </div>
                </div>

                <div className="overview-grid">

                  <div className="overview-card">
                    <div className="overview-icon green">
                      <Hash size={21} />
                    </div>

                    <div>
                      <span>Employee ID</span>
                      <h3>
                        {employee.employeeCode || "—"}
                      </h3>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="overview-icon blue">
                      <Building2 size={21} />
                    </div>

                    <div>
                      <span>Department</span>
                      <h3>
                        {employee.department || "—"}
                      </h3>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="overview-icon purple">
                      <BriefcaseBusiness size={21} />
                    </div>

                    <div>
                      <span>Designation</span>
                      <h3>
                        {employee.designation || "—"}
                      </h3>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="overview-icon orange">
                      <Mail size={21} />
                    </div>

                    <div>
                      <span>Email Address</span>
                      <h3>
                        {employee.email || "—"}
                      </h3>
                    </div>
                  </div>

                </div>
              </section>

              {/* Quick Actions */}
              <section className="dashboard-section">

                <div className="section-heading">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>
                      Access your frequently used services
                    </p>
                  </div>
                </div>

                <div className="quick-actions-grid">

                  <button
                    className="quick-action-card"
                    onClick={() => navigate("/apply-leave")}
                  >
                    <div className="quick-action-icon">
                      <CalendarPlus size={22} />
                    </div>

                    <div>
                      <h3>Apply for Leave</h3>
                      <p>
                        Submit a new leave request
                      </p>
                    </div>

                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="quick-action-card"
                    onClick={() => navigate("/leave-history")}
                  >
                    <div className="quick-action-icon history-icon">
                      <History size={22} />
                    </div>

                    <div>
                      <h3>Leave History</h3>
                      <p>
                        Review your previous requests
                      </p>
                    </div>

                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="quick-action-card"
                    onClick={() => navigate("/profile")}
                  >
                    <div className="quick-action-icon profile-icon">
                      <UserRound size={22} />
                    </div>

                    <div>
                      <h3>My Profile</h3>
                      <p>
                        View your personal information
                      </p>
                    </div>

                    <span className="action-arrow">→</span>
                  </button>

                </div>

              </section>

              {/* Footer */}
              <footer className="dashboard-footer">
                © 2026 Employee Leave Management System
              </footer>

            </>

          ) : null}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
