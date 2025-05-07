const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/controller');


router.post('/add', reviewController.addReview);

router.get('/', (req, res) => {
    try {
        const reviews = reviewController.getReviews();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in GET /api/reviews route:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

module.exports = router;