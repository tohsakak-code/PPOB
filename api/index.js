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
const VIPRESELLER_API_KEY = process.env.VIPRESELLER_API_KEY || "EbpRLj9UqRVytoF8qYHgZkhI6jkketMIkE0xy3VD5ByNSDcbzBAMaDnv4CfOw7P9";
const VIPRESELLER_ID = process.env.VIPRESELLER_ID || "n5ggjToO";
const APIGAMES_MERCHANT_ID = process.env.APIGAMES_MERCHANT_ID || "";
const APIGAMES_SECRET_KEY = process.env.APIGAMES_SECRET_KEY || "";
// ----------------------------------------

// --- HTTP PROXY TUNNEL FOR VIP RESELLER ON VERCEL ---
const http = require('http');
const https = require('https');
const tls = require('tls');

const VIP_PROXY_URL = "http://hqjwjlxg:w3rvqii4f1vo@38.154.203.95:5863";

function getUserProductPrice(prod, user) {
    if (!prod) return 0;
    let tierPrice = prod.price; // default Member price
    if (user) {
        if (user.tier === 'admin') {
            tierPrice = prod.cost_price !== undefined ? prod.cost_price : prod.price;
        } else if (user.tier === 'reseller' || user.tier === 'seller') {
            tierPrice = prod.price_reseller !== undefined ? prod.price_reseller : (prod.price - 1000);
        } else if (user.tier === 'partner') {
            tierPrice = prod.price_partner !== undefined ? prod.price_partner : (prod.price - 1500);
        }
    }
    const discount = (user && user.discount) ? parseInt(user.discount) : 0;
    return Math.max(0, tierPrice - discount);
}

function findProductById(productsObj, productId) {
    if (!productsObj) return null;
    for (const catKey in productsObj) {
        for (const brandKey in productsObj[catKey]) {
            const list = productsObj[catKey][brandKey];
            if (Array.isArray(list)) {
                const found = list.find(p => p.id === productId);
                if (found) return found;
            }
        }
    }
    return null;
}


function fetchFromVip(endpoint, payload) {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(endpoint);
            const parsedProxy = new URL(VIP_PROXY_URL);
            const auth = parsedProxy.username && parsedProxy.password 
                ? 'Basic ' + Buffer.from(parsedProxy.username + ':' + parsedProxy.password).toString('base64') 
                : '';

            const connectReq = http.request({
                host: parsedProxy.hostname,
                port: parsedProxy.port,
                method: 'CONNECT',
                path: `${url.host}:443`,
                headers: {
                    'Proxy-Connection': 'keep-alive',
                    Host: `${url.host}:443`,
                    ...(auth ? { 'Proxy-Authorization': auth } : {})
                }
            });

            connectReq.on('connect', (res, socket, head) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Proxy CONNECT failed with status: ${res.statusCode}`));
                    return;
                }

                const tlsSocket = tls.connect({
                    socket: socket,
                    servername: url.host,
                    rejectUnauthorized: false
                }, () => {
                    const bodyStr = new URLSearchParams(payload).toString();
                    const req = https.request({
                        hostname: url.hostname,
                        path: url.pathname + url.search,
                        method: 'POST',
                        createConnection: () => tlsSocket,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': Buffer.byteLength(bodyStr),
                            'User-Agent': 'Mozilla/5.0'
                        }
                    }, (response) => {
                        let responseData = '';
                        response.on('data', (chunk) => {
                            responseData += chunk;
                        });
                        response.on('end', () => {
                            try {
                                const parsed = JSON.parse(responseData);
                                resolve(parsed);
                            } catch (e) {
                                reject(new Error(`Gagal parse JSON response. Respon server: ${responseData.substring(0, 150)}`));
                            }
                        });
                    });

                    req.on('error', (err) => reject(err));
                    req.write(bodyStr);
                    req.end();
                });

                tlsSocket.on('error', (err) => reject(err));
            });

            connectReq.on('error', (err) => reject(err));
            connectReq.end();
        } catch (error) {
            reject(error);
        }
    });
}


// In-Memory Fallback for Web Settings
let memoryAnnouncement = "Selamat datang di VPay PPOB - Dapatkan harga khusus agen dengan mendaftar kemitraan secara gratis!";
let memoryBroadcast = { text: "Gunakan jalur API H2H gratis untuk integrasi aplikasi pulsa Anda!", active: true };
let memoryChats = {};
let memoryVouchers = {
    VPAYNEW: { code: 'VPAYNEW', discount: 5000, active: true },
    UNTUNGBERSAMA: { code: 'UNTUNGBERSAMA', discount: 2000, active: true }
};

app.use(cors());
app.use(express.json());
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
                admin: { username: 'admin', password: 'coegkun2', name: 'VPay Admin', tier: 'admin', balance: 999999999, discount: 0, forceLogout: false },
                member1: { username: 'member1', password: '1234', name: 'Budi Santoso', tier: 'member', balance: 25000, discount: 0, forceLogout: false },
                reseller2: { username: 'reseller2', password: '1234', name: 'Viper Store Agen', tier: 'reseller', balance: 250000, discount: 150, forceLogout: false },
                partner3: { username: 'partner3', password: '1234', name: 'H2H VIP Partner', tier: 'partner', balance: 1500000, discount: 350, forceLogout: false }
            },
            transactions: [],
            deposits: [],
            settings: {
                announcement: memoryAnnouncement,
                broadcast: memoryBroadcast
            },
            chats: {},
            vouchers: memoryVouchers
        };
        fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
        return initial;
    }
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!db.settings) {
        db.settings = { announcement: memoryAnnouncement, broadcast: memoryBroadcast };
    }
    if (!db.chats) db.chats = {};
    if (!db.vouchers) db.vouchers = memoryVouchers;
    return db;
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

async function dbLogMutation(username, type, amount, beforeBalance, afterBalance, description) {
    const mutation = {
        id: `MUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        username: username.trim().toLowerCase(),
        type,
        amount: parseFloat(amount) || 0,
        beforeBalance: parseFloat(beforeBalance) || 0,
        afterBalance: parseFloat(afterBalance) || 0,
        description,
        createdAt: new Date().toISOString()
    };
    
    if (useSupabase) {
        try {
            const { error } = await supabase.from('mutations').insert([mutation]);
            if (error) console.error("Supabase Mutation log error:", error);
        } catch (e) {
            console.error("Supabase Mutation catch error:", e.message);
        }
    } else {
        const db = readLocalDB();
        if (!db.mutations) db.mutations = [];
        db.mutations.unshift(mutation);
        writeLocalDB(db);
    }
}

async function dbGetUserMutations(username) {
    const cleanUsername = username.trim().toLowerCase();
    if (useSupabase) {
        const { data, error } = await supabase
            .from('mutations')
            .select('*')
            .eq('username', cleanUsername)
            .order('createdAt', { ascending: false });
        if (error) throw error;
        return data || [];
    } else {
        const db = readLocalDB();
        if (!db.mutations) db.mutations = [];
        return db.mutations.filter(m => m.username === cleanUsername);
    }
}

async function dbGetAllMutations() {
    if (useSupabase) {
        const { data, error } = await supabase
            .from('mutations')
            .select('*')
            .order('createdAt', { ascending: false });
        if (error) throw error;
        return data || [];
    } else {
        const db = readLocalDB();
        if (!db.mutations) db.mutations = [];
        return db.mutations;
    }
}

async function dbUpdateUserBalance(username, newBalance, description = null, mutationType = null, mutationAmount = 0) {
    const cleanUsername = username.trim().toLowerCase();
    let oldBalance = 0;
    
    // Get old balance
    if (useSupabase) {
        const { data } = await supabase.from('users').select('balance').eq('username', cleanUsername).maybeSingle();
        if (data) oldBalance = parseFloat(data.balance) || 0;
    } else {
        const db = readLocalDB();
        if (db.users[cleanUsername]) {
            oldBalance = parseFloat(db.users[cleanUsername].balance) || 0;
        }
    }

    // Update balance
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

    // Log Mutation if description is present
    if (description) {
        const mType = mutationType || (newBalance >= oldBalance ? 'credit' : 'debit');
        const mAmount = mutationAmount || Math.abs(newBalance - oldBalance);
        await dbLogMutation(username, mType, mAmount, oldBalance, newBalance, description);
    }
}

