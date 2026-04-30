import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, MessageSquare, User, Briefcase, Clock, ChevronDown, ChevronUp, Inbox } from 'lucide-react';

const Requests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // which card is expanded for reply
  const [replyMessages, setReplyMessages] = useState({}); // { [requestId]: message }
  const [submitting, setSubmitting] = useState(null); // requestId currently being submitted

  const fetchRequests = async () => {
    try {
      const res = await api.get('/collaborations/incoming-requests');
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const handleRespond = async (requestId, status) => {
    const message = replyMessages[requestId] || '';
    if (!message.trim()) {
      toast.error('Please write a message to the student before responding.');
      return;
    }
    setSubmitting(requestId);
    try {
      await api.put(`/collaborations/${requestId}`, { status, responseMessage: message });
      toast.success(status === 'Approved'
        ? '🎉 Request accepted! Student has been added to the project.'
        : '❌ Request declined and student notified.');
      // Remove from list
      setRequests(prev => prev.filter(r => r._id !== requestId));
      setExpandedId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    } finally {
      setSubmitting(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Collaboration Requests</h1>
          <p className="text-gray-400 text-sm">Students who want to join your projects.</p>
        </div>
        <div className="liquid-glass px-5 py-3 rounded-2xl text-center">
          <p className="text-3xl font-bold text-primary">{requests.length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
        </div>
      </div>

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="liquid-glass rounded-3xl p-16 text-center">
          <Inbox size={48} className="mx-auto text-white/20 mb-4" />
          <h2 className="text-xl font-semibold text-white/50 mb-2">No pending requests</h2>
          <p className="text-gray-500 text-sm">When students apply to your projects, they will appear here.</p>
        </div>
      )}

      {/* Request Cards */}
      <div className="space-y-4">
        {requests.map((req) => {
          const isOpen = expandedId === req._id;
          const isProcessing = submitting === req._id;

          return (
            <motion.div
              key={req._id}
              layout
              className="liquid-glass rounded-2xl overflow-hidden border border-white/5"
            >
              {/* Card Header — always visible */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Student Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
                      {req.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold text-lg">{req.userId?.name}</h3>
                        <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{req.userId?.role}</span>
                      </div>
                      <p className="text-sm text-primary mt-0.5 flex items-center gap-1">
                        <Briefcase size={12} />
                        Wants to join: <span className="font-semibold ml-1">{req.ideaId?.title || 'Unknown Project'}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Expand Toggle */}
                  <button
                    onClick={() => toggleExpand(req._id)}
                    className="shrink-0 text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                  >
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Student's message — always shown */}
                <div className="mt-4 bg-white/5 rounded-xl p-4 border-l-2 border-primary/40">
                  <p className="text-xs text-primary/60 uppercase tracking-wider font-semibold mb-1">Student's Message</p>
                  <p className="text-gray-300 text-sm italic">"{req.message || 'No message provided.'}"</p>
                </div>

                {/* Skills if any */}
                {req.userId?.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {req.userId.skills.map((s, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary/80 border border-primary/20 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Expandable Reply Section */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="reply"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6 space-y-4">
                      {/* Reply message input */}
                      <div>
                        <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                          <MessageSquare size={15} className="text-primary" />
                          Write a message to <span className="text-primary">{req.userId?.name}</span>
                        </label>
                        <textarea
                          rows={3}
                          value={replyMessages[req._id] || ''}
                          onChange={e => setReplyMessages(prev => ({ ...prev, [req._id]: e.target.value }))}
                          placeholder={`e.g., "Welcome to the team! Please check our GitHub repo and join the Discord server."`}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-primary focus:border-primary/40 outline-none resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">This message will be shown to the student in their portal.</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRespond(req._id, 'Approved')}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle size={18} />
                          {isProcessing ? 'Processing...' : 'Accept Request'}
                        </button>
                        <button
                          onClick={() => handleRespond(req._id, 'Rejected')}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle size={18} />
                          {isProcessing ? 'Processing...' : 'Decline Request'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick action when collapsed */}
              {!isOpen && (
                <div className="px-6 pb-5">
                  <button
                    onClick={() => toggleExpand(req._id)}
                    className="w-full text-sm text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/40 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} />
                    Review & Respond
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
