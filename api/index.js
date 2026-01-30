const axios = require('axios');

let serverSideKey = ""; 
let useCount = 0;
const ADMIN_KEY = "MR-LAZY-ADMIN-77"; // আপনার পার্মানেন্ট অ্যাডমিন কি

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ১. নতুন ডাইনামিক কি জেনারেট করা (generatekey.html থেকে কল হবে)
    if (req.method === 'GET') {
        serverSideKey = "LAZY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        useCount = 0; // নতুন কি তৈরি হলে লিমিট রিসেট হবে
        return res.status(200).json({ key: serverSideKey });
    }

    // ২. কি ভেরিফিকেশন ও ডেটা এক্সট্রাকশন
    if (req.method === 'POST') {
        const { url, key } = req.body;

        const isAdmin = (key === ADMIN_KEY);
        const isDynamicKey = (serverSideKey && key === serverSideKey);

        // যদি অ্যাডমিন কি অথবা ডাইনামিক কি—কোনোটাই না মেলে
        if (!isAdmin && !isDynamicKey) {
            return res.status(403).json({ error: "ACCESS DENIED: INVALID OR EXPIRED KEY" });
        }

        // লিমিট চেক (শুধুমাত্র ডাইনামিক কি-র জন্য ২ বার লিমিট)
        if (!isAdmin && useCount >= 2) {
            serverSideKey = ""; // কি এক্সপায়ার করে দেওয়া
            return res.status(403).json({ error: "LIMIT EXCEEDED: GET NEW KEY" });
        }

        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 10000
            });
            
            if (!isAdmin) useCount++; // অ্যাডমিন হলে লিমিট কমবে না
            
            res.status(200).send(response.data);
        } catch (error) {
            res.status(500).json({ error: "TARGET UNREACHABLE" });
        }
    }
};
