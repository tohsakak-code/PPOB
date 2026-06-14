const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const dbPath = path.join(__dirname, '..', 'db.json');

// --- DUAL MODE DATABASE CONFIGURATION ---
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY;
let supabase = null;

if (useSupabase) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log("Database Mode: SUPABASE (Cloud)");
} else {
    console.log("Database Mode: LOCAL JSON (db.json Fallback)");
}

// --- DIGIFLAZZ / VIP RESELLER CONFIG ---
const DIGIFLAZZ_USERNAME = process.env.DIGIFLAZZ_USERNAME || ""; 
const DIGIFLAZZ_API_KEY = process.env.DIGIFLAZZ_API_KEY || ""; 
const VIPRESELLER_API_KEY = process.env.VIPRESELLER_API_KEY || "";
const VIPRESELLER_ID = process.env.VIPRESELLER_ID || "";
// ----------------------------------------

app.use(cors());
app.use(express.json());
// Serve static files from root directory in Vercel/Local
app.use(express.static(path.join(__dirname, '..')));

// Utility: MD5
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

// Local File DB Helper functions
function readLocalDB() {
    if (!fs.existsSync(dbPath)) {
        const initial = {
            users: {
                admin: { username: 'admin', password: 'adminpassword', name: 'VPSTORE Admin', tier: 'admin', balance: 999999999, discount: 0 },
                member1: { username: 'member1', password: '1234', name: 'Budi Santoso', tier: 'member', balance: 25000, discount: 0 },
                reseller2: { username: 'reseller2', password: '1234', name: 'Viper Store Agen', tier: 'reseller', balance: 250000, discount: 150 },
                partner3: { username: 'partner3', password: '1234', name: 'H2H VIP Partner', tier: 'partner', balance: 1500000, discount: 350 }
            },
            transactions: [],
            deposits: []
        };
        fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
        return initial;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeLocalDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- DATABASE INTERFACES (ABSTRACTION LAYER) ---
async function dbGetUser(username) {
    const cleanUsername = username.trim().toLowerCase();
    if (useSupabase) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', cleanUsername)
            .maybeSingle();
        return data;
    } else {
        const db = readLocalDB();
        return db.users[cleanUsername] || null;
    }
}

async function dbCreateUser(user) {
    if (useSupabase) {
        const { error } = await supabase.from('users').insert([user]);
        if (error) throw error;
        return user;
    } else {
        const db = readLocalDB();
        db.users[user.username] = user;
        writeLocalDB(db);
        return user;
    }
}

async function dbUpdateUserBalance(username, newBalance) {
    const cleanUsername = username.trim().toLowerCase();
    if (useSupabase) {
        const { error } = await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('username', cleanUsername);
        if (error) throw error;
    } else {
        const db = readLocalDB();
        if (db.users[cleanUsername]) {
            db.users[cleanUsername].balance = newBalance;
            writeLocalDB(db);
        }
    }
}

async function dbCreateDeposit(deposit) {
    if (useSupabase) {
        const { error } = await supabase.from('deposits').insert([deposit]);
        if (error) throw error;
    } else {
        const db = readLocalDB();
        db.deposits.push(deposit);
        writeLocalDB(db);
    }
}

async function dbGetDeposit(depositId) {
    if (useSupabase) {
        const { data, error } = await supabase
            .from('deposits')
            .select('*')
            .eq('deposit_id', depositId)
            .maybeSingle();
        return data;
    } else {
        const db = readLocalDB();
        return db.deposits.find(d => d.depositId === depositId) || null;
    }
}

async function dbUpdateDepositStatus(depositId, status) {
    if (useSupabase) {
        const { error } = await supabase
            .from('deposits')
            .update({ status: status })
            .eq('deposit_id', depositId);
        if (error) throw error;
    } else {
        const db = readLocalDB();
        const dep = db.deposits.find(d => d.depositId === depositId);
        if (dep) {
            dep.status = status;
            writeLocalDB(db);
        }
    }
}

async function dbCreateTransaction(trx) {
    if (useSupabase) {
        const { error } = await supabase.from('transactions').insert([trx]);
        if (error) throw error;
    } else {
        const db = readLocalDB();
        db.transactions.unshift(trx);
        writeLocalDB(db);
    }
}

async function dbGetUserTransactions(username) {
    const cleanUsername = username.trim().toLowerCase();
    if (useSupabase) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('username', cleanUsername)
            .order('created_at', { ascending: false });
        // Map created_at/names if needed
        return data || [];
    } else {
        const db = readLocalDB();
        return db.transactions.filter(t => t.username === cleanUsername);
    }
}

