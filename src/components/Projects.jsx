import { useState, useRef } from 'react';
import { projects } from '../data/projects.js';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';
import ProjectCard from './ProjectCard.jsx';
import ProjectModal from './ProjectModal.jsx';
import './Projects.css';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useRef(null);
  useRevealOnScroll(sectionRef, 0.1);

  return (
    <section className="projects section" id="proyek" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">03 / Projects</p>
        <h2 className="section-title reveal">Projects</h2>
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
