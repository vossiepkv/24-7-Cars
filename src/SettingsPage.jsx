import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Settings.css';
import NavBar from './NavBar';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: null,
  });

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        bio: storedUser.bio || '',
        password: '',
        profilePicture: storedUser.profilePicture || null,
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const form = new FormData();
    form.append('name', formData.name || user.name);
    form.append('email', formData.email || user.email);
    if (formData.password.trim() !== '') {
      form.append('password', formData.password);
    }
    form.append('bio', formData.bio);
    form.append('profilePicture', formData.profilePicture || user.profilePicture);

    try {
      const response = await axios.put(
        `https://two4-7-cars.onrender.com/api/settingsPage/${user._id}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.user) {
        const updatedUser = {
          ...response.data.user,
          profilePicture: response.data.user.profilePicture || user.profilePicture,
        };

        setUser(updatedUser);
        console.log("Updated user state:", updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="settings-container">
      <NavBar />
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        {/* Username */}
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

        {/* Profile Picture */}
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleChange}
            className="form-control"
          />
          {formData.profilePicture && (
            <div className="profile-picture-preview">
              <img
                src={typeof formData.profilePicture === 'string' 
                  ? formData.profilePicture 
                  : URL.createObjectURL(formData.profilePicture)}
                alt="Profile Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>

        {/* Bio */}
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

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Password */}
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

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
