const mongoose = require('mongoose');

const Completion = new mongoose.Schema({
  name: String,
  model: String,
  prompt: String,
  temperature: Number,
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

module.exports = mongoose.model('Completion', Completion);