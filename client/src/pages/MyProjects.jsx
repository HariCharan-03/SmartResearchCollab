import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import IdeaCard from '../components/IdeaCard';

const MyProjects = () => {
  const [ideas, setIdeas] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ideasRes, reqsRes] = await Promise.all([
          api.get('/ideas'),
          api.get('/collaborations/my-requests')
        ]);
        
        const myIdeas = ideasRes.data.filter(idea => 
          idea.createdBy._id === user._id || 
          idea.teamMembers.some(m => m.userId._id === user._id || m.userId === user._id)
        );
        setIdeas(myIdeas);
        setRequests(reqsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Projects</h1>
        <p className="text-gray-400">Projects you've created or joined.</p>
      </div>

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
              <div key={req._id} className="liquid-glass p-5 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
