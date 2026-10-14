import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/student-dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, aiAssisted: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    fetch(`${API_BASE_URL}/api/requests/user/${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        const deletedIds = JSON.parse(localStorage.getItem("deleted_request_ids") || "[]");
        const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
        const merged = data
          .filter((req) => !deletedIds.includes(String(req.id)) && !deletedIds.includes(Number(req.id)))
          .map((req) => {
            if (localUpdates[req.id]) {
              return { ...req, ...localUpdates[req.id] };
            }
            return req;
          });

        setRequests(merged);
        const pending = merged.filter((r) => r.status?.toLowerCase() === "pending").length;
        const resolved = merged.filter((r) => r.status?.toLowerCase() === "resolved").length;
        setStats({ total: merged.length, pending, resolved, aiAssisted: 0 });
      })
      .catch((err) => console.error("Failed to fetch requests", err));
  }, [navigate]);

  // Read admin messages map from localStorage to determine if notification is unread
  const readMessagesMap = JSON.parse(localStorage.getItem("read_admin_messages") || "{}");
  const hasUnreadAdminMessage = requests.some(
    (r) => r.adminResponse && readMessagesMap[r.id] !== r.adminResponse
  );

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">AU</div>
          <div>
            <h2>CampusHelp</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/raise-request" className="nav-item">
            <span>＋</span>
            Raise Request
          </Link>

          <Link to="/my-requests" className="nav-item">
            <span>▤</span>
            My Requests
          </Link>

          <Link to="/block-finder" className="nav-item">
            <span>⌖</span>
            Block Finder
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">STUDENT DASHBOARD</p>
            <h1>Welcome back, {user?.name || "Student"} 👋</h1>
            <p className="dashboard-subtitle">
              Manage your campus support requests from one place.
            </p>
          </div>

          <div className="student-profile">
            <div className="profile-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : "S"}</div>
            <div>
              <strong>{user?.name || "Student"}</strong>
            </div>
          </div>
        </header>

        {/* Quick Action */}
        <section className="quick-action">
          <div>
            <span className="action-badge">AI POWERED</span>
            <h2>Need help on campus?</h2>
            <p>
              Submit your issue and let our AI assistant identify the
              category, priority and concerned department.
            </p>
          </div>

          <Link to="/raise-request" className="primary-action">
            + Raise New Request
          </Link>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">▤</div>
            <div>
              <span>Total Requests</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <div>
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <span>Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">✦</div>
            <div>
              <span>AI Assisted</span>
              <strong>{stats.aiAssisted}</strong>
            </div>
          </div>
        </section>

        {/* Notifications: Admin Messages Alert Banner (Only shown if unread) */}
        {hasUnreadAdminMessage && (
          <section
            style={{
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderLeft: "5px solid #16a34a",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(22, 163, 74, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#dcfce7",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "20px",
                }}
              >
                💬
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#166534", display: "block" }}>
                  New Response from Campus Administration
                </strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#475569" }}>
                  An administrator has reviewed your request and posted an update.
                </p>
              </div>
            </div>

            <Link
              to="/my-requests"
              style={{
                background: "#16a34a",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              View Admin Message →
            </Link>
          </section>
        )}

        {/* Dashboard Grid */}
        <section className="dashboard-grid">
          {/* Recent Requests */}
          <div className="dashboard-card requests-card">
            <div className="card-header">
              <div>
                <h2>Recent Requests</h2>
                <p>Your latest campus support requests</p>
              </div>

              <Link to="/my-requests">View All</Link>
            </div>

            <div className="request-list">
              {requests.length === 0 ? (
                <p style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                  No requests found.
                </p>
              ) : (
                requests.slice(-3).reverse().map((request) => (
                  <div
                    className="request-row"
                    key={request.id}
                    style={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="request-info">
                        <div className="request-icon">
                          {request.category.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3>{request.title}</h3>
                          <span>
                            REQ-{request.id} • {request.category}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {request.adminResponse && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              color: "#16a34a",
                              background: "#dcfce7",
                              padding: "2px 8px",
                              borderRadius: "10px",
                            }}
                          >
                            💬 Message
                          </span>
                        )}
                        <span
                          className={`status ${request.status
                            ?.toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>

                    {/* Compact admin preview directly on Dashboard */}
                    {request.adminResponse && (
                      <div
                        style={{
                          background: "#f0fdf4",
                          borderLeft: "3px solid #16a34a",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#1e293b",
                        }}
                      >
                        <strong style={{ color: "#15803d" }}>Admin: </strong>
                        {request.adminResponse.length > 90
                          ? `${request.adminResponse.substring(0, 90)}...`
                          : request.adminResponse}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Services */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Quick Services</h2>
                <p>Frequently used campus services</p>
              </div>
            </div>

            <div className="services-grid">
              <Link to="/raise-request" className="service-box">
                <span className="service-symbol blue-symbol">＋</span>
                <strong>Raise Request</strong>
                <small>Report an issue</small>
              </Link>

              <Link to="/my-requests" className="service-box">
                <span className="service-symbol green-symbol">✓</span>
                <strong>Track Request</strong>
                <small>Check request status</small>
              </Link>

              <Link to="/block-finder" className="service-box">
                <span className="service-symbol orange-symbol">⌖</span>
                <strong>Block Finder</strong>
                <small>Find campus blocks</small>
              </Link>

              <Link to="/raise-request" className="service-box">
                <span className="service-symbol purple-symbol">✦</span>
                <strong>AI Assistant</strong>
                <small>Get smart assistance</small>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Assistant */}
        <section className="ai-banner">
          <div className="ai-content">
            <div className="ai-icon">✦</div>

            <div>
              <span>SMART CAMPUS AI</span>
              <h2>Let AI help you with your campus request</h2>
              <p>
                Describe your problem in simple words. The system can
                automatically suggest the appropriate category, priority
                and department.
              </p>
            </div>
          </div>

          <Link to="/raise-request" className="ai-button">
            Try AI Assistant →
          </Link>
        </section>
      </main>
    </div>
  );
}


export default StudentDashboard;

