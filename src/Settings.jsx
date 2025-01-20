import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Settings.css';
import NavBar from './NavBar';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('error parsing user from localStorage:', error);
        return null;
      }
    }
    console.error('No user found in localStorage');
    return null;
  };


  return (
<>
<NavBar />
</>
  );
};

export default Settings;