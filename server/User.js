import express from 'express';
import UserModel from './models/User.js';
const router = express.Router();

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

export default router;
