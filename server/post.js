import express from 'express';
import upload from './upload.js'; 
import postModel from './models/Post.js'; 

const router = express.Router();

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

  if (!postId || !userId) {
    return res.status(400).json({ error: 'Missing postId or userId' });
  }

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likedByUsers.includes(userId.toString())) {
      return res.status(400).json({ error: 'User has already liked the post' });
    }

    post.likes += 1;
    post.likedByUsers.push(userId.toString());
    await post.save();

    res.json({ message: 'Post Liked by user!', post });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ error: 'Error updating likes' });
  }
});

// Unlike a post
router.post('/unlike', async (req, res) => {
  const { postId, userId } = req.body;
  
  try {
    const post = await postModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likedByUsers.includes(userId)) {
      post.likedByUsers = post.likedByUsers.filter(user => user !== userId);
      post.likes -= 1;
      await post.save();
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
});

// Route to create a post with media
router.post('/post', upload.single('media'), async (req, res) => {
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



export default router;