async function dbGetTransaction(trxId) {
    if (useSupabase) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('trx_id', trxId)
            .maybeSingle();
        return data;
    } else {
        const db = readLocalDB();
        return db.transactions.find(t => t.trxId === trxId) || null;
    }
}

// Admin Abstractions
async function dbGetAdminSummary() {
    if (useSupabase) {
        const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
        
        const { data: usersBal } = await supabase.from('users').select('balance').neq('tier', 'admin');
        const totalBalance = usersBal?.reduce((sum, u) => sum + (u.balance || 0), 0) || 0;

        const { count: totalTransactions } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
        const { count: pendingDeposits } = await supabase.from('deposits').select('*', { count: 'exact', head: true }).eq('status', 'pending');

        return {
            totalUsers: totalUsers || 0,
            totalBalance: totalBalance || 0,
            totalTransactions: totalTransactions || 0,
            pendingDeposits: pendingDeposits || 0
        };
    } else {
        const db = readLocalDB();
        const usersList = Object.values(db.users);
        return {
            totalUsers: usersList.length,
            totalBalance: usersList.reduce((sum, u) => sum + (u.tier !== 'admin' ? u.balance : 0), 0),
            totalTransactions: db.transactions.length,
            pendingDeposits: db.deposits.filter(d => d.status === 'pending').length
        };
    }
}

async function dbGetAllUsers() {
    if (useSupabase) {
        const { data } = await supabase.from('users').select('*');
        return data || [];
    } else {
        const db = readLocalDB();
        return Object.values(db.users);
    }
}

async function dbGetAllTransactions() {
    if (useSupabase) {
        const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
        return data || [];
    } else {
        const db = readLocalDB();
        return db.transactions;
    }
}

async function dbGetAllDeposits() {
    if (useSupabase) {
        const { data } = await supabase.from('deposits').select('*').order('created_at', { ascending: false });
        return data || [];
    } else {
        const db = readLocalDB();
        return db.deposits;
    }
}

// --- ROUTERS & CONTROLLERS ---

// Auth Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password, name, tier } = req.body;
    if (!username || !password || !name || !tier) {
        return res.status(400).json({ success: false, message: "Semua input harus diisi!" });
    }

    try {
        const cleanUsername = username.trim().toLowerCase();
        const existing = await dbGetUser(cleanUsername);

        if (existing) {
            return res.status(400).json({ success: false, message: "Username sudah digunakan!" });
        }

        let initialBalance = 0;
        let discount = 0;

        if (tier === "reseller") {
            initialBalance = 100000;
            discount = 150;
        } else if (tier === "partner") {
            initialBalance = 500000;
            discount = 350;
        } else {
            initialBalance = 10000;
            discount = 0;
        }

        const newUser = {
            username: cleanUsername,
            password: password,
            name: name,
            tier: tier,
            balance: initialBalance,
            discount: discount
        };

        const created = await dbCreateUser(newUser);
        res.json({ success: true, user: created, message: "Registrasi berhasil!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error saat registrasi." });
    }
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await dbGetUser(username);
        if (user && user.password === password) {
            res.json({ success: true, user });
        } else {
            res.status(400).json({ success: false, message: "Username atau password salah!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saat login." });
    }
});

