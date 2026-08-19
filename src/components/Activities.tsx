import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { activities } from '../data/activities.js';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';

export default function Activities() {
  const containerRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(containerRef, 0.1);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | string[] | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="section" id="aktivitas">
      <div className="container" ref={containerRef}>
        <p className="section-label reveal">04 / Experience</p>
        <h2 className="section-title reveal">Activities &amp; Experience</h2>
        <hr className="section-divider reveal" style={{ marginBottom: '4rem' }} />

        {/* Timeline wrapper */}
        <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>

          {/* Vertical line (Mobile: Left, Desktop: Center) */}
          <motion.div
            className="timeline-line"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: 'var(--border)',
              scaleY: useTransform(scrollYProgress, [0, 0.9], [0, 1]),
              transformOrigin: 'top',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {activities.map((act, i) => {
              const isEven = i % 2 === 0;
              const isExpanded = expandedIds.includes(act.id);
              
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`timeline-item ${isEven ? 'timeline-item-left' : 'timeline-item-right'}`}
                >
                  {/* Dot */}
                  <div className="timeline-dot-wrapper">
                    <div className="timeline-dot" />
                  </div>

                  {/* Card */}
                  <div className="activity-card">
                    {/* Header row: org + period */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.5rem',
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}>
                        {act.organization}
                      </h3>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--accent)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {act.period}
                      </span>
                    </div>

                    {/* Role + type */}
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9375rem',
                      marginBottom: act.subtitle ? '0.6rem' : '1.25rem',
                    }}>
                      {act.role}
                      <span style={{ margin: '0 0.5rem', color: 'var(--border-hover)' }}>•</span>
                      {act.type}
                    </p>

                    {/* Subtitle / Location */}
                    {act.subtitle && (
                      <p style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.875rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}>
                        {act.subtitle.includes('·') ? (
                          <>
                            <span>{act.subtitle.split('·')[0].trim()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.2rem' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.9, color: 'var(--accent)' }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {act.subtitle.split('·')[1].trim()}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.9, color: 'var(--accent)' }}>
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {act.subtitle}
                          </>
                        )}
                      </p>
                    )}

                    {/* Action Buttons Row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: isExpanded ? '1.5rem' : '0' }}>
                      {/* Toggle Details Button */}
                      {act.details && act.details.length > 0 && (
                        <button
                          onClick={() => toggleExpand(act.id)}
                          className="action-btn"
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      )}

                      {/* View Documentation Button */}
                      {act.image && (
                        <button
                          onClick={() => setSelectedImage(act.image!)}
                          className="action-btn doc-btn"
                        >
                          View Documentation
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {isExpanded && act.details && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ul style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.625rem',
                            marginTop: '0.5rem',
                          }}>
                            {act.details.map((detail: string, j: number) => (
                              <li key={j} style={{
                                position: 'relative',
                                paddingLeft: '1.5rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.65,
                                fontSize: '0.9375rem',
                                listStyle: 'none',
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  color: 'var(--accent)',
                                  fontFamily: 'var(--font-mono)',
                                }}>→</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                position: 'relative',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                backgroundColor: '#111',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '-3rem',
                  right: '0',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                CLOSE
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div style={{
                overflowY: 'auto',
                maxHeight: 'calc(90vh - 1rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                {(Array.isArray(selectedImage) ? selectedImage : [selectedImage]).map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Documentation Preview ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Base / Mobile Layout */
        .timeline-line {
          left: 24px;
        }
        .timeline-item {
          display: flex;
          alignItems: flex-start;
          position: relative;
          width: 100%;
        }
        .timeline-dot-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          width: 50px;
          height: 100%;
          display: flex;
          justify-content: center;
          padding-top: 2rem;
          z-index: 2;
        }
        .timeline-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          background-color: var(--bg-primary);
        }
        .activity-card {
          margin-left: 50px;
          flex: 1;
          padding: 2rem;
          
          /* --- Theme-Connected High Contrast --- */
          background-color: var(--bg-elevated);
          border: 2px solid var(--accent);
          border-radius: 12px;
          box-shadow: 6px 6px 0 var(--accent-soft);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .activity-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 10px 10px 0 var(--accent);
        }
        
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          font-weight: 600;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-sans);
        }
        .action-btn:hover {
          background-color: var(--bg-primary);
          border-color: var(--accent);
          color: var(--accent);
        }
        .doc-btn {
          background-color: var(--bg-primary);
          border-color: var(--accent);
          color: var(--accent);
        }
        .doc-btn:hover {
          background-color: var(--accent);
          color: var(--bg-primary);
        }

        /* Desktop Zig-Zag Layout */
        @media (min-width: 768px) {
          .timeline-line {
            left: 50%;
            transform: translateX(-50%);
          }
          .timeline-item {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          
          /* Even items go to the Left */
          .timeline-item-left {
            flex-direction: row-reverse;
          }
          .timeline-item-left .activity-card {
            margin-left: 0;
            margin-right: 50%;
            /* Add padding to push away from center line slightly */
            margin-right: calc(50% + 30px); 
            width: calc(50% - 30px);
            flex: none;
          }
          .timeline-item-left .timeline-dot-wrapper {
            left: 50%;
            transform: translateX(-50%);
          }

          /* Odd items go to the Right */
          .timeline-item-right {
            flex-direction: row;
          }
          .timeline-item-right .activity-card {
            margin-left: calc(50% + 30px);
            width: calc(50% - 30px);
            flex: none;
          }
          .timeline-item-right .timeline-dot-wrapper {
            left: 50%;
            transform: translateX(-50%);
          }
          
          /* Adjust dot padding to align nicely with card */
          .timeline-dot-wrapper {
            padding-top: 2.25rem;
          }
        }
      `}</style>
    </section>
  );
}
