const mongoose = require('mongoose');

const Image = new mongoose.Schema({

  name: String,
  prompt: String,
  n: Number,
  size: String,
  user: {
    type: mongoose.ObjectId,
    ref: "User"
  },
  tags: [
    {
      type: String
    }
  ]
});

module.exports = mongoose.model('Image', Image);