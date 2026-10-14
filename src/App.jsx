import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import RaiseRequest from "./pages/RaiseRequest";
import MyRequests from "./pages/MyRequests";
import BlockFinder from "./pages/BlockFinder";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRequests from "./pages/AdminRequests";
import AdminRequestDetails from "./pages/AdminRequestDetails";
import AdminLogin from "./pages/AdminLogin";
import BlockDetailPage from "./pages/BlockDetailPage";
import "./App.css";

function Home() {
  return (
    <div className="app">

      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">AU</div>

          <div>
            <h2>Smart Campus</h2>
            <span>Helpdesk & Services</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#blocks">Block Finder</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
  <Link to="/login">
    <button className="login-btn">Login</button>
  </Link>

  <Link to="/register">
    <button className="register-btn">
      Register
    </button>
  </Link>
</div>
      </nav>

      <section className="hero" id="home">

        <div className="hero-content">

          <div className="badge">
            <span>●</span>
            Anurag University Campus Services
          </div>

          <h1>
            Your Campus Support,
            <span> Simplified.</span>
          </h1>

          <p>
            Raise service requests, track their progress, and get connected
            with the right campus department — all from one place.
          </p>

          <div className="hero-buttons">

            <Link to="/login">
              <button className="primary-btn">
                Raise a Request →
              </button>
            </Link>

            <Link to="/login">
              <button className="secondary-btn">
                Track My Request
              </button>
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <strong>24/7</strong>
              <span>Request Access</span>
            </div>

            <div>
              <strong>9+</strong>
              <span>Campus Blocks</span>
            </div>

            <div>
              <strong>1</strong>
              <span>Unified Platform</span>
            </div>

          </div>

        </div>

        <div className="hero-card">

          <div className="card-header">

            <div>
              <span className="small-label">
                HELPDESK
              </span>

              <h3>How can we help?</h3>
            </div>

            <div className="status-dot"></div>

          </div>

          <div className="request-card">

            <div className="request-icon">
              📶
            </div>

            <div>
              <h4>Wi-Fi Issue</h4>
              <p>Internet & Network Services</p>
            </div>

            <span className="pending">
              Pending
            </span>

          </div>

          <div className="request-card">

            <div className="request-icon">
              💡
            </div>

            <div>
              <h4>Classroom Light</h4>
              <p>Electrical Maintenance</p>
            </div>

            <span className="resolved">
              Resolved
            </span>

          </div>

          <div className="ai-card">

            <div className="ai-icon">
              ✦
            </div>

            <div>
              <strong>AI Helpdesk Assistant</strong>

              <p>
                Get smart assistance with your request.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="services" id="services">

        <div className="section-heading">

          <span>OUR SERVICES</span>

          <h2>
            Everything you need, in one place.
          </h2>

          <p>
            Access campus support services quickly and keep track
            of every request you raise.
          </p>

        </div>

        <div className="service-grid">

          <div className="service-card">

            <div className="service-icon blue">
              ⚙
            </div>

            <h3>Raise a Request</h3>

            <p>
              Report maintenance, technical, classroom,
              internet and other campus-related issues.
            </p>

            <Link to="/login">
              <button>
                Submit Request →
              </button>
            </Link>

          </div>

          <div className="service-card">

            <div className="service-icon purple">
              ⌁
            </div>

            <h3>Track Requests</h3>

            <p>
              Monitor the status of your submitted requests
              from submission to resolution.
            </p>

            <Link to="/login">
              <button>
                View Requests →
              </button>
            </Link>

          </div>

          <div className="service-card">

            <div className="service-icon green">
              ✦
            </div>

            <h3>AI Assistance</h3>

            <p>
              Get intelligent category, priority and department
              suggestions while submitting a request.
            </p>

            <Link to="/login">
              <button>
                Try AI Assistant →
              </button>
            </Link>

          </div>

        </div>

      </section>

      <section className="block-section" id="blocks">

        <div className="block-content">

          <span className="section-tag">
            CAMPUS BLOCK FINDER
          </span>

          <h2>
            Find your way around
            <span> Anurag University.</span>
          </h2>

          <p>
            New to the campus? Quickly find information about
            blocks A to I and discover the departments and
            facilities available in each block.
          </p>

          <button className="primary-btn">
            Explore Campus Blocks →
          </button>

        </div>

        <div className="blocks-grid">

          {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(
            (block) => (
              <div className="block-item" key={block}>
                <span>{block}</span>
                <small>Block</small>
              </div>
            )
          )}

        </div>

      </section>

      <footer id="about">

        <div>
          <h3>
            Smart Campus Helpdesk
          </h3>

          <p>
            A unified digital platform for smarter campus support.
          </p>
        </div>

        <div className="footer-right">
          <span>ReactJS</span>
          <span>Spring Boot</span>
          <span>AI Powered</span>
        </div>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/dashboard" element={<StudentDashboard />} />
    <Route path="/raise-request" element={<RaiseRequest />} />
    <Route path="/my-requests" element={<MyRequests />} />
    <Route path="/block-finder" element={<BlockFinder />} />
    <Route path="/block/:blockId" element={<BlockDetailPage />} />
    <Route path="/block-a" element={<BlockDetailPage />} />
    <Route path="/block-b" element={<BlockDetailPage />} />
    <Route path="/block-c" element={<BlockDetailPage />} />

    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/requests" element={<AdminRequests />} />
    <Route
      path="/admin/request/:id"
      element={<AdminRequestDetails />}
    />
  </Routes>
</BrowserRouter>
  );
}

export default App;