
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LoginPage from './components/auth/LoginPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import SessionDetailPage from './pages/SessionDetailPage';
import MainLayout from './components/layout/MainLayout';
import Spinner from './components/ui/Spinner';
import HomePage from './pages/HomePage';
import SessionsPage from './pages/SessionsPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-gray">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/home" />} />
      
      <Route path="/home" element={user ? <MainLayout><HomePage /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/clients" element={user ? <MainLayout><ClientsPage /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/clients/:clientId" element={user ? <MainLayout><ClientDetailPage /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/clients/:clientId/sessions/:sessionId" element={user ? <MainLayout><SessionDetailPage /></MainLayout> : <Navigate to="/login" />} />
      
      <Route path="/sessions" element={user ? <MainLayout><SessionsPage /></MainLayout> : <Navigate to="/login" />} />
      
      {/* Settings Route */}
      <Route path="/settings" element={user ? <MainLayout><SettingsPage /></MainLayout> : <Navigate to="/login" />} />


      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default App;
