import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  likes: { type: Number, default: 0 },
  likedByUser: { type: [String], default: [] },
  mediaUrl: { type: String },
});

const postModel = mongoose.model('Post', postSchema);

export default postModel;

