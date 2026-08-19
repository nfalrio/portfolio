import { useState } from 'react';
import './ProjectCard.css';

export default function ProjectCard({ project, index, onClick }) {
  const [expandedTech, setExpandedTech] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const extraCount = project.tech.length - 4;
  const extraTech  = project.tech.slice(4);

  return (
    <article
      className="project-card reveal"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      style={{ transitionDelay: `${index * 100}ms` }}
      tabIndex={0}
      role="button"
      aria-label={`View project details ${project.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      <div className="project-card__thumbnail">
        {project.image ? (
          <img src={project.image} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-card__thumb-placeholder">
            <span className="font-mono text-accent">{`<${project.id} />`}</span>
          </div>
        )}
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__summary">{project.summary}</p>

        {project.metrics && project.metrics.length > 0 && (
          <div className="project-card__metrics">
            {project.metrics.slice(0, 3).map((m) => (
              <div className="project-card__metric" key={m.label}>
                <span className="project-card__metric-value font-mono">{m.value}</span>
                <span className="project-card__metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="project-card__tags">
          {project.tech.slice(0, 4).map((t) => (
            <span className="project-card__tag font-mono" key={t}>{t}</span>
          ))}

          {/* "+N" badge — expandable on click, tooltip on hover */}
          {extraCount > 0 && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className="project-card__tag project-card__tag--more font-mono"
                onClick={(e) => {
                  e.stopPropagation(); // don't open modal
                  setExpandedTech(!expandedTech);
                }}
                aria-expanded={expandedTech}
                title={`${extraTech.join(', ')}`}
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                +{extraCount}
              </button>

              {/* Expanded dropdown */}
              {expandedTech && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '2px solid var(--accent)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.75rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    zIndex: 50,
                    boxShadow: '4px 4px 0 var(--accent)',
                    minWidth: '160px',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-7px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '12px', height: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRight: '2px solid var(--accent)',
                    borderBottom: '2px solid var(--accent)',
                  }} />
                  {extraTech.map((t) => (
                    <span
                      key={t}
                      className="project-card__tag font-mono"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <span className="project-card__cta">
          View Details&nbsp;<span className="project-card__arrow">→</span>
        </span>
      </div>

      <style>{`
        .project-card__tag--more {
          color: var(--accent);
          border-color: var(--accent) !important;
          transition: all 0.2s ease;
        }
        .project-card__tag--more:hover {
          background-color: var(--accent) !important;
          color: #fff !important;
          transform: translateY(-2px);
        }
      `}</style>
    </article>
  );
}
