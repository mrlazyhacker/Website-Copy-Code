const axios = require('axios');

module.exports = async (req, res) => {
    // CORS হ্যান্ডলিং
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { url } = req.body;
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).json({ error: "Target unreachable" });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
