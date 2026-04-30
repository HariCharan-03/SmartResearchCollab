import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, Compass, User, LayoutGrid, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="liquid-glass rounded-full max-w-6xl mx-auto px-5 py-2.5 flex justify-between items-center" style={{background: 'rgba(5,5,10,0.7)'}}>
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <span className="text-white font-semibold text-lg tracking-tight">ResearchHub</span>
        </Link>

        <div className="flex gap-1 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-white/60 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 text-sm font-medium transition-all">
                <Home size={15} /><span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/ideas" className="flex items-center gap-1.5 text-white/60 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 text-sm font-medium transition-all">
                <Compass size={15} /><span className="hidden sm:inline">Browse</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-1.5 text-white/60 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 text-sm font-medium transition-all">
                <User size={15} /><span className="hidden sm:inline">Profile</span>
              </Link>
              {user.role === 'Admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-red-400/70 hover:text-red-300 px-3 py-1.5 rounded-full hover:bg-red-500/10 text-sm font-medium transition-all">
                  <ShieldCheck size={15} /><span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-1.5 liquid-glass rounded-full px-4 py-1.5 text-white/60 hover:text-red-400 text-sm font-medium transition-all"
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/60 hover:text-white px-4 py-1.5 text-sm font-medium transition-all">Login</Link>
              <Link to="/register" className="liquid-glass rounded-full px-5 py-1.5 text-white text-sm font-medium hover:bg-white/10 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
