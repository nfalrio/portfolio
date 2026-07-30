import { useEffect, useRef } from 'react';
import { skillCategories } from '../data/skills.js';
import './Skills.css';

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="skills section" id="skill" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">03 / Skill</p>
        <h2 className="section-title reveal">Skill & Keahlian</h2>
        <hr className="section-divider reveal" />

        <div className="skills__categories">
          {skillCategories.map((cat, i) => (
            <div className="skills__category reveal" key={cat.name}>
              <div className="skills__category-header">
                <h3 className="skills__category-name">
                  {cat.name}
                </h3>
                <span className="skills__category-number font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="skills__tags">
                {cat.skills.map((skill) => (
                  <span className="skills__tag font-mono" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
