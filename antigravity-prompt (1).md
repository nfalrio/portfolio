# Prompt untuk Antigravity — Redesign Portofolio Naufal Rio Ramadhan

Salin seluruh isi file ini ke Antigravity sebagai instruksi awal. Bagian
"KONTEKS", "REFERENSI", dan "ATURAN" wajib dibaca penuh sebelum mulai
mengeksekusi task di bagian "TASK".

---

## 1. KONTEKS PROYEK

Kamu bekerja di repo **`nfalrio/portfolio`** (live: portfolio-project-rio-1.vercel.app),
milik Muhammad Naufal Rio Ramadhan — mahasiswa Matematika, front-end
developer & data enthusiast.

### Stack saat ini
- React 19 + Vite 6
- **TypeScript sudah terpasang** (`tsconfig.json`, `tsconfig.node.json`,
  `vite.config.ts`) — file `.jsx` lama dan `.tsx` baru hidup berdampingan,
  migrasi bertahap, TIDAK perlu rename semua file lama sekaligus.
- **Framer Motion** sudah terinstall — pakai ini untuk semua animasi/transisi.
- **React Three Fiber + @react-three/rapier + @react-three/drei + meshline + three**
  sudah terinstall — untuk komponen 3D (lanyard, tunnel).
- **Tailwind CSS v4 sudah terpasang** (`@tailwindcss/vite`, diimpor lewat
  `@import "tailwindcss"` di `src/styles/index.css`) — TAPI di-map lewat
  `@theme inline` ke custom properties yang SUDAH ADA (`--accent`,
  `--bg-surface`, `--text-primary`, `--font-mono`, `--radius-sm`, dst).
  Artinya `bg-accent`, `text-secondary`, `font-mono`, `rounded-sm` di
  className resolve ke token emas/dark-light yang sama, BUKAN palet
  default Tailwind (sudah diverifikasi lewat build: `.bg-accent{background-color:var(--accent)}`).
  Untuk komponen BARU boleh pakai Tailwind utility langsung. Untuk
  komponen LAMA (`Hero.css`, `ProjectCard.css`, dll) tidak perlu migrasi
  paksa ke Tailwind — biarkan tetap CSS module terpisah, cukup pastikan
  token warnanya tetap konsisten.
- CSS custom di file `.css` terpisah TETAP jadi sumber kebenaran token
  (lihat `src/styles/index.css` bagian `:root` dan `[data-theme]`) — kalau
  butuh token baru, tambahkan di sana dulu, baru di-mapping ke `@theme inline`.

### Design tokens yang WAJIB dipakai (jangan buat token baru sembarangan)
```css
--font-sans: 'Space Grotesk';
--font-mono: 'JetBrains Mono';
--accent (dark): #D9A441   /* --accent (light): #C99A3E */
--bg-primary (dark): #191D24   /* --bg-primary (light): #FAFAF8 */
--radius-sm: 4px; --radius-md: 8px;
--ease-snappy: cubic-bezier(0.4, 0, 0.2, 1);
```
Identitas visual: **gaya neobrutalist** — hard offset shadow
(`box-shadow: 12px 12px 0 var(--accent)`), border solid, dot-grid
background (`radial-gradient` titik-titik halus), aksen **emas/amber**,
BUKAN glassmorphism ungu.

### Struktur komponen saat ini
```
src/
  App.jsx                — merangkai semua section
  components/
    Navbar.jsx/css
    Hero.jsx/css         — sudah ada SkillTicker.jsx (marquee CSS)
    About.jsx/css
    Projects.jsx/css, ProjectCard.jsx/css, ProjectModal.jsx/css
    Skills.jsx/css
    Contact.jsx/css
    Footer.jsx/css
  data/
    projects.js          — array proyek, TIAP proyek sudah punya field
                            `metrics: [{label, value}]`, `tech`, `process`,
                            `links: {github, live}`, `image`
    skills.js             — skillCategories: [{name, skills: [...]}]
  hooks/
    useActiveSection.js, useTheme.js
```
Data proyek dan skill JANGAN diubah isinya kecuali diminta eksplisit — cukup
diikat ke UI baru.

### Code-splitting WAJIB untuk komponen 3D
Sudah diverifikasi: tanpa lazy-load, bundle utama membengkak dari ~225KB
jadi 3.5MB karena Three.js + Rapier ikut ter-bundle di initial load. Semua
komponen yang import dari `@react-three/*`, `three`, atau `meshline` HARUS
di-lazy-load:
```jsx
const Lanyard = lazy(() => import('./components/Lanyard.tsx'));
// dibungkus <Suspense fallback={null}>...</Suspense>
```

