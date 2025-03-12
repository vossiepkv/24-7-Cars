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
  const { postId, userId } = req.body;
  
  try {
    const post = await Post.findById(postId);
    
    // Check if the user already liked the post
    if (!post.likedByUsers.includes(userId)) {
      post.likedByUsers.push(userId);  // Add user to likedByUsers array
      post.likes += 1;  // Increment like count
    }
    
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
});



// Unlike a post
router.post('/unlike', async (req, res) => {
  const { postId, userId } = req.body;
  
  try {
    const post = await Post.findById(postId);
    
    // Check if the user has liked the post
    if (post.likedByUsers.includes(userId)) {
      post.likedByUsers = post.likedByUsers.filter(user => user !== userId);  // Remove user from likedByUsers array
      post.likes -= 1;  // Decrement like count
    }
    
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
});


export default router;
