import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import IdeaCard from '../components/IdeaCard';

const MyProjects = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await api.get('/ideas');
        const myIdeas = res.data.filter(idea => 
          idea.createdBy._id === user._id || 
          idea.teamMembers.some(m => m.userId._id === user._id || m.userId === user._id)
        );
        setIdeas(myIdeas);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchIdeas();
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
        <div className="text-center py-20 glass-panel rounded-xl">
          <p className="text-xl text-gray-400">You are not part of any projects yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
