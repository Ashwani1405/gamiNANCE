import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QuestsPage from './pages/QuestsPage';
import BadgesPage from './pages/BadgesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreditPage from './pages/CreditPage';
import FraudPage from './pages/FraudPage';
import AssistantPage from './pages/AssistantPage';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="main-content">{children}</div>
    </>
  );
}

function App() {
  const { isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><DashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/quests" element={
          <ProtectedRoute>
            <AppLayout><QuestsPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/badges" element={
          <ProtectedRoute>
            <AppLayout><BadgesPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <AppLayout><LeaderboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/credit" element={
          <ProtectedRoute>
            <AppLayout><CreditPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/fraud" element={
          <ProtectedRoute>
            <AppLayout><FraudPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/assistant" element={
          <ProtectedRoute>
            <AppLayout><AssistantPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
