import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import IdeaCard from '../components/IdeaCard';
import { Plus, LayoutTemplate, Activity, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalRec: 0, pending: 0 });
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-4">
        <div className="glass-panel p-6 rounded-xl space-y-2">
          <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Dashboard Menu</h2>
          <Link to="/my-projects" className="block px-4 py-2 bg-surface hover:bg-primary/20 text-white rounded transition-colors text-sm font-medium">My Projects</Link>
          <Link to="/ideas" className="block px-4 py-2 bg-surface hover:bg-primary/20 text-white rounded transition-colors text-sm font-medium">Find Teams</Link>
          <Link to="/profile" className="block px-4 py-2 bg-surface hover:bg-primary/20 text-white rounded transition-colors text-sm font-medium">Profile Settings</Link>
          {user?.role === 'Admin' && (
            <Link to="/admin" className="block px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors text-sm font-medium mt-4 border border-red-500/20">Admin Panel</Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow space-y-8">
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-gray-400 mt-2">Role: <span className="text-primary font-medium">{user?.role}</span></p>
          </div>
          {user?.role === 'Project Creator' && (
            <Link to="/post-idea" className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg transition-colors font-medium">
              <Plus size={20} />
              New Project
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-pointer hover:border-primary/50 transition-all">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-primary/20 rounded-xl text-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <LayoutTemplate size={24} />
              </div>
              <span className="text-4xl font-black text-white/90 font-mono tracking-tighter">12</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Active Projects</p>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">My Incubator</h3>
            </div>
            <div className="h-1 w-full bg-surface mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-pointer hover:border-accent/50 transition-all">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-accent/20 rounded-xl text-accent ring-1 ring-accent/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Users size={24} />
              </div>
              <span className="text-4xl font-black text-white/90 font-mono tracking-tighter">134</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Collaboration</p>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Global Network</h3>
            </div>
            <div className="h-1 w-full bg-surface mt-4 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[45%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between group overflow-hidden relative cursor-pointer hover:border-secondary/50 transition-all">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-secondary/20 rounded-xl text-secondary ring-1 ring-secondary/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <Activity size={24} />
              </div>
              <span className="text-4xl font-black text-white/90 font-mono tracking-tighter">8</span>
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Recent Activity</p>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Live Updates</h3>
            </div>
            <div className="mt-4 flex -space-x-2">
               <div className="w-8 h-8 rounded-full border-2 border-[#151520] bg-indigo-500"></div>
               <div className="w-8 h-8 rounded-full border-2 border-[#151520] bg-pink-500"></div>
               <div className="w-8 h-8 rounded-full border-2 border-[#151520] bg-purple-500"></div>
               <div className="w-8 h-8 rounded-full border-2 border-[#151520] bg-gray-600 flex items-center justify-center text-xs font-bold">+5</div>
            </div>
          </div>
        </div>
        
        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="text-primary"/> Recommended For You</h2>
          <div className="text-center py-12 glass-panel rounded-xl">
            <p className="text-gray-500 mb-4">You can browse the latest ideas and submit collaboration requests.</p>
            <Link to="/ideas" className="px-6 py-2 bg-surface border border-gray-700 hover:border-primary text-white rounded transition-colors inline-block line-clamp-1">
              Browse Incubator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
