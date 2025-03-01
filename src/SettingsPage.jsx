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

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user._id; // Assuming you have the user ID from authentication

    console.log("userId:", userId); // Log the userId being used
    console.log("user object:", user); // Log the entire user object
  

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    
    if (formData.password.trim() !== '') {
      form.append('password', formData.password); //Handle password securely on the backend!
    }
    form.append('bio', formData.bio);
    if (formData.profilePicture) {
      form.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await axios.put(`https://two4-7-cars.onrender.com/api/settingsPage/${userId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('User updated successfully:', response.data);
      setUser(response.data.user); // Update user state after successful update.
      // Update UI with the new user data
    } catch (error) {
      console.error('Error updating user:', error);
      //Handle error gracefully (e.g., display error message to the user).
    }
  };

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  };

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.name || '',
        email: storedUser.email || '',
        bio: storedUser.bio || '',
        password: '',
        profilePicture: storedUser.profilePicture || null,
      });
      setLoading(false);
    }
  }, []); // No need for a dependency array here because we only fetch once.

  useEffect(() => {
    if (user) {
      testSimpleRoute();
    }
  }, [user]);


  const testSimpleRoute = async () => {
    const userId = user._id;
    try {
      const response = await axios.get(`/settingsPage/${userId}`);
      console.log('Test route response:', response.data);
    } catch (error) {
      console.error('Error testing simple route:', error);
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
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="name"
            value={formData.name}
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
            className="formControl"
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
