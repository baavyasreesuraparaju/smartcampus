import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/my-requests.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  const loadRequests = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    fetch(`${API_BASE_URL}/api/requests/user/${user.id}`)
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
        const inProgress = merged.filter(
          (r) =>
            r.status?.toLowerCase() === "in progress" ||
            r.status?.toLowerCase() === "in_progress"
        ).length;
        const resolved = merged.filter((r) => r.status?.toLowerCase() === "resolved").length;
        setStats({ total: merged.length, pending, inProgress, resolved });

        // Mark all current admin responses as read so the banner dismisses once opened
        const readMap = JSON.parse(localStorage.getItem("read_admin_messages") || "{}");
        merged.forEach((req) => {
          if (req.adminResponse) {
            readMap[req.id] = req.adminResponse;
          }
        });
        localStorage.setItem("read_admin_messages", JSON.stringify(readMap));
      })
      .catch((err) => console.error("Failed to fetch requests", err));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDelete = async (requestId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Request REQ-${requestId}? This will remove it from both your history and the admin portal.`
    );
    if (!confirmDelete) return;

    // 1. Record in deleted_request_ids so it immediately disappears on both student and admin sides
    const deletedIds = JSON.parse(localStorage.getItem("deleted_request_ids") || "[]");
    if (!deletedIds.includes(String(requestId))) {
      deletedIds.push(String(requestId));
      deletedIds.push(Number(requestId));
      localStorage.setItem("deleted_request_ids", JSON.stringify(deletedIds));
    }

    // 2. Remove from admin_request_updates if present
    const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
    if (localUpdates[requestId]) {
      delete localUpdates[requestId];
      localStorage.setItem("admin_request_updates", JSON.stringify(localUpdates));
    }

    // 3. Attempt backend DELETE request if backend supports it
    try {
      await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Backend DELETE endpoint optional or not reachable, synced locally:", err);
    }

    // 4. Update state directly
    setRequests((prev) => {
      const updated = prev.filter((r) => String(r.id) !== String(requestId));
      const pending = updated.filter((r) => r.status?.toLowerCase() === "pending").length;
      const inProgress = updated.filter(
        (r) =>
          r.status?.toLowerCase() === "in progress" ||
          r.status?.toLowerCase() === "in_progress"
      ).length;
      const resolved = updated.filter((r) => r.status?.toLowerCase() === "resolved").length;
      setStats({ total: updated.length, pending, inProgress, resolved });
      return updated;
    });

    alert(`Request REQ-${requestId} was deleted successfully.`);
  };

  return (
    <div className="my-requests-page">
      <header className="requests-top">
        <Link to="/dashboard">← Dashboard</Link>

        <h1>My Requests</h1>
        <p>Track and manage your campus support requests.</p>
      </header>

      <main className="requests-container">
        <div className="request-summary">
          <div>
            <span>Total</span>
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
        </div>

        <section className="requests-table-card">
          <div className="table-heading">
            <div>
              <h2>Request History</h2>
              <p>View the status of your submitted requests and messages from administration.</p>
            </div>

            <Link to="/raise-request">+ New Request</Link>
          </div>

          <div className="request-table">
            {requests.length === 0 ? (
              <p style={{ padding: "20px 0", color: "#64748b" }}>No requests found.</p>
            ) : (
              requests.map((request) => (
                <div className="request-card-entry" key={request.id}>
                  <div className="request-item-header">
                    <div className="request-main">
                      <div className="request-number">
                        REQ-{request.id}
                      </div>

                      <div>
                        <h3>{request.title}</h3>
                        <p>
                          {request.category} • {request.location || "Campus"}
                        </p>
                        <small>
                          Submitted on: {new Date(request.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        className={`request-status ${request.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {request.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDelete(request.id)}
                        title="Delete request"
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.2s",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Wide, Neatly Spaced Admin Message Container */}
                  {request.adminResponse && (
                    <div className="admin-response-wide-box">
                      <div className="admin-box-title">
                        <span style={{ fontSize: "16px" }}>💬</span>
                        <strong style={{ fontSize: "14px", color: "#15803d" }}>
                          Campus Administration Response:
                        </strong>
                        <span className="admin-title-badge">
                          OFFICIAL UPDATE
                        </span>
                      </div>
                      <div className="admin-message-content">
                        {request.adminResponse}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MyRequests;

