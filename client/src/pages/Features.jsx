import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Microscope, Lightbulb, Network, BookOpen } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Lightbulb size={28} />,
      title: "Idea Incubation",
      desc: "Post your research proposals and get matched with the right collaborators automatically based on skill alignment and interest overlap."
    },
    {
      icon: <Network size={28} />,
      title: "Team Formation",
      desc: "Role-based collaboration requests let Project Creators approve team members. Students can browse open projects and request to join with a single tap."
    },
    {
      icon: <Microscope size={28} />,
      title: "Kanban Task Boards",
      desc: "Built-in drag-and-drop task management keeps every project milestone organized across To-Do, In Progress, and Done columns."
    },
    {
      icon: <BookOpen size={28} />,
      title: "Mentor Feedback",
      desc: "Designated Mentors and Faculty members can review any project, leave structured feedback, and guide teams through iterative research cycles."
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative flex flex-col items-center justify-center min-h-[40vh] px-6 text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.08)_0%,_transparent_70%)] pointer-events-none"></div>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-6">Platform Features</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl leading-[1.1] tracking-tight mb-6 max-w-4xl">
          Everything you need to <em className="font-['Instrument_Serif'] italic text-white/60 font-medium">incubate</em> breakthrough research.
        </motion.h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="liquid-glass rounded-3xl p-8 md:p-10"
          >
            <div className="p-4 bg-white/5 rounded-2xl text-white/70 w-fit mb-6">{f.icon}</div>
            <h3 className="text-2xl text-white tracking-tight mb-3 font-['Instrument_Serif'] italic">{f.title}</h3>
            <p className="text-white/50 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-white/5 py-20 px-6 text-center">
        <Link to="/register" className="liquid-glass rounded-full px-10 py-4 text-white text-base font-medium hover:bg-white/5 transition-colors inline-block">
          Start Collaborating
        </Link>
      </div>
    </div>
  );
};

export default Features;
