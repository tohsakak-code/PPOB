const http = require('http');
const https = require('https');
const tls = require('tls');
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
        console.log("Fetching game services from VIP Reseller...");
        const response = await fetchFromVip("https://vip-reseller.co.id/api/game-feature", {
            key: VIPRESELLER_API_KEY,
            sign: sign,
            type: "services"
        });
        
        if (response.result && Array.isArray(response.data)) {
            const categories = new Set();
            const mlCategories = new Set();
            
            response.data.forEach(item => {
                const gameName = item.game || item.category || "";
                categories.add(gameName);
                if (gameName.toUpperCase().includes("MOBILE LEGENDS") || gameName.toUpperCase().includes("MLBB")) {
                    mlCategories.add(gameName);
                }
            });
            
            console.log("\nAll Game Categories found:");
            console.log(Array.from(categories).sort());
            
            console.log("\nMobile Legends specific categories found:");
            console.log(Array.from(mlCategories).sort());
        } else {
            console.log("Failed to fetch game list:", response.message);
        }
    } catch (e) {
        console.error("Error running script:", e.message);
    }
}

run();
