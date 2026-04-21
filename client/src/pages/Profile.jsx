import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', skills: '', interests: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        skills: user.skills ? user.skills.join(', ') : '',
        interests: user.interests ? user.interests.join(', ') : ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await api.put('/users/profile', payload);
      setUser({ ...res.data, token: user.token });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if(!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="liquid-glass p-8 rounded-2xl relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 right-4 p-2 bg-surface/50 hover:bg-surface text-gray-400 hover:text-white rounded-full transition-colors"
          title="Go back"
        >
          <X size={20} />
        </button>
        <h2 className="text-3xl font-bold mb-2">My Profile</h2>
        <p className="text-gray-400 mb-6 text-sm">Role: <span className="text-primary font-medium">{user.role}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email (Cannot be changed)</label>
            <input 
              type="email" value={user.email} disabled
              className="w-full bg-surface/30 border border-gray-800 text-gray-500 rounded-lg px-4 py-2 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Skills (comma-separated)</label>
            <input 
              type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js, Python"
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Interests (comma-separated)</label>
            <input 
              type="text" value={formData.interests} onChange={(e) => setFormData({...formData, interests: e.target.value})} placeholder="AI, Web3, Clean Energy"
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-indigo-600 py-3 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
