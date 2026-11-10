
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login } from "../services/authService";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("LOGIN BUTTON CLICKED");
    console.log("Email entered:", formData.email);

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Calling backend login API...");

      const data = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Backend login response:", data);

      if (data.role === "EMPLOYEE") {
        console.log("Employee login successful. Redirecting...");
        navigate("/dashboard");
      } else {
        setError("This portal is for employees only.");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Backend response:", err.response?.data);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="brand-content">
          <div className="brand-logo">EL</div>

          <p className="brand-tag">EMPLOYEE PORTAL</p>

          <h1>
            Your work life,
            <br />
            made simpler.
          </h1>

          <p className="brand-description">
            Manage your employee profile and stay connected
            with your workplace through one simple platform.
          </p>

          <div className="brand-footer">
            Employee Leave Management System
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="mobile-brand-logo">EL</div>

          <p className="login-eyebrow">WELCOME BACK</p>

          <h2>Sign in to your account</h2>

          <p className="login-subtitle">
            Enter your credentials to access your employee portal.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <Lock size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="login-help">
            Having trouble accessing your account? Contact your administrator.
          </p>

          <div className="login-copyright">
            © 2026 Employee Leave Management System
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
