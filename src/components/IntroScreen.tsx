import { Suspense, lazy, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';
import FloatingBadges from './FloatingBadges';

const Lanyard = lazy(() => import('./Lanyard'));

/* ──────────────────────────────────────────
   Animated canvas: flowing dot-wave pattern
   Visible in both light & dark mode
────────────────────────────────────────── */
function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Read accent color once — parse into rgb components
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#C99A3E';
    const hex = raw.replace('#', '');
    const rC = parseInt(hex.slice(0, 2), 16);
    const gC = parseInt(hex.slice(2, 4), 16);
    const bC = parseInt(hex.slice(4, 6), 16);

    // Check if light or dark mode for opacity tuning
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const baseAlpha = isDark ? 0.14 : 0.22;   // stronger in light mode
    const bumpAlpha = isDark ? 0.20 : 0.32;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 28;
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing;
          const y = row * spacing;

          const wave =
            Math.sin(col * 0.22 + row * 0.35 + t) * 0.5 +
            Math.sin(col * 0.13 - row * 0.28 + t * 0.8) * 0.5;

          const n = (wave + 1) / 2; // 0..1
          const alpha = baseAlpha + n * bumpAlpha;
          const radius = 1.4 + n * 1.4;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rC},${gC},${bC},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
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
      {/* Top-left corner bracket */}
      <svg aria-hidden="true" style={{ position:'absolute', top:'5rem', left:'2rem', opacity:0.25, pointerEvents:'none', zIndex:1 }} width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M18 4 L4 4 L4 18" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      {/* Bottom-right corner bracket */}
      <svg aria-hidden="true" style={{ position:'absolute', bottom:'3.5rem', right:'2rem', opacity:0.25, pointerEvents:'none', zIndex:1 }} width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M32 46 L46 46 L46 32" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      {/* Accent glow blob behind the right column */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-20%',
        right: '-8%',
        width: '55%',
        height: '140%',
        background: 'radial-gradient(ellipse at 65% 40%, rgba(201,154,62,0.18) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(8px)',
      }} />
      {/* Secondary glow — bottom left */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-5%',
        width: '40%',
        height: '60%',
        background: 'radial-gradient(ellipse at 30% 80%, rgba(201,154,62,0.12) 0%, transparent 55%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(12px)',
      }} />
    </>
  );
}

/* ════════════════════════════════════════
   INTRO SCREEN
════════════════════════════════════════ */
export default function IntroScreen() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealOnScroll(sectionRef, 0.1);

  return (
    <section
      id="intro"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* ── Layer 0: animated wave canvas ── */}
      <WaveCanvas />

      {/* ── Layer 1: decorative FX ── */}
      <DecorFX />

      {/* ── Layer 2: floating skill badges ── */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none' }}>
        <FloatingBadges />
      </div>

      {/* ── Layer 3: Lanyard — absolute right, FULL section height ──
          Placed BEFORE text so it renders below text in stacking order  */}
      <div
        className="intro__lanyard"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: '52%',  /* starts after "Kontak" nav item */
          height: '100%',
          zIndex: 3,
        }}
      >
        <Suspense fallback={null}>
          <Lanyard />
        </Suspense>
      </div>

      {/* ── Layer 4: Text content — aligned to container, left half ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Container centering — mirrors .container class */}
        <div style={{
          width: '100%',
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
          paddingTop: '64px', /* navbar offset */
        }}>
          {/* Text only occupies the left ~48% so it doesn't collide with lanyard */}
          <div
            className="intro__text"
            style={{
              width: '48%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              pointerEvents: 'auto',
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.725rem',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                marginBottom: '0.875rem',
              }}
            >
              Welcome to
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              MY
              <br />
              PORTFOLIO
            </motion.h1>

            {/* Accent underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, delay: 0.5 }}
              style={{
                height: '3px',
                width: '72px',
                backgroundColor: 'var(--accent)',
                borderRadius: '2px',
                marginBottom: '1.25rem',
                transformOrigin: 'left',
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.38 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Muhammad Naufal Rio Ramadhan
              <br />
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Data Analyst &amp; Front-End Developer
              </span>
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}
            >
              <a
                href="#tentang"
                className="intro-btn-primary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.7rem 1.6rem',
                  backgroundColor: 'var(--accent)', color: '#fff',
                  fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9rem',
                  border: '2px solid var(--accent)', borderRadius: '6px',
                  textDecoration: 'none', transition: 'all 0.18s ease',
                }}
              >
                Lihat Portfolio →
              </a>
              <a
                href="/cv/cv-naufal-rio-ramadhan.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="intro-btn-secondary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.7rem 1.6rem',
                  backgroundColor: 'transparent', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9rem',
                  border: '2px solid var(--border)', borderRadius: '6px',
                  textDecoration: 'none', transition: 'all 0.18s ease',
                }}
              >
                Lihat CV
              </a>
            </motion.div>
          </div>
        </div>
      </div>



      <style>{`
        .intro-btn-primary:hover {
          background-color: var(--accent-hover) !important;
          border-color: var(--accent-hover) !important;
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 var(--text-primary);
        }
        .intro-btn-secondary:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          background-color: var(--accent-soft) !important;
        }
        @keyframes introBouce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        /* ── Tablet (<=900px) ── */
        @media (max-width: 900px) {
          .intro__text {
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 1.5rem !important;
          }
          .intro__lanyard {
            width: 60% !important;
            height: 40% !important;
            top: auto !important;
            bottom: 0 !important;
            left: 20% !important;
            opacity: 0.35;
          }
        }
        /* ── Mobile (<=768px): hide lanyard, full-width text ── */
        @media (max-width: 768px) {
          .intro__lanyard { display: none !important; }
          .intro__text {
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            padding: 0 1.25rem !important;
          }
        }
        /* ── Small mobile (<=480px) ── */
        @media (max-width: 480px) {
          .intro__text h1 { font-size: 2.75rem !important; line-height: 1.1 !important; }
          .intro__text p  { font-size: 0.875rem !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .intro__lanyard { display: none !important; }
        }
      `}</style>
    </section>
  );
}
