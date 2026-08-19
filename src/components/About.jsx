import { useRef } from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';
import './About.css';

export default function About() {
  const sectionRef = useRef(null);
  useRevealOnScroll(sectionRef);

  return (
    <section className="about section" id="tentang" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">01 / About</p>
        <h2 className="section-title reveal">About Me</h2>
        <hr className="section-divider reveal" />

        <div className="about__intro reveal">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            marginBottom: '3rem',
          }}
            className="about-grid"
          >
            {/* Bio card */}
            <div style={{
              padding: '2.5rem',
              border: '2px solid var(--border)',
              backgroundColor: 'var(--bg-surface)',
              boxShadow: '8px 8px 0 var(--accent)',
              borderRadius: '12px',
            }}>
              <p style={{
                fontSize: '1.0625rem',
                lineHeight: 1.75,
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
              }}>
                I'm <strong>Muhammad Naufal Rio Ramadhan</strong>, a Mathematics graduate from Universitas Negeri Malang with an interest in{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Data Analytics</span> and{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Front-End Development</span>.
              </p>
              <p style={{
                fontSize: '1.0625rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}>
                My background in mathematics has helped me develop a logical and systematic approach to problem-solving. I’m interested in exploring how data can be turned into meaningful insights and how web technologies can be used to build practical digital solutions.
              </p>
            </div>

            {/* Capability cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
              <div style={{
                padding: '2rem 2.5rem',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '12px',
                boxShadow: '8px 8px 0 var(--accent)',
                transition: 'all 0.2s ease',
              }}
                className="about-cap-card"
              >
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}>
                  02 / Technical Skills
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  I have worked with <strong>Microsoft Excel</strong>, <strong>SPSS</strong>, <strong>Python</strong>, and{' '}
                  <strong>SQL</strong> for data processing and analysis, as well as <strong>React</strong> and{' '}
                  <strong>Tailwind CSS</strong> for building responsive web interfaces. I also have experience applying data analysis and machine learning in academic and personal projects.
                </p>
              </div>

              <div style={{
                padding: '2rem 2.5rem',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '12px',
                boxShadow: '8px 8px 0 var(--accent)',
                transition: 'all 0.2s ease',
              }}
                className="about-cap-card"
              >
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}>
                  03 / Current Focus
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  I’m currently developing my skills in data analytics, particularly <strong>Python</strong>, <strong>SQL</strong>, <strong>Excel</strong>, <strong>SPSS</strong>, and data visualization. At the same time, I’m continuing to improve my front-end development skills and exploring projects that combine data analysis with interactive web applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        .about-cap-card:hover {
          transform: translateY(-4px);
          box-shadow: 4px 4px 0 var(--accent);
        }
      `}</style>
    </section>
  );
}