async function dbUpdateUserDetails(username, tier, discount) {
    const cleanUsername = username.trim().toLowerCase();
    if (useSupabase) {
        const { error } = await supabase
            .from('users')
            .update({ tier: tier, discount: parseInt(discount) })
            .eq('username', cleanUsername);
        if (error) throw error;
    } else {
        const db = readLocalDB();
        if (db.users[cleanUsername]) {
            db.users[cleanUsername].tier = tier;
            db.users[cleanUsername].discount = parseInt(discount);
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

        const { data: successTrx } = await supabase.from('transactions').select('price, cost_price').eq('status', 'sukses');
        const revenue = successTrx?.reduce((sum, t) => sum + (t.price || 0), 0) || 0;
        const netProfit = successTrx?.reduce((sum, t) => sum + Math.max(0, (t.price || 0) - (t.cost_price !== undefined && t.cost_price !== null ? t.cost_price : Math.max(0, (t.price || 0) - 1000))), 0) || 0;

        return {
            totalUsers: totalUsers || 0,
            totalBalance: totalBalance || 0,
            totalTransactions: totalTransactions || 0,
            pendingDeposits: pendingDeposits || 0,
            revenue,
            netProfit
        };
    } else {
        const db = readLocalDB();
        const usersList = Object.values(db.users);
        const successTrx = db.transactions.filter(t => t.status === 'sukses');
        const revenue = successTrx.reduce((sum, t) => sum + (t.price || 0), 0);
        const netProfit = successTrx.reduce((sum, t) => sum + Math.max(0, (t.price || 0) - (t.cost_price !== undefined && t.cost_price !== null ? t.cost_price : Math.max(0, (t.price || 0) - 1000))), 0);
        return {
            totalUsers: usersList.length,
            totalBalance: usersList.reduce((sum, u) => sum + (u.tier !== 'admin' ? u.balance : 0), 0),
            totalTransactions: db.transactions.length,
            pendingDeposits: db.deposits.filter(d => d.status === 'pending').length,
            revenue,
            netProfit
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

// Resilient Announcement Helper functions
async function dbGetAnnouncement() {
    if (useSupabase) {
        try {
            const { data } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'announcement')
                .maybeSingle();
            if (data && data.value) return data.value;
        } catch (e) {
            // Settings table not ready
        }
    }
    // Robust Fallback: read from local DB file
    const db = readLocalDB();
    if (db.settings && db.settings.announcement) {
        return db.settings.announcement;
    }
    return memoryAnnouncement;
}

async function dbSetAnnouncement(text) {
    memoryAnnouncement = text;
    // Always write to local JSON DB file first as a reliable backup
    try {
        const db = readLocalDB();
        if (!db.settings) db.settings = {};
        db.settings.announcement = text;
        writeLocalDB(db);
    } catch (e) {
        console.error("Gagal menyimpan pengumuman lokal", e.message);
    }
    
    if (useSupabase) {
        try {
            const { data } = await supabase
                .from('settings')
                .select('key')
                .eq('key', 'announcement')
                .maybeSingle();
            if (data) {
                await supabase
                    .from('settings')
                    .update({ value: text })
                    .eq('key', 'announcement');
            } else {
                await supabase
                    .from('settings')
                    .insert([{ key: 'announcement', value: text }]);
            }
        } catch (e) {
            console.error("Gagal menyimpan pengumuman ke Supabase", e.message);
        }
    }
}

// Resilient Broadcast Helper functions
async function dbGetBroadcast() {
    if (useSupabase) {
        try {
            const { data } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'broadcast')
                .maybeSingle();
            if (data && data.value) return JSON.parse(data.value);
        } catch (e) {
            // Supabase fallback
        }
    }
    // Robust Fallback: read from local DB file
    const db = readLocalDB();
    if (db.settings && db.settings.broadcast) {
        return db.settings.broadcast;
    }
    return memoryBroadcast;
}

async function dbSetBroadcast(broadcastObj) {
    memoryBroadcast = broadcastObj;
    // Always write to local JSON DB file first as a reliable backup
    try {
        const db = readLocalDB();
        if (!db.settings) db.settings = {};
        db.settings.broadcast = broadcastObj;
        writeLocalDB(db);
    } catch (e) {
        console.error("Gagal menyimpan broadcast lokal", e.message);
    }

    if (useSupabase) {
        try {
            const valStr = JSON.stringify(broadcastObj);
            const { data } = await supabase
                .from('settings')
                .select('key')
                .eq('key', 'broadcast')
                .maybeSingle();
            if (data) {
                await supabase
                    .from('settings')
                    .update({ value: valStr })
                    .eq('key', 'broadcast');
            } else {
                await supabase
                    .from('settings')
                    .insert([{ key: 'broadcast', value: valStr }]);
            }
        } catch (e) {
            console.error("Gagal menyimpan broadcast ke Supabase", e.message);
        }
    }
}

// Resilient Markup settings
async function dbGetMarkup() {
    if (useSupabase) {
        try {
            const { data } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'markup')
                .maybeSingle();
            if (data && data.value) return JSON.parse(data.value);
        } catch (e) {
            // Supabase fallback
        }
    }
    const db = readLocalDB();
    if (db.settings && db.settings.markup) {
        return db.settings.markup;
    }
    return { member: 2000, reseller: 1000, partner: 500 };
}

// Resilient VIP Products DB Functions
async function dbGetVipProducts() {
    if (useSupabase) {
        try {
            const { data } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'products_vip')
                .maybeSingle();
            if (data && data.value) return JSON.parse(data.value);
        } catch (e) {
            console.error("Failed to read VIP products from Supabase settings:", e.message);
        }
    }
    
    // Local fallback
    try {
        const localPath = path.join(__dirname, '..', 'products_vip.json');
        if (fs.existsSync(localPath)) {
            return JSON.parse(fs.readFileSync(localPath, 'utf8'));
        }
    } catch (e) {}

    // Check temp folder (Vercel read-only filesystem fallback)
    try {
        const tempPath = path.join('/tmp', 'products_vip.json');
        if (fs.existsSync(tempPath)) {
            return JSON.parse(fs.readFileSync(tempPath, 'utf8'));
        }
    } catch (e) {}
    
    return null;
}

async function dbSetVipProducts(productsObj) {
    if (useSupabase) {
        try {
            await supabase
                .from('settings')
                .upsert({ key: 'products_vip', value: JSON.stringify(productsObj) });
            return true;
        } catch (e) {
            console.error("Failed to save VIP products to Supabase settings:", e.message);
        }
    }
    
    // Save to local parent folder (localhost writable filesystem)
    try {
        const localPath = path.join(__dirname, '..', 'products_vip.json');
        fs.writeFileSync(localPath, JSON.stringify(productsObj, null, 2));
        return true;
    } catch (e) {
        // Fallback to /tmp folder on serverless environments
        try {
            const tempPath = path.join('/tmp', 'products_vip.json');
            fs.writeFileSync(tempPath, JSON.stringify(productsObj, null, 2));
            return true;
        } catch (tempErr) {
            console.error("Failed to write to both local and /tmp filesystems:", tempErr.message);
        }
    }
    return false;
}

// --- ROUTERS & CONTROLLERS ---

// Auth Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: "Semua input harus diisi!" });
    }

    // Alphanumeric validation (no symbols)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    const nameRegex = /^[a-zA-Z0-9\s]+$/;

    if (!alphanumericRegex.test(username)) {
        return res.status(400).json({ success: false, message: "Username hanya boleh berisi huruf dan angka saja (tanpa spasi/simbol)!" });
    }
    if (!alphanumericRegex.test(password)) {
        return res.status(400).json({ success: false, message: "Password hanya boleh berisi huruf dan angka saja (tanpa spasi/simbol)!" });
    }
    if (!nameRegex.test(name)) {
        return res.status(400).json({ success: false, message: "Nama lengkap hanya boleh berisi huruf, angka, dan spasi saja (tanpa simbol)!" });
    }

    try {
        const cleanUsername = username.trim().toLowerCase();
        const existing = await dbGetUser(cleanUsername);

        if (existing) {
            return res.status(400).json({ success: false, message: "Username sudah digunakan!" });
        }

        // Self-registered accounts are strictly "member" with 0 balance & 0 discount
        const newUser = {
            username: cleanUsername,
            password: password,
            name: name,
            tier: "member",
            balance: 0,
            discount: 0,
            forceLogout: false
        };

        const created = await dbCreateUser(newUser);
        res.json({ success: true, user: created, message: "Registrasi berhasil! Silakan login untuk memulai." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error saat registrasi." });
    }
});

