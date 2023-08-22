const mongoose = require('mongoose');

const User = new mongoose.Schema({

  email: String,
  name: String,
  password: String,
  phoneNumber: String,
  role: String,
  verified: Boolean,
  twoFactorAuthenticate: Boolean
});

module.exports = mongoose.model('User', User);