// User Profile
app.get('/api/user/profile/:username', async (req, res) => {
    try {
        const user = await dbGetUser(req.params.username);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: "User tidak ditemukan!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// Deposit Request
app.post('/api/user/deposit', async (req, res) => {
    const { username, amount, method } = req.body;
    if (!username || !amount || !method) {
        return res.status(400).json({ success: false, message: "Input tidak lengkap" });
    }

    try {
        const user = await dbGetUser(username);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        const uniqueCode = Math.floor(1 + Math.random() * 999);
        const finalAmount = parseInt(amount) + uniqueCode;
        const depositId = "DEP" + Date.now();

        const newDeposit = {
            deposit_id: depositId,
            depositId, // Support old local mapping camelCase
            username: user.username,
            amount: parseInt(amount),
            code: uniqueCode,
            total: finalAmount,
            method,
            status: "pending",
            date: new Date().toLocaleString()
        };

        await dbCreateDeposit(newDeposit);
        res.json({ success: true, deposit: newDeposit });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error mengajukan deposit" });
    }
});

// Deposit Pay Simulation
app.post('/api/user/deposit/pay', async (req, res) => {
    const { depositId } = req.body;
    try {
        const deposit = await dbGetDeposit(depositId);
        if (!deposit) {
            return res.status(404).json({ success: false, message: "Invoice deposit tidak ditemukan" });
        }

        if (deposit.status !== "pending") {
            return res.status(400).json({ success: false, message: "Invoice deposit sudah diproses" });
        }

        const user = await dbGetUser(deposit.username);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        const newBalance = user.balance + deposit.total;
        await dbUpdateUserBalance(user.username, newBalance);
        await dbUpdateDepositStatus(depositId, 'sukses');

        res.json({ success: true, balance: newBalance, message: "Deposit berhasil diproses!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error memproses pembayaran deposit" });
    }
});

// Process Transaction
app.post('/api/transaksi', async (req, res) => {
    const { username, productId, productName, target, gameZone, price } = req.body;
    if (!username || !productId || !target || !price) {
        return res.status(400).json({ success: false, message: "Data transaksi tidak lengkap!" });
    }

    try {
        const user = await dbGetUser(username);
        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan!" });
        }

        const finalPrice = parseInt(price);
        if (user.balance < finalPrice && user.tier !== 'admin') {
            return res.status(400).json({ success: false, message: "Saldo tidak mencukupi!" });
        }

        const trxId = "TRX" + Date.now();
        const timestamp = new Date().toLocaleString();

        // Deduct user balance
        let updatedBalance = user.balance;
        if (user.tier !== 'admin') {
            updatedBalance = user.balance - finalPrice;
            await dbUpdateUserBalance(user.username, updatedBalance);
        }

        const newTransaction = {
            trx_id: trxId,
            trxId, // Support camelCase fallback
            username: user.username,
            product: productName || productId,
            product_id: productId,
            productId, // Support camelCase fallback
            target: gameZone ? `${target} (${gameZone})` : target,
            price: finalPrice,
            status: "pending",
            sn: "Processing...",
            date: timestamp
        };

        // Digiflazz API Connection
        if (DIGIFLAZZ_USERNAME && DIGIFLAZZ_API_KEY) {
            try {
                const endpoint = "https://api.digiflazz.com/v1/transaction";
                const sign = md5(DIGIFLAZZ_USERNAME + DIGIFLAZZ_API_KEY + trxId);

                const payload = {
                    username: DIGIFLAZZ_USERNAME,
                    buyer_sku_code: productId,
                    customer_no: target,
                    ref_id: trxId,
                    sign: sign
                };

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.data) {
                    const data = result.data;
                    if (data.status === "Sukses") {
                        newTransaction.status = "sukses";
                        newTransaction.sn = data.sn || "SUKSES-API";
                    } else if (data.status === "Gagal") {
                        newTransaction.status = "gagal";
                        newTransaction.sn = data.message || "Gagal dari supplier";
                        // Refund
                        if (user.tier !== 'admin') {
                            updatedBalance += finalPrice;
                            await dbUpdateUserBalance(user.username, updatedBalance);
                        }
                    } else {
                        newTransaction.status = "proses";
                        newTransaction.sn = "Diproses oleh Operator";
                    }
                } else {
                    newTransaction.status = "proses";
                    newTransaction.sn = result.message || "Diproses API";
                }
            } catch (err) {
                newTransaction.status = "proses";
                newTransaction.sn = "Digiflazz API Timeout";
            }
        } 
        // VIP Reseller Game Integration
        else if (VIPRESELLER_API_KEY && VIPRESELLER_ID && productId.startsWith("GAME_")) {
            try {
                const endpoint = "https://vip-reseller.co.id/api/game";
                const sign = md5(VIPRESELLER_ID + VIPRESELLER_API_KEY);
                const payload = {
                    key: VIPRESELLER_API_KEY,
                    sign: sign,
                    type: "order",
                    service: productId.replace("GAME_", ""),
                    target: target,
                    zone: gameZone || ""
                };

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.status) {
                    newTransaction.status = "sukses";
                    newTransaction.sn = result.data.sn || "VIP-SUKSES";
                } else {
                    newTransaction.status = "gagal";
                    newTransaction.sn = result.message || "Gagal VIP Reseller";
                    if (user.tier !== 'admin') {
                        updatedBalance += finalPrice;
                        await dbUpdateUserBalance(user.username, updatedBalance);
                    }
                }
            } catch (err) {
                newTransaction.status = "proses";
                newTransaction.sn = "VIP Reseller Timeout";
            }
        }
        // Simulated Payment Success Fallback
        else {
            await new Promise(resolve => setTimeout(resolve, 1200));
            newTransaction.status = "sukses";
            newTransaction.sn = "SN-" + Math.floor(10000000 + Math.random() * 90000000);
        }

        await dbCreateTransaction(newTransaction);
        res.json({ success: true, transaction: newTransaction, userBalance: updatedBalance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error memproses transaksi." });
    }
});

// User History
app.get('/api/transaksi/history/:username', async (req, res) => {
    try {
        const history = await dbGetUserTransactions(req.params.username);
        res.json({ success: true, transactions: history });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error memuat riwayat." });
    }
});

// Transaction Status Lookup
app.get('/api/transaksi/status/:trxId', async (req, res) => {
    try {
        const trx = await dbGetTransaction(req.params.trxId);
        if (trx) {
            res.json({ success: true, transaction: trx });
        } else {
            res.status(404).json({ success: false, message: "Transaksi tidak ditemukan." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Error mencari transaksi." });
    }
});

// --- ADMIN CONTROLLERS ---

async function adminVerify(req, res, next) {
    const adminUser = req.headers['x-admin-user'];
    if (!adminUser) return res.status(403).json({ success: false, message: "Akses ditolak." });
    try {
        const user = await dbGetUser(adminUser);
        if (user && user.tier === 'admin') {
            next();
        } else {
            res.status(403).json({ success: false, message: "Akses ditolak. Khusus Admin!" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Akses error." });
    }
}

app.get('/api/admin/summary', adminVerify, async (req, res) => {
    try {
        const summary = await dbGetAdminSummary();
        res.json({ success: true, summary });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error summary." });
    }
});

app.get('/api/admin/users', adminVerify, async (req, res) => {
    try {
        const users = await dbGetAllUsers();
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error list users." });
    }
});

app.post('/api/admin/users/balance', adminVerify, async (req, res) => {
    const { targetUsername, action, amount } = req.body;
    try {
        const user = await dbGetUser(targetUsername);
        if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });

        const val = parseInt(amount);
        const newBal = action === 'add' ? user.balance + val : Math.max(0, user.balance - val);

        await dbUpdateUserBalance(user.username, newBal);
        res.json({ success: true, message: `Saldo ${user.username} disesuaikan ke ${newBal}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error update balance." });
    }
});

app.get('/api/admin/transactions', adminVerify, async (req, res) => {
    try {
        const transactions = await dbGetAllTransactions();
        res.json({ success: true, transactions });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error list transactions." });
    }
});

app.get('/api/admin/deposits', adminVerify, async (req, res) => {
    try {
        const deposits = await dbGetAllDeposits();
        res.json({ success: true, deposits });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error list deposits." });
    }
});

app.post('/api/admin/deposits/approve', adminVerify, async (req, res) => {
    const { depositId } = req.body;
    try {
        const deposit = await dbGetDeposit(depositId);
        if (!deposit) return res.status(404).json({ success: false, message: "Deposit tidak ditemukan." });
        if (deposit.status !== 'pending') return res.status(400).json({ success: false, message: "Deposit sudah diproses." });

        const user = await dbGetUser(deposit.username);
        if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });

        await dbUpdateUserBalance(user.username, user.balance + deposit.total);
        await dbUpdateDepositStatus(depositId, 'sukses');

        res.json({ success: true, message: `Deposit ${depositId} disetujui!` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error approve deposit." });
    }
});

module.exports = app;
