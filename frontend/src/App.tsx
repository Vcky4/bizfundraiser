import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole } from '@/types';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import InvestorDashboard from '@/pages/InvestorDashboard';
import BusinessDashboard from '@/pages/BusinessDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Protected routes */}
              <Route
                path="/investor/*"
                element={
                  <ProtectedRoute requiredRole={UserRole.INVESTOR}>
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/*"
                element={
                  <ProtectedRoute requiredRole={UserRole.BUSINESS}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect to appropriate dashboard based on user role */}
              <Route
                path="/dashboard"
                element={<Navigate to="/dashboard-redirect" replace />}
              />
              <Route
                path="/dashboard-redirect"
                element={<DashboardRedirect />}
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Component to redirect users to their appropriate dashboard
function DashboardRedirect() {
  const { user } = useAuth();
  
  if (user?.role === UserRole.INVESTOR) {
    return <Navigate to="/investor" replace />;
  } else if (user?.role === UserRole.BUSINESS) {
    return <Navigate to="/business" replace />;
  } else if (user?.role === UserRole.ADMIN) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/" replace />;
}

export default App;