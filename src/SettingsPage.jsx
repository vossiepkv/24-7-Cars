import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Settings.css';
import NavBar from './NavBar';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: null,
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] }); // For file input
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission (for updating user info)
  const handleSubmit = (e) => {
    e.preventDefault();

    // You can now send formData to your backend API to update the user info
    const form = new FormData();
    form.append('username', formData.username);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('bio', formData.bio);
    if (formData.profilePicture) {
      form.append('profilePicture', formData.profilePicture);
    }

    // Example API call to update user info (replace with your own API)
    axios.post('https://your-api.com/update-profile', form)
      .then(response => {
        console.log('User updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  // Get the user data from local storage (assuming user is stored in localStorage)
  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    console.error('No user found in localStorage');
    return null;
  };

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username || '',
        email: storedUser.email || '',
        bio: storedUser.bio || '',
        password: '',
        profilePicture: storedUser.profilePicture || null,
      });
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <NavBar />

      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
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
                src={URL.createObjectURL(formData.profilePicture)}
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
            required
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
            required
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
