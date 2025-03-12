import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DisplayPosts.css';
import ProfilePictureDefault from './assets/user.png';
import { FaHeart, FaCar } from "react-icons/fa";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userString = localStorage.getItem('user');
  const storedUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://two4-7-cars.onrender.com/api/post');
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const LikeButton = ({ postId, userId, initialLikes, likedByUsers }) => {
    // Retrieve the liked status from localStorage, if available
    const storedLikeStatus = localStorage.getItem(`liked-${postId}-${userId}`);
    const initialLiked = storedLikeStatus ? storedLikeStatus === 'true' : likedByUsers.includes(userId);

    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [zooming, setZooming] = useState(false);

    const handleLike = async () => {
      if (liked) return;  // Don't allow like if already liked by the user

      setLiked(true); // Mark as liked
      setZooming(true);
      setLikeCount((prev) => prev + 1); // Increment the like count

      try {
        // Make the like API call to update the backend
        await axios.post('https://two4-7-cars.onrender.com/api/like', { postId, userId });
        
        // Store the like status in localStorage for future sessions
        localStorage.setItem(`liked-${postId}-${userId}`, 'true');
      } catch (error) {
        console.error('Error Liking Post', error.response?.data || error.message);
        setLiked(false); // Revert state if there's an error
        setLikeCount((prev) => prev - 1); // Decrement like count on error
      }

      setTimeout(() => setZooming(false), 1200);
    };

    const handleUnlike = async () => {
      if (!liked) return; // Don't allow unlike if already unliked by the user

      setLiked(false); // Mark as unliked
      setLikeCount((prev) => prev - 1); // Decrement the like count

      try {
        // Make the unlike API call to update the backend
        await axios.post('https://two4-7-cars.onrender.com/api/unlike', { postId, userId });

        // Remove the like status from localStorage
        localStorage.removeItem(`liked-${postId}-${userId}`);
      } catch (error) {
        console.error('Error unliking post', error.response?.data || error.message);
        setLiked(true); // Revert state if there's an error
        setLikeCount((prev) => prev + 1); // Increment like count on error
      }
    };

    return (
      <div
        onClick={liked ? handleUnlike : handleLike}
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "2rem",
          cursor: "pointer",
        }}
      >
        {/* Toggle between FaHeart (not liked) and FaCar (liked) */}
        {liked ? (
          <FaCar
            className={`car ${zooming ? "zoom-left" : ""}`}
            style={{ color: "red", transition: "0.3s" }}
          />
        ) : (
          <FaHeart
            className="heart"
            style={{ color: "red", transition: "0.3s" }}
          />
        )}

        {/* Like count next to the icon */}
        <span style={{ marginLeft: "10px", fontSize: "1.2rem", paddingLeft: "30px", }}>{likeCount}</span>
      </div>
    );
  };

  return (
    <div>
      <h1>All Posts</h1>
      {loading ? (
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
                      src={post.user?.profilePicture || ProfilePictureDefault}
                      alt="User Avatar"
                      className="avatar"
                    />
                    <h3 className="nameSection">{post.user?.name || 'Unknown User'}</h3>
                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                  </li>
                </div>
                {post.mediaUrl && (
                  <img src={post.mediaUrl} alt={post.title || 'Post Image'} />
                )}
                {storedUser && (
                  <LikeButton 
                    postId={post._id} 
                    userId={storedUser._id} 
                    initialLikes={post.likes} 
                    likedByUsers={post.likedByUsers || []} 
                  />
                )}
                <h2 className="title-space">{post.title || 'No Title Available'}</h2>
                <p className="content-space">{post.content || 'No Content Available'}</p>
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