---

## 2. REFERENSI — Website Fio Octriyanti

Dua sumber dianalisis langsung dari kode (bukan cuma tampilan visual):
- Live: https://fioctriyanti.vercel.app/
- Repo: https://github.com/24031554030-source/fioportfolio_

### Stack Fio (untuk referensi arsitektur, BUKAN untuk ditiru penuh)
Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion +
React Three Fiber + @react-three/rapier + meshline + three. Tema ungu
holografik (`--fio-cyan: #9E4ABB`, `--fio-purple: #3A004D`) — **JANGAN
dipakai**, ganti dengan token emas milik Naufal di atas.

### Komponen Fio yang jadi acuan struktural
| Komponen Fio | Fungsi | Insight teknis penting |
|---|---|---|
| `components/hero/FloatingBadge.tsx` | Kartu ID tergantung tali, bisa ditarik dengan fisika nyata | Pakai `@react-three/rapier` `useRopeJoint` (4 segmen tali + 1 sambungan ke kartu via `useSphericalJoint`), drag di-handle lewat `onPointerDown/Up` yang mengubah posisi kinematic saat di-drag lalu balik ke `dynamic` (gravitasi) saat dilepas. Efek angin halus lewat `applyImpulse` sinusoidal supaya kartu berayun pelan walau tidak disentuh. |
| `components/highlights/lorong3D.tsx` | "3D Tour" — kamera bergerak di sumbu Z menyusuri kartu-kartu achievement, dikontrol tombol ‹ › + mode "Auto Tour" | State `activeIndex` + `targetZ` di-lerp tiap frame (`THREE.MathUtils.lerp`) supaya transisi antar kartu halus, bukan snap instan. Kartu-kartu di-render pakai `<Html transform>` dari drei (bukan mesh biasa) supaya kontennya tetap HTML/CSS biasa yang gampang di-styling, cuma posisinya diatur di ruang 3D. |
| `components/hero/HeroMarquee.tsx` | Logo tech skill bergerak infinite | CSS keyframe `translateX(0)` → `translateX(-50%)` dengan list skill di-duplikasi 2x supaya loop mulus (pattern ini SUDAH diimplementasi di `SkillTicker.jsx` milik Naufal, tinggal ditambah ikon logo). |
| `components/organizations/Organizations.tsx` | Daftar aktivitas & pencapaian | Layout vertikal per-item dengan badge kategori + tombol aksi. |
| `components/contact/Contact.tsx` | 3 kartu kontak + CTA form | Grid 3 kolom, tiap kartu = 1 channel kontak. |
| `components/Intro/IntroScreen.tsx` | Layar pembuka sebelum landing | Berisi teks besar + elemen dekoratif "terbang" di sekitarnya. |

**PENTING:** Ambil pola *interaksi & arsitektur teknis* dari komponen di
atas, TAPI desain ulang tampilan visualnya total dengan bahasa desain
Naufal (emas, neobrutalist, dot-grid) — jangan copy warna, jangan copy
konten/foto/teks Fio.

---

## 3. ATURAN UMUM

1. Bahasa UI tetap **Bahasa Indonesia**, konsisten dengan section yang sudah ada (`Hubungi Saya`, `Lihat Detail`, dst).
2. Semua animasi harus punya fallback `@media (prefers-reduced-motion: reduce)` — pattern ini sudah dipakai di `Hero.css`, `SkillTicker.css`, `ProjectCard.css`, ikuti pola yang sama.
3. Komponen baru yang berat (3D) ditulis dalam `.tsx`, komponen ringan boleh tetap `.jsx` mengikuti sekitar file yang sudah ada.
4. Jangan pindah dari Vite ke Next.js. Jangan tambah shadcn/ui — cukup Tailwind utility polos + design token yang sudah di-mapping (lihat bagian stack di atas).
5. Setiap selesai satu section, jalankan `npm run build` dan `npx tsc --noEmit` untuk pastikan tidak ada error sebelum lanjut ke section berikutnya.
6. Section lama (`About.jsx`, `Skills.jsx`, `Contact.jsx`, dst) boleh di-refactor total isi & tampilannya, tapi TETAP pertahankan `id` section-nya (`tentang`, `skill`, `kontak`, dst) karena dipakai `useActiveSection` untuk navbar aktif.

---

## 4. TASK — Urutan Revisi

Kerjakan berurutan, jangan lompat, tiap task adalah satu commit/PR terpisah:

