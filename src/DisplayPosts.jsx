import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner'; // Import the spinner component
import './styles/DisplayPosts.css';

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://two4-7-cars.onrender.com/post');
        console.log('Fetched posts:', response.data);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1>All Posts</h1>
      <div className="post-container">
        {posts.length > 0 ? (
          [...posts].reverse().map((post) => (
            <div key={post._id} className="post">
              <h2>{post.title || 'No Title Available'}</h2>
              <p>{post.content || 'No Content Available'}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;
