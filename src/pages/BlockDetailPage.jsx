import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "../styles/block-map.css";

// Block metadata and floor layout definitions
const BLOCKS_CONFIG = {
  a: {
    code: "A",
    title: "Block A — Main Academic & Computer Engineering",
    description: "Houses Central Computer Center, CSE Department, Dean's Office, and Primary Lecture Halls.",
    floors: ["Ground Floor", "1st Floor", "2nd Floor"],
    themeClass: "block-a",
    stats: { labs: 6, classrooms: 18, facultyRooms: 8 },
    roomsByFloor: {
      "Ground Floor": [
        {
          id: "A-001",
          name: "Central Computing Lab 1",
          type: "lab",
          color: "#dbeafe",
          stroke: "#2563eb",
          x: 40,
          y: 40,
          w: 240,
          h: 150,
          capacity: "75 Systems",
          inCharge: "Dr. K. Srinivas Rao",
          facilities: ["High-speed LAN", "Dual Monitors", "Air Conditioned", "Projector"],
          notes: "Equipped with NVIDIA RTX workstations for AI/ML and Advanced Computing labs.",
        },
        {
          id: "A-002",
          name: "Main Reception & Enquiry",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 300,
          y: 40,
          w: 160,
          h: 150,
          capacity: "General Public",
          inCharge: "Campus Admin Desk",
          facilities: ["Visitor Passes", "Campus Directory", "Student Help Point"],
          notes: "Primary entry assistance point for Block A visitors and new students.",
        },
        {
          id: "A-003",
          name: "Dean & HOD (CSE) Suite",
          type: "staff",
          color: "#dcfce7",
          stroke: "#15803d",
          x: 480,
          y: 40,
          w: 180,
          h: 150,
          capacity: "Administration",
          inCharge: "Head of Department (CSE)",
          facilities: ["Meeting Room", "Confidential Records", "Executive Waiting"],
          notes: "Department administrative operations and faculty advisory office.",
        },
        {
          id: "A-004",
          name: "Lecture Hall A-01",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 680,
          y: 40,
          w: 180,
          h: 150,
          capacity: "80 Seats",
          inCharge: "Academic Section",
          facilities: ["Smart Board", "Surround Audio", "Podium Mic", "Projector"],
          notes: "Multimedia smart classroom optimized for large lectures.",
        },
        {
          id: "A-CORR",
          name: "Central Corridor & Escalator Lobby",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Open Passage",
          inCharge: "Facility Caretaker",
          facilities: ["Water Dispenser", "Fire Extinguisher", "Emergency Exit"],
          notes: "Main pedestrian hallway connecting East and West wings of Block A.",
        },
        {
          id: "A-005",
          name: "Software Systems Lab",
          type: "lab",
          color: "#dbeafe",
          stroke: "#2563eb",
          x: 40,
          y: 290,
          w: 220,
          h: 150,
          capacity: "60 Systems",
          inCharge: "Prof. P. Sunitha",
          facilities: ["Linux Servers", "Gigabit Switch", "UPS Backup"],
          notes: "Dedicated lab for Web Development, Java Full Stack, and OS practicals.",
        },
        {
          id: "A-006",
          name: "Classroom A-02",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 280,
          y: 290,
          w: 180,
          h: 150,
          capacity: "70 Seats",
          inCharge: "Faculty Coordinator",
          facilities: ["Projector", "Wi-Fi 6 AP", "Green Chalkboard"],
          notes: "Section A Computer Science lectures held here.",
        },
        {
          id: "A-007",
          name: "Staff Lounge & Faculty Room 1",
          type: "staff",
          color: "#dcfce7",
          stroke: "#15803d",
          x: 480,
          y: 290,
          w: 200,
          h: 150,
          capacity: "16 Faculty Cubicles",
          inCharge: "Senior Faculty Advisor",
          facilities: ["Printer / Scanner", "Pantry", "Consultation Desks"],
          notes: "Office hours available Monday to Friday 2:00 PM - 4:00 PM.",
        },
        {
          id: "A-008",
          name: "Restrooms & Utilities",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 700,
          y: 290,
          w: 160,
          h: 150,
          capacity: "Sanitary Facilities",
          inCharge: "Campus Maintenance",
          facilities: ["Clean Water Station", "Accessible Washroom"],
          notes: "Regular maintenance scheduled at 11 AM and 3 PM daily.",
        },
      ],
      "1st Floor": [
        {
          id: "A-101",
          name: "Data Science & AI Laboratory",
          type: "lab",
          color: "#dbeafe",
          stroke: "#2563eb",
          x: 40,
          y: 40,
          w: 250,
          h: 150,
          capacity: "65 High-End Systems",
          inCharge: "Dr. V. Raman",
          facilities: ["GPU Racks", "Python / PyTorch Suite", "Smart Display"],
          notes: "Specialized lab for Machine Learning & Deep Learning capstone projects.",
        },
        {
          id: "A-102",
          name: "Seminar Hall (150-Seater)",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 310,
          y: 40,
          w: 320,
          h: 150,
          capacity: "150 Seats",
          inCharge: "Events Coordinator",
          facilities: ["Stage Audio System", "Dual Projectors", "Acoustic Wall Panels"],
          notes: "Venue for technical seminars, guest lectures, and placement orientations.",
        },
        {
          id: "A-103",
          name: "Faculty Rooms (A-103 to A-106)",
          type: "staff",
          color: "#dcfce7",
          stroke: "#15803d",
          x: 650,
          y: 40,
          w: 210,
          h: 150,
          capacity: "12 Faculty Desks",
          inCharge: "Associate HOD",
          facilities: ["Wi-Fi", "Intercom", "Discussion Desk"],
          notes: "Faculty mentoring and project guidance chambers.",
        },
        {
          id: "A-CORR-1",
          name: "First Floor Central Hallway",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Open Passage",
          inCharge: "Facility Staff",
          facilities: ["Notice Boards", "First Aid Box", "Purified Water"],
          notes: "Notice board displays weekly timetable and exam updates.",
        },
        {
          id: "A-104",
          name: "Classroom A-101",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 200,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Class Teacher",
          facilities: ["Projector", "Whiteboard", "Mic"],
          notes: "3rd Year CSE - Section B.",
        },
        {
          id: "A-105",
          name: "Classroom A-102",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 260,
          y: 290,
          w: 200,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Class Teacher",
          facilities: ["Projector", "Whiteboard", "Mic"],
          notes: "3rd Year CSE - Section C.",
        },
        {
          id: "A-106",
          name: "IoT & Embedded Systems Lab",
          type: "lab",
          color: "#dbeafe",
          stroke: "#2563eb",
          x: 480,
          y: 290,
          w: 220,
          h: 150,
          capacity: "50 Workbenches",
          inCharge: "Prof. N. Haritha",
          facilities: ["Raspberry Pi Kits", "Arduino Stations", "Oscilloscopes"],
          notes: "Hands-on hardware lab for Internet of Things and Microcontrollers.",
        },
        {
          id: "A-107",
          name: "Washrooms & Rest Area",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 720,
          y: 290,
          w: 140,
          h: 150,
          capacity: "Facilities",
          inCharge: "Housekeeping",
          facilities: ["Water Dispenser", "Restroom"],
          notes: "Floor 1 hygiene and sanitation.",
        },
      ],
      "2nd Floor": [
        {
          id: "A-201",
          name: "Cloud & Cyber Security Lab",
          type: "lab",
          color: "#dbeafe",
          stroke: "#2563eb",
          x: 40,
          y: 40,
          w: 260,
          h: 150,
          capacity: "60 Systems",
          inCharge: "Dr. S. Reddy",
          facilities: ["Isolated Subnet", "Firewall Appliance", "Server Access"],
          notes: "Certified laboratory for ethical hacking and penetration testing.",
        },
        {
          id: "A-202",
          name: "Department Library & Digital Reading Room",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 320,
          y: 40,
          w: 280,
          h: 150,
          capacity: "45 Study Desks",
          inCharge: "Assistant Librarian",
          facilities: ["IEEE Xplore Access", "Textbooks", "Quiet Study Pods"],
          notes: "Open from 8:30 AM to 6:00 PM on all instructional days.",
        },
        {
          id: "A-203",
          name: "Research Scholar Chamber",
          type: "staff",
          color: "#dcfce7",
          stroke: "#15803d",
          x: 620,
          y: 40,
          w: 240,
          h: 150,
          capacity: "20 Scholars",
          inCharge: "R&D Dean",
          facilities: ["High-speed LAN", "Conference Table", "Whiteboard"],
          notes: "Ph.D. candidates and research associates workspace.",
        },
        {
          id: "A-CORR-2",
          name: "Second Floor Corridor",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Passage",
          inCharge: "Facility Staff",
          facilities: ["Emergency Exit Stairs", "Water Cooler"],
          notes: "Quiet zone strictly observed on Floor 2.",
        },
        {
          id: "A-204",
          name: "Classroom A-201 (PG / M.Tech)",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 250,
          h: 150,
          capacity: "50 Seats",
          inCharge: "PG Coordinator",
          facilities: ["Smart Board", "Hybrid Lecture Cam"],
          notes: "Postgraduate programs lecture hall.",
        },
        {
          id: "A-205",
          name: "Project Incubation Center",
          type: "lab",
          color: "#dbeafe",
          stroke: "#2563eb",
          x: 310,
          y: 290,
          w: 270,
          h: 150,
          capacity: "40 Innovators",
          inCharge: "Innovation Cell Lead",
          facilities: ["3D Printer", "Soldering Station", "Prototyping Kits"],
          notes: "Startup cell and student hackathon workshop space.",
        },
        {
          id: "A-206",
          name: "Server Control Room",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 600,
          y: 290,
          w: 260,
          h: 150,
          capacity: "Restricted Access",
          inCharge: "Campus Network Admin",
          facilities: ["Server Racks", "Redundant UPS", "CCTV Monitor"],
          notes: "Campus core switch and internet gateway infrastructure.",
        },
      ],
    },
  },
  b: {
    code: "B",
    title: "Block B — Electronics & Electrical Sciences",
    description: "Dedicated to Electronics & Communication (ECE) and Electrical Engineering (EEE) laboratories and lecture halls.",
    floors: ["Ground Floor", "1st Floor", "2nd Floor"],
    themeClass: "block-b",
    stats: { labs: 8, classrooms: 16, facultyRooms: 6 },
    roomsByFloor: {
      "Ground Floor": [
        {
          id: "B-001",
          name: "Basic Electrical Engineering Lab",
          type: "lab",
          color: "#d1fae5",
          stroke: "#059669",
          x: 40,
          y: 40,
          w: 260,
          h: 150,
          capacity: "60 Students",
          inCharge: "Dr. M. Bhaskar",
          facilities: ["AC/DC Power Benches", "Rheostats", "Transformers", "Safety Gear"],
          notes: "Heavy electrical circuits and machines laboratory equipped with safety trip breakers.",
        },
        {
          id: "B-002",
          name: "HOD Office & EEE Department Desk",
          type: "staff",
          color: "#ecfdf5",
          stroke: "#047857",
          x: 320,
          y: 40,
          w: 180,
          h: 150,
          capacity: "Admin & Faculty",
          inCharge: "Head of Dept (EEE)",
          facilities: ["Visitor Area", "Meeting Space", "Student Help Desk"],
          notes: "Department office for admissions, attendance, and administrative services.",
        },
        {
          id: "B-003",
          name: "Power Systems Simulation Lab",
          type: "lab",
          color: "#d1fae5",
          stroke: "#059669",
          x: 520,
          y: 40,
          w: 200,
          h: 150,
          capacity: "50 Workstations",
          inCharge: "Prof. R. Lakshmi",
          facilities: ["MATLAB / Simulink", "PowerWorld", "ETAP Licenses"],
          notes: "Computational analysis of grid systems and transmission networks.",
        },
        {
          id: "B-004",
          name: "First Aid & Health Wellness Post",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 740,
          y: 40,
          w: 120,
          h: 150,
          capacity: "Campus Care",
          inCharge: "Medical Officer",
          facilities: ["Emergency Bed", "BP / Sugar Check", "First Aid Kit"],
          notes: "Resident nurse available on site during college working hours.",
        },
        {
          id: "B-CORR",
          name: "Block B Main Ground Arcade",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Open Concourse",
          inCharge: "Block Supervisor",
          facilities: ["Water Fountain", "Notice Boards", "Evacuation Route Map"],
          notes: "Connects south lawn quadrangle with the engineering complex.",
        },
        {
          id: "B-005",
          name: "Classroom B-01 (Smart Room)",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 220,
          h: 150,
          capacity: "70 Seats",
          inCharge: "Class Incharge",
          facilities: ["Interactive Board", "HD Projector", "Wireless Mic"],
          notes: "Core classroom for 2nd Year Electrical Engineering subjects.",
        },
        {
          id: "B-006",
          name: "Classroom B-02",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 280,
          y: 290,
          w: 220,
          h: 150,
          capacity: "70 Seats",
          inCharge: "Class Incharge",
          facilities: ["Chalkboard", "Ceiling Projector", "PA Audio"],
          notes: "Core classroom for 2nd Year ECE students.",
        },
        {
          id: "B-007",
          name: "Faculty Rooms (B-10 to B-15)",
          type: "staff",
          color: "#ecfdf5",
          stroke: "#047857",
          x: 520,
          y: 290,
          w: 190,
          h: 150,
          capacity: "14 Faculty Cabins",
          inCharge: "Department Admin",
          facilities: ["Faculty Desks", "Pantry", "Internet"],
          notes: "Electrical and Electronics faculty counseling offices.",
        },
        {
          id: "B-008",
          name: "Restroom Facilities",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 730,
          y: 290,
          w: 130,
          h: 150,
          capacity: "Sanitation",
          inCharge: "Housekeeping",
          facilities: ["Water Station", "Restrooms"],
          notes: "Maintained by campus housekeeping staff.",
        },
      ],
      "1st Floor": [
        {
          id: "B-101",
          name: "Analog & Digital Electronics Lab",
          type: "lab",
          color: "#d1fae5",
          stroke: "#059669",
          x: 40,
          y: 40,
          w: 280,
          h: 150,
          capacity: "60 Workstations",
          inCharge: "Dr. K. Anuradha",
          facilities: ["DSO Oscilloscopes", "Function Generators", "Breadboard Trainers"],
          notes: "Core lab for circuit design, diode amplifiers, and digital logic gates.",
        },
        {
          id: "B-102",
          name: "Microprocessor & VLSI Lab",
          type: "lab",
          color: "#d1fae5",
          stroke: "#059669",
          x: 340,
          y: 40,
          w: 280,
          h: 150,
          capacity: "55 Systems",
          inCharge: "Prof. G. Suresh",
          facilities: ["Cadence EDA Tools", "Xilinx FPGA Kits", "8086 Trainers"],
          notes: "IC design and digital chip verification laboratory.",
        },
        {
          id: "B-103",
          name: "HOD Office (ECE)",
          type: "staff",
          color: "#ecfdf5",
          stroke: "#047857",
          x: 640,
          y: 40,
          w: 220,
          h: 150,
          capacity: "Admin Chamber",
          inCharge: "Head of Dept (ECE)",
          facilities: ["Conference Table", "Record Room", "Reception"],
          notes: "Head of Electronics and Communication Engineering.",
        },
        {
          id: "B-CORR-1",
          name: "Floor 1 Walkway & Display Gallery",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Corridor",
          inCharge: "Block Caretaker",
          facilities: ["Project Showcases", "Student Notice Boards"],
          notes: "Displays student award-winning hardware prototypes.",
        },
        {
          id: "B-104",
          name: "Classroom B-101",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 250,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Section Mentor",
          facilities: ["Projector", "Sound Amplification", "Air Flow Fans"],
          notes: "3rd Year ECE - Section A.",
        },
        {
          id: "B-105",
          name: "Classroom B-102",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 310,
          y: 290,
          w: 250,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Section Mentor",
          facilities: ["Projector", "Sound Amplification"],
          notes: "3rd Year ECE - Section B.",
        },
        {
          id: "B-106",
          name: "ECE Faculty Rooms & Meeting Hall",
          type: "staff",
          color: "#ecfdf5",
          stroke: "#047857",
          x: 580,
          y: 290,
          w: 280,
          h: 150,
          capacity: "20 Faculty Desks",
          inCharge: "Staff Secretary",
          facilities: ["LAN", "Coffee Dispenser", "Cabin Desks"],
          notes: "ECE faculty staff chambers and discussion rooms.",
        },
      ],
      "2nd Floor": [
        {
          id: "B-201",
          name: "Antenna & Microwave Engineering Lab",
          type: "lab",
          color: "#d1fae5",
          stroke: "#059669",
          x: 40,
          y: 40,
          w: 300,
          h: 150,
          capacity: "45 Students",
          inCharge: "Dr. P. Rajesh",
          facilities: ["Anechoic Test Box", "Spectrum Analyzers", "HFSS Simulation"],
          notes: "High frequency RF, cellular antenna and radar equipment testing.",
        },
        {
          id: "B-202",
          name: "Robotics & Automation Research Cell",
          type: "lab",
          color: "#d1fae5",
          stroke: "#059669",
          x: 360,
          y: 40,
          w: 280,
          h: 150,
          capacity: "40 Innovators",
          inCharge: "Lead Researcher",
          facilities: ["Industrial Robotic Arm", "ROS Systems", "Soldering Benches"],
          notes: "Multidisciplinary robotics and drone innovation workshop.",
        },
        {
          id: "B-203",
          name: "Department Tutorial & Discussion Room",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 660,
          y: 40,
          w: 200,
          h: 150,
          capacity: "35 Seats",
          inCharge: "Academic Counselor",
          facilities: ["Whiteboard Tables", "Smart TV Screen"],
          notes: "Collaborative student study sessions and remedial classes.",
        },
        {
          id: "B-CORR-2",
          name: "Floor 2 Central Corridor",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Corridor",
          inCharge: "Floor Incharge",
          facilities: ["Water Dispenser", "Fire Extinguisher"],
          notes: "Second floor quiet corridor.",
        },
        {
          id: "B-204",
          name: "Classroom B-201 (Final Year)",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 260,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Final Year Guide",
          facilities: ["Smart Board", "Mic"],
          notes: "4th Year Electrical Engineering.",
        },
        {
          id: "B-205",
          name: "Classroom B-202 (Final Year)",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 320,
          y: 290,
          w: 260,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Final Year Guide",
          facilities: ["Smart Board", "Mic"],
          notes: "4th Year ECE Section A.",
        },
        {
          id: "B-206",
          name: "Department Seminar & Conference Room",
          type: "staff",
          color: "#ecfdf5",
          stroke: "#047857",
          x: 600,
          y: 290,
          w: 260,
          h: 150,
          capacity: "50 Seats",
          inCharge: "Department Admin",
          facilities: ["Video Conferencing", "Dual LCD Display", "Conference Audio"],
          notes: "Faculty meetings and board of studies conclaves.",
        },
      ],
    },
  },
  c: {
    code: "C",
    title: "Block C — Civil, Mechanical & Workshops Complex",
    description: "Equipped with Heavy Machinery Workshops, CAD/CAM Design Studios, Hydraulics Lab, and Structural Test Facilities.",
    floors: ["Ground Floor", "1st Floor", "2nd Floor"],
    themeClass: "block-c",
    stats: { labs: 9, classrooms: 14, facultyRooms: 7 },
    roomsByFloor: {
      "Ground Floor": [
        {
          id: "C-001",
          name: "Central Mechanical Workshop",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 40,
          y: 40,
          w: 280,
          h: 150,
          capacity: "70 Students",
          inCharge: "Workshop Superintendent",
          facilities: ["Lathe Machines", "Welding Stations", "Carpentry & Fitting Benches"],
          notes: "Hands-on manufacturing processes and metal crafting workshop.",
        },
        {
          id: "C-002",
          name: "Hydraulics & Fluid Mechanics Lab",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 340,
          y: 40,
          w: 260,
          h: 150,
          capacity: "50 Students",
          inCharge: "Dr. B. Prasad",
          facilities: ["Pelton Wheel Turbine", "Venturi Flumes", "Fluid Flow Rigs"],
          notes: "Fluid dynamics, water flow velocity, and turbine efficiency testing.",
        },
        {
          id: "C-003",
          name: "Mechanical Dept & HOD Office",
          type: "staff",
          color: "#ede9fe",
          stroke: "#6d28d9",
          x: 620,
          y: 40,
          w: 240,
          h: 150,
          capacity: "Admin Office",
          inCharge: "Head of Dept (Mech)",
          facilities: ["Meeting Desk", "Store Room Access", "Visitor Seating"],
          notes: "Department inquiries and workshop supervision center.",
        },
        {
          id: "C-CORR",
          name: "Block C Heavy Transit Corridor",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Transit Area",
          inCharge: "Safety Supervisor",
          facilities: ["Safety Helmet Rack", "Industrial First Aid", "Fire Hoses"],
          notes: "Strict safety equipment compliance zone.",
        },
        {
          id: "C-004",
          name: "Strength of Materials & Concrete Lab",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 40,
          y: 290,
          w: 270,
          h: 150,
          capacity: "55 Students",
          inCharge: "Dr. S. K. Nair",
          facilities: ["UTM (Universal Testing Machine)", "Torsion Tester", "Concrete Compactor"],
          notes: "Civil engineering tensile, compression, and concrete hardening evaluation.",
        },
        {
          id: "C-005",
          name: "Lecture Hall C-01",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 330,
          y: 290,
          w: 230,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Class Coordinator",
          facilities: ["Smart Board", "Projection Screen", "PA Audio"],
          notes: "2nd Year Mechanical Engineering lecture venue.",
        },
        {
          id: "C-006",
          name: "Civil Engineering Department Desk & Staff",
          type: "staff",
          color: "#ede9fe",
          stroke: "#6d28d9",
          x: 580,
          y: 290,
          w: 280,
          h: 150,
          capacity: "16 Faculty Cubicles",
          inCharge: "Head of Dept (Civil)",
          facilities: ["Faculty Desks", "Pantry", "Survey Stores Access"],
          notes: "Surveying equipment issue and faculty counseling chambers.",
        },
      ],
      "1st Floor": [
        {
          id: "C-101",
          name: "CAD/CAM & Digital Simulation Lab",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 40,
          y: 40,
          w: 280,
          h: 150,
          capacity: "60 High-end Systems",
          inCharge: "Prof. T. Venkatesh",
          facilities: ["AutoCAD", "SolidWorks", "ANSYS Workbench", "CNC Simulators"],
          notes: "3D CAD modeling, FEA finite element analysis, and mechanical structural simulation.",
        },
        {
          id: "C-102",
          name: "Geotechnical & Soil Mechanics Lab",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 340,
          y: 40,
          w: 260,
          h: 150,
          capacity: "50 Students",
          inCharge: "Dr. K. Madhavi",
          facilities: ["Direct Shear Apparatus", "Core Cutters", "Liquid Limit Tools"],
          notes: "Soil foundation testing, bearing capacity, and sieve grading analysis.",
        },
        {
          id: "C-103",
          name: "Faculty Rooms (C-101 to C-105)",
          type: "staff",
          color: "#ede9fe",
          stroke: "#6d28d9",
          x: 620,
          y: 40,
          w: 240,
          h: 150,
          capacity: "14 Faculty Cabins",
          inCharge: "Staff Secretary",
          facilities: ["LAN", "Discussion Pods", "Faculty Desks"],
          notes: "Faculty cubicles and academic consultation.",
        },
        {
          id: "C-CORR-1",
          name: "Floor 1 Walkway",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Passage",
          inCharge: "Facility Staff",
          facilities: ["Water Dispenser", "Notice Boards"],
          notes: "Corridor linking drawing halls and CAD rooms.",
        },
        {
          id: "C-104",
          name: "Engineering Drawing Hall 1",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 270,
          h: 150,
          capacity: "70 Drafting Tables",
          inCharge: "Drawing Faculty",
          facilities: ["Adjustable Drafting Tables", "T-Square Racks", "Dual Boards"],
          notes: "Manual drafting and orthographic projection design sessions.",
        },
        {
          id: "C-105",
          name: "Classroom C-102",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 330,
          y: 290,
          w: 240,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Class Teacher",
          facilities: ["Projector", "Sound System"],
          notes: "3rd Year Mechanical section.",
        },
        {
          id: "C-106",
          name: "Restrooms & Student Water Station",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 590,
          y: 290,
          w: 270,
          h: 150,
          capacity: "Facilities",
          inCharge: "Maintenance Desk",
          facilities: ["RO Drinking Water", "Restroom"],
          notes: "Clean campus amenity point.",
        },
      ],
      "2nd Floor": [
        {
          id: "C-201",
          name: "Thermal Engineering & IC Engines Lab",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 40,
          y: 40,
          w: 300,
          h: 150,
          capacity: "50 Students",
          inCharge: "Prof. S. R. Rao",
          facilities: ["4-Stroke Diesel Engine Rig", "Computerized Engine Analyzer", "Exhaust Gas Sensor"],
          notes: "Heat transfer, internal combustion engines performance, and emissions testing.",
        },
        {
          id: "C-202",
          name: "Environmental Engineering Lab",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 360,
          y: 40,
          w: 260,
          h: 150,
          capacity: "45 Students",
          inCharge: "Dr. A. Verma",
          facilities: ["BOD / COD Incubators", "Turbidity Meters", "Spectrophotometer"],
          notes: "Water sample quality, air particulate assessment, and waste management.",
        },
        {
          id: "C-203",
          name: "Automotive & Electric Vehicle R&D Cell",
          type: "lab",
          color: "#f3e8ff",
          stroke: "#7c3aed",
          x: 640,
          y: 40,
          w: 220,
          h: 150,
          capacity: "35 Students",
          inCharge: "EV Project Lead",
          facilities: ["Battery Test Bench", "BLDC Motor Rig", "Telemetry Link"],
          notes: "Formula Student and Solar Vehicle development team workshop.",
        },
        {
          id: "C-CORR-2",
          name: "Floor 2 Central Walkway",
          type: "corridor",
          color: "#f1f5f9",
          stroke: "#cbd5e1",
          x: 40,
          y: 210,
          w: 820,
          h: 60,
          capacity: "Passage",
          inCharge: "Facility Staff",
          facilities: ["Emergency Fire Exit", "Water Cooler"],
          notes: "Access to upper laboratories and seminar hall.",
        },
        {
          id: "C-204",
          name: "Seminar & Project Presentation Hall",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 40,
          y: 290,
          w: 280,
          h: 150,
          capacity: "120 Seats",
          inCharge: "Seminar Coordinator",
          facilities: ["Acoustic Ceiling", "Motorized Projector Screen", "Wireless Mics"],
          notes: "Major project defense, conferences, and technical workshops.",
        },
        {
          id: "C-205",
          name: "Classroom C-201 (Final Year)",
          type: "classroom",
          color: "#e0e7ff",
          stroke: "#4338ca",
          x: 340,
          y: 290,
          w: 250,
          h: 150,
          capacity: "75 Seats",
          inCharge: "Civil Dept Coordinator",
          facilities: ["Smart Board", "Projector"],
          notes: "Final Year Civil Engineering Section A.",
        },
        {
          id: "C-206",
          name: "Surveying Equipment Vault & Records",
          type: "amenity",
          color: "#fef3c7",
          stroke: "#d97706",
          x: 610,
          y: 290,
          w: 250,
          h: 150,
          capacity: "Equipment Storage",
          inCharge: "Lab Technician",
          facilities: ["Total Stations", "Theodolites", "GPS Levelling Kits"],
          notes: "Inventory check-out and calibration room for field surveys.",
        },
      ],
    },
  },
};

