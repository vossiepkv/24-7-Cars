import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import "./styles/ProfilePage.css";
import ProfilePictureDefault from "./assets/user.png";

const easeInOutBack = (t, b, c, d, s = 1.70158) => {
  s *= 1.525;
  t /= d / 2;
  if (t < 1) return (c / 2) * (t * t * ((s + 1) * t - s)) + b;
  t -= 2;
  return (c / 2) * (t * t * ((s + 1) * t + s) + 2) + b;
};

const animateWidth = (start, end, duration, onUpdate, onComplete) => {
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const nextWidth = easeInOutBack(
      Math.min(elapsed, duration),
      start,
      end - start,
      duration
    );

    onUpdate(nextWidth);

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      onUpdate(end);
      if (onComplete) onComplete();
    }
  };

  requestAnimationFrame(animate);
};

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const followButtonRef = useRef(null);

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

  const animateFollow = () => {
    const btn = followButtonRef.current;
    if (!btn) return;

    animateWidth(
      90,
      135,
      600,
      (w) => {
        btn.style.width = `${w}px`;
      },
      () => {
        btn.textContent = "Following";
        btn.style.color = "#fff";
        btn.style.backgroundColor = "#2EB82E";
        btn.style.borderColor = "#2EB82E";
      }
    );
  };

  const animateUnfollow = () => {
    const btn = followButtonRef.current;
    if (!btn) return;

    animateWidth(
      135,
      90,
      600,
      (w) => {
        btn.style.width = `${w}px`;
      },
      () => {
        btn.textContent = "Follow";
        btn.style.color = "#3399FF";
        btn.style.backgroundColor = "#ffffff";
        btn.style.borderColor = "#3399FF";
      }
    );
  };

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

      if (isFollowing) {
        animateUnfollow();
      } else {
        animateFollow();
      }

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
            <button
              ref={followButtonRef}
              onClick={handleFollowToggle}
              className="follow-button"
              style={{
                padding: "10px 20px",
                border: "2px solid #FF4C29",
                backgroundColor: "#23242a",
                color: "#FF4C29",
                fontWeight: "bold",
                borderRadius: "4px",
                cursor: "pointer",
                width: "90px",
                overflow: "hidden",
                transition: "none", // disable CSS transition so JS handles it
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

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
