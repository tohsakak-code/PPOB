const fs = require('fs');
const path = require('path');

function searchEnv(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git') {
                    searchEnv(fullPath);
                }
            } else if (file === '.env') {
                console.log("Found .env at:", fullPath);
                const content = fs.readFileSync(fullPath, 'utf8');
                console.log(content);
            }
        } catch (e) {}
    }
}

searchEnv('c:\\Users\\PC\\Downloads\\undangan-4.x');
