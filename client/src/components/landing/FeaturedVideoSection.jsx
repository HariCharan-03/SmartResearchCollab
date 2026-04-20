import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedVideoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden max-w-6xl mx-auto flex flex-col" ref={ref}>
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.9 }}
        className="relative rounded-3xl overflow-hidden aspect-video w-full"
      >
        <video 
          className="w-full h-full object-cover"
          muted autoPlay loop playsInline preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
        ></video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md w-full">
            <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Our Platform</p>
            <p className="text-white text-sm md:text-base leading-relaxed">
              We bridge the gap between academic vision and real-world incubation. Every project starts with a brilliant hypothesis, and our decentralized network finds the collaborators to prove it.
            </p>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/ideas" className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium inline-block flex-shrink-0">
              Explore Projects
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedVideoSection;
