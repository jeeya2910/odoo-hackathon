// ==================== MOCK DATA STORE & LOCAL STATE ====================
const State = {
  currentUser: null, // Logged in user details
  departments: [
    { id: 1, name: "Engineering", head: "Alice Chen", parent: "Operations", status: "Active" },
    { id: 2, name: "Design", head: "Bob Smith", parent: "Operations", status: "Active" },
    { id: 3, name: "HR & Admin", head: "Sarah Jenkins", parent: "Executive", status: "Active" },
    { id: 4, name: "Operations", head: "David Ross", parent: "Executive", status: "Active" }
  ],
  categories: [
    { id: 1, name: "Laptops", desc: "Corporate workstations", specField: "Warranty Period (Months)" },
    { id: 2, name: "Monitors", desc: "Office displays", specField: "Resolution" },
    { id: 3, name: "Vehicles", desc: "Company fleet transit", specField: "License Plate" },
    { id: 4, name: "Rooms", desc: "Shared boardrooms and focus hubs", specField: "Capacity" }
  ],
  employees: [
    { id: 1, name: "Alice Chen", email: "alice.chen@company.com", department: "Engineering", role: "Department Head", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob.smith@company.com", department: "Design", role: "Department Head", status: "Active" },
    { id: 3, name: "Sarah Jenkins", email: "sarah.jenkins@company.com", department: "HR & Admin", role: "Department Head", status: "Active" },
    { id: 4, name: "David Ross", email: "david.ross@company.com", department: "Operations", role: "Department Head", status: "Active" },
    { id: 5, name: "Frank Miller", email: "admin@assetflow.com", department: "HR & Admin", role: "Admin", status: "Active" },
    { id: 6, name: "Jane Doe", email: "jane.doe@company.com", department: "Operations", role: "Asset Manager", status: "Active" },
    { id: 7, name: "Mark Miller", email: "mark.m@company.com", department: "Engineering", role: "Employee", status: "Active" },
    { id: 8, name: "Leo Cruz", email: "leo.c@company.com", department: "Design", role: "Employee", status: "Active" }
  ],
  assets: [
    { id: 1, tag: "AF-0001", name: "MacBook Pro 16\"", category: "Laptops", serial: "SN-9382-A", cost: 2400, condition: "New", location: "HQ - Floor 3", status: "Allocated", bookable: false, specVal: "36" },
    { id: 2, tag: "AF-0002", name: "Dell UltraSharp 27\"", category: "Monitors", serial: "SN-4819-B", cost: 450, condition: "Good", location: "HQ - Floor 3", status: "Available", bookable: false, specVal: "4K" },
    { id: 3, tag: "AF-0003", name: "Tesla Model 3 (Fleet)", category: "Vehicles", serial: "SN-TESLA-8", cost: 42000, condition: "Good", location: "Carport Space 5", status: "Available", bookable: true, specVal: "TX-581-ABC" },
    { id: 4, tag: "AF-0004", name: "Conference Room A", category: "Rooms", serial: "RM-301", cost: 0, condition: "Good", location: "HQ - Floor 3", status: "Available", bookable: true, specVal: "12 people" },
    { id: 5, tag: "AF-0005", name: "Lenovo ThinkPad X1", category: "Laptops", serial: "SN-2831-C", cost: 1800, condition: "Fair", location: "HQ - Floor 2", status: "Under Maintenance", bookable: false, specVal: "12" }
  ],
  allocations: [
    { id: 1, assetId: 1, employeeId: 7, allocatedDate: "2026-06-01", expectedReturnDate: "2026-07-01", status: "Active" } // Overdue return (Since cur date is July 12, 2026)
  ],
  transferRequests: [
    { id: 1, assetId: 1, currentHolderId: 7, targetEmployeeId: 8, status: "Requested" }
  ],
  bookings: [
    { id: 1, resourceId: 4, employeeId: 7, date: "2026-07-14", startTime: "10:00", endTime: "12:00", status: "Upcoming" },
    { id: 2, resourceId: 3, employeeId: 8, date: "2026-07-14", startTime: "13:00", endTime: "17:00", status: "Upcoming" }
  ],
  maintenanceRequests: [
    { id: 1, assetId: 5, description: "Battery capacity dropped below 40% and keyboard backlight flickering.", priority: "Medium", status: "Technician Assigned", technician: "TechCorp Labs" }
  ],
  auditCycles: [
    { id: 1, name: "Q2 HQ Asset Audit", department: "Engineering", startDate: "2026-07-05", endDate: "2026-07-20", auditorId: 6, status: "In Progress", findings: [] }
  ],
  notifications: [
    { id: 1, text: "Asset Allocation Overdue: AF-0001 (MacBook Pro 16\") return date was 2026-07-01.", time: "10 hours ago", read: false },
    { id: 2, text: "New Transfer Request: Bob Smith requested transfer of AF-0001 to Leo Cruz.", time: "1 day ago", read: true }
  ],
  activityLogs: [
    { text: "Admin User promoted Jane Doe to Asset Manager.", time: "2026-07-11 14:32" },
    { text: "System flagged AF-0001 allocation to Mark Miller as OVERDUE.", time: "2026-07-12 00:00" },
    { text: "Employee Mark Miller booked Conference Room A for 2026-07-14.", time: "2026-07-12 09:15" }
  ]
};
// Current Month for booking calendar
let currentCalendarYear = 2026;
let currentCalendarMonth = 6; // 0-indexed, so 6 is July
// ==================== APP INITIALIZATION & ROUTING ====================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initApp();
});
function initApp() {
  // Setup defaults
  populateDropdowns();
  
  // Set default current user to Admin for direct hackathon demo comfort,
  // but they can logout and test signup/login screens as well.
  loginUser(State.employees[4]); // Frank Miller (Admin)
}
function loginUser(userObj) {
  State.currentUser = userObj;
  
  // Update App Shell User Profile Display
  document.getElementById("user-display-name").textContent = userObj.name;
  document.getElementById("user-display-role").textContent = userObj.role;
  document.getElementById("user-avatar").textContent = userObj.name.split(" ").map(n => n[0]).join("");
  document.getElementById("dashboard-welcome").textContent = `Welcome back, ${userObj.name.split(" ")[0]}!`;
  // Hide Auth, Show App Shell
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("app-shell").style.display = "grid";
  
  // Role-Based UI adjustments
  enforceRoleRestrictions();
  
  // Render views
  switchView("dashboard");
  updateKPIs();
  renderAllViews();
  
  logSystemActivity(`User ${userObj.name} logged in. Role: ${userObj.role}.`);
}
function enforceRoleRestrictions() {
  const role = State.currentUser.role;
  const orgLink = document.getElementById("nav-org-link");
  const quickRegBtn = document.getElementById("quick-register-btn");
  const btnOpenReg = document.getElementById("btn-open-register-modal");
  const btnOpenAlloc = document.getElementById("btn-open-allocate-modal");
  const btnOpenAudit = document.getElementById("btn-open-audit-modal");
  if (role === "Employee") {
    // Lock Org Setup tab completely
    orgLink.style.opacity = "0.4";
    orgLink.style.pointerEvents = "none";
    quickRegBtn.style.display = "none";
    btnOpenReg.style.display = "none";
    btnOpenAlloc.style.display = "none";
    btnOpenAudit.style.display = "none";
  } else if (role === "Department Head") {
    orgLink.style.opacity = "0.4";
    orgLink.style.pointerEvents = "none";
    quickRegBtn.style.display = "none";
    btnOpenReg.style.display = "none";
    btnOpenAlloc.style.display = "block";
    btnOpenAudit.style.display = "none";
  } else {
    // Admin & Asset Manager
    orgLink.style.opacity = "1";
    orgLink.style.pointerEvents = "auto";
    quickRegBtn.style.display = "inline-flex";
    btnOpenReg.style.display = "inline-flex";
    btnOpenAlloc.style.display = "inline-flex";
    btnOpenAudit.style.display = "inline-flex";
  }
}
function logoutUser() {
  State.currentUser = null;
  document.getElementById("app-shell").style.display = "none";
  document.getElementById("auth-container").style.display = "flex";
  switchAuthCard("login-card");
}
function switchView(viewName) {
  // Update nav menu active state
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  // Switch active section in main viewport
  document.querySelectorAll(".view-section").forEach(section => {
    if (section.id === `view-${viewName}`) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
  if (viewName === "bookings") {
    generateCalendar(currentCalendarYear, currentCalendarMonth);
  }
  
  if (viewName === "dashboard") {
    updateKPIs();
  }
}
// ==================== RENDERING LOGIC ====================
function renderAllViews() {
  renderDashboardOverdueTable();
  renderDashboardActivities();
  renderDepartmentsTable();
  renderCategoriesTable();
  renderEmployeesDirectory();
  renderAssetDirectoryTable();
  renderAllocationsTable();
  renderTransferRequests();
  renderBookingsTable();
  renderMaintenanceTable();
  renderAuditCycles();
  renderNotificationsBadge();
}
// Dashboard Lists
function renderDashboardOverdueTable() {
  const tbody = document.getElementById("overdue-returns-tbody");
  tbody.innerHTML = "";
  
  const overdueAllocations = State.allocations.filter(alloc => {
    const returnDate = new Date(alloc.expectedReturnDate);
    const currentDate = new Date("2026-07-12"); // Fixed mock current date
    return alloc.status === "Active" && returnDate < currentDate;
  });
  document.getElementById("overdue-alert-count").textContent = `${overdueAllocations.length} items`;
  document.getElementById("kpi-overdue").textContent = overdueAllocations.length;
  if (overdueAllocations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No overdue allocations. Excellent!</td></tr>`;
    return;
  }
  overdueAllocations.forEach(alloc => {
    const asset = State.assets.find(a => a.id === alloc.assetId);
    const employee = State.employees.find(e => e.id === alloc.employeeId);
    if (!asset || !employee) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--accent-rose);">${asset.tag}</td>
      <td>${asset.name}</td>
      <td>${employee.name}</td>
      <td><span style="color: var(--accent-rose); font-weight: 500;">${alloc.expectedReturnDate}</span></td>
      <td>
        <button class="btn btn-teal" style="padding: 4px 8px; font-size: 11px;" onclick="returnAssetPrompt(${alloc.id})">Mark Return</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function renderDashboardActivities() {
  const list = document.getElementById("dashboard-activity-list");
  list.innerHTML = "";
  
  // Show last 4 activity logs
  const slicedLogs = State.activityLogs.slice(-4).reverse();
  slicedLogs.forEach((log, index) => {
    const item = document.createElement("div");
    item.className = "activity-item";
    
    // Assign varying dot colors
    const colors = ["var(--primary)", "var(--accent-teal)", "var(--accent-amber)", "var(--accent-emerald)"];
    const color = colors[index % colors.length];
    item.innerHTML = `
      <div class="activity-dot" style="background-color: ${color}"></div>
      <div class="activity-content">
        <div class="activity-text">${log.text}</div>
        <div class="activity-time">${log.time}</div>
      </div>
    `;
    list.appendChild(item);
  });
}
// Org Setup: Departments
function renderDepartmentsTable() {
  const tbody = document.getElementById("departments-tbody");
  tbody.innerHTML = "";
  
  State.departments.forEach(dept => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${dept.name}</td>
      <td>${dept.head || "Unassigned"}</td>
      <td>${dept.parent || "None"}</td>
      <td><span class="badge ${dept.status === 'Active' ? 'badge-available' : 'badge-disposed'}">${dept.status}</span></td>
      <td>
        <button class="btn" style="padding: 4px 8px; font-size: 11px;" onclick="toggleDepartmentStatus(${dept.id})">
          ${dept.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Org Setup: Categories
function renderCategoriesTable() {
  const tbody = document.getElementById("categories-tbody");
  tbody.innerHTML = "";
  State.categories.forEach(cat => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${cat.name}</td>
      <td>${cat.desc}</td>
      <td><code style="color: var(--accent-teal);">${cat.specField || "None"}</code></td>
      <td>
        <button class="btn btn-rose" style="padding: 4px 8px; font-size: 11px;" onclick="deleteCategory(${cat.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Org Setup: Employees Directory
function renderEmployeesDirectory() {
  const tbody = document.getElementById("employees-tbody");
  tbody.innerHTML = "";
  State.employees.forEach(emp => {
    const tr = document.createElement("tr");
    
    // Create role selection list. Admin cannot self-demote.
    const isSelf = State.currentUser && State.currentUser.id === emp.id;
    let roleSelect = "";
    
    if (isSelf) {
      roleSelect = `<span class="badge badge-available">${emp.role} (You)</span>`;
    } else {
      roleSelect = `
        <select onchange="promoteEmployee(${emp.id}, this.value)" style="background: var(--bg-tertiary); border: 1px solid var(--glass-border); color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 13px;">
          <option value="Employee" ${emp.role === "Employee" ? "selected" : ""}>Employee</option>
          <option value="Department Head" ${emp.role === "Department Head" ? "selected" : ""}>Department Head</option>
          <option value="Asset Manager" ${emp.role === "Asset Manager" ? "selected" : ""}>Asset Manager</option>
          <option value="Admin" ${emp.role === "Admin" ? "selected" : ""}>Admin</option>
        </select>
      `;
    }
    tr.innerHTML = `
      <td style="font-weight: 600;">${emp.name}</td>
      <td>${emp.email}</td>
      <td>${emp.department}</td>
      <td><span class="user-role-badge" style="font-size: 11px;">${emp.role}</span></td>
      <td>${roleSelect}</td>
      <td><span class="badge badge-available">${emp.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}
// Asset Directory
function renderAssetDirectoryTable() {
  const tbody = document.getElementById("assets-tbody");
  tbody.innerHTML = "";
  // Get search criteria
  const query = document.getElementById("filter-search").value.toLowerCase();
  const category = document.getElementById("filter-category").value;
  const status = document.getElementById("filter-status").value;
  const location = document.getElementById("filter-location").value.toLowerCase();
  const filteredAssets = State.assets.filter(asset => {
    const matchQuery = asset.name.toLowerCase().includes(query) || 
                       asset.tag.toLowerCase().includes(query) || 
                       asset.serial.toLowerCase().includes(query);
    const matchCategory = !category || asset.category === category;
    const matchStatus = !status || asset.status === status;
    const matchLocation = !location || asset.location.toLowerCase().includes(location);
    return matchQuery && matchCategory && matchStatus && matchLocation;
  });
  if (filteredAssets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No assets found matching filters.</td></tr>`;
    return;
  }
  filteredAssets.forEach(asset => {
    const tr = document.createElement("tr");
    let actionBtns = "";
    if (asset.status === "Available") {
      actionBtns = `<button class="btn btn-teal" style="padding: 4px 8px; font-size: 11px;" onclick="openAllocateAssetModal('${asset.tag}')">Allocate</button>`;
    } else if (asset.status === "Allocated") {
      const allocation = State.allocations.find(a => a.assetId === asset.id && a.status === "Active");
      if (allocation) {
        actionBtns = `<button class="btn btn-teal" style="padding: 4px 8px; font-size: 11px;" onclick="returnAssetPrompt(${allocation.id})">Return</button>`;
      }
    } else if (asset.status === "Under Maintenance") {
      const request = State.maintenanceRequests.find(r => r.assetId === asset.id && r.status !== "Resolved");
      if (request) {
        actionBtns = `<button class="btn" style="padding: 4px 8px; font-size: 11px;" onclick="switchView('maintenance')">View Issue</button>`;
      }
    } else {
      actionBtns = `<span style="color: var(--text-muted); font-size: 12px;">Locked</span>`;
    }
    const badgeClass = `badge-${asset.status.toLowerCase().replace(" ", "-")}`;
    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--primary);">${asset.tag}</td>
      <td>${asset.name}</td>
      <td>${asset.category}</td>
      <td>${asset.location}</td>
      <td>${asset.condition}</td>
      <td><span class="badge ${badgeClass}">${asset.status}</span></td>
      <td style="text-align:center;"><i class="fa-solid ${asset.bookable ? 'fa-check text-emerald' : 'fa-xmark text-muted'}" style="color: ${asset.bookable ? 'var(--accent-emerald)' : 'var(--text-muted)'}"></i></td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${actionBtns}
          <button class="btn" style="padding: 4px 8px; font-size: 11px;" onclick="viewAssetHistory(${asset.id})" title="History Log"><i class="fa-solid fa-history"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Allocations & Transfers
function renderAllocationsTable() {
  const tbody = document.getElementById("allocations-tbody");
  tbody.innerHTML = "";
  const activeAllocations = State.allocations.filter(a => a.status === "Active");
  if (activeAllocations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No assets currently allocated to employees.</td></tr>`;
    return;
  }
  activeAllocations.forEach(alloc => {
    const asset = State.assets.find(a => a.id === alloc.assetId);
    const employee = State.employees.find(e => e.id === alloc.employeeId);
    if (!asset || !employee) return;
    // Check overdue status
    const returnDate = new Date(alloc.expectedReturnDate);
    const currentDate = new Date("2026-07-12");
    const isOverdue = returnDate < currentDate;
    tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${asset.tag}</td>
      <td>${asset.name}</td>
      <td>${employee.name}</td>
      <td><span style="color: ${isOverdue ? 'var(--accent-rose)' : 'inherit'}; font-weight: ${isOverdue ? '600' : 'normal'};">
        ${alloc.expectedReturnDate || "Indefinite"}
        ${isOverdue ? ' (OVERDUE)' : ''}
      </span></td>
      <td>${alloc.allocatedDate}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-teal" style="padding: 4px 8px; font-size: 11px;" onclick="returnAssetPrompt(${alloc.id})">Return Asset</button>
          <button class="btn" style="padding: 4px 8px; font-size: 11px;" onclick="openTransferModal(${asset.id})">Request Transfer</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function renderTransferRequests() {
  const container = document.getElementById("transfers-list-container");
  container.innerHTML = "";
  const pendingRequests = State.transferRequests.filter(r => r.status === "Requested");
  if (pendingRequests.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No pending transfer requests.</div>`;
    return;
  }
  pendingRequests.forEach(req => {
    const asset = State.assets.find(a => a.id === req.assetId);
    const holder = State.employees.find(e => e.id === req.currentHolderId);
    const target = State.employees.find(e => e.id === req.targetEmployeeId);
    if (!asset || !holder || !target) return;
    const div = document.createElement("div");
    div.className = "card";
    div.style.padding = "16px";
    div.style.border = "1px solid var(--primary-hover)";
    div.style.backgroundColor = "rgba(99, 102, 241, 0.03)";
    div.innerHTML = `
      <div style="font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 8px;">Transfer Request</div>
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">${asset.name} (${asset.tag})</div>
      <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
        Move from <strong>${holder.name}</strong> to <strong>${target.name}</strong>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px; flex-grow: 1;" onclick="approveTransfer(${req.id})">Approve</button>
        <button class="btn btn-rose" style="padding: 4px 10px; font-size: 11px; flex-grow: 1;" onclick="rejectTransfer(${req.id})">Reject</button>
      </div>
    `;
    container.appendChild(div);
  });
}
// Resource Bookings
function renderBookingsTable() {
  const tbody = document.getElementById("bookings-tbody");
  tbody.innerHTML = "";
  if (State.bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No upcoming bookings scheduled.</td></tr>`;
    return;
  }
  State.bookings.forEach(booking => {
    const asset = State.assets.find(a => a.id === booking.resourceId);
    const employee = State.employees.find(e => e.id === booking.employeeId);
    if (!asset || !employee) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${asset.name} (${asset.tag})</td>
      <td>${employee.name}</td>
      <td>${booking.date}</td>
      <td>${booking.startTime} - ${booking.endTime}</td>
      <td><span class="badge badge-reserved">${booking.status}</span></td>
      <td>
        <button class="btn btn-rose" style="padding: 4px 8px; font-size: 11px;" onclick="cancelBooking(${booking.id})">Cancel</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Maintenance requests
function renderMaintenanceTable() {
  const tbody = document.getElementById("maintenance-tbody");
  tbody.innerHTML = "";
  const activeRequests = State.maintenanceRequests.filter(r => r.status !== "Resolved");
  if (activeRequests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No active maintenance jobs. All hardware is healthy!</td></tr>`;
    return;
  }
  activeRequests.forEach(req => {
    const asset = State.assets.find(a => a.id === req.assetId);
    if (!asset) return;
    let actionBtn = "";
    if (req.status === "Pending") {
      actionBtn = `<button class="btn btn-teal" style="padding: 4px 8px; font-size: 11px;" onclick="assignTechnicianPrompt(${req.id})">Assign Tech & Approve</button>`;
    } else if (req.status === "Technician Assigned") {
      actionBtn = `<button class="btn btn-primary" style="padding: 4px 8px; font-size: 11px;" onclick="progressMaintenance(${req.id}, 'In Progress')">Start Job</button>`;
    } else if (req.status === "In Progress") {
      actionBtn = `<button class="btn btn-teal" style="padding: 4px 8px; font-size: 11px;" onclick="resolveMaintenancePrompt(${req.id})">Mark Resolved</button>`;
    }
    const priorityBadge = `badge-priority-${req.priority.toLowerCase()}`;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">REQ-${String(req.id).padStart(4, "0")}</td>
      <td style="color: var(--primary); font-weight: 500;">${asset.tag}</td>
      <td>${asset.name}</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${req.description}</td>
      <td><span class="badge ${priorityBadge}">${req.priority}</span></td>
      <td><span class="badge badge-maintenance">${req.status}</span></td>
      <td>${req.technician || "Unassigned"}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${actionBtn}
          ${req.status === "Pending" ? `<button class="btn btn-rose" style="padding: 4px 8px; font-size: 11px;" onclick="rejectMaintenance(${req.id})">Reject</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Audit Settings
function renderAuditCycles() {
  const container = document.getElementById("audit-cycles-container");
  container.innerHTML = "";
  if (State.auditCycles.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No audit cycles configured.</div>`;
    return;
  }
  State.auditCycles.forEach(cycle => {
    const lead = State.employees.find(e => e.id === cycle.auditorId);
    const div = document.createElement("div");
    
    // Status color
    const active = cycle.status === "In Progress";
    
    div.className = "card";
    div.style.padding = "16px";
    div.style.cursor = "pointer";
    div.style.border = active ? "1px solid var(--accent-purple)" : "1px solid var(--glass-border)";
    div.onclick = () => selectAuditCycleForReview(cycle.id);
    
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 600; font-size: 14px;">${cycle.name}</span>
        <span class="badge ${active ? 'badge-reserved' : 'badge-available'}">${cycle.status}</span>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">
        Scope: <strong>${cycle.department} Department</strong>
      </div>
      <div style="font-size: 11px; color: var(--text-muted);">
        Auditor: ${lead ? lead.name : "Unknown"} | Date: ${cycle.startDate} to ${cycle.endDate}
      </div>
    `;
    container.appendChild(div);
  });
}
// Notifications drawer
function renderNotificationsBadge() {
  const unreadCount = State.notifications.filter(n => !n.read).length;
  const badge = document.getElementById("notif-badge-indicator");
  
  if (unreadCount > 0) {
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}
function renderNotificationsDrawer() {
  const body = document.getElementById("notif-drawer-body");
  body.innerHTML = "";
  if (State.notifications.length === 0) {
    body.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">No active alerts.</div>`;
    return;
  }
  State.notifications.forEach(notif => {
    const div = document.createElement("div");
    div.style.padding = "14px";
    div.style.borderRadius = "8px";
    div.style.backgroundColor = notif.read ? "rgba(255, 255, 255, 0.02)" : "rgba(99, 102, 241, 0.08)";
    div.style.borderLeft = notif.read ? "2px solid transparent" : "2px solid var(--primary)";
    div.style.marginBottom = "10px";
    div.style.fontSize = "13px";
    div.style.cursor = "pointer";
    div.onclick = () => markNotificationRead(notif.id);
    div.innerHTML = `
      <div style="color: var(--text-primary); line-height: 1.4; margin-bottom: 4px;">${notif.text}</div>
      <div style="font-size: 11px; color: var(--text-muted);">${notif.time}</div>
    `;
    body.appendChild(div);
  });
}
function markNotificationRead(id) {
  const notif = State.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    renderNotificationsBadge();
    renderNotificationsDrawer();
  }
}
// ==================== CALENDAR GENERATION ====================
function generateCalendar(year, month) {
  const grid = document.getElementById("calendar-grid-element");
  
  // Clear dynamic days (retain day labels)
  const labels = grid.querySelectorAll(".calendar-day-label");
  grid.innerHTML = "";
  labels.forEach(l => grid.appendChild(l));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById("calendar-month-year").textContent = `${monthNames[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Empty slots for previous month padding
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-cell muted";
    emptyCell.innerHTML = `<span class="calendar-cell-num"></span>`;
    grid.appendChild(emptyCell);
  }
  // Selected filter resource
  const resourceFilterVal = document.getElementById("calendar-resource-filter").value;
  // Active days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    cell.onclick = () => openBookingModalForDate(cellDateStr);
    let eventHTML = "";
    
    // Find bookings on this cell day
    const dayBookings = State.bookings.filter(b => b.date === cellDateStr && b.status !== "Cancelled");
    dayBookings.forEach(booking => {
      const asset = State.assets.find(a => a.id === booking.resourceId);
      if (!asset) return;
      // Filter by resource if selected
      if (resourceFilterVal && booking.resourceId != resourceFilterVal) return;
      const eventColor = asset.category === "Rooms" ? "purple" : "cyan";
      eventHTML += `<div class="calendar-event ${eventColor}" title="${asset.name}: ${booking.startTime}-${booking.endTime}">${booking.startTime} ${asset.name}</div>`;
    });
    cell.innerHTML = `
      <span class="calendar-cell-num">${day}</span>
      <div class="calendar-events">
        ${eventHTML}
      </div>
    `;
    grid.appendChild(cell);
  }
}
// ==================== CONFLICT RULES & ENFORCEMENT ====================
// 1. ALLOCATION RULE: An asset can have at most one active allocation.
function checkAllocationConflict(assetId) {
  const assetObj = State.assets.find(a => a.id === assetId);
  if (!assetObj) return null;
  // Conflict validation: Check status or active allocation array
  if (assetObj.status === "Allocated" || assetObj.status === "Reserved" || assetObj.status === "Under Maintenance") {
    const activeAlloc = State.allocations.find(a => a.assetId === assetId && a.status === "Active");
    let holderName = "System Lock";
    let holderId = null;
    if (activeAlloc) {
      const holder = State.employees.find(e => e.id === activeAlloc.employeeId);
      if (holder) {
        holderName = holder.name;
        holderId = holder.id;
      }
    }
    return {
      assetName: assetObj.name,
      assetTag: assetObj.tag,
      holderName: holderName,
      holderId: holderId,
      status: assetObj.status
    };
  }
  return null; // Safe to allocate
}
// 2. BOOKING OVERLAP RULE: A booking for a given resource cannot overlap in time.
function checkBookingOverlap(resourceId, date, reqStart, reqEnd) {
  // Convert times to minutes for linear check
  const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const reqS = toMin(reqStart);
  const reqE = toMin(reqEnd);
  // Filter out cancelled bookings for this resource on same date
  const resourceBookings = State.bookings.filter(b => 
    b.resourceId === Number(resourceId) && 
    b.date === date && 
    b.status !== "Cancelled"
  );
  for (let booking of resourceBookings) {
    const existS = toMin(booking.startTime);
    const existE = toMin(booking.endTime);
    // Overlap math: (start1 < end2) && (start2 < end1)
    if (reqS < existE && existS < reqE) {
      const booker = State.employees.find(e => e.id === booking.employeeId);
      return {
        bookerName: booker ? booker.name : "Anonymous",
        startTime: booking.startTime,
        endTime: booking.endTime
      };
    }
  }
  return null; // Safe to book
}
// ==================== WORKFLOW OPERATIONS ====================
// Register Asset
function registerNewAsset(name, category, serial, cost, location, condition, isBookable, specValue) {
  // Auto increment tag format AF-000X
  const lastAssetId = State.assets.length > 0 ? Math.max(...State.assets.map(a => a.id)) : 0;
  const newId = lastAssetId + 1;
  const tag = `AF-${String(newId).padStart(4, "0")}`;
  const newAsset = {
    id: newId,
    tag: tag,
    name: name,
    category: category,
    serial: serial || `SN-MOCK-${newId}`,
    cost: Number(cost) || 0,
    condition: condition,
    location: location || "HQ Room 101",
    status: "Available",
    bookable: isBookable,
    specVal: specValue
  };
  State.assets.push(newAsset);
  logSystemActivity(`Registered new Asset: ${name} (${tag}). Category: ${category}.`);
  triggerNotification(`Asset ${tag} ("${name}") has been registered in the database.`);
  
  // Refresh views
  renderAssetDirectoryTable();
  populateDropdowns();
  updateKPIs();
}
// Allocate Asset
function allocateAsset(assetId, employeeId, expectedReturn) {
  const assetIdNum = Number(assetId);
  const empIdNum = Number(employeeId);
  // Check double allocation rules
  const conflict = checkAllocationConflict(assetIdNum);
  if (conflict) {
    // Show visual warning alert banner inside Modal
    const banner = document.getElementById("allocate-conflict-banner");
    const msg = document.getElementById("allocate-conflict-msg");
    msg.innerHTML = `<strong>Conflict:</strong> This asset is currently occupied. Holder: <strong>${conflict.holderName}</strong> (Status: ${conflict.status}).`;
    banner.classList.add("active");
    
    // Wire shortcut transfer btn values
    const transferBtn = document.getElementById("btn-trigger-transfer-shortcut");
    transferBtn.onclick = () => {
      closeModal("modal-allocate-asset");
      openTransferModal(assetIdNum);
    };
    return false; // Prevent submission
  }
  // Safe to allocate
  const lastAllocId = State.allocations.length > 0 ? Math.max(...State.allocations.map(a => a.id)) : 0;
  const newAlloc = {
    id: lastAllocId + 1,
    assetId: assetIdNum,
    employeeId: empIdNum,
    allocatedDate: new Date().toISOString().split("T")[0],
    expectedReturnDate: expectedReturn || "",
    status: "Active"
  };
  State.allocations.push(newAlloc);
  // Update Asset Status to Allocated
  const asset = State.assets.find(a => a.id === assetIdNum);
  if (asset) asset.status = "Allocated";
  const emp = State.employees.find(e => e.id === empIdNum);
  logSystemActivity(`Asset ${asset.tag} allocated to employee ${emp.name}.`);
  triggerNotification(`Asset ${asset.tag} issued to ${emp.name}. Return target: ${expectedReturn || "Open"}.`);
  renderAllViews();
  updateKPIs();
  return true;
}
// Return Asset Flow
function returnAssetPrompt(allocationId) {
  const notes = prompt("Enter asset condition assessment notes upon return:", "Returned in excellent condition.");
  if (notes === null) return; // cancelled
  const alloc = State.allocations.find(a => a.id === allocationId);
  if (!alloc) return;
  alloc.status = "Returned";
  
  const asset = State.assets.find(a => a.id === alloc.assetId);
  if (asset) {
    asset.status = "Available";
    asset.condition = notes.toLowerCase().includes("damage") ? "Damaged" : asset.condition;
  }
  const employee = State.employees.find(e => e.id === alloc.employeeId);
  logSystemActivity(`Asset ${asset.tag} returned by ${employee.name}. Condition notes: "${notes}".`);
  triggerNotification(`Asset return completed: ${asset.tag} returned by ${employee.name}.`);
  renderAllViews();
  updateKPIs();
}
// Transfer Request Submits
function submitTransferRequest(assetId, targetEmployeeId) {
  const assetIdNum = Number(assetId);
  const targetEmpIdNum = Number(targetEmployeeId);
  const asset = State.assets.find(a => a.id === assetIdNum);
  const target = State.employees.find(e => e.id === targetEmpIdNum);
  // Find current holder
  const activeAlloc = State.allocations.find(a => a.assetId === assetIdNum && a.status === "Active");
  if (!activeAlloc) return;
  const currentHolderId = activeAlloc.employeeId;
  const holder = State.employees.find(e => e.id === currentHolderId);
  const lastReqId = State.transferRequests.length > 0 ? Math.max(...State.transferRequests.map(r => r.id)) : 0;
  const newRequest = {
    id: lastReqId + 1,
    assetId: assetIdNum,
    currentHolderId: currentHolderId,
    targetEmployeeId: targetEmpIdNum,
    status: "Requested"
  };
  State.transferRequests.push(newRequest);
  logSystemActivity(`Transfer request filed for ${asset.tag} from ${holder.name} to ${target.name}.`);
  triggerNotification(`Transfer Requested: ${target.name} requests possession of ${asset.tag} from ${holder.name}.`);
  
  renderAllViews();
  updateKPIs();
}
// Approve Transfer
function approveTransfer(requestId) {
  const req = State.transferRequests.find(r => r.id === requestId);
  if (!req) return;
  req.status = "Approved";
  // Deactivate old allocation
  const oldAlloc = State.allocations.find(a => a.assetId === req.assetId && a.status === "Active");
  if (oldAlloc) {
    oldAlloc.status = "Transferred";
  }
  // Create new allocation
  const lastAllocId = State.allocations.length > 0 ? Math.max(...State.allocations.map(a => a.id)) : 0;
  const newAlloc = {
    id: lastAllocId + 1,
    assetId: req.assetId,
    employeeId: req.targetEmployeeId,
    allocatedDate: new Date().toISOString().split("T")[0],
    expectedReturnDate: oldAlloc ? oldAlloc.expectedReturnDate : "",
    status: "Active"
  };
  State.allocations.push(newAlloc);
  const asset = State.assets.find(a => a.id === req.assetId);
  const target = State.employees.find(e => e.id === req.targetEmployeeId);
  const sender = State.employees.find(e => e.id === req.currentHolderId);
  logSystemActivity(`Approved transfer of ${asset.tag} to ${target.name}.`);
  triggerNotification(`Transfer Approved: Asset ${asset.tag} successfully transferred from ${sender.name} to ${target.name}.`);
  renderAllViews();
}
function rejectTransfer(requestId) {
  const req = State.transferRequests.find(r => r.id === requestId);
  if (!req) return;
  req.status = "Rejected";
  triggerNotification(`Transfer request for asset id ${req.assetId} was rejected.`);
  renderAllViews();
}
// Resource Booking
function bookResource(resourceId, date, startTime, endTime) {
  const resId = Number(resourceId);
  const overlap = checkBookingOverlap(resId, date, startTime, endTime);
  if (overlap) {
    // Show validation failure
    const banner = document.getElementById("booking-conflict-banner");
    const msg = document.getElementById("booking-conflict-msg");
    msg.innerHTML = `<strong>Conflict:</strong> This time slot overlaps an existing booking. <br>Booked by: <strong>${overlap.bookerName}</strong> (${overlap.startTime} - ${overlap.endTime})`;
    banner.classList.add("active");
    return false;
  }
  // Add booking
  const lastBookingId = State.bookings.length > 0 ? Math.max(...State.bookings.map(b => b.id)) : 0;
  const newBooking = {
    id: lastBookingId + 1,
    resourceId: resId,
    employeeId: State.currentUser ? State.currentUser.id : 7, // Fallback if no user
    date: date,
    startTime: startTime,
    endTime: endTime,
    status: "Upcoming"
  };
  State.bookings.push(newBooking);
  const asset = State.assets.find(a => a.id === resId);
  const user = State.employees.find(e => e.id === newBooking.employeeId);
  logSystemActivity(`${user.name} booked resource ${asset.name} on ${date}.`);
  triggerNotification(`Booking Confirmed: ${asset.name} scheduled for ${date} @ ${startTime}-${endTime}.`);
  renderAllViews();
  if (document.getElementById("view-bookings").classList.contains("active")) {
    generateCalendar(currentCalendarYear, currentCalendarMonth);
  }
  updateKPIs();
  return true;
}
function cancelBooking(id) {
  const booking = State.bookings.find(b => b.id === id);
  if (!booking) return;
  booking.status = "Cancelled";
  const asset = State.assets.find(a => a.id === booking.resourceId);
  logSystemActivity(`Cancelled booking of resource ${asset.name} on ${booking.date}.`);
  triggerNotification(`Booking Cancelled: Schedule for ${asset.name} on ${booking.date} removed.`);
  
  renderAllViews();
  if (document.getElementById("view-bookings").classList.contains("active")) {
    generateCalendar(currentCalendarYear, currentCalendarMonth);
  }
  updateKPIs();
}
// Maintenance requests
function raiseMaintenanceRequest(assetId, desc, priority) {
  const assetIdNum = Number(assetId);
  
  const lastReqId = State.maintenanceRequests.length > 0 ? Math.max(...State.maintenanceRequests.map(r => r.id)) : 0;
  const newReq = {
    id: lastReqId + 1,
    assetId: assetIdNum,
    description: desc,
    priority: priority,
    status: "Pending",
    technician: null
  };
  State.maintenanceRequests.push(newReq);
  const asset = State.assets.find(a => a.id === assetIdNum);
  logSystemActivity(`Raised repair request for ${asset.tag}. Priority: ${priority}.`);
  triggerNotification(`Maintenance Ticket Created: ${asset.tag} reported for issue: "${desc.substring(0, 30)}...".`);
  renderAllViews();
  updateKPIs();
}
function assignTechnicianPrompt(reqId) {
  const tech = prompt("Enter name of assigned technician or service agency:", "FixIt Labs Inc.");
  if (!tech) return;
  const req = State.maintenanceRequests.find(r => r.id === reqId);
  if (!req) return;
  req.status = "Technician Assigned";
  req.technician = tech;
  // Set asset status to maintenance on approval
  const asset = State.assets.find(a => a.id === req.assetId);
  if (asset) asset.status = "Under Maintenance";
  logSystemActivity(`Approved maintenance request for ${asset.tag}. Technician assigned: ${tech}.`);
  triggerNotification(`Maintenance Approved: ${asset.tag} moved to 'Under Maintenance'. Technician: ${tech}.`);
  renderAllViews();
  updateKPIs();
}
function progressMaintenance(reqId, newStatus) {
  const req = State.maintenanceRequests.find(r => r.id === reqId);
  if (!req) return;
  req.status = newStatus;
  renderAllViews();
}
function resolveMaintenancePrompt(reqId) {
  const resolutionNotes = prompt("Enter resolution detail notes:", "Replaced battery, cleaned fan dust, verified operations.");
  if (resolutionNotes === null) return;
  const req = State.maintenanceRequests.find(r => r.id === reqId);
  if (!req) return;
  req.status = "Resolved";
  
  const asset = State.assets.find(a => a.id === req.assetId);
  if (asset) {
    asset.status = "Available";
    asset.condition = "Good";
  }
  logSystemActivity(`Maintenance ticket resolved for ${asset.tag}: "${resolutionNotes}"`);
  triggerNotification(`Maintenance Resolved: ${asset.tag} is healthy and back in 'Available' inventory.`);
  // Cleanup: Remove request from active array or mark status
  const index = State.maintenanceRequests.findIndex(r => r.id === reqId);
  if (index !== -1) {
    State.maintenanceRequests.splice(index, 1); // Remove from list of active repairs
  }
  renderAllViews();
  updateKPIs();
}
function rejectMaintenance(reqId) {
  const req = State.maintenanceRequests.find(r => r.id === reqId);
  if (!req) return;
  const index = State.maintenanceRequests.findIndex(r => r.id === reqId);
  if (index !== -1) State.maintenanceRequests.splice(index, 1);
  triggerNotification(`Maintenance request rejected.`);
  renderAllViews();
  updateKPIs();
}
// Audit Setup & Execution
function createAuditCycle(name, dept, start, end, auditorId) {
  const lastCycleId = State.auditCycles.length > 0 ? Math.max(...State.auditCycles.map(c => c.id)) : 0;
  const newCycle = {
    id: lastCycleId + 1,
    name: name,
    department: dept,
    startDate: start,
    endDate: end,
    auditorId: Number(auditorId),
    status: "In Progress",
    findings: [] // Array of { assetId, state: 'Verified' | 'Missing' | 'Damaged' }
  };
  State.auditCycles.push(newCycle);
  logSystemActivity(`Created new Audit Cycle: ${name} (Scope: ${dept} Department).`);
  triggerNotification(`Audit Cycle Commenced: "${name}" lead by auditor.`);
  renderAllViews();
}
let selectedAuditCycleId = null;
function selectAuditCycleForReview(cycleId) {
  selectedAuditCycleId = cycleId;
  const cycle = State.auditCycles.find(c => c.id === cycleId);
  if (!cycle) return;
  document.getElementById("no-active-audit-placeholder").style.display = "none";
  const panel = document.getElementById("auditor-panel");
  panel.style.display = "block";
  document.getElementById("auditor-scope-label").textContent = `${cycle.department} Scope`;
  // Render scope assets
  renderAuditingAssets(cycle);
  renderAuditDiscrepancies(cycle);
}
function renderAuditingAssets(cycle) {
  const tbody = document.getElementById("audit-assets-tbody");
  tbody.innerHTML = "";
  // Filter assets matching the department scope
  // Simple check: In mock system, check allocations of assets to employees of that department,
  // or asset category locations. Let's filter assets allocated to people in that department, 
  // plus some unallocated assets matching the scope department.
  const scopeEmployees = State.employees.filter(e => cycle.department === "All" || e.department === cycle.department);
  const scopeEmployeeIds = scopeEmployees.map(e => e.id);
  const scopeAssets = State.assets.filter(asset => {
    // If allocated, checks if allocation employee is in dept
    const alloc = State.allocations.find(a => a.assetId === asset.id && a.status === "Active");
    if (alloc) {
      return scopeEmployeeIds.includes(alloc.employeeId);
    }
    // If not allocated, check location matching department name as mock
    return cycle.department === "All" || asset.location.includes(cycle.department) || asset.id % 2 === 0;
  });
  if (scopeAssets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No assets in this department scope.</td></tr>`;
    return;
  }
  scopeAssets.forEach(asset => {
    // Find current finding for this asset if set
    const finding = cycle.findings.find(f => f.assetId === asset.id);
    const activeState = finding ? finding.state : null;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${asset.tag}</td>
      <td>${asset.name}</td>
      <td>${asset.location}</td>
      <td><span class="badge badge-${asset.status.toLowerCase().replace(" ", "-")}">${asset.status}</span></td>
      <td>
        <div style="display: flex; gap: 4px;">
          <button class="btn btn-teal" style="padding: 4px 6px; font-size: 10px; opacity: ${activeState === 'Verified' ? '1' : '0.4'}" onclick="setAuditFinding(${cycle.id}, ${asset.id}, 'Verified')">Verified</button>
          <button class="btn btn-rose" style="padding: 4px 6px; font-size: 10px; opacity: ${activeState === 'Missing' ? '1' : '0.4'}" onclick="setAuditFinding(${cycle.id}, ${asset.id}, 'Missing')">Missing</button>
          <button class="btn btn-amber" style="padding: 4px 6px; font-size: 10px; opacity: ${activeState === 'Damaged' ? '1' : '0.4'}" onclick="setAuditFinding(${cycle.id}, ${asset.id}, 'Damaged')">Damaged</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function setAuditFinding(cycleId, assetId, findingState) {
  const cycle = State.auditCycles.find(c => c.id === cycleId);
  if (!cycle) return;
  const existingFindingIndex = cycle.findings.findIndex(f => f.assetId === assetId);
  if (existingFindingIndex !== -1) {
    cycle.findings[existingFindingIndex].state = findingState;
  } else {
    cycle.findings.push({ assetId: assetId, state: findingState });
  }
  renderAuditingAssets(cycle);
  renderAuditDiscrepancies(cycle);
}
function renderAuditDiscrepancies(cycle) {
  const card = document.getElementById("audit-discrepancy-card");
  const content = document.getElementById("audit-discrepancy-content");
  // Filter missing or damaged findings
  const discrepancies = cycle.findings.filter(f => f.state === "Missing" || f.state === "Damaged");
  if (discrepancies.length === 0) {
    card.style.display = "none";
    return;
  }
  card.style.display = "block";
  content.innerHTML = "";
  discrepancies.forEach(disc => {
    const asset = State.assets.find(a => a.id === disc.assetId);
    if (!asset) return;
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.borderLeft = disc.state === "Missing" ? "3px solid var(--accent-rose)" : "3px solid var(--accent-amber)";
    div.style.backgroundColor = "rgba(255,255,255,0.01)";
    div.style.marginBottom = "8px";
    div.style.fontSize = "13px";
    div.innerHTML = `
      <div style="font-weight: 600;">${asset.name} (${asset.tag})</div>
      <div style="font-size: 11px; margin-top: 4px;">
        Finding: <span style="color: ${disc.state === 'Missing' ? 'var(--accent-rose)' : 'var(--accent-amber)'}; font-weight: 600;">${disc.state}</span>
      </div>
    `;
    content.appendChild(div);
  });
}
// Lock & Close Audit Cycle
document.getElementById("btn-close-audit-cycle").onclick = () => {
  if (!selectedAuditCycleId) return;
  const cycle = State.auditCycles.find(c => c.id === selectedAuditCycleId);
  if (!cycle) return;
  if (!confirm("Are you sure you want to close this audit cycle? This locks all findings and updates the official asset register.")) return;
  cycle.status = "Completed";
  // PROPAGATE STATUS: Set Missing assets to Lost, and Damaged assets to Under Maintenance.
  cycle.findings.forEach(finding => {
    const asset = State.assets.find(a => a.id === finding.assetId);
    if (!asset) return;
    if (finding.state === "Missing") {
      asset.status = "Lost";
      logSystemActivity(`Audit marked asset ${asset.tag} as Missing. Status flipped to LOST.`);
      triggerNotification(`Audit Discrepancy Flagged: ${asset.tag} verified MISSING during audit.`);
    } else if (finding.state === "Damaged") {
      asset.status = "Under Maintenance";
      // Auto-raise maintenance
      raiseMaintenanceRequest(asset.id, "Discovered damaged during audit cycle verification.", "Medium");
      logSystemActivity(`Audit marked asset ${asset.tag} as Damaged. Under Maintenance raised.`);
    }
  });
  selectedAuditCycleId = null;
  document.getElementById("auditor-panel").style.display = "none";
  document.getElementById("audit-discrepancy-card").style.display = "none";
  document.getElementById("no-active-audit-placeholder").style.display = "flex";
  renderAllViews();
  updateKPIs();
};
// ==================== DROPDOWNS & KPI UPDATER ====================
function updateKPIs() {
  const available = State.assets.filter(a => a.status === "Available").length;
  const allocated = State.assets.filter(a => a.status === "Allocated").length;
  const maintenance = State.assets.filter(a => a.status === "Under Maintenance").length;
  const bookings = State.bookings.filter(b => b.status === "Upcoming").length;
  const transfers = State.transferRequests.filter(t => t.status === "Requested").length;
  document.getElementById("kpi-available").textContent = available;
  document.getElementById("kpi-allocated").textContent = allocated;
  document.getElementById("kpi-maintenance").textContent = maintenance;
  document.getElementById("kpi-bookings").textContent = bookings;
  document.getElementById("kpi-transfers").textContent = transfers;
}
function populateDropdowns() {
  // 1. Categories select
  const catFilters = [document.getElementById("filter-category"), document.getElementById("asset-reg-category")];
  catFilters.forEach(select => {
    if (!select) return;
    // Retain first option
    const firstOption = select.options[0];
    select.innerHTML = "";
    if (firstOption && select.id.includes("filter")) select.appendChild(firstOption);
    
    State.categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.name;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  });
  // 2. Employees select
  const empSelects = [
    document.getElementById("dept-head"),
    document.getElementById("allocate-employee-select"),
    document.getElementById("transfer-to-employee"),
    document.getElementById("audit-auditor")
  ];
  empSelects.forEach(select => {
    if (!select) return;
    const firstOpt = select.options[0];
    select.innerHTML = "";
    if (firstOpt) select.appendChild(firstOpt);
    State.employees.forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.id;
      opt.textContent = `${emp.name} (${emp.department})`;
      select.appendChild(opt);
    });
  });
  // 3. Parent department select
  const parentDept = document.getElementById("dept-parent");
  if (parentDept) {
    parentDept.innerHTML = `<option value="">None</option>`;
    State.departments.forEach(dept => {
      const opt = document.createElement("option");
      opt.value = dept.name;
      opt.textContent = dept.name;
      parentDept.appendChild(opt);
    });
  }
  // 4. Asset Selection lists (Allocations, Maintenance, Bookings)
  const allocAssetSelect = document.getElementById("allocate-asset-select");
  if (allocAssetSelect) {
    allocAssetSelect.innerHTML = `<option value="">Select an asset...</option>`;
    State.assets.forEach(a => {
      // Show details in option
      const suffix = a.status !== "Available" ? ` [${a.status}]` : "";
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = `${a.tag} - ${a.name}${suffix}`;
      allocAssetSelect.appendChild(opt);
    });
  }
  const maintAssetSelect = document.getElementById("maintenance-asset-select");
  if (maintAssetSelect) {
    maintAssetSelect.innerHTML = `<option value="">Select asset...</option>`;
    State.assets.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = `${a.tag} - ${a.name} (${a.status})`;
      maintAssetSelect.appendChild(opt);
    });
  }
  const bookAssetSelect = document.getElementById("book-asset-select");
  const resourceFilter = document.getElementById("calendar-resource-filter");
  
  if (bookAssetSelect) {
    bookAssetSelect.innerHTML = `<option value="">Select space or equipment...</option>`;
    resourceFilter.innerHTML = `<option value="">All Shared Resources</option>`;
    State.assets.filter(a => a.bookable).forEach(a => {
      // Allocate book options
      const opt1 = document.createElement("option");
      opt1.value = a.id;
      opt1.textContent = `${a.name} (${a.location})`;
      bookAssetSelect.appendChild(opt1);
      const opt2 = document.createElement("option");
      opt2.value = a.id;
      opt2.textContent = a.name;
      resourceFilter.appendChild(opt2);
    });
  }
  // 5. Audit Scope Dept
  const auditDept = document.getElementById("audit-scope-dept");
  if (auditDept) {
    auditDept.innerHTML = `<option value="All">All Departments</option>`;
    State.departments.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = d.name;
      auditDept.appendChild(opt);
    });
  }
}
// ==================== ACTION HELPERS ====================
function logSystemActivity(text) {
  const time = new Date().toISOString().replace("T", " ").substring(0, 16);
  State.activityLogs.push({ text: text, time: time });
  renderDashboardActivities();
}
function triggerNotification(text) {
  const lastId = State.notifications.length > 0 ? Math.max(...State.notifications.map(n => n.id)) : 0;
  State.notifications.unshift({
    id: lastId + 1,
    text: text,
    time: "Just now",
    read: false
  });
  renderNotificationsBadge();
  if (document.getElementById("notification-drawer").classList.contains("active")) {
    renderNotificationsDrawer();
  }
}
function promoteEmployee(empId, newRole) {
  const emp = State.employees.find(e => e.id === empId);
  if (!emp) return;
  const oldRole = emp.role;
  emp.role = newRole;
  logSystemActivity(`Admin promoted ${emp.name} from ${oldRole} to ${newRole}.`);
  triggerNotification(`Role Change: ${emp.name} promoted to ${newRole}.`);
  // If the promoted person is currently logged in, update app shell constraints
  if (State.currentUser && State.currentUser.id === empId) {
    loginUser(emp);
  } else {
    enforceRoleRestrictions();
    renderAllViews();
  }
}
function deleteCategory(id) {
  const index = State.categories.findIndex(c => c.id === id);
  if (index !== -1) {
    const catName = State.categories[index].name;
    State.categories.splice(index, 1);
    logSystemActivity(`Category "${catName}" was deleted.`);
    renderCategoriesTable();
    populateDropdowns();
  }
}
function toggleDepartmentStatus(id) {
  const dept = State.departments.find(d => d.id === id);
  if (dept) {
    dept.status = dept.status === "Active" ? "Inactive" : "Active";
    logSystemActivity(`Flipped status of ${dept.name} department to ${dept.status}.`);
    renderDepartmentsTable();
    populateDropdowns();
  }
}
function viewAssetHistory(assetId) {
  const asset = State.assets.find(a => a.id === assetId);
  if (!asset) return;
  // Gather trace allocations, repairs
  const assetAllocations = State.allocations.filter(a => a.assetId === assetId);
  const assetRepairs = State.maintenanceRequests.filter(r => r.assetId === assetId);
  let historyStr = `Asset Lifecycle History Log for: ${asset.name} (${asset.tag})\n\n`;
  historyStr += `Current Location: ${asset.location}\n`;
  historyStr += `Current Condition: ${asset.condition}\n`;
  historyStr += `Category Spec details: ${asset.specVal || "N/A"}\n\n`;
  historyStr += `--- Allocations Trace ---\n`;
  
  if (assetAllocations.length === 0) {
    historyStr += `No allocation bookings recorded.\n`;
  } else {
    assetAllocations.forEach(a => {
      const user = State.employees.find(e => e.id === a.employeeId);
      historyStr += `- Issued to ${user ? user.name : "Unknown"} on ${a.allocatedDate} | Status: ${a.status} (Target return: ${a.expectedReturnDate || 'N/A'})\n`;
    });
  }
  historyStr += `\n--- Repair & Maintenance Trace ---\n`;
  if (assetRepairs.length === 0) {
    historyStr += `Clean record: no tickets filed.\n`;
  } else {
    assetRepairs.forEach(r => {
      historyStr += `- [${r.priority} Priority] Issue: "${r.description}" | Technician: ${r.technician || 'None Assigned'} | Status: ${r.status}\n`;
    });
  }
  alert(historyStr);
}
// ==================== EVENT LISTENERS & MODAL HANDLERS ====================
function setupEventListeners() {
  
  // View Switcher Router
  document.querySelectorAll(".nav-menu .nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const view = item.getAttribute("data-view");
      switchView(view);
    });
  });
  // Modal Open buttons
  document.getElementById("btn-open-register-modal").onclick = () => openModal("modal-register-asset");
  document.getElementById("quick-register-btn").onclick = () => openModal("modal-register-asset");
  document.getElementById("qa-register").onclick = () => openModal("modal-register-asset");
  
  document.getElementById("btn-open-allocate-modal").onclick = () => {
    // Clear old validations on opening
    document.getElementById("allocate-conflict-banner").classList.remove("active");
    openModal("modal-allocate-asset");
  };
  
  document.getElementById("btn-open-booking-modal").onclick = () => {
    document.getElementById("booking-conflict-banner").classList.remove("active");
    openModal("modal-book-resource");
  };
  document.getElementById("quick-book-btn").onclick = () => {
    document.getElementById("booking-conflict-banner").classList.remove("active");
    openModal("modal-book-resource");
  };
  document.getElementById("qa-book").onclick = () => {
    document.getElementById("booking-conflict-banner").classList.remove("active");
    openModal("modal-book-resource");
  };
  document.getElementById("btn-open-maintenance-modal").onclick = () => openModal("modal-maintenance-request");
  document.getElementById("qa-maintenance").onclick = () => openModal("modal-maintenance-request");
  
  document.getElementById("btn-open-audit-modal").onclick = () => openModal("modal-create-audit");
  // Modal Close buttons
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.getAttribute("data-close"));
  });
  // Notification side Drawer toggle
  document.getElementById("bell-btn").onclick = () => {
    document.getElementById("notification-drawer").classList.toggle("active");
    renderNotificationsDrawer();
  };
  document.getElementById("close-notif-drawer").onclick = () => {
    document.getElementById("notification-drawer").classList.remove("active");
  };
  // Auth toggle links
  document.getElementById("to-signup").onclick = (e) => {
    e.preventDefault();
    switchAuthCard("signup-card");
  };
  document.getElementById("to-login").onclick = (e) => {
    e.preventDefault();
    switchAuthCard("login-card");
  };
  document.getElementById("forgot-password").onclick = (e) => {
    e.preventDefault();
    alert("Instructions to reset your password have been routed to your registered email.");
  };
  // Logout button
  document.getElementById("btn-logout-act").onclick = logoutUser;
  // Search filter directory inputs
  document.getElementById("filter-search").oninput = renderAssetDirectoryTable;
  document.getElementById("filter-category").onchange = renderAssetDirectoryTable;
  document.getElementById("filter-status").onchange = renderAssetDirectoryTable;
  document.getElementById("filter-location").oninput = renderAssetDirectoryTable;
  
  document.getElementById("calendar-resource-filter").onchange = () => {
    generateCalendar(currentCalendarYear, currentCalendarMonth);
  };
  // Search Global matches
  document.getElementById("global-search").oninput = (e) => {
    const val = e.target.value.toLowerCase();
    if (!val) {
      renderAssetDirectoryTable();
      return;
    }
    // Auto pivot tab to assets and filter it
    switchView("assets");
    document.getElementById("filter-search").value = val;
    renderAssetDirectoryTable();
  };
  // --- SUBMISSIONS FORM ---
  // Auth Forms
  document.getElementById("login-form").onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    // Simple look up
    const user = State.employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    if (user) {
      loginUser(user);
    } else {
      alert("Employee credentials unverified in organizational roster.");
    }
  };
  document.getElementById("signup-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const dept = document.getElementById("signup-dept").value;
    
    // Check duplication
    if (State.employees.find(emp => emp.email === email)) {
      alert("An account with this email is already registered.");
      return;
    }
    const lastId = State.employees.length > 0 ? Math.max(...State.employees.map(e => e.id)) : 0;
    const newEmployee = {
      id: lastId + 1,
      name: name,
      email: email,
      department: dept,
      role: "Employee", // Self selection is locked to Employee only!
      status: "Active"
    };
    State.employees.push(newEmployee);
    logSystemActivity(`New signup: Employee ${name} created account.`);
    alert("Signup Successful! Your account is registered as Employee. Log in to access the system.");
    
    switchAuthCard("login-card");
    document.getElementById("login-email").value = email;
    populateDropdowns();
  };
  // Create Department
  document.getElementById("create-dept-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("dept-name").value;
    const headSelect = document.getElementById("dept-head");
    const headName = headSelect.options[headSelect.selectedIndex].text.split(" (")[0];
    const parent = document.getElementById("dept-parent").value;
    const lastId = State.departments.length > 0 ? Math.max(...State.departments.map(d => d.id)) : 0;
    State.departments.push({
      id: lastId + 1,
      name: name,
      head: headSelect.value ? headName : "",
      parent: parent,
      status: "Active"
    });
    logSystemActivity(`Created Department: ${name}. Head: ${headSelect.value ? headName : "Unassigned"}.`);
    document.getElementById("create-dept-form").reset();
    renderDepartmentsTable();
    populateDropdowns();
  };
  // Create Category
  document.getElementById("create-category-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("cat-name").value;
    const desc = document.getElementById("cat-desc").value;
    const specField = document.getElementById("cat-fields").value;
    const lastId = State.categories.length > 0 ? Math.max(...State.categories.map(c => c.id)) : 0;
    State.categories.push({
      id: lastId + 1,
      name: name,
      desc: desc,
      specField: specField
    });
    logSystemActivity(`Created Category: ${name}. Custom field: ${specField || "None"}.`);
    document.getElementById("create-category-form").reset();
    renderCategoriesTable();
    populateDropdowns();
  };
  // Register Asset Form
  document.getElementById("register-asset-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("asset-reg-name").value;
    const category = document.getElementById("asset-reg-category").value;
    const serial = document.getElementById("asset-reg-serial").value;
    const cost = document.getElementById("asset-reg-cost").value;
    const location = document.getElementById("asset-reg-location").value;
    const condition = document.getElementById("asset-reg-condition").value;
    const bookable = document.getElementById("asset-reg-bookable").checked;
    const specVal = document.getElementById("asset-reg-spec").value;
    registerNewAsset(name, category, serial, cost, location, condition, bookable, specVal);
    
    closeModal("modal-register-asset");
    document.getElementById("register-asset-form").reset();
  };
  // Allocate Asset Form
  document.getElementById("allocate-asset-form").onsubmit = (e) => {
    e.preventDefault();
    const assetId = document.getElementById("allocate-asset-select").value;
    const empId = document.getElementById("allocate-employee-select").value;
    const returnDate = document.getElementById("allocate-return-date").value;
    const success = allocateAsset(assetId, empId, returnDate);
    if (success) {
      closeModal("modal-allocate-asset");
      document.getElementById("allocate-asset-form").reset();
    }
  };
  // Transfer Request Form
  document.getElementById("transfer-asset-form").onsubmit = (e) => {
    e.preventDefault();
    const assetId = document.getElementById("transfer-asset-id").value;
    const toEmpId = document.getElementById("transfer-to-employee").value;
    submitTransferRequest(assetId, toEmpId);
    closeModal("modal-transfer-asset");
    document.getElementById("transfer-asset-form").reset();
  };
  // Book Resource Form
  document.getElementById("book-resource-form").onsubmit = (e) => {
    e.preventDefault();
    const resId = document.getElementById("book-asset-select").value;
    const date = document.getElementById("book-date").value;
    const start = document.getElementById("book-start-time").value;
    const end = document.getElementById("book-end-time").value;
    const success = bookResource(resId, date, start, end);
    if (success) {
      closeModal("modal-book-resource");
      document.getElementById("book-resource-form").reset();
    }
  };
  // Raise Maintenance Request Form
  document.getElementById("maintenance-request-form").onsubmit = (e) => {
    e.preventDefault();
    const assetId = document.getElementById("maintenance-asset-select").value;
    const desc = document.getElementById("maintenance-desc").value;
    const priority = document.getElementById("maintenance-priority").value;
    raiseMaintenanceRequest(assetId, desc, priority);
    closeModal("modal-maintenance-request");
    document.getElementById("maintenance-request-form").reset();
  };
  // Create Audit Cycle Form
  document.getElementById("create-audit-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("audit-cycle-name").value;
    const dept = document.getElementById("audit-scope-dept").value;
    const start = document.getElementById("audit-start").value;
    const end = document.getElementById("audit-end").value;
    const lead = document.getElementById("audit-auditor").value;
    createAuditCycle(name, dept, start, end, lead);
    closeModal("modal-create-audit");
    document.getElementById("create-audit-form").reset();
  };
  // Calendar navigations
  document.getElementById("calendar-prev-month").onclick = () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    generateCalendar(currentCalendarYear, currentCalendarMonth);
  };
  document.getElementById("calendar-next-month").onclick = () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    generateCalendar(currentCalendarYear, currentCalendarMonth);
  };
  // Org Config Sub-Tabs Switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
      // Find siblings, remove active
      const container = btn.closest(".view-section");
      container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      container.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const targetPaneId = btn.getAttribute("data-tab");
      document.getElementById(targetPaneId).classList.add("active");
    };
  });
  // Analytics Export simulation
  document.getElementById("btn-export-report").onclick = () => {
    alert("Export Pipeline Triggered: Generating consolidated inventory audit ledger. CSV and PDF exports downloaded to browser.");
    logSystemActivity("Consolidated analytics PDF report exported by Admin.");
  };
  // Quick Action triggers from Dashboard
  document.getElementById("qa-register").onclick = () => openModal("modal-register-asset");
  document.getElementById("qa-book").onclick = () => openModal("modal-book-resource");
  document.getElementById("qa-maintenance").onclick = () => openModal("modal-maintenance-request");
  document.getElementById("btn-view-all-logs").onclick = () => {
    let logsStr = "--- Consolidated AssetFlow Audit Activity Logs ---\n\n";
    State.activityLogs.forEach(l => {
      logsStr += `[${l.time}] ${l.text}\n`;
    });
    alert(logsStr);
  };
}
// --- VIEW HELPER ROUTINES ---
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}
function switchAuthCard(cardId) {
  document.getElementById("login-card").style.display = cardId === "login-card" ? "block" : "none";
  document.getElementById("signup-card").style.display = cardId === "signup-card" ? "block" : "none";
}
function openAllocateAssetModal(assetTag) {
  // Pre-fill asset select
  const select = document.getElementById("allocate-asset-select");
  const asset = State.assets.find(a => a.tag === assetTag);
  if (asset) {
    select.value = asset.id;
  }
  document.getElementById("allocate-conflict-banner").classList.remove("active");
  openModal("modal-allocate-asset");
}
function openTransferModal(assetId) {
  const asset = State.assets.find(a => a.id === assetId);
  const activeAlloc = State.allocations.find(a => a.assetId === assetId && a.status === "Active");
  if (!asset || !activeAlloc) return;
  const holder = State.employees.find(e => e.id === activeAlloc.employeeId);
  
  document.getElementById("transfer-asset-id").value = asset.id;
  document.getElementById("transfer-asset-display").value = `${asset.name} (${asset.tag})`;
  document.getElementById("transfer-holder-display").value = holder ? holder.name : "Unknown";
  openModal("modal-transfer-asset");
}
function openBookingModalForDate(dateStr) {
  document.getElementById("book-date").value = dateStr;
  document.getElementById("booking-conflict-banner").classList.remove("active");
  openModal("modal-book-resource");
}
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
:root {
  --bg-primary: #090d16;
  --bg-secondary: #111827;
  --bg-tertiary: #1f2937;
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-glow: rgba(99, 102, 241, 0.15);
  
  --accent-teal: #06b6d4;
  --accent-purple: #a855f7;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
  --accent-emerald: #10b981;
  
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  
  --glass-bg: rgba(17, 24, 39, 0.7);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-glow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  --sidebar-width: 260px;
  --header-height: 70px;
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  scrollbar-width: thin;
  scrollbar-color: var(--bg-tertiary) transparent;
}
/* Custom Scrollbars */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
*::-webkit-scrollbar-thumb {
  background-color: var(--bg-tertiary);
  border-radius: 20px;
}
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
  height: 100vh;
}
/* Auth Screens */
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 45%),
              radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.08), transparent 40%),
              var(--bg-primary);
}
.auth-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-glow);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 440px;
  animation: fadeIn 0.5s ease;
}
.auth-header {
  text-align: center;
  margin-bottom: 30px;
}
.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}
.auth-logo span {
  background: linear-gradient(135deg, var(--primary), var(--accent-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.auth-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}
/* Layout shell */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas: 
    "sidebar header"
    "sidebar main";
  height: 100vh;
}
/* Sidebar */
aside.sidebar {
  grid-area: sidebar;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 100;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 35px;
  padding-left: 8px;
}
.brand-text span {
  background: linear-gradient(135deg, var(--primary), var(--accent-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}
.nav-item a {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 12px 16px;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 15px;
  transition: var(--transition);
}
.nav-item a:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
}
.nav-item.active a {
  background: linear-gradient(135deg, var(--primary-hover), var(--primary));
  color: #fff;
  box-shadow: 0 4px 15px var(--primary-glow);
}
.sidebar-footer {
  border-top: 1px solid var(--glass-border);
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user-profile-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-purple), var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}
.user-info-text {
  max-width: 120px;
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role-badge {
  font-size: 10px;
  color: var(--accent-teal);
  background-color: rgba(6, 182, 212, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
  font-weight: 500;
  margin-top: 2px;
}
.btn-logout {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: var(--transition);
}
.btn-logout:hover {
  color: var(--accent-rose);
  background-color: rgba(244, 63, 94, 0.08);
}
/* Header */
header.app-header {
  grid-area: header;
  background-color: rgba(9, 13, 22, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 99;
}
.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 6px 14px;
  width: 320px;
}
.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  width: 100%;
  margin-left: 10px;
  font-size: 14px;
}
.search-bar input::placeholder {
  color: var(--text-muted);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.notification-bell-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: var(--transition);
}
.notification-bell-btn:hover {
  background-color: var(--bg-tertiary);
  transform: translateY(-1px);
}
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: var(--accent-rose);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
}
/* Main Content Area */
main.main-viewport {
  grid-area: main;
  padding: 30px;
  overflow-y: auto;
  background: radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.04), transparent 40%), var(--bg-primary);
}
.view-section {
  display: none;
  animation: fadeIn 0.4s ease;
}
.view-section.active {
  display: block;
}
/* General Headings */
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.view-title h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}
.view-title p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}
/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 10px 18px;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  outline: none;
}
.btn:hover {
  background-color: var(--bg-tertiary);
  transform: translateY(-1px);
}
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  border: none;
  color: #fff;
  box-shadow: 0 4px 14px var(--primary-glow);
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-hover), var(--primary));
  box-shadow: 0 6px 20px var(--primary-glow);
}
.btn-teal {
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: var(--accent-teal);
}
.btn-teal:hover {
  background: rgba(6, 182, 212, 0.25);
}
.btn-rose {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: var(--accent-rose);
}
.btn-rose:hover {
  background: rgba(244, 63, 94, 0.25);
}
/* Dashboard KPIs */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.kpi-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.kpi-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.kpi-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.kpi-icon.available { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
.kpi-icon.allocated { background: rgba(6, 182, 212, 0.1); color: var(--accent-teal); }
.kpi-icon.maintenance { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
.kpi-icon.bookings { background: rgba(168, 85, 247, 0.1); color: var(--accent-purple); }
.kpi-icon.transfers { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
.kpi-icon.returns { background: rgba(244, 63, 94, 0.1); color: var(--accent-rose); }
.kpi-details h3 {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.kpi-val {
  font-size: 26px;
  font-weight: 700;
  margin-top: 4px;
}
/* Secondary Dashboard Grid */
.dashboard-details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}
.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  padding: 24px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
}
/* Tables */
.table-container {
  overflow-x: auto;
}
table.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
table.data-table th {
  padding: 14px 16px;
  border-bottom: 1px solid var(--bg-tertiary);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
table.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--glass-border);
  color: var(--text-primary);
  font-size: 14px;
}
table.data-table tbody tr {
  transition: var(--transition);
}
table.data-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.015);
}
/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}
.form-group.full-width {
  grid-column: span 2;
}
.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}
.form-group input,
.form-group select,
.form-group textarea {
  background-color: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: var(--transition);
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-glow);
}
.form-group textarea {
  resize: vertical;
  min-height: 80px;
}
/* Quick Actions Widget */
.quick-actions-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.quick-action-btn {
  background-color: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  padding: 16px;
  text-align: center;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.quick-action-btn:hover {
  background-color: var(--bg-tertiary);
  transform: translateY(-2px);
  border-color: var(--primary);
}
.quick-action-btn i {
  font-size: 20px;
  color: var(--primary);
}
/* Badge Styles */
.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
  text-transform: uppercase;
}
.badge-available { background-color: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
.badge-allocated { background-color: rgba(6, 182, 212, 0.1); color: var(--accent-teal); }
.badge-reserved { background-color: rgba(168, 85, 247, 0.1); color: var(--accent-purple); }
.badge-maintenance { background-color: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
.badge-lost { background-color: rgba(244, 63, 94, 0.1); color: var(--accent-rose); }
.badge-retired { background-color: rgba(107, 114, 128, 0.1); color: var(--text-secondary); }
.badge-disposed { background-color: rgba(255, 255, 255, 0.05); color: var(--text-muted); }
.badge-priority-high { background-color: rgba(244, 63, 94, 0.1); color: var(--accent-rose); }
.badge-priority-medium { background-color: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
.badge-priority-low { background-color: rgba(6, 182, 212, 0.1); color: var(--accent-teal); }
.badge-verified { background-color: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
.badge-missing { background-color: rgba(244, 63, 94, 0.1); color: var(--accent-rose); }
.badge-damaged { background-color: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
/* Modals */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.modal.active {
  display: flex;
}
.modal-content {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-glow);
  width: 90%;
  max-width: 600px;
  border-radius: var(--border-radius);
  animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title {
  font-size: 18px;
  font-weight: 600;
}
.modal-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 22px;
  cursor: pointer;
  transition: var(--transition);
}
.modal-close:hover {
  color: var(--accent-rose);
}
.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.1);
}
/* Config & Tab view layouts */
.tab-container {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: 24px;
}
.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}
.tab-btn:hover {
  color: var(--text-primary);
}
.tab-btn.active {
  color: var(--primary);
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary);
}
.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
}
/* Booking Calendar Grid */
.calendar-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.calendar-header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-secondary);
  padding: 12px 20px;
  border-radius: var(--border-radius);
  border: 1px solid var(--glass-border);
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: var(--border-radius);
  border: 1px solid var(--glass-border);
}
.calendar-day-label {
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  padding-bottom: 10px;
}
.calendar-cell {
  aspect-ratio: 1.2;
  background-color: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  transition: var(--transition);
}
.calendar-cell:hover {
  background-color: rgba(255, 255, 255, 0.02);
  border-color: var(--primary);
}
.calendar-cell.muted {
  opacity: 0.3;
}
.calendar-cell-num {
  font-weight: 600;
  font-size: 14px;
}
.calendar-events {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  overflow: hidden;
}
.calendar-event {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.calendar-event.cyan { background-color: rgba(6, 182, 212, 0.15); color: var(--accent-teal); }
.calendar-event.purple { background-color: rgba(168, 85, 247, 0.15); color: var(--accent-purple); }
/* Reports SVG Chart styling */
.chart-container {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  padding: 24px;
  height: 320px;
  position: relative;
}
/* Activity Panel & Notifications */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.activity-item {
  display: flex;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--glass-border);
}
.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}
.activity-content {
  flex-grow: 1;
}
.activity-text {
  font-size: 13px;
  color: var(--text-primary);
}
.activity-time {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}
/* Conflict Banner Alert */
.alert-banner {
  background-color: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: var(--accent-rose);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  animation: shake 0.3s ease;
}
.alert-banner.active {
  display: flex;
}
/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
/* Notification Drawer Side Panel */
.notification-drawer {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background-color: var(--bg-secondary);
  border-left: 1px solid var(--glass-border);
  z-index: 1001;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}
.notification-drawer.active {
  right: 0;
}
.drawer-header {
  padding: 20px;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.drawer-body {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}
/* Responsive Overrides */
@media (max-width: 1024px) {
  .dashboard-details-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: var(--header-height) 1fr 60px;
    grid-template-areas: 
      "header"
      "main"
      "sidebar";
  }
  
  aside.sidebar {
    flex-direction: row;
    justify-content: space-around;
    padding: 0;
    align-items: center;
    border-right: none;
    border-top: 1px solid var(--glass-border);
  }
  
  .brand, .sidebar-footer {
    display: none;
  }
  
  .nav-menu {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-item a {
    padding: 10px;
    font-size: 12px;
    flex-direction: column;
    gap: 4px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  header.app-header {
    padding: 0 15px;
  }
  
  .search-bar {
    width: 180px;
  }
}
