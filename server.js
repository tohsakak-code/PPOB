const app = require('./api/index.js');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server VPay PPOB running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
