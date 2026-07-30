import { useEffect, useRef } from 'react';
import './About.css';

const ACHIEVEMENTS = [
  {
    title: 'Juara 1 Kategori Tech-Savvy Administration for Office, GEEDS',
    organization: 'Departemen Manajemen FEB UM',
    period: 'Okt 2025',
    description: 'Memenangkan kompetisi nasional (Tim Evolvere) melalui analisis data penjualan produk suatu perusahaan berbasis Microsoft Excel, serta penyusunan laporan analisis dan materi presentasi.'
  },
  {
    title: 'Finalis Duta Alfa-Beta 2022 (MAGMA)',
    organization: 'HMD Matematika, UM',
    period: 'Nov 2022',
    description: 'Menjadi awal keterlibatan sebagai MC/pembawa acara di 5 kegiatan HMD Matematika (2022–2023).'
  }
];

const EXPERIENCES = [
  {
    period: 'Feb - Jul 2025',
    company: 'Coding Camp powered by DBS Foundation',
    role: 'Front-End & Back-End Developer',
    type: 'Studi Independen',
    details: [
      'Menyelesaikan program pelatihan web development end-to-end (dari fundamental hingga deployment) sebagai Full Graduate.',
      'Berkolaborasi dalam tim lintas fungsi merancang arsitektur capstone project yang menggabungkan aplikasi web dengan layanan Machine Learning.'
    ]
  },
  {
    period: 'Feb - Jun 2025',
    company: 'Dinas Komunikasi dan Informatika Kota Malang',
    role: 'Magang Praktik Kerja',
    details: [
      'Melakukan audit UI/UX, merancang ulang prototipe aplikasi SIMBAHE via Figma, dan mengimplementasikannya menjadi kode front-end responsif (Tailwind CSS) secara mandiri.'
    ]
  },
  {
    period: 'Des 2024 - Jun 2025',
    company: 'Pranala Jiwa',
    role: 'Staff Full Stack Developer (Front End + Figma)',
    type: 'Volunteer Online'
  }
];

export default function About() {
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

  return (
    <section className="about section" id="tentang" ref={sectionRef}>
      <div className="container">
        <p className="section-label reveal">01 / Tentang</p>
        <h2 className="section-title reveal">Tentang Saya</h2>
        <hr className="section-divider reveal" />

        <div className="about__intro reveal">
          <div className="about__content">
            <p className="about__bio">
              Saya Muhammad Naufal Rio Ramadhan, lulusan S1 Matematika Universitas Negeri Malang dengan ketertarikan kuat di bidang Data Analytics dan Front-End Development. Dengan latar belakang pemecahan masalah yang sistematis, saya percaya bahwa angka dan visual harus saling melengkapi, data membutuhkan narasi yang baik, dan UI membutuhkan keputusan yang berbasis logika. Saya memiliki keterampilan dalam memproses dan menganalisis data menggunakan Python dan Microsoft Excel, serta membangun antarmuka web yang responsif menggunakan React dan Tailwind CSS. Saat ini, saya siap membawa kemampuan analitis saya ke dunia industri dan terbuka untuk peluang sebagai Data Analyst maupun Front-End Developer, dengan tujuan membangun solusi digital yang efisien dan digerakkan oleh data.
            </p>
          </div>
        </div>

        <div className="about__achievements">
          <h3 className="section-subtitle reveal" style={{ marginTop: '2rem', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Pencapaian</h3>
          <div className="about__achievements-grid">
            {ACHIEVEMENTS.map((ach, i) => (
              <div className="achievement__card reveal" key={i}>
                <div className="achievement__header">
                  <div className="achievement__title-group">
                    <h3 className="achievement__title">{ach.title}</h3>
                    <span className="achievement__org text-secondary">{ach.organization}</span>
                  </div>
                  <span className="achievement__period font-mono text-accent">{ach.period}</span>
                </div>
                <p className="achievement__desc">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about__experience">
          <h3 className="section-subtitle reveal" style={{ marginTop: '2rem', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Pengalaman</h3>
          <div className="about__experience-grid">
            {EXPERIENCES.map((exp, i) => (
              <div className="experience__card reveal" key={i}>
                <div className="experience__number font-mono">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="experience__content">
                  <div className="experience__header">
                    <h3 className="experience__company">{exp.company}</h3>
                    <span className="experience__period font-mono text-accent">{exp.period}</span>
                  </div>
                  <div className="experience__role">
                    {exp.role} {exp.type && <span className="experience__type">• {exp.type}</span>}
                  </div>
                  {exp.details && (
                    <ul className="experience__details">
                      {exp.details.map((detail, j) => (
                        <li key={j}>{detail}</li>
                      ))}
                    </ul>
                  )}
                  {exp.link && (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" className="experience__link">
                      🔗 {exp.link.replace('https://', '')}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
