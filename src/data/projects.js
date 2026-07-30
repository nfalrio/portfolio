export const projects = [
  {
    id: 'sentiment-xai',
    title: 'Analisis Sentimen Demo DPR Agustus',
    summary: 'Klasifikasi sentimen komentar YouTube menggunakan hybrid SVM + leksikon, diperkuat dengan panel explainable AI (XAI) kustom.',
    problem: 'Aksi demonstrasi DPR RI memicu ledakan opini publik di YouTube. Namun, konten negatif di komentar sering mengandung OOV words (slang, singkatan, typo) yang membuat model klasifikasi konvensional gagal mengenali konteks. Dibutuhkan pendekatan hybrid yang bisa menangani variasi bahasa informal sekaligus memberikan penjelasan transparan atas prediksinya.',
    process: [
      'Scraping: 17.052 komentar dari YouTube Data API v3.',
      'Preprocessing: Normalisasi OOV, case folding, penghapusan kata overlap spesifik domain (mis. \'dpr\', \'rakyat\'), dan stemming. Menghasilkan 16.584 data bersih.',
      'Feature Extraction: CountVectorizer (5.383 fitur).',
      'Klasifikasi: Pendekatan hybrid (SVM Linear + Leksikon InSet) dengan pembobotan kelas seimbang.',
      'Deployment & Explainability: Integrasi web Flask real-time dengan panel XAI kustom untuk transparansi hybrid scoring.'
    ],
    metrics: [
      { label: 'Akurasi', value: '93%' },
      { label: 'Data', value: '17.052' },
      { label: 'Metode', value: 'Hybrid SVM' }
    ],
    tech: ['Python', 'scikit-learn', 'SVM', 'NLP', 'CountVectorizer', 'XAI', 'Flask'],
    links: { github: null, live: null },
    image: '/img/sentimen.png'
  },
  {
    id: 'simbahe',
    title: 'SIMBAHE Redesign',
    summary: 'Redesign UI/UX sistem informasi penyewaan lapangan Dinas Komunikasi dan Informatika Kota Malang — dari audit usability hingga implementasi.',
    problem: 'SIMBAHE (Sistem Informasi Manajemen Booking Arena Hall E-sports) milik Dinas Komunikasi dan Informatika Kota Malang memiliki antarmuka yang tidak intuitif dan bounce rate tinggi. Perlu redesign menyeluruh berdasarkan prinsip usability.',
    process: [
      'Heuristic evaluation menggunakan 10 prinsip Nielsen',
      'User research & pain point mapping',
      'Wireframing di Figma',
      'High-fidelity prototype dengan design system konsisten',
      'Implementasi front-end dengan Alpine.js + Tailwind CSS',
      'Responsive design untuk mobile dan desktop'
    ],
    metrics: [
      { label: 'Halaman', value: '10+' },
      { label: 'Framework', value: 'Alpine.js' },
      { label: 'Styling', value: 'Tailwind' }
    ],
    tech: ['Figma', 'Alpine.js', 'Tailwind CSS', 'HTML', 'UI/UX', 'Heuristic Evaluation'],
    links: { github: null, live: 'https://nfalrio.github.io/simbahe/' },
    image: '/img/simbahe.png'
  },
  {
    id: 'pranala',
    title: 'Pranala Jiwa',
    summary: 'Platform inovatif untuk menghubungkan pengguna dengan layanan dan artikel kesehatan mental.',
    problem: 'Kebutuhan akan antarmuka yang ramah pengguna, mudah diakses, dan memberikan kesan menenangkan untuk mendukung inisiatif kesehatan mental masyarakat.',
    process: [
      'Merancang antarmuka UI/UX yang empati menggunakan Figma',
      'Mengembangkan halaman front-end interaktif dengan framework Next.js dan React',
      'Menerapkan styling yang konsisten dan responsif dengan Tailwind CSS',
      'Berkolaborasi aktif sebagai Staff Full Stack Developer dalam lingkungan volunteer'
    ],
    metrics: [
      { label: 'Peran', value: 'Full Stack' },
      { label: 'Framework', value: 'Next.js' },
      { label: 'Styling', value: 'Tailwind' }
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Figma', 'UI/UX'],
    links: { github: null, live: 'https://pranala-jiwa.vercel.app/' },
    image: '/img/pranala.png'
  },
  {
    id: 'story-app',
    title: 'Story App (PWA)',
    summary: 'Progressive Web App untuk berbagi cerita dengan fitur offline-first, push notification, dan instalasi ke home screen.',
    problem: 'Tugas submission Dicoding yang menuntut implementasi PWA lengkap — dari service worker, caching strategy, hingga push notification. Fokus pada pengalaman offline-first yang seamless.',
    process: [
      'Arsitektur Single Page Application (SPA) dengan vanilla JS',
      'Service Worker untuk caching & offline support',
      'IndexedDB untuk penyimpanan data lokal',
      'Push notification dengan Web Push API',
      'Manifest.json untuk installability (A2HS)',
      'Deploy ke Vercel dengan CI/CD'
    ],
    metrics: [
      { label: 'Tipe', value: 'PWA' },
      { label: 'Offline', value: '✓' },
      { label: 'Push Notif', value: '✓' }
    ],
    tech: ['JavaScript', 'PWA', 'Service Worker', 'IndexedDB', 'Web Push API', 'Vercel'],
    links: { github: null, live: 'https://story-app-dicoding-kappa.vercel.app/' },
    image: '/img/storyapp.png'
  },
  {
    id: 'portfolio',
    title: 'Portofolio Website',
    summary: 'Website portofolio personal untuk menampilkan hasil kerja menggunakan React dan Vite dengan antarmuka yang responsif.',
    processLabel: 'HIGHLIGHTS & FITUR',
    process: [
      'Dibangun 100% dari nol menggunakan React + Vite, murni tanpa UI library eksternal.',
      'Menerapkan custom hooks untuk IntersectionObserver, theme toggle, dan command palette.',
      'Implementasi dark/light mode yang sepenuhnya digerakkan oleh CSS Custom Properties.',
      'Performa dioptimalkan menggunakan lazy loading dan code splitting.',
      'Mendukung aksesibilitas penuh mencakup focus trap, keyboard navigation, dan semantic HTML.'
    ],
    metrics: [
      { label: 'Script', value: '100% Custom' },
      { label: 'Framework', value: 'React' },
      { label: 'Bundler', value: 'Vite' }
    ],
    tech: ['React', 'Vite', 'CSS Custom Properties', 'JavaScript', 'Formspree'],
    links: { github: null, live: null },
    image: '/img/portfolio.png'
  }
];
