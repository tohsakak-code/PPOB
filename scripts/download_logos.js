const fs = require('fs');
const path = require('path');

const urls = {
    qris: "https://unpkg.com/idn-finlogos@2/dist/icons/qris.svg",
    dana: "https://unpkg.com/idn-finlogos@2/dist/icons/dana.svg",
    ovo: "https://raw.githubusercontent.com/HendraSurya/logo-svg/master/ovo.svg",
    gopay: "https://unpkg.com/idn-finlogos@2/dist/icons/gopay.svg",
    linkaja: "https://unpkg.com/idn-finlogos@2/dist/icons/linkaja.svg",
    bsi: "https://unpkg.com/idn-finlogos@2/dist/icons/bsi.svg",
    bca: "https://unpkg.com/idn-finlogos@2/dist/icons/bca.svg",
    mandiri: "https://unpkg.com/idn-finlogos@2/dist/icons/mandiri.svg",
    bni: "https://unpkg.com/idn-finlogos@2/dist/icons/bni.svg",
    bri: "https://unpkg.com/idn-finlogos@2/dist/icons/bri.svg"
};

const outputDir = path.join(__dirname, '..', 'images', 'logos');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadAll() {
    for (const [name, url] of Object.entries(urls)) {
        const dest = path.join(outputDir, `${name}.svg`);
        console.log(`Downloading ${name} from ${url}...`);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Failed to download ${name}: ${res.statusText}`);
                continue;
            }
            let svgText = await res.text();
            
            // If the xmlns attribute is missing from <svg ...>, inject it
            if (!svgText.includes('xmlns="') && !svgText.includes("xmlns='")) {
                svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
                console.log(`Injected xmlns namespace to ${name}.svg`);
            }
            
            fs.writeFileSync(dest, svgText, 'utf8');
            console.log(`Saved ${name}.svg successfully.`);
        } catch (e) {
            console.error(`Error downloading ${name}: ${e.message}`);
        }
    }
    console.log("Download complete!");
}

downloadAll();
