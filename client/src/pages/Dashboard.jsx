import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, LayoutTemplate, Activity, Users, ArrowUpRight, Bell } from 'lucide-react';
import api from '../api/axiosInstance';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalRec: 0, pending: 0 });
  const [pendingCount, setPendingCount] = useState(0);
  const firstName = user?.name?.split(' ')[0] || 'Researcher';

  useEffect(() => {
    if (user?.role === 'Project Creator' || user?.role === 'Admin') {
      api.get('/collaborations/incoming-requests')
        .then(res => setPendingCount(res.data.length))
        .catch(() => {});
    }
  }, [user]);
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 font-body">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
        <div className="liquid-glass p-8 rounded-3xl space-y-3">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Dashboard Menu</p>
          
          <Link to="/my-projects" className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all text-sm font-medium">
            <LayoutTemplate size={16} /> My Projects
          </Link>
          <Link to="/ideas" className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all text-sm font-medium">
            <Users size={16} /> {user?.role === 'Mentor' ? 'Browse Research' : 'Find Teams'}
          </Link>
          <Link to="/profile" className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all text-sm font-medium">
            <Activity size={16} /> Profile Settings
          </Link>

          {user?.role === 'Project Creator' && (
            <>
              <Link to="/post-idea" className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-2xl transition-all text-sm font-medium border border-emerald-500/10">
                <Plus size={16} /> Post New Idea
              </Link>
              <Link to="/requests" className="flex items-center justify-between px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-2xl transition-all text-sm font-medium border border-amber-500/10">
                <span className="flex items-center gap-2"><Bell size={16} /> Requests</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </>
          )}
          
          {user?.role === 'Admin' && (
            <Link to="/admin" className="flex items-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-all text-sm font-medium border border-red-500/10">
               Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow space-y-10">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-white/40 text-xs tracking-widest uppercase font-light mb-2">
              Role: <span className="text-white/70 font-medium">{user?.role}</span>
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9]">
              Welcome back,<br />
              <span className="text-white/50">{firstName}</span>.
            </h1>
          </div>
          {user?.role === 'Project Creator' && (
            <Link to="/post-idea" className="liquid-glass-strong shrink-0 rounded-full py-3 px-6 text-white text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              New Project <Plus size={16} />
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass p-8 rounded-3xl flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-white/5 rounded-2xl text-white/70">
                <LayoutTemplate size={20} />
              </div>
              <span className="text-6xl md:text-7xl font-heading italic text-white/90">12</span>
            </div>
            <div>
              <p className="text-white/40 text-xs font-light uppercase tracking-widest mb-2">Active Projects</p>
              <h3 className="text-xl text-white font-medium">My Incubator</h3>
            </div>
          </div>
          
          <div className="liquid-glass p-8 rounded-3xl flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-white/5 rounded-2xl text-white/70">
                <Users size={20} />
              </div>
              <span className="text-6xl md:text-7xl font-heading italic text-white/90">134</span>
            </div>
            <div>
              <p className="text-white/40 text-xs font-light uppercase tracking-widest mb-2">Collaboration</p>
              <h3 className="text-xl text-white font-medium">Global Network</h3>
            </div>
          </div>
          
          <div className="liquid-glass p-8 rounded-3xl flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-white/5 rounded-2xl text-white/70">
                <Activity size={20} />
              </div>
              <span className="text-6xl md:text-7xl font-heading italic text-white/90">8</span>
            </div>
            <div>
              <p className="text-white/40 text-xs font-light uppercase tracking-widest mb-2">Recent Activity</p>
              <h3 className="text-xl text-white font-medium">Live Updates</h3>
            </div>
            <div className="mt-6 flex -space-x-3">
               <div className="w-10 h-10 rounded-full border-2 border-black bg-white/20"></div>
               <div className="w-10 h-10 rounded-full border-2 border-black bg-white/30"></div>
               <div className="w-10 h-10 rounded-full border-2 border-black bg-white/40 shadow-xl"></div>
            </div>
          </div>
        </div>
        
        {/* Recommended Panel */}
        <div className="pt-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Discovery</p>
          <div className="liquid-glass p-12 md:p-16 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading italic text-white mb-4">Find your next project.</h2>
              <p className="text-white/50 text-sm md:text-base font-light max-w-lg">
                Browse the latest research ideas, submit collaboration requests, and form breakthrough teams automatically.
              </p>
            </div>
            <Link to="/ideas" className="liquid-glass-strong rounded-full px-8 py-4 text-white text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform shrink-0">
               Browse Incubator <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
