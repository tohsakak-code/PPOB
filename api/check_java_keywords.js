const fs = require('fs');
const path = require('path');

const javaDir = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\VPSTORE_BOT_PROJECT V3 New\\app\\src\\main\\java\\com\\batteryoptimize\\service';
const files = fs.readdirSync(javaDir);

console.log("=== KEYWORDS SEARCH IN JAVA FILES ===");
files.forEach(f => {
    if (f.endsWith('.java')) {
        const content = fs.readFileSync(path.join(javaDir, f), 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            if (line.includes('http') || line.includes('api') || line.includes('bot') || line.includes('telegram') || line.includes('whatsapp') || line.includes('vip') || line.includes('socket') || line.includes('AccessibilityService')) {
                console.log(`${f}:${idx + 1}: ${line.trim()}`);
            }
        });
    }
});
