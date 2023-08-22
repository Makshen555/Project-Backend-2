const mongoose = require('mongoose');

const Edit = new mongoose.Schema({
  name: String,
  model: String,
  input: String,
  instruction: String,
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

module.exports = mongoose.model('Edit', Edit);