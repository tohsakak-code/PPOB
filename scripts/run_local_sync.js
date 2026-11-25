async function run() {
    try {
        console.log("Triggering local sync...");
        const res = await fetch("http://localhost:8000/api/admin/sync-vip-products", {
            method: "POST",
            headers: {
                "x-admin-user": "admin",
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        console.log("Sync Response:", data);
    } catch (e) {
        console.error("Sync trigger failed:", e.message);
    }
}
run();
