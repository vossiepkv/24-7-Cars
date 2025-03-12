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

  const LikeButton = ({ postId, userId }) => {
    const [liked, setLiked] = useState(false);
    const [zooming, setZooming] = useState(false);

    const handleLike = async () => {
      setLiked(true);
      setZooming(true);
      setTimeout(() => setZooming(false), 1200);
    
      try {
        await axios.post('https://two4-7-cars.onrender.com/api/post/like', { postId, userId });
        console.log('Liked Post');
      } catch (error) {
        console.error('Error Liking Post', error.response?.data || error.message);
      }
    };
    
    const handleUnlike = async () => {
      setLiked(false);
    
      try {
        await axios.post('https://two4-7-cars.onrender.com/api/post/unlike', { postId, userId });
        console.log('Unliked Post');
      } catch (error) {
        console.error('Error unliking post', error.response?.data || error.message);
      }
    };

    return (
      <div
        onClick={liked ? handleUnlike : handleLike}
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          position: "relative",
          width: "40px",
          height: "40px",
        }}
      >
        {/* Heart Icon (Visible when NOT liked) */}
        {!liked && (
          <FaHeart
            className="heart"
            style={{
              paddingTop: "5px",
              color: "red",
              position: "absolute",
              transition: "opacity 0.3s ease",
              opacity: 1,
              zIndex: 1,
            }}
          />
        )}

        {/* Car Icon (Visible when Liked) */}
        {liked && (
          <FaCar
            className={`car ${zooming ? "zoom-left" : ""}`}
            style={{
              paddingTop: "5px",
              color: "red",
              position: "absolute",
              transition: "opacity 0.3s ease",
              opacity: 1,
              zIndex: 1,
            }}
          />
        )}
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
                {storedUser && <LikeButton postId={post._id} userId={storedUser._id} />}
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
