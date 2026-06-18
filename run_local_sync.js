const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

const VIPRESELLER_API_KEY = "EbpRLj9UqRVytoF8qYHgZkhI6jkketMIkE0xy3VD5ByNSDcbzBAMaDnv4CfOw7P9";
const VIPRESELLER_ID = "n5ggjToO";
const sign = crypto.createHash('md5').update(VIPRESELLER_ID + VIPRESELLER_API_KEY).digest('hex');

const VIP_PROXY_URL = "http://hqjwjlxg:w3rvqii4f1vo@38.154.203.95:5863";

function fetchFromVip(endpoint, payload) {
    return new Promise((resolve, reject) => {
        try {
            const urlObj = new URL(endpoint);
            const proxyParts = VIP_PROXY_URL.replace('http://', '').split('@');
            const auth = proxyParts[0];
            const hostParts = proxyParts[1].split(':');
            const proxyHost = hostParts[0];
            const proxyPort = parseInt(hostParts[1]);

            const payloadStr = Object.keys(payload).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`).join('&');

            const reqOpts = {
                host: proxyHost,
                port: proxyPort,
                method: 'POST',
                path: urlObj.href,
                headers: {
                    'Host': urlObj.host,
                    'Proxy-Authorization': 'Basic ' + Buffer.from(auth).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.from(payloadStr).length
                }
            };

            console.log(`Sending request to ${endpoint}...`);
            const req = http.request(reqOpts, (res) => {
                console.log(`Received headers from ${endpoint}: Status ${res.statusCode}`);
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        console.log(`Response completed for ${endpoint}`);
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON: " + data));
                    }
                });
            });

            req.setTimeout(60000, () => {
                req.destroy(new Error("Request timeout after 60 seconds"));
            });

            req.on('error', reject);
            req.write(payloadStr);
            req.end();
        } catch (e) {
            reject(e);
        }
    });
}

async function run() {
    try {
        console.log("Starting Local Sync...");
        const prepaidData = await fetchFromVip("https://vip-reseller.co.id/api/prepaid", { key: VIPRESELLER_API_KEY, sign, type: "services" });
        const gameData = await fetchFromVip("https://vip-reseller.co.id/api/game-feature", { key: VIPRESELLER_API_KEY, sign, type: "services" });

        if (prepaidData.result !== true || gameData.result !== true) {
            console.error("API error!");
            process.exit(1);
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
                    return;
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
                    markup = 2000;
                } else if (isSosmed) {
                    catKey = "sosmed";
                    markup = 2500;
                } else if (isPLN) {
                    catKey = "pln";
                    markup = 1500;
                } else if (isEMoney) {
                    catKey = "emoney";
                    markup = 1000;
                } else if (isPulsaCategory || (isUmum && !hasDataKeywords)) {
                    catKey = "pulsa";
                    markup = 1000;
                } else if (isDataCategory || (isUmum && hasDataKeywords)) {
                    catKey = "paketan";
                    markup = 2000;
                } else {
                    catKey = "paketan";
                    markup = 2000;
                }

                // Category overrides for specific misclassified brands in the prepaid API
                const brandUpperCheck = brandNormalized.toUpperCase();
                if (brandUpperCheck.includes("RAZER GOLD") || brandUpperCheck.includes("ROBLOX") || brandUpperCheck.includes("STEAM") || brandUpperCheck.includes("PLAYSTATION") || brandUpperCheck.includes("NINTENDO") || brandUpperCheck.includes("XBOX") || brandUpperCheck.includes("GEMINI") || brandUpperCheck.includes("LITA") || brandUpperCheck.includes("PUBG") || brandUpperCheck.includes("FREE FIRE")) {
                    catKey = "game";
                    markup = 2500;
                } else if (brandUpperCheck.includes("NEX PARABOLA") || brandUpperCheck.includes("ORANGE TV") || brandUpperCheck.includes("K-VISION") || brandUpperCheck.includes("K VISION") || brandUpperCheck.includes("VISION+") || brandUpperCheck.includes("VISIONPLUS") || brandUpperCheck.includes("TIX ID") || brandUpperCheck.includes("JUNGLELAND") || brandUpperCheck.includes("ANCOL")) {
                    catKey = "streaming";
                    markup = 2000;
                } else if (brandUpperCheck.includes("LIKEE")) {
                    catKey = "sosmed";
                    markup = 2500;
                }

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
                const sellingPrice = basePrice + markup;
                
                const productId = item.code || item.sid || item.service || "";
                if (!productId) return;

                newDB[catKey][brandKey].push({
                    id: productId,
                    name: item.name || item.service || "",
                    desc: `Pengisian instan ${item.name || item.service || ""}`,
                    price: sellingPrice,
                    status: productStatus
                });
            });
        }

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
                const sellingPrice = basePrice + 2500;
                
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
                        price: sellingPrice,
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
                        price: sellingPrice,
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
        const targetPath = path.join(__dirname, 'products_vip.json');
        fs.writeFileSync(targetPath, JSON.stringify(newDB, null, 2));
        console.log("Database Sync Completed!");
        
        console.log("Active E-Money Brands:");
        console.log(Object.keys(newDB.emoney));
        console.log("Active Game/Apps Brands:");
        console.log(Object.keys(newDB.game).filter(k => k.includes("Netflix") || k.includes("Spotify") || k.includes("Canva") || k.includes("Viu") || k.includes("Disney") || k.includes("Bstation") || k.includes("Chatgpt") || k.includes("Capcut")));
    } catch (e) {
        console.error(e.message);
    }
}

run();
