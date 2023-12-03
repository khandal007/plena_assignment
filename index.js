const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const tasks = require('./routes/tasks');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/task-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Parse JSON requests
app.use(bodyParser.json());

// Use the user routes
app.use('/users', users);
app.use('/tasks', tasks);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
