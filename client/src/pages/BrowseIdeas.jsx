import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import IdeaCard from '../components/IdeaCard';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowseIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await api.get('/ideas');
        setIdeas(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-12 font-body pb-20">
      <div className="text-center pt-8 pb-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/40 text-xs font-bold tracking-widest uppercase mb-4"
        >
          Incubator Network
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-heading italic text-white tracking-tight leading-[0.9]"
        >
          Discover your next<br />
          <span className="text-white/50">breakthrough.</span>
        </motion.h1>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/40">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search projects or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full liquid-glass border-none outline-none text-white placeholder:text-white/30 rounded-2xl pl-12 pr-4 py-4 font-light text-sm focus:ring-1 focus:ring-white/20 transition-shadow"
          />
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/40">
            <Filter size={18} />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full liquid-glass border-none outline-none text-white rounded-2xl pl-12 pr-4 py-4 font-light text-sm focus:ring-1 focus:ring-white/20 appearance-none cursor-pointer"
          >
            <option value="All" className="bg-black text-white">All Statuses</option>
            <option value="Open" className="bg-black text-white">Open</option>
            <option value="In Progress" className="bg-black text-white">In Progress</option>
            <option value="Completed" className="bg-black text-white">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      ) : filteredIdeas.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredIdeas.map(idea => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 liquid-glass rounded-3xl max-w-2xl mx-auto">
          <p className="text-lg text-white/50 font-light">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseIdeas;
