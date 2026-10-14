
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/admin-dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    // Check admin authentication
    const adminStr = localStorage.getItem("admin");
    if (!adminStr) {
      navigate("/admin/login");
      return;
    }

    // Fetch live requests submitted by students
    fetch(`${API_BASE_URL}/api/requests`)
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
        const pending = merged.filter(
          (r) => r.status?.toLowerCase() === "pending"
        ).length;
        const inProgress = merged.filter(
          (r) =>
            r.status?.toLowerCase() === "in progress" ||
            r.status?.toLowerCase() === "in_progress"
        ).length;
        const resolved = merged.filter(
          (r) => r.status?.toLowerCase() === "resolved"
        ).length;

        setStats({
          total: merged.length,
          pending,
          inProgress,
          resolved,
        });
      })
      .catch((err) => {
        console.error("Failed to load requests", err);
        const deletedIds = JSON.parse(localStorage.getItem("deleted_request_ids") || "[]");
        const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
        const fallback = Object.values(localUpdates).filter(
          (req) => !deletedIds.includes(String(req.id)) && !deletedIds.includes(Number(req.id))
        );
        setRequests(fallback);
      });
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div>AU</div>
          <section>
            <strong>CampusHelp</strong>
            <small>Admin Portal</small>
          </section>
        </div>

        <nav>
          <Link to="/admin" className="admin-nav active">
            ▦ Dashboard
          </Link>

          <Link to="/admin/requests" className="admin-nav">
            ▤ All Requests
          </Link>
        </nav>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem("admin");
            navigate("/admin/login");
          }}
        >
          ↪ Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>ADMIN DASHBOARD</span>
            <h1>Campus Support Overview</h1>
            <p>Monitor and manage student service requests.</p>
          </div>

          <div className="admin-profile">
            <div>AD</div>
            <section>
              <strong>Administrator</strong>
              <small>Staff Portal</small>
            </section>
          </div>
        </header>

        <section className="admin-stats">
          <div>
            <span>Total Requests</span>
            <strong>{stats.total}</strong>
          </div>

          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>

          <div>
            <span>In Progress</span>
            <strong>{stats.inProgress}</strong>
          </div>

          <div>
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Recent Requests</h2>
              <p>Latest requests submitted by students.</p>
            </div>

            <Link to="/admin/requests">View All</Link>
          </div>

          <div className="admin-table">
            <div className="table-head">
              <span>REQUEST</span>
              <span>CATEGORY</span>
              <span>PRIORITY</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            {requests.slice(0, 8).map((request) => (
              <div className="table-row" key={request.id}>
                <div>
                  <strong>{request.title}</strong>
                  <small>
                    REQ-{request.id} • {request.user?.name || "Student"} • {request.location || "Campus"}
                  </small>
                </div>

                <span>{request.category}</span>

                <b className="priority medium">
                  Medium
                </b>

                <b className={`admin-status ${request.status
                  ?.toLowerCase()
                  .replace(" ", "-")}`}>
                  {request.status}
                </b>
                <Link
                  to={`/admin/request/${request.id}`}
                  className="view-btn"
                >
                  View / Update
                </Link>
              </div>
            ))}

            {requests.length === 0 && (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                No requests currently submitted by students.
              </div>
            )}
          </div>
        </section>

        <section className="admin-ai">
          <div className="ai-admin-icon">✦</div>
          <div>
            <span>AI ASSISTANCE</span>
            <h2>AI-powered request classification</h2>
            <p>
              The system can identify category, priority and concerned
              department from student requests.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
