 const reviews = [];

const MOVIE_NAME = "amaran";

document.querySelector(".review-box form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.querySelector("textarea").value.trim();
    
    // Get logged in user's name from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) {
        alert("Please log in to post a review");
        window.location.href = "index.html";
        return;
    }

    if (!rating || !comment) {
        alert("Please select a rating and write a comment.");
        return;
    }

    // Save review locally
    try {
        const newReview = {
            movie: MOVIE_NAME,
            userName: user.name,
            rating: parseInt(rating),
            text: comment,
            date: new Date().toISOString()
        };

        // Get existing reviews from localStorage
        const savedReviews = localStorage.getItem('movieReviews');
        let allReviews = savedReviews ? JSON.parse(savedReviews) : [];
        
        // Add new review
        allReviews.unshift(newReview);
        
        // Save back to localStorage
        localStorage.setItem('movieReviews', JSON.stringify(allReviews));
        
        // Update current display
        reviews.unshift(newReview);
        this.reset();
        displayReviews();
        
        alert('Review submitted successfully!');
    } catch (err) {
        console.error('Error saving review:', err);
        alert('Failed to save review. Please try again.');
    }
});

async function loadReviews() {
    const container = document.getElementById("reviews-container");
    try {
        // Simulating reviews since we don't have a backend
        // In a real application, this would be a fetch call to your backend
        const savedReviews = localStorage.getItem('movieReviews');
        if (savedReviews) {
            const allReviews = JSON.parse(savedReviews);
            // Filter reviews for this specific movie
            reviews.length = 0; // Clear existing reviews
            reviews.push(...allReviews.filter(r => r.movie === MOVIE_NAME));
            displayReviews();
        } else {
            container.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
        }
    } catch (err) {
        console.error('Error loading reviews:', err);
        container.innerHTML = "<p>Failed to load reviews. Please try again later.</p>";
    }
}

function displayReviews() {
    const container = document.getElementById("reviews-container");
    
    if (!reviews || reviews.length === 0) {
        container.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
        return;
    }

    container.innerHTML = reviews.map(review => {
        const reviewDate = new Date(review.date).toLocaleDateString();
        return `
            <div class="review-item">
                <div class="review-header">
                    <strong>${review.userName}</strong>
                    <span class="review-date">${reviewDate}</span>
                    <div class="rating-stars">${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}</div>
                </div>
                <p class="review-text">${review.text}</p>
                <hr/>
            </div>
        `;
    }).join('');
}

// Load reviews when page loads
loadReviews();