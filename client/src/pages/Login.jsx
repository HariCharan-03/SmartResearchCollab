import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.play().catch(() => {}); }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden font-body">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay loop muted playsInline
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-[2] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none" />

      {/* Back to Home */}
      <Link to="/" className="absolute top-6 left-8 z-20 text-white/50 hover:text-white text-sm font-body font-light transition-colors">
        ← ResearchHub
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="liquid-glass rounded-3xl p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-xs tracking-widest uppercase font-body font-light mb-3"
            >
              Welcome back
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-heading italic text-white leading-[1] tracking-tight"
            >
              Sign in to your<br />
              <span className="text-white/50">incubator.</span>
            </motion.h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@university.edu"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/25 text-base font-body font-light"
              />
            </div>

            <div className="liquid-glass rounded-2xl px-5 py-3">
              <label className="text-white/40 text-xs font-body font-light tracking-widest uppercase block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/25 text-base font-body font-light"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass-strong w-full rounded-full py-4 text-white text-base font-body font-medium flex items-center justify-center gap-2 mt-6"
            >
              Sign In <ArrowUpRight size={18} />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm font-body font-light">
            No account?{' '}
            <Link to="/register" className="text-white hover:text-white/70 transition-colors underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
