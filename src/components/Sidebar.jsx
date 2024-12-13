// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaGift, FaComments, FaClipboardList, FaBell, FaUsers, FaUserShield } from 'react-icons/fa'; // Import new icon for Users
import '../styles/Sidebar.css'; // Styling file
import logo from '../Assets/Images/AmericanLogo.png'; // Replace with the path to your logo file

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        {/* Logo Section */}
        <img src={logo} alt="Logo" className="logo-image" />
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
        <li>
          <Link to="/regsiter" className="sidebar-link"> {/* Add Users section */}
            <FaUserShield className="sidebar-icon" /> Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
