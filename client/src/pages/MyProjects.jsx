import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import IdeaCard from '../components/IdeaCard';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProjects = () => {
  const [ideas, setIdeas] = useState([]);
  const [requests, setRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = [
          api.get('/ideas'),
          api.get('/collaborations/my-requests')
        ];

        // Fetch incoming requests only for Project Creator and Admin (they manage requests)
        if (user.role === 'Project Creator' || user.role === 'Admin') {
          fetchPromises.push(api.get('/collaborations/incoming-requests'));
        }

        const results = await Promise.all(fetchPromises);
        
        const ideasRes = results[0];
        const reqsRes = results[1];
        const incomingRes = results[2]; // may be undefined
        
        const myIdeas = ideasRes.data.filter(idea => {
          const creatorMatch = idea.createdBy._id === user._id || idea.createdBy === user._id;
          const memberMatch = idea.teamMembers.some(m => {
            // userId may be a populated object {_id, name} or a raw string
            const memberId = m.userId?._id || m.userId;
            return String(memberId) === String(user._id);
          });
          return creatorMatch || memberMatch;
        });
        setIdeas(myIdeas);
        setRequests(reqsRes.data);
        if (incomingRes) setIncomingRequests(incomingRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/collaborations/${requestId}`, { status, responseMessage });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
      setRespondingTo(null);
      setResponseMessage('');
    } catch (err) {
      toast.error('Failed to respond to request');
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {user?.role === 'Mentor' ? 'Research Reviews' : 'My Dashboard'}
        </h1>
        <p className="text-gray-400">
          {user?.role === 'Mentor'
            ? 'Browse and give feedback on active research projects.'
            : 'Manage your projects and applications.'}
        </p>
      </div>

      {/* Incoming Requests Panel for Mentors/Creators */}
      {incomingRequests.length > 0 && (
        <div className="mb-10 liquid-glass p-6 rounded-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-300">Action Required: New Applications</h2>
          <div className="space-y-3">
            {incomingRequests.map(req => (
              <div key={req._id} className="bg-surface/50 border border-indigo-500/20 p-4 rounded-lg flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-medium text-white text-lg">
                      {req.userId.name} <span className="text-xs text-indigo-300 ml-2">({req.userId.role})</span>
                    </p>
                    <p className="text-sm text-primary mb-1">Applied for: <span className="font-semibold">{req.ideaId?.title}</span></p>
                    <p className="text-sm text-gray-400 italic">"{req.message}"</p>
                  </div>
                  
                  {respondingTo !== req._id ? (
                    <div className="shrink-0">
                      <button onClick={() => setRespondingTo(req._id)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-colors font-medium text-sm">
                        Review Application
                      </button>
                    </div>
                  ) : (
                    <div className="w-full md:w-auto shrink-0 flex gap-2">
                      <button onClick={() => handleRespond(req._id, 'Approved')} className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-full transition-colors font-medium text-sm border border-green-500/30">
                        <Check size={16} /> Accept
                      </button>
                      <button onClick={() => handleRespond(req._id, 'Rejected')} className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-full transition-colors font-medium text-sm border border-red-500/30">
                        <X size={16} /> Reject
                      </button>
                      <button onClick={() => { setRespondingTo(null); setResponseMessage(''); }} className="text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                {respondingTo === req._id && (
                  <div className="mt-2 pt-4 border-t border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 block">Return a Message to Student</label>
                    <textarea 
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="e.g., Welcome to the team! Please check the GitHub repo."
                      className="w-full bg-black/40 border border-indigo-500/30 rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-indigo-500 outline-none"
                      rows="2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {ideas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map(idea => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 liquid-glass rounded-xl">
          <p className="text-gray-400">You are not part of any projects yet.</p>
        </div>
      )}

      {/* Tracking Sent Requests */}
      <div className="pt-10 border-t border-white/10 mt-10">
        <h2 className="text-2xl font-bold mb-2">Sent Requests</h2>
        <p className="text-gray-400 mb-6">Track the status of your project applications.</p>

        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req._id} className="liquid-glass p-5 rounded-xl border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium text-lg text-white">{req.ideaId?.title || 'Unknown Project'}</h3>
                    <p className="text-sm text-gray-400 mt-1 italic line-clamp-2">"{req.message}"</p>
                    <p className="text-xs text-gray-500 mt-2">Sent on: {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      req.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      req.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                {req.responseMessage && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Mentor's Reply</p>
                    <p className="text-sm text-gray-300 italic border-l-2 border-primary pl-3 py-1 bg-primary/5 rounded-r">
                      "{req.responseMessage}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 liquid-glass rounded-xl border border-white/5">
            <p className="text-gray-400">You haven't sent any collaboration requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
