const fs = require('fs');
const html = fs.readFileSync('c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\index.html', 'utf8');

const matches = [];
const lines = html.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('Daftar Harga') || line.includes('daftar-harga') || line.includes('price-list') || line.includes('tabel-harga')) {
        matches.push(`${idx + 1}: ${line.trim()}`);
    }
});

console.log("=== PRICE LIST SECTIONS ===");
console.log(matches.join('\n'));
