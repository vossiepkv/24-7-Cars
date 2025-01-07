import React, { useState } from 'react';
import axios from 'axios';
import './styles/CreatePostForm.css';

function CreatePostForm({ addPost, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (!user || !user._id) {
      setError('User information is missing.');
      setLoading(false);
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('content', content);
    formDataToSend.append('user', user._id);
  
    if (media) {
      formDataToSend.append('media', media);
    }
  
    // Log the form data for debugging
    console.log("Form Data to Send:");
    for (const pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      const result = await axios.post('https://two4-7-cars.onrender.com/post', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log("API Response:", result.data); // Log the response for debugging
      addPost(result.data);
      onClose();
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
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <input
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
