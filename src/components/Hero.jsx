import './Hero.css';

export default function Hero() {
  return (
    <section className="hero section" id="beranda">
      <div className="container hero__container">
        <div className="hero__content">
          <p className="hero__greeting font-mono">Halo, saya</p>
          <h1 className="hero__name">Muhammad Naufal<br />Rio Ramadhan</h1>
          <p className="hero__tagline">
            Data Analyst & Front-End Developer.<br />
            Membangun solusi digital yang efisien melalui analisis data dan pengembangan web.
          </p>

          <div className="hero__actions">
            <a href="#kontak" className="hero__cta">Hubungi Saya <span>→</span></a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__photo-wrapper">
            <svg className="hero__asterisk" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16M20.485 8.95l-16.97 9.898M3.515 8.95l16.97 9.898"/>
            </svg>
            <img src="/img/profil.jpeg" alt="Foto Profil Naufal Rio" className="hero__photo" loading="lazy" />
          </div>
        </div>
      </div>

      <div className="hero__scroll-indicator">
        <a href="#tentang" className="hero__scroll-arrow" aria-label="Scroll ke bawah" style={{ textDecoration: 'none', color: 'inherit' }}>↓</a>
      </div>
    </section>
  );
}
