import express from 'express';
import UserModel from './models/User.js';
const router = express.Router();
import PostModel from './models/Post.js'; // make sure this is imported

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId).select('-password'); // exclude sensitive data
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await PostModel.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      profilePicture: user.profilePicture || '',
      followers: user.followers || [],
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

export default Router;