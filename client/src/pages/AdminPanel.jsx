import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { UserX, Trash2 } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchIdeas();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data);
    } catch (err) {
      toast.error('Failed to fetch ideas');
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm('Delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteIdea = async (id) => {
    if(window.confirm('Delete this project?')) {
      try {
        await api.delete(`/ideas/${id}`);
        toast.success('Project deleted');
        fetchIdeas();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-primary">Admin Control Panel</h1>
      
      <div className="flex gap-4 border-b border-gray-800 pb-2">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('ideas')}
          className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'ideas' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Manage Projects
        </button>
      </div>

      <div className="liquid-glass rounded-xl overflow-hidden">
        {activeTab === 'users' && (
          <table className="w-full text-left">
            <thead className="bg-surface border-b border-gray-800">
              <tr>
                <th className="p-4 font-medium text-gray-400">Name</th>
                <th className="p-4 font-medium text-gray-400">Email</th>
                <th className="p-4 font-medium text-gray-400">Role</th>
                <th className="p-4 font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-gray-800">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{u.role}</span></td>
                  <td className="p-4">
                    {u.role !== 'Admin' && (
                      <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300">
                        <UserX size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'ideas' && (
          <table className="w-full text-left">
            <thead className="bg-surface border-b border-gray-800">
              <tr>
                <th className="p-4 font-medium text-gray-400">Title</th>
                <th className="p-4 font-medium text-gray-400">Creator</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
                <th className="p-4 font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map(idea => (
                <tr key={idea._id} className="border-b border-gray-800">
                  <td className="p-4 truncate max-w-sm">{idea.title}</td>
                  <td className="p-4 text-gray-400">{idea.createdBy?.name || 'Unknown'}</td>
                  <td className="p-4"><span className="bg-gray-800 px-2 py-1 rounded text-xs">{idea.status}</span></td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteIdea(idea._id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
