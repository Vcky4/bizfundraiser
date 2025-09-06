import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UserRole } from '@/types';

// Import dashboard components
import BusinessOverview from '@/components/business/BusinessOverview';
import BusinessProjects from '@/components/business/BusinessProjects';
import BusinessWallet from '@/components/business/BusinessWallet';
import BusinessAnalytics from '@/components/business/BusinessAnalytics';

const BusinessDashboard: React.FC = () => {
  return (
    <Layout userRole={UserRole.BUSINESS}>
      <Routes>
        <Route path="/" element={<BusinessOverview />} />
        <Route path="/projects" element={<BusinessProjects />} />
        <Route path="/wallet" element={<BusinessWallet />} />
        <Route path="/analytics" element={<BusinessAnalytics />} />
      </Routes>
    </Layout>
  );
};

export default BusinessDashboard;