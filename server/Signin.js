import express from 'express';
import UserModel from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await UserModel.findOne({ name });
    if (!user) return res.status(404).json({ message: "No Account Found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Incorrect Password" });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: "success", token, user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
