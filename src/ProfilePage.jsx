import React, { useEffect, useState } from 'react';
import axios from "axios";
import './styles/ProfilePage.css';
import NavBar from "./NavBar";

const ProfilePage = () => {
  const [user, setUser] = useState(null); // State for user
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user); // Parse the JSON string
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null; // Return null if parsing fails
      }
    }
    console.error('No user found in localStorage');
    return null;
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const storedUser = getUserFromLocalStorage();
      if (!storedUser) return;

      setUser(storedUser); // Set user state
      
      try {
        const response = await axios.get(
          `https://two4-7-cars.onrender.com/post/${storedUser._id}`
        );
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
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
          <h1>{user.name || 'Anonymous'}</h1>
          <p>Username: {user.name || 'N/A'}</p>
          <p>Bio: {user.bio || 'No bio available.'}</p>
        </div>

        {/* User's Posts */}
        <div>
          <h2>User Posts</h2>
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
                  <h3>{post.title || 'Untitled Post'}</h3>
                  <p>{post.content || 'No content available'}</p>
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
