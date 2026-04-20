import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseIdeas from './pages/BrowseIdeas';
import IdeaDetail from './pages/IdeaDetail';
import PostIdea from './pages/PostIdea';
import TaskBoard from './pages/TaskBoard';
import Profile from './pages/Profile';
import MyProjects from './pages/MyProjects';
import AdminPanel from './pages/AdminPanel';
import Manifesto from './pages/Manifesto';
import Features from './pages/Features';

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isNoNavPage = ['/', '/manifesto', '/features'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 relative overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#151520',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
      
      {!isNoNavPage && <Navbar />}

      {/* Edge-to-edge on landing/manifesto/features, contained for app pages */}
      <main className={isNoNavPage ? "" : "container mx-auto px-4 py-8 relative z-10"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ideas" element={<BrowseIdeas />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/features" element={<Features />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPanel /></ProtectedRoute>} />
          
          <Route path="/post-idea" element={
            <ProtectedRoute allowedRoles={['Project Creator']}><PostIdea /></ProtectedRoute>
          } />
          <Route path="/projects/:id/tasks" element={<ProtectedRoute><TaskBoard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
