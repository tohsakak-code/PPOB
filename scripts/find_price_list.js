const fs = require('fs');
const path = require('path');

const indexHtmlPath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\index.html';
const appJsPath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\app.js';

console.log("=== SEARCH IN index.html ===");
const htmlLines = fs.readFileSync(indexHtmlPath, 'utf8').split('\n');
htmlLines.forEach((line, idx) => {
    if (line.toLowerCase().includes('daftar-harga') || line.toLowerCase().includes('daftar harga')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});

console.log("=== SEARCH IN app.js ===");
const jsLines = fs.readFileSync(appJsPath, 'utf8').split('\n');
jsLines.forEach((line, idx) => {
    if (line.toLowerCase().includes('daftar-harga') || line.toLowerCase().includes('daftar harga')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
