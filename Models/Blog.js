const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("blog", BlogSchema);
