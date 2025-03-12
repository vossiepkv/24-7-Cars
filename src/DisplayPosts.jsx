import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './styles/DisplayPosts.css'; 
import ProfilePictureDefault from './assets/user.png';
import { FaHeart, FaCar } from "react-icons/fa";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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
        if (!storedUser._id || !storedUser.name) {
          console.error('Invalid user data in localStorage:', storedUser);
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://two4-7-cars.onrender.com/api/post`);
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  const LikeButton = () => {
    const [liked, setLiked] = useState(false);
    const [zooming, setZooming] = useState(false);
    const heartRef = useRef(null); // Reference to the heart icon
    const carRef = useRef(null); // Reference to the car icon
  
    const handleLike = async (postId, userId) => {
      setLiked(!liked);
      if (!liked) {
        setZooming(true); // Start zooming animation when the car is shown
        setTimeout(() => {
          setZooming(false); // Reset zooming state after the animation
        }, 1200); // Duration of the zoom animation (left + right)
      }

      try {
        await axios.post('https://two4-7-cars.onrender.com/api/like', {postId, userId});
        console.log('Liked Post');
      } catch (error) {
        console.error('Error Liking Post', error.response.data);
      }
    };

    const handleUnlike = async (postId, userId) => {
      try{
        await axios.post('https://two4-7-cars.onrender.com/api/unlike', {postId, userId});
        console.log('Unliked Post');
      } catch (error) {
        console.error('Error unliking post', error.response.data);
      }
    }
  
    return (
      <div
  onClick={liked ? handleUnlike : handleLike} // Toggle between like and unlike
  style={{
    fontSize: "2rem",
    cursor: "pointer",
    position: "relative",
    width: "40px",
    height: "40px",
  }}
>
  {/* Heart Icon (Visible when NOT liked) */}
  <FaHeart
    ref={heartRef}
    className={`heart ${liked ? "heart-hidden" : ""}`}
    style={{
      paddingTop: "5px",
      color: "red",
      position: "absolute",
      transition: "opacity 0.3s ease", // Smooth transition
      opacity: liked ? 0 : 1, // Hide when liked
      zIndex: liked ? -1 : 1, 
    }}
  />

  {/* Car Icon (Visible when Liked) */}
  <FaCar
    ref={carRef}
    className={`car ${zooming ? "zoom-left" : ""}`}
    style={{
      paddingTop: "5px",
      color: "red",
      position: "absolute",
      transition: "opacity 0.3s ease", // Smooth transition
      opacity: liked ? 1 : 0, // Show when liked
      zIndex: liked ? 1 : -1, 
    }}
  />
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
                <LikeButton />
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
