import React, { useEffect, useState } from 'react';
import axios from "axios";
import './styles/ProfilePage.css';
import NavBar from "./NavBar";
import CreatePostForm from './CreatePostForm';

const API_URL = import.meta.env.VITE_API_URL;


const ProfilePage = () => {
  const [user, setUser] = useState(null); // State for user
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.error('No user data in localStorage.');
        setLoading(false);
        return;
      }
  
      try {
        const storedUser = JSON.parse(userString);
        const userId = storedUser._id;
  
        // Fetch updated user data
        const userResponse = await axios.get(`${API_URL}/api/user/${userId}`);
        const updatedUser = userResponse.data;
  
        // Merge with stored user to keep missing fields
        const mergedUser = { ...storedUser, ...updatedUser };
  
        // Update state and localStorage with latest user data
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
  
        // Fetch posts
        const postsResponse = await axios.get(`${API_URL}/api/post/${userId}`);
        setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
      } catch (error) {
        console.error('Error fetching user or posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserAndPosts();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      <NavBar /> {/* Navbar Component */}
      <div className="profile-page">
        <div className="profile-header">
          <img
            src={user.profilePicture || 'default-avatar.jpg'} // Default avatar fallback
            alt={user.name || 'User'}
            className="avatarimg"
          />
          <h1 className='username'>{user.name || 'Anonymous'}</h1>
          <p className='bio'>Bio: {user.bio || 'No bio available.'}</p>
        </div>

        {/* User's Posts */}
        <div>
          <h2 className='head-title'>Posts</h2>
          {posts.length > 0 ? (
            <div className="posts-container">
              {posts.map((post) => (
                <div key={post._id} className="post">
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt={post.title || 'Post Image'}
                      className="post-image"
                    />
                  )}
                  <h3 className='title'>{post.title || 'Untitled Post'}</h3>
                  <p className='content'>{post.content || 'No content available'}</p>
                  <span className="timestamp">
                    {new Date(post.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
