const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const connect = require('../rabbitmq');

// Get all tasks for a user
router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id });
  res.json(tasks);
});

// Get a task by ID
router.get('/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  res.json(task);
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    userId: req.user._id,
  });
  await task.save();
  res.json(task);
});

// Update a task by ID
router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    completed: req.body.completed,
  }, { new: true });
  res.json(task);
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Task deleted' });
});

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Get all tasks sorted by completion status, due date, and priority
router.get('/sorted', async (req, res) => {
  const tasks = await Task.find().sort({ completed: 1, dueDate: 1, priority: -1 });
  res.json(tasks);
});

// Update a task by ID for a user
router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
    completed: req.body.completed,
  }, { new: true });

  if (task.completed) {
    const channel = await connect();
    channel.sendToQueue('task_completed', Buffer.from(JSON.stringify(task)));
  }
  
  res.json(task);
});

module.exports = router;
