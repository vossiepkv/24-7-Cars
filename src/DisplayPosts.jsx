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
    const [liked, setLiked] = useState(likedByUsers.includes(userId)); // Sync initial state with the backend data
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [zooming, setZooming] = useState(false);

    const handleLike = async () => {
      // Don't allow like if already liked by the user
      if (liked) return;
      
      setLiked(true);
      setZooming(true);
      setLikeCount((prev) => prev + 1);

      try {
        await axios.post('https://two4-7-cars.onrender.com/api/post/like', { postId, userId });
      } catch (error) {
        console.error('Error Liking Post', error.response?.data || error.message);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }

      setTimeout(() => setZooming(false), 1200);
    };

    const handleUnlike = async () => {
      // Don't allow unlike if already unliked by the user
      if (!liked) return;

      setLiked(false);
      setLikeCount((prev) => prev - 1);

      try {
        await axios.post('https://two4-7-cars.onrender.com/api/post/unlike', { postId, userId });
      } catch (error) {
        console.error('Error unliking post', error.response?.data || error.message);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
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
