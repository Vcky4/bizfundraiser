import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Layout/Navbar';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { InvestorDashboard } from './pages/Investor/InvestorDashboard';
import { Projects } from './pages/Investor/Projects';
import { Wallet } from './pages/Investor/Wallet';
import { BusinessDashboard } from './pages/Business/BusinessDashboard';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const getDashboardRedirect = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'INVESTOR': return '/investor';
      case 'BUSINESS': return '/business';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardRedirect()} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={getDashboardRedirect()} />} />
          
          {/* Investor Routes */}
          <Route path="/investor" element={
            <ProtectedRoute requiredRole="INVESTOR">
              <InvestorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/investor/projects" element={
            <ProtectedRoute requiredRole="INVESTOR">
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/investor/wallet" element={
            <ProtectedRoute requiredRole="INVESTOR">
              <Wallet />
            </ProtectedRoute>
          } />
          
          {/* Business Routes */}
          <Route path="/business" element={
            <ProtectedRoute requiredRole="BUSINESS">
              <BusinessDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to appropriate dashboard or home */}
          <Route path="*" element={<Navigate to={getDashboardRedirect()} />} />
        </Routes>
      </main>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;