
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { analyzeRequestWithAI } from "../utils/aiAssistant";
import { API_BASE_URL } from "../config";
import "../styles/raise-request.css";

function RaiseRequest() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: searchParams.get("location") || "",
  });

  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    const loc = searchParams.get("location");
    if (loc) {
      setForm((prev) => ({ ...prev, location: loc }));
    }
  }, [searchParams]);

  // Real-time AI Assistant triggers as the student types title or description
  useEffect(() => {
    if (form.title.trim().length > 3 || form.description.trim().length > 8) {
      const result = analyzeRequestWithAI(form.title, form.description);
      setAiSuggestion(result);

      // Auto-set category if not chosen by user
      if (!form.category && result.category) {
        setForm((prev) => ({ ...prev, category: result.category }));
      }
    } else {
      setAiSuggestion(null);
    }
  }, [form.title, form.description]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const applyAiCategory = () => {
    if (aiSuggestion) {
      setForm((prev) => ({ ...prev, category: aiSuggestion.category }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.description) {
      alert("Please fill all required fields.");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login first!");
      return;
    }
    const user = JSON.parse(userStr);

    fetch(`${API_BASE_URL}/api/requests/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Failed to submit request");
        }
        return response.json();
      })
      .then((data) => {
        alert("Request submitted successfully!");
        setForm({ title: "", category: "", description: "", location: "" });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="request-page">
      <header className="request-header">
        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>

        <div>
          <h1>Raise a Request</h1>
          <p>Tell us about your campus issue and we'll help you.</p>
        </div>
      </header>

      <main className="request-container">
        <div className="request-card">
          <div className="form-heading">
            <h2>Request Details</h2>
            <p>Provide the details below to submit your request.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Request Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Example: Wi-Fi not working"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="IT & Network">IT & Network</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Electrical">Electrical</option>
                <option value="Classroom">Classroom</option>
                <option value="Student Services">Student Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="Example: Block C, 2nd Floor"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Describe Your Issue *</label>
              <textarea
                name="description"
                rows="6"
                placeholder="Explain your issue clearly..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Live AI Classification Card */}
            <div
              className="ai-info"
              style={{
                background: aiSuggestion ? "#f5f3ff" : "#f8fafc",
                borderColor: aiSuggestion ? "#c084fc" : "#e2e8f0",
                borderWidth: "1.5px",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ color: "#7c3aed", fontSize: "20px" }}>✦</span>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <strong style={{ color: "#581c87" }}>
                    AI Smart Assistant {aiSuggestion ? "— Live Analysis" : ""}
                  </strong>
                  {aiSuggestion && (
                    <span
                      style={{
                        background: "#7c3aed",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "10px",
                      }}
                    >
                      {aiSuggestion.confidence}% Match
                    </span>
                  )}
                </div>

                {aiSuggestion ? (
                  <div style={{ marginTop: "8px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#475569" }}>
                      {aiSuggestion.reason}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        style={{
                          background: "#ede9fe",
                          color: "#6d28d9",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        📂 Category: {aiSuggestion.category}
                      </span>
                      <span
                        style={{
                          background:
                            aiSuggestion.priority === "High"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            aiSuggestion.priority === "High"
                              ? "#dc2626"
                              : "#d97706",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        ⚡ Urgency: {aiSuggestion.priority}
                      </span>
                      <span
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        🏢 Routing: {aiSuggestion.department}
                      </span>
                      {aiSuggestion.suggestedLocation && (
                        <span
                          style={{
                            background: "#fef3c7",
                            color: "#b45309",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          📍 Suggested: {aiSuggestion.suggestedLocation}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                      {form.category !== aiSuggestion.category && (
                        <button
                          type="button"
                          onClick={applyAiCategory}
                          style={{
                            background: "#7c3aed",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Apply Category ({aiSuggestion.category})
                        </button>
                      )}

                      {aiSuggestion.suggestedLocation && form.location !== aiSuggestion.suggestedLocation && (
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, location: aiSuggestion.suggestedLocation }))}
                          style={{
                            background: "#0284c7",
                            color: "white",
                            border: "none",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          📍 Auto-fill Location ({aiSuggestion.suggestedLocation})
                        </button>
                      )}

                      {aiSuggestion.blockCode && (
                        <Link
                          to={`/block-finder?block=${aiSuggestion.blockCode}`}
                          style={{
                            background: "#e2e8f0",
                            color: "#334155",
                            textDecoration: "none",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          🗺️ View Block {aiSuggestion.blockCode} on Map →
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    Type your issue title or description above, and the AI assistant
                    will automatically predict category, urgency, location, and department routing.
                  </p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <Link to="/dashboard" className="cancel-btn">
                Cancel
              </Link>

              <button type="submit" className="submit-btn">
                Submit Request →
              </button>
            </div>
          </form>
        </div>

        <aside className="request-tips">
          <div className="tips-icon">✦</div>
          <h3>Tips for a better request</h3>

          <ul>
            <li>Use a clear and short title.</li>
            <li>Describe the issue accurately.</li>
            <li>Mention the exact location if possible.</li>
            <li>Include important details about the problem.</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}

export default RaiseRequest;

