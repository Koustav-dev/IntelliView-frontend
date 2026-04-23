import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemEditor from './pages/ProblemEditor';
import BehavioralInterview from './pages/BehavioralInterview';
import Companies from './pages/Companies';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AIChat from './pages/AIChat';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/problems/:slug" element={
            <ProtectedRoute><ProblemEditor /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/behavioral" element={
            <ProtectedRoute><BehavioralInterview /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/ai-chat" element={
            <ProtectedRoute><AIChat /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
