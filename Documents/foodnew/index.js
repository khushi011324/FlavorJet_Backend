const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

const bodyParser = require('body-parser');
const reviewRoutes = require('./Routes/router');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/reviews', reviewRoutes);

const { readBlogsFile, createBlogsFile } = require("./blogstore");
const { readLikesFile, writeLikesFile } = require("./likesstore"); // Updated file for likes data

const port = 8008;

let blogs = readBlogsFile();
let blog_id = blogs.length > 0 ? Math.max(...blogs.map((blog) => blog.id)) : 0;

// Helper function to update actions in the likes.json file
const updateLikesData = (id, type, data) => {
  const likesData = readLikesFile();
  if (!likesData[id]) {
    likesData[id] = { likes: 0, shares: 0, comments: [], saves: [] };
  }
  if (type === 'like') {
    likesData[id].likes += 1;
  } else if (type === 'share') {
    likesData[id].shares += 1;
  } else if (type === 'comment') {
    likesData[id].comments.push(data);
  } else if (type === 'save') {
    if (!likesData[id].saves.includes(data)) {
      likesData[id].saves.push(data);
    }
  }
  writeLikesFile(likesData);
};

// Like a blog post
app.post('/blogs/:id/like', (req, res) => {
  const { id } = req.params;
  updateLikesData(id, 'like');
  const likesData = readLikesFile();
  res.json({ id, likes: likesData[id].likes });
});

// Share a blog post
app.post('/blogs/:id/share', (req, res) => {
  const { id } = req.params;
  updateLikesData(id, 'share');
  const likesData = readLikesFile();
  res.json({ id, shares: likesData[id].shares });
});

// Comment on a blog post
app.post('/blogs/:id/comment', (req, res) => {
  const { id } = req.params;
  const { user, comment } = req.body;
  updateLikesData(id, 'comment', { user, comment });
  const likesData = readLikesFile();
  res.json({ id, comments: likesData[id].comments });
});

// Save a blog post
app.post('/blogs/:id/save', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  updateLikesData(id, 'save', user);
  const likesData = readLikesFile();
  res.json({ id, savedBy: likesData[id].saves });
});

// Middleware to simulate authentication and authorization
const users = [
  { username: "admin", role: "admin" }, // Admin user
  { username: "user", role: "user" },   // Regular user
];

function authorize(role) {
  return (req, res, next) => {
    const user = users.find((u) => u.username === req.headers.username); // Simulate user login with a header

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    req.user = user;
    next();
  };
}

// Create a New Blog Post (Admin Only)
app.post("/blogs", authorize("admin"), (req, res) => {
  const { title, chef, content, imageUrl } = req.body;

  // Validate the incoming data
  if (!title || !chef || !content || !imageUrl) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  blog_id += 1;
  const newBlog = {
    id: blog_id,
    title: title,
    chef: chef,
    content: content,
    imageUrl: imageUrl, // Use the image URL from the request body
  };

  blogs.push(newBlog);
  createBlogsFile(blogs);
  res.status(201).json(newBlog);
});

// Read All Blog Posts (Accessible to All Users)
app.get("/blogs", (req, res) => {
  res.status(200).json(blogs);
});

// Read a Specific Blog Post (Accessible to All Users)
app.get("/blogs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const blog = blogs.find((b) => b.id === id);

  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404).json({
      error: "Blog not found",
    });
  }
});

// Update a Blog Post (Admin Only)
app.put("/blogs/:id", authorize("admin"), (req, res) => {
  const { title, chef, content, imageUrl } = req.body;

  if (!title || !chef || !content || !imageUrl) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const id = parseInt(req.params.id);
  const blogIndex = blogs.findIndex((b) => b.id === id);

  if (blogIndex !== -1) {
    blogs[blogIndex].title = title;
    blogs[blogIndex].chef = chef;
    blogs[blogIndex].content = content;
    blogs[blogIndex].imageUrl = imageUrl; // Update the image URL
    createBlogsFile(blogs);
    res.status(200).json(blogs[blogIndex]);
  } else {
    res.status(404).json({
      error: "Blog not found",
    });
  }
});

// Delete a Blog Post (Admin Only)
app.delete("/blogs/:id", authorize("admin"), (req, res) => {
  const id = parseInt(req.params.id);
  const blogIndex = blogs.findIndex((b) => b.id === id);

  if (blogIndex !== -1) {
    blogs.splice(blogIndex, 1);
    createBlogsFile(blogs);
    res.status(204).json();
  } else {
    res.status(404).json({
      error: "Blog not found",
    });
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
