import React from 'react';

import AdminLayout from '../../components/AdminLayout';
import Dashboard from './Dashboard';


const DashboardPage = () => {
    return (
        <AdminLayout>
            <Dashboard />
        </AdminLayout>
    );
};

export default DashboardPage;