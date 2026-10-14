import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import "../styles/admin-requests.css";

function AdminRequests() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [status, setStatus] = useState("All Status");
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const adminStr = localStorage.getItem("admin");
        if (!adminStr) {
            navigate("/admin/login");
            return;
        }

        fetch(`${API_BASE_URL}/api/requests`)
            .then(res => res.json())
            .then(data => {
              const deletedIds = JSON.parse(localStorage.getItem("deleted_request_ids") || "[]");
              const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
              const merged = data
                .filter(req => !deletedIds.includes(String(req.id)) && !deletedIds.includes(Number(req.id)))
                .map(req => {
                  if (localUpdates[req.id]) {
                    return { ...req, ...localUpdates[req.id] };
                  }
                  return req;
                });
              setRequests(merged);
            })
            .catch(err => {
              console.error(err);
              const deletedIds = JSON.parse(localStorage.getItem("deleted_request_ids") || "[]");
              const localUpdates = JSON.parse(localStorage.getItem("admin_request_updates") || "{}");
              const fallback = Object.values(localUpdates).filter(
                req => !deletedIds.includes(String(req.id)) && !deletedIds.includes(Number(req.id))
              );
              setRequests(fallback);
            });
    }, [navigate]);
    const filteredRequests = requests.filter((request) => {
  const matchesSearch =
    request.title.toLowerCase().includes(search.toLowerCase()) ||
    String(request.id).toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    category === "All Categories" ||
    request.category === category;

  const matchesStatus =
    status === "All Status" ||
    request.status === status;

  return matchesSearch && matchesCategory && matchesStatus;
});
  

  return (
    <div className="admin-requests-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div>AU</div>
          <section>
            <strong>CampusHelp</strong>
            <small>Admin Portal</small>
          </section>
        </div>

        <nav>
          <Link to="/admin" className="admin-nav">
            ▦ Dashboard
          </Link>

          <Link to="/admin/requests" className="admin-nav active">
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

      <main className="admin-requests-main">
        <header className="requests-header">
          <div>
            <span>REQUEST MANAGEMENT</span>
            <h1>All Requests</h1>
            <p>View and manage all campus service requests.</p>
          </div>

          <Link to="/admin" className="back-dashboard">
            ← Dashboard
          </Link>
        </header>

        <section className="requests-card">
          <div className="request-filters">
            <input
  type="text"
  placeholder="Search requests..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option>All Categories</option>
  <option>IT & Network</option>
  <option>Maintenance</option>
  <option>Electrical</option>
  <option>Student Services</option>
</select>  

            <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option>All Status</option>
  <option>Pending</option>
  <option>In Progress</option>
  <option>Resolved</option>
</select>
          </div>

          <div className="requests-list">
            {filteredRequests.map((request) => (
              <div className="request-item" key={request.id}>
                <div className="request-main">
                  <span className="request-id">REQ-{request.id}</span>
                  <h3>{request.title}</h3>
                  <p>
                    {request.category} • {request.user?.name || "Student"}
                  </p>
                </div>

                <span
                  className="priority medium"
                >
                  Medium
                </span>

                <span
                  className={`request-status ${request.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {request.status}
                </span>

                <Link
                  to={`/admin/request/${request.id}`}
                  className="manage-btn"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminRequests;