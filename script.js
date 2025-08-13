// MemberHub Management JS
document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const dashboard = document.getElementById("main-dashboard");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    const addMemberBtn = document.getElementById("add-member-btn");
    const memberModal = document.getElementById("member-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const cancelFormBtn = document.getElementById("cancel-form-btn");
    const memberForm = document.getElementById("member-form");
    const membersGrid = document.getElementById("members-grid-container");

    const totalMembersCount = document.getElementById("total-members-count");
    const activeMembersCount = document.getElementById("active-members-count");
    const paymentsDueCount = document.getElementById("payments-due-count");
    const expiringMembersCount = document.getElementById("expiring-members-count");
    const totalRevenueAmount = document.getElementById("total-revenue-amount");

    const searchInput = document.getElementById("member-search-input");
    const statusFilter = document.getElementById("status-filter");
    const planFilter = document.getElementById("plan-filter");
    const paymentFilter = document.getElementById("payment-filter");
    const exportCsvBtn = document.getElementById("export-csv-btn");
    const logoutBtn = document.getElementById("logout-btn");

    let members = [];
    let editIndex = null;

    // Login Logic
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username-input").value.trim();
        const password = document.getElementById("password-input").value.trim();

        if (username === "Pratheek" && password === "Pratheek@890") {
            loginPage.classList.add("hidden");
            dashboard.classList.remove("hidden");
        } else {
            loginError.textContent = "Invalid username or password!";
        }
    });

    // Show Modal
    addMemberBtn.addEventListener("click", () => {
        memberForm.reset();
        editIndex = null;
        document.getElementById("modal-title").textContent = "Add New Member";
        memberModal.classList.remove("hidden");
    });

    // Close Modal
    [modalCloseBtn, cancelFormBtn].forEach(btn =>
        btn.addEventListener("click", () => memberModal.classList.add("hidden"))
    );

    // Save Member
    memberForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const member = {
            name: document.getElementById("member-name-input").value,
            email: document.getElementById("member-email-input").value,
            phone: document.getElementById("member-phone-input").value,
            status: document.getElementById("member-status-select").value,
            department: document.getElementById("member-department-select").value,
            plan: document.getElementById("membership-plan-select").value,
            joinDate: document.getElementById("join-date-input").value,
            expiryDate: document.getElementById("expiry-date-input").value,
            paymentStatus: document.getElementById("payment-status-select").value,
            lastPaymentDate: document.getElementById("last-payment-date-input").value,
            notes: document.getElementById("member-notes-textarea").value
        };

        if (editIndex !== null) {
            members[editIndex] = member;
        } else {
            members.push(member);
        }
        memberModal.classList.add("hidden");
        renderMembers();
    });

    // Render Members
    function renderMembers() {
        membersGrid.innerHTML = "";
        if (members.length === 0) {
            membersGrid.innerHTML = `<div class="no-members-message">No members found. Add your first member!</div>`;
            return;
        }

        members.forEach((m, index) => {
            const card = document.createElement("div");
            card.className = `member-card ${m.plan.toLowerCase()}`;
            card.innerHTML = `
                <div class="member-info">
                    <div class="member-name">${m.name}
                        <span class="membership-badge badge-${m.plan.toLowerCase()}">${m.plan}</span>
                    </div>
                    <div class="member-details">
                        <strong>Email:</strong> ${m.email} <br>
                        <strong>Phone:</strong> ${m.phone} <br>
                        <strong>Status:</strong> ${m.status} <br>
                        <strong>Department:</strong> ${m.department} <br>
                        <strong>Join Date:</strong> ${m.joinDate} <br>
                        <strong>Expiry:</strong> ${m.expiryDate} <br>
                        <span class="payment-status ${m.paymentStatus === 'Paid' ? 'payment-paid' : 'payment-due'}">${m.paymentStatus}</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn btn-secondary btn-small" onclick="editMember(${index})">✏ Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteMember(${index})">🗑 Delete</button>
                </div>
            `;
            membersGrid.appendChild(card);
        });

        updateStats();
    }

    // Update Stats
    function updateStats() {
        totalMembersCount.textContent = members.length;
        activeMembersCount.textContent = members.filter(m => m.status === "Active").length;
        paymentsDueCount.textContent = members.filter(m => m.paymentStatus === "Due").length;
        expiringMembersCount.textContent = members.filter(m => new Date(m.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000).length;
        totalRevenueAmount.textContent = "₹" + members.reduce((sum, m) => {
            const price = { Gold: 1000, Silver: 800, Bronze: 500, Basic: 250 }[m.plan] || 0;
            return sum + (m.paymentStatus === "Paid" ? price : 0);
        }, 0);
    }

    // Export CSV
    exportCsvBtn.addEventListener("click", () => {
        let csv = "Name,Email,Phone,Status,Department,Plan,Join Date,Expiry Date,Payment Status,Notes\n";
        members.forEach(m => {
            csv += `${m.name},${m.email},${m.phone},${m.status},${m.department},${m.plan},${m.joinDate},${m.expiryDate},${m.paymentStatus},${m.notes}\n`;
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "members.csv";
        link.click();
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        loginPage.classList.remove("hidden");
    });

    // Expose edit/delete globally
    window.editMember = (index) => {
        editIndex = index;
        const m = members[index];
        document.getElementById("member-name-input").value = m.name;
        document.getElementById("member-email-input").value = m.email;
        document.getElementById("member-phone-input").value = m.phone;
        document.getElementById("member-status-select").value = m.status;
        document.getElementById("member-department-select").value = m.department;
        document.getElementById("membership-plan-select").value = m.plan;
        document.getElementById("join-date-input").value = m.joinDate;
        document.getElementById("expiry-date-input").value = m.expiryDate;
        document.getElementById("payment-status-select").value = m.paymentStatus;
        document.getElementById("last-payment-date-input").value = m.lastPaymentDate;
        document.getElementById("member-notes-textarea").value = m.notes;
        document.getElementById("modal-title").textContent = "Edit Member";
        memberModal.classList.remove("hidden");
    };

    window.deleteMember = (index) => {
        if (confirm("Are you sure you want to delete this member?")) {
            members.splice(index, 1);
            renderMembers();
        }
    };
});
