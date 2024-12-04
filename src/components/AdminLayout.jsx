// src/components/AdminLayout.js
import React from 'react';
import AdminSidebar from './Sidebar'; // Make sure the Sidebar component is correctly named
import AdminTopbar from './Topbar';   // Make sure the Topbar component is correctly named
import '../styles/AdminLayout.css';        // Layout-specific styles

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />  {/* Sidebar */}
      
      <div className="main-content">
        <AdminTopbar />  {/* Topbar */}
        
        <div className="content-body">
          {children}  {/* This will render the specific page content (like Dashboard, Promotions, etc.) */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
