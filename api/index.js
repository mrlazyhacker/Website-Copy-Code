const axios = require('axios');

module.exports = async (req, res) => {
    // CORS bypass করার জন্য হেডার
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const { url } = req.body;
        
        if (!url) return res.status(400).json({ error: "URL is required" });

        try {
            // আসল ব্রাউজারের হেডার ব্যবহার করে সোর্স কোড ফেচ করা
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://www.google.com/'
                },
                timeout: 15000 // ১৫ সেকেন্ড সময় দেওয়া হয়েছে
            });

            res.status(200).send(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "নিরাপত্তার কারণে এই সাইটের সোর্স কোড পাওয়া যাচ্ছে না বা সাইটটি অফলাইন।" });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
