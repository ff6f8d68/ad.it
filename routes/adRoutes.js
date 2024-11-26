const express = require('express');
const Ad = require('../models/Ad');
const router = express.Router();

// Route to add a new ad
router.post('/add', async (req, res) => {
    const { imageUrl, link, size } = req.body;

    if (!imageUrl || !link || !size) {
        return res.status(400).json({ error: 'Image URL, link, and size are required.' });
    }

    try {
        const newAd = new Ad({ imageUrl, link, size }); // Make sure 'size' is stored in your database
        await newAd.save();
        res.status(201).json({ message: 'Ad created successfully!', ad: newAd });
    } catch (err) {
        res.status(500).json({ error: 'Error saving ad to database.', details: err });
    }
});

// Route to fetch a random ad based on image size
router.get('/serve/:size', async (req, res) => {
    const { size } = req.params;

    try {
        // Find ads that match the requested size
        const ads = await Ad.find({ size });

        if (ads.length === 0) {
            return res.status(404).json({ error: `No ads available for size: ${size}` });
        }

        // Pick a random ad from the filtered list
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        res.json(randomAd);  // Send the ad data as a response
    } catch (err) {
        res.status(500).json({ error: 'Error fetching ads from database.', details: err });
    }
});

module.exports = router;
