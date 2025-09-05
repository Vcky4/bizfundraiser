import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { InvestorDashboard } from './pages/InvestorDashboard'
import { BusinessDashboard } from './pages/BusinessDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/investor" replace />} />
          <Route path="investor" element={<InvestorDashboard />} />
          <Route path="business" element={<BusinessDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App