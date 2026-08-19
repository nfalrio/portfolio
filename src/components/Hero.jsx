import { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';
import FloatingBadges from './FloatingBadges';

const Lanyard = lazy(() => import('./Lanyard'));

/* ──────────────────────────────────────────
   Interactive Particle Network
   • Floating particles with depth (size/speed layers)
   • Constellation lines between nearby particles
   • Mouse-reactive: particles repel from cursor
   • Theme-aware opacity
────────────────────────────────────────── */
function WaveCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Parse accent color
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#C99A3E';
    const hex = raw.replace('#', '');
    const rC = parseInt(hex.slice(0, 2), 16);
    const gC = parseInt(hex.slice(2, 4), 16);
    const bC = parseInt(hex.slice(4, 6), 16);

    const CONNECT_DIST = 140;       // max distance for constellation lines
    const MOUSE_RADIUS = 150;       // cursor repulsion radius (increased for better feel)
    const MOUSE_FORCE = 1.2;        // increased repulsion force

    // Create particles with 3 depth layers
    // Guarantee at least 60 particles so mobile screens don't look empty
    const COUNT = Math.max(60, Math.min(120, Math.floor((W * H) / 9000)));
    const particles = [];
    for (let i = 0; i < COUNT; i++) {
      const layer = Math.random();  // 0–1: back → front
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * (0.15 + layer * 0.25),
        vy: (Math.random() - 0.5) * (0.15 + layer * 0.25),
        radius: 1.0 + layer * 1.5,  // smaller, original size
        layer,
      });
    }

    // Track mouse on WINDOW instead of canvas to avoid pointerEvents='none' issue
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Check theme dynamically every frame
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      // Update positions
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Base speed recovery (so they don't get stuck)
        const baseSpeed = 0.15 + p.layer * 0.25;
        if (Math.abs(p.vx) < baseSpeed * 0.1) p.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(p.vy) < baseSpeed * 0.1) p.vy += (Math.random() - 0.5) * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }
      }

      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Prepare render positions with parallax and wrapping
      const renderCoords = particles.map(p => {
        // Parallax depth: further (lower layer) moves less, closer (higher layer) moves more relative to canvas
        const shiftY = scrollY * (0.15 + p.layer * 0.4);
        let ry = (p.y + shiftY) % H;
        if (ry < 0) ry += H;
        return { x: p.x, y: ry, orig: p };
      });

      // Draw constellation lines
      for (let i = 0; i < renderCoords.length; i++) {
        for (let j = i + 1; j < renderCoords.length; j++) {
          const p1 = renderCoords[i];
          const p2 = renderCoords[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECT_DIST * CONNECT_DIST) {
            const dist = Math.sqrt(distSq);
            // Opacity based on distance and layers
            const avgLayer = (p1.orig.layer + p2.orig.layer) / 2;
            const distRatio = 1 - dist / CONNECT_DIST;
            const lineAlpha = (isDark ? 0.08 : 0.15) * distRatio * (0.5 + avgLayer * 0.5);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rC},${gC},${bC},${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.6 + avgLayer * 0.4;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of renderCoords) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.orig.radius, 0, Math.PI * 2);
        // Dynamic opacity based on theme
        const pAlpha = isDark ? 0.25 + p.orig.layer * 0.35 : 0.60 + p.orig.layer * 0.40;
        ctx.fillStyle = `rgba(${rC},${gC},${bC},${pAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Draw mouse glow
      if (mx > 0 && my > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
        grad.addColorStop(0, `rgba(${rC},${gC},${bC},${isDark ? 0.12 : 0.22})`);
        grad.addColorStop(1, `rgba(${rC},${gC},${bC},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(mx - MOUSE_RADIUS, my - MOUSE_RADIUS, MOUSE_RADIUS * 2, MOUSE_RADIUS * 2);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ──────────────────────────────────────────
   Decorative geometry: corner brackets + glow
────────────────────────────────────────── */
function DecorFX() {
  return (
    <>
      <svg aria-hidden="true" style={{ position:'absolute', top:'5rem', left:'2rem', opacity:0.25, pointerEvents:'none', zIndex:1 }} width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M18 4 L4 4 L4 18" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      <svg aria-hidden="true" style={{ position:'absolute', bottom:'3.5rem', right:'2rem', opacity:0.25, pointerEvents:'none', zIndex:1 }} width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M32 46 L46 46 L46 32" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-20%', right: '-8%',
        width: '55%', height: '140%',
        background: 'radial-gradient(ellipse at 65% 40%, rgba(201,154,62,0.18) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0, filter: 'blur(8px)',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-15%', left: '-5%',
        width: '40%', height: '60%',
        background: 'radial-gradient(ellipse at 30% 80%, rgba(201,154,62,0.12) 0%, transparent 55%)',
        pointerEvents: 'none', zIndex: 0, filter: 'blur(12px)',
      }} />
    </>
  );
}

