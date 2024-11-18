// CreatePostForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './styles/CreatePostForm.css';

function CreatePostForm({ addPost, onClose }) {  
  const [formData, setFormData] = useState({title: '', content: '', media: ''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/posts/create', formData, {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
      });
      addPost(response.data);
      onClose();
    } catch (error) {
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
        value={formData.media}
        onChange={handleChange}
            placeholder="Add media(optional)"
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