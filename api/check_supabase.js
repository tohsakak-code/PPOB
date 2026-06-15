const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\api\\index.js', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('supabase') || line.includes('createClient')) {
        console.log(`${idx + 1}: ${line.trim()}`);
    }
});
