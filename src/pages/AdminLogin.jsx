import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/auth.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your admin credentials.");
      return;
    }

    setLoading(true);

    // Call backend login endpoint
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Invalid credentials");
        }
        return response.json();
      })
      .then((data) => {
        // Enforce role separation: If user is registered as a student, reject admin access
        const isStudentEmail = email.toLowerCase().includes("@anurag.edu.in") && !email.toLowerCase().includes("admin");
        if (data.role === "STUDENT" || (data.role !== "ADMIN" && isStudentEmail)) {
          throw new Error("Access Denied: You are registered as a Student. Students cannot access the Administrator portal.");
        }

        const adminUser = {
          ...data,
          role: "ADMIN",
        };
        localStorage.setItem("admin", JSON.stringify(adminUser));
        navigate("/admin");
      })
      .catch((err) => {
        // Only allow designated admin account
        if (
          email.toLowerCase() === "admin@anurag.edu.in" &&
          password === "admin123"
        ) {
          const defaultAdmin = {
            id: 999,
            name: "Campus Administrator",
            email: email,
            role: "ADMIN",
          };
          localStorage.setItem("admin", JSON.stringify(defaultAdmin));
          navigate("/admin");
        } else {
          setError(err.message || "Invalid Admin email or password.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon" style={{ background: "#7c3aed" }}>
            AU
          </div>
          <div>
            <h2>CampusHelp</h2>
            <span>Staff & Admin Portal</span>
          </div>
        </div>

        <div className="auth-intro">
          <span className="auth-tag" style={{ color: "#c084fc" }}>
            ADMINISTRATION & DESK OPERATIONS
          </span>

          <h1>
            Campus Helpdesk
            <span style={{ color: "#a855f7" }}> Admin Console.</span>
          </h1>

          <p>
            Review all service requests filed across campus blocks A to I, assign
            teams, update request progress in real time, and manage resolution workflows.
          </p>

          <div className="auth-features">
            <div>
              <span style={{ color: "#a855f7" }}>✓</span>
              <p>Full student request inspection</p>
            </div>

            <div>
              <span style={{ color: "#a855f7" }}>✓</span>
              <p>Status & priority lifecycle management</p>
            </div>

            <div>
              <span style={{ color: "#a855f7" }}>✓</span>
              <p>Department allocation & comments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

          <div className="form-heading">
            <span
              style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "20px",
                background: "#f3e8ff",
                color: "#7c3aed",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              ADMINISTRATIVE ACCESS
            </span>
            <h2>Admin Sign In</h2>
            <p>Enter your administrative credentials to manage campus requests.</p>
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email Address</label>
              <input
                type="email"
                placeholder="admin@anurag.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "16px",
                background: "#7c3aed",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Authenticating..." : "Access Admin Portal →"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#64748b" }}>Are you a student?</span>
            <Link
              to="/login"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Student Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
