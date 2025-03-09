import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Settings.css";
import NavBar from "./NavBar";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    profilePicture: null,
  });

  // Load user data from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        bio: parsedUser.bio || "",
        password: "", // Do not pre-fill password
        profilePicture: parsedUser.profilePicture || null,
      });
    }
    setLoading(false);
  }, []);

  // Update local storage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!user) return;

  //   const form = new FormData();
  //   if (formData.name.trim()) form.append("name", formData.name);
  //   if (formData.email.trim()) form.append("email", formData.email);
  //   if (formData.password.trim()) form.append("password", formData.password);
  //   if (formData.bio.trim()) form.append("bio", formData.bio);
  //   if (formData.profilePicture)
  //     form.append("profilePicture", formData.profilePicture);

  //   try {
  //     const response = await axios.put(
  //       `https://two4-7-cars.onrender.com/api/settingsPage/${user._id}`,
  //       form,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     if (response.data.user == user) {
  //       alert('No updates made to user');
  //     } else if (response.data.user) {
        
  //       const updatedUser = {
  //         ...response.data.user,
  //         profilePicture:
  //           response.data.user.profilePicture || user.profilePicture,
  //       };

  //       setUser(updatedUser); // Update state (will also update localStorage via useEffect)

  //       alert('Updated user successfully.');
  //     }
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     alert(`Error updating user: ${error.message}`);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
  
    const form = new FormData();
    if (formData.name.trim()) form.append("name", formData.name);
    if (formData.email.trim()) form.append("email", formData.email);
    if (formData.password.trim()) form.append("password", formData.password);
    if (formData.bio.trim()) form.append("bio", formData.bio);
    if (formData.profilePicture)
      form.append("profilePicture", formData.profilePicture);
  
    try {
      const response = await axios.put(
        `https://two4-7-cars.onrender.com/api/settingsPage/${user._id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      const updatedUser = {
          ...response.data.user,
          profilePicture:
          response.data.user.profilePicture || user.profilePicture,
        };
  
      if (JSON.stringify(updatedUser) === JSON.stringify(user)) {
        alert("No updates made to user.");
      } else if (updatedUser) {
        setUser(updatedUser);
        alert("Updated user successfully.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert(`Error updating user: ${error.message}`);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <NavBar />
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleChange}
            className="form-control"
          />
          {formData.profilePicture &&
            typeof formData.profilePicture === "object" && (
              <div className="profile-picture-preview">
                <img
                  src={URL.createObjectURL(formData.profilePicture)}
                  alt="Profile Preview"
                  className="preview-image"
                />
              </div>
            )}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
