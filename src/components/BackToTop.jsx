import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    // Initiate smooth scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    let lastScrollY = window.scrollY;
    let stableFrames = 0;

    const checkScroll = () => {
      // Reached top successfully
      if (window.scrollY === 0) return;

      if (window.scrollY === lastScrollY) {
        stableFrames++;
      } else {
        stableFrames = 0;
        lastScrollY = window.scrollY;
      }

      // If scrollY is stuck (stable for 5 frames) but hasn't reached 0, force snap
      if (stableFrames >= 5) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return;
      }

      requestAnimationFrame(checkScroll);
    };

    // Start polling next frame
    requestAnimationFrame(checkScroll);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={scrollTop}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll ke atas"
          style={{
            position: 'fixed',
            bottom: '1.75rem',
            right: '1.75rem',
            zIndex: 9999,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            border: '2px solid var(--accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700,
            boxShadow: '2px 2px 0 var(--text-primary)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
