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

            const req = http.request(reqOpts, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON: " + data));
                    }
                });
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
            emoney: {}
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

                const isPLN = categoryName.includes("PLN") || categoryName.includes("TOKEN") || brandName.includes("PLN");
                const isEMoney = categoryName.includes("DANA") || categoryName.includes("GOPAY") || categoryName.includes("GO PAY") || categoryName.includes("OVO") || categoryName.includes("LINK") || categoryName.includes("SHOPEE") || categoryName.includes("E-MONEY") || categoryName.includes("WALLET") || categoryName.includes("CUSTOMER") || categoryName.includes("DRIVER") ||
                                 brandName.includes("DANA") || brandName.includes("GOPAY") || brandName.includes("GO PAY") || brandName.includes("OVO") || brandName.includes("LINK") || brandName.includes("SHOPEE") || brandName.includes("E-WALLET") || brandName.includes("MANDIRI") || brandName.includes("BRI") || brandName.includes("BNI") || brandName.includes("TAP") || brandName.includes("E-MONEY");

                if (isPLN) {
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

                if (brandName.includes("TELKOMSEL") || brandName.includes("TSEL")) {
                    brandKey = "Telkomsel";
                } else if (brandName.includes("INDOSAT") || brandName.includes("ISAT")) {
                    brandKey = "Indosat";
                } else if (brandName.includes("AXIS")) {
                    brandKey = "Axis";
                } else if (brandName.includes("XL")) {
                    brandKey = "XL";
                } else if (brandName.includes("TRI") || brandName.includes("THREE")) {
                    brandKey = "Three";
                } else if (brandName.includes("SMARTFREN") || brandName.includes("SMART")) {
                    brandKey = "Smartfren";
                } else if (brandName.includes("PLN")) {
                    brandKey = "PLN Prabayar";
                } else if (brandName.includes("DANA")) {
                    brandKey = "DANA";
                } else if (brandName.includes("GO PAY") || brandName.includes("GOPAY")) {
                    brandKey = "GoPay";
                } else if (brandName.includes("OVO")) {
                    brandKey = "OVO";
                } else if (brandName.includes("SHOPEE") || brandName.includes("SHOPEEPAY")) {
                    brandKey = "ShopeePay";
                } else if (brandName.includes("LINK") || brandName.includes("LINKAJA")) {
                    brandKey = "LinkAja";
                } else if (brandName.includes("MANDIRI")) {
                    brandKey = "Mandiri E-Money";
                } else if (brandName.includes("BRIZZI") || brandName.includes("BRI")) {
                    brandKey = "BRI Brizzi";
                } else if (brandName.includes("TAPCASH") || brandName.includes("BNI")) {
                    brandKey = "BNI TapCash";
                } else {
                    return;
                }

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

                let brandNormalized = brandRaw.split(' ').map(w => {
                    if (w.startsWith('(')) {
                        return '(' + w.charAt(1).toUpperCase() + w.slice(2).toLowerCase();
                    }
                    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                }).join(' ');

                if (gameName.includes("MOBILE LEGENDS") || gameName.includes("MLBB")) {
                    brandKey = brandNormalized;
                } else if (gameName.includes("FREE FIRE") || gameName.includes("FF")) {
                    brandKey = brandNormalized;
                } else if (gameName.includes("GENSHIN")) {
                    brandKey = brandNormalized;
                } else if (gameName.includes("PUBG")) {
                    brandKey = brandNormalized;
                } else if (gameName.includes("VALORANT")) {
                    brandKey = brandNormalized;
                } else if (gameName.includes("NETFLIX") || gameName.includes("SPOTIFY") || gameName.includes("DISNEY") || gameName.includes("PRIME") || gameName.includes("BSTATION") || gameName.includes("VIU") || gameName.includes("CANVA") || gameName.includes("CAPCUT") || gameName.includes("CHATGPT") || gameName.includes("GETCONTACT") || gameName.includes("ALIGHT MOTION")) {
                    brandKey = brandNormalized;
                } else {
                    return;
                }

                if (!newDB.game[brandKey]) {
                    newDB.game[brandKey] = [];
                }

                let rawPrice = item.price;
                if (typeof rawPrice === "object" && rawPrice !== null) {
                    rawPrice = rawPrice.basic || rawPrice.reseller || rawPrice.h2h || Object.values(rawPrice)[0];
                }
                const basePrice = parseInt(rawPrice) || 0;
                const sellingPrice = basePrice + 2500;
                
                const productId = item.code || item.sid || item.service || "";
                if (!productId) return;

                newDB.game[brandKey].push({
                    id: "GAME_" + productId,
                    name: item.name || item.service || "",
                    desc: `Top Up Game ${item.name || item.service || ""}`,
                    price: sellingPrice,
                    status: productStatus
                });
            });
        }

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
