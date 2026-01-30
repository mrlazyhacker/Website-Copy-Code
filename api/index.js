const axios = require('axios');

let serverSideKey = ""; 
let useCount = 0;
const ADMIN_KEY = "MR-LAZY-ADMIN-77"; // আপনার পার্মানেন্ট অ্যাডমিন কি

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ১. র‍্যান্ডম কি জেনারেট করা
    if (req.method === 'GET') {
        serverSideKey = "LAZY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        useCount = 0;
        return res.status(200).json({ key: serverSideKey });
    }

    // ২. এক্সট্রাকশন ও ভেরিফিকেশন
    if (req.method === 'POST') {
        const { url, key } = req.body;

        const isAdmin = (key === ADMIN_KEY);
        const isDynamicMatch = (serverSideKey !== "" && key === serverSideKey);

        // ভেরিফিকেশন ফেল করলে
        if (!isAdmin && !isDynamicMatch) {
            return res.status(403).json({ error: "ACCESS DENIED: INVALID OR EXPIRED KEY" });
        }

        // লিমিট চেক (অ্যাডমিনের জন্য আনলিমিটেড)
        if (!isAdmin && useCount >= 2) {
            serverSideKey = ""; 
            return res.status(403).json({ error: "LIMIT EXCEEDED: GET NEW KEY" });
        }

        try {
            const response = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html'
                },
                timeout: 10000
            });
            if(!isAdmin) useCount++;
            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).json({ error: "TARGET UNREACHABLE OR PROTECTED" });
        }
    }
};
