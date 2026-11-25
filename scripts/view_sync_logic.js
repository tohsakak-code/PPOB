const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\api\\index.js';
const content = fs.readFileSync(filePath, 'utf8');

// Print lines around "/api/admin/sync-vip-products" up to the game parsing logic
const lines = content.split('\n');
let startLine = -1;
lines.forEach((line, idx) => {
    if (line.includes('/api/admin/sync-vip-products')) {
        startLine = idx;
    }
});

if (startLine !== -1) {
    for (let i = startLine; i < startLine + 180; i++) {
        if (i < lines.length) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}
