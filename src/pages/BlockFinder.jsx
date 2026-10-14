import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/block-finder.css";

const BLOCKS_DATA = {
  A: {
    code: "A",
    name: "A Block",
    role: "Department of CSE — Block A",
    desc: "Central Computer Center, Computer Science Engineering, Dean's Suite & Core Classrooms",
    color: "#2563eb",
    tag: "Department of CSE",
    embedUrl:
      "https://maps.google.com/maps?q=Department+of+CSE+-+Block+A,+Anurag+University,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Department+of+CSE+-+Block+A+Anurag+University",
  },
  B: {
    code: "B",
    name: "B Block",
    role: "School of Pharmacy",
    desc: "Pharmaceutical Chemistry, Pharmaceutics, Pharmacognosy & Clinical Research Laboratories",
    color: "#059669",
    tag: "School of Pharmacy",
    embedUrl:
      "https://maps.google.com/maps?q=School+of+Pharmacy,+Anurag+University,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/School+of+Pharmacy+Anurag+University",
  },
  C: {
    code: "C",
    name: "C Block",
    role: "Side of Court (Inside Anurag University)",
    desc: "Academic and technical workshops wing, located inside Anurag University campus right next to the court and main administrative building",
    color: "#7c3aed",
    tag: "Inside Anurag University — Next to Court",
    embedUrl:
      "https://maps.google.com/maps?q=Anurag+University,+Hyderabad&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Anurag+University+Hyderabad",
  },
  D: {
    code: "D",
    name: "D Block",
    role: "Anurag Group of Institutions D Block",
    desc: "Undergraduate Engineering Programs, Departmental Labs & Faculty Chambers",
    color: "#ea580c",
    tag: "D Block Academic Wing",
    embedUrl:
      "https://maps.google.com/maps?q=Anurag+Group+of+Institutions+D+Block,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Anurag+Group+of+Institutions+D+Block",
  },
  E: {
    code: "E",
    name: "E Block",
    role: "Department of ECE",
    desc: "Electronics & Communication Engineering, VLSI Lab, Microprocessors & Embedded Systems",
    color: "#0891b2",
    tag: "ECE Department",
    embedUrl:
      "https://maps.google.com/maps?q=Department+of+ECE,+Anurag+University,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Department+of+ECE+Anurag+University",
  },
  F: {
    code: "F",
    name: "F Block",
    role: "Examination Branch",
    desc: "Controller of Examinations, Student Records, Marks Memos & Evaluation Center",
    color: "#d97706",
    tag: "Examination Branch",
    embedUrl:
      "https://maps.google.com/maps?q=Examinations+Branch,+Anurag+University,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Examinations+Branch+Anurag+University",
  },
  G: {
    code: "G",
    name: "G Block",
    role: "Anurag Central Library",
    desc: "Central University Library, Digital Knowledge Center, Reference Sections & Reading Halls",
    color: "#dc2626",
    tag: "Central Library",
    embedUrl:
      "https://maps.google.com/maps?q=Anurag+Library,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Anurag+Library+Ghatkesar",
  },
  H: {
    code: "H",
    name: "H Block",
    role: "H- Block (H బ్లాక్ — Below D Block)",
    desc: "Academic classrooms, computer labs & seminar halls, located directly south of Anurag Group of Institutions D Block and Block A",
    color: "#0284c7",
    tag: "H- Block (South of D Block)",
    embedUrl:
      "https://maps.google.com/maps?q=H-+Block,+Anurag+Group+of+Institutions+D+Block,+Venkatapur&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/H-+Block+Anurag+Group+of+Institutions+D+Block",
  },
  I: {
    code: "I",
    name: "I Block",
    role: "Artificial Intelligence & SAPNA IoT",
    desc: "School of Artificial Intelligence, Deep Learning R&D, IoT Solutions & Data Science",
    color: "#4f46e5",
    tag: "AI & IoT Hub",
    embedUrl:
      "https://maps.google.com/maps?q=Anurag-SAPNA+IOT+solutions+Pvt.Ltd,+Ghatkesar&t=&z=19&ie=UTF8&iwloc=B&output=embed",
    gmapsDirect:
      "https://www.google.com/maps/search/Anurag-SAPNA+IOT+solutions",
  },
};

