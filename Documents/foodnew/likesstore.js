const fs = require("fs");
const path = require("path");

const LIKES_FILE = path.join(__dirname, "likes.json");

// Helper function to read the likes file
const readLikesFile = () => {
    if (!fs.existsSync(LIKES_FILE)) {
        fs.writeFileSync(LIKES_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(LIKES_FILE, "utf-8"));
};

// Helper function to write to the likes file
const writeLikesFile = (data) => {
    fs.writeFileSync(LIKES_FILE, JSON.stringify(data, null, 2));
};

module.exports = { readLikesFile, writeLikesFile };
