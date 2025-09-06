import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UserRole } from '@/types';

// Import dashboard components
import AdminOverview from '@/components/admin/AdminOverview';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminDashboard: React.FC = () => {
  return (
    <Layout userRole={UserRole.ADMIN}>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/projects" element={<AdminProjects />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;