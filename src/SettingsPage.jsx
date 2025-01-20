import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Settings.css';
import NavBar from './NavBar';
import CreatePostForm from './CreatePostForm';


const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
    const handleCreatePost = (newPost) => {
      // Handle the new post data here
      console.log('New post created:', newPost);
      setShowCreatePost(false);
    };

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
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></link>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
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


<div className="input-group mb-3">
  <span className="input-group-text" id="basic-addon1">@</span>
  <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
</div>

<div className="input-group">
  <span className="input-group-text">Bio</span>
  <textarea className="form-control" aria-label="Bio"></textarea>
</div>

<div class="input-group mb-3">
  <label class="input-group-text" for="inputGroupFile01">Profile Picture</label>
  <input type="file" class="form-control" id="inputGroupFile01"/>
</div>
</>
  );
};

export default SettingsPage;