const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config(); 
const UserModel = require('./models/User');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');




const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());
app.use(express.json()); // Enable parsing of JSON requests


const mongoURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API route to check if server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.post('/Signin', async (req, res) => {
  const { name, password } = req.body;
  
  try {
    // Find the user by name
    const user = await UserModel.findOne({ name });
    if (!user) return res.status(404).json({ message: "No Account Found" });

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Incorrect Password" });

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('User found:', user);

    // Send back both the token and user data
    res.json({
      message: "success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


const authenticationToken= (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({message: 'Invalid Token' });
      req.user = user;
      next();
    });
};

// POST route for user signup
app.post('/Signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await UserModel.create({ name, email, password: hashedPassword });

    // Create a JWT token for the new user
    const token = jwt.sign({ userId: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    // Return user data and token
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
        },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
