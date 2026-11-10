
import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  CalendarPlus,
  History,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  CalendarDays,
  Eye,
  XCircle,
} from "lucide-react";

import { logout } from "../services/authService";
import {
  getMyLeaveHistory,
  getLeaveSummary,
  getLeaveDetails,
  cancelLeave,
} from "../services/employeeService";

import "../styles/LeaveHistory.css";

function LeaveHistory() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [summary, setSummary] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Apply Leave", path: "/apply-leave", icon: CalendarPlus },
    { name: "Leave History", path: "/leave-history", icon: History },
  ];

  // Fetch leave history and summary
  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyData, summaryData] = await Promise.all([
        getMyLeaveHistory(),
        getLeaveSummary(),
      ]);

      setLeaveRequests(historyData);
      setSummary(summaryData);
    } catch (err) {
      console.error("Error fetching leave data:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to load leave history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // Search and status filtering
  const filteredLeaves = leaveRequests.filter((leave) => {
    const matchesStatus =
      statusFilter === "ALL" || leave.status === statusFilter;

    const matchesSearch =
      `${leave.leaveType} ${leave.reason} ${leave.status} ${leave.leaveRequestId}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      case "PENDING":
        return "status-pending";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  // Cancel a pending leave application
  const handleCancel = async (leaveId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this leave application?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await cancelLeave(leaveId);

      await fetchLeaveData();

      alert("Leave application cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling leave:", err);

      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to cancel leave application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // View individual leave application details
  const handleViewDetails = async (leaveId) => {
    try {
      setActionLoading(true);

      const response = await getLeaveDetails(leaveId);

      setSelectedLeave(response);
    } catch (err) {
      console.error("Error fetching leave details:", err);

      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to fetch leave details."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-brand">
          <div className="brand-logo">EL</div>

          <div>
            <h2>Employee Portal</h2>
            <span>WORKSPACE</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

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

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase() || "E"}
            </div>

            <div className="sidebar-user-info">
              <strong>{user?.email || "Employee"}</strong>
              <span>{user?.role || "EMPLOYEE"}</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>

        </div>
      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="header-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Leave History</strong>
          </div>

          <div className="header-right">
            <span className="header-role">EMPLOYEE PORTAL</span>

            <div className="header-avatar">
              {user?.email?.charAt(0).toUpperCase() || "E"}
            </div>
          </div>

        </header>

        <div className="leave-history-content">

          <section className="history-heading">

            <div>
              <span className="history-eyebrow">LEAVE MANAGEMENT</span>
              <h1>My Leave History</h1>
              <p>View and track your submitted leave applications.</p>
            </div>

            <button
              className="new-leave-button"
              onClick={() => navigate("/apply-leave")}
            >
              <CalendarDays size={17} />
              Apply for Leave
            </button>

          </section>

          {/* Summary Cards */}
          <section className="history-summary-grid">

            <div className="history-summary-card">
              <span>Total Requests</span>
              <h2>{loading ? "—" : summary.totalRequests}</h2>
            </div>

            <div className="history-summary-card pending-summary">
              <span>Pending</span>
              <h2>{loading ? "—" : summary.pending}</h2>
            </div>

            <div className="history-summary-card approved-summary">
              <span>Approved</span>
              <h2>{loading ? "—" : summary.approved}</h2>
            </div>

            <div className="history-summary-card rejected-summary">
              <span>Rejected</span>
              <h2>{loading ? "—" : summary.rejected}</h2>
            </div>

          </section>

          <section className="history-table-card">

            <div className="history-table-heading">
              <div>
                <h2>Leave Applications</h2>
                <p>Track your leave request status and details.</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="history-filters">

              <div className="history-search">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search leave requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="history-status-filter">
                <Filter size={16} />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

            </div>

            <div className="history-table-wrapper">

              <table className="history-table">

                <thead>
                  <tr>
                    <th>REQUEST ID</th>
                    <th>LEAVE TYPE</th>
                    <th>START DATE</th>
                    <th>END DATE</th>
                    <th>REASON</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan="7" className="history-empty-cell">
                        Loading leave applications...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="history-empty-cell">
                        <p>{error}</p>
                        <button onClick={fetchLeaveData}>
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : filteredLeaves.length > 0 ? (

                    filteredLeaves.map((leave) => (
                      <tr key={leave.leaveRequestId}>

                        <td>#{leave.leaveRequestId}</td>

                        <td>{leave.leaveType}</td>

                        <td>{leave.startDate}</td>

                        <td>{leave.endDate}</td>

                        <td>{leave.reason}</td>

                        <td>
                          <span
                            className={`leave-status ${getStatusClass(leave.status)}`}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>

                            {leave.status === "PENDING" && (
                              <button
                                className="cancel-leave-button"
                                onClick={() => handleCancel(leave.leaveRequestId)}
                                disabled={actionLoading}
                              >
                                <XCircle size={15} />
                                Cancel
                              </button>
                            )}

                            <button
                              className="view-leave-button"
                              title="View details"
                              onClick={() =>
                                handleViewDetails(leave.leaveRequestId)
                              }
                              disabled={actionLoading}
                            >
                              <Eye size={16} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))

                  ) : (

                    <tr>
                      <td colSpan="7" className="history-empty-cell">

                        <div className="history-empty-state">

                          <div className="history-empty-icon">
                            <History size={28} />
                          </div>

                          <h3>No leave applications found</h3>

                          <p>
                            Your submitted leave requests will appear here
                            once they are available.
                          </p>

                          <button onClick={() => navigate("/apply-leave")}>
                            Apply for Leave
                          </button>

                        </div>

                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

          <footer className="dashboard-footer">
            © 2026 Employee Leave Management System
          </footer>

        </div>

      </main>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div
          onClick={() => setSelectedLeave(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "480px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedLeave(null)}
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <h2>Leave Application Details</h2>

            <p><strong>Request ID:</strong> #{selectedLeave.leaveRequestId}</p>
            <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
            <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
            <p><strong>Start Date:</strong> {selectedLeave.startDate}</p>
            <p><strong>End Date:</strong> {selectedLeave.endDate}</p>
            <p><strong>Reason:</strong> {selectedLeave.reason}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`leave-status ${getStatusClass(selectedLeave.status)}`}>
                {selectedLeave.status}
              </span>
            </p>
            <p>
              <strong>Applied At:</strong> {selectedLeave.appliedAt}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default LeaveHistory;
