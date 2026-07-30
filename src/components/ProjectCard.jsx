import './ProjectCard.css';

export default function ProjectCard({ project, index, onClick }) {
  return (
    <article
      className="project-card reveal"
      onClick={onClick}
      style={{ transitionDelay: `${index * 100}ms` }}
      tabIndex={0}
      role="button"
      aria-label={`Lihat detail proyek ${project.title}`}
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

        <div className="project-card__tags">
          {project.tech.slice(0, 4).map((t) => (
            <span className="project-card__tag font-mono" key={t}>{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="project-card__tag project-card__tag--more font-mono">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <span className="project-card__cta">
          Lihat Detail&nbsp;<span className="project-card__arrow">→</span>
        </span>
      </div>
    </article>
  );
}
