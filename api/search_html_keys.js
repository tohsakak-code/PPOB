const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\index.html', 'utf8');
const lines = content.split('\n');

console.log("=== KEYWORDS SEARCH IN HTML ===");
lines.forEach((line, idx) => {
    if (line.includes('Copyright') || line.includes('©') || line.includes('2026') || line.includes('2025') || line.includes('copyright') || line.includes('container') || line.includes('main-content') || line.includes('hubungi') || line.includes('kontak')) {
        if (line.length < 200) { // Limit output line length
            console.log(`${idx + 1}: ${line.trim()}`);
        } else {
            console.log(`${idx + 1}: ${line.trim().substring(0, 200)}...`);
        }
    }
});
