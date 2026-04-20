import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
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

const Home = () => (
  <div className="text-center mt-32 min-h-[60vh] flex flex-col items-center justify-center">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

    <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary py-2">
      Accelerate Your Research
    </h1>
    <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
      The smart incubator platform where students, creators, and mentors collaborate, match skills, and build the future together.
    </p>
    <div className="flex gap-4">
      <a href="/register" className="bg-primary hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary/30">
        Get Started
      </a>
      <a href="/ideas" className="bg-surface border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-full font-medium transition-colors">
        Explore Ideas
      </a>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 relative overflow-x-hidden">
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#151520',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} />
        <Navbar />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ideas" element={<BrowseIdeas />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            
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
    </Router>
  );
};

export default App;
