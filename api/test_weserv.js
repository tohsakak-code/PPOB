const url = "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Telkomsel_2021_icon.svg/320px-Telkomsel_2021_icon.svg.png";

fetch(url)
    .then(res => {
        console.log(`Weserv Test Status: ${res.status} ${res.ok ? 'OK' : 'FAILED'}`);
    })
    .catch(err => {
        console.error("Weserv Test Error:", err.message);
    });
