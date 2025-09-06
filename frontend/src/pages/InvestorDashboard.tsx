import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UserRole } from '@/types';

// Import dashboard components
import InvestorOverview from '@/components/investor/InvestorOverview';
import InvestorWallet from '@/components/investor/InvestorWallet';
import InvestorProjects from '@/components/investor/InvestorProjects';
import InvestorInvestments from '@/components/investor/InvestorInvestments';

const InvestorDashboard: React.FC = () => {
  return (
    <Layout userRole={UserRole.INVESTOR}>
      <Routes>
        <Route path="/" element={<InvestorOverview />} />
        <Route path="/wallet" element={<InvestorWallet />} />
        <Route path="/projects" element={<InvestorProjects />} />
        <Route path="/investments" element={<InvestorInvestments />} />
      </Routes>
    </Layout>
  );
};

export default InvestorDashboard;