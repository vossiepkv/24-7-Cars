import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://two4-7-cars.onrender.com/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
          },
        });
        setUser(response.data.user);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="spinner-container"><span className="loader"></span></div>;
  }

  return (
    <div className="profile-page">
      {user ? (
        <>
          {/* User Information */}
          <div className="profile-header">
            <img
              src={user.profilePicture || '/default-avatar.png'}
              alt={user.name}
              className="profile-picture"
            />
            <h1>{user.name}</h1>
            <p className="username">@{user.username}</p>
            <p className="bio">{user.bio || 'No bio available'}</p>
          </div>

          {/* User's Posts */}
          <div className="user-posts">
            <h2>{user.name}'s Posts</h2>
            {posts.length > 0 ? (
              <div className="posts-container">
                {posts.map((post) => (
                  <div key={post._id} className="post">
                    {post.mediaUrl && (
                      <img src={post.mediaUrl} alt={post.title || 'Post Image'} />
                    )}
                    <h3>{post.title || 'Untitled Post'}</h3>
                    <p>{post.content || 'No content available'}</p>
                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </>
      ) : (
        <p>Error loading profile.</p>
      )}
    </div>
  );
};

export default Profile;
