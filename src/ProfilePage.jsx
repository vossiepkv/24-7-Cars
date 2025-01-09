import React, { useEffect, useState } from 'react';
import axios from "axios";
import './styles/ProfilePage.css';
import NavBar from "./NavBar";

const ProfilePage = ({ userID }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://two4-7-cars.onrender.com/posts/${userID}`);
        setPosts(response.data); // Set posts to the response data
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userID]);

  if (loading) {
    return <div>Loading posts...</div>;
  }


  return(
    <>
    <NavBar/> {/*Navbar Component*/}
    
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="avatarimg"/>
        <h1>{user.name}</h1>
        <p>UserName: {user.name}</p>
        <p>Bio: {user.bio || ''}</p> 
      </div>

      {/* Users Posts */}
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
  )
}



export default ProfilePage;