import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DisplayPosts.css';
import ProfilePictureDefault from './assets/user.png';
import { FaHeart, FaCar } from "react-icons/fa";
import { Link } from 'react-router-dom'; 

const API_URL = import.meta.env.VITE_API_URL;

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userString = localStorage.getItem('user');
  const storedUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/post`);
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

  const LikeButton = ({ postId, userId, initialLikes, likedByUser }) => {
    const [liked, setLiked] = useState(likedByUser.includes(userId));
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [zooming, setZooming] = useState(false);

    const handleLike = async () => {
      setLiked(true);
      setZooming(true);
      setLikeCount((prev) => prev + 1);

      try {
        await axios.post(`${API_URL}/api/post/like`, { postId, userId });
      } catch (error) {
        console.error('Error Liking Post', error.response?.data || error.message);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }

      setTimeout(() => setZooming(false), 1200);
    };

    const handleUnlike = async () => {
      setLiked(false);
      setLikeCount((prev) => prev - 1);

      try {
        await axios.post(`${API_URL}/api/post/unlike`, { postId, userId });
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
        <span style={{ marginLeft: "10px", fontSize: "1.2rem", paddingLeft: "50px", color: "#fff" }}>{likeCount}</span>
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
                    {/* <h3 className="nameSection">{post.user?.name || 'Unknown User'}</h3> */}

                    <h3 className="nameSection">
                      <Link to={`/user/${post.user._id}`} className="name-link">
                        {post.user?.name || 'Unknown User'}
                      </Link>
                    </h3>

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
                    likedByUser={post.likedByUser || []} 
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
