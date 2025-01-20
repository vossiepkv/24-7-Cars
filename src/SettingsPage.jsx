import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Settings.css';
import NavBar from './NavBar';
import CreatePostForm from './CreatePostForm';


const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('error parsing user from localStorage:', error);
        return null;
      }
    }
    console.error('No user found in localStorage');
    return null;
  };


  return (
<>

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
</>
  );
};

export default SettingsPage;