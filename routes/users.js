const express = require('express');
const router = express.Router();
const User = require('../models/user');
const tasks = require('./tasks');

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Create a new user
router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    type: req.body.type,
  });
  await user.save();
  res.json(user);
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    email: req.body.email,
    type: req.body.type,
  }, { new: true });
  res.json(user);
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Use the task routes
router.use('/tasks', tasks);

module.exports = router;
