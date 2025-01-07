import express from 'express';
import upload from './upload.js'; // Ensure the correct path and '.js' extension
import postModel from './models/Post.js'; // Ensure the correct path and '.js' extension

const router = express.Router();

// Route to create a post with media
router.post('/', upload.single('media'), async (req, res) => {
  // Log incoming request details for debugging
  console.log('Request body:', req.body); // Fields parsed from the form
  console.log('Request file:', req.file); // Uploaded file information

  const { title, content, user } = req.body;

  // Validate required fields
  if (!title || !content || !user) {
    console.error('Validation error: Missing required fields.');
    return res.status(400).json({ message: 'Missing required fields: title, content, or user.' });
  }

  try {
    // Construct the media URL if a file is uploaded
    const mediaUrl = req.file ? req.file.location : null; // Retrieve S3 file URL from `multer-s3`
    console.log('Media URL:', mediaUrl);

    // Create a new post with the provided data
    const post = await postModel.create({
      title,
      content,
      user,
      username,
      mediaUrl, // Include the media URL only if a file was uploaded
    });

    console.log('Post created:', post);

    // Respond with the created post
    res.status(201).json({
      message: 'Post created successfully!',
      post,
    });
  } catch (error) {
    // Log error details for debugging
    console.error('Error creating post:', error.message);
    res.status(500).json({ message: 'Error creating post.', error: error.message });
  }
});

router.get('/', async (req, res) => {
  console.log('GET /post endpoint hit'); // Debug log
  try {
    const posts = await postModel.find().populate('user', 'name'); // Populate the `user` reference with the `name` field
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

export default router;
