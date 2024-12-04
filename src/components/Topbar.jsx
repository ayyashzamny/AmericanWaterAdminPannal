// src/components/Topbar.js
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Importing logout icon
import '../styles/TopSide.css'; // Assuming you have custom CSS

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="logo">
        <h2>Admin Panel</h2> {/* You can replace this with your logo */}
      </div>
      <div className="user-info">
        <span>Welcome, Admin</span>
        <button className="logout-button">
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
