
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserRound, CalendarPlus, History,
  LogOut, Menu, X, Mail, Hash, Building2,
  BriefcaseBusiness, ShieldCheck, LoaderCircle,
  ArrowLeft, Pencil, Save, XCircle
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile
} from "../services/employeeService";

import { logout } from "../services/authService";
import "../styles/MyProfile.css";

function MyProfile() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    department: "",
    designation: ""
  });

  const loadProfile = async () => {
    try {
      setError("");
      const data = await getMyProfile();

      setEmployee(data);
      setFormData({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        department: data.department || "",
        designation: data.designation || ""
      });
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
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setSuccess("");
    setError("");

    setFormData({
      email: employee.email || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      department: employee.department || "",
      designation: employee.designation || ""
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    setFormData({
      email: employee.email || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      department: employee.department || "",
      designation: employee.designation || ""
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const updatedData = await updateMyProfile({
        email: formData.email,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        department: formData.department.trim(),
        designation: formData.designation.trim()
      });

      setEmployee(updatedData);
      setFormData({
        email: updatedData.email || "",
        firstName: updatedData.firstName || "",
        lastName: updatedData.lastName || "",
        department: updatedData.department || "",
        designation: updatedData.designation || ""
      });

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        logout();
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
        "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Apply Leave", path: "/apply-leave", icon: CalendarPlus },
    { name: "Leave History", path: "/leave-history", icon: History }
  ];

  const fullName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : "";

  const details = employee
    ? [
        { label: "First Name", value: employee.firstName, icon: UserRound },
        { label: "Last Name", value: employee.lastName, icon: UserRound },
        { label: "Email Address", value: employee.email, icon: Mail },
        { label: "Employee Code", value: employee.employeeCode, icon: Hash },
        { label: "Department", value: employee.department, icon: Building2 },
        { label: "Designation", value: employee.designation, icon: BriefcaseBusiness },
        { label: "Account Role", value: employee.role, icon: ShieldCheck }
      ]
    : [];

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
            aria-label="Close menu"
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
              {employee?.firstName?.charAt(0) || "E"}
            </div>
            <div className="sidebar-user-info">
              <strong>{fullName || "Employee"}</strong>
              <span>{employee?.role || "EMPLOYEE"}</span>
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
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="header-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>My Profile</strong>
          </div>

          <div className="header-right">
            <span className="header-role">EMPLOYEE PORTAL</span>
            <div className="header-avatar">
              {employee?.firstName?.charAt(0) || "E"}
            </div>
          </div>
        </header>

        <div className="profile-content">

          <button
            className="profile-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="profile-page-heading">
            <div>
              <span>EMPLOYEE INFORMATION</span>
              <h1>My Profile</h1>
              <p>View and manage your registered employee details.</p>
            </div>
          </div>

          {loading ? (
            <div className="profile-state">
              <LoaderCircle className="loading-icon" size={30} />
              <p>Loading your profile...</p>
            </div>
          ) : error && !employee ? (
            <div className="profile-error">
              {error}
              <button onClick={loadProfile}>Try again</button>
            </div>
          ) : employee ? (
            <>
              {success && (
                <div className="profile-success">
                  {success}
                </div>
              )}

              {error && (
                <div className="profile-error">
                  {error}
                </div>
              )}

              <section className="profile-main-card">
                <div className="profile-large-avatar">
                  {employee.firstName?.charAt(0)}
                  {employee.lastName?.charAt(0)}
                </div>

                <div className="profile-main-info">
                  <h2>{fullName}</h2>
                  <p>{employee.designation}</p>
                  <span>
                    <Building2 size={13} />
                    {employee.department}
                  </span>
                </div>

                <div className="profile-status">
                  <span className="status-dot"></span>
                  Active Employee
                </div>
              </section>

              <section className="profile-details-section">

                <div className="profile-section-heading">
                  <div>
                    <h2>Personal & Employment Details</h2>
                    <p>
                      Your information registered with the organisation
                    </p>
                  </div>

                  {!editing && (
                    <button
                      className="profile-edit-button"
                      onClick={handleEdit}
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSave} className="profile-edit-form">

                    <div className="profile-form-grid">

                      <div className="profile-form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          disabled
                        />
                        <small>Email cannot be changed here.</small>
                      </div>

                      <div className="profile-form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="profile-form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="profile-form-group">
                        <label>Department</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="profile-form-group">
                        <label>Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          required
                        />
                      </div>

                    </div>

                    <div className="profile-form-actions">
                      <button
                        type="button"
                        className="profile-cancel-button"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="profile-save-button"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <LoaderCircle size={16} className="loading-icon" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                ) : (
                  <div className="profile-details-grid">
                    {details.map((detail) => {
                      const Icon = detail.icon;

                      return (
                        <div className="profile-detail-item" key={detail.label}>
                          <div className="profile-detail-icon">
                            <Icon size={19} />
                          </div>

                          <div className="profile-detail-text">
                            <span>{detail.label}</span>
                            <strong>{detail.value || "Not available"}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <div className="profile-information-note">
                <ShieldCheck size={19} />
                <p>
                  Your employee information is retrieved securely from
                  your Employee Service account.
                </p>
              </div>
            </>
          ) : null}

          <footer className="dashboard-footer">
            © 2026 Employee Leave Management System
          </footer>

        </div>
      </main>
    </div>
  );
}

export default MyProfile;
