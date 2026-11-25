const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:\\Users\\PC\\Downloads\\undangan-4.x\\ppob-web\\products_vip.json', 'utf8'));

console.log("=== Checking Mobile Legends B Items ===");
if (data.game && data.game["Mobile Legends B"]) {
    const items = data.game["Mobile Legends B"];
    console.log(`Total items in Mobile Legends B: ${items.length}`);
    console.log("First 30 items:");
    items.slice(0, 30).forEach(item => {
        console.log(`ID: ${item.id} | Name: ${item.name} | Price: ${item.price} | Status: ${item.status}`);
    });
} else {
    console.log("Mobile Legends B not found!");
}
