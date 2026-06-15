// VPSTORE PPOB - Integrated Application Logic

// Mock Product Database (Edit IDs to match Digiflazz SKU Codes)
let productsDB = {
    pulsa: {
        Telkomsel: [
            { id: "T5", name: "Telkomsel Pulsa 5.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 5250, status: "tersedia" },
            { id: "T10", name: "Telkomsel Pulsa 10.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 10250, status: "tersedia" },
            { id: "T25", name: "Telkomsel Pulsa 25.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 24900, status: "tersedia" },
            { id: "T50", name: "Telkomsel Pulsa 50.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 49450, status: "tersedia" },
            { id: "T100", name: "Telkomsel Pulsa 100.000", desc: "Pulsa Elektrik Reguler Telkomsel", price: 98100, status: "tersedia" }
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
    paketan: {
        Telkomsel: [
            { id: "TD1", name: "Telkomsel Data 1GB / 3D", desc: "Paket Internet Telkomsel Flash Harian", price: 6500, status: "tersedia" },
            { id: "TD5", name: "Telkomsel Data 5GB / 30D", desc: "Paket Internet Telkomsel Flash Bulanan", price: 32000, status: "tersedia" }
        ],
        Indosat: [
            { id: "ID1", name: "Indosat Data Freedom 2GB", desc: "Kuota Utama 2GB Berlaku 30 Hari", price: 12000, status: "tersedia" },
            { id: "ID5", name: "Indosat Data Freedom 10GB", desc: "Kuota Utama 10GB Berlaku 30 Hari", price: 38500, status: "tersedia" }
        ],
        XL: [
            { id: "XD1", name: "XL Xtra Combo Flex 3GB", desc: "Kuota Utama 3GB + Free WA/Line", price: 14000, status: "tersedia" },
            { id: "XD5", name: "XL Xtra Combo Flex 12GB", desc: "Kuota Utama 12GB + Free WA/Line", price: 42000, status: "tersedia" }
        ],
        Three: [
            { id: "TRD1", name: "Three Happy 2GB / 3D", desc: "Kuota Utama Happy 2GB", price: 7000, status: "tersedia" },
            { id: "TRD5", name: "Three Happy 10GB / 30D", desc: "Kuota Utama Happy 10GB", price: 34000, status: "tersedia" }
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
    "0895": "Three", "0896": "Three", "0897": "Three", "0898": "Three", "0899": "Three",
    "0838": "Axis", "0831": "Axis", "0832": "Axis", "0833": "Axis",
    "0881": "Smartfren", "0882": "Smartfren", "0883": "Smartfren", "0884": "Smartfren", "0885": "Smartfren", "0886": "Smartfren", "0887": "Smartfren", "0888": "Smartfren", "0889": "Smartfren"
};

// Active State
let currentCategory = "pulsa";
let selectedProduct = null;
let currentUser = null;
let activeDepositInvoice = null;

const providerLogos = {
    // Standard keys
    "Telkomsel": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Telkomsel_2021_icon.svg/320px-Telkomsel_2021_icon.svg.png",
    "Indosat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Indosat_Ooredoo_Hutchison_logo.svg/320px-Indosat_Ooredoo_Hutchison_logo.svg.png",
    "XL": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/XL_Axiata_logo_2016.svg/320px-XL_Axiata_logo_2016.svg.png",
    "Three": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/3_logo.svg/320px-3_logo.svg.png",
    "Tri": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/3_logo.svg/320px-3_logo.svg.png",
    "Axis": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Axis_logo_2014.svg/320px-Axis_logo_2014.svg.png",
    "Smartfren": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Smartfren_logo.svg/320px-Smartfren_logo.svg.png",
    "PLN Prabayar": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_PLN.svg/320px-Logo_PLN.svg.png",
    "PLN": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_PLN.svg/320px-Logo_PLN.svg.png",
    
    // Games
    "Mobile Legends": "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Mobile_Legends_Bang_Bang_logo_2023.png/320px-Mobile_Legends_Bang_Bang_logo_2023.png",
    "Free Fire": "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Garena_Free_Fire_logo.png/320px-Garena_Free_Fire_logo.png",
    "Genshin Impact": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Genshin_Impact_logo.svg/320px-Genshin_Impact_logo.svg.png",
    "PUBG Mobile": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/PUBG_Mobile_Logo.png/320px-PUBG_Mobile_Logo.png",
    "Valorant": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_V_margin.svg/320px-Valorant_logo_-_V_margin.svg.png",
    
    // E-Money
    "DANA": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/320px-Logo_dana_blue.svg.png",
    "GoPay": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/320px-Gopay_logo.svg.png",
    "Go Pay": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/320px-Gopay_logo.svg.png",
    "OVO": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/320px-Logo_ovo_purple.svg.png",
    "ShopeePay": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/ShopeePay_logo.svg/320px-ShopeePay_logo.svg.png",
    "Shopee Pay": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/ShopeePay_logo.svg/320px-ShopeePay_logo.svg.png",
    "LinkAja": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/LinkAja_logo.svg/320px-LinkAja_logo.svg.png",
    
    // Uppercase Keys for direct dynamic database brand matches
    "TELKOMSEL": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Telkomsel_2021_icon.svg/320px-Telkomsel_2021_icon.svg.png",
    "INDOSAT": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Indosat_Ooredoo_Hutchison_logo.svg/320px-Indosat_Ooredoo_Hutchison_logo.svg.png",
    "XL": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/XL_Axiata_logo_2016.svg/320px-XL_Axiata_logo_2016.svg.png",
    "THREE": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/3_logo.svg/320px-3_logo.svg.png",
    "TRI": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/3_logo.svg/320px-3_logo.svg.png",
    "AXIS": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Axis_logo_2014.svg/320px-Axis_logo_2014.svg.png",
    "SMARTFREN": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Smartfren_logo.svg/320px-Smartfren_logo.svg.png"
};

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
const tabDashCalcBtn = document.getElementById("tabDashCalcBtn");
const tabAdminSummaryBtn = document.getElementById("tabAdminSummaryBtn");
const tabAdminUsersBtn = document.getElementById("tabAdminUsersBtn");
const tabAdminTrxsBtn = document.getElementById("tabAdminTrxsBtn");
const tabAdminDepositsBtn = document.getElementById("tabAdminDepositsBtn");
const tabAdminChatsBtn = document.getElementById("tabAdminChatsBtn");
const tabAdminVouchersBtn = document.getElementById("tabAdminVouchersBtn");

const tabTrxHist = document.getElementById("tab-trx-hist");
const tabDeposit = document.getElementById("tab-deposit-tab");
const tabCalculatorTab = document.getElementById("tab-calculator-tab");
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

// Load dynamic products from API
async function loadDynamicProducts() {
    try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.products) {
            productsDB = data.products;
            switchCategory(currentCategory);
            populatePricingTable();
        }
    } catch (e) {
        console.warn("Using fallback static products catalog", e);
    }
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
    loadAnnouncement();
    loadBroadcast();
    await loadDynamicProducts();
}

async function syncUserProfile() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/user/profile/${currentUser.username}`);
        const data = await res.json();
        if (data.success) {
            if (data.user.forceLogout) {
                await fetch(`/api/user/clear-logout/${currentUser.username}`, { method: 'POST' });
                currentUser = null;
                localStorage.removeItem("vpstore_user");
                alert("Sesi Anda telah diakhiri oleh Administrator!");
                location.reload();
                return;
            }
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
        updateProviderLogo();
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
    tabDashCalcBtn.addEventListener("click", () => switchDashboardTab("calculator-tab"));
    
    tabAdminSummaryBtn.addEventListener("click", () => switchDashboardTab("admin-summary"));
    tabAdminUsersBtn.addEventListener("click", () => switchDashboardTab("admin-users"));
    tabAdminTrxsBtn.addEventListener("click", () => switchDashboardTab("admin-trxs"));
    tabAdminDepositsBtn.addEventListener("click", () => switchDashboardTab("admin-deposits"));
    tabAdminChatsBtn.addEventListener("click", () => switchDashboardTab("admin-chats"));
    tabAdminVouchersBtn.addEventListener("click", () => switchDashboardTab("admin-vouchers"));

    // ADMIN ACTION EVENT
    document.getElementById("btnAdmUpdateBalance").addEventListener("click", handleAdminUpdateBalance);
    document.getElementById("btnAdmUpdateAnnouncement").addEventListener("click", handleAdminUpdateAnnouncement);
    document.getElementById("btnAdmUpdateBroadcast").addEventListener("click", handleAdminUpdateBroadcast);
    document.getElementById("btnSaveAdminUserSettings").addEventListener("click", handleSaveAdminUserSettings);
    document.getElementById("btnAdmSyncProducts").addEventListener("click", handleAdminSyncProducts);

    // CALCULATOR EVENTS
    const calcCostInput = document.getElementById("calcCostPrice");
    const calcSellingInput = document.getElementById("calcSellingPrice");
    const calcProductSelect = document.getElementById("calcProductSelect");

    calcProductSelect.addEventListener("change", (e) => {
        const price = e.target.value;
        if (price) {
            const discount = currentUser ? currentUser.discount : 0;
            const finalCost = Math.max(0, parseInt(price) - discount);
            calcCostInput.value = finalCost;
            calcSellingInput.value = parseInt(price) + 2000;
            calculateProfit();
        }
    });

    calcCostInput.addEventListener("input", calculateProfit);
    calcSellingInput.addEventListener("input", calculateProfit);

    // TRANSACTION DETAILS EVENT
    const closeTrxDetailsBtn = document.getElementById("closeTrxDetailsBtn");
    const btnCloseTrxDetails = document.getElementById("btnCloseTrxDetails");
    const btnDetCetakStruk = document.getElementById("btnDetCetakStruk");

    if (closeTrxDetailsBtn) closeTrxDetailsBtn.addEventListener("click", () => document.getElementById("trxDetailsModal").classList.remove("show"));
    if (btnCloseTrxDetails) btnCloseTrxDetails.addEventListener("click", () => document.getElementById("trxDetailsModal").classList.remove("show"));
    if (btnDetCetakStruk) {
        btnDetCetakStruk.addEventListener("click", () => {
            if (window.selectedTrxForDetails) {
                printThermalStruk(
                    window.selectedTrxForDetails.trxId,
                    window.selectedTrxForDetails.product,
                    window.selectedTrxForDetails.target,
                    window.selectedTrxForDetails.sn,
                    window.selectedTrxForDetails.date
                );
            }
        });
    }

    // PURCHASE CONFIRMATION WARNING EVENT
    const btnCancelWarning = document.getElementById("btnCancelWarning");
    const btnConfirmWarning = document.getElementById("btnConfirmWarning");
    if (btnCancelWarning) {
        btnCancelWarning.addEventListener("click", () => {
            document.getElementById("purchaseWarningOverlay").classList.remove("show");
            document.querySelectorAll(".product-card").forEach(c => c.classList.remove("selected"));
            selectedProduct = null;
        });
    }
    if (btnConfirmWarning) {
        btnConfirmWarning.addEventListener("click", () => {
            document.getElementById("purchaseWarningOverlay").classList.remove("show");
            showCheckoutModal();
        });
    }
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
    const passConfirm = document.getElementById("regPasswordConfirm").value;
    const name = document.getElementById("regName").value.trim();

    // 1. Password confirmation check
    if (pass !== passConfirm) {
        alert("Konfirmasi password tidak cocok! Pastikan kedua password yang Anda masukkan sama.");
        return;
    }

    // 2. Minimum length check
    if (pass.length < 4) {
        alert("Password minimal harus 4 karakter!");
        return;
    }

    // 3. Symbol checks (Alphanumeric only)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    const nameRegex = /^[a-zA-Z0-9\s]+$/;

    if (!alphanumericRegex.test(username)) {
        alert("Pendaftaran gagal: Username hanya boleh berisi huruf dan angka saja (tanpa simbol atau spasi)!");
        return;
    }

    if (!alphanumericRegex.test(pass)) {
        alert("Pendaftaran gagal: Password hanya boleh berisi huruf dan angka saja (tanpa simbol atau spasi)!");
        return;
    }

    if (!nameRegex.test(name)) {
        alert("Pendaftaran gagal: Nama lengkap hanya boleh berisi huruf, angka dan spasi saja (tanpa simbol)!");
        return;
    }

    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password: pass, name })
        });
        const data = await res.json();

        if (data.success) {
            currentUser = data.user;
            localStorage.setItem("vpstore_user", JSON.stringify(currentUser));
            alert("Pendaftaran berhasil! Akun Anda terdaftar sebagai MEMBER.");
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

        const isReseller = currentUser.tier !== 'member';
        const heading = document.getElementById("priceListHeading");
        const headerLabel = document.getElementById("priceHeaderLabel");
        if (heading && headerLabel) {
            if (isReseller) {
                heading.innerHTML = 'Daftar Harga <span class="accent-text">Reseller</span>';
                headerLabel.textContent = 'Harga Agen';
            } else {
                heading.innerHTML = 'Daftar Harga <span class="accent-text">Terbaik</span>';
                headerLabel.textContent = 'Harga';
            }
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

        const heading = document.getElementById("priceListHeading");
        const headerLabel = document.getElementById("priceHeaderLabel");
        if (heading && headerLabel) {
            heading.innerHTML = 'Daftar Harga <span class="accent-text">Terbaik</span>';
            headerLabel.textContent = 'Harga';
        }
    }
}

async function updateDashboardUI() {
    if (!currentUser) return;

    dashUser.textContent = currentUser.name;
    const dashUsernameEl = document.getElementById("dashUsername");
    if (dashUsernameEl) {
        dashUsernameEl.textContent = currentUser.username;
    }
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
    tabCalculatorTab.style.display = "none";
    tabAdminSummary.style.display = "none";
    tabAdminUsers.style.display = "none";
    tabAdminTrxs.style.display = "none";
    tabAdminDeposits.style.display = "none";
    
    const tabAdminChats = document.getElementById("tab-admin-chats");
    const tabAdminVouchers = document.getElementById("tab-admin-vouchers");
    if (tabAdminChats) tabAdminChats.style.display = "none";
    if (tabAdminVouchers) tabAdminVouchers.style.display = "none";

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
    } else if (tab === "calculator-tab") {
        tabDashCalcBtn.classList.add("active");
        tabCalculatorTab.style.display = "block";
        initProfitCalculator();
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
    } else if (tab === "admin-chats") {
        document.getElementById("tabAdminChatsBtn").classList.add("active");
        if (tabAdminChats) tabAdminChats.style.display = "block";
        loadAdminChatsList();
    } else if (tab === "admin-vouchers") {
        document.getElementById("tabAdminVouchersBtn").classList.add("active");
        if (tabAdminVouchers) tabAdminVouchers.style.display = "block";
        loadAdminVouchersList();
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
                tr.style.cursor = "pointer";
                tr.title = "Klik untuk kelola & lihat transaksi";
                tr.innerHTML = `
                    <td><strong>${u.username}</strong></td>
                    <td>${u.name}</td>
                    <td><span class="user-tier-badge ${u.tier}">${u.tier.toUpperCase()}</span></td>
                    <td class="text-success font-bold">${formatRupiah(u.balance)}</td>
                `;
                tr.addEventListener("click", () => showAdminUserModal(u.username));
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
            const searchVal = document.getElementById("adminTrxSearch") ? document.getElementById("adminTrxSearch").value.trim().toLowerCase() : "";
            adminTrxsBody.innerHTML = "";
            const filtered = data.transactions.filter(t => {
                if (!searchVal) return true;
                return (t.trxId && t.trxId.toLowerCase().includes(searchVal)) ||
                       (t.username && t.username.toLowerCase().includes(searchVal)) ||
                       (t.product && t.product.toLowerCase().includes(searchVal)) ||
                       (t.target && t.target.toLowerCase().includes(searchVal));
            });
            if (filtered.length === 0) {
                adminTrxsBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Transaksi tidak ditemukan.</td></tr>';
                return;
            }
            filtered.forEach(t => {
                const tr = document.createElement("tr");
                tr.style.cursor = "pointer";
                tr.title = "Klik untuk lihat detail transaksi";
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
                tr.addEventListener("click", () => window.showTrxDetails(t));
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
            const searchVal = document.getElementById("userTrxSearch") ? document.getElementById("userTrxSearch").value.trim().toLowerCase() : "";
            dashTrxBody.innerHTML = "";
            const filtered = data.transactions.filter(t => {
                if (!searchVal) return true;
                return (t.trxId && t.trxId.toLowerCase().includes(searchVal)) ||
                       (t.product && t.product.toLowerCase().includes(searchVal)) ||
                       (t.target && t.target.toLowerCase().includes(searchVal));
            });
            if (filtered.length === 0) {
                dashTrxBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted" style="padding: 24px;">Transaksi tidak ditemukan.</td>
                    </tr>
                `;
                return;
            }
            filtered.forEach(trx => {
                const tr = document.createElement("tr");
                tr.style.cursor = "pointer";
                tr.title = "Klik untuk lihat detail transaksi";
                tr.innerHTML = `
                    <td><strong>${trx.trxId}</strong></td>
                    <td>${trx.date ? trx.date.split(" ")[0] : '-'}</td>
                    <td>${trx.product}</td>
                    <td>${trx.target}</td>
                    <td><span class="text-success">${formatRupiah(trx.price)}</span></td>
                    <td><span class="status-badge ${trx.status}">${trx.status.toUpperCase()}</span></td>
                `;
                tr.addEventListener("click", () => window.showTrxDetails(trx));
                dashTrxBody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Gagal memuat history transaksi user", e);
    }
}

window.selectedTrxForDetails = null;
window.showTrxDetails = function(trx) {
    window.selectedTrxForDetails = trx;
    
    document.getElementById("detStatusBadge").className = `status-badge ${trx.status}`;
    document.getElementById("detStatusBadge").textContent = trx.status.toUpperCase();
    document.getElementById("detTrxId").textContent = trx.trxId;
    document.getElementById("detDate").textContent = trx.date || "-";
    document.getElementById("detUser").textContent = trx.username || "-";
    document.getElementById("detProduct").textContent = trx.product || "-";
    document.getElementById("detTarget").textContent = trx.target || "-";
    document.getElementById("detPromo").textContent = trx.promoCode ? trx.promoCode : "-";
    document.getElementById("detDiscount").textContent = trx.promoDiscount ? formatRupiah(trx.promoDiscount) : "Rp 0";
    document.getElementById("detPrice").textContent = formatRupiah(trx.price);
    document.getElementById("detSn").textContent = trx.sn || "-";
    
    document.getElementById("trxDetailsModal").classList.add("show");
};

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
    } else if (category === "paketan") {
        numberLabel.innerHTML = '<i class="fa-solid fa-phone"></i> Nomor Handphone Tujuan';
        destinationInput.placeholder = "Contoh: 081234567890";
        gameIdGroup.style.display = "none";
        providerSelect.disabled = false;
        populateProviders(Object.keys(productsDB.paketan));
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
    const grid = document.getElementById("providerGrid");
    if (grid) grid.innerHTML = "";

    providers.forEach(prov => {
        const opt = document.createElement("option");
        opt.value = prov;
        opt.textContent = prov;
        providerSelect.appendChild(opt);

        if (grid) {
            const card = document.createElement("div");
            card.className = "provider-card";
            card.dataset.provider = prov;
            
            const logoUrl = providerLogos[prov] || "https://avatars.githubusercontent.com/u/11831885?s=200&v=4";
            card.innerHTML = `
                <img src="${logoUrl}" alt="${prov}">
                <span>${prov}</span>
            `;
            
            card.addEventListener("click", () => {
                document.querySelectorAll(".provider-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                providerSelect.value = prov;
                populateProducts();
            });
            grid.appendChild(card);
        }
    });

    if (grid && grid.firstElementChild) {
        grid.firstElementChild.classList.add("active");
        providerSelect.value = providers[0];
    }
}

function updateProviderLogo() {
    const val = providerSelect.value;
    document.querySelectorAll(".provider-card").forEach(card => {
        if (card.dataset.provider === val) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
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
            
            const options = Array.from(providerSelect.options);
            const matchingOption = options.find(opt => opt.value.toLowerCase() === operatorName.toLowerCase());
            
            if (matchingOption && providerSelect.value !== matchingOption.value) {
                providerSelect.value = matchingOption.value;
                updateProviderLogo();
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

            // Show purchase confirmation warning overlay first
            const warningOverlay = document.getElementById("purchaseWarningOverlay");
            const warningTargetDisplay = document.getElementById("warningTargetDisplay");
            if (warningOverlay && warningTargetDisplay) {
                let displayTarget = destinationInput.value.trim();
                if (currentCategory === "game") {
                    displayTarget += ` (${document.getElementById("gameZoneId").value.trim()})`;
                }
                warningTargetDisplay.textContent = displayTarget;
                warningOverlay.classList.add("show");
            } else {
                showCheckoutModal();
            }
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

let activePromoDiscount = 0;
let activePromoCode = "";

function updateCheckoutPriceDisplay() {
    if (!selectedProduct) return;
    const basePrice = selectedProduct.finalPrice !== undefined ? selectedProduct.finalPrice : selectedProduct.price;
    const finalPrice = Math.max(0, basePrice - activePromoDiscount);

    summaryPrice.textContent = formatRupiah(finalPrice);
    document.getElementById("checkoutTotalBill").textContent = formatRupiah(finalPrice);

    if (currentUser) {
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

    // Reset Promo code state
    activePromoDiscount = 0;
    activePromoCode = "";
    const promoInput = document.getElementById("checkoutPromoCode");
    if (promoInput) promoInput.value = "";
    const promoStatus = document.getElementById("promoStatusMessage");
    if (promoStatus) {
        promoStatus.style.display = "none";
        promoStatus.textContent = "";
    }

    if (currentUser) {
        document.getElementById("checkoutUserBalance").textContent = formatRupiah(currentUser.balance);
    }

    updateCheckoutPriceDisplay();

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

async function startServerPayment() {
    const paymentMethod = document.querySelector("input[name='payment_method']:checked").value;
    const basePrice = selectedProduct.finalPrice !== undefined ? selectedProduct.finalPrice : selectedProduct.price;
    const finalPrice = Math.max(0, basePrice - activePromoDiscount);

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
                price: finalPrice,
                promoCode: activePromoCode || "",
                promoDiscount: activePromoDiscount || 0
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
                        <span>Harga Agen:</span>
                        <strong>${formatRupiah(tx.price)}</strong>
                    </div>
                    <div class="receipt-row" style="border-top: 1px dashed #1E293B; padding-top: 10px; margin-top: 10px;">
                        <span>Serial Number (SN):</span>
                        <strong style="color: var(--primary); letter-spacing: 0.5px; word-break: break-all;">${tx.sn}</strong>
                    </div>
                    
                    <!-- Reseller Feature: Cetak Struk Custom Price -->
                    <div class="struk-print-actions" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                            <span style="font-size: 11px; color: var(--text-muted);">Set Harga Jual di Struk (Rp):</span>
                            <input type="number" id="strukCustomPrice" value="${tx.price + 2000}" style="width: 100px; padding: 4px 8px; font-size: 12px; background: var(--bg-dark); color: white; border: 1px solid var(--border-color); border-radius: 4px; text-align: right; outline: none;">
                        </div>
                        <button class="btn btn-secondary btn-small" onclick="printThermalStruk('${tx.trxId}', '${tx.product.replace(/'/g, "\\'")}', '${tx.target}', '${tx.sn}', '${tx.date}')" style="justify-content: center; width: 100%;"><i class="fa-solid fa-print"></i> Cetak Struk Belanja</button>
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

// --- NEW PREMIUM FEATURES IMPLEMENTATION ---

// 1. Thermal Receipt Print
window.printThermalStruk = function(trxId, product, target, sn, date) {
    const customPrice = parseInt(document.getElementById("strukCustomPrice").value) || 0;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>VPSTORE STRUK - ${trxId}</title>
            <style>
                @page { size: 58mm auto; margin: 0; }
                body {
                    font-family: 'Courier New', Courier, monospace;
                    width: 48mm;
                    padding: 3mm;
                    margin: 0;
                    background: white;
                    color: black;
                    font-size: 10px;
                    line-height: 1.2;
                }
                .text-center { text-align: center; }
                .divider { border-top: 1px dashed black; margin: 6px 0; }
                .bold { font-weight: bold; }
                .footer { font-size: 8px; margin-top: 12px; }
                .row { display: flex; justify-content: space-between; margin: 2px 0; }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <div class="text-center">
                <span class="bold" style="font-size: 12px;">VPSTORE PPOB</span><br>
                <span>BUKTI PEMBAYARAN SAH</span>
            </div>
            <div class="divider"></div>
            <div class="row"><span>Tgl:</span><span>${date.split(" ")[0]}</span></div>
            <div class="row"><span>Ref:</span><span>${trxId}</span></div>
            <div class="divider"></div>
            <div class="row"><span>Produk:</span><span>${product}</span></div>
            <div class="row"><span>Tujuan:</span><span>${target}</span></div>
            <div class="row"><span>Total:</span><span class="bold">${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(customPrice)}</span></div>
            <div class="row"><span>Status:</span><span>SUKSES</span></div>
            <div class="divider"></div>
            <div class="row" style="flex-direction: column;">
                <span>SN:</span>
                <span class="bold" style="word-break: break-all; margin-top: 2px;">${sn}</span>
            </div>
            <div class="divider"></div>
            <div class="text-center footer">
                <span>Terima Kasih Atas Pembelian Anda.</span><br>
                <span>Simpan struk ini sebagai bukti pembayaran sah.</span>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
};

// 2. Load Web Announcement Marquee
async function loadAnnouncement() {
    try {
        const res = await fetch("/api/settings/announcement");
        const data = await res.json();
        if (data.success && data.announcement) {
            document.getElementById("announcementText").textContent = data.announcement;
            const admInput = document.getElementById("admAnnouncementText");
            if (admInput) {
                admInput.value = data.announcement;
            }
        }
    } catch (e) {
        console.error("Gagal memuat pengumuman", e);
    }
}

// 3. Admin Update Announcement
async function handleAdminUpdateAnnouncement() {
    const text = document.getElementById("admAnnouncementText").value.trim();
    if (!text) {
        alert("Pengumuman tidak boleh kosong!");
        return;
    }
    try {
        const res = await fetch("/api/settings/announcement", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            },
            body: JSON.stringify({ announcement: text })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            loadAnnouncement();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Gagal memperbarui pengumuman.");
    }
}

// 4. Profit Calculator Initialization
function initProfitCalculator() {
    const select = document.getElementById("calcProductSelect");
    if (!select || select.children.length > 1) return; // already populated

    for (const catKey in productsDB) {
        for (const providerKey in productsDB[catKey]) {
            const list = productsDB[catKey][providerKey];
            list.forEach(prod => {
                const opt = document.createElement("option");
                opt.value = prod.price;
                opt.textContent = `[${catKey.toUpperCase()}] ${prod.name} (${formatRupiah(prod.price)})`;
                select.appendChild(opt);
            });
        }
    }
}

// 5. Calculate Profit Formula
function calculateProfit() {
    const calcCostInput = document.getElementById("calcCostPrice");
    const calcSellingInput = document.getElementById("calcSellingPrice");
    const profitResult = document.getElementById("calcProfitResult");
    const profitPercent = document.getElementById("calcProfitPercent");

    const cost = parseInt(calcCostInput.value) || 0;
    const selling = parseInt(calcSellingInput.value) || 0;
    const profit = selling - cost;

    if (profit > 0) {
        profitResult.value = formatRupiah(profit);
        profitResult.style.color = "var(--success)";
        const percent = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;
        profitPercent.textContent = `${percent}%`;
        profitPercent.className = "text-success";
    } else if (profit === 0) {
        profitResult.value = "Rp 0";
        profitResult.style.color = "var(--text-muted)";
        profitPercent.textContent = "0%";
        profitPercent.className = "text-muted";
    } else {
        profitResult.value = `Rugi ${formatRupiah(Math.abs(profit))}`;
        profitResult.style.color = "var(--danger)";
        const percent = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;
        profitPercent.textContent = `${percent}%`;
        profitPercent.className = "text-danger";
    }
}

// 6. Load Broadcast Alert Banner
async function loadBroadcast() {
    try {
        const res = await fetch("/api/settings/broadcast");
        const data = await res.json();
        const container = document.getElementById("broadcastBannerContainer");
        const textEl = document.getElementById("broadcastText");
        
        if (data.success && data.broadcast && data.broadcast.active && data.broadcast.text) {
            textEl.textContent = data.broadcast.text;
            container.style.display = "flex";
            const admInput = document.getElementById("admBroadcastText");
            const admCheck = document.getElementById("admBroadcastActive");
            if (admInput) admInput.value = data.broadcast.text;
            if (admCheck) admCheck.checked = data.broadcast.active;
        } else {
            container.style.display = "none";
        }
    } catch (e) {
        console.error("Gagal memuat broadcast", e);
    }
}

// 7. Admin Update Broadcast
async function handleAdminUpdateBroadcast() {
    const text = document.getElementById("admBroadcastText").value.trim();
    const active = document.getElementById("admBroadcastActive").checked;
    
    if (!text && active) {
        alert("Pesan broadcast tidak boleh kosong jika diaktifkan!");
        return;
    }
    try {
        const res = await fetch("/api/settings/broadcast", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            },
            body: JSON.stringify({ text, active })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            loadBroadcast();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Gagal memperbarui broadcast.");
    }
}

// 8. Admin User Details Modal
let selectedAdminUser = null;

window.showAdminUserModal = async function(username) {
    selectedAdminUser = username;
    document.getElementById("detUserTitle").textContent = username;
    
    // Clear inputs first
    document.getElementById("detUserTier").value = "member";
    document.getElementById("detUserDiscount").value = 0;
    document.getElementById("detUserBalance").value = "Rp 0";
    document.getElementById("detBalanceAmount").value = "";
    document.getElementById("detUserTrxBody").innerHTML = '<tr><td colspan="5" class="text-center">Memuat riwayat transaksi...</td></tr>';
    
    // Show Modal
    const modal = document.getElementById("adminUserDetailModal");
    modal.classList.add("show");
    
    try {
        // Fetch profile
        const profileRes = await fetch(`/api/user/profile/${username}`);
        const profileData = await profileRes.json();
        if (profileData.success) {
            const u = profileData.user;
            document.getElementById("detUserTier").value = u.tier;
            document.getElementById("detUserDiscount").value = u.discount || 0;
            document.getElementById("detUserBalance").value = formatRupiah(u.balance);
        }
        
        // Fetch transactions
        const trxRes = await fetch(`/api/transaksi/history/${username}`);
        const trxData = await trxRes.json();
        if (trxData.success) {
            const tbody = document.getElementById("detUserTrxBody");
            tbody.innerHTML = "";
            if (trxData.transactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada riwayat transaksi.</td></tr>';
            } else {
                trxData.transactions.forEach(tx => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${tx.trxId}</strong></td>
                        <td>${tx.product}</td>
                        <td>${tx.target}</td>
                        <td class="font-bold">${formatRupiah(tx.price)}</td>
                        <td><span class="badge ${tx.status}">${tx.status.toUpperCase()}</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    } catch (e) {
        console.error("Gagal memuat detail anggota", e);
    }
};

window.closeAdminUserModal = function() {
    const modal = document.getElementById("adminUserDetailModal");
    modal.classList.remove("show");
    selectedAdminUser = null;
};

// 9. Save Admin Settings for User Details & Balance
async function handleSaveAdminUserSettings() {
    if (!selectedAdminUser) return;
    
    const tier = document.getElementById("detUserTier").value;
    const discount = parseInt(document.getElementById("detUserDiscount").value) || 0;
    const balAction = document.getElementById("detBalanceAction").value;
    const balAmount = parseInt(document.getElementById("detBalanceAmount").value) || 0;
    
    try {
        // Step 1: Update tier & discount
        const updateRes = await fetch("/api/admin/users/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            },
            body: JSON.stringify({
                targetUsername: selectedAdminUser,
                tier,
                discount
            })
        });
        const updateData = await updateRes.json();
        if (!updateData.success) {
            alert(updateData.message || "Gagal memperbarui profil anggota");
            return;
        }
        
        // Step 2: Adjust balance if amount > 0
        if (balAmount > 0) {
            const balRes = await fetch("/api/admin/users/balance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-user": currentUser.username
                },
                body: JSON.stringify({
                    targetUsername: selectedAdminUser,
                    action: balAction,
                    amount: balAmount
                })
            });
            const balData = await balRes.json();
            if (!balData.success) {
                alert(balData.message || "Gagal menyesuaikan saldo");
                return;
            }
        }
        
        alert("Perubahan data anggota berhasil disimpan!");
        closeAdminUserModal();
        loadAdminUsers();
        loadAdminData();
    } catch (e) {
        alert("Terjadi kesalahan sistem.");
    }
}

async function handleAdminSyncProducts() {
    const btn = document.getElementById("btnAdmSyncProducts");
    const statusMsg = document.getElementById("syncStatusMessage");
    if (!btn || !statusMsg) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Sedang Menyinkronkan...';
    statusMsg.textContent = "Status: Menarik data produk dari VIP Reseller...";
    statusMsg.style.color = "var(--warning)";

    try {
        const res = await fetch("/api/admin/sync-vip-products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            }
        });
        const data = await res.json();
        if (data.success) {
            statusMsg.textContent = "Status: Sinkronisasi berhasil selesai!";
            statusMsg.style.color = "var(--success)";
            alert(data.message || "Sinkronisasi produk VIP Reseller berhasil!");
            await loadDynamicProducts();
        } else {
            statusMsg.textContent = "Status: Gagal melakukan sinkronisasi.";
            statusMsg.style.color = "var(--danger)";
            alert(data.message || "Gagal sinkronisasi produk.");
        }
    } catch (e) {
        statusMsg.textContent = "Status: Error koneksi server.";
        statusMsg.style.color = "var(--danger)";
        alert("Terjadi kesalahan koneksi server saat sinkronisasi.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Sinkronkan Produk Sekarang';
    }
}

// Promo Code Verification
document.addEventListener("DOMContentLoaded", () => {
    const btnApplyPromo = document.getElementById("btnApplyPromo");
    if (btnApplyPromo) {
        btnApplyPromo.addEventListener("click", async () => {
            const code = document.getElementById("checkoutPromoCode").value.trim();
            if (!code) {
                alert("Masukkan kode voucher terlebih dahulu!");
                return;
            }
            try {
                const res = await fetch("/api/voucher/validate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code })
                });
                const data = await res.json();
                const statusMsg = document.getElementById("promoStatusMessage");
                if (data.success) {
                    activePromoDiscount = data.discount;
                    activePromoCode = code.toUpperCase();
                    statusMsg.style.display = "block";
                    statusMsg.style.color = "var(--success)";
                    statusMsg.textContent = `Promo Berhasil! Potongan harga Rp ${new Intl.NumberFormat('id-ID').format(activePromoDiscount)} diterapkan.`;
                    updateCheckoutPriceDisplay();
                } else {
                    activePromoDiscount = 0;
                    activePromoCode = "";
                    statusMsg.style.display = "block";
                    statusMsg.style.color = "var(--danger)";
                    statusMsg.textContent = data.message || "Voucher tidak valid.";
                    updateCheckoutPriceDisplay();
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    // Force Logout Action
    const btnAdminForceLogout = document.getElementById("btnAdminForceLogout");
    if (btnAdminForceLogout) {
        btnAdminForceLogout.addEventListener("click", async () => {
            if (!selectedAdminUser) return;
            if (!confirm(`Apakah Anda yakin ingin memaksa logout pengguna ${selectedAdminUser}?`)) return;
            
            try {
                const res = await fetch("/api/admin/users/force-logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-user": currentUser.username
                    },
                    body: JSON.stringify({ targetUsername: selectedAdminUser })
                });
                const data = await res.json();
                if (data.success) {
                    alert(data.message);
                    closeAdminUserModal();
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert("Gagal memproses paksa logout.");
            }
        });
    }
});

// Customer Service Dropdown Actions
window.toggleCsMenu = function(e) {
    if (e) e.stopPropagation();
    const csMenu = document.getElementById("csMenu");
    if (csMenu) csMenu.classList.toggle("show");
};

document.addEventListener("click", () => {
    const csMenu = document.getElementById("csMenu");
    if (csMenu) csMenu.classList.remove("show");
});

window.openWaLink = function() {
    window.open("https://wa.me/6281234567890?text=Halo%20Admin%20VPSTORE%2C%20saya%20butuh%20bantuan%20transaksi.", "_blank");
};

let chatSessionId = localStorage.getItem("vpstore_chat_session_id");
if (!chatSessionId) {
    chatSessionId = "guest_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("vpstore_chat_session_id", chatSessionId);
}

let userChatInterval = null;

window.openLiveChat = function(e) {
    if (e) e.stopPropagation();
    const csMenu = document.getElementById("csMenu");
    if (csMenu) csMenu.classList.remove("show");
    
    const chatWin = document.getElementById("liveChatWindow");
    if (chatWin) chatWin.classList.add("show");
    
    const session = currentUser ? currentUser.username : chatSessionId;
    loadUserChatMessages(session);
    
    if (userChatInterval) clearInterval(userChatInterval);
    userChatInterval = setInterval(() => loadUserChatMessages(session), 3000);
};

window.closeLiveChat = function() {
    const chatWin = document.getElementById("liveChatWindow");
    if (chatWin) chatWin.classList.remove("show");
    if (userChatInterval) {
        clearInterval(userChatInterval);
        userChatInterval = null;
    }
};

async function loadUserChatMessages(session) {
    try {
        const res = await fetch(`/api/chat/messages/${session}`);
        const data = await res.json();
        if (data.success) {
            const chatBody = document.getElementById("liveChatBody");
            if (!chatBody) return;
            const atBottom = chatBody.scrollHeight - chatBody.clientHeight <= chatBody.scrollTop + 50;
            
            let html = "";
            if (data.messages.length === 0) {
                html = `<div style="text-align: center; color: var(--text-muted); font-size: 11px; margin-top: 20px;">
                    Halo! Ada yang bisa kami bantu? Kirim pesan untuk mulai chat dengan Admin.
                </div>`;
            } else {
                data.messages.forEach(msg => {
                    const bubbleClass = msg.sender === 'user' ? 'user' : 'admin';
                    html += `<div class="chat-bubble ${bubbleClass}">${msg.text}</div>`;
                });
            }
            chatBody.innerHTML = html;
            
            if (atBottom || chatBody.scrollTop === 0) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }
    } catch (e) {
        console.error("Gagal memuat chat", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnSendLiveChat = document.getElementById("btnSendLiveChat");
    const liveChatInput = document.getElementById("liveChatInput");
    if (btnSendLiveChat && liveChatInput) {
        btnSendLiveChat.addEventListener("click", sendUserChatMessage);
        liveChatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendUserChatMessage();
        });
    }
});

async function sendUserChatMessage() {
    const input = document.getElementById("liveChatInput");
    const text = input.value.trim();
    if (!text) return;
    
    const session = currentUser ? currentUser.username : chatSessionId;
    
    try {
        const res = await fetch("/api/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session, text, sender: 'user' })
        });
        const data = await res.json();
        if (data.success) {
            input.value = "";
            loadUserChatMessages(session);
        }
    } catch (e) {
        console.error(e);
    }
}

// Admin Live Chat Management
let adminChatInterval = null;
let adminActiveSession = "";

async function loadAdminChatsList() {
    try {
        const res = await fetch("/api/admin/chats", {
            headers: { "x-admin-user": currentUser.username }
        });
        const data = await res.json();
        if (data.success) {
            const listContainer = document.getElementById("adminChatList");
            if (!listContainer) return;
            let html = "";
            const sessions = Object.keys(data.chats);
            if (sessions.length === 0) {
                html = `<span class="text-muted text-center" style="font-size: 12px; margin-top: 20px;">Belum ada antrean chat.</span>`;
            } else {
                sessions.forEach(session => {
                    const lastMsg = data.chats[session];
                    const activeStyle = session === adminActiveSession ? 'style="background: rgba(16, 185, 129, 0.1); border-color: var(--primary);"' : '';
                    html += `
                        <div onclick="selectAdminActiveChat('${session}')" ${activeStyle} style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; transition: background 0.2s;">
                            <div style="font-weight: bold; font-size: 12.5px; display: flex; justify-content: space-between; align-items: center;">
                                <span>${session}</span>
                                <span style="font-size: 10px; color: var(--text-muted);">${lastMsg.timestamp}</span>
                            </div>
                            <div style="font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px;">
                                ${lastMsg.sender === 'admin' ? 'Anda: ' : ''}${lastMsg.text}
                            </div>
                        </div>
                    `;
                });
            }
            listContainer.innerHTML = html;
        }
    } catch (e) {
        console.error(e);
    }
}

window.selectAdminActiveChat = function(session) {
    adminActiveSession = session;
    document.getElementById("adminActiveChatSession").textContent = session;
    
    const input = document.getElementById("adminChatInput");
    const btn = document.getElementById("btnAdminSendChat");
    input.disabled = false;
    btn.disabled = false;
    
    loadAdminActiveChatMessages();
    
    if (adminChatInterval) clearInterval(adminChatInterval);
    adminChatInterval = setInterval(loadAdminActiveChatMessages, 3000);
    loadAdminChatsList();
};

async function loadAdminActiveChatMessages() {
    if (!adminActiveSession) return;
    try {
        const res = await fetch(`/api/chat/messages/${adminActiveSession}`);
        const data = await res.json();
        if (data.success) {
            const chatBody = document.getElementById("adminChatBody");
            if (!chatBody) return;
            const atBottom = chatBody.scrollHeight - chatBody.clientHeight <= chatBody.scrollTop + 50;
            
            let html = "";
            data.messages.forEach(msg => {
                const bubbleClass = msg.sender === 'admin' ? 'user' : 'admin';
                html += `<div class="chat-bubble ${bubbleClass}">${msg.text}</div>`;
            });
            chatBody.innerHTML = html;
            
            if (atBottom || chatBody.scrollTop === 0) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnAdminSendChat = document.getElementById("btnAdminSendChat");
    const adminChatInput = document.getElementById("adminChatInput");
    if (btnAdminSendChat && adminChatInput) {
        btnAdminSendChat.addEventListener("click", sendAdminChatMessage);
        adminChatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendAdminChatMessage();
        });
    }
});

async function sendAdminChatMessage() {
    const input = document.getElementById("adminChatInput");
    const text = input.value.trim();
    if (!text || !adminActiveSession) return;
    
    try {
        const res = await fetch("/api/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session: adminActiveSession, text, sender: 'admin' })
        });
        const data = await res.json();
        if (data.success) {
            input.value = "";
            loadAdminActiveChatMessages();
            loadAdminChatsList();
        }
    } catch (e) {
        console.error(e);
    }
}

// Admin Vouchers Management
async function loadAdminVouchersList() {
    try {
        const res = await fetch("/api/admin/vouchers", {
            headers: { "x-admin-user": currentUser.username }
        });
        const data = await res.json();
        if (data.success) {
            const body = document.getElementById("adminVouchersBody");
            if (!body) return;
            let html = "";
            if (data.vouchers.length === 0) {
                html = '<tr><td colspan="4" class="text-center text-muted">Belum ada kode promo.</td></tr>';
            } else {
                data.vouchers.forEach(v => {
                    const badge = v.active ? '<span class="status-badge sukses">Aktif</span>' : '<span class="status-badge gagal">Nonaktif</span>';
                    html += `
                        <tr>
                            <td class="font-bold">${v.code}</td>
                            <td>${formatRupiah(v.discount)}</td>
                            <td>${badge}</td>
                            <td>
                                <button class="btn btn-secondary btn-small" style="background: var(--danger); border-color: var(--danger); padding: 4px 8px;" onclick="deleteAdminVoucher('${v.code}')">
                                    <i class="fa-solid fa-trash"></i> Hapus
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
            body.innerHTML = html;
        }
    } catch (e) {
        console.error(e);
    }
}

window.deleteAdminVoucher = async function(code) {
    if (!confirm(`Apakah Anda yakin ingin menghapus voucher promo ${code}?`)) return;
    try {
        const res = await fetch("/api/admin/vouchers/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-user": currentUser.username
            },
            body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (data.success) {
            alert(data.message);
            loadAdminVouchersList();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert("Gagal menghapus voucher promo.");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const btnAdmCreateVoucher = document.getElementById("btnAdmCreateVoucher");
    if (btnAdmCreateVoucher) {
        btnAdmCreateVoucher.addEventListener("click", async () => {
            const code = document.getElementById("admVoucherCode").value.trim().toUpperCase();
            const discount = document.getElementById("admVoucherDiscount").value.trim();
            const active = document.getElementById("admVoucherActive").checked;
            
            if (!code || !discount) {
                alert("Data kode promo & nominal diskon tidak boleh kosong!");
                return;
            }
            
            try {
                const res = await fetch("/api/admin/vouchers/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-user": currentUser.username
                    },
                    body: JSON.stringify({ code, discount, active })
                });
                const data = await res.json();
                if (data.success) {
                    alert(data.message);
                    document.getElementById("admVoucherCode").value = "";
                    document.getElementById("admVoucherDiscount").value = "";
                    loadAdminVouchersList();
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert("Gagal menyimpan voucher promo.");
            }
        });
    }

    // Admin Register User / Reseller Action
    const btnAdmCreateUser = document.getElementById("btnAdmCreateUser");
    if (btnAdmCreateUser) {
        btnAdmCreateUser.addEventListener("click", async () => {
            const username = document.getElementById("admNewUsername").value.trim().toLowerCase();
            const name = document.getElementById("admNewName").value.trim();
            const password = document.getElementById("admNewPassword").value;
            const tier = document.getElementById("admNewTier").value;

            if (!username || !name || !password) {
                alert("Mohon lengkapi semua input data akun baru!");
                return;
            }
            if (password.length < 4) {
                alert("Password minimal 4 karakter!");
                return;
            }

            try {
                const res = await fetch("/api/admin/users/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-user": currentUser.username
                    },
                    body: JSON.stringify({ username, name, password, tier })
                });
                const data = await res.json();
                if (data.success) {
                    alert(data.message);
                    document.getElementById("admNewUsername").value = "";
                    document.getElementById("admNewName").value = "";
                    document.getElementById("admNewPassword").value = "";
                    loadAdminUsers();
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert("Gagal mendaftarkan akun baru.");
            }
        });
    }

    // Search transactions inputs
    const userTrxSearch = document.getElementById("userTrxSearch");
    if (userTrxSearch) {
        userTrxSearch.addEventListener("input", loadUserTrxHistory);
    }
    const adminTrxSearch = document.getElementById("adminTrxSearch");
    if (adminTrxSearch) {
        adminTrxSearch.addEventListener("input", loadAdminTransactions);
    }
});

// Start application on page load
window.addEventListener("DOMContentLoaded", init);
