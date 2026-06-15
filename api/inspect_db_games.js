const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\products_vip.json';
if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log("Categories in database:", Object.keys(data));
    if (data.game) {
        console.log("Game brands in database:", Object.keys(data.game));
        for (const brand in data.game) {
            console.log(`- ${brand}: ${data.game[brand].length} products`);
            if (data.game[brand].length > 0) {
                console.log(`  Sample product:`, data.game[brand][0]);
            }
        }
    }
} else {
    console.log("products_vip.json does not exist!");
}
