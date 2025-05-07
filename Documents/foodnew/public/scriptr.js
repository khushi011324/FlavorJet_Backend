document.addEventListener('DOMContentLoaded', () => {
    // Load existing reviews when the page loads
    fetchReviews();

    // Add event listener for form submission
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = document.getElementById('productId').value;
        const username = document.getElementById('username').value;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        // Send review data to the server
        fetch('http://localhost:8008/api/reviews/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, username, rating, review }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Review added:', data);
                // Reload reviews after adding a new one
                fetchReviews();
                // Clear the form
                reviewForm.reset();
            })
            .catch(error => console.error('Error:', error));
    });
});

// Function to fetch and display reviews
function fetchReviews() {
    fetch('http://localhost:8008/api/reviews')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched reviews:', data); // Debugging line
            const reviewsContainer = document.getElementById('reviewsContainer');
            reviewsContainer.innerHTML = ''; // Clear previous reviews
            data.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';

                // Generate stars based on rating
                let stars = '';
                for (let i = 0; i < review.rating; i++) {
                    stars += '<span class="star">&#9733;</span>'; // Filled star
                }
                for (let i = review.rating; i < 5; i++) {
                    stars += '<span class="star empty">&#9734;</span>'; // Empty star
                }

                reviewElement.innerHTML = `
                    <p><strong>Product ID:</strong> ${review.productId}</p>
                    <p><strong>Username:</strong> ${review.username}</p>
                    <p><strong>Rating:</strong> <span class="star-rating">${stars}</span></p>
                    <p><strong>Review:</strong> ${review.review}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

// Update current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();