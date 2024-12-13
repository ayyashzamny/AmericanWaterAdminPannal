// src/components/Topbar.jsx
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Importing logout icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import '../styles/TopSide.css'; // Assuming you have custom CSS

const Topbar = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem('authToken'); // Assuming the token is stored in 'token'
    
    // Redirect the user to the login page
    navigate('/'); // Use navigate instead of history.push()
  };

  return (
    <div className="topbar">
      <div className="logo">
        <h2>Admin Panel</h2> {/* You can replace this with your logo */}
      </div>
      <div className="user-info">
        <span>Welcome, Admin</span>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
