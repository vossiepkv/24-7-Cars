import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import "./styles/ProfilePage.css";
import ProfilePictureDefault from "./assets/user.png";

const UserProfile = () => {
  const { id } = useParams(); // get user ID from URL
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userString = localStorage.getItem("user");
      if (!userString) return;

      const currentUser = JSON.parse(userString);
      setLoggedInUser(currentUser);

      try {
        const response = await axios.get(
          `https://two4-7-cars.onrender.com/api/user/${id}`
        );
        setUser(response.data);

        const isAlreadyFollowing = response.data.followers?.some(
          (f) => f._id === currentUser._id
        );
        setIsFollowing(isAlreadyFollowing);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!loggedInUser || !user) return;

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `https://two4-7-cars.onrender.com/api/user/${endpoint}`,
        {
          followerId: loggedInUser._id,
          followingId: user._id,
        }
      );

      // Toggle UI
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <>
      <NavBar />
      <div className="profile-page">
        <div className="profile-header">
          <img
            src={
              !user.profilePicture ||
              user.profilePicture === "null" ||
              user.profilePicture === "undefined"
                ? ProfilePictureDefault
                : user.profilePicture
            }
            alt={user.name || "User"}
            className="avatarimg"
          />

          <h1 className="username">{user.name}</h1>
          <p className="bio">Bio: {user.bio || "No bio provided."}</p>

          {loggedInUser && loggedInUser._id !== user._id && (
            <button onClick={handleFollowToggle} className="follow-btn">
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Optional: List posts by this user if needed */}
        <div className="user-posts">
          <h2 className="head-title">{user.name}'s Posts</h2>
          {user.posts && user.posts.length > 0 ? (
            <div className="posts-container">
              {user.posts.map((post) => (
                <div key={post._id} className="post">
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt={post.title || "Post Media"}
                      className="post-image"
                    />
                  )}
                  <h3 className="title">{post.title || "Untitled Post"}</h3>
                  <p className="content">
                    {post.content || "No content available"}
                  </p>
                  <span className="timestamp">
                    {new Date(post.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>This user has not posted anything yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
