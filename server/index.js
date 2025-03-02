import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import UserModel from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import postRoutes from './post.js';
import Post from './models/Post.js';
import settingsPageRoutes from './settingsPage.js';
import signinRoutes from './Signin.js';
import signupRoutes from './Signup.js';
import userRoutes from './User.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://24-7-cars.vercel.app',
  'https://24-7-cars-49l0xjj8t-patrick-vohs-projects.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Authentication Middleware (if you have it, place it here before routes)
//const authenticationToken = require('./authentication'); // Example
//app.use(authenticationToken);

// API Routes (MUST come BEFORE serving static files)
app.use('/api/post', postRoutes);
app.use('/api/settingsPage', settingsPageRoutes);
app.use('/api/signin', signinRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/user', userRoutes);

// Serve static files (your React app)
const distPath = path.join(process.cwd, '../dist'); // Use process.cwd()
app.use(express.static(distPath));

// Catch-all route (MUST come LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const mongoURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
