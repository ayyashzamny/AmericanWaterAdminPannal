// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import pages
import Dashboard from './pages/Dashboard/DashboardPage';
import Promotions from './pages/Promotions/PromotionsPage';
import Complaints from './pages/Complaints/ComplaintsPage';
import Requests from './pages/Requests/RequestsPage';
import Notifications from './pages/Notifications/NotificationsPage';
import Customers from './pages/Customers/CustomersPage'

const App = () => {
  return (


    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/promotions" element={<Promotions/>} />
        <Route path="/complaints" element={<Complaints/>} />
        <Route path="/requests" element={<Requests/>} />
        <Route path="/notifications" element={<Notifications/>} />
        <Route path="/customers" element={<Customers/>} />
      </Routes>
    </Router>
  );
};

export default App;
