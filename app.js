// VPSTORE PPOB - Integrated Application Logic

// Mock Product Database (Edit IDs to match Digiflazz SKU Codes)
const productsDB = {
    pulsa: {
        Telkomsel: [
            { id: "T5", name: "Telkomsel Pulsa 5.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 5250, status: "tersedia" },
            { id: "T10", name: "Telkomsel Pulsa 10.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 10250, status: "tersedia" },
            { id: "T25", name: "Telkomsel Pulsa 25.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 24900, status: "tersedia" },
            { id: "T50", name: "Telkomsel Pulsa 50.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 49450, status: "tersedia" },
            { id: "T100", name: "Telkomsel Pulsa 100.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 98100, status: "tersedia" },
            { id: "TD1", name: "Telkomsel Data 1GB / 3D", desc: "Paket Internet Telkomsel Flash Harian", price: 6500, status: "tersedia" },
            { id: "TD5", name: "Telkomsel Data 5GB / 30D", desc: "Paket Internet Telkomsel Flash Bulanan", price: 32000, status: "tersedia" }
        ],
        Indosat: [
            { id: "I5", name: "Indosat Pulsa 5.000", desc: "Pulsa Elektrik Reguler Indosat IM3", price: 5350, status: "tersedia" },
            { id: "I10", name: "Indosat Pulsa 10.000", desc: "Pulsa Elektrik Reguler Indosat IM3", price: 10300, status: "tersedia" },
            { id: "I25", name: "Indosat Pulsa 25.000", desc: "Pulsa Elektrik Reguler Indosat IM3", price: 24850, status: "tersedia" },
            { id: "I50", name: "Indosat Pulsa 50.000", desc: "Pulsa Elektrik Reguler Indosat IM3", price: 49350, status: "tersedia" },
            { id: "I100", name: "Indosat Pulsa 100.000", desc: "Pulsa Elektrik Reguler Indosat IM3", price: 97900, status: "tersedia" }
        ],
        XL: [
            { id: "X5", name: "XL Pulsa 5.000", desc: "Pulsa Elektrik Reguler XL Axiata", price: 5400, status: "tersedia" },
            { id: "X10", name: "XL Pulsa 10.000", desc: "Pulsa Elektrik Reguler XL Axiata", price: 10380, status: "tersedia" },
            { id: "X25", name: "XL Pulsa 25.000", desc: "Pulsa Elektrik Reguler XL Axiata", price: 24950, status: "tersedia" },
            { id: "X50", name: "XL Pulsa 50.000", desc: "Pulsa Elektrik Reguler XL Axiata", price: 49500, status: "tersedia" }
        ],
        Three: [
            { id: "TR5", name: "Three Pulsa 5.000", desc: "Pulsa Elektrik Reguler Tri", price: 5200, status: "tersedia" },
            { id: "TR10", name: "Three Pulsa 10.000", desc: "Pulsa Elektrik Reguler Tri", price: 10150, status: "tersedia" },
            { id: "TR25", name: "Three Pulsa 25.000", desc: "Pulsa Elektrik Reguler Tri", price: 24700, status: "tersedia" }
        ]
    },
    pln: {
        "PLN Prabayar": [
            { id: "PLN20", name: "PLN Token 20.000", desc: "Token Listrik Prabayar", price: 20200, status: "tersedia" },
            { id: "PLN50", name: "PLN Token 50.000", desc: "Token Listrik Prabayar", price: 50200, status: "tersedia" },
            { id: "PLN100", name: "PLN Token 100.000", desc: "Token Listrik Prabayar", price: 100200, status: "tersedia" }
        ]
    },
    game: {
        "Mobile Legends": [
            { id: "ML86", name: "MLBB 86 Diamonds", desc: "Top Up Instan Mobile Legends", price: 19800, status: "tersedia" },
            { id: "ML172", name: "MLBB 172 Diamonds", desc: "Top Up Instan Mobile Legends", price: 39500, status: "tersedia" },
            { id: "ML257", name: "MLBB 257 Diamonds", desc: "Top Up Instan Mobile Legends", price: 59000, status: "tersedia" }
        ],
        "Free Fire": [
            { id: "FF50", name: "FF 50 Diamonds", desc: "Top Up Instan Free Fire", price: 6800, status: "tersedia" },
            { id: "FF140", name: "FF 140 Diamonds", desc: "Top Up Instan Free Fire", price: 18700, status: "tersedia" }
        ],
        "Genshin Impact": [
            { id: "GI60", name: "Genshin 60 Crystals", desc: "Top Up Crystals via UID", price: 14500, status: "tersedia" }
        ]
    },
    emoney: {
        "DANA": [
            { id: "DN10", name: "DANA Top Up 10.000", desc: "Top Up Saldo E-Wallet DANA", price: 10400, status: "tersedia" },
            { id: "DN20", name: "DANA Top Up 20.000", desc: "Top Up Saldo E-Wallet DANA", price: 20400, status: "tersedia" }
        ],
        "GoPay": [
            { id: "GP10", name: "GoPay Top Up 10.000", desc: "Top Up Saldo E-Wallet GoPay", price: 10500, status: "tersedia" },
            { id: "GP20", name: "GoPay Top Up 20.000", desc: "Top Up Saldo E-Wallet GoPay", price: 20500, status: "tersedia" }
        ]
    }
};

// Operator Prefixes map
const operatorPrefixes = {
    "0811": "Telkomsel", "0812": "Telkomsel", "0813": "Telkomsel", "0821": "Telkomsel", "0822": "Telkomsel", "0852": "Telkomsel", "0853": "Telkomsel",
    "0856": "Indosat", "0857": "Indosat", "0858": "Indosat", "0814": "Indosat", "0815": "Indosat", "0816": "Indosat",
    "0817": "XL", "0818": "XL", "0819": "XL", "0859": "XL", "0877": "XL", "0878": "XL",
    "0895": "Three", "0896": "Three", "0897": "Three", "0898": "Three", "0899": "Three"
};

// Active State
let currentCategory = "pulsa";
let selectedProduct = null;
let currentUser = null;
let activeDepositInvoice = null;

// DOM Elements
const tabButtons = document.querySelectorAll(".tab-btn");
const destinationInput = document.getElementById("destinationNumber");
const numberLabel = document.getElementById("numberLabel");
const operatorBadge = document.getElementById("operatorBadge");
const gameIdGroup = document.getElementById("gameIdGroup");
const providerSelect = document.getElementById("providerSelect");
const productsGrid = document.getElementById("productsGrid");
const priceSearch = document.getElementById("priceSearch");
const pricingTableBody = document.getElementById("pricingTableBody");

// Auth Modal Elements
const authModal = document.getElementById("authModal");
const btnShowAuthModal = document.getElementById("btnShowAuthModal");
const closeAuthModal = document.getElementById("closeAuthModal");
const tabLoginBtn = document.getElementById("tabLoginBtn");
const tabRegisterBtn = document.getElementById("tabRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const userPortalNav = document.getElementById("userPortalNav");
const navDashLink = document.getElementById("navDashLink");

// Dashboard Elements
const memberPortalSec = document.getElementById("member-portal");
const dashUser = document.getElementById("dashUser");
const dashTier = document.getElementById("dashTier");
const dashBalance = document.getElementById("dashBalance");
const dashDiscount = document.getElementById("dashDiscount");
const btnDashLogout = document.getElementById("btnDashLogout");
const btnShowDeposit = document.getElementById("btnShowDeposit");

// Tab Controllers
const userDashTabs = document.getElementById("userDashTabs");
const adminDashTabs = document.getElementById("adminDashTabs");
const tabDashTrxHistBtn = document.getElementById("tabDashTrxHistBtn");
const tabDashDepositBtn = document.getElementById("tabDashDepositBtn");
const tabAdminSummaryBtn = document.getElementById("tabAdminSummaryBtn");
const tabAdminUsersBtn = document.getElementById("tabAdminUsersBtn");
const tabAdminTrxsBtn = document.getElementById("tabAdminTrxsBtn");
const tabAdminDepositsBtn = document.getElementById("tabAdminDepositsBtn");

const tabTrxHist = document.getElementById("tab-trx-hist");
const tabDeposit = document.getElementById("tab-deposit-tab");
const tabAdminSummary = document.getElementById("tab-admin-summary");
const tabAdminUsers = document.getElementById("tab-admin-users");
const tabAdminTrxs = document.getElementById("tab-admin-trxs");
const tabAdminDeposits = document.getElementById("tab-admin-deposits");

const dashTrxBody = document.getElementById("dashTrxBody");
const adminUsersBody = document.getElementById("adminUsersBody");
const adminTrxsBody = document.getElementById("adminTrxsBody");
const adminDepositsBody = document.getElementById("adminDepositsBody");

// Admin Stats
const adminStatUsers = document.getElementById("adminStatUsers");
const adminStatBalance = document.getElementById("adminStatBalance");
const adminStatTrxs = document.getElementById("adminStatTrxs");
const adminStatPendingDep = document.getElementById("adminStatPendingDep");

// Deposit Elements
const depAmountInput = document.getElementById("depAmount");
const depMethodSelect = document.getElementById("depMethod");
const btnRequestDeposit = document.getElementById("btnRequestDeposit");
const depInvoiceBox = document.getElementById("depInvoiceBox");
const invoiceAmountText = document.getElementById("invoiceAmount");
const invoiceCodeText = document.getElementById("invoiceCode");
const depQrisArea = document.getElementById("depQrisArea");
const depBankArea = document.getElementById("depBankArea");
const btnSimulateDepPay = document.getElementById("btnSimulateDepPay");

// Modal Checkout Elements
const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.querySelector(".close-modal");
const paymentRadios = document.querySelectorAll("input[name='payment_method']");
const qrisBox = document.getElementById("qrisDetailBox");
const bankBox = document.getElementById("bankDetailBox");
const saldoBox = document.getElementById("saldoDetailBox");
const btnCancelCheckout = document.getElementById("btnCancelCheckout");
const btnBayarSekarang = document.getElementById("btnBayarSekarang");
const simulationProgress = document.getElementById("simulationProgress");
const progressMessage = document.getElementById("progressMessage");

const summaryProduct = document.getElementById("summaryProduct");
const summaryTarget = document.getElementById("summaryTarget");
const summaryPrice = document.getElementById("summaryPrice");

// Cek Status Elements
const trxIdInput = document.getElementById("trxIdInput");
const btnCekTrx = document.getElementById("btnCekTrx");
const statusResultContainer = document.getElementById("statusResultContainer");

// Format Currency
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}

// 1. Initial Load & Setup
async function init() {
    // Check saved session
    const savedUser = localStorage.getItem("vpstore_user");
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        await syncUserProfile();
    }
    
    switchCategory("pulsa");
    populatePricingTable();
    setupEventListeners();
    updateUserPortalUI();
}

async function syncUserProfile() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/profile/${currentUser.username}`);
        const data = await res.json();
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem("vpstore_user", JSON.stringify(currentUser));
        }
    } catch (e) {
        console.error("Failed to sync profile with server", e);
    }
}

function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            switchCategory(btn.dataset.category);
        });
    });

    // Auto Detect Operator
    destinationInput.addEventListener("input", (e) => {
        const value = e.target.value;
        if (currentCategory === "pulsa") {
            detectOperator(value);
        }
    });

    providerSelect.addEventListener("change", () => {
        populateProducts();
    });

    priceSearch.addEventListener("input", (e) => {
        populatePricingTable(e.target.value);
    });

    closeModalBtn.addEventListener("click", hideModal);
    btnCancelCheckout.addEventListener("click", hideModal);

    paymentRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            document.querySelectorAll(".payment-method-card").forEach(c => c.classList.remove("active"));
            e.target.closest(".payment-method-card").classList.add("active");
            
            qrisBox.style.display = "none";
            bankBox.style.display = "none";
            saldoBox.style.display = "none";

            if (e.target.value === "qris") {
                qrisBox.style.display = "block";
            } else if (e.target.value === "tf") {
                bankBox.style.display = "block";
            } else if (e.target.value === "saldo") {
                saldoBox.style.display = "block";
            }
        });
    });

    btnBayarSekarang.addEventListener("click", startServerPayment);
    btnCekTrx.addEventListener("click", lookupTransaction);

    // AUTH EVENTS
    btnShowAuthModal.addEventListener("click", () => {
        authModal.classList.add("show");
        showAuthTab("login");
    });
    
    closeAuthModal.addEventListener("click", () => {
        authModal.classList.remove("show");
    });

    tabLoginBtn.addEventListener("click", () => showAuthTab("login"));
    tabRegisterBtn.addEventListener("click", () => showAuthTab("register"));
    loginForm.addEventListener("submit", handleLogin);
    registerForm.addEventListener("submit", handleRegister);
    btnDashLogout.addEventListener("click", logoutUser);
    
    // DEPOSIT EVENTS
    btnRequestDeposit.addEventListener("click", requestDeposit);
    btnSimulateDepPay.addEventListener("click", simulateDepositPayment);

    // DASHBOARD TAB TRIGGERS
    tabDashTrxHistBtn.addEventListener("click", () => switchDashboardTab("trx-hist"));
    tabDashDepositBtn.addEventListener("click", () => switchDashboardTab("deposit-tab"));
    
    tabAdminSummaryBtn.addEventListener("click", () => switchDashboardTab("admin-summary"));
    tabAdminUsersBtn.addEventListener("click", () => switchDashboardTab("admin-users"));
    tabAdminTrxsBtn.addEventListener("click", () => switchDashboardTab("admin-trxs"));
    tabAdminDepositsBtn.addEventListener("click", () => switchDashboardTab("admin-deposits"));

    // ADMIN ACTION EVENT
    document.getElementById("btnAdmUpdateBalance").addEventListener("click", handleAdminUpdateBalance);
}

// MEMBERSHIP & AUTH LOGIC (Server-based)
function showAuthTab(tab) {
    if (tab === "login") {
        tabLoginBtn.classList.add("active");
        tabRegisterBtn.classList.remove("active");
        loginForm.style.display = "flex";
        registerForm.style.display = "none";
    } else {
        tabLoginBtn.classList.remove("active");
        tabRegisterBtn.classList.add("active");
        loginForm.style.display = "none";
        registerForm.style.display = "flex";
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value;

    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password: pass })
        });
        const data = await res.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem("vpstore_user", JSON.stringify(currentUser));
            alert(`Selamat datang kembali, ${currentUser.name}!`);
            authModal.classList.remove("show");
            loginForm.reset();
            
            updateUserPortalUI();
            
            populateProducts();
            populatePricingTable();
        } else {
            alert(data.message || "Gagal masuk!");
        }
    } catch (err) {
        alert("Gagal menghubungi server. Pastikan server.js sedang berjalan.");
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim().toLowerCase();
    const pass = document.getElementById("regPassword").value;
    const name = document.getElementById("regName").value.trim();
    const tier = document.getElementById("regTier").value;

    if (pass.length < 4) {
        alert("Password minimal harus 4 karakter!");
        return;
    }

    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password: pass, name, tier })
        });
        const data = await res.json();

        if (data.success) {
            currentUser = data.user;
            localStorage.setItem("vpstore_user", JSON.stringify(currentUser));
            alert(`Pendaftaran berhasil! Akun Anda terdaftar sebagai ${tier.toUpperCase()}.\nSaldo demo awal telah ditambahkan.`);
            authModal.classList.remove("show");
            registerForm.reset();

            updateUserPortalUI();
            
            populateProducts();
            populatePricingTable();
        } else {
            alert(data.message || "Pendaftaran gagal!");
        }
    } catch (err) {
        alert("Gagal mendaftar. Koneksi server error.");
    }
}

function logoutUser() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
        currentUser = null;
        localStorage.removeItem("vpstore_user");
        updateUserPortalUI();
        
        depInvoiceBox.style.display = "none";
        depAmountInput.value = "";
        activeDepositInvoice = null;
        
        populateProducts();
        populatePricingTable();
        alert("Anda telah logout.");
    }
}

function updateUserPortalUI() {
    if (currentUser) {
        userPortalNav.innerHTML = `
            <div class="user-badge-nav">
                <span class="user-nav-name"><i class="fa-solid fa-user-tie"></i> ${currentUser.username}</span>
                <span class="user-nav-tier ${currentUser.tier}">${currentUser.tier.toUpperCase()}</span>
                <span class="user-nav-balance" id="navUserBalance">${formatRupiah(currentUser.balance)}</span>
                <button class="btn-logout-nav" id="btnNavbarLogout" title="Logout Portal"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        `;
        document.getElementById("btnNavbarLogout").addEventListener("click", logoutUser);
        navDashLink.style.display = "inline-block";
        memberPortalSec.style.display = "block";
        
        // Show/hide Admin dashboard views
        if (currentUser.tier === 'admin') {
            userDashTabs.style.display = "none";
            adminDashTabs.style.display = "flex";
            switchDashboardTab("admin-summary");
        } else {
            userDashTabs.style.display = "flex";
            adminDashTabs.style.display = "none";
            switchDashboardTab("trx-hist");
        }

        updateDashboardUI();
        
        // Saldo check setup in Checkout
        document.getElementById("saldoPaymentCard").style.opacity = "1";
        document.getElementById("radioPaymentSaldo").disabled = false;
        document.getElementById("saldoPaymentBadge").textContent = `(${formatRupiah(currentUser.balance)})`;
    } else {
        userPortalNav.innerHTML = `
            <button class="btn-login-nav" id="btnShowAuthModal"><i class="fa-solid fa-user-lock"></i> Login / Daftar</button>
        `;
        document.getElementById("btnShowAuthModal").addEventListener("click", () => {
            authModal.classList.add("show");
            showAuthTab("login");
        });
        
        navDashLink.style.display = "none";
        memberPortalSec.style.display = "none";
        
        document.getElementById("saldoPaymentCard").style.opacity = "0.5";
        const radioSaldo = document.getElementById("radioPaymentSaldo");
        radioSaldo.disabled = true;
        radioSaldo.checked = false;
        document.getElementById("saldoPaymentBadge").textContent = "(Belum Login)";
    }
}

async function updateDashboardUI() {
    if (!currentUser) return;

    dashUser.textContent = currentUser.name;
    dashTier.className = `user-tier-badge ${currentUser.tier}`;
    dashTier.textContent = currentUser.tier.toUpperCase();
    dashBalance.textContent = formatRupiah(currentUser.balance);
    dashDiscount.textContent = `${formatRupiah(currentUser.discount)} / Transaksi`;

    if (currentUser.tier === 'admin') {
        await loadAdminData();
    } else {
        await loadUserTrxHistory();
    }
}

function switchDashboardTab(tab) {
    // Hide all contents
    tabTrxHist.style.display = "none";
    tabDeposit.style.display = "none";
    tabAdminSummary.style.display = "none";
    tabAdminUsers.style.display = "none";
    tabAdminTrxs.style.display = "none";
    tabAdminDeposits.style.display = "none";

    // Deactivate all tab buttons
    document.querySelectorAll(".dash-tab-btn").forEach(b => b.classList.remove("active"));

    // Activate selected tab
    if (tab === "trx-hist") {
        tabDashTrxHistBtn.classList.add("active");
        tabTrxHist.style.display = "block";
        loadUserTrxHistory();
    } else if (tab === "deposit-tab") {
        tabDashDepositBtn.classList.add("active");
        tabDeposit.style.display = "block";
    } else if (tab === "admin-summary") {
        tabAdminSummaryBtn.classList.add("active");
        tabAdminSummary.style.display = "block";
        loadAdminData();
    } else if (tab === "admin-users") {
        tabAdminUsersBtn.classList.add("active");
        tabAdminUsers.style.display = "block";
        loadAdminUsers();
    } else if (tab === "admin-trxs") {
        tabAdminTrxsBtn.classList.add("active");
        tabAdminTrxs.style.display = "block";
        loadAdminTransactions();
    } else if (tab === "admin-deposits") {
        tabAdminDepositsBtn.classList.add("active");
        tabAdminDeposits.style.display = "block";
        loadAdminDeposits();
    }
}

// CLIENT-SIDE ADMIN FUNCTIONS
async function loadAdminData() {
    try {
        const res = await fetch("/api/admin/summary", {
            headers: { "x-admin-user": currentUser.username }
        });
        const data = await res.json();
        if (data.success) {
            adminStatUsers.textContent = data.summary.totalUsers;
            adminStatBalance.textContent = formatRupiah(data.summary.totalBalance);
            adminStatTrxs.textContent = data.summary.totalTransactions;
            adminStatPendingDep.textContent = data.summary.pendingDeposits;
        }
    } catch (e) {
        console.error("Admin stats fetch error", e);
    }
}

async function loadAdminUsers() {
    try {
        const res = await fetch("/api/admin/users", {
            headers: { "x-admin-user": currentUser.username }
        });
        const data = await res.json();
        if (data.success) {
            adminUsersBody.innerHTML = "";
            data.users.forEach(u => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${u.username}</strong></td>
                    <td>${u.name}</td>
                    <td><span class="user-tier-badge ${u.tier}">${u.tier.toUpperCase()}</span></td>
                    <td class="text-success font-bold">${formatRupiah(u.balance)}</td>
                `;
                adminUsersBody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Admin users load failed", e);
    }
}

async function handleAdminUpdateBalance() {
    const targetUsername = document.getElementById("admTargetUser").value.trim();
    const action = document.getElementById("admAction").value;
    const amount = document.getElementById("admAmount").value;

    if (!targetUsername || !amount) {
        alert("Lengkapi input terlebih dahulu!");
        return;
    }

    try {
        const res = await fetch("/api/admin/users/balance", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            },
            body: JSON.stringify({ targetUsername, action, amount })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            document.getElementById("admTargetUser").value = "";
            document.getElementById("admAmount").value = "";
            loadAdminUsers();
            loadAdminData();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Gagal memproses saldo.");
    }
}

async function loadAdminTransactions() {
    try {
        const res = await fetch("/api/admin/transactions", {
            headers: { "x-admin-user": currentUser.username }
        });
        const data = await res.json();
        if (data.success) {
            adminTrxsBody.innerHTML = "";
            if (data.transactions.length === 0) {
                adminTrxsBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada transaksi.</td></tr>';
                return;
            }
            data.transactions.forEach(t => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${t.trxId}</strong></td>
                    <td>${t.username}</td>
                    <td>${t.product}</td>
                    <td>${t.target}</td>
                    <td>${formatRupiah(t.price)}</td>
                    <td>
                        <span class="status-badge ${t.status}">${t.status.toUpperCase()}</span>
                        <div style="font-size: 10px; color: var(--text-muted); margin-top:4px;">SN: ${t.sn}</div>
                    </td>
                `;
                adminTrxsBody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Load admin transactions failed", e);
    }
}

async function loadAdminDeposits() {
    try {
        const res = await fetch("/api/admin/deposits", {
            headers: { "x-admin-user": currentUser.username }
        });
        const data = await res.json();
        if (data.success) {
            adminDepositsBody.innerHTML = "";
            if (data.deposits.length === 0) {
                adminDepositsBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada deposit.</td></tr>';
                return;
            }
            data.deposits.forEach(d => {
                const tr = document.createElement("tr");
                const actionBtn = d.status === 'pending' 
                    ? `<button class="btn btn-primary btn-small" onclick="approveDeposit('${d.depositId}')"><i class="fa-solid fa-check"></i> Setujui</button>`
                    : '-';
                tr.innerHTML = `
                    <td><strong>${d.depositId}</strong></td>
                    <td>${d.username}</td>
                    <td>${d.method.toUpperCase()}</td>
                    <td class="text-success font-bold">${formatRupiah(d.total)}</td>
                    <td><span class="status-badge ${d.status}">${d.status.toUpperCase()}</span></td>
                    <td>${actionBtn}</td>
                `;
                adminDepositsBody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Load admin deposits failed", e);
    }
}

window.approveDeposit = async function(depositId) {
    if (!confirm(`Setujui request deposit ${depositId}? Saldo akan langsung dikreditkan.`)) return;
    try {
        const res = await fetch("/api/admin/deposits/approve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            },
            body: JSON.stringify({ depositId })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            loadAdminDeposits();
            loadAdminData();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Gagal menyetujui deposit.");
    }
};

// DEPOSIT SIMULATION (Server-backed)
async function requestDeposit() {
    const amount = parseInt(depAmountInput.value);
    if (isNaN(amount) || amount < 10000) {
        alert("Nominal deposit minimal adalah Rp 10.000!");
        depAmountInput.focus();
        return;
    }

    try {
        const res = await fetch("/api/user/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: currentUser.username,
                amount,
                method: depMethodSelect.value
            })
        });
        const data = await res.json();
        if (data.success) {
            activeDepositInvoice = data.deposit;
            
            depInvoiceBox.style.display = "flex";
            invoiceAmountText.textContent = formatRupiah(activeDepositInvoice.total);
            invoiceCodeText.textContent = `+Rp ${activeDepositInvoice.code} (Kode Unik)`;

            if (depMethodSelect.value === "qris") {
                depQrisArea.style.display = "flex";
                depBankArea.style.display = "none";
            } else {
                depQrisArea.style.display = "none";
                depBankArea.style.display = "block";
            }
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Gagal membuat request deposit.");
    }
}

async function simulateDepositPayment() {
    if (!activeDepositInvoice || !currentUser) return;

    btnSimulateDepPay.disabled = true;
    btnSimulateDepPay.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses Pembayaran...';

    try {
        const res = await fetch("/api/user/deposit/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ depositId: activeDepositInvoice.depositId })
        });
        const data = await res.json();
        
        if (data.success) {
            // Update local user object balance
            currentUser.balance = data.balance;
            localStorage.setItem("vpstore_user", JSON.stringify(currentUser));
            
            alert(`Deposit Sukses!\nSaldo sebesar ${formatRupiah(activeDepositInvoice.total)} telah berhasil ditambahkan.`);
            
            depInvoiceBox.style.display = "none";
            depAmountInput.value = "";
            activeDepositInvoice = null;

            updateUserPortalUI();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Simulasi pembayaran deposit gagal.");
    } finally {
        btnSimulateDepPay.disabled = false;
        btnSimulateDepPay.innerHTML = '<i class="fa-solid fa-check-double"></i> Konfirmasi Bayar (Simulasi)';
    }
}

async function loadUserTrxHistory() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/transaksi/history/${currentUser.username}`);
        const data = await res.json();
        if (data.success) {
            dashTrxBody.innerHTML = "";
            if (data.transactions.length === 0) {
                dashTrxBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted" style="padding: 24px;">Belum ada transaksi. Silakan pilih produk di bawah.</td>
                    </tr>
                `;
                return;
            }
            data.transactions.forEach(trx => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${trx.trxId}</strong></td>
                    <td>${trx.date.split(" ")[0]}</td>
                    <td>${trx.product}</td>
                    <td>${trx.target}</td>
                    <td><span class="text-success">${formatRupiah(trx.price)}</span></td>
                    <td><span class="status-badge ${trx.status}">${trx.status.toUpperCase()}</span></td>
                `;
                dashTrxBody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Gagal memuat history transaksi user", e);
    }
}

// 2. Switch Category
function switchCategory(category) {
    currentCategory = category;
    selectedProduct = null;
    productsGrid.innerHTML = "";
    
    destinationInput.value = "";
    operatorBadge.style.opacity = "0";

    if (category === "pulsa") {
        numberLabel.innerHTML = '<i class="fa-solid fa-phone"></i> Nomor Handphone Tujuan';
        destinationInput.placeholder = "Contoh: 081234567890";
        gameIdGroup.style.display = "none";
        providerSelect.disabled = false;
        populateProviders(Object.keys(productsDB.pulsa));
    } else if (category === "pln") {
        numberLabel.innerHTML = '<i class="fa-solid fa-bolt-lightning"></i> Nomor Meter / ID Pelanggan';
        destinationInput.placeholder = "Contoh: 14092831029";
        gameIdGroup.style.display = "none";
        providerSelect.disabled = true;
        populateProviders(["PLN Prabayar"]);
    } else if (category === "game") {
        numberLabel.innerHTML = '<i class="fa-solid fa-id-card"></i> User ID Game';
        destinationInput.placeholder = "Contoh: 849283120";
        gameIdGroup.style.display = "block";
        providerSelect.disabled = false;
        populateProviders(Object.keys(productsDB.game));
    } else if (category === "emoney") {
        numberLabel.innerHTML = '<i class="fa-solid fa-wallet"></i> Nomor HP Terdaftar E-Money';
        destinationInput.placeholder = "Contoh: 081234567890";
        gameIdGroup.style.display = "none";
        providerSelect.disabled = false;
        populateProviders(Object.keys(productsDB.emoney));
    }

    populateProducts();
}

function populateProviders(providers) {
    providerSelect.innerHTML = "";
    providers.forEach(prov => {
        const opt = document.createElement("option");
        opt.value = prov;
        opt.textContent = prov;
        providerSelect.appendChild(opt);
    });
}

// 3. Auto Operator Detection
function detectOperator(number) {
    if (number.length >= 4) {
        const prefix = number.substring(0, 4);
        const operatorName = operatorPrefixes[prefix];
        
        if (operatorName) {
            operatorBadge.textContent = operatorName;
            operatorBadge.style.opacity = "1";
            
            if (providerSelect.value !== operatorName) {
                providerSelect.value = operatorName;
                populateProducts();
            }
        } else {
            operatorBadge.style.opacity = "0";
        }
    } else {
        operatorBadge.style.opacity = "0";
    }
}

// 4. Populate Products Cards
function populateProducts() {
    productsGrid.innerHTML = "";
    const activeProvider = providerSelect.value;
    if (!activeProvider) return;

    const products = productsDB[currentCategory][activeProvider];
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<p class="text-muted text-center" style="grid-column: span 2;">Produk tidak tersedia untuk operator ini.</p>';
        return;
    }

    products.forEach(prod => {
        const discountAmount = currentUser ? currentUser.discount : 0;
        const finalPrice = prod.price - discountAmount;

        const card = document.createElement("div");
        card.className = "product-card";
        
        let priceHtml = "";
        if (discountAmount > 0) {
            priceHtml = `
                <div class="product-price">
                    <span style="text-decoration: line-through; opacity: 0.5; font-size: 11px; margin-right: 5px; color: var(--text-muted); font-weight: normal;">${formatRupiah(prod.price)}</span>
                    <span>${formatRupiah(finalPrice)}</span>
                </div>
            `;
        } else {
            priceHtml = `<div class="product-price">${formatRupiah(prod.price)}</div>`;
        }

        card.innerHTML = `
            <div>
                <div class="product-title">${prod.name}</div>
                <div class="product-desc">${prod.desc}</div>
            </div>
            ${priceHtml}
        `;

        card.addEventListener("click", () => {
            if (destinationInput.value.trim() === "") {
                alert("Harap isi Nomor Tujuan / ID Pelanggan terlebih dahulu!");
                destinationInput.focus();
                return;
            }
            if (currentCategory === "game" && document.getElementById("gameZoneId").value.trim() === "") {
                alert("Harap isi Server / Zone ID game!");
                document.getElementById("gameZoneId").focus();
                return;
            }

            document.querySelectorAll(".product-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedProduct = {
                ...prod,
                finalPrice: finalPrice
            };

            showCheckoutModal();
        });

        productsGrid.appendChild(card);
    });
}

// 5. Populate Pricing Table (Searchable)
function populatePricingTable(query = "") {
    pricingTableBody.innerHTML = "";
    const lowerQuery = query.toLowerCase();

    for (const catKey in productsDB) {
        for (const providerKey in productsDB[catKey]) {
            const list = productsDB[catKey][providerKey];
            list.forEach(prod => {
                if (query === "" || prod.name.toLowerCase().includes(lowerQuery) || providerKey.toLowerCase().includes(lowerQuery)) {
                    const discountAmount = currentUser ? currentUser.discount : 0;
                    const finalPrice = prod.price - discountAmount;
                    
                    let priceHtml = "";
                    if (discountAmount > 0) {
                        priceHtml = `<span style="text-decoration: line-through; opacity: 0.5; font-size: 11px; margin-right: 6px; color: var(--text-muted); font-weight: normal;">${formatRupiah(prod.price)}</span> <span style="color: var(--primary); font-weight: bold;">${formatRupiah(finalPrice)}</span>`;
                    } else {
                        priceHtml = `<span style="color: var(--primary); font-weight: bold;">${formatRupiah(prod.price)}</span>`;
                    }

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${catKey.toUpperCase()}</td>
                        <td>${prod.name}</td>
                        <td>${priceHtml}</td>
                        <td><span class="status-badge ${prod.status}">${prod.status.toUpperCase()}</span></td>
                    `;
                    pricingTableBody.appendChild(tr);
                }
            });
        }
    }

    if (pricingTableBody.innerHTML === "") {
        pricingTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Produk tidak ditemukan.</td></tr>';
    }
}

// 6. Checkout Modal Setup
function showCheckoutModal() {
    if (!selectedProduct) return;
    
    summaryProduct.textContent = selectedProduct.name;
    
    let target = destinationInput.value;
    if (currentCategory === "game") {
        target += ` (${document.getElementById("gameZoneId").value})`;
    }
    summaryTarget.textContent = target;
    
    const finalPrice = selectedProduct.finalPrice !== undefined ? selectedProduct.finalPrice : selectedProduct.price;
    summaryPrice.textContent = formatRupiah(finalPrice);

    if (currentUser) {
        document.getElementById("checkoutUserBalance").textContent = formatRupiah(currentUser.balance);
        document.getElementById("checkoutTotalBill").textContent = formatRupiah(finalPrice);
        
        const hintEl = document.getElementById("checkoutSaldoHint");
        const radioSaldo = document.getElementById("radioPaymentSaldo");
        
        if (currentUser.balance >= finalPrice) {
            hintEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Saldo mencukupi. Klik konfirmasi untuk memproses instan.';
            hintEl.style.color = "var(--success)";
            radioSaldo.disabled = false;
        } else {
            hintEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Saldo tidak mencukupi. Silakan pilih metode pembayaran lain atau isi saldo.';
            hintEl.style.color = "var(--danger)";
            radioSaldo.disabled = true;
            radioSaldo.checked = false;
            
            if (document.querySelector("input[name='payment_method']:checked").value === "saldo") {
                document.querySelector("input[name='payment_method'][value='qris']").checked = true;
                qrisBox.style.display = "block";
                saldoBox.style.display = "none";
                document.querySelectorAll(".payment-method-card").forEach(c => c.classList.remove("active"));
                document.querySelector(".payment-method-card").classList.add("active");
            }
        }
    }

    simulationProgress.style.display = "none";
    btnBayarSekarang.style.display = "block";
    btnCancelCheckout.style.display = "block";
    document.querySelectorAll(".step").forEach(s => s.className = "step");
    document.getElementById("step1").className = "step active";

    checkoutModal.classList.add("show");
}

function hideModal() {
    checkoutModal.classList.remove("show");
    document.querySelectorAll(".product-card").forEach(c => c.classList.remove("selected"));
    selectedProduct = null;
}

// 7. REAL SERVER PAYMENT WITH DIGIFLAZZ INTEGRATION
async function startServerPayment() {
    const paymentMethod = document.querySelector("input[name='payment_method']:checked").value;
    const finalPrice = selectedProduct.finalPrice !== undefined ? selectedProduct.finalPrice : selectedProduct.price;

    if (paymentMethod === "saldo") {
        if (!currentUser) {
            alert("Harap login terlebih dahulu!");
            return;
        }
        if (currentUser.balance < finalPrice && currentUser.tier !== 'admin') {
            alert("Saldo Anda tidak mencukupi!");
            return;
        }
    }

    btnBayarSekarang.style.display = "none";
    btnCancelCheckout.style.display = "none";
    simulationProgress.style.display = "block";

    // Step 1: Verification
    progressMessage.textContent = paymentMethod === "saldo" ? "Memverifikasi Saldo..." : "Menghubungkan ke Pembayaran...";
    
    try {
        // Delay visual 1s
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        document.getElementById("step1").className = "step completed";
        document.getElementById("step2").className = "step active";
        document.getElementById("step2").querySelector(".step-num").innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        
        progressMessage.textContent = "Melakukan pembelian via API Digiflazz/Supplier...";

        // Hit our Node API endpoint
        const response = await fetch("/api/transaksi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: currentUser ? currentUser.username : "guest",
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                target: destinationInput.value,
                gameZone: currentCategory === "game" ? document.getElementById("gameZoneId").value : "",
                price: finalPrice
            })
        });

        const result = await response.json();

        if (result.success) {
            const trx = result.transaction;

            // Step 3: Success
            document.getElementById("step2").className = "step completed";
            document.getElementById("step2").querySelector(".step-num").textContent = "2";
            document.getElementById("step3").className = "step active";
            document.getElementById("step3").querySelector(".step-num").innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            progressMessage.textContent = `Transaksi Sukses! SN: ${trx.sn}`;

            // Sync user object balance from server response
            if (currentUser) {
                currentUser.balance = result.userBalance;
                localStorage.setItem("vpstore_user", JSON.stringify(currentUser));
                updateUserPortalUI();
            }

            setTimeout(() => {
                alert(`Transaksi Sukses!\nID: ${trx.trxId}\nSN: ${trx.sn}`);
                hideModal();
                trxIdInput.value = trx.trxId;
                lookupTransaction();
                window.location.hash = "#cek-status";
            }, 1200);
        } else {
            throw new Error(result.message || "Transaksi gagal diproses supplier.");
        }

    } catch (error) {
        alert("Gagal melakukan transaksi: " + error.message);
        hideModal();
    }
}

// 8. Lookup Status Transaction from Server DB
async function lookupTransaction() {
    const trxId = trxIdInput.value.trim().toUpperCase();
    statusResultContainer.style.display = "block";

    if (!trxId) {
        statusResultContainer.innerHTML = '<p class="text-center text-danger">Harap masukkan ID Transaksi.</p>';
        return;
    }

    try {
        const res = await fetch(`/api/transaksi/status/${trxId}`);
        const data = await res.json();
        
        if (data.success) {
            const tx = data.transaction;
            statusResultContainer.innerHTML = `
                <div class="receipt-card">
                    <div class="receipt-header">
                        <span class="receipt-logo"><i class="fa-solid fa-bolt text-primary"></i> VPSTORE PPOB</span>
                        <span class="receipt-status-text ${tx.status}">${tx.status.toUpperCase()}</span>
                    </div>
                    <div class="receipt-row">
                        <span>ID Transaksi:</span>
                        <strong>${tx.trxId}</strong>
                    </div>
                    <div class="receipt-row">
                        <span>Waktu:</span>
                        <strong>${tx.date}</strong>
                    </div>
                    <div class="receipt-row">
                        <span>Produk:</span>
                        <strong>${tx.product}</strong>
                    </div>
                    <div class="receipt-row">
                        <span>Tujuan:</span>
                        <strong>${tx.target}</strong>
                    </div>
                    <div class="receipt-row">
                        <span>Harga:</span>
                        <strong>${formatRupiah(tx.price)}</strong>
                    </div>
                    <div class="receipt-row" style="border-top: 1px dashed #1E293B; padding-top: 10px; margin-top: 10px;">
                        <span>Serial Number (SN):</span>
                        <strong style="color: var(--primary); letter-spacing: 0.5px;">${tx.sn}</strong>
                    </div>
                </div>
            `;
        } else {
            statusResultContainer.innerHTML = `
                <div class="receipt-card text-center">
                    <p class="text-danger" style="font-weight: 600;"><i class="fa-solid fa-triangle-exclamation"></i> ID Transaksi tidak ditemukan.</p>
                </div>
            `;
        }
    } catch (e) {
        statusResultContainer.innerHTML = '<p class="text-center text-danger">Gagal memuat status dari server.</p>';
    }
}

// Start application on page load
window.addEventListener("DOMContentLoaded", init);
