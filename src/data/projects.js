export const projects = [
  {
    id: 'sentiment-xai',
    title: 'DPR August Demonstration Sentiment Analysis',
    summary: 'YouTube comment sentiment classification using hybrid SVM + lexicon, enhanced with a custom explainable AI (XAI) panel.',
    problem: 'The DPR RI demonstration triggered a surge of public opinions on YouTube. However, negative content in comments often contains OOV words (slang, abbreviations, typos) that cause conventional classification models to fail. A hybrid approach was needed to handle informal language variations while providing transparent predictions.',
    process: [
      'Scraping: 17,052 comments from YouTube Data API v3.',
      'Preprocessing: OOV normalization, case folding, removal of domain-specific overlap words (e.g., \'dpr\', \'rakyat\'), and stemming. Produced 16,584 clean data points.',
      'Feature Extraction: CountVectorizer (5,383 features).',
      'Classification: Hybrid approach (Linear SVM + InSet Lexicon) with balanced class weighting.',
      'Deployment & Explainability: Real-time Flask web integration with custom XAI panel for hybrid scoring transparency.'
    ],
    metrics: [
      { label: 'Accuracy', value: '93%' },
      { label: 'Data', value: '17,052' },
      { label: 'Method', value: 'Hybrid SVM' }
    ],
    tech: ['Python', 'scikit-learn', 'SVM', 'NLP', 'CountVectorizer', 'XAI', 'Flask'],
    links: { github: null, live: null },
    image: '/img/sentimen.png'
  },
  {
    id: 'simbahe',
    title: 'SIMBAHE Redesign',
    summary: 'UI/UX redesign of the field booking information system for Malang City Communication and Informatics Office — from usability audit to implementation.',
    problem: 'SIMBAHE (E-sports Arena Hall Booking Management Information System) owned by Malang City Communication and Informatics Office had an unintuitive interface and high bounce rate. A comprehensive redesign based on usability principles was needed.',
    process: [
      'Heuristic evaluation using Nielsen\'s 10 principles',
      'User research & pain point mapping',
      'Wireframing in Figma',
      'High-fidelity prototype with consistent design system',
      'Front-end implementation with Alpine.js + Tailwind CSS',
      'Responsive design for mobile and desktop'
    ],
    metrics: [
      { label: 'Pages', value: '10+' },
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
    summary: 'An innovative platform connecting users with mental health services and articles.',
    problem: 'The need for a user-friendly, accessible interface that provides a calming impression to support community mental health initiatives.',
    process: [
      'Designed empathetic UI/UX interfaces using Figma',
      'Developed interactive front-end pages with Next.js and React framework',
      'Applied consistent and responsive styling with Tailwind CSS',
      'Actively collaborated as Full Stack Developer Staff in a volunteer environment'
    ],
    metrics: [
      { label: 'Role', value: 'Full Stack' },
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
    summary: 'A Progressive Web App for sharing stories with offline-first features, push notifications, and home screen installation.',
    problem: 'A Dicoding submission project requiring complete PWA implementation — from service worker, caching strategy, to push notifications. Focused on seamless offline-first experience.',
    process: [
      'Single Page Application (SPA) architecture with vanilla JS',
      'Service Worker for caching & offline support',
      'IndexedDB for local data storage',
      'Push notification with Web Push API',
      'Manifest.json for installability (A2HS)',
      'Deployed to Vercel with CI/CD'
    ],
    metrics: [
      { label: 'Type', value: 'PWA' },
      { label: 'Offline', value: '✓' },
      { label: 'Push Notif', value: '✓' }
    ],
    tech: ['JavaScript', 'PWA', 'Service Worker', 'IndexedDB', 'Web Push API', 'Vercel'],
    links: { github: null, live: 'https://story-app-dicoding-kappa.vercel.app/' },
    image: '/img/storyapp.png'
  }
];
