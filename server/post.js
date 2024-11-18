import express from 'express';
import upload from './upload.js'; // Don't forget to add the '.js' extension
import postModel from './models/Post.js'; // Similarly, add the '.js' extension

const router = express.Router();

// Route to create a post with media
router.post('/', upload.single('media'), async (req, res) => {
  const { title, content, user } = req.body;

  // Log the incoming request body for debugging
  console.log('Received request body:', req.body);
  console.log('Received file:', req.file); // Log file details if uploaded

  // Check if required fields are missing
  if (!title || !content || !user) {
    return res.status(400).json({ message: 'Missing required fields: title, content, or user.' });
  }

  try {
    // Ensure file exists before accessing location
    const mediaUrl = req.file ? req.file.location : null;

    // Log the media URL being used
    console.log('Media URL:', mediaUrl);

    // Create a new post with the uploaded media URL (if present)
    const post = await postModel.create({
      title,
      content,
      user,
      mediaUrl,  // Only add the media URL if a file was uploaded
    });

    // Save the new post
    await post.save();

    // Respond with the created post
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,  
    });
  } catch (error) {
    // Log error details to aid debugging
    console.error('Error creating post:', error.message);
    res.status(500).json({ message: 'Error creating post.' });
  }
});

export default router;
