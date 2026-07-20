import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PORTAL_BG, CURTAIN_LEFT, CURTAIN_RIGHT, WORLD_BG, CARD_DATA } from '../constants/villa';


const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const MAG = { world: 6, portal: 7, curtainL: 14, curtainR: 14 };

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

export default function VillaSquence() {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);
  const [entryPhase, setEntryPhase] = useState('initial'); // 'initial', 'open', 'done'
  const [activeVideo, setActiveVideo] = useState(null);

  // Refs for requestAnimationFrame DOM manipulation
  const worldRef = useRef(null);
  const portalRef = useRef(null);
  const curtainLRef = useRef(null);
  const curtainRRef = useRef(null);
  const scene1Ref = useRef(null);
  const scene2Ref = useRef(null);
  const overlayRef = useRef(null);

  const scrollProgressRef = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Handle mount and entrance state phases once on mount
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    const t1 = setTimeout(() => setEntryPhase('open'), 100);
    const t2 = setTimeout(() => setEntryPhase('done'), 2200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Update parallax, scroll effects, and visual positions
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 3.8;
      scrollProgressRef.current = clamp(scrollY / maxScroll, 0, 1);
    };

    const handleMouseMove = (e) => {
      const rx = (e.clientX / window.innerWidth) * 2 - 1;
      const ry = (e.clientY / window.innerHeight) * 2 - 1;
      mousePos.current = { x: rx, y: ry };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    let animationFrameId;

    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.07);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.07);

      const rx = currentPos.current.x;
      const ry = currentPos.current.y;
      const sp = scrollProgressRef.current;
      const easedSp = easeInOut(sp);

      // 1. World Layer
      if (worldRef.current) {
        const scale = lerp(1, 1.5, sp);
        worldRef.current.style.transform = `scale(${scale}) translate3d(${rx * MAG.world}px, ${ry * MAG.world}px, 0)`;
      }

      // 2. Portal Frame
      if (portalRef.current) {
        const scale = lerp(1, 15.0, sp);
        const opacity = clamp(1 - (sp - 0.65) / 0.2, 0, 1);
        portalRef.current.style.transform = `scale(${scale}) translate3d(${rx * MAG.portal}px, ${ry * MAG.portal}px, 0)`;
        portalRef.current.style.opacity = opacity;
      }

      // 3. Curtain Left
      if (curtainLRef.current) {
        const baseShift = 62;
        const scrollShift = lerp(0, 150, easedSp);
        const totalShift = entryPhase === 'initial' ? 0 : baseShift + scrollShift;
        const curtainScrollScale = lerp(1, 1.3, sp);
        curtainLRef.current.style.transform = `translateX(calc(-${totalShift}% + ${rx * MAG.curtainL}px)) translateY(${ry * MAG.curtainL * 0.3}px) scale(${curtainScrollScale}) translateZ(0)`;
      }

      // 4. Curtain Right
      if (curtainRRef.current) {
        const baseShift = 62;
        const scrollShift = lerp(0, 150, easedSp);
        const totalShift = entryPhase === 'initial' ? 0 : baseShift + scrollShift;
        const curtainScrollScale = lerp(1, 1.3, sp);
        curtainRRef.current.style.transform = `translateX(calc(${totalShift}% + ${rx * MAG.curtainR}px)) translateY(${ry * MAG.curtainR * 0.3}px) scale(${curtainScrollScale}) translateZ(0)`;
      }

      // Scene 1 Opacity
      if (scene1Ref.current) {
        const opacity = clamp(1 - sp / 0.22, 0, 1);
        scene1Ref.current.style.opacity = opacity;
      }

      // Scene 2 Opacity
      if (scene2Ref.current) {
        const opacity = clamp((sp - 0.68) / 0.16, 0, 1);
        scene2Ref.current.style.opacity = opacity;
        scene2Ref.current.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
      }

      // Scene 2 Overlay Opacity (fades in black backdrop to 60% opacity)
      if (overlayRef.current) {
        const opacity = clamp((sp - 0.68) / 0.16, 0, 0.6);
        overlayRef.current.style.opacity = opacity;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [entryPhase]);

  // Entrance Styles
  const isTransitioning = entryPhase !== 'done';
  const transitionClass = isTransitioning ? 'transition-transform duration-[1200ms] ease-out' : '';
  const scene1Transition = isTransitioning ? 'transition-all duration-[900ms] delay-300 ease-out' : '';

  const s1MountedClass = isMounted ? 'translate-y-0 opacity-100' : 'translate-y-[20px] opacity-0';

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '480vh' }}>
      <div className="sticky top-0 left-0 w-full h-[100vh] overflow-hidden bg-[#0a0608]">

        {/* WORLD BACKGROUND */}
        <div
          ref={worldRef}
          className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${WORLD_BG})` }}
        />

        {/* PORTAL */}
        <div
          ref={portalRef}
          className="absolute inset-0 w-full h-full bg-cover bg-center will-change-transform z-10"
          style={{ backgroundImage: `url(${PORTAL_BG})`, transformOrigin: '52% 38%' }}
        />

        {/* LEFT CURTAIN */}
        <div
          ref={curtainLRef}
          className={`absolute inset-0 w-[50%] h-full bg-cover bg-right will-change-transform z-20 ${transitionClass}`}
          style={{ backgroundImage: `url(${CURTAIN_LEFT})` }}
        />

        {/* RIGHT CURTAIN */}
        <div
          ref={curtainRRef}
          className={`absolute top-0 right-0 w-[50%] h-full bg-cover bg-left will-change-transform z-20 ${transitionClass}`}
          style={{ backgroundImage: `url(${CURTAIN_RIGHT})` }}
        />

        {/* NAVIGATION BAR */}
        <nav className="absolute top-0 w-full z-50 flex items-center justify-between" style={{ padding: isMobile ? '18px 20px' : '22px 48px' }}>
          {!isMobile ? (
            <>
              <div className="flex gap-6 uppercase text-[12px] tracking-[0.12em] text-white opacity-90">
                <a href="#worlds" className="hover:opacity-100 transition-opacity">Worlds</a>
                <a href="#atelier" className="hover:opacity-100 transition-opacity">Atelier</a>
                <a href="#immersions" className="hover:opacity-100 transition-opacity">Immersions</a>
              </div>
              <div className="w-[28px] h-[28px] flex items-center justify-center">
                <svg viewBox="0 0 28 28" fill="white">
                  <path d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 3.96 2.09-6.42L5 8.42h6.91L14 2z" />
                </svg>
              </div>
              <div className="flex gap-6 uppercase text-[12px] tracking-[0.12em] text-white opacity-90">
                <a href="#craft" className="hover:opacity-100 transition-opacity">Craft</a>
                <a href="#codex" className="hover:opacity-100 transition-opacity">Codex</a>
                <a href="#connect" className="hover:opacity-100 transition-opacity">Connect</a>
              </div>
            </>
          ) : (
            <>
              <a href="#explore" className="uppercase text-[12px] tracking-[0.12em] text-white opacity-90">Explore</a>
              <div className="w-[28px] h-[28px] flex items-center justify-center">
                <svg viewBox="0 0 28 28" fill="white">
                  <path d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 3.96 2.09-6.42L5 8.42h6.91L14 2z" />
                </svg>
              </div>
              <a href="#connect" className="uppercase text-[12px] tracking-[0.12em] text-white opacity-90">Connect</a>
            </>
          )}
        </nav>

        {/* SCENE 1: HERO */}
        <div ref={scene1Ref} className={`absolute inset-0 z-30 flex flex-col ${isMobile ? 'justify-center items-center' : ''} ${scene1Transition} ${s1MountedClass}`}>
          {!isMobile ? (
            // Desktop Layout
            <div className="relative w-full h-full">
              {/* Left Container */}
              <div className="absolute" style={{ top: '46%', left: '60px', maxWidth: '440px' }}>
                <h1 className="font-['Viaoda_Libre'] text-white text-5xl mb-4">FALL › INTO REVERIE</h1>
                <p className="font-['Imprima'] text-white/90 text-lg leading-relaxed">
                  Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the ordinary and the known.
                </p>
              </div>

              {/* Right Container */}
              <div className="absolute flex gap-4" style={{ top: '50%', right: '40px', transform: 'translateY(-50%)' }}>
                {CARD_DATA.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVideo(card.video)}
                    className="relative w-[158px] h-[158px] rounded-[28px] overflow-hidden group cursor-pointer border-0 bg-transparent p-0 text-left outline-none hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-lg"
                  >
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute bottom-0 w-full p-4 flex flex-col justify-end h-full" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)', backdropFilter: 'blur(6px)' }}>
                      {i === 1 ? (
                        <div className="flex flex-col gap-2">
                          <span className="text-white font-['Viaoda_Libre'] text-lg leading-tight drop-shadow-md">32<br />World<br />Patrons</span>
                          <span className="text-white/60 text-[9px] uppercase tracking-[0.15em] font-['Imprima'] group-hover:text-white transition-colors">Play Reel</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/40 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                          <span className="text-white text-xs font-['Imprima']">View Reel</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-[60px] left-[60px] flex gap-2">
                <div className="h-[2px] bg-white w-[28px] rounded-full opacity-100"></div>
                <div className="h-[2px] bg-white w-[14px] rounded-full opacity-40"></div>
                <div className="h-[2px] bg-white w-[14px] rounded-full opacity-40"></div>
                <div className="h-[2px] bg-white w-[14px] rounded-full opacity-40"></div>
              </div>
            </div>
          ) : (
            // Mobile Layout
            <div className="flex flex-col items-center mt-20 px-6 w-full">
              <h1 className="font-['Viaoda_Libre'] text-[#3b1a0a] text-4xl mb-4 text-center">FALL › INTO REVERIE</h1>
              <p className="font-['Imprima'] text-[#3b1a0a] text-base leading-relaxed text-center max-w-[280px] mb-8">
                Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the ordinary and the known.
              </p>

              <button
                onClick={() => setActiveVideo(CARD_DATA[0].video)}
                className="relative w-[158px] h-[158px] rounded-[28px] overflow-hidden group cursor-pointer border-0 bg-transparent p-0 text-left outline-none active:scale-95 transition-transform duration-300 shadow-lg"
              >
                <img src={CARD_DATA[0].img} alt="Card" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 w-full p-4 flex flex-col justify-end h-full" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)', backdropFilter: 'blur(6px)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/40 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <span className="text-white text-xs font-['Imprima']">View Reel</span>
                  </div>
                </div>
              </button>

              {/* Slider Dots */}
              <div className="flex gap-2 mt-8">
                <div className="h-[2px] bg-[#3b1a0a] w-[28px] rounded-full opacity-100"></div>
                <div className="h-[2px] bg-[#3b1a0a] w-[14px] rounded-full opacity-40"></div>
                <div className="h-[2px] bg-[#3b1a0a] w-[14px] rounded-full opacity-40"></div>
                <div className="h-[2px] bg-[#3b1a0a] w-[14px] rounded-full opacity-40"></div>
              </div>
            </div>
          )}

          {/* Scroll Cue (Descend) */}
          {!isMobile && (
            <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className="uppercase text-[10px] tracking-[0.22em] text-white/60">Descend</span>
              <div className="w-[34px] h-[34px] rounded-full border border-white/30 flex items-center justify-center" style={{ animation: 'bobUp 1.8s ease-in-out infinite' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>
          )}
        </div>

        {/* OVERLAY FOR SCENE 2 TEXT */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none will-change-opacity"
          style={{ zIndex: 35, opacity: 0 }}
        />

        {/* SCENE 2: CALL TO ACTION */}
        <div ref={scene2Ref} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none opacity-0">
          <div className="flex flex-col items-center text-center px-6">
            <h2
              className="font-['Viaoda_Libre'] text-white mb-6"
              style={{
                fontSize: 'clamp(38px, 5vw, 78px)',
                letterSpacing: '0.03em',
                lineHeight: 1.05,
                textShadow: '0 2px 20px rgba(0,0,0,0.4)'
              }}
            >
              EXOTEL YEN BAY
            </h2>
            <p
              className="font-['Imprima'] text-white/80"
              style={{
                fontSize: isMobile ? '14px' : '20px',
                maxWidth: isMobile ? '260px' : '480px',
                lineHeight: 1.6
              }}
            >
              Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the ordinary and the known.
            </p>
          </div>
        </div>

      </div>

      {/* MODAL VIDEO PLAYER */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Dark Backdrop Overlay with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Video Player Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative z-[101] w-full max-w-5xl rounded-[24px] overflow-hidden bg-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-video flex items-center justify-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 border border-white/20 text-white/80 hover:text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Video Player */}
              <video
                src={activeVideo}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
