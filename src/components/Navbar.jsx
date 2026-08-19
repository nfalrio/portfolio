import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'beranda', label: 'Home' },
  { id: 'tentang', label: 'About' },
  { id: 'pencapaian', label: 'Achievements' },
  { id: 'proyek', label: 'Projects' },
  { id: 'aktivitas', label: 'Activities' },
  { id: 'skill', label: 'Skills' },
  { id: 'kontak', label: 'Contact' },
];

export default function Navbar({ activeSection, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
        <div className="navbar__inner container">
          <a href="#beranda" className="navbar__logo" onClick={(e) => handleNavClick(e, 'beranda')} aria-label="Beranda">
            <span className="navbar__logo-desktop">Naufal Rio</span>
            <span className="navbar__logo-mobile">Naufal Rio</span>
          </a>

          <div className="navbar__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`navbar__link ${activeSection === item.id ? 'navbar__link--active' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="navbar__actions">
            <button className="navbar__theme-toggle" onClick={onToggleTheme} aria-label={`Ganti ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}>
              <span className={`theme-icon ${theme === 'dark' ? 'theme-icon--sun' : 'theme-icon--moon'}`}>
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </span>
            </button>

            <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--open' : ''}`} />
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--open' : ''}`} />
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__backdrop" onClick={() => setMobileOpen(false)} />
        <div className="mobile-drawer__panel">
          <div className="mobile-drawer__header">
            <span className="navbar__logo">
              <span className="navbar__logo-desktop">Naufal Rio</span>
              <span className="navbar__logo-mobile">Naufal Rio</span>
            </span>
            <button className="mobile-drawer__close" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="mobile-drawer__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`mobile-drawer__link ${activeSection === item.id ? 'mobile-drawer__link--active' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
