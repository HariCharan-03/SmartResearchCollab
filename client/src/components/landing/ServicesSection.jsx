import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="flex justify-between items-end mb-12"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">Platform Features</h2>
          <p className="text-white/40 text-sm hidden md:block">Our toolset</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="liquid-glass rounded-3xl overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden">
              <video 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted autoPlay loop playsInline preload="auto"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
              ></video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
            <div className="p-6 md:p-8 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="uppercase tracking-widest text-white/40 text-xs">Matching</span>
                <div className="liquid-glass rounded-full p-2">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">Project Collaboration</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Connect directly with project creators. Our system matches skills to active initiatives, driving meaningful global change natively.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="liquid-glass rounded-3xl overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden">
              <video 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted autoPlay loop playsInline preload="auto"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"
              ></video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
            <div className="p-6 md:p-8 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="uppercase tracking-widest text-white/40 text-xs">Workflows</span>
                <div className="liquid-glass rounded-full p-2">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">Kanban Taskboards</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                From concept to launch, obsess over every detail inside integrated agile taskboards that make execution feel effortless.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
