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
import likeRoutes from './post.js';
import unlikeRoutes from './post.js';
import followRoutes from './follow.js';
import unfollowRoutes from './follow.js';

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

app.use('/api/post', postRoutes);
app.use('/api/settingsPage', settingsPageRoutes);
app.use('/api/signin', signinRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/unlike', unlikeRoutes);
app.use('/api/user', followRoutes);
app.use('/api/user', unfollowRoutes);


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
