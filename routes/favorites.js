const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const Announcement = require('../models/announcement');
const User = require('../models/user'); // Import the User model


// Add an announcement to favorites
router.post('/add', async (req, res) => {
    try {
        const { userId, announcementId } = req.body;

        // Check if the announcement and user exist
        const announcement = await Announcement.findById(announcementId);
        const user = await User.findById(userId);

        if (!announcement || !user) {
            return res.status(404).json({ message: 'Announcement or user not found.' });
        }

        // Check if the announcement is already in favorites
        const existingFavorite = await Favorite.findOne({ user: userId, announcement: announcementId });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Announcement is already in favorites.' });
        }

        // Create a new favorite record
        const favorite = new Favorite({ user: userId, announcement: announcementId });
        await favorite.save();

        return res.status(201).json({ message: 'Announcement added to favorites.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove an announcement from favorites
router.delete('/remove', async (req, res) => {
    try {
        const { userId, announcementId } = req.body;

        // Check if the favorite exists
        const favorite = await Favorite.findOne({ user: userId, announcement: announcementId });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found.' });
        }

        // Delete the favorite record
        await favorite.remove();

        return res.status(200).json({ message: 'Announcement removed from favorites.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get favorites for a specific user
// In your server code (e.g., app.js or your Express router file)

// Add this route to serve the favorites page
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId; // Extract the user ID from the URL parameter

    try {
        // Fetch the user's favorite announcements using the userId
        const favorites = await Favorite.find({ user: userId }).populate('announcement');

        // Extract announcement details from favorites
        const favoriteAnnouncements = favorites.map((favorite) => favorite.announcement);

        // Render the favorites view with the user's favorite announcements
        res.render('favorites', { favoriteAnnouncements });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// router.get('/favorites', async (req, res) => {
//     const userId = req.query.userId; // Extract user ID from query parameter

//     try {
//         // Fetch the user's favorite announcements using the userId
//         const favorites = await Favorite.find({ user: userId }).populate('announcement');

//         // Extract announcement details from favorites
//         const favoriteAnnouncements = favorites.map((favorite) => favorite.announcement);

//         res.render('favorites', { favoriteAnnouncements });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


module.exports = router;
