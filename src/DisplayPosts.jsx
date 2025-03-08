import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DisplayPosts.css'; 
import ProfilePicture from './assets/user.png';

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

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
        console.log('Stored user:', storedUser); // Log the entire storedUser object
        console.log('User ID:', storedUser._id); // Log the userId specifically
        if (!storedUser._id || !storedUser.name) {
          console.error('Invalid user data in localStorage:', storedUser);
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`https://two4-7-cars.onrender.com/api/post`);
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

  return (
    <div>
      <h1>All Posts</h1>
      {loading ? ( // Conditionally render spinner
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="post-container">
          {posts.length > 0 ? (
  [...posts].reverse().map((post) => (
    <div key={post._id} className="post">
      <div className="userbar">
        <li>
          <img
            src={post.user?.profilePicture || ProfilePicture} // Use default if no profile picture
            alt="User Avatar"
            className="avatar"
          />
          <h3 className='nameSection'>{post.user?.name || 'Unknown User'}</h3>
          <span>{new Date(post.timestamp).toLocaleString()}</span>
        </li>
      </div>
      {post.mediaUrl && <img src={post.mediaUrl} alt={post.title || 'Post Image'} />}
      <h2 className='title-space'>{post.title || 'No Title Available'}</h2>
      <p className='content-space'>{post.content || 'No Content Available'}</p>
    </div>
  ))
) : (
  <p>No posts available.</p>
)}
        </div>
      )}
    </div>
  );
};

export default DisplayPosts;
