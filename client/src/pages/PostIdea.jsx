import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const PostIdea = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', tags: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t)
      };
      const res = await api.post('/ideas', payload);
      toast.success('Project created successfully!');
      navigate(`/ideas/${res.data._id}`);
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="liquid-glass p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6">Launch New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
            <input 
              type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Detailed Description</label>
            <textarea 
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows="6"
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
            <input 
              type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="Machine Learning, React, IoT"
              className="w-full bg-surface border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 py-3 rounded-lg font-medium transition-opacity">
            Publish Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostIdea;