function BlockFinder() {
  const [searchParams] = useSearchParams();
  const initialBlock = (searchParams.get("block") || "A").toUpperCase();
  const [selectedBlockKey, setSelectedBlockKey] = useState(
    BLOCKS_DATA[initialBlock] ? initialBlock : "A"
  );

  useEffect(() => {
    const b = searchParams.get("block");
    if (b && BLOCKS_DATA[b.toUpperCase()]) {
      setSelectedBlockKey(b.toUpperCase());
    }
  }, [searchParams]);

  const currentBlock = BLOCKS_DATA[selectedBlockKey] || BLOCKS_DATA.A;

  return (
    <div className="block-finder-page">
      {/* Top Header */}
      <header className="block-header">
        <div className="block-brand">
          <div className="block-logo">AU</div>
          <div>
            <strong>CampusHelp</strong>
            <span>Anurag University Live Campus Map</span>
          </div>
        </div>

        <div className="header-actions">
          <a
            href={currentBlock.gmapsDirect}
            target="_blank"
            rel="noopener noreferrer"
            className="open-gmaps-btn"
          >
            ↗ Open {currentBlock.code} in Google Maps
          </a>
          <Link to="/dashboard" className="back-dashboard">
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="map-view-main">
        {/* Campus Block Selector Bar - Now Complete with A, B, C, D, E, F, G, H, I */}
        <section className="campus-blocks-bar">
          <div className="bar-label">
            <span className="live-dot">●</span>
            <span>SELECT CAMPUS BLOCK:</span>
          </div>

          <div className="block-chips">
            {Object.keys(BLOCKS_DATA).map((key) => {
              const block = BLOCKS_DATA[key];
              const isSelected = selectedBlockKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`block-chip ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedBlockKey(key)}
                  style={
                    isSelected
                      ? {
                          borderColor: block.color,
                          boxShadow: `0 0 14px ${block.color}77`,
                        }
                      : {}
                  }
                >
                  <span
                    className="chip-badge"
                    style={{
                      backgroundColor: isSelected ? block.color : "#475569",
                    }}
                  >
                    {block.code}
                  </span>
                  <span className="chip-name">{block.name}</span>
                  <span className="chip-sub">({block.role})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Block Spotlight Banner */}
        <div
          className="active-block-strip"
          style={{
            borderColor: currentBlock.color,
            boxShadow: `0 4px 20px ${currentBlock.color}25`,
          }}
        >
          <div className="strip-left">
            <span
              className="strip-code-badge"
              style={{ backgroundColor: currentBlock.color }}
            >
              {currentBlock.code}
            </span>
            <div>
              <h2>
                {currentBlock.name} — {currentBlock.role}
              </h2>
              <p>{currentBlock.desc}</p>
            </div>
          </div>
          <div className="strip-right">
            <span
              className="tag-badge"
              style={{
                color: currentBlock.color,
                border: `1px solid ${currentBlock.color}55`,
              }}
            >
              📍 {currentBlock.tag}
            </span>
            <Link
              to={`/raise-request?location=${encodeURIComponent(
                `${currentBlock.name} - ${currentBlock.role}`
              )}`}
              className="quick-report-btn"
              style={{ backgroundColor: currentBlock.color }}
            >
              ＋ Raise Issue in {currentBlock.code} Block
            </Link>
          </div>
        </div>

        {/* Live Interactive Map centered precisely on the selected block */}
        <div className="campus-map-card">
          <div className="map-card-bar">
            <div className="map-title-info">
              <span className="radar-icon">📍</span>
              <strong>Live Google Map:</strong>
              <span className="coords-label">
                Currently Centered on <strong style={{ color: currentBlock.color }}>{currentBlock.name} ({currentBlock.role})</strong>
              </span>
            </div>

            <div className="map-quick-links">
              {Object.keys(BLOCKS_DATA).map((key) => {
                const b = BLOCKS_DATA[key];
                return (
                  <span
                    key={key}
                    onClick={() => setSelectedBlockKey(key)}
                    className={`legend-tag ${selectedBlockKey === key ? "active-legend" : ""}`}
                    style={
                      selectedBlockKey === key
                        ? { borderColor: b.color, background: `${b.color}25` }
                        : {}
                    }
                  >
                    <strong style={{ color: b.color }}>{b.code}:</strong> {b.role}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="iframe-wrapper">
            <iframe
              key={currentBlock.code}
              title={`Anurag University Live Map - ${currentBlock.name}`}
              src={currentBlock.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default BlockFinder;