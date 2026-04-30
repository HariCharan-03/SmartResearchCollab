import React, { useEffect, useRef, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Globe, ArrowRight, Users, Book } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import AboutSection from '../components/landing/AboutSection';
import FeaturedVideoSection from '../components/landing/FeaturedVideoSection';
import PhilosophySection from '../components/landing/PhilosophySection';
import ServicesSection from '../components/landing/ServicesSection';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const videoRef = useRef(null);
  const fadeAnimationRef = useRef(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const animateOpacity = (start, end, duration) => {
      const startTime = performance.now();
      const tick = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        video.style.opacity = start + (end - start) * progress;
        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(tick);
        }
      };
      if (fadeAnimationRef.current) cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = requestAnimationFrame(tick);
    };

    const handleCanPlay = () => {
      video.play().catch(console.error);
      animateOpacity(0, 1, 500);
    };

    let fadingOut = false;
    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 0.55 && !fadingOut) {
        fadingOut = true;
        animateOpacity(parseFloat(video.style.opacity) || 1, 0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        fadingOut = false;
        video.play().catch(console.error);
        animateOpacity(0, 1, 500);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (fadeAnimationRef.current) cancelAnimationFrame(fadeAnimationRef.current);
    };
  }, []);

  return (
    <div className="bg-black w-full min-h-screen text-white">
      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col overflow-hidden">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
          muted
          playsInline
          preload="auto"
        />

        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Globe size={24} className="text-white mr-2" />
              <span className="text-white font-semibold text-lg">ResearchHub</span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <Link to="/features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</Link>
                <Link to="/ideas" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Incubator</Link>
                <Link to="/manifesto" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/register" className="text-white text-sm font-medium hover:text-white/80 transition-colors">Sign Up</Link>
              <Link to="/login" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/10 transition-colors">Login</Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%]">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8 mt-12">
            Accelerate your <em className="font-['Instrument_Serif'] italic font-medium">Research.</em>
          </h1>
          
          <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-8 px-4 font-body font-light">
            Stay updated with the latest breakthroughs and project calls. Join our open-science network today and never miss an opportunity to collaborate.
          </p>

          <Link to="/manifesto" className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Read our Manifesto
          </Link>
        </div>


      </section>

      {/* Embedded Sections */}
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  );
};

export default Landing;
