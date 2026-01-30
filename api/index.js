const axios = require('axios');

// সার্ভারে কি এবং ব্যবহারের সংখ্যা জমা রাখার জন্য
let currentServerKey = "";
let remainingUses = 0;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ১. র‍্যান্ডম কি জেনারেট করা (generatekey.html থেকে কল হবে)
    if (req.method === 'GET') {
        currentServerKey = "LAZY-" + Math.random().toString(36).substring(2, 9).toUpperCase();
        remainingUses = 2; // প্রতি কি-তে ২ বার ব্যবহারের লিমিট
        return res.status(200).json({ key: currentServerKey });
    }

    // ২. সোর্স কোড ডাউনলোড এবং কি ভেরিফিকেশন
    if (req.method === 'POST') {
        const { url, key } = req.body;

        // কি চেক করা হচ্ছে
        if (!currentServerKey || key !== currentServerKey) {
            return res.status(403).json({ error: "INVALID OR EXPIRED KEY!" });
        }

        if (remainingUses <= 0) {
            currentServerKey = ""; // লিমিট শেষ হলে কি ডিলিট করে দেওয়া
            return res.status(403).json({ error: "LIMIT EXCEEDED! GET NEW KEY." });
        }

        try {
            const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            remainingUses--; // একবার ব্যবহার সফল হলে লিমিট কমানো
            
            res.status(200).send(response.data);
        } catch (e) {
            res.status(500).send("TARGET UNREACHABLE");
        }
    }
};
