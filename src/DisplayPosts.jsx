import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DisplayPosts.css';

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({}); // State to store user data

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
      }
    };

    const fetchUserData = async () => {
      try {
        // Fetching users based on userId in posts
        const userRequests = posts.map((post) =>
          axios.get(`https://two4-7-cars.onrender.com/user/${post.user}`)
        );
        const userResponses = await Promise.all(userRequests);

        // Mapping the responses to create a user map
        const userMap = userResponses.reduce((acc, { data }) => {
          acc[data._id] = data.name; // Adjust to fit your response structure
          return acc;
        }, {});

        // Updating the users state with the fetched data
        setUsers(userMap);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // First fetch the posts, then fetch the users after posts are fetched
    fetchPosts().then(() => fetchUserData());
  }, [posts]); // Adding `posts` as a dependency to trigger fetchUserData after posts are set

  console.log('Post User ID:', post.user);

  return (
    <div>
      <h1>All Posts</h1>
      <div className="post-container">
        {posts.length > 0 ? (
          [...posts].reverse().map((post) => (
            <div key={post._id} className="post">
              
              <h3>{users[post.user] || 'Unknown User'}</h3> {/* Show the username */}
              {/* Conditionally render the image only if mediaUrl exists */}
              {post.mediaUrl && (
                <img
                  src={post.mediaUrl}
                  alt={post.title || 'Post Image'}
                />
              )}
              <h2>{post.title || 'No Title Available'}</h2>
              <p>{post.content || 'No Content Available'}</p>
              <span>{new Date(post.timestamp).toLocaleString()}</span>
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
