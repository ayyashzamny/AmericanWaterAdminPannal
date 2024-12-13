// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Route here
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import pages
import Dashboard from './pages/Dashboard/DashboardPage';
import Promotions from './pages/Promotions/PromotionsPage';
import Complaints from './pages/Complaints/ComplaintsPage';
import Requests from './pages/Requests/RequestsPage';
import Notifications from './pages/Notifications/NotificationsPage';
import Customers from './pages/Customers/CustomersPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/registerPage';

// Import PrivateRoute
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/promotions" element={<PrivateRoute element={<Promotions />} />} />
        <Route path="/complaints" element={<PrivateRoute element={<Complaints />} />} />
        <Route path="/requests" element={<PrivateRoute element={<Requests />} />} />
        <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
        <Route path="/customers" element={<PrivateRoute element={<Customers />} />} />
        <Route path="/regsiter" element={<PrivateRoute  element={<Register />}/>} />

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
