import express from 'express';
import UserModel from './models/User';

const router = express.Router();

// Follow a user
router.post('/follow', async (req, res) => {
  const { followerId, followingId } = req.body;

  if (followerId === followingId)
    return res.status(400).json({ message: "You can't follow yourself." });

  try {
    const follower = await UserModel.findById(followerId);
    const following = await UserModel.findById(followingId);

    if (!follower || !following) return res.status(404).json({ message: "User not found." });

    // Prevent duplicates
    if (following.followers.includes(followerId)) {
      return res.status(400).json({ message: "Already following." });
    }

    following.followers.push(followerId);
    follower.following.push(followingId);

    await following.save();
    await follower.save();

    res.status(200).json({ message: "Followed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow a user
router.post('/unfollow', async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const follower = await UserModel.findById(followerId);
    const following = await UserModel.findById(followingId);

    if (!follower || !following) return res.status(404).json({ message: "User not found." });

    following.followers = following.followers.filter(id => id.toString() !== followerId);
    follower.following = follower.following.filter(id => id.toString() !== followingId);

    await following.save();
    await follower.save();

    res.status(200).json({ message: "Unfollowed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
