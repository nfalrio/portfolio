import { useRef } from 'react';
import { skillCategories } from '../data/skills.js';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';
import SkillMarquee from './SkillMarquee.jsx';
import './Skills.css';



export default function Skills() {
  const sectionRef = useRef(null);
  useRevealOnScroll(sectionRef, 0.2);

  // Group all skills into two rows for the marquee
  const allSkills = skillCategories.flatMap((cat) => cat.skills);
  const half = Math.ceil(allSkills.length / 2);
  const row1 = allSkills.slice(0, half);
  const row2 = allSkills.slice(half);

  return (
    <section className="skills section overflow-x-hidden" id="skill" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">05 / Tech Stack</p>
        <h2 className="section-title reveal">Tech Stack</h2>
        <hr className="section-divider reveal mb-12" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="reveal">
          <SkillMarquee items={row1} direction="left" speed={45} />
          <SkillMarquee items={row2} direction="right" speed={50} />
        </div>
      </div>
    </section>
  );
}

