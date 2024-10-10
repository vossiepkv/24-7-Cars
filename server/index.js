const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config(); 
const UserModel = require('./models/User');

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());
app.use(express.json()); // Enable parsing of JSON requests

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API route to check if server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// POST route for user signup
app.post('/Signup', (req, res) => {
  UserModel.create(req.body)
    .then(user => res.status(201).json(user)) // Return 201 status for successful creation
    .catch(err => res.status(400).json({ error: err.message })); // Return 400 for bad requests
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
