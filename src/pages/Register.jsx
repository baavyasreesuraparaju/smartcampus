import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.studentId ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        studentId: form.studentId,
        password: form.password,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Registration failed");
        }
        return response.json();
      })
      .then((data) => {
        alert("Registration successful!");
        navigate("/login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-logo">AU</div>
          <div>
            <strong>CampusHelp</strong>
            <span>Smart Campus Support</span>
          </div>
        </div>

        <div className="auth-intro">
          <span>SMART CAMPUS</span>
          <h1>Create your account.</h1>
          <p>
            Register to access campus support services, submit requests and
            track their progress.
          </p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <span className="form-label">GET STARTED</span>

          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Register as a student to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>University Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your university email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Student ID</label>
              <input
                type="text"
                name="studentId"
                placeholder="Enter your student ID"
                value={form.studentId}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;