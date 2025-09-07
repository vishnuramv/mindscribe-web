
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LoginPage from './components/auth/LoginPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import SessionDetailPage from './pages/SessionDetailPage';
import MainLayout from './components/layout/MainLayout';
import Spinner from './components/ui/Spinner';
import ComingSoonPage from './pages/ComingSoonPage';

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
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/clients" />} />
      
      <Route path="/clients" element={user ? <MainLayout><ClientsPage /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/clients/:clientId" element={user ? <MainLayout><ClientDetailPage /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/clients/:clientId/sessions/:sessionId" element={user ? <MainLayout><SessionDetailPage /></MainLayout> : <Navigate to="/login" />} />
      
      <Route path="/sessions" element={user ? <MainLayout><ComingSoonPage title="Sessions" /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/calendar" element={user ? <MainLayout><ComingSoonPage title="Calendar" /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/templates" element={user ? <MainLayout><ComingSoonPage title="Templates" /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/compliance-checker" element={user ? <MainLayout><ComingSoonPage title="Compliance Checker" /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/practice-settings" element={user ? <MainLayout><ComingSoonPage title="Practice Settings" /></MainLayout> : <Navigate to="/login" />} />

      <Route path="/" element={<Navigate to="/clients" />} />
      <Route path="*" element={<Navigate to="/clients" />} />
    </Routes>
  );
};

export default App;
