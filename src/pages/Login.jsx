import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Login failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data.role === "ADMIN" || email.toLowerCase() === "admin@anurag.edu.in") {
          localStorage.setItem("admin", JSON.stringify(data));
          navigate("/admin");
          return;
        }
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">AU</div>
          <div>
            <h2>Smart Campus</h2>
            <span>Helpdesk & Services</span>
          </div>
        </div>

        <div className="auth-intro">
          <span className="auth-tag">CAMPUS SUPPORT PLATFORM</span>

          <h1>
            Welcome back to your
            <span> smarter campus.</span>
          </h1>

          <p>
            Access campus services, raise requests, track issues and get
            intelligent assistance from one centralized platform.
          </p>

          <div className="auth-features">
            <div>
              <span>✓</span>
              <p>Easy service requests</p>
            </div>

            <div>
              <span>✓</span>
              <p>Real-time request tracking</p>
            </div>

            <div>
              <span>✓</span>
              <p>AI-powered assistance</p>
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
            <h2>Sign in</h2>
            <p>Enter your details to access your campus account.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your university email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="forgot-btn">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-submit">
              Sign In →
            </button>

          </form>

          <div className="form-divider">
            <span>OR</span>
          </div>

          <p className="register-text">
            Don't have an account?
            <Link to="/register"> Create an account</Link>
          </p>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "14px",
              borderTop: "1px dashed #e2e8f0",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#64748b" }}>Campus Staff or Admin? </span>
            <Link
              to="/admin/login"
              style={{
                color: "#7c3aed",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Admin Sign In →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;