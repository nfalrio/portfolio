import { useEffect, useRef } from 'react';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('modal-open');

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    // Focus trap
    const panel = panelRef.current;
    if (panel) panel.focus();

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="project-modal" onClick={onClose}>
      <div
        className="project-modal__panel"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
      >
        <button className="project-modal__close" onClick={onClose} aria-label="Tutup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="project-modal__title">{project.title}</h2>

        {project.problem && (
          <div className="project-modal__section">
            <h3 className="project-modal__label font-mono">MASALAH</h3>
            <p className="project-modal__text">{project.problem}</p>
          </div>
        )}

        <div className="project-modal__section">
          <h3 className="project-modal__label font-mono">{project.processLabel || 'PROSES'}</h3>
          <ol className="project-modal__process">
            {project.process.map((step, i) => (
              <li key={i} className="project-modal__step">{step}</li>
            ))}
          </ol>
        </div>

        <div className="project-modal__section">
          <h3 className="project-modal__label font-mono">HASIL</h3>
          <div className="project-modal__metrics">
            {project.metrics.map((m) => (
              <div className="project-modal__metric" key={m.label}>
                <span className="project-modal__metric-value font-mono text-accent">{m.value}</span>
                <span className="project-modal__metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="project-modal__section">
          <h3 className="project-modal__label font-mono">TECH STACK</h3>
          <div className="project-modal__tech-tags">
            {project.tech.map((t) => (
              <span className="project-modal__tech-tag font-mono" key={t}>{t}</span>
            ))}
          </div>
        </div>

        {(project.links.github || project.links.live) && (
          <div className="project-modal__links">
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="project-modal__link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Live Demo
              </a>
            )}
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="project-modal__link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
