import React, { useRef, useEffect } from 'react';
import Navbar from './Navbar';

// Video URLs — using the botanical/nature aesthetic videos
const VIDEO_URLS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4',
];

// Pick a stable video per session so it doesn't flicker on route changes
const SESSION_VIDEO = VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)];

/**
 * AppShell wraps every authenticated / inner-app page with:
 *  - A looping botanical video background (same aesthetic as Login)
 *  - A dark overlay so content remains readable
 *  - The floating liquid-glass Navbar on top
 *  - A scrollable content area over the fixed background
 */
const AppShell = ({ children }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-body overflow-x-hidden">
      {/* Fixed video background — stays in place as user scrolls */}
      <video
        ref={videoRef}
        src={SESSION_VIDEO}
        className="fixed inset-0 w-full h-full object-cover z-0"
        autoPlay loop muted playsInline
      />

      {/* Dark overlay — keeps text readable while showing the video beautifully */}
      <div className="fixed inset-0 bg-black/72 z-[1]" />

      {/* Subtle radial vignette to deepen edges */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)'
        }}
      />

      {/* Floating Navbar — sits above everything */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Page content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
