// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaGift, FaComments, FaClipboardList, FaBell, FaUsers } from 'react-icons/fa'; // Import icons
import '../styles/Sidebar.css'; // New or updated styling file

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Admin Panel</h2> {/* You can replace this with your logo */}
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard" className="sidebar-link">
            <FaTachometerAlt className="sidebar-icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/promotions" className="sidebar-link">
            <FaGift className="sidebar-icon" /> Promotions
          </Link>
        </li>
        <li>
          <Link to="/complaints" className="sidebar-link">
            <FaComments className="sidebar-icon" /> Complaints
          </Link>
        </li>
        <li>
          <Link to="/requests" className="sidebar-link">
            <FaClipboardList className="sidebar-icon" /> Requests
          </Link>
        </li>
        <li>
          <Link to="/notifications" className="sidebar-link">
            <FaBell className="sidebar-icon" /> Notifications
          </Link>
        </li>
        <li>
          <Link to="/customers" className="sidebar-link">
            <FaUsers className="sidebar-icon" /> Customers
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
