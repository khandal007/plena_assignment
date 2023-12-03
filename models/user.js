const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['default', 'admin'],
    default: 'default',
  },
});

module.exports = mongoose.model('User', userSchema);
