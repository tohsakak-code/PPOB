const fs = require('fs');
const file = process.argv[2] || 'app.js';
const query = process.argv[3];

if (!query) {
    console.log("Usage: node search_js.js <file> <query>");
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
console.log(`=== Matches for "${query}" in ${file} ===`);
lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(query.toLowerCase())) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
