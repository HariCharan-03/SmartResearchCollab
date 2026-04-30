import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Tag, Users, CheckCircle, Clock, Trash2, Send, Check, X } from 'lucide-react';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updates, setUpdates] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchIdea();
    fetchUpdates();
    if (user && (user.role === 'Mentor' || user.role === 'Admin' || user.role === 'Project Creator')) {
      fetchRequests();
    }
  }, [id, user]);

  const fetchIdea = async () => {
    try {
      const res = await api.get(`/ideas/${id}`);
      setIdea(res.data);
    } catch (err) {
      toast.error('Failed to load project details');
      navigate('/ideas');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    if(!user) return;
    try {
      const res = await api.get(`/updates/project/${id}`);
      setUpdates(res.data);
    } catch (err) {
      console.log('User might not have access to updates yet');
    }
  };

  const fetchRequests = async () => {
    if(!user) return;
    try {
      const res = await api.get(`/collaborations/project/${id}`);
      // Filter only pending requests
      setRequests(res.data.filter(r => r.status === 'Pending'));
    } catch (err) {
      console.log('Could not fetch requests');
    }
  };

  const handleJoinRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/collaborations/request', { ideaId: id, message: requestMessage });
      toast.success('Join request sent successfully!');
      setRequestMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/updates', { projectId: id, message: updateMessage });
      toast.success('Update posted!');
      setUpdateMessage('');
      fetchUpdates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post update');
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/collaborations/${requestId}`, { status });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
      fetchIdea(); // refresh team members
    } catch (err) {
      toast.error('Failed to respond to request');
    }
  };

  const handleDelete = async () => {
    if(window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/ideas/${id}`);
        toast.success('Project deleted');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  if (!idea) return <div>Project not found</div>;

  const isCreatorOrAdmin = user && (idea.createdBy._id === user._id || user.role === 'Admin');
  const isTeamMember = user && idea.teamMembers.some(m => m.userId._id === user._id);
  const canViewUpdates = isTeamMember || (user && user.role === 'Mentor') || isCreatorOrAdmin;
  const canManageRequests = user && (user.role === 'Mentor' || isCreatorOrAdmin);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="liquid-glass p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold">{idea.title}</h1>
          <span className="px-3 py-1 rounded-full text-sm font-medium border bg-surface/50 border-gray-700">
            {idea.status}
          </span>
        </div>
        <p className="text-gray-300 whitespace-pre-wrap mb-6">{idea.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {idea.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-800">
          <div>
            <p className="text-sm text-gray-400">Created by <span className="text-white font-medium">{idea.createdBy.name}</span> • {new Date(idea.createdAt).toLocaleDateString()}</p>
          </div>
          {isCreatorOrAdmin && (
            <button onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm bg-red-400/10 px-3 py-1 rounded transition-colors">
              <Trash2 size={16} /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Collaboration Requests Section */}
          {canManageRequests && requests.length > 0 && (
            <div className="liquid-glass p-6 rounded-xl border border-indigo-500/30">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-300">Pending Requests</h2>
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req._id} className="bg-surface/50 border border-indigo-500/20 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <p className="font-medium text-white">{req.userId.name} <span className="text-xs text-indigo-300 ml-2">({req.userId.role})</span></p>
                      <p className="text-sm text-gray-400 mt-1 italic">"{req.message}"</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleRespond(req._id, 'Approved')} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-2 rounded-full transition-colors" title="Accept">
                        <Check size={18} />
                      </button>
                      <button onClick={() => handleRespond(req._id, 'Rejected')} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-full transition-colors" title="Reject">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Updates & Feedback Section */}
          {canViewUpdates && (
            <div className="liquid-glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Updates & Feedback</h2>
              
              <form onSubmit={handlePostUpdate} className="mb-8">
                <textarea
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Share progress or provide feedback..."
                  className="w-full bg-surface border border-gray-700 rounded-lg p-3 text-white mb-2 focus:ring-1 focus:ring-primary h-24"
                  required
                />
                <div className="flex justify-end">
                  <button type="submit" className="bg-primary hover:bg-indigo-600 px-4 py-2 rounded flex items-center gap-2">
                    <Send size={16} /> Post Update
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {updates.length > 0 ? updates.map(update => (
                  <div key={update._id} className="bg-surface/50 p-4 rounded-lg border border-gray-800">
                    <div className="flex justify-between items-start mb-2 text-sm">
                      <span className="font-medium text-primary">{update.userId.name} <span className="text-xs text-gray-500">({update.userId.role})</span></span>
                      <span className="text-gray-500 text-xs">{new Date(update.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{update.message}</p>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">No updates yet. Be the first to post!</p>
                )}
              </div>
            </div>
          )}

          {/* Kanban Board Link for Members */}
          {isTeamMember && (
             <div className="liquid-glass p-6 rounded-xl flex justify-between items-center bg-gradient-to-r from-surface to-surface/40 hover:border-primary transition-colors cursor-pointer" onClick={() => navigate(`/projects/${id}/tasks`)}>
               <div>
                 <h3 className="text-xl font-bold mb-1">Project Tasks</h3>
                 <p className="text-gray-400 text-sm">Manage tasks and track progress on the Kanban board.</p>
               </div>
               <div className="bg-primary/20 text-primary p-3 rounded-full">
                 <CheckCircle size={24} />
               </div>
             </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Team Members */}
          <div className="liquid-glass p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users size={20} /> Team</h3>
            <ul className="space-y-3">
              {idea.teamMembers.map(member => (
                <li key={member.userId._id} className="flex justify-between items-center text-sm bg-surface p-2 rounded">
                  <span className="text-gray-200">{member.userId.name}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Box for non-members */}
          {!isTeamMember && user && user.role !== 'Mentor' && user.role !== 'Admin' && (
            <div className="liquid-glass p-6 rounded-xl border border-primary/30">
              <h3 className="font-bold mb-2 text-lg">Interested in this project?</h3>
              <p className="text-sm text-gray-400 mb-4">Send a collaboration request to the creator.</p>
              <form onSubmit={handleJoinRequest}>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Why do you want to join? What skills do you bring?"
                  className="w-full bg-surface border border-gray-700 rounded p-2 text-sm text-white mb-3"
                  rows="3"
                  required
                />
                <button type="submit" className="w-full bg-primary hover:bg-indigo-600 py-2 rounded transition-colors text-sm font-medium">
                  Send Request
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
