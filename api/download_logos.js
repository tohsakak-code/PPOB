const fs = require('fs');
const path = require('path');
const https = require('https');

const logosDir = path.join(__dirname, '..', 'logos');
if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir);
}

const logoSources = {
    "telkomsel.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Telkomsel_2021_icon.svg/200px-Telkomsel_2021_icon.svg.png",
        "https://seeklogo.com/images/T/telkomsel-logo-8A7EEAEAE0-seeklogo.com.png"
    ],
    "indosat.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Indosat_Ooredoo_Hutchison_logo.svg/200px-Indosat_Ooredoo_Hutchison_logo.svg.png"
    ],
    "xl.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/XL_Axiata_logo_2016.svg/200px-XL_Axiata_logo_2016.svg.png"
    ],
    "three.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/3_logo.svg/200px-3_logo.svg.png"
    ],
    "axis.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Axis_logo_2014.svg/200px-Axis_logo_2014.svg.png"
    ],
    "smartfren.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Smartfren_logo.svg/200px-Smartfren_logo.svg.png"
    ],
    "pln.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_PLN.svg/200px-Logo_PLN.svg.png"
    ],
    "dana.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/200px-Logo_dana_blue.svg.png"
    ],
    "gopay.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/200px-Gopay_logo.svg.png"
    ],
    "ovo.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/200px-Logo_ovo_purple.svg.png"
    ],
    "shopeepay.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/ShopeePay_logo.svg/200px-ShopeePay_logo.svg.png"
    ],
    "linkaja.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/LinkAja_logo.svg/200px-LinkAja_logo.svg.png"
    ],
    "mobile_legends.png": [
        "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Mobile_Legends_Bang_Bang_logo_2023.png/200px-Mobile_Legends_Bang_Bang_logo_2023.png"
    ],
    "free_fire.png": [
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Garena_Free_Fire_logo.png/200px-Garena_Free_Fire_logo.png"
    ],
    "genshin_impact.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Genshin_Impact_logo.svg/200px-Genshin_Impact_logo.svg.png"
    ],
    "pubg_mobile.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/PUBG_Mobile_Logo.png/200px-PUBG_Mobile_Logo.png"
    ],
    "valorant.png": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_V_margin.svg/200px-Valorant_logo_-_V_margin.svg.png"
    ]
};

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };
        https.get(url, options, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => {});
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            file.close();
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    for (const [filename, urls] of Object.entries(logoSources)) {
        const dest = path.join(logosDir, filename);
        console.log(`Downloading ${filename}...`);
        let success = false;
        for (const url of urls) {
            try {
                await downloadImage(url, dest);
                console.log(`Successfully downloaded ${filename}`);
                success = true;
                break;
            } catch (err) {
                console.error(`Failed to download ${filename} from ${url}: ${err.message}`);
            }
        }
        if (!success) {
            console.error(`ALL SOURCES FAILED FOR ${filename}`);
        }
    }
}

run();