### Task 1 — Landing/Intro Section (section baru, di atas Hero saat ini)
- Teks besar **"MY PORTFOLIO"** di tengah/kiri.
- Beberapa kotak kecil (badge skill/tech, mis. "React", "Python", "SQL")
  yang melayang dengan animasi acak halus (translate + rotate ringan,
  Framer Motion `animate` dengan `repeat: Infinity`, `repeatType: "mirror"`),
  posisinya tersebar di sekitar teks, bukan grid rapi.
- Foto profil Naufal digantung seperti **lanyard/ID card fisik 3D**,
  memakai pola teknis `FloatingBadge.tsx` Fio (rope joint + drag),
  tapi kartu & tali di-restyle dengan warna gelap/emas milik Naufal.
  Perlu file `.glb` sederhana untuk bentuk kartu (boleh pakai primitif
  box Three.js dulu sebagai placeholder sebelum ada model custom).
- WAJIB lazy-loaded (lihat aturan code-splitting di atas).

### Task 2 — Hero Section (redesign Hero.jsx yang sudah ada)
- Pertahankan komponen `SkillTicker` yang sudah ada, posisi tetap di bawah.
- Ubah layout jadi: **"Hi, aku (Nama)"** + deskripsi singkat + dua tombol
  CTA — **"Lihat CV"** dan **"Lihat Proyek"** (scroll ke `#proyek`).
- Foto di kanan (posisi sudah sesuai `hero__visual` yang ada, tinggal
  disesuaikan gaya biar tidak duplikat dengan foto lanyard di Task 1).

### Task 3 — About/Deskripsi Diri
- Refactor `About.jsx` jadi section deskripsi diri yang lebih naratif,
  gunakan data yang sudah ada di komponen (jangan hilangkan info yang
  sudah ada, cuma re-layout).

### Task 4 — Milestone/Achievement (section baru)
- Bangun versi ringan dari `lorong3D.tsx` Fio: TIDAK perlu full 3D tunnel,
  cukup **carousel horizontal** (Framer Motion `AnimatePresence` +
  `x` transform) menampilkan kartu sertifikasi/juara 1/dll, dengan tombol
  ‹ › kiri-kanan yang menggerakkan index aktif — beri kesan "POV maju-mundur"
  lewat transisi scale+opacity antar kartu, tanpa perlu Three.js.
  *(Jika nanti mau upgrade ke 3D tunnel penuh seperti Fio, buat sebagai
  task terpisah setelah versi ringan ini jalan baik.)*
- Data: sertifikasi, juara 1, dll — ambil dari isi yang sudah pernah
  dibahas di percakapan sebelumnya (Dicoding/HarvardX certs, dst), taruh
  di file baru `src/data/achievements.js`.

### Task 5 — Tech Skills (redesign Skills.jsx)
- Ganti/upgrade tag skill teks polos yang ada sekarang jadi marquee
  **logo bergerak kanan-ke-kiri**, reuse pattern animasi dari
  `SkillTicker.css` yang sudah ada, tambahkan ikon (boleh dari
  `devicon` CDN seperti yang dipakai Fio, atau icon set lain yang ringan).

### Task 6 — Projects
- `ProjectCard.jsx` sudah punya metric strip + glow hover (sudah selesai
  di sesi sebelumnya) — pertahankan, cukup selaraskan urutan/spacing
  dengan section baru di sekitarnya.

### Task 7 — Aktivitas & Pencapaian (section baru)
- Layout **vertikal atas-ke-bawah**, tiap item = 1 aktivitas/organisasi
  dengan tombol **"Lihat Dokumentasi"** (link ke foto/sertifikat/drive).
- Data taruh di `src/data/activities.js`.

### Task 8 — Let's Connect + Let's Build Together
- Redesign `Contact.jsx`: 3 kartu besar — **LinkedIn, GitHub, Email** —
  masing-masing dengan ikon + link.
- Di bawahnya, section **"Let's Build Something Together"** bisa reuse
  form kontak yang sudah ada di `Contact.jsx` sekarang (jangan bikin form
  baru dari nol kalau yang lama masih berfungsi via Formspree).

---

## 5. Output yang diharapkan tiap task
- Kode berjalan (`npm run dev` tanpa error, `npm run build` sukses,
  `npx tsc --noEmit` bersih).
- Ringkasan singkat apa yang berubah + screenshot/deskripsi visual jika
  memungkinkan.
- Tandai jika ada asset yang perlu disediakan manual oleh Naufal (foto,
  model 3D, dokumentasi sertifikat) alih-alih ditebak/di-generate.
