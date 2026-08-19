import { motion } from 'framer-motion';

export default function SkillMarquee({ items, direction = 'left', speed = 40 }) {
  const loopItems = [...items, ...items];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      padding: '0.5rem 0',
    }}>
      <motion.div
        style={{ display: 'flex', gap: '1rem', width: 'max-content' }}
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {loopItems.map((skill, idx) => (
          <div
            key={`${skill.name}-${idx}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.75rem 1.375rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
            className="marquee-item"
          >
            <img
              src={skill.icon}
              alt={skill.name}
              width={22}
              height={22}
              style={{ objectFit: 'contain', flexShrink: 0 }}
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span>{skill.name}</span>
          </div>
        ))}
      </motion.div>

      <style>{`
        .marquee-item:hover {
          border-color: var(--accent);
          box-shadow: 4px 4px 0 var(--accent);
          transform: translateY(-3px);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
