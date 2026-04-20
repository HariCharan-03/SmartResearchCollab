import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, Compass, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          ResearchHub
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white flex items-center gap-1"><Home size={18} /> Dashboard</Link>
              <Link to="/ideas" className="text-gray-300 hover:text-white flex items-center gap-1"><Compass size={18} /> Browse</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white flex items-center gap-1"><User size={18} /> Profile</Link>
              {user.role === 'Admin' && (
                <Link to="/admin" className="text-gray-300 hover:text-white flex items-center gap-1">Admin Panel</Link>
              )}
              <button 
                onClick={handleLogout}
                className="ml-4 flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2">Login</Link>
              <Link to="/register" className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
