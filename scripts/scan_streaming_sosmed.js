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
        console.log("Fetching VIP data...");
        const prepaidData = await fetchFromVip("https://vip-reseller.co.id/api/prepaid", { key: VIPRESELLER_API_KEY, sign, type: "services" });
        const gameData = await fetchFromVip("https://vip-reseller.co.id/api/game-feature", { key: VIPRESELLER_API_KEY, sign, type: "services" });

        const searchKeywords = ["INSTAGRAM", "TIKTOK", "YOUTUBE", "FACEBOOK", "TWITTER", "SPOTIFY", "NETFLIX", "DISNEY", "BSTATION", "PRIME", "CANVA", "CAPCUT", "STREAMING", "SOSMED", "SOCIAL", "FOLLOWERS", "LIKES"];
        
        console.log("\nSearching in PREPAID services:");
        const foundPrepaid = new Set();
        if (prepaidData.data) {
            prepaidData.data.forEach(item => {
                const cat = (item.category || "").toUpperCase();
                const brand = (item.brand || "").toUpperCase();
                const name = (item.name || "").toUpperCase();
                
                searchKeywords.forEach(kw => {
                    if (cat.includes(kw) || brand.includes(kw) || name.includes(kw)) {
                        foundPrepaid.add(`${cat} | ${brand}`);
                    }
                });
            });
        }
        console.log(Array.from(foundPrepaid));

        console.log("\nSearching in GAME/DIGITAL services:");
        const foundGame = new Set();
        if (gameData.data) {
            gameData.data.forEach(item => {
                const game = (item.game || item.category || "").toUpperCase();
                const name = (item.name || "").toUpperCase();
                
                searchKeywords.forEach(kw => {
                    if (game.includes(kw) || name.includes(kw)) {
                        foundGame.add(item.game || item.category || "Unknown");
                    }
                });
            });
        }
        console.log(Array.from(foundGame));

        console.log("\nChecking ALL E-Money brands in Prepaid data:");
        const emoneyBrands = new Set();
        if (prepaidData.data) {
            prepaidData.data.forEach(item => {
                const cat = (item.category || "").toUpperCase();
                const brand = (item.brand || "").toUpperCase();
                if (cat.includes("DANA") || cat.includes("GOPAY") || cat.includes("OVO") || cat.includes("LINKAJA") || cat.includes("SHOPEEPAY") || cat.includes("E-MONEY") || cat.includes("WALLET") || cat.includes("SALDO") ||
                    brand.includes("DANA") || brand.includes("GOPAY") || brand.includes("OVO") || brand.includes("LINKAJA") || brand.includes("SHOPEEPAY") || brand.includes("E-WALLET") || brand.includes("E-MONEY")) {
                    emoneyBrands.add(item.brand);
                }
            });
        }
        console.log(Array.from(emoneyBrands));

    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
