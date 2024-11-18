import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import CreatePostForm from './CreatePostForm';
import './styles/Home.css';

function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = (newPost) => {
    // Handle the new post data here
    console.log('New post created:', newPost);
    setShowCreatePost(false);
  };

  return (
    <div className="home-container">
      <NavBar onCreatePostClick={() => setShowCreatePost(true)} />
      
      {showCreatePost && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button 
              className="close-button"
              onClick={() => setShowCreatePost(false)}
            >
              ×
            </button>
            <CreatePostForm 
              addPost={handleCreatePost}
              onClose={() => setShowCreatePost(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;