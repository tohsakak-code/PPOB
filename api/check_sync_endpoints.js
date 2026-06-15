const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\api\\index.js', 'utf8');
const lines = content.split('\n');

console.log("=== SYNC ENDPOINTS SEARCH IN API/INDEX.JS ===");
lines.forEach((line, idx) => {
    if (line.includes('sync-vip-products') || line.includes('sync-products') || line.includes('products_vip.json') || line.includes('/api/admin/sync')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
