const axios = require('axios');

// সার্ভার সাইড মেমোরি (Vercel সেশন)
let serverSideKey = "";
let useCount = 0;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ১. র‍্যান্ডম কি জেনারেট করা
    if (req.method === 'GET') {
        serverSideKey = "LAZY-" + Math.random().toString(36).substring(2, 8).toUpperCase() + Math.floor(10 + Math.random() * 90);
        useCount = 0; // নতুন কি মানে নতুন লিমিট
        return res.status(200).json({ key: serverSideKey });
    }

    // ২. সোর্স কোড এক্সট্রাকশন ও কি ভেরিফিকেশন
    if (req.method === 'POST') {
        const { url, key } = req.body;

        // কি চেক
        if (!serverSideKey || key !== serverSideKey) {
            return res.status(403).json({ error: "ACCESS DENIED: INVALID KEY" });
        }

        // লিমিট চেক
        if (useCount >= 2) {
            serverSideKey = ""; // কি এক্সপায়ার করে দেওয়া
            return res.status(403).json({ error: "LIMIT EXCEEDED: GET NEW KEY" });
        }

        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 10000
            });
            useCount++;
            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).json({ error: "TARGET UNREACHABLE" });
        }
    }
};
