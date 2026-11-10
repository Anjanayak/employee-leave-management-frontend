
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  CalendarPlus,
  History,
  LogOut,
  Menu,
  X,
  CalendarDays,
  FileText,
  ClipboardList,
  Info,
} from "lucide-react";

import { logout } from "../services/authService";
import { applyForLeave } from "../services/employeeService";
import "../styles/ApplyLeave.css";

function ApplyLeave() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Apply Leave", path: "/apply-leave", icon: CalendarPlus },
    { name: "Leave History", path: "/leave-history", icon: History },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setMessageType("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endDate < formData.startDate) {
      setMessage("End date cannot be earlier than start date.");
      setMessageType("error");
      return;
    }

    if (!formData.leaveType || !formData.startDate ||
        !formData.endDate || !formData.reason.trim()) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await applyForLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
      });

      setMessage(
        `Leave application #${response.leaveRequestId} submitted successfully! Status: ${response.status}`
      );
      setMessageType("success");

      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      console.error("Leave application error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Unable to submit leave application. Please try again.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
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
            <strong>Apply Leave</strong>
          </div>

          <div className="header-right">
            <span className="header-role">EMPLOYEE PORTAL</span>
            <div className="header-avatar">
              {user?.email?.charAt(0).toUpperCase() || "E"}
            </div>
          </div>
        </header>

        <div className="apply-leave-content">
          <section className="apply-heading">
            <div>
              <span className="apply-eyebrow">LEAVE MANAGEMENT</span>
              <h1>Apply for Leave</h1>
              <p>Fill in the details below to submit your leave request.</p>
            </div>

            <div className="apply-heading-icon">
              <CalendarPlus size={27} />
            </div>
          </section>

          <div className="apply-layout">
            <section className="leave-form-card">
              <div className="leave-form-heading">
                <div className="form-heading-icon">
                  <ClipboardList size={21} />
                </div>

                <div>
                  <h2>Leave Application Form</h2>
                  <p>Enter your leave information</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="leave-form-group">
                  <label htmlFor="leaveType">
                    Leave Type <span>*</span>
                  </label>

                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="EARNED">Earned Leave</option>
                    <option value="UNPAID">Unpaid Leave</option>
                  </select>
                </div>

                <div className="leave-date-grid">
                  <div className="leave-form-group">
                    <label htmlFor="startDate">
                      Start Date <span>*</span>
                    </label>

                    <div className="leave-input-wrapper">
                      <CalendarDays size={18} />

                      <input
                        id="startDate"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="leave-form-group">
                    <label htmlFor="endDate">
                      End Date <span>*</span>
                    </label>

                    <div className="leave-input-wrapper">
                      <CalendarDays size={18} />

                      <input
                        id="endDate"
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={
                          formData.startDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="leave-form-group">
                  <label htmlFor="reason">
                    Reason for Leave <span>*</span>
                  </label>

                  <div className="leave-input-wrapper reason-wrapper">
                    <FileText size={18} />

                    <textarea
                      id="reason"
                      name="reason"
                      placeholder="Please explain why you need leave..."
                      value={formData.reason}
                      onChange={handleChange}
                      rows={5}
                      maxLength={500}
                      required
                    />
                  </div>

                  <span className="character-count">
                    {formData.reason.length}/500 characters
                  </span>
                </div>

                {message && (
                  <div
                    className="leave-form-message"
                    role="alert"
                    style={{
                      color: messageType === "success" ? "green" : "#dc2626",
                    }}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="leave-submit-button"
                  disabled={loading}
                >
                  <CalendarPlus size={18} />
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </section>

            <aside className="leave-guidelines">
              <div className="guideline-icon">
                <Info size={21} />
              </div>

              <h3>Before You Apply</h3>
              <p>Please review these points before submitting your request.</p>

              <ul>
                <li>Select the appropriate leave category.</li>
                <li>Choose valid start and end dates.</li>
                <li>Provide a clear reason for your leave.</li>
                <li>Your request will require manager approval.</li>
              </ul>

              <div className="guideline-note">
                <strong>Note</strong>
                <p>
                  Submitting a leave application does not mean it is approved.
                  Check your Leave History for its status.
                </p>
              </div>
            </aside>
          </div>

          <footer className="dashboard-footer">
            © 2026 Employee Leave Management System
          </footer>
        </div>
      </main>
    </div>
  );
}

export default ApplyLeave;
