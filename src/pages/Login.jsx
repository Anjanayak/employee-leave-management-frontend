
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:8081";

function getPayload(response) {
  const body = response?.data ?? {};
  return body.data ?? body;
}

function getToken(payload) {
  return (
    payload.accessToken ||
    payload.access_token ||
    payload.token ||
    payload.jwtToken ||
    payload.jwt ||
    payload.data?.accessToken ||
    payload.data?.token ||
    ""
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/api/auth/login`,
        {
          email: email.trim(),
          password: password
        }
      );

      const payload = getPayload(response);
      const token = getToken(payload);

      if (!token) {
        throw new Error(
          "Login response does not contain a JWT token. Check your Employee Service response."
        );
      }

      const role = String(
        payload.role ||
        payload.user?.role ||
        payload.userRole ||
        ""
      ).toUpperCase();

      if (role && !role.includes("MANAGER")) {
        throw new Error("This account does not have the MANAGER role.");
      }

      const displayName =
        payload.name ||
        payload.fullName ||
        payload.user?.name ||
        email.split("@")[0];

      login(token, displayName);

      navigate("/", { replace: true });

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      setError(message || "Login failed. Check your email and password.");

    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-panel">

        <div className="brand login-brand">
          <div className="brand-mark">E</div>
          <div>
            <strong>ELMS</strong>
            <small>Manager workspace</small>
          </div>
        </div>

        <div className="login-copy">
          <div className="eyebrow">WELCOME BACK</div>

          <h1>
            Manage leave.
            <br />
            <span>Lead with clarity.</span>
          </h1>

          <p>
            Sign in with your ELMS manager account to review
            team requests and record decisions.
          </p>
        </div>

        <form onSubmit={submit}>

          {error && (
            <div className="alert alert-danger py-2 small">
              {error}
            </div>
          )}

          <label className="form-label fw-semibold">
            Email address
          </label>

          <input
            className="form-control mb-3"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manager@example.com"
            required
          />

          <label className="form-label fw-semibold">
            Password
          </label>

          <input
            className="form-control mb-4"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign in to workspace"}

            <i className="bi bi-arrow-right ms-2" />
          </button>

        </form>

        <div className="login-note">
          <i className="bi bi-shield-lock me-2" />
          Credentials are verified by Employee Service.
        </div>

      </div>

      <div className="login-art">

        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />

        <div className="art-content">

          <div className="art-icon">
            <i className="bi bi-calendar2-check" />
          </div>

          <h2>
            Everything your team needs,
            <br />
            in one place.
          </h2>

          <p>
            A simpler way to manage employee leave requests.
          </p>

          <div className="art-stat">
            <span>
              <i className="bi bi-check2-circle" />
              Clear decisions
            </span>

            <span>
              <i className="bi bi-people" />
              Better teamwork
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
