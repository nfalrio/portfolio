# 📐 Design Document — Portofolio Website Naufal Rio

> **Proyek:** portofolio-naufal v2.0.0 (3D & Neobrutalist Edition)
> **Stack:** React 19 + Vite 6 + Tailwind CSS v4 + Framer Motion + React Three Fiber/Rapier
> **Terakhir Diperbarui:** 18 Agustus 2026

---

## 1. Gambaran Umum

Website portofolio personal milik **Muhammad Naufal Rio Ramadhan** — lulusan S1 Matematika, Universitas Negeri Malang. Mengalami perombakan total (Redesign Task 1-8) dengan mengusung gaya **Neo-brutalist dengan Presisi Matematis** yang dipadukan dengan elemen interaktif 3D fisika, animasi berbasis *scroll*, dan tipografi tebal.

### Filosofi Desain

| Prinsip | Implementasi |
|:---|:---|
| **Presisi Matematis** | Skala proporsi tetap, tata letak grid asimetris yang diperhitungkan, garis keras tanpa *glassmorphism*. |
| **Neo-brutalist accent** | Bayangan asimetris tebal (hard offset shadow: `8px 8px 0 var(--accent)`), kotak-kotak tegas, tanpa kehalusan semu. |
| **Fisika 3D Interaktif** | Layar pembuka (Intro) dengan ID Card interaktif (Lanyard) dan *Floating Badges* yang bisa diseret/dilempar. |
| **Warna Emas/Ochre** | Palet warna utama adalah dominasi hitam/putih murni dengan aksen emas yang kaya. |
| **Animasi Koreografis** | *Scroll-driven animations* menggunakan Framer Motion untuk timeline aktivitas dan entri komponen. |

---

## 2. Arsitektur & Struktur Direktori

```
portofolio/
├── index.html                     # Entry HTML
├── package.json                   # Dependensi React, Three.js, Framer Motion, Tailwind v4
├── vite.config.ts                 # Konfigurasi standar Vite
├── tsconfig.json                  # Konfigurasi TypeScript
├── public/
│   ├── img/                       # Aset gambar statis
│   └── cv/                        # CV PDF Naufal
│
└── src/
    ├── main.jsx                   # Entry point React
    ├── App.jsx                    # Root layout & orchestrator
    │
    ├── styles/
    │   └── index.css              # Master design tokens & Tailwind @theme block
    │
    ├── hooks/
    │   ├── useActiveSection.js    # Navigasi aktif
    │   ├── useTheme.js            # Dark/Light toggle
    │   └── useRevealOnScroll.js   # Shared IntersectionObserver hook untuk scroll animasi
    │
    ├── data/
    │   ├── projects.js            # Data Proyek
    │   ├── skills.js              # Data Keahlian (Logo icon + Nama)
    │   ├── achievements.js        # Data Milestone & Sertifikasi
    │   └── activities.js          # Data Pengalaman (Vertical Timeline)
    │
    └── components/                # Komponen Utama
        ├── IntroScreen.tsx        # Layar sambutan 3D fisika (Floating Badges)
        ├── Lanyard.tsx            # Komponen ID Card 3D Rapier (Lazy-loaded)
        ├── Navbar.jsx             # Navigasi
        ├── Hero.jsx               # Landing section
        ├── About.jsx              # Bio
        ├── Milestones.tsx         # Carousel 3D coverflow pencapaian
        ├── Projects.jsx           # Grid Proyek
        ├── ProjectCard.jsx        # Preview Proyek
        ├── ProjectModal.jsx       # Dialog detail
        ├── Activities.tsx         # Timeline vertikal (Pengalaman)
        ├── Skills.jsx             # Keahlian (Marquee)
        ├── SkillMarquee.jsx       # Ticker skill animasi tak terbatas
        ├── Contact.jsx            # Form kontak 3-kolom grid
        └── Footer.jsx             # Copyright
```

---

## 3. Komponen Utama Baru

### 3.1 IntroScreen & Lanyard (3D Physics)
- **File**: `IntroScreen.tsx`, `Lanyard.tsx`
- **Konsep**: Saat pertama kali dimuat, pengunjung disambut dengan lorong dimensi 3D dan lencana portofolio (*Floating Badges*) yang jatuh dengan gravitasi.
- **Teknis**: Memanfaatkan `@react-three/fiber` dan `@react-three/rapier`. Komponen ID Card (*Lanyard*) disambungkan dengan sendi fisika (`useRopeJoint`, `useSphericalJoint`).
- **Performa**: `Lanyard` di-*lazy-load* menggunakan `React.lazy` dan dibungkus `<Suspense>` *inside* `<Canvas>` untuk menghindari blokase utas utama saat inisialisasi WASM mesin fisika.

### 3.2 Milestones & Sertifikasi
- **File**: `Milestones.tsx`, `achievements.js`
- **Konsep**: *Coverflow carousel* interaktif yang menampilkan sertifikat dalam format tumpukan kedalaman 3D.
- **Animasi**: Framer Motion `AnimatePresence` memanipulasi rotasi Y, translasi X, dan kedalaman Z berdasarkan indeks `currentIndex`.

### 3.3 Activities (Vertical Timeline)
- **File**: `Activities.tsx`, `activities.js`
- **Konsep**: Linimasa vertikal yang dirender berdasarkan jejak karir/pengalaman. Garis tengahnya mengisi secara progresif seiring *scroll* (*scroll-driven animation*).
- **Animasi**: `useScroll` dan `useTransform` mengaitkan `scrollYProgress` dengan tinggi garis dan opacity. Tiap elemen menggunakan *hook* transisi berantai.

### 3.4 Skills (Marquee Ticker)
- **File**: `Skills.jsx`
- **Konsep**: Sabuk keahlian yang berjalan tanpa ujung ke kiri dan kanan.
- **Pembaruan**: Tidak lagi menampilkan UI kard statis lama, melainkan *infinite ticker* yang memuat ikon dan label keahlian. Layout di-*refactor* agar tidak terpotong (`overflow-x-hidden`).

### 3.5 Contact Redesign
- **File**: `Contact.jsx`
- **Konsep**: Pendekatan komunikasi 3 kanal (Email, LinkedIn, GitHub) direpresentasikan dengan kartu kotak besar berdampingan. Di bawahnya form integrasi **Web3Forms**.

---

## 4. Design System & Tokens (Tailwind v4)

Seluruh warna dan variabel direplikasi ke dalam blok `@theme` milik Tailwind v4 di dalam `index.css`. Penggunaan kelas utilitas murni dianjurkan, tanpa ekstensi library Shadcn.

### Palet Warna Utama:
| Variabel | Keterangan |
|:---|:---|
| `--bg-primary` | Latar utama (gelap: `#191D24`) |
| `--bg-surface` | Permukaan kartu (gelap: `#222731`) |
| `--bg-elevated`| Latar pop-up (gelap: `#2A303C`) |
| `--text-primary`| Teks utama (gelap: `#F0F0EC`) |
| `--accent` | Warna ciri khas emas (gelap: `#D9A441`) |
| `--border` | Garis tepi komponen (gelap: `#2A303C`) |

---

## 5. Pola Animasi

- `useRevealOnScroll` Hook: Menggantikan implementasi `IntersectionObserver` duplikat di setiap *section*. Melekatkan kelas `visible` ke `.reveal` saat memasuki *viewport*.
- Komponen menggunakan `framer-motion` `whileInView` untuk efek yang lebih terstruktur dan kompleks (seperti Timeline).

---

> Dokumen ini telah diperbarui untuk merefleksikan perubahan masif Redesign 3D Physics & Neobrutalism.
