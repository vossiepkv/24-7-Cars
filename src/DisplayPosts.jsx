import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DisplayPosts.css';

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

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
        console.log('Stored user:', storedUser); // Log the entire storedUser object
        console.log('User ID:', storedUser._id); // Log the userId specifically
        if (!storedUser._id || !storedUser.name) {
          console.error('Invalid user data in localStorage:', storedUser);
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`https://two4-7-cars.onrender.com/api/post`);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserAndPosts();
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      {loading ? ( // Conditionally render spinner
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
                    {/*avatar icon hardcoded*/}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="avatar"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3>{post.user.name}</h3>
                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                  </li>
                </div>
                {post.mediaUrl && (
                  <img src={post.mediaUrl} alt={post.title || 'Post Image'} />
                )}
                <h2 className='title-space'>{post.title || 'No Title Available'}</h2>
                <p className='content-space'>{post.content || 'No Content Available'}</p>
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
