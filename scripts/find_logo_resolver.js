const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\Downloads\\undangan-4.x\\ppob-web\\app.js';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('function getProviderLogo') || line.includes('getProviderLogo(')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
