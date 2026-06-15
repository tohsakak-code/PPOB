const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\api\\index.js';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('useSupabase') || line.includes('Database Mode')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
