const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },   // Added required validation
  email: { type: String, required: true, unique: true }, // Unique constraint for emails
  password: { type: String, required: true } // Added required validation
});

// Use 'register' as the collection name
const UserModel = mongoose.model("register", UserSchema);
module.exports = UserModel;
