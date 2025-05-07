const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'reviews.json');
function ensureFileExists() {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');  
        }
    } catch (error) {
        console.error('Error ensuring file exists:', error);
    }
}
function saveReviews(reviews) {
    ensureFileExists(); 
    try {
        fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
    } catch (error) {
        console.error('Error saving reviews:', error);
    }
}
function getReviews() {
    ensureFileExists(); 
    try {
        console.log('Fetching reviews from:', filePath);
        const data = fs.readFileSync(filePath, 'utf-8');
        const reviews = JSON.parse(data);
        console.log('Fetched reviews:', reviews);
        return reviews;
    } catch (error) {
        console.error('Error reading reviews file:', error);
        return []; 
    }
}
function addReview(req, res) {
    const { productId, review, rating, username } = req.body;

    const newReview = {
        productId,
        review,
        rating,
        username,
    };

    const reviews = getReviews();
    reviews.push(newReview);

    saveReviews(reviews);

    res.status(201).json({
        message: 'Review added successfully',
        review: newReview,
    });
}

module.exports = {
    addReview,
    getReviews
};