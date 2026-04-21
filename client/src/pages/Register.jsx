import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Student'
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.play().catch(() => {}); }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const success = await register(formData);
    if (success) navigate('/dashboard');
  };

  const roles = [
    { value: 'Student', label: 'Student / Researcher' },
    { value: 'Project Creator', label: 'Project Creator' },
    { value: 'Mentor', label: 'Mentor / Faculty' },
  ];

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden font-body py-12">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay loop muted playsInline
      />
      <div className="absolute inset-0 bg-black/65 z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-[2] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none" />

      <Link to="/" className="absolute top-6 left-8 z-20 text-white/50 hover:text-white text-sm font-body font-light transition-colors">
        ← ResearchHub
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="liquid-glass rounded-3xl p-10">
          <div className="mb-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-xs tracking-widest uppercase font-body font-light mb-3"
            >
              Join the network
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-heading italic text-white leading-[1] tracking-tight"
            >
              Create your<br />
              <span className="text-white/50">research profile.</span>
            </motion.h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Full Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder="Jane Doe"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/25 text-base font-body font-light"
              />
            </div>

            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required
                placeholder="you@university.edu"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/25 text-base font-body font-light"
              />
            </div>

            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Password</label>
              <input
                type="password" name="password" minLength="6" value={formData.password} onChange={handleChange} required
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/25 text-base font-body font-light"
              />
            </div>

            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Confirm Password</label>
              <input
                type="password" name="confirmPassword" minLength="6" value={formData.confirmPassword} onChange={handleChange} required
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/25 text-base font-body font-light"
              />
            </div>

            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Role</label>
              <select
                name="role" value={formData.role} onChange={handleChange}
                className="w-full bg-transparent border-none outline-none text-white text-base font-body font-light appearance-none cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value} className="bg-black text-white">{r.label}</option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass-strong w-full rounded-full py-4 text-white text-base font-body font-medium flex items-center justify-center gap-2 mt-4"
            >
              Create Account <ArrowUpRight size={18} />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm font-body font-light">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-white/70 transition-colors underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
