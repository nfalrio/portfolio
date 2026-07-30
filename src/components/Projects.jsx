import { useState, useEffect, useRef } from 'react';
import { projects } from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import ProjectModal from './ProjectModal.jsx';
import './Projects.css';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="projects section" id="proyek" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">02 / Proyek</p>
        <h2 className="section-title reveal">Proyek</h2>
        <hr className="section-divider reveal" />

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
