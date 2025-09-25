import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Demo from './pages/Demo';
import DoctorDashboard from './pages/Dashboards/DoctorDashboard';
import PatientDashboard from './pages/Dashboards/PatientDashboard';
import TherapistDashboard from './pages/Dashboards/TherapistDashboard';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard Layout component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-mint-50">
      <Header />
      {children}
    </div>
  );
};

// Main Layout component  
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-mint-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<MainLayout><Demo /></MainLayout>} />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/doctor-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardLayout>
                  <DoctorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardLayout>
                  <PatientDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/therapist-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['therapist']}>
                <DashboardLayout>
                  <TherapistDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;