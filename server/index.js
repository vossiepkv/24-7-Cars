const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config(); 
const UserModel = require('./models/User');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

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

app.post('/Signin', (req, res) => {
  const { name, password } = req.body;
  UserModel.findOne({ name: name })
    .then(user => {
      if (user) {
        // Compare provided password with hashed password
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            res.json({ message: "success" });
          } else {
            res.status(401).json({ message: "Incorrect Password" });
          }
        });
      } else {
        res.status(404).json({ message: "No Account Found" });
      }
    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});

// POST route for user signup
app.post('/Signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Hash the password before saving
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });
    
    UserModel.create({ name, email, password: hash })
      .then(user => res.status(201).json(user)) // Return 201 status for successful creation
      .catch(err => res.status(400).json({ error: err.message })); // Return 400 for bad requests
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
