import { useState, useEffect, useRef } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // API Web3Forms memungkinkan kirim email langsung tanpa backend sendiri
      // Kamu perlu mengganti "YOUR_ACCESS_KEY_HERE" dengan kuncimu sendiri
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="contact section" id="kontak" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">04 / Kontak</p>
        <h2 className="section-title reveal">Hubungi Saya</h2>
        <hr className="section-divider reveal" />

        <div className="contact__layout">
          <div className="contact__left reveal">
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__field">
                <input
                  type="text"
                  name="name"
                  id="contact-name"
                  className="contact__input"
                  placeholder=" "
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="contact-name" className="contact__label">Nama</label>
              </div>

              <div className="contact__field">
                <input
                  type="email"
                  name="email"
                  id="contact-email"
                  className="contact__input"
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="contact-email" className="contact__label">Email</label>
              </div>

              <div className="contact__field">
                <textarea
                  name="message"
                  id="contact-message"
                  className="contact__input contact__textarea"
                  placeholder=" "
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="contact-message" className="contact__label">Pesan</label>
              </div>

              <button
                type="submit"
                className="contact__submit"
                disabled={status === 'sending'}
              >
                {status === 'idle' && 'Kirim Pesan'}
                {status === 'sending' && 'Mengirim...'}
                {status === 'success' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    Pesan Terkirim
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                )}
                {status === 'error' && 'Gagal, Coba Lagi'}
              </button>
            </form>
          </div>

          <div className="contact__right reveal">
            <p className="contact__intro">
              Ada ide kolaborasi atau pertanyaan? Kirim pesan langsung.
            </p>
            
            <div className="contact__alt">
              <p className="contact__alt-label text-secondary">atau hubungi langsung:</p>
              <div className="contact__alt-links">
                <a href="mailto:naufalrio22002@gmail.com" className="contact__alt-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  naufalrio22002@gmail.com
                </a>
                <a href="https://linkedin.com/in/mnaufalrior/" target="_blank" rel="noopener noreferrer" className="contact__alt-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  linkedin.com/in/mnaufalrior
                </a>
                <a href="https://github.com/nfalrio" target="_blank" rel="noopener noreferrer" className="contact__alt-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  github.com/nfalrio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
