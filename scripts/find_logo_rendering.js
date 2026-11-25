const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\app.js';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('logo') || line.includes('provider-card') || line.includes('providerGrid')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
