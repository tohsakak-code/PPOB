-- ============================================================
-- SQL SCHEMA FOR PPOB WEB APPLICATION ON SUPABASE
-- Project: zqijscunsoojehnsmykz
-- Jalankan query ini di Supabase -> SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    salt TEXT,
    name TEXT,
    tier TEXT DEFAULT 'member',
    balance NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    "forceLogout" BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Transactions
CREATE TABLE IF NOT EXISTS transactions (
    trx_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    code TEXT,
    product_name TEXT,
    target TEXT,
    zone_id TEXT,
    price NUMERIC DEFAULT 0,
    cost_price NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    sn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Deposits
CREATE TABLE IF NOT EXISTS deposits (
    deposit_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    amount NUMERIC DEFAULT 0,
    unique_code INT DEFAULT 0,
    total_transfer NUMERIC DEFAULT 0,
    payment_method TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Mutations
CREATE TABLE IF NOT EXISTS mutations (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    type TEXT,
    amount NUMERIC DEFAULT 0,
    "beforeBalance" NUMERIC DEFAULT 0,
    "afterBalance" NUMERIC DEFAULT 0,
    description TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Settings (Pengumuman, Telegram Bot, Markup, dll)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- ============================================================
-- SEED INITIAL DATA (Akun Admin & Sample Users)
-- ============================================================
INSERT INTO users (username, password, name, tier, balance, discount, "forceLogout")
VALUES 
    ('admin', 'coegkun2', 'GG payment Admin', 'admin', 999999999, 0, false),
    ('member1', '1234', 'Budi Santoso', 'member', 25000, 0, false),
    ('reseller2', '1234', 'GG payment Agen', 'reseller', 250000, 150, false),
    ('partner3', '1234', 'H2H VIP Partner', 'partner', 1500000, 350, false)
ON CONFLICT (username) DO NOTHING;

-- Seed default settings
INSERT INTO settings (key, value)
VALUES 
    ('announcement', 'Selamat datang di GG payment! Layanan topup game dan PPOB termurah, tercepat, dan terpercaya 24 Jam non-stop.'),
    ('broadcast', '{"active":false,"title":"Pemberitahuan","message":""}')
ON CONFLICT (key) DO NOTHING;
