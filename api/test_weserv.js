async function test() {
    try {
        const res = await fetch("http://localhost:8000/images/logos/dana.svg");
        console.log(`Status: ${res.status} ${res.ok ? 'OK' : 'FAILED'}`);
        if (res.ok) {
            const text = await res.text();
            console.log(`Length: ${text.length} bytes`);
            console.log(`Mime Type: ${res.headers.get("content-type")}`);
            console.log(`Sample: ${text.slice(0, 100)}`);
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}
test();
