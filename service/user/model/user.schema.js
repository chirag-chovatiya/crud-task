const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
}, {
  timestamps: true, 
  versionKey: false,
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
