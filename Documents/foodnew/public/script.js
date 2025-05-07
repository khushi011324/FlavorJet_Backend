const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Fetch and Display Blog Posts
document.addEventListener("DOMContentLoaded", function() {
    const blogContainer = document.getElementById("blog");

    fetch("http://localhost:8008/blogs")
        .then(response => response.json())
        .then(blogs => {
            blogContainer.innerHTML = blogs.map((blog, index) => `
                <div class="blog-box">
                    <div class="blog-img">
                        <img src="${blog.imageUrl || 'image/default.png'}" alt="Blog Image">
                    </div>
                    <div class="blog-details">
                        <h4>${blog.title} by ${blog.chef}</h4>
                        <p>${blog.content}</p>
                        <div class="blog-actions">
                            <button id="like-${index}" class="action-btn" onclick="likeBlog(${index})">
                                <i class="fas fa-heart"></i> Like
                            </button>
                            <button id="share-${index}" class="action-btn" onclick="shareBlog(${index})">
                                <i class="fas fa-share-alt"></i> Share
                            </button>
                            <button id="comment-${index}" class="action-btn" onclick="commentBlog(${index})">
                                <i class="fas fa-comment-dots"></i> Comment
                            </button>
                            <button id="save-${index}" class="action-btn" onclick="saveBlog(${index})">
                                <i class="fas fa-bookmark"></i> Save
                            </button>
                        </div>
                        <div id="comments-${index}" class="comments-section">
                            <!-- Comments will be injected here -->
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error("Error fetching blogs:", error);
            blogContainer.innerHTML = "<p>Failed to load blog posts.</p>";
        });
});

const likeBlog = (index) => {
    fetch(`http://localhost:8008/blogs/${index}/like`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            const likeButton = document.getElementById(`like-${index}`);
            likeButton.classList.toggle('active', data.likes > 0);
            alert(`Liked Blog ${index}. Total Likes: ${data.likes}`);
        })
        .catch(error => console.error('Error liking blog:', error));
};

const shareBlog = (index) => {
    fetch(`http://localhost:8008/blogs/${index}/share`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            const shareButton = document.getElementById(`share-${index}`);
            shareButton.classList.toggle('active', data.shares > 0);
            alert(`Shared Blog ${index}. Total Shares: ${data.shares}`);
        })
        .catch(error => console.error('Error sharing blog:', error));
};

const commentBlog = (index) => {
    const comment = prompt("Enter your comment:");
    const user = "user"; // Replace with actual user information if available

    if (comment) {
        fetch(`http://localhost:8008/blogs/${index}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, comment })
        })
            .then(response => response.json())
            .then(data => {
                const commentsSection = document.getElementById(`comments-${index}`);
                commentsSection.innerHTML = data.comments.map(c => `
                    <div class="comment">
                        <strong>${c.user}:</strong> ${c.comment}
                    </div>
                `).join('');
                alert(`Comment added to Blog ${index}.`);
            })
            .catch(error => console.error('Error commenting on blog:', error));
    }
};

const saveBlog = (index) => {
    const user = "user"; // Replace with actual user information if available

    fetch(`http://localhost:8008/blogs/${index}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user })
    })
        .then(response => response.json())
        .then(data => {
            const saveButton = document.getElementById(`save-${index}`);
            saveButton.classList.toggle('active', data.savedBy.includes(user));
            alert(`Saved Blog ${index}. Saved by: ${data.savedBy.join(', ')}`);
        })
        .catch(error => console.error('Error saving blog:', error));
};




// https://drive.google.com/thumbnail?id=1tL0uzZsFRVaOwLENZohnrNhDtZqGNnGF