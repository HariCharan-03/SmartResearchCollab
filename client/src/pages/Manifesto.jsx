import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Manifesto = () => {
  const principles = [
    {
      number: "01",
      title: "Curiosity as a Compass",
      body: "We believe every transformative breakthrough starts not with an answer, but with a question nobody dared to ask. Our platform is engineered around that principle — rewarding the audacious, the interdisciplinary, and the genuinely curious."
    },
    {
      number: "02",
      title: "Collaboration Over Competition",
      body: "Research has always been a collective endeavor. Isolated genius is a myth. The greatest discoveries in history have emerged at the convergence of diverse minds. ResearchHub exists to engineer those collisions — matching unlikely partners across disciplines and geographies."
    },
    {
      number: "03",
      title: "Open Science, Open Doors",
      body: "Knowledge locked behind institutional walls is knowledge wasted. We champion radical transparency in research methodology, citations, and progress tracking. Every project on our platform contributes to the global intellectual commons."
    },
    {
      number: "04",
      title: "From Idea to Impact",
      body: "We do not celebrate proposals. We celebrate outcomes. Our Kanban-driven project workflows, milestone tracking, and mentor feedback systems are designed to relentlessly move research from abstract hypothesis to real-world, replicable results."
    },
    {
      number: "05",
      title: "Mentorship as Infrastructure",
      body: "The most powerful accelerant for a young researcher is not funding — it is access to someone who has already navigated the wilderness. We embed mentorship directly into every project lifecycle as a first-class feature, not an afterthought."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center min-h-[50vh] px-6 text-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08)_0%,_transparent_70%)] pointer-events-none"></div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-6"
        >
          Our Manifesto
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-8 max-w-5xl"
        >
          We exist to <em className="font-['Instrument_Serif'] italic text-white/60 font-medium">accelerate</em> the pace of human discovery.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed"
        >
          ResearchHub is not a tool. It is a conviction — that brilliant ideas deserve brilliant collaborators, and that the right connection changes everything.
        </motion.p>
      </div>

      {/* Principles */}
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-36 space-y-0 divide-y divide-white/5">
        {principles.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.05 }}
            className="py-12 md:py-16 flex flex-col md:flex-row gap-6 md:gap-16"
          >
            <span className="text-white/20 text-sm font-mono tracking-widest flex-shrink-0 pt-1">{p.number}</span>
            <div>
              <h2 className="text-2xl md:text-3xl text-white tracking-tight mb-4 font-['Instrument_Serif'] italic">{p.title}</h2>
              <p className="text-white/50 text-base leading-relaxed">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-white/5 py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-6">Ready to contribute?</p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight mb-10">
            Join the <em className="font-['Instrument_Serif'] italic text-white/60">incubator.</em>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="liquid-glass rounded-full px-10 py-4 text-white text-base font-medium hover:bg-white/5 transition-colors flex items-center gap-2 justify-center">
              Create an Account <ArrowRight size={18} />
            </Link>
            <Link to="/ideas" className="liquid-glass rounded-full px-10 py-4 text-white/70 text-base font-medium hover:bg-white/5 transition-colors">
              Browse Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Manifesto;