/* ════════════════════════════════════════
   HERO SECTION
   Combines: dotted wave bg + lanyard ID card + floating badges + text
════════════════════════════════════════ */
export default function Hero() {
  const [showLanyard, setShowLanyard] = useState(false);

  useEffect(() => {
    // Delay lanyard spawn so it drops AFTER text reveals
    const timer = setTimeout(() => setShowLanyard(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="hero section hero-container"
      id="beranda"
      style={{
        position: 'relative',
        height: 'auto',
        minHeight: '100vh',
        overflowX: 'clip', /* Bulletproof horizontal scroll lock */
        overflowY: 'visible', /* Allow content to push down naturally */
        display: 'flex',
        alignItems: 'center',
        padding: 0, // Override global .section padding
      }}
    >
      {/* Layer 0: Animated dot-wave background */}
      <WaveCanvas />

      {/* Layer 1: Decorative FX */}
      <DecorFX />

      {/* Layer 2: Floating badges */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <FloatingBadges />
      </div>

      {/* Layer 3 & 4: Main Content (Flexbox) */}
      <div
        className="hero__content-wrapper"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1024px', // Reduced from 1120px to make it fit tighter horizontally
          margin: '0 auto',
          padding: '0 1.5rem',
          minHeight: '100vh',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2%', // Control the exact spacing between text and card
          pointerEvents: 'none', // Let clicks pass through empty space to background
        }}
      >
        {/* Left Column: Text */}
        <motion.div
          id="hero-text"
          className="hero__text"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          style={{
            width: '48%',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
            paddingTop: 'var(--navbar-height)',
            position: 'relative',
            zIndex: 20,
          }}
        >
          {/* =========================================
              DESKTOP CONTENT (Hidden on Mobile)
             ========================================= */}
          <motion.h1 
            className="desktop-only"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              color: 'var(--text-primary)',
              marginBottom: '3.5rem',
            }}>
            MY<br />PORTFOLIO
          </motion.h1>

          <motion.p 
            className="desktop-only"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.25rem',
            }}>
            Muhammad Naufal Rio Ramadhan
          </motion.p>

          <motion.div 
            className="hero__tags desktop-only"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}>
            {['Data Analyst', 'Web Developer', 'Mathematics Graduate'].map((tag) => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: 'var(--accent)',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                boxShadow: '0 2px 8px var(--accent-soft)',
              }}>
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p 
            className="desktop-only"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              marginBottom: '2rem',
              maxWidth: '460px',
            }}>
            Mathematics graduate passionate about data analysis, visualization, and web development.
            Turning data into meaningful insights and building practical digital solutions.
          </motion.p>

          <motion.div 
            className="hero__cta-container desktop-only"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#tentang"
              className="hero__cta"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF',
                background: 'var(--accent)', padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                border: '2px solid var(--accent)',
                transition: 'all 0.2s ease',
              }}
            >
              View Portfolio <span aria-hidden="true">→</span>
            </a>
            <a
              href="/cv/cv-naufal-rio-ramadhan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__cta hero__cta--secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)',
                background: 'transparent', padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                border: '2px solid var(--border)',
                transition: 'all 0.2s ease',
              }}
            >
              View CV
            </a>
          </motion.div>

          {/* =========================================
              MOBILE CONTENT (Neo-Brutalist Layout)
             ========================================= */}
          <motion.div
            className="mobile-only hero__brutalist-photo-wrap"
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}
          >
            {/* Matahari gerak di belakang (Geometric Asterisk matching the reference) */}
            <svg 
              className="hero__brutalist-sun"
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" 
                stroke="var(--accent)" 
                strokeWidth="6" 
                strokeLinecap="round" 
              />
            </svg>

            <img 
              src="/img/profil.jpeg" 
              alt="Muhammad Naufal Rio Ramadhan"
              className="hero__brutalist-img"
            />
          </motion.div>

          <motion.p 
            className="mobile-only hero__halo-saya"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            PORTFOLIO
          </motion.p>

          <motion.h2 
            className="mobile-only hero__name-mobile"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            Muhammad Naufal<br/>Rio Ramadhan
          </motion.h2>

          <motion.p 
            className="mobile-only hero__role-mobile"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            Data Analyst, Web Development, & Mathematics Graduate
          </motion.p>

          <motion.p 
            className="mobile-only hero__desc-mobile"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            Mathematics graduate passionate about data analysis and web development. 
            Turning data into meaningful insights and building practical digital solutions.
          </motion.p>

          <motion.div 
            className="mobile-only hero__cta-mobile-wrap"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            <a href="#tentang" className="hero__cta-mobile">
              View My Portfolio <span aria-hidden="true">→</span>
            </a>
            <a href="/cv/cv-naufal-rio-ramadhan.pdf" target="_blank" rel="noopener noreferrer" className="hero__cta-mobile hero__cta-mobile--secondary">
              View CV
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Lanyard */}
        <motion.div
          className="hero__lanyard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{
            position: 'relative',
            width: '45%', // Takes up the remaining right side
            alignSelf: 'stretch', // Force it to fill the full 100vh container height
            pointerEvents: 'none', // The wrapper itself doesn't need pointer events
          }}
        >
          {/* 
            Expand the canvas far beyond the 45% box so the card doesn't clip when swinging.
            By expanding equally to the left and right (-50%), the center remains EXACTLY the same, 
            so the camera and card position are unaffected! 
          */}
          <div className="hero__lanyard-canvas-wrapper">
            <Suspense fallback={null}>
              {showLanyard && <Lanyard />}
            </Suspense>
          </div>
        </motion.div>
      </div>

      <style>{`
        .desktop-only {
          display: block;
        }
        div.desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none !important;
        }

        .hero__cta {
          position: relative;
          overflow: hidden;
        }
        .hero__cta span {
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          display: inline-block;
        }
        .hero__cta:hover {
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 var(--border);
        }
        .hero__cta:hover span {
          transform: translateX(4px);
        }
        
        .hero__lanyard-canvas-wrapper {
          position: absolute;
          top: 0;
          bottom: 0;
          left: -150%;
          right: -150%;
          pointerEvents: auto;
        }

        .hero__cta--secondary:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          background-color: var(--bg-elevated) !important;
          box-shadow: 0 4px 12px rgba(217, 164, 65, 0.1);
        }

        /* ── Tablet & Mobile (<=900px) ── */
        @media (max-width: 900px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
          p.mobile-only, h2.mobile-only, div.hero__brutalist-photo-wrap {
            display: block !important;
          }

          .hero__lanyard {
            display: none !important; /* Hide heavy 3D scene on mobile */
          }
          .hero-container {
            align-items: flex-start !important;
          }
          .hero__content-wrapper {
            flex-direction: column !important;
            justify-content: flex-start !important; /* Prevents top overflow */
            padding-top: calc(var(--navbar-height) + 1rem) !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .hero__text {
            width: 100% !important;
            align-items: flex-start !important; /* Left aligned per brutalist spec */
            text-align: left !important;
            padding: 0 1.5rem !important; 
            order: 1;
            margin-bottom: 4rem;
          }
          
          /* Brutalist Photo Styling */
          .hero__brutalist-photo-wrap {
            position: relative;
            width: 100%;
            max-width: 360px;
            margin: 0 0 3rem 0; /* Space below photo */
            cursor: pointer;
          }
          
          .hero__brutalist-sun {
            position: absolute;
            top: -30px;
            right: -30px;
            width: 100px;
            height: 100px;
            z-index: 0;
            animation: rotateSun 12s linear infinite;
            opacity: 0.9;
          }
          @keyframes rotateSun {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .hero__brutalist-img {
            position: relative;
            z-index: 1;
            width: 100%;
            aspect-ratio: 1 / 1.1;
            object-fit: cover;
            border-radius: 24px 24px 24px 4px; /* Brutalist sharp corner */
            box-shadow: 12px 12px 0px var(--accent); /* Hard offset shadow */
            transform: rotate(-2deg); /* Dynamic tilt */
            border: 2px solid var(--border); /* Optional subtle boundary */
            background-color: var(--bg-surface);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
          }
          .hero__brutalist-photo-wrap:hover .hero__brutalist-img {
            transform: rotate(0deg) scale(1.02);
            box-shadow: 16px 16px 0px var(--accent);
          }

          /* Mobile Typography */
          .hero__halo-saya {
            font-size: 0.875rem;
            font-family: var(--font-mono);
            color: var(--accent);
            letter-spacing: 0.25em; /* Premium spacing */
            margin-bottom: 0.5rem;
            font-weight: 700;
          }
          .hero__name-mobile {
            font-size: 2.5rem;
            font-family: var(--font-sans);
            font-weight: 800;
            line-height: 1.15;
            color: var(--text-primary);
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
          }
          .hero__role-mobile {
            font-size: 1rem;
            font-weight: 700; /* Bold */
            color: var(--text-primary); /* Brighter contrast */
            margin-bottom: 0.5rem;
          }
          .hero__desc-mobile {
            font-size: 0.95rem;
            color: var(--text-secondary); /* Grey text */
            line-height: 1.6;
            margin-bottom: 2.5rem;
            max-width: 90%;
          }

          /* Mobile CTA Container */
          .hero__cta-mobile-wrap {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .hero__cta-mobile {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            font-size: 1rem;
            font-weight: 700;
            color: var(--bg-primary); /* Dark text on gold */
            background: var(--accent);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-sm);
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.5); /* Hard button shadow */
            border: 2px solid var(--accent);
          }
          .hero__cta-mobile--secondary {
            background: transparent;
            color: var(--text-primary);
            border: 2px solid var(--border);
            box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
          }
          .hero__cta-mobile:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px rgba(0,0,0,0.5);
          }
        }

        /* ── Smaller Mobile (<=480px) ── */
        @media (max-width: 480px) {
          .hero__name-mobile {
            font-size: 2.25rem !important;
          }
          .hero__brutalist-photo-wrap {
            max-width: 300px;
            margin-bottom: 2.5rem;
          }
          .hero__text {
            padding: 0 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
