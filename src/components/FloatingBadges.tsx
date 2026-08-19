import { motion } from 'framer-motion';

const ICON_MAP: Record<string, string> = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  SQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  Vite: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  Figma: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  Excel: 'https://img.icons8.com/color/48/microsoft-excel-2019--v1.png',
  HTML: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
};

interface Badge {
  name: string;
  top: string;
  left: string;
  delay: number;
  speed: number;
}

/* 
  Responsive "Safe Zone" Positioning: 
  To prevent overlapping with the text (which occupies the center/left) 
  and the lanyard (right), badges are placed strictly along the edges.
*/
const BADGES: Badge[] = [
  /* Top Edge */
  { name: 'HTML',         top: '14%',  left: '20%', delay: 1.0,  speed: 5.1 },
  { name: 'Python',       top: '12%',  left: '45%', delay: 0.9,  speed: 4.8 },
  /* Left Edge */
  { name: 'React',        top: '25%', left: '4%',  delay: 0.8,  speed: 4.5 },
  { name: 'Git',          top: '55%', left: '3%',  delay: 1.0,  speed: 5.2 },
  { name: 'Excel',        top: '78%', left: '6%',  delay: 0.95, speed: 4.9 },
  /* Bottom Edge */
  { name: 'SQL',          top: '88%', left: '28%', delay: 1.1,  speed: 5.0 },
  { name: 'Figma',        top: '90%', left: '48%', delay: 1.05, speed: 4.6 },
  { name: 'Vite',         top: '88%', left: '75%', delay: 1.2,  speed: 4.3 },
  /* Right Edge & Top Right */
  { name: 'JavaScript',   top: '15%', left: '88%', delay: 0.85, speed: 5.5 },
  { name: 'Tailwind CSS', top: '45%', left: '92%', delay: 1.1,  speed: 4.2 },
];

export default function FloatingBadges() {
  return (
    <>
      <div className="floating-badges-wrap" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* Constellation lines connecting badges to lanyard area */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <motion.line 
            x1="86%" y1="14%" x2="76%" y2="5%" 
            stroke="var(--accent)" strokeWidth="1.5" opacity="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
          />
          <motion.line 
            x1="55%" y1="88%" x2="76%" y2="60%" 
            stroke="var(--accent)" strokeWidth="1.5" opacity="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, delay: 1.7, ease: 'easeOut' }}
          />
          <motion.line 
            x1="35%" y1="82%" x2="55%" y2="88%" 
            stroke="var(--accent)" strokeWidth="1.5" opacity="0.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 1.9, ease: 'easeOut' }}
          />
        </svg>
        {BADGES.map((badge) => (
          <motion.div
            key={badge.name}
            style={{
              position: 'absolute',
              top: badge.top,
              left: badge.left,
              pointerEvents: 'auto',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [-5, 5, -5],
              y: [-10, 10, -10],
              rotate: [-2, 2, -2],
            }}
            transition={{
              opacity: { duration: 0.5, delay: badge.delay },
              scale: { type: 'spring', stiffness: 220, damping: 18, delay: badge.delay },
              x: { duration: badge.speed, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: badge.speed * 1.3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: badge.speed * 1.6, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.15, rotate: 0 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.875rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'default',
              backdropFilter: 'blur(6px)',
              userSelect: 'none',
              boxShadow: '2px 2px 0 var(--accent)',
              whiteSpace: 'nowrap',
            }}>
              {ICON_MAP[badge.name] && (
                <img
                  src={ICON_MAP[badge.name]}
                  alt=""
                  width={15}
                  height={15}
                  style={{ objectFit: 'contain', flexShrink: 0 }}
                />
              )}
              {badge.name}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Hide badges on mobile — they overlap all content */}
      <style>{`
        @media (max-width: 900px) {
          .floating-badges-wrap { display: none !important; }
        }
      `}</style>
    </>
  );
}

