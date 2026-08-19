import { useState, useRef } from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';
import './Contact.css';

const SOCIALS = [
  {
    key: 'email',
    href: 'mailto:naufalrio22002@gmail.com',
    label: 'Email',
    sub: 'naufalrio22002@gmail.com',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    href: 'https://linkedin.com/in/mnaufalrior/',
    label: 'LinkedIn',
    sub: '/in/mnaufalrior',
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key: 'github',
    href: 'https://github.com/nfalrio',
    label: 'GitHub',
    sub: 'nfalrio',
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const sectionRef = useRef(null);
  useRevealOnScroll(sectionRef, 0.2);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
        <p className="section-label reveal">06 / Contact</p>
        <h2 className="section-title reveal">Get In Touch</h2>
        <hr className="section-divider reveal" />

        {/* ── Social Cards ── */}
        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '5rem',
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '12px',
                boxShadow: '8px 8px 0 var(--accent)',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                color: 'var(--text-secondary)',
              }}
              className="contact-card"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  transition: 'all 0.25s ease',
                  color: 'var(--text-secondary)',
                }}
                className="contact-card__icon"
              >
                {s.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
              }}>
                {s.label}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{s.sub}</p>
            </a>
          ))}
        </div>

        {/* ── Contact Form ── */}
        <div
          className="reveal"
          style={{ maxWidth: '680px', margin: '0 auto' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              lineHeight: 1.2,
            }}>
              Let's Build Something Together
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65 }}>
              Have an innovative project idea or need a collaborator?<br />
              Send a message directly through the form below.
            </p>
          </div>

          <div style={{
            padding: '2.5rem',
            border: '2px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '12px',
          }}>
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-row">
                <input
                  type="text" name="name" id="contact-name"
                  placeholder="Full Name"
                  value={form.name} onChange={handleChange} required
                  style={inputStyle}
                  className="contact__input"
                />
                <input
                  type="email" name="email" id="contact-email"
                  placeholder="Email Address"
                  value={form.email} onChange={handleChange} required
                  style={inputStyle}
                  className="contact__input"
                />
              </div>

              <textarea
                name="message" id="contact-message"
                placeholder="Tell me about your project idea or message..."
                rows={5}
                value={form.message} onChange={handleChange} required
                style={{ ...inputStyle, resize: 'vertical' }}
                className="contact__input"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: '2px solid var(--accent)',
                  borderRadius: '8px',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                }}
                className="contact-submit"
              >
                {status === 'idle' && 'Send Message'}
                {status === 'sending' && 'Sending...'}
                {status === 'success' && '✓ Message Sent'}
                {status === 'error' && 'Failed, Try Again'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-card:hover {
          transform: translateY(-6px);
          box-shadow: 12px 12px 0 var(--accent-hover) !important;
        }
        .contact-card:hover .contact-card__icon {
          background-color: var(--accent) !important;
          color: #fff !important;
          border-color: var(--accent) !important;
        }
        .contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 4px 4px 0 var(--border);
        }
        .contact__input:focus {
          outline: none;
          border-color: var(--accent) !important;
        }
        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--bg-primary)',
  border: '2px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '0.9375rem',
  transition: 'border-color 0.15s ease',
};