// Admin-only User/Reseller Creation
app.post('/api/admin/users/create', async (req, res) => {
    const adminUser = req.headers['x-admin-user'];
    if (!adminUser) return res.status(401).json({ success: false, message: "Akses ditolak." });

    try {
        const adminProfile = await dbGetUser(adminUser);
        if (!adminProfile || adminProfile.tier !== 'admin') {
            return res.status(403).json({ success: false, message: "Hanya Admin yang dapat membuat reseller!" });
        }

        const { username, password, name, tier } = req.body;
        if (!username || !password || !name || !tier) {
            return res.status(400).json({ success: false, message: "Semua input harus diisi!" });
        }

        // Alphanumeric validation (no symbols)
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        const nameRegex = /^[a-zA-Z0-9\s]+$/;

        if (!alphanumericRegex.test(username)) {
            return res.status(400).json({ success: false, message: "Username hanya boleh berisi huruf dan angka saja (tanpa spasi/simbol)!" });
        }
        if (!alphanumericRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password hanya boleh berisi huruf dan angka saja (tanpa spasi/simbol)!" });
        }
        if (!nameRegex.test(name)) {
            return res.status(400).json({ success: false, message: "Nama lengkap hanya boleh berisi huruf, angka, dan spasi saja (tanpa simbol)!" });
        }

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
        } else if (tier === "admin") {
            initialBalance = 999999999;
            discount = 0;
        }

        const newUser = {
            username: cleanUsername,
            password: password,
            name: name,
            tier: tier,
            balance: initialBalance,
            discount: discount,
            forceLogout: false
        };

        await dbCreateUser(newUser);
        res.json({ success: true, message: `Akun ${tier.toUpperCase()} ${cleanUsername} berhasil didaftarkan!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error saat membuat user baru." });
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

app.post('/api/user/clear-logout/:username', async (req, res) => {
    const username = req.params.username.trim().toLowerCase();
    try {
        if (useSupabase) {
            await supabase.from('users').update({ forceLogout: false }).eq('username', username);
        } else {
            const db = readLocalDB();
            if (db.users[username]) {
                db.users[username].forceLogout = false;
                writeLocalDB(db);
            }
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
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
            depositId, 
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
        await dbUpdateUserBalance(user.username, newBalance, `Deposit Saldo via QRIS/Transfer (${depositId})`, 'credit', deposit.total);
        await dbUpdateDepositStatus(depositId, 'sukses');

        res.json({ success: true, balance: newBalance, message: "Deposit berhasil diproses!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error memproses pembayaran deposit" });
    }
});

// --- NEW FEATURES: MUTATIONS, ANALYTICS & SOCIAL PROOF ENDPOINTS ---

// 1. Get User Mutations
app.get('/api/users/:username/mutations', async (req, res) => {
    const { username } = req.params;
    try {
        const mutations = await dbGetUserMutations(username);
        res.json({ success: true, mutations });
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal mengambil riwayat mutasi saldo." });
    }
});

// 2. Get All Mutations (Admin)
app.get('/api/admin/mutations', adminVerify, async (req, res) => {
    try {
        const mutations = await dbGetAllMutations();
        res.json({ success: true, mutations });
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal mengambil riwayat mutasi admin." });
    }
});

// 3. Get Recent Successful Transactions (Social Proof - Public)
app.get('/api/recent-transactions', async (req, res) => {
    try {
        const transactions = await dbGetAllTransactions();
        // Filter only success transactions, get last 15, reverse to newest first
        const successTrx = transactions
            .filter(t => t.status === 'sukses')
            .slice(-15)
            .reverse();
            
        const masked = successTrx.map(t => {
            const user = t.username || 'user';
            const maskedUser = user.length > 3 
                ? user.slice(0, 2) + '***' + user.slice(-1)
                : user.slice(0, 1) + '***';
                
            return {
                id: t.trxId,
                username: maskedUser,
                product: t.product || 'Produk PPOB',
                price: t.price,
                date: t.date
            };
        });
        
        res.json({ success: true, transactions: masked });
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal mengambil transaksi terbaru." });
    }
});

// 4. Get Admin Dashboard Analytics (Admin)
app.get('/api/admin/analytics', adminVerify, async (req, res) => {
    try {
        const transactions = await dbGetAllTransactions();
        const users = await dbGetAllUsers();
        
        // Filter only success transactions
        const successTrx = transactions.filter(t => t.status === 'sukses');
        
        // Calculate general stats
        let totalRevenue = 0;
        let totalProfit = 0;
        successTrx.forEach(t => {
            const price = parseFloat(t.price) || 0;
            totalRevenue += price;
            
            // Profit calculation: real cost_price vs sale price, with estimation fallback
            let profit = 0;
            if (t.cost_price !== undefined && t.cost_price !== null && t.cost_price > 0) {
                profit = Math.max(0, price - t.cost_price);
            } else {
                profit = 1500; // default minimum profit
                const prodLower = (t.product || '').toLowerCase();
                if (prodLower.includes('mobile legends') || prodLower.includes('free fire') || prodLower.includes('pubg') || prodLower.includes('genshin') || prodLower.includes('game')) {
                    profit = Math.max(1500, Math.floor(price * 0.07));
                } else if (price >= 50000) {
                    profit = Math.floor(price * 0.04);
                } else if (price >= 10000) {
                    profit = 1200;
                } else {
                    profit = 800;
                }
            }
            
            const discount = parseFloat(t.promoDiscount) || 0;
            profit = Math.max(0, profit - discount);
            totalProfit += profit;
        });

        // Calculate daily trends for the last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const matchDateStr = `${day}/${month}/${year}`; // DD/MM/YYYY
            const matchDateStr2 = `${day}-${month}-${year}`; 
            
            last7Days.push({
                label: dateStr,
                matchDate: matchDateStr,
                matchDate2: matchDateStr2,
                revenue: 0,
                profit: 0,
                count: 0
            });
        }

        successTrx.forEach(t => {
            const tDate = t.date || '';
            const matchingDay = last7Days.find(day => {
                return tDate.includes(day.matchDate) || tDate.includes(day.matchDate2);
            });

            if (matchingDay) {
                const price = parseFloat(t.price) || 0;
                matchingDay.revenue += price;
                
                let profit = 0;
                if (t.cost_price !== undefined && t.cost_price !== null && t.cost_price > 0) {
                    profit = Math.max(0, price - t.cost_price);
                } else {
                    profit = 1500;
                    const prodLower = (t.product || '').toLowerCase();
                    if (prodLower.includes('mobile legends') || prodLower.includes('free fire') || prodLower.includes('pubg') || prodLower.includes('genshin') || prodLower.includes('game')) {
                        profit = Math.max(1500, Math.floor(price * 0.07));
                    } else if (price >= 50000) {
                        profit = Math.floor(price * 0.04);
                    } else if (price >= 10000) {
                        profit = 1200;
                    } else {
                        profit = 800;
                    }
                }
                const discount = parseFloat(t.promoDiscount) || 0;
                profit = Math.max(0, profit - discount);
                
                matchingDay.profit += profit;
                matchingDay.count += 1;
            }
        });

        // Category breakdown
        const categoryData = {
            game: 0,
            pulsa: 0,
            pln: 0,
            emoney: 0,
            streaming: 0,
            sosmed: 0,
            other: 0
        };

        successTrx.forEach(t => {
            const prodLower = (t.product || '').toLowerCase();
            const price = parseFloat(t.price) || 0;
            if (prodLower.includes('pulsa') || prodLower.includes('telkomsel') || prodLower.includes('indosat') || prodLower.includes('xl') || prodLower.includes('axis') || prodLower.includes('three') || prodLower.includes('smartfren')) {
                if (prodLower.includes('data') || prodLower.includes('quota') || prodLower.includes('paket')) {
                    categoryData.other += price; 
                } else {
                    categoryData.pulsa += price;
                }
            } else if (prodLower.includes('ml') || prodLower.includes('diamond') || prodLower.includes('free fire') || prodLower.includes('pubg') || prodLower.includes('roblox') || prodLower.includes('game') || prodLower.includes('genshin')) {
                categoryData.game += price;
            } else if (prodLower.includes('pln') || prodLower.includes('token') || prodLower.includes('listrik')) {
                categoryData.pln += price;
            } else if (prodLower.includes('dana') || prodLower.includes('gopay') || prodLower.includes('ovo') || prodLower.includes('linkaja') || prodLower.includes('shopeepay') || prodLower.includes('e-money') || prodLower.includes('wallet')) {
                categoryData.emoney += price;
            } else if (prodLower.includes('netflix') || prodLower.includes('spotify') || prodLower.includes('disney') || prodLower.includes('vidio') || prodLower.includes('premium')) {
                categoryData.streaming += price;
            } else if (prodLower.includes('follower') || prodLower.includes('like') || prodLower.includes('view') || prodLower.includes('subscriber') || prodLower.includes('sosmed')) {
                categoryData.sosmed += price;
            } else {
                categoryData.other += price;
            }
        });

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalProfit,
                totalTransactions: transactions.length,
                successTransactions: successTrx.length,
                totalUsers: Object.keys(users).length
            },
            trends: last7Days.map(d => ({
                label: d.label,
                revenue: d.revenue,
                profit: d.profit,
                count: d.count
            })),
            categories: categoryData
        });
    } catch (err) {
        console.error("Analytics error:", err);
        res.status(500).json({ success: false, message: "Gagal memproses data analitik" });
    }
});

// Process Transaction
app.post('/api/transaksi', async (req, res) => {
    const { username, productId, productName, target, gameZone, price, promoCode, promoDiscount } = req.body;
    if (!username || !productId || !target || !price) {
        return res.status(400).json({ success: false, message: "Data transaksi tidak lengkap!" });
    }

    try {
        let user;
        if (username === 'guest') {
            user = { username: 'guest', tier: 'member', balance: 0, discount: 0 };
        } else {
            user = await dbGetUser(username);
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan!" });
        }

        const productsObj = await dbGetVipProducts();
        const prod = findProductById(productsObj, productId);
        
        let expectedPrice = parseInt(price);
        if (prod) {
            expectedPrice = getUserProductPrice(prod, user);
            if (promoCode && promoDiscount) {
                expectedPrice = Math.max(0, expectedPrice - parseInt(promoDiscount));
            }
        }
        
        const finalPrice = expectedPrice;
        if (username !== 'guest' && user.balance < finalPrice && user.tier !== 'admin') {
            return res.status(400).json({ success: false, message: "Saldo tidak mencukupi!" });
        }

        const trxId = "TRX" + Date.now();
        const timestamp = new Date().toLocaleString();

        // Deduct user balance
        let updatedBalance = user.balance;
        if (username !== 'guest' && user.tier !== 'admin') {
            updatedBalance = user.balance - finalPrice;
            await dbUpdateUserBalance(user.username, updatedBalance, `Pembelian ${productName || productId} (${trxId})`, 'debit', finalPrice);
        }

        const newTransaction = {
            trx_id: trxId,
            trxId, 
            username: user.username,
            product: productName || productId,
            product_id: productId,
            productId, 
            target: gameZone ? `${target} (${gameZone})` : target,
            price: finalPrice,
            cost_price: (prod && prod.cost_price !== undefined) ? prod.cost_price : (prod ? (prod.price - 1000) : 0),
            status: "pending",
            sn: "Processing...",
            date: timestamp,
            promoCode: promoCode || "",
            promoDiscount: parseInt(promoDiscount) || 0
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
                            await dbUpdateUserBalance(user.username, updatedBalance, `Refund Pembelian Gagal: ${productName || productId} (${trxId})`, 'credit', finalPrice);
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
        // Apigames API Connection
        else if (APIGAMES_MERCHANT_ID && APIGAMES_SECRET_KEY) {
            try {
                const endpoint = "https://apigames.id/api/v1/transaksi";
                const signature = md5(APIGAMES_MERCHANT_ID + APIGAMES_SECRET_KEY + trxId);
                const payload = {
                    merchant_id: APIGAMES_MERCHANT_ID,
                    secret_key: APIGAMES_SECRET_KEY,
                    produk_code: productId,
                    tujuan: target,
                    zone: gameZone || "",
                    ref_id: trxId,
                    signature: signature
                };

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                if (result.status === "Sukses" || result.status === 1 || (result.data && result.data.status === "Sukses")) {
                    newTransaction.status = "sukses";
                    newTransaction.sn = (result.data && result.data.sn) || "APIGAMES-SUKSES";
                } else if (result.status === "Gagal" || result.status === 0 || (result.data && result.data.status === "Gagal")) {
                    newTransaction.status = "gagal";
                    newTransaction.sn = result.message || "Gagal dari Apigames";
                    if (user.tier !== 'admin') {
                        updatedBalance += finalPrice;
                        await dbUpdateUserBalance(user.username, updatedBalance, `Refund Pembelian Gagal: ${productName || productId} (${trxId})`, 'credit', finalPrice);
                    }
                } else {
                    newTransaction.status = "proses";
                    newTransaction.sn = "Diproses Apigames";
                }
            } catch (err) {
                newTransaction.status = "proses";
                newTransaction.sn = "Apigames API Timeout";
            }
        }
        // VIP Reseller Integration (Game and Prepaid PPOB)
        else if (VIPRESELLER_API_KEY && VIPRESELLER_ID) {
            try {
                const isGame = productId.startsWith("GAME_");
                const endpoint = isGame ? "https://vip-reseller.co.id/api/game-feature" : "https://vip-reseller.co.id/api/prepaid";
                const sign = md5(VIPRESELLER_ID + VIPRESELLER_API_KEY);
                
                const payload = {
                    key: VIPRESELLER_API_KEY,
                    sign: sign,
                    type: "order",
                    service: isGame ? productId.replace("GAME_", "") : productId,
                    target: target,
                    ref_id: trxId
                };

                if (isGame && gameZone) {
                    payload.zone = gameZone;
                }

                const result = await fetchFromVip(endpoint, payload);
                if (result.result) {
                    newTransaction.status = "sukses";
                    newTransaction.sn = result.data.sn || "VIP-SUKSES";
                } else {
                    newTransaction.status = "gagal";
                    newTransaction.sn = result.message || "Gagal VIP Reseller";
                    if (user.tier !== 'admin') {
                        updatedBalance += finalPrice;
                        await dbUpdateUserBalance(user.username, updatedBalance, `Refund Pembelian Gagal: ${productName || productId} (${trxId})`, 'credit', finalPrice);
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

// Public Announcement API
app.get('/api/settings/announcement', async (req, res) => {
    try {
        const text = await dbGetAnnouncement();
        res.json({ success: true, announcement: text });
    } catch (err) {
        res.json({ success: true, announcement: memoryAnnouncement });
    }
});

// Public Markup Settings API
app.get('/api/settings/markup', async (req, res) => {
    try {
        const markup = await dbGetMarkup();
        res.json({ success: true, markup });
    } catch (err) {
        res.json({ success: true, markup: { member: 2000, reseller: 1000, partner: 500 } });
    }
});

// Public Broadcast API
app.get('/api/settings/broadcast', async (req, res) => {
    try {
        const broadcast = await dbGetBroadcast();
        res.json({ success: true, broadcast });
    } catch (err) {
        res.json({ success: true, broadcast: memoryBroadcast });
    }
});

// Promo Voucher Validation
app.post('/api/voucher/validate', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Kode tidak boleh kosong!" });
    
    const db = readLocalDB();
    const vCode = code.trim().toUpperCase();
    const v = db.vouchers[vCode] || memoryVouchers[vCode];
    
    if (v && v.active) {
        res.json({ success: true, discount: v.discount });
    } else {
        res.status(404).json({ success: false, message: "Kode promo tidak valid atau expired." });
    }
});

// --- LIVE CHAT CONTROLLERS ---

app.get('/api/chat/messages/:session', (req, res) => {
    const db = readLocalDB();
    const msgs = db.chats[req.params.session] || memoryChats[req.params.session] || [];
    res.json({ success: true, messages: msgs });
});

app.post('/api/chat/send', (req, res) => {
    const { session, text, sender } = req.body;
    if (!session || !text || !sender) {
        return res.status(400).json({ success: false, message: "Missing params" });
    }
    const db = readLocalDB();
    const msg = { sender, text, timestamp: new Date().toLocaleTimeString() };
    
    if (!db.chats[session]) db.chats[session] = [];
    db.chats[session].push(msg);
    writeLocalDB(db);
    
    if (!memoryChats[session]) memoryChats[session] = [];
    memoryChats[session].push(msg);
    
    res.json({ success: true, message: msg });
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

        await dbUpdateUserBalance(user.username, newBal, `Penyesuaian Saldo oleh Admin: ${action === 'add' ? 'Tambah' : 'Kurang'} Rp ${val.toLocaleString('id-ID')}`, action === 'add' ? 'credit' : 'debit', val);
        res.json({ success: true, message: `Saldo ${user.username} disesuaikan ke ${newBal}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error update balance." });
    }
});

app.post('/api/admin/users/update', adminVerify, async (req, res) => {
    const { targetUsername, tier, discount } = req.body;
    try {
        const user = await dbGetUser(targetUsername);
        if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });

        await dbUpdateUserDetails(user.username, tier, discount);
        res.json({ success: true, message: `Data anggota ${user.username} berhasil disimpan!` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error update user details." });
    }
});

app.post('/api/admin/users/force-logout', adminVerify, async (req, res) => {
    const { targetUsername } = req.body;
    try {
        const username = targetUsername.trim().toLowerCase();
        if (useSupabase) {
            await supabase.from('users').update({ forceLogout: true }).eq('username', username);
        } else {
            const db = readLocalDB();
            if (db.users[username]) {
                db.users[username].forceLogout = true;
                writeLocalDB(db);
            }
        }
        res.json({ success: true, message: `Berhasil mengirim sinyal paksa logout untuk ${username}!` });
    } catch (e) {
        res.status(500).json({ success: false, message: "Gagal force logout." });
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

        await dbUpdateUserBalance(user.username, user.balance + deposit.total, `Deposit Saldo via Invoice ${depositId} (Persetujuan Admin)`, 'credit', deposit.total);
        await dbUpdateDepositStatus(depositId, 'sukses');

        res.json({ success: true, message: `Deposit ${depositId} disetujui!` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error approve deposit." });
    }
});

// Admin Announcement
app.post('/api/settings/announcement', adminVerify, async (req, res) => {
    const { announcement } = req.body;
    if (!announcement) {
        return res.status(400).json({ success: false, message: "Pengumuman tidak boleh kosong!" });
    }
    try {
        await dbSetAnnouncement(announcement);
        res.json({ success: true, message: "Pengumuman website berhasil diperbarui!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error memperbarui pengumuman." });
    }
});

// Admin Markup Settings
app.post('/api/settings/markup', adminVerify, async (req, res) => {
    const { member, reseller, partner } = req.body;
    try {
        const db = readLocalDB();
        if (!db.settings) db.settings = {};
        db.settings.markup = {
            member: parseInt(member) || 2000,
            reseller: parseInt(reseller) || 1000,
            partner: parseInt(partner) || 500
        };
        writeLocalDB(db);

        if (useSupabase) {
            try {
                await supabase
                    .from('settings')
                    .upsert({ key: 'markup', value: JSON.stringify(db.settings.markup) });
            } catch (e) {
                // Ignore Supabase error
            }
        }
        res.json({ success: true, message: "Pengaturan markup harga global berhasil disimpan!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error menyimpan pengaturan markup." });
    }
});

// Admin Broadcast
app.post('/api/settings/broadcast', adminVerify, async (req, res) => {
    const { text, active } = req.body;
    try {
        await dbSetBroadcast({ text, active });
        res.json({ success: true, message: "Pesan broadcast berhasil dikirim ke semua anggota!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error memperbarui broadcast." });
    }
});

// Admin Get Live Chats List
app.get('/api/admin/chats', adminVerify, (req, res) => {
    const db = readLocalDB();
    const activeChats = {};
    for (const session in db.chats) {
        const list = db.chats[session];
        if (list.length > 0) {
            activeChats[session] = list[list.length - 1]; // last message
        }
    }
    res.json({ success: true, chats: activeChats });
});

// Admin Vouchers Management
app.get('/api/admin/vouchers', adminVerify, (req, res) => {
    const db = readLocalDB();
    res.json({ success: true, vouchers: Object.values(db.vouchers) });
});

app.post('/api/admin/vouchers/create', adminVerify, (req, res) => {
    const { code, discount, active } = req.body;
    if (!code || !discount) return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    
    const db = readLocalDB();
    const vCode = code.trim().toUpperCase();
    db.vouchers[vCode] = { code: vCode, discount: parseInt(discount), active: active };
    writeLocalDB(db);
    
    res.json({ success: true, message: `Voucher ${vCode} berhasil ditambahkan!` });
});

app.post('/api/admin/vouchers/delete', adminVerify, (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Kode voucher harus disertakan." });

    const db = readLocalDB();
    const vCode = code.trim().toUpperCase();
    if (db.vouchers[vCode]) {
        delete db.vouchers[vCode];
        writeLocalDB(db);
        res.json({ success: true, message: `Voucher ${vCode} berhasil dihapus!` });
    } else {
        res.status(404).json({ success: false, message: "Voucher tidak ditemukan." });
    }
});

// --- PROVIDER LOGOS CUSTOMIZER ROUTERS ---
app.get('/api/provider-logos', async (req, res) => {
    try {
        const db = readLocalDB();
        const logos = db.providerLogos || {};
        res.json({ success: true, logos });
    } catch (e) {
        res.json({ success: false, logos: {} });
    }
});

app.post('/api/admin/provider-logos/update', adminVerify, async (req, res) => {
    const { provider, logoUrl } = req.body;
    if (!provider || logoUrl === undefined) {
        return res.status(400).json({ success: false, message: "Parameter tidak lengkap." });
    }
    try {
        const db = readLocalDB();
        if (!db.providerLogos) db.providerLogos = {};
        db.providerLogos[provider] = logoUrl.trim();
        writeLocalDB(db);
        res.json({ success: true, message: `Logo untuk ${provider} berhasil diperbarui!` });
    } catch (e) {
        res.status(500).json({ success: false, message: "Gagal menyimpan logo ke database." });
    }
});

// --- DYNAMIC PRODUCTS & VIP SYNC ROUTERS ---
const productsVipPath = path.join(__dirname, '..', 'products_vip.json');

app.get('/api/products', async (req, res) => {
    try {
        const products = await dbGetVipProducts();
        if (products) {
            return res.json({ success: true, products });
        }
    } catch (e) {
        console.error("Error reading VIP products:", e.message);
    }
    res.json({ success: true, products: null });
});

app.post('/api/admin/sync-vip-products', adminVerify, async (req, res) => {
    if (!VIPRESELLER_API_KEY || !VIPRESELLER_ID) {
        return res.status(400).json({ success: false, message: "Kredensial VIP Reseller belum dikonfigurasi!" });
    }

    try {
        const sign = md5(VIPRESELLER_ID + VIPRESELLER_API_KEY);
        
        // Fetch current markup settings dynamically
        const markupSettings = await dbGetMarkup();
        const memberMarkup = parseInt(markupSettings.member) || 2000;
        const resellerMarkup = parseInt(markupSettings.reseller) || 1000;
        const partnerMarkup = parseInt(markupSettings.partner) || 500;
        
        // 1. Fetch Prepaid PPOB Services via Proxy
        let prepaidData;
        try {
            prepaidData = await fetchFromVip("https://vip-reseller.co.id/api/prepaid", { key: VIPRESELLER_API_KEY, sign, type: "services" });
        } catch (e) {
            console.error("Failed to fetch VIP Prepaid via proxy:", e.message);
            return res.status(500).json({ 
                success: false, 
                message: `Gagal sinkronisasi Prepaid via Proxy. Detail: ${e.message}` 
            });
        }
        
        // 2. Fetch Game Services via Proxy
        let gameData;
        try {
            gameData = await fetchFromVip("https://vip-reseller.co.id/api/game-feature", { key: VIPRESELLER_API_KEY, sign, type: "services" });
        } catch (e) {
            console.error("Failed to fetch VIP Game via proxy:", e.message);
            return res.status(500).json({ 
                success: false, 
                message: `Gagal sinkronisasi Game via Proxy. Detail: ${e.message}` 
            });
        }

        console.log("VIP Prepaid Response Result:", prepaidData.result, "Type:", typeof prepaidData.result);
        console.log("VIP Game Response Result:", gameData.result, "Type:", typeof gameData.result);

        if (prepaidData.result !== true || gameData.result !== true) {
            return res.status(500).json({ 
                success: false, 
                message: `Gagal menarik data dari API VIP Reseller. Prepaid Result: ${prepaidData.result}, Message: ${prepaidData.message}. Game Result: ${gameData.result}, Message: ${gameData.message}` 
            });
        }

        const newDB = {
            pulsa: {},
            paketan: {},
            pln: {},
            game: {},
            emoney: {},
            streaming: {},
            sosmed: {}
        };

        let samplePrepaid = "";
        let sampleGame = "";

        if (prepaidData.data && prepaidData.data.length > 0) {
            samplePrepaid = JSON.stringify(prepaidData.data[0]);
        }
        if (gameData.data && gameData.data.length > 0) {
            sampleGame = JSON.stringify(gameData.data[0]);
        }

        try {
            // Parse Prepaid
            if (Array.isArray(prepaidData.data)) {
                prepaidData.data.forEach(item => {
                    if (!item) return;
                    
                    const categoryName = (item.category || "").toUpperCase();
                    const brandName = (item.brand || "").toUpperCase();
                    const itemStatus = (item.status || "").toLowerCase();

                    let productStatus = "tersedia";
                    if (itemStatus === "empty" || itemStatus === "gangguan" || itemStatus === "out of stock") {
                        productStatus = "gangguan";
                    } else if (itemStatus !== "normal" && itemStatus !== "available" && itemStatus !== "active") {
                        return; // Ignore other deactivated statuses
                    }
                    
                    let catKey = "";
                    let brandKey = "";
                    let markup = 1000;

                    const isPulsaCategory = categoryName.includes("PULSA");
                    const isUmum = categoryName === "UMUM";
                    const isDataCategory = categoryName.includes("DATA") || categoryName.includes("INTERNET") || categoryName.includes("KUOTA") || categoryName.includes("COMBO") || categoryName.includes("BRONET") || categoryName.includes("AIGO") || categoryName.includes("ALWAYSON") || categoryName.includes("HAPPY") || categoryName.includes("YELLOW") || categoryName.includes("OWSEM") || categoryName.includes("HOTROD") || categoryName.includes("XTRA");

                    const itemNameUpper = (item.name || "").toUpperCase();
                    const hasDataKeywords = itemNameUpper.includes("GB") || itemNameUpper.includes("MB") || itemNameUpper.includes("HARI") || itemNameUpper.includes("AKTIF") || itemNameUpper.includes("TELEPON") || itemNameUpper.includes("NELPON") || itemNameUpper.includes("SMS") || itemNameUpper.includes("WIFI") || itemNameUpper.includes("INTERNET") || itemNameUpper.includes("UNLIMITED") || itemNameUpper.includes("MENIT") || itemNameUpper.includes("COMBO") || itemNameUpper.includes("LITE") || itemNameUpper.includes("FLEX") || itemNameUpper.includes("KUOTA") || itemNameUpper.includes("CHAT") || itemNameUpper.includes("GAMES") || itemNameUpper.includes("VOUCHER");

                    // Determine brand dynamically first to help with operator checking
                    let brandRaw = item.brand || item.category || "";
                    if (!brandRaw) return;

                    let brandNormalized = brandRaw.trim();
                    brandKey = brandNormalized.split(' ').map(w => {
                        if (!w) return "";
                        if (w.startsWith('(')) {
                            return '(' + w.charAt(1).toUpperCase() + w.slice(2).toLowerCase();
                        }
                        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                    }).join(' ');

                    const brandUpper = brandKey.toUpperCase();
                    const isOperator = brandUpper.includes("TELKOMSEL") || brandUpper.includes("TSEL") || brandUpper.includes("INDOSAT") || brandUpper.includes("ISAT") || brandUpper.includes("AXIS") || brandUpper.includes("XL") || brandUpper.includes("TRI") || brandUpper.includes("THREE") || brandUpper.includes("SMARTFREN") || brandUpper.includes("SMART") || brandUpper.includes("BY.U") || categoryName.includes("INTERNET") || categoryName.includes("DATA") || categoryName.includes("KUOTA");

                    // Determine category
                    const isPLN = categoryName.includes("PLN") || categoryName.includes("TOKEN") || brandName.includes("PLN");
                    const isEMoney = categoryName.includes("DANA") || categoryName.includes("GOPAY") || categoryName.includes("GO PAY") || categoryName.includes("GO-PAY") || categoryName.includes("OVO") || categoryName.includes("LINKAJA") || categoryName.includes("LINK AJA") || categoryName.includes("SHOPEE") || categoryName.includes("E-MONEY") || categoryName.includes("WALLET") || categoryName.includes("GRAB") || categoryName.includes("MAXIM") || categoryName.includes("BRIZZI") || categoryName.includes("MANDIRI") || categoryName.includes("TAPCASH") || categoryName.includes("E-TOLL") || categoryName.includes("SALDO") || categoryName.includes("DOKU") || categoryName.includes("ISAKU") || categoryName.includes("KASPRO") ||
                                     brandName.includes("DANA") || brandName.includes("GOPAY") || brandName.includes("GO PAY") || brandName.includes("GO-PAY") || brandName.includes("OVO") || brandName.includes("LINKAJA") || brandName.includes("LINK AJA") || brandName.includes("SHOPEE") || brandName.includes("E-WALLET") || brandName.includes("GRAB") || brandName.includes("MAXIM") || brandName.includes("BRIZZI") || brandName.includes("MANDIRI") || brandName.includes("TAPCASH") || brandName.includes("E-TOLL") || brandName.includes("SALDO") || brandName.includes("DOKU") || brandName.includes("ISAKU") || brandName.includes("KASPRO") ||
                                     itemNameUpper.includes("DANA") || itemNameUpper.includes("GOPAY") || itemNameUpper.includes("GO PAY") || itemNameUpper.includes("GO-PAY") || itemNameUpper.includes("OVO") || itemNameUpper.includes("LINKAJA") || itemNameUpper.includes("LINK AJA") || itemNameUpper.includes("SHOPEE") || itemNameUpper.includes("E-MONEY") || itemNameUpper.includes("WALLET") || itemNameUpper.includes("GRAB") || itemNameUpper.includes("MAXIM") || itemNameUpper.includes("BRIZZI") || itemNameUpper.includes("MANDIRI") || itemNameUpper.includes("TAPCASH") || itemNameUpper.includes("E-TOLL") || itemNameUpper.includes("SALDO") || itemNameUpper.includes("DOKU") || itemNameUpper.includes("ISAKU") || itemNameUpper.includes("KASPRO");

                    const isStreaming = !isOperator && (categoryName.includes("NETFLIX") || categoryName.includes("SPOTIFY") || categoryName.includes("DISNEY") || categoryName.includes("BSTATION") || categoryName.includes("PRIME") || categoryName.includes("VIDIO") || categoryName.includes("CANVA") || categoryName.includes("CAPCUT") || categoryName.includes("YOUTUBE PREMIUM") || categoryName.includes("WETV") || categoryName.includes("VIU") || categoryName.includes("IQIYI") || categoryName.includes("STREAMING") ||
                                        brandName.includes("NETFLIX") || brandName.includes("SPOTIFY") || brandName.includes("DISNEY") || brandName.includes("BSTATION") || brandName.includes("PRIME") || brandName.includes("VIDIO") || brandName.includes("CANVA") || brandName.includes("CAPCUT") || brandName.includes("YOUTUBE PREMIUM") || brandName.includes("WETV") || brandName.includes("VIU") || brandName.includes("IQIYI") || brandName.includes("STREAMING") ||
                                        itemNameUpper.includes("NETFLIX") || itemNameUpper.includes("SPOTIFY") || itemNameUpper.includes("DISNEY") || itemNameUpper.includes("BSTATION") || itemNameUpper.includes("PRIME") || itemNameUpper.includes("VIDIO") || itemNameUpper.includes("CANVA") || itemNameUpper.includes("CAPCUT") || itemNameUpper.includes("YOUTUBE PREMIUM") || itemNameUpper.includes("WETV") || itemNameUpper.includes("VIU") || itemNameUpper.includes("IQIYI") || itemNameUpper.includes("STREAMING"));

                    const isSosmed = !isOperator && (categoryName.includes("INSTAGRAM") || categoryName.includes("TIKTOK") || categoryName.includes("FACEBOOK") || categoryName.includes("TWITTER") || categoryName.includes("FOLLOWERS") || categoryName.includes("LIKES") || categoryName.includes("VIEWS") || categoryName.includes("SUBSCRIBERS") || categoryName.includes("TELEGRAM") || categoryName.includes("SOSMED") || categoryName.includes("SOCIAL MEDIA") ||
                                     brandName.includes("INSTAGRAM") || brandName.includes("TIKTOK") || brandName.includes("FACEBOOK") || brandName.includes("TWITTER") || brandName.includes("FOLLOWERS") || brandName.includes("LIKES") || brandName.includes("VIEWS") || brandName.includes("SUBSCRIBERS") || brandName.includes("TELEGRAM") || brandName.includes("SOSMED") || brandName.includes("SOCIAL MEDIA") ||
                                     itemNameUpper.includes("INSTAGRAM") || itemNameUpper.includes("TIKTOK") || itemNameUpper.includes("FACEBOOK") || itemNameUpper.includes("TWITTER") || itemNameUpper.includes("FOLLOWERS") || itemNameUpper.includes("LIKES") || itemNameUpper.includes("VIEWS") || itemNameUpper.includes("SUBSCRIBERS") || itemNameUpper.includes("TELEGRAM") || itemNameUpper.includes("SOSMED") || itemNameUpper.includes("SOCIAL MEDIA"));

                    if (isStreaming) {
                        catKey = "streaming";
                    } else if (isSosmed) {
                        catKey = "sosmed";
                    } else if (isPLN) {
                        catKey = "pln";
                    } else if (isEMoney) {
                        catKey = "emoney";
                    } else if (isPulsaCategory || (isUmum && !hasDataKeywords)) {
                        catKey = "pulsa";
                    } else if (isDataCategory || (isUmum && hasDataKeywords)) {
                        catKey = "paketan";
                    } else {
                        catKey = "paketan";
                    }

                    // Category overrides for specific misclassified brands in the prepaid API
                    const brandUpperCheck = brandNormalized.toUpperCase();
                    if (brandUpperCheck.includes("RAZER GOLD") || brandUpperCheck.includes("ROBLOX") || brandUpperCheck.includes("STEAM") || brandUpperCheck.includes("PLAYSTATION") || brandUpperCheck.includes("NINTENDO") || brandUpperCheck.includes("XBOX") || brandUpperCheck.includes("GEMINI") || brandUpperCheck.includes("LITA") || brandUpperCheck.includes("PUBG") || brandUpperCheck.includes("FREE FIRE")) {
                        catKey = "game";
                    } else if (brandUpperCheck.includes("NEX PARABOLA") || brandUpperCheck.includes("ORANGE TV") || brandUpperCheck.includes("K-VISION") || brandUpperCheck.includes("K VISION") || brandUpperCheck.includes("VISION+") || brandUpperCheck.includes("VISIONPLUS") || brandUpperCheck.includes("TIX ID") || brandUpperCheck.includes("JUNGLELAND") || brandUpperCheck.includes("ANCOL")) {
                        catKey = "streaming";
                    } else if (brandUpperCheck.includes("LIKEE")) {
                        catKey = "sosmed";
                    }

                    // Set specific pretty names for E-Money brands
                    if (brandUpper.includes("TELKOMSEL") || brandUpper.includes("TSEL")) {
                        brandKey = "Telkomsel";
                    } else if (brandUpper.includes("INDOSAT") || brandUpper.includes("ISAT")) {
                        brandKey = "Indosat";
                    } else if (brandUpper.includes("AXIS")) {
                        brandKey = "Axis";
                    } else if (brandUpper.includes("XL")) {
                        brandKey = "XL";
                    } else if (brandUpper.includes("TRI") || brandUpper.includes("THREE")) {
                        brandKey = "Three";
                    } else if (brandUpper.includes("SMARTFREN") || brandUpper.includes("SMART")) {
                        brandKey = "Smartfren";
                    } else if (brandUpper.includes("PLN")) {
                        brandKey = "PLN Prabayar";
                    } else if (brandUpper.includes("DANA")) {
                        brandKey = "DANA";
                    } else if (brandUpper.includes("GOPAY") || brandUpper.includes("GO PAY") || brandUpper.includes("GO-PAY")) {
                        brandKey = "GoPay";
                    } else if (brandUpper.includes("OVO")) {
                        brandKey = "OVO";
                    } else if (brandUpper.includes("SHOPEEPAY") || brandUpper.includes("SHOPEE PAY")) {
                        brandKey = "ShopeePay";
                    } else if (brandUpper.includes("LINKAJA") || brandUpper.includes("LINK AJA")) {
                        brandKey = "LinkAja";
                    } else if (brandUpper.includes("MANDIRI")) {
                        brandKey = "Mandiri E-Money";
                    } else if (brandUpper.includes("BRIZZI") || brandUpper.includes("BRI")) {
                        brandKey = "BRI Brizzi";
                    } else if (brandUpper.includes("TAPCASH") || brandUpper.includes("BNI")) {
                        brandKey = "BNI TapCash";
                    } else if (brandUpper.includes("GRAB")) {
                        brandKey = "Grab";
                    } else if (brandUpper.includes("MAXIM")) {
                        brandKey = "Maxim";
                    } else if (brandUpper.includes("DOKU")) {
                        brandKey = "Doku";
                    }

                    if (!brandKey) return;

                    if (!newDB[catKey][brandKey]) {
                        newDB[catKey][brandKey] = [];
                    }

                    let rawPrice = item.price;
                    if (typeof rawPrice === "object" && rawPrice !== null) {
                        rawPrice = rawPrice.basic || rawPrice.reseller || rawPrice.h2h || Object.values(rawPrice)[0];
                    }
                    const basePrice = parseInt(rawPrice) || 0;
                    const memberPrice = basePrice + memberMarkup;
                    const resellerPrice = basePrice + resellerMarkup;
                    const partnerPrice = basePrice + partnerMarkup;
                    
                    const productId = item.code || item.sid || item.service || "";
                    if (!productId) return;

                    newDB[catKey][brandKey].push({
                        id: productId,
                        name: item.name || item.service || "",
                        desc: `Pengisian instan ${item.name || item.service || ""}`,
                        price: memberPrice,
                        price_reseller: resellerPrice,
                        price_partner: partnerPrice,
                        cost_price: basePrice,
                        status: productStatus
                    });
                });
            }

            // Parse Games and Streaming/Subscriptions
            if (Array.isArray(gameData.data)) {
                gameData.data.forEach(item => {
                    if (!item) return;

                    const gameName = (item.game || item.category || "").toUpperCase();
                    const itemStatus = (item.status || "").toLowerCase();

                    let productStatus = "tersedia";
                    if (itemStatus === "empty" || itemStatus === "gangguan" || itemStatus === "out of stock") {
                        productStatus = "gangguan";
                    } else if (itemStatus !== "normal" && itemStatus !== "available" && itemStatus !== "active") {
                        return;
                    }
                    
                    let brandKey = "";
                    let brandRaw = item.game || item.category || "";
                    if (!brandRaw) return;

                    // Title Case formatting
                    let brandNormalized = brandRaw.split(' ').map(w => {
                        if (!w) return "";
                        if (w.startsWith('(')) {
                            return '(' + w.charAt(1).toUpperCase() + w.slice(2).toLowerCase();
                        }
                        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                    }).join(' ');

                    brandKey = brandNormalized;

                    // --- MOBILE LEGENDS INTEGRATED CLEANUP AND SERVER GROUPING ---
                    const originalBrand = brandKey;
                    const brandUpper = brandKey.toUpperCase();
                    let displayName = item.name || item.service || "";

                    if (brandUpper.includes("MOBILE LEGENDS") || brandUpper.includes("MLBB") || brandUpper.includes("ML ")) {
                        if (brandUpper.includes("JOKI")) {
                            brandKey = "Mobile Legends (Joki Rank)";
                        } else {
                            brandKey = "Mobile Legends: Bang Bang";
                        }

                        // Prefix item name with its server/type if not already prefixed
                        let prefix = "";
                        if (originalBrand.includes("Brazil")) prefix = "[Brazil] ";
                        else if (originalBrand.includes("Global")) prefix = "[Global] ";
                        else if (originalBrand.includes("Malaysia")) prefix = "[Malaysia] ";
                        else if (originalBrand.includes("Philippines")) prefix = "[Philippines] ";
                        else if (originalBrand.includes("Russia")) prefix = "[Russia] ";
                        else if (originalBrand.includes("Singapore")) prefix = "[Singapore] ";
                        else if (originalBrand.includes("Turkey")) prefix = "[Turkey] ";
                        else if (originalBrand.includes("Membership")) prefix = "[Membership] ";
                        else if (originalBrand.includes("Vilog")) prefix = "[Vilog] ";
                        else if (originalBrand.includes("Slow")) prefix = "[Slow] ";
                        else if (originalBrand.includes("Promo")) prefix = "[Promo] ";
                        else if (originalBrand.includes("Gift")) prefix = "[Gift] ";
                        else if (originalBrand.includes("Mobile Legends A") || originalBrand.includes("Mobile Legends B")) prefix = "[Indonesia] ";

                        if (prefix && !displayName.startsWith("[")) {
                            displayName = prefix + displayName;
                        }
                    }

                    // Check if this is actually a streaming/productivity subscription instead of a game
                    const isStreamingApp = gameName.includes("NETFLIX") || gameName.includes("SPOTIFY") || gameName.includes("DISNEY") || gameName.includes("BSTATION") || gameName.includes("PRIME") || gameName.includes("VIDIO") || gameName.includes("CANVA") || gameName.includes("CAPCUT") || gameName.includes("YOUTUBE PREMIUM") || gameName.includes("WETV") || gameName.includes("VIU") || gameName.includes("IQIYI") || gameName.includes("CHATGPT") || gameName.includes("GETCONTACT") || gameName.includes("ALIGHT MOTION") || gameName.includes("STREAMING") ||
                                           brandNormalized.toUpperCase().includes("NETFLIX") || brandNormalized.toUpperCase().includes("SPOTIFY") || brandNormalized.toUpperCase().includes("DISNEY") || brandNormalized.toUpperCase().includes("BSTATION") || brandNormalized.toUpperCase().includes("PRIME") || brandNormalized.toUpperCase().includes("VIDIO") || brandNormalized.toUpperCase().includes("CANVA") || brandNormalized.toUpperCase().includes("CAPCUT") || brandNormalized.toUpperCase().includes("YOUTUBE") || brandNormalized.toUpperCase().includes("WETV") || brandNormalized.toUpperCase().includes("VIU") || brandNormalized.toUpperCase().includes("IQIYI") || brandNormalized.toUpperCase().includes("CHATGPT") || brandNormalized.toUpperCase().includes("GETCONTACT") || brandNormalized.toUpperCase().includes("ALIGHT MOTION") || brandNormalized.toUpperCase().includes("STREAMING");

                    let rawPrice = item.price;
                    if (typeof rawPrice === "object" && rawPrice !== null) {
                        rawPrice = rawPrice.basic || rawPrice.reseller || rawPrice.h2h || Object.values(rawPrice)[0];
                    }
                    const basePrice = parseInt(rawPrice) || 0;
                    const memberPrice = basePrice + memberMarkup;
                    const resellerPrice = basePrice + resellerMarkup;
                    const partnerPrice = basePrice + partnerMarkup;
                    
                    const productId = item.code || item.sid || item.service || "";
                    if (!productId) return;

                    if (isStreamingApp) {
                        if (!newDB.streaming[brandKey]) {
                            newDB.streaming[brandKey] = [];
                        }
                        newDB.streaming[brandKey].push({
                            id: "STREAMING_" + productId,
                            name: displayName,
                            desc: `Langganan ${displayName}`,
                            price: memberPrice,
                            price_reseller: resellerPrice,
                            price_partner: partnerPrice,
                            cost_price: basePrice,
                            status: productStatus
                        });
                    } else {
                        if (!newDB.game[brandKey]) {
                            newDB.game[brandKey] = [];
                        }
                        newDB.game[brandKey].push({
                            id: "GAME_" + productId,
                            name: displayName,
                            desc: `Top Up Game ${displayName}`,
                            price: memberPrice,
                            price_reseller: resellerPrice,
                            price_partner: partnerPrice,
                            cost_price: basePrice,
                            status: productStatus
                        });
                    }
                });
            }

            // --- GLOBAL DE-DUPLICATION SYSTEM FOR ALL CATEGORIES ---
            const deduplicateCategory = (catObj) => {
                if (!catObj) return;
                for (const brand in catObj) {
                    const items = catObj[brand];
                    if (!Array.isArray(items)) continue;

                    const seen = {};
                    items.forEach(item => {
                        // Extract normalized name (case insensitive, single spaced, strip route suffixes)
                        let normName = (item.name || "").toLowerCase()
                            .replace(/\s+/g, ' ')
                            .replace(/[\-\(]\s*s\d+A?\s*[\-\)]/gi, '')
                            .trim();
                        
                        const existing = seen[normName];
                        if (!existing) {
                            seen[normName] = item;
                        } else {
                            const newIsTersedia = item.status === "tersedia";
                            const oldIsTersedia = existing.status === "tersedia";

                            if (newIsTersedia && !oldIsTersedia) {
                                seen[normName] = item;
                            } else if (!newIsTersedia && oldIsTersedia) {
                                // Keep existing active one
                            } else {
                                // Both have same availability, keep the cheaper one
                                if (item.price < existing.price) {
                                    seen[normName] = item;
                                }
                            }
                        }
                    });
                    catObj[brand] = Object.values(seen);
                }
            };

            deduplicateCategory(newDB.pulsa);
            deduplicateCategory(newDB.paketan);
            deduplicateCategory(newDB.pln);
            deduplicateCategory(newDB.game);
            deduplicateCategory(newDB.emoney);
            deduplicateCategory(newDB.streaming);
            deduplicateCategory(newDB.sosmed);
        } catch (parseError) {
            console.error("Parsing error:", parseError);
            return res.status(500).json({
                success: false,
                message: `Gagal memproses/parse produk. Error: ${parseError.message}. Contoh Prepaid: ${samplePrepaid}. Contoh Game: ${sampleGame}`
            });
        }

        // Save to products_vip.json using resilient database abstraction layer
        const saved = await dbSetVipProducts(newDB);
        if (saved) {
            res.json({ success: true, message: "Sinkronisasi produk VIP Reseller berhasil diselesaikan!" });
        } else {
            res.status(500).json({ success: false, message: "Gagal menyimpan database produk." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error saat sinkronisasi produk." });
    }
});

// Update product price
app.post('/api/admin/update-product-price', adminVerify, async (req, res) => {
    const { category, brand, id, price } = req.body;
    if (!category || !brand || !id || price === undefined) {
        return res.status(400).json({ success: false, message: "Parameter tidak lengkap." });
    }
    try {
        const products = await dbGetVipProducts();
        if (!products) {
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
        }
        if (!products[category] || !products[category][brand]) {
            return res.status(404).json({ success: false, message: "Brand atau Kategori tidak ditemukan." });
        }
        const item = products[category][brand].find(p => p.id === id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
        }
        item.price = Number(price);
        const saved = await dbSetVipProducts(products);
        if (saved) {
            res.json({ success: true, message: `Harga produk ${item.name} berhasil diperbarui menjadi ${price}!` });
        } else {
            res.status(500).json({ success: false, message: "Gagal menyimpan database produk." });
        }
    } catch (e) {
        console.error("Error updating product price:", e);
        res.status(500).json({ success: false, message: "Error saat menyimpan harga produk." });
    }
});

module.exports = app;
