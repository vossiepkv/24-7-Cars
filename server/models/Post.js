import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaUrl: { type: String }, 
});

const postModel = mongoose.model('post', postSchema);

export default postModel;
