// AI categorization, urgency scoring, department routing, and solution assistant

export function analyzeRequestWithAI(title = "", description = "") {
  const text = `${title} ${description}`.toLowerCase();

  let category = "General Support";
  let priority = "Medium";
  let department = "Administration";
  let confidence = 85;
  let reason = "Evaluated request text against campus service patterns.";
  let suggestedAction = "Forward request to general inquiry desk.";

  // High urgency keywords
  const highKeywords = [
    "urgent",
    "emergency",
    "fire",
    "hazard",
    "shock",
    "spark",
    "leak",
    "broken",
    "exam",
    "immediately",
    "not working",
    "power cut",
    "blackout",
    "smoke",
  ];

  let suggestedLocation = "Main Administrative Block (Block A)";
  let blockCode = "A";

  // 1. Student Services, Examinations & Fees
  if (
    text.includes("exam") ||
    text.includes("hall ticket") ||
    text.includes("marks") ||
    text.includes("memo") ||
    text.includes("grade") ||
    text.includes("cagpa") ||
    text.includes("sgpa") ||
    text.includes("revaluation") ||
    text.includes("supply") ||
    text.includes("supplementary") ||
    text.includes("backlog") ||
    text.includes("certificate") ||
    text.includes("custody") ||
    text.includes("od") ||
    text.includes("original degree") ||
    text.includes("provisional") ||
    text.includes("fee") ||
    text.includes("challan") ||
    text.includes("receipt") ||
    text.includes("dues") ||
    text.includes("scholarship") ||
    text.includes("tuition") ||
    text.includes("bus pass") ||
    text.includes("id card") ||
    text.includes("attendance") ||
    text.includes("condonation") ||
    text.includes("detention")
  ) {
    category = "Student Services";

    // Examination branch items (Block F)
    const isExamRelated =
      text.includes("exam") ||
      text.includes("hall ticket") ||
      text.includes("marks") ||
      text.includes("memo") ||
      text.includes("revaluation") ||
      text.includes("supply") ||
      text.includes("supplementary") ||
      text.includes("backlog") ||
      text.includes("grade") ||
      (text.includes("fee") && (text.includes("exam") || text.includes("supply") || text.includes("reval") || text.includes("backlog") || text.includes("hall ticket")));

    if (isExamRelated || text.includes("exam fee")) {
      department = "Examination Branch (Block F)";
      suggestedLocation = "Block F — Examination Branch (Ground Floor)";
      blockCode = "F";
      priority =
        text.includes("hall ticket") || text.includes("today") || text.includes("urgent") || text.includes("last date")
          ? "High"
          : "Medium";
      confidence = 98;
      reason = "Examination fee, marks memo, hall ticket, or evaluation issue mapped to Controller of Examinations.";
      suggestedAction =
        "Visit Examination Branch in Block F with student roll number, ID card and payment receipt/challan.";
    } else if (text.includes("fee") || text.includes("tuition") || text.includes("challan") || text.includes("receipt") || text.includes("dues") || text.includes("scholarship")) {
      department = "Accounts & Fee Section (Block A)";
      suggestedLocation = "Block A — Accounts & Fee Payment Counter (Ground Floor)";
      blockCode = "A";
      priority = text.includes("last date") || text.includes("penalty") ? "High" : "Medium";
      confidence = 96;
      reason = "College fee / tuition payment query directed to Main Accounts Section in Block A.";
      suggestedAction =
        "Verify online fee portal transaction status or consult Accounts Counter in Block A.";
    } else {
      department = "Student Affairs & Academic Section (Block A)";
      suggestedLocation = "Block A — Academic Section & Student Helpdesk";
      blockCode = "A";
      priority = "Medium";
      confidence = 94;
      reason = "Student administrative paperwork / ID card request routed to Block A Academic Section.";
      suggestedAction =
        "Submit student application to Academic Section in Block A.";
    }
  }

  // 2. Library & Books (Block G)
  else if (
    text.includes("library") ||
    text.includes("book") ||
    text.includes("journal") ||
    text.includes("borrow") ||
    text.includes("fine") ||
    text.includes("digital library") ||
    text.includes("reading room")
  ) {
    category = "Student Services";
    department = "Central Library (Block G)";
    suggestedLocation = "Block G — Anurag Central Library";
    blockCode = "G";
    priority = "Low";
    confidence = 96;
    reason = "Library book issue, digital database access or reference reading query.";
    suggestedAction =
      "Contact Library Circulation Desk at Block G Ground Floor.";
  }

  // 3. IT & Network
  else if (
    text.includes("wifi") ||
    text.includes("wi-fi") ||
    text.includes("internet") ||
    text.includes("network") ||
    text.includes("lan") ||
    text.includes("router") ||
    text.includes("login") ||
    text.includes("password") ||
    text.includes("server") ||
    text.includes("portal") ||
    text.includes("system") ||
    text.includes("computer") ||
    text.includes("software") ||
    text.includes("printer")
  ) {
    category = "IT & Network";
    department = "IT & Network Systems (Block A)";
    suggestedLocation = "Block A — Central Computer Center (1st Floor)";
    blockCode = "A";
    suggestedAction =
      "Check AP router connectivity, verify MAC address binding, and test DNS gateway response.";

    if (
      text.includes("exam") ||
      text.includes("server down") ||
      text.includes("entire block") ||
      text.includes("all systems")
    ) {
      priority = "High";
      confidence = 96;
      reason = "Detected critical digital infrastructure breakdown impacting lab/exams.";
    } else {
      priority = "Medium";
      confidence = 92;
      reason = "Detected connectivity or workstation software issue.";
    }
  }

  // 4. Electrical
  else if (
    text.includes("power") ||
    text.includes("light") ||
    text.includes("fan") ||
    text.includes("switch") ||
    text.includes("spark") ||
    text.includes("shock") ||
    text.includes("wire") ||
    text.includes("plug") ||
    text.includes("ups") ||
    text.includes("socket") ||
    text.includes("short circuit")
  ) {
    category = "Electrical";
    department = "Campus Electrical Division (Block D Substation)";
    suggestedLocation = "Block D — Electrical Maintenance Cell";
    blockCode = "D";
    suggestedAction =
      "Dispatch electrical technician with multimeter, circuit breaker check, and line test.";

    if (
      text.includes("spark") ||
      text.includes("shock") ||
      text.includes("short circuit") ||
      text.includes("smoke")
    ) {
      priority = "High";
      confidence = 98;
      reason = "Critical electrical safety hazard identified.";
    } else {
      priority = "Medium";
      confidence = 90;
      reason = "Standard classroom/lab electrical appliance fixture repair.";
    }
  }

  // 5. Maintenance & Classroom Facilities
  else if (
    text.includes("ac") ||
    text.includes("air condition") ||
    text.includes("projector") ||
    text.includes("water") ||
    text.includes("washroom") ||
    text.includes("toilet") ||
    text.includes("tap") ||
    text.includes("desk") ||
    text.includes("bench") ||
    text.includes("chair") ||
    text.includes("door") ||
    text.includes("window") ||
    text.includes("cleaning") ||
    text.includes("dust")
  ) {
    category = "Maintenance";
    department = "Campus Facilities & Housekeeping (Block C)";
    suggestedLocation = "Block C — Campus Facilities Wing";
    blockCode = "C";
    suggestedAction =
      "Assign floor housekeeping supervisor and facilities repair technician.";

    if (text.includes("leak") || text.includes("overflow") || text.includes("broken glass")) {
      priority = "High";
      confidence = 94;
      reason = "Facility damage requiring immediate containment.";
    } else {
      priority = "Medium";
      confidence = 88;
      reason = "Regular maintenance ticket for physical infrastructure.";
    }
  }

  // Priority boost if high urgency keywords present
  if (highKeywords.some((k) => text.includes(k))) {
    priority = "High";
  }

  return {
    category,
    priority,
    department,
    suggestedLocation,
    blockCode,
    confidence,
    reason,
    suggestedAction,
  };
}

export function generateSmartAdminReply(request) {
  const { title = "", category = "", location = "", user = {} } = request;
  const name = user?.name || "Student";
  const loc = location || "the specified location";

  if (category === "IT & Network") {
    return `Hello ${name}, our Network Systems team has registered your complaint regarding "${title}" at ${loc}. A campus network technician has been assigned to inspect the access point / LAN port today. Please verify connectivity shortly.`;
  }

  if (category === "Electrical") {
    return `Hello ${name}, your electrical request for "${title}" at ${loc} has been prioritized. Campus maintenance electrical technicians have been dispatched for immediate inspection.`;
  }

  if (category === "Student Services") {
    return `Hello ${name}, regarding your inquiry about "${title}", please visit the Student Services desk in Block A (Ground Floor) between 10:00 AM - 4:00 PM with your student ID for prompt assistance.`;
  }

  if (category === "Maintenance") {
    return `Hello ${name}, your facility maintenance ticket for "${title}" at ${loc} has been acknowledged. Housekeeping and campus maintenance staff have been assigned to resolve this today.`;
  }

  return `Hello ${name}, your campus support request regarding "${title}" has been reviewed by the administration. Our team is actively processing it and will resolve it at the earliest.`;
}
