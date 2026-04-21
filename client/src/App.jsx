import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

// Pages — no-shell (full edge-to-edge)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Manifesto from './pages/Manifesto';
import Features from './pages/Features';

// Pages — wrapped in AppShell (video BG + Navbar)
import Dashboard from './pages/Dashboard';
import BrowseIdeas from './pages/BrowseIdeas';
import IdeaDetail from './pages/IdeaDetail';
import PostIdea from './pages/PostIdea';
import TaskBoard from './pages/TaskBoard';
import Profile from './pages/Profile';
import MyProjects from './pages/MyProjects';
import AdminPanel from './pages/AdminPanel';

// Helper: wrap a page in AppShell
const Shell = ({ children }) => <AppShell>{children}</AppShell>;

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'rgba(5,5,10,0.9)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          fontFamily: "'Barlow', sans-serif",
        }
      }} />

      <Routes>
        {/* ── Full edge-to-edge pages (no AppShell) ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/features" element={<Features />} />

        {/* ── Public app pages (with AppShell) ── */}
        <Route path="/ideas" element={<Shell><BrowseIdeas /></Shell>} />
        <Route path="/ideas/:id" element={<Shell><IdeaDetail /></Shell>} />

        {/* ── Protected routes (with AppShell) ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Shell><Dashboard /></Shell></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Shell><Profile /></Shell></ProtectedRoute>
        } />
        <Route path="/my-projects" element={
          <ProtectedRoute><Shell><MyProjects /></Shell></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}><Shell><AdminPanel /></Shell></ProtectedRoute>
        } />
        <Route path="/post-idea" element={
          <ProtectedRoute allowedRoles={['Project Creator']}><Shell><PostIdea /></Shell></ProtectedRoute>
        } />
        <Route path="/projects/:id/tasks" element={
          <ProtectedRoute><Shell><TaskBoard /></Shell></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
