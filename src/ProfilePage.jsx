import React, { useEffect, useState } from 'react';
import axios from "axios";
import './styles/ProfilePage.css';
import NavBar from "./NavBar";
import CreatePostForm from './CreatePostForm';

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
        console.log('Stored user object:', storedUser); // Log the entire object
        console.log('User ID:', storedUser._id); // Log the userId
        if (!storedUser._id || !storedUser.name) {
          console.error('Invalid user data:', storedUser);
          setLoading(false);
          return;
        }
        setUser(storedUser);
        const response = await axios.get(`/api/post/${storedUser._id}`);
        console.log('Response from axios:', response); // Log the entire response object
        console.log('Response data:', response.data); // Log the response data specifically
        console.log('Is response data an array?', Array.isArray(response.data)); //Check type
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setLoading(false);
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
            src={user.avatar || 'default-avatar.jpg'} // Default avatar fallback
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
                    {new Date(post.createdAt).toLocaleString()}
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
