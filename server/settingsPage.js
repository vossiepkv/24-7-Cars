import express from 'express';
import UserModel from './models/User.js';
import upload from './upload.js';

const router = express.Router();

router.get('/:userId', (req, res) => {
  res.json({ message: 'Test route working!', userId: req.params.userId });
});


router.put('/:userId', upload.single('profilePicture'), async (req, res) => {
  const userId = req.params.userId;
  const updates = req.body; //Get other updates from the request body

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update other fields (username, email, bio, etc.)
    Object.assign(user, updates); //Update safely using Object.assign

    if (req.file) {
      //If a new profile picture is uploaded, update the user's profilePicture URL.
      user.profilePicture = req.file.location; 
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
