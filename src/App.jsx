import { useMemo } from 'react';
import { useActiveSection } from './hooks/useActiveSection.js';
import { useTheme } from './hooks/useTheme.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Milestones from './components/Milestones';
import Activities from './components/Activities';
import BackToTop from './components/BackToTop.jsx';

const SECTION_IDS = ['beranda', 'tentang', 'pencapaian', 'proyek', 'aktivitas', 'skill', 'kontak'];

export default function App() {
  const sectionIds = useMemo(() => SECTION_IDS, []);
  const activeSection = useActiveSection(sectionIds);
  const { theme, toggleTheme } = useTheme();

  return (
    <>

      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        <Hero />
        <About />
        <Milestones />
        <Projects />
        <Activities />
        <Skills />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
