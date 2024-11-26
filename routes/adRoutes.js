const express = require('express');
const Ad = require('../models/Ad');

const router = express.Router();

// Route to add a new ad
router.post('/add', async (req, res) => {
    const { imageUrl, link } = req.body;

    if (!imageUrl || !link) {
        return res.status(400).json({ error: 'Image URL and link are required.' });
    }

    try {
        const newAd = new Ad({ imageUrl, link });
        await newAd.save();
        res.status(201).json({ message: 'Ad created successfully!', ad: newAd });
    } catch (err) {
        res.status(500).json({ error: 'Error saving ad to database.', details: err });
    }
});

// Route to fetch a random ad
router.get('/serve', async (req, res) => {
    try {
        const ads = await Ad.find();
        if (ads.length === 0) {
            return res.status(404).json({ error: 'No ads available.' });
        }
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        res.json(randomAd);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching ads from database.', details: err });
    }
});

module.exports = router;
