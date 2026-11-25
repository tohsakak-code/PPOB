const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('providerSelect') || line.includes('operatorSelect')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
