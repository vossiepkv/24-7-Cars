import React, { useState } from 'react';
import axios from 'axios';
import './styles/CreatePostForm.css';

function CreatePostForm({ addPost, onClose }) {
  const [formData, setFormData] = useState({ title: '', content: '', media: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if user information is available in localStorage
    if (!user || !user._id) {
      setError('User information is missing.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);

    // Append the user ID from localStorage to FormData
    formDataToSend.append('user', user._id);  // Assuming user has '_id' in localStorage

    if (formData.media) {
      formDataToSend.append('media', formData.media);
    }

    try {
      const result = await axios.post('http://localhost:5001/post', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Token for authorization
          'Content-Type': 'multipart/form-data',
        },
      });
      addPost(result.data);  // Assuming addPost function adds the post to the list
      onClose();  // Close the form after submitting
    } catch (error) {
      console.error('Error creating post:', error.response ? error.response.data : error.message);
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={(e) => {
      if (e.target.className === 'popup-overlay') onClose();
    }}>
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit} className="create-post-form">
          <h2>Create New Post</h2>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your title"
            required
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="What's on your mind?"
            required
          />
          <input
            name="media"
            type="file"
            onChange={handleFileChange}
            placeholder="Add media (optional)"
          />
          {error && <p className="error">{error}</p>}
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostForm;
