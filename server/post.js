import express from 'express';
import upload from './upload.js'; 
import postModel from './models/Post.js'; 

const router = express.Router();

// Route to create a post with media
router.post('/', upload.single('media'), async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const { title, content, user } = req.body;

  if (!title || !content || !user) {
    return res.status(400).json({ message: 'Missing required fields: title, content, or user.' });
  }

  try {
    const mediaUrl = req.file ? req.file.location : null;
    const post = await postModel.create({ title, content, user, mediaUrl });

    res.status(201).json({ message: 'Post created successfully!', post });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post.', error: error.message });
  }
});

// Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await postModel.find().populate('user', 'name profilePicture'); 
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

// Fetch posts by user ID
router.get('/:userId', async (req, res) => {
  try {
    const posts = await postModel.find({ user: req.params.userId }).populate('user', 'name');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: error.message });
  }
});

// Like a post
router.post('/like', async (req, res) => {
  console.log('Likes endpoint hit');
  const { postId, userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likedByUser) {
      post.likedByUser = []; // Ensure likedByUser exists
    }

    if (post.likedByUser.includes(userId)) {
      return res.status(400).json({ error: 'User has already liked the post' });
      
    }

    post.likes += 1;
    post.likedByUser.push(userId);
    await post.save();

    res.json({ message: 'Post Liked by user!', post });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ error: 'Error Updating Likes', details: error.message });
  }
});


// Unlike a post
router.post('/unlike', async (req, res) => {
  console.log('Unlike Endpoint Hit');
  const { postId, userId } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likedByUser.includes(userId)) {
      return res.status(400).json({ error: 'User has not liked this post' });
    }

    post.likes -= 1;
    post.likedByUser = post.likedByUser.filter(id => id !== userId);
    await post.save();

    res.json({ message: 'Post Unliked by user', post });
  } catch (error) {
    res.status(500).json({ error: 'Error Updating Likes' });
  }
});

export default router;