import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { analyzeRequestWithAI, generateSmartAdminReply } from "../utils/aiAssistant";
import { API_BASE_URL } from "../config";
import "../styles/admin-request-details.css";

function AdminRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [department, setDepartment] = useState("IT & Network");
  const [response, setResponse] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    const adminStr = localStorage.getItem("admin");
    if (!adminStr) {
      navigate("/admin/login");
      return;
    }

    const deletedIds = JSON.parse(localStorage.getItem("deleted_request_ids") || "[]");
    if (deletedIds.includes(String(id)) || deletedIds.includes(Number(id))) {
      alert("This request was deleted by the student and is no longer available.");
      navigate("/admin/requests");
      return;
    }

    fetch(`${API_BASE_URL}/api/requests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
        const merged = { ...data, ...(localUpdates[id] || {}) };
        const analysis = analyzeRequestWithAI(merged.title, merged.description);
        setAiAnalysis(analysis);

        setRequest(merged);
        setStatus(merged.status || data.status);
        if (merged.priority) setPriority(merged.priority);
        else setPriority(analysis.priority);

        if (merged.department) setDepartment(merged.department);
        if (merged.adminResponse) setResponse(merged.adminResponse);
      })
      .catch((err) => {
        console.error("Failed to fetch request", err);
        const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
        if (localUpdates[id]) {
          const reqItem = localUpdates[id];
          const analysis = analyzeRequestWithAI(reqItem.title, reqItem.description);
          setAiAnalysis(analysis);
          setRequest(reqItem);
          setStatus(reqItem.status || "Pending");
          if (reqItem.priority) setPriority(reqItem.priority);
          else setPriority(analysis.priority);
          if (reqItem.department) setDepartment(reqItem.department);
          if (reqItem.adminResponse) setResponse(reqItem.adminResponse);
        }
      });
  }, [id, navigate]);

  const isClosed = request?.status?.toLowerCase() === "closed";

  const handleUpdate = () => {
    if (isClosed) {
      alert("This request is already closed and locked. No further updates can be made.");
      return;
    }

    // 1. Try sending full payload to backend
    fetch(`${API_BASE_URL}/api/requests/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, priority, department, adminResponse: response }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Status update failed");
        return res.json();
      })
      .then((data) => {
        // Save admin update locally so student page immediately reflects status and admin response message
        const updated = {
          ...request,
          ...data,
          status,
          priority,
          department,
          adminResponse: response,
          updatedAt: new Date().toISOString(),
        };
        const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
        localUpdates[id] = updated;
        localStorage.setItem("admin_request_updates", JSON.stringify(localUpdates));

        alert(
          status.toLowerCase() === "closed"
            ? "Request marked as Closed. This ticket is now permanently locked."
            : "Request updated successfully! Changes will now reflect on student's portal."
        );
        setRequest(updated);
      })
      .catch((err) => {
        // Fallback local persistence if backend status endpoint only expects status
        fetch(`${API_BASE_URL}/api/requests/${id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }).catch(() => {});

        const updated = {
          ...request,
          status,
          priority,
          department,
          adminResponse: response,
          updatedAt: new Date().toISOString(),
        };
        const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
        localUpdates[id] = updated;
        localStorage.setItem("admin_request_updates", JSON.stringify(localUpdates));

        alert(
          status.toLowerCase() === "closed"
            ? "Request marked as Closed. This ticket is now permanently locked."
            : "Request updated successfully! Changes and admin message will now reflect in student page."
        );
        setRequest(updated);
      });
  };

  if (!request) return <div>Loading...</div>;

  return (
    <div className="admin-details-page">
      <aside className="admin-sidebar">
        <h2>AU Helpdesk</h2>

        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/requests">All Requests</Link>

        <button
          onClick={() => {
            localStorage.removeItem("admin");
            navigate("/admin/login");
          }}
          style={{
            marginTop: "auto",
            background: "none",
            border: "1px solid #334155",
            color: "#f87171",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ↪ Logout
        </button>
      </aside>

      <main className="admin-details-main">
        <header className="details-header">
          <div>
            <span className="breadcrumb">Admin / Requests / REQ-{id}</span>
            <h1>Request Details</h1>
            <p>Review and manage the selected helpdesk request.</p>
          </div>

          <Link to="/admin/requests" className="back-btn">
            ← Back to Requests
          </Link>
        </header>

        <section className="request-card">
          <div className="request-top">
            <div>
              <span className="request-id">REQ-{id}</span>
              <h2>{request.title}</h2>
              <p>
                {request.description}
              </p>
            </div>

            <span className="priority medium">Medium Priority</span>
          </div>

          <div className="request-info">
            <div>
              <span>Student</span>
              <strong>{request.user?.name || "Unknown"}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{request.location || "N/A"}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{request.category}</strong>
            </div>

            <div>
              <span>Submitted</span>
              <strong>{new Date(request.createdAt).toLocaleDateString()}</strong>
            </div>
          </div>
        </section>

        {/* AI Analysis and Recommendations */}
        {aiAnalysis && (
          <section
            style={{
              background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
              border: "1px solid #c4b5fd",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px", color: "#7c3aed" }}>✦</span>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#4c1d95", fontWeight: "700" }}>
                  AI Ticket Insights & Classification
                </h3>
              </div>
              <span
                style={{
                  background: "#7c3aed",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                {aiAnalysis.confidence}% AI Confidence
              </span>
            </div>

            <p style={{ margin: "0 0 14px 0", color: "#475569", fontSize: "13px", lineHeight: "1.5" }}>
              <strong>AI Reasoning:</strong> {aiAnalysis.reason}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ddd6fe",
                }}
              >
                <small style={{ color: "#6b7280", fontSize: "11px", display: "block" }}>
                  DETECTED CATEGORY
                </small>
                <strong style={{ color: "#1f2937", fontSize: "13px" }}>
                  {aiAnalysis.category}
                </strong>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ddd6fe",
                }}
              >
                <small style={{ color: "#6b7280", fontSize: "11px", display: "block" }}>
                  SUGGESTED PRIORITY
                </small>
                <strong
                  style={{
                    color:
                      aiAnalysis.priority === "High"
                        ? "#dc2626"
                        : aiAnalysis.priority === "Medium"
                        ? "#d97706"
                        : "#16a34a",
                    fontSize: "13px",
                  }}
                >
                  ● {aiAnalysis.priority} Priority
                </strong>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ddd6fe",
                }}
              >
                <small style={{ color: "#6b7280", fontSize: "11px", display: "block" }}>
                  RECOMMENDED ROUTING
                </small>
                <strong style={{ color: "#1f2937", fontSize: "13px" }}>
                  {aiAnalysis.department}
                </strong>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                paddingTop: "8px",
                borderTop: "1px dashed #cbd5e1",
              }}
            >
              <div style={{ fontSize: "12px", color: "#6d28d9" }}>
                💡 <strong>Suggested Protocol:</strong> {aiAnalysis.suggestedAction}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (aiAnalysis.priority) setPriority(aiAnalysis.priority);
                  alert("Applied AI suggested priority: " + aiAnalysis.priority);
                }}
                style={{
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Apply AI Suggestions
              </button>
            </div>
          </section>
        )}

        <section className="management-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h2 style={{ margin: 0 }}>Manage Request</h2>
            {isClosed && (
              <span
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #f87171",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                🔒 Request Closed & Locked
              </span>
            )}
          </div>

          {isClosed && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                color: "#991b1b",
                fontSize: "13px",
              }}
            >
              ⚠️ <strong>This request has been closed.</strong> Once closed, all fields and actions are permanently locked. No further updates or message edits are permitted.
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isClosed}
                style={isClosed ? { opacity: 0.6, cursor: "not-allowed", backgroundColor: "#f1f5f9" } : {}}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isClosed}
                style={isClosed ? { opacity: 0.6, cursor: "not-allowed", backgroundColor: "#f1f5f9" } : {}}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="form-group full">
              <label>Assign Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isClosed}
                style={isClosed ? { opacity: 0.6, cursor: "not-allowed", backgroundColor: "#f1f5f9" } : {}}
              >
                <option>IT & Network</option>
                <option>Maintenance</option>
                <option>Electrical</option>
                <option>Student Services</option>
                <option>Administration</option>
              </select>
            </div>

            <div className="form-group full">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <label style={{ margin: 0 }}>
                  Admin Response to Student
                  {request.adminResponse && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "11px",
                        color: "#16a34a",
                        fontWeight: "700",
                        background: "#dcfce7",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      🔒 Message Sent & Locked
                    </span>
                  )}
                </label>

                {!request.adminResponse && !isClosed && (
                  <button
                    type="button"
                    onClick={() => {
                      const smartReply = generateSmartAdminReply(request);
                      setResponse(smartReply);
                    }}
                    style={{
                      background: "#f3e8ff",
                      color: "#7e22ce",
                      border: "1px solid #d8b4fe",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ✦ Auto-Draft with AI
                  </button>
                )}
              </div>

              {request.adminResponse ? (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "14px 16px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#334155",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {request.adminResponse}
                  </p>
                  <small style={{ color: "#64748b", fontSize: "11px", display: "block" }}>
                    ⚠️ This message has already been delivered to the student and is locked.
                  </small>
                </div>
              ) : (
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  disabled={isClosed}
                  placeholder={
                    isClosed
                      ? "Request is closed. No message can be sent."
                      : "Enter your initial response message to the student, or click '✦ Auto-Draft with AI' above..."
                  }
                  rows="4"
                  style={isClosed ? { opacity: 0.6, cursor: "not-allowed", backgroundColor: "#f1f5f9" } : {}}
                />
              )}
            </div>
          </div>

          <button
            className="update-btn"
            onClick={handleUpdate}
            disabled={isClosed}
            style={
              isClosed
                ? {
                    opacity: 0.5,
                    cursor: "not-allowed",
                    backgroundColor: "#94a3b8",
                  }
                : {}
            }
          >
            {isClosed ? "Request Closed (Locked)" : "Update Status & Changes"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default AdminRequestDetails;