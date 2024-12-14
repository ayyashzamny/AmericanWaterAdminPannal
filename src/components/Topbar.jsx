// src/components/Topbar.jsx
import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Importing logout icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
import '../styles/TopSide.css'; // Assuming you have custom CSS

const Topbar = () => {
  const [username, setUsername] = useState(''); // State to store user's name
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Decode the token to get user details
        const decodedToken = jwtDecode(token);
        const name = decodedToken.username || 'Admin'; // Extract the 'name' field, fallback to 'User'

        // Set the username to display in the top bar
        setUsername(name);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      // If no token is found, redirect to login page
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem('authToken');

    // Redirect the user to the login page
    navigate('/');
  };

  return (
    <div className="topbar">
      <div className="logo">
        <h2>Admin Panel</h2> {/* Replace with your logo if needed */}
      </div>
      <div className="user-info">
        <span>Welcome, {username}</span> {/* Dynamically display the user's name */}
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
