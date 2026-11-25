const fs = require('fs');
const path = require('path');

const dirs = [
    'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web',
    'c:\\Users\\PC\\Downloads\\undangan-4.x\\VPSTORE_BOT_PROJECT V3 New'
];

dirs.forEach(dir => {
    const envPath = path.join(dir, '.env');
    if (fs.existsSync(envPath)) {
        console.log(`Found .env in ${dir}`);
        const content = fs.readFileSync(envPath, 'utf8');
        console.log(content.split('\n').map(l => {
            const parts = l.split('=');
            if (parts.length > 1) {
                return `${parts[0]}=***masked***`;
            }
            return l;
        }).join('\n'));
    } else {
        console.log(`No .env in ${dir}`);
    }
});
