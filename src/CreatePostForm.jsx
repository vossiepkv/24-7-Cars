import React, { useState } from 'react';
import axios from 'axios';

function CreatePostForm({ addPost }) {  

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
    try{
      const response = await axios.post('/api/posts/create', formData, {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
      });
      addPost(response.data);
      setFormData({title: '', content: '', media: ''});
    } catch (error) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleSubmit}>
       <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
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
        value={formData.media}
        onChange={handleChange}
        placeholder="Media URL (optional)"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
} 

export default CreatePostForm;