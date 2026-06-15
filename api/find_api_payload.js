const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\api\\index.js';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('/api/transaksi') || line.includes('vip-reseller') || line.includes('gameZone') || line.includes('target')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