function BlockDetailPage() {
  const { blockId } = useParams();
  const location = useLocation();

  // Normalize blockId from route or fallback to 'a'
  const currentKey = (blockId || "a").toLowerCase();
  const blockConfig = BLOCKS_CONFIG[currentKey] || BLOCKS_CONFIG.a;

  const [selectedFloor, setSelectedFloor] = useState("Ground Floor");
  const floorRooms = blockConfig.roomsByFloor[selectedFloor] || [];

  // Default selected room is the first interactive room
  const [selectedRoom, setSelectedRoom] = useState(
    floorRooms.find((r) => r.type !== "corridor") || floorRooms[0] || null
  );

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
    const newRooms = blockConfig.roomsByFloor[floor] || [];
    setSelectedRoom(newRooms.find((r) => r.type !== "corridor") || newRooms[0] || null);
  };

  return (
    <div className="block-detail-page">
      {/* Top Navigation */}
      <header className="block-detail-header">
        <div className="block-detail-brand">
          <div className={`brand-badge-pill ${blockConfig.themeClass}`}>
            {blockConfig.code}
          </div>
          <div>
            <strong>Campus Block {blockConfig.code} Map</strong>
            <span>Anurag University Smart Campus Map & Guide</span>
          </div>
        </div>

        <div className="header-right-actions">
          {/* Quick switcher between A, B, C */}
          <div className="block-switcher">
            <Link
              to="/block/a"
              className={`switcher-btn ${currentKey === "a" ? "active" : ""}`}
            >
              Block A
            </Link>
            <Link
              to="/block/b"
              className={`switcher-btn ${currentKey === "b" ? "active" : ""}`}
            >
              Block B
            </Link>
            <Link
              to="/block/c"
              className={`switcher-btn ${currentKey === "c" ? "active" : ""}`}
            >
              Block C
            </Link>
          </div>

          <Link to="/block-finder" className="back-link-btn">
            ← All Blocks
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="block-detail-main">
        {/* Banner with Block Info */}
        <div className={`block-banner ${blockConfig.themeClass}`}>
          <div className="banner-left">
            <span className="banner-tag">Interactive Campus Blueprint</span>
            <h1>{blockConfig.title}</h1>
            <p>{blockConfig.description}</p>
            <div className="banner-meta">
              <span className="meta-chip">🏢 {blockConfig.floors.length} Floor Levels</span>
              <span className="meta-chip">🔬 {blockConfig.stats.labs} Laboratories</span>
              <span className="meta-chip">🎓 {blockConfig.stats.classrooms} Lecture Classrooms</span>
              <span className="meta-chip">👥 {blockConfig.stats.facultyRooms} Faculty Chambers</span>
            </div>
          </div>

          <div className="banner-right-action">
            <Link
              to={`/raise-request?location=Block%20${blockConfig.code}`}
              className="action-raise-btn"
            >
              ＋ Raise Issue in Block {blockConfig.code}
            </Link>
          </div>
        </div>

        {/* Map Shell Layout */}
        <div className="map-workspace-layout">
          {/* Left Column: Interactive Map Card */}
          <div className="map-container-card">
            {/* Toolbar for Floor selection and Legend */}
            <div className="map-card-toolbar">
              <div className="floor-selector">
                <label>Floor Plan:</label>
                <div className="floor-pills">
                  {blockConfig.floors.map((floor) => (
                    <button
                      key={floor}
                      className={`floor-btn ${selectedFloor === floor ? "active" : ""}`}
                      onClick={() => handleFloorChange(floor)}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="map-legend">
                <span className="legend-item">
                  <span className="legend-dot lab" /> Labs / Workshops
                </span>
                <span className="legend-item">
                  <span className="legend-dot classroom" /> Classrooms
                </span>
                <span className="legend-item">
                  <span className="legend-dot staff" /> Faculty & Admin
                </span>
                <span className="legend-item">
                  <span className="legend-dot amenity" /> Amenities / Services
                </span>
              </div>
            </div>

            {/* Interactive SVG Floor Map */}
            <div className="map-canvas-wrapper">
              <svg
                viewBox="0 0 900 480"
                className="map-svg-canvas"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background blueprint grid pattern */}
                <defs>
                  <pattern
                    id="grid-pattern"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                    />
                  </pattern>
                </defs>

                {/* Building Base Outline */}
                <rect
                  x="20"
                  y="20"
                  width="860"
                  height="440"
                  rx="16"
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />

                <rect
                  x="20"
                  y="20"
                  width="860"
                  height="440"
                  rx="16"
                  fill="url(#grid-pattern)"
                  opacity="0.4"
                />

                {/* Render Rooms / Architectural Zones */}
                {floorRooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const isCorridor = room.type === "corridor";

                  return (
                    <g
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`room-group ${isSelected ? "selected-room" : ""}`}
                    >
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.w}
                        height={room.h}
                        rx={8}
                        fill={room.color}
                        stroke={isSelected ? "#2563eb" : room.stroke}
                        strokeWidth={isSelected ? 3.5 : 1.8}
                        className={`room-polygon ${isSelected ? "selected" : ""}`}
                        style={{
                          cursor: isCorridor ? "default" : "pointer",
                        }}
                      />

                      {/* Room Code */}
                      <text
                        x={room.x + 12}
                        y={room.y + 24}
                        fill={isSelected ? "#1d4ed8" : "#334155"}
                        fontSize="12"
                        className="room-title-text"
                      >
                        {room.id}
                      </text>

                      {/* Room Name */}
                      <text
                        x={room.x + 12}
                        y={room.y + 44}
                        fill="#0f172a"
                        fontSize={room.w > 200 ? "13" : "11"}
                        fontWeight="700"
                        className="room-title-text"
                      >
                        {room.name.length > 28 ? `${room.name.substring(0, 26)}...` : room.name}
                      </text>

                      {/* Small Capacity / Detail Label */}
                      {!isCorridor && (
                        <text
                          x={room.x + 12}
                          y={room.y + room.h - 14}
                          fill="#64748b"
                          fontSize="11"
                          className="room-sub-text"
                        >
                          {room.capacity}
                        </text>
                      )}

                      {/* Interactive Selection Ring Indicator */}
                      {isSelected && !isCorridor && (
                        <circle
                          cx={room.x + room.w - 18}
                          cy={room.y + 20}
                          r="6"
                          fill="#2563eb"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="map-hint-banner">
                <span>💡 Click on any room or facility on the blueprint map to view its details and raise location-tagged requests.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Room Details Panel */}
          <aside className="map-info-panel">
            <div className="info-card">
              <div className="info-card-header">
                <h3>Room Details & Services</h3>
                <span className="status-badge">● Active Zone</span>
              </div>

              {selectedRoom ? (
                <div className="selected-room-view">
                  <div>
                    <span className="room-code-tag">{selectedRoom.id}</span>
                    <h2>{selectedRoom.name}</h2>
                    <p className="room-desc">{selectedRoom.notes}</p>
                  </div>

                  <div className="room-attributes">
                    <div className="attr-item">
                      <span className="attr-label">Floor</span>
                      <span className="attr-val">{selectedFloor}</span>
                    </div>
                    <div className="attr-item">
                      <span className="attr-label">Capacity / Use</span>
                      <span className="attr-val">{selectedRoom.capacity}</span>
                    </div>
                    <div className="attr-item" style={{ gridColumn: "span 2" }}>
                      <span className="attr-label">In-Charge / Faculty</span>
                      <span className="attr-val">{selectedRoom.inCharge}</span>
                    </div>
                  </div>

                  {selectedRoom.facilities && (
                    <div className="facilities-list">
                      <span className="facilities-label">Key Facilities & Equipment:</span>
                      <div className="tag-cloud">
                        {selectedRoom.facilities.map((fac, idx) => (
                          <span key={idx}>{fac}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="room-actions">
                    <Link
                      to={`/raise-request?location=${encodeURIComponent(
                        `Block ${blockConfig.code} - ${selectedRoom.id} (${selectedRoom.name})`
                      )}`}
                      className="issue-button"
                    >
                      Report Issue at {selectedRoom.id} →
                    </Link>
                  </div>
                </div>
              ) : (
                <p>Select a room on the floor map to inspect details.</p>
              )}
            </div>

            <div className="quick-help-card">
              <h4>Need Emergency Help?</h4>
              <p>For urgent classroom or power supply issues in Block {blockConfig.code}:</p>
              <ul>
                <li>Campus Helpdesk: Ext 4022</li>
                <li>Electrical Maintenance: Ext 4088</li>
                <li>Network & IT Systems: Ext 4015</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default BlockDetailPage;
