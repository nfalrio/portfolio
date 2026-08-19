# Implementation Plan — Redesign Portofolio (Setup + Task 1)

## Temuan Penting

> [!WARNING]
> **Dependensi belum terpasang.** Prompt menyebutkan TypeScript, Framer Motion, R3F, dan Tailwind v4 "sudah terinstall", tetapi `package.json` aktual hanya berisi `react`, `react-dom`, dan `vite`. Semua dependensi perlu diinstall terlebih dahulu sebelum memulai Task 1.

> [!IMPORTANT]
> **Tidak ada file `.tsx` atau `tsconfig.json`.** Setup TypeScript perlu dilakukan dari nol (tapi bersifat bertahap — file `.jsx` lama tetap berjalan).

---

## Phase 0 — Setup Dependensi & Konfigurasi

### 0.1 Install Dependensi

```bash
# Runtime dependencies
npm install framer-motion three @react-three/fiber @react-three/drei @react-three/rapier meshline

# Tailwind CSS v4 (Vite plugin)
npm install tailwindcss @tailwindcss/vite

# TypeScript
npm install -D typescript @types/three
```

### 0.2 Konfigurasi TypeScript

#### [NEW] `tsconfig.json`
- `target: "ES2020"`, `module: "ESNext"`, `jsx: "react-jsx"`
- `strict: true`, `allowJs: true` (agar `.jsx` lama tetap jalan)
- `paths` alias jika diperlukan

#### [NEW] `tsconfig.node.json`
- Untuk `vite.config.ts`

#### [MODIFY] `vite.config.js` → `vite.config.ts`
- Tambahkan `@tailwindcss/vite` plugin
- Rename ke `.ts`

### 0.3 Setup Tailwind v4 + Token Mapping

#### [MODIFY] `src/styles/index.css`
Tambahkan di bagian atas file:
```css
@import "tailwindcss";

@theme inline {
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-soft: var(--accent-soft);
  --color-bg-primary: var(--bg-primary);
  --color-bg-surface: var(--bg-surface);
  --color-bg-elevated: var(--bg-elevated);
  --color-border: var(--border);
  --color-border-hover: var(--border-hover);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-backdrop: var(--backdrop);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
}
```

Ini memungkinkan `bg-accent`, `text-secondary`, `font-mono`, `rounded-sm` di className resolve ke token emas/dark-light yang sudah ada.

### 0.4 Verifikasi Setup

```bash
npm run build          # Build sukses
npx tsc --noEmit       # Tidak ada error TypeScript
```

---

## Phase 1 — Task 1: Landing/Intro Section

### Deskripsi

Section baru yang muncul **di atas Hero** sebagai splash/landing pertama yang dilihat pengunjung. Berisi:
1. **Teks besar "MY PORTFOLIO"** di tengah/kiri
2. **Floating skill badges** (React, Python, SQL, dll.) melayang dengan animasi acak halus
3. **Lanyard 3D** — foto profil Naufal digantung seperti ID card fisik dengan tali, bisa ditarik (drag) dan berayun dengan fisika nyata
4. **Tombol scroll / auto-dismiss** untuk masuk ke Hero section

### File Baru

#### [NEW] `src/components/IntroScreen.tsx`
**Komponen utama Intro/Landing.**

- **Layout**: `fixed inset-0 z-50` overlay di atas seluruh halaman
- **Teks**: "MY PORTFOLIO" dengan font `--font-sans`, ukuran besar (`clamp(3rem, 8vw, 6rem)`), warna `--text-primary`
- **Sub-teks**: Nama + peran singkat, font `--font-mono`, warna `--accent`
- **Tombol CTA**: "Masuk" / "Explore" → dismiss intro dengan animasi exit
- **Framer Motion variants**:
  ```tsx
  // Staggered entrance
  containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    exit: { opacity: 0, scale: 0.96, filter: "blur(12px)", transition: { duration: 0.7 } }
  }
  
  itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8 } }
  }
  ```

#### [NEW] `src/components/FloatingBadges.tsx`
**Badge skill melayang di sekitar teks intro.**

- **Data**: Array badge dengan nama, posisi (x, y) relatif ke center, delay, dan speed
  ```ts
  const BADGES = [
    { name: "React", x: -280, y: -140, delay: 0.2, speed: 4.5 },
    { name: "Python", x: 260, y: -120, delay: 0.4, speed: 5.2 },
    { name: "SQL", x: -320, y: 80, delay: 0.3, speed: 4.8 },
    { name: "Data Analytics", x: 280, y: 110, delay: 0.5, speed: 5.0 },
    { name: "Tailwind", x: -140, y: 220, delay: 0.6, speed: 4.2 },
    { name: "Vite", x: 160, y: 230, delay: 0.7, speed: 4.6 },
  ]
  ```
- **Animasi**: Framer Motion `animate` dengan `repeat: Infinity`, `repeatType: "mirror"`:
  - `x`: oscillate ±8px
  - `y`: oscillate ±12px  
  - `rotate`: oscillate ±3°
- **Styling**: Pill badge `bg-bg-surface border border-border text-text-secondary font-mono rounded-full` (Tailwind classes mapped ke tokens)
- **Hover**: `scale: 1.15`, `boxShadow: "0 0 20px var(--accent-soft)"`
- **Hidden di mobile kecil** (`< 640px`) untuk performa

#### [NEW] `src/components/Lanyard.tsx`
**Komponen 3D lanyard/ID card dengan fisika.**

- **WAJIB lazy-loaded** di `App.jsx`:
  ```jsx
  const Lanyard = lazy(() => import('./components/Lanyard.tsx'));
  // <Suspense fallback={null}><Lanyard /></Suspense>
  ```
- **Canvas setup**: `<Canvas camera={{ position: [0, 0, 6], fov: 45 }}>`
- **Physics**: `<Physics gravity={[0, -9.81, 0]}>`

**Arsitektur rope joint (mengikuti pola Fio, direstyle):**
```
[Fixed Anchor] (y: 2.5)
    │ useRopeJoint (length ~0.35)
[Joint 0] (dynamic, mass: 0.05, linearDamping: 1.0)
    │ useRopeJoint
[Joint 1] (dynamic)
    │ useRopeJoint
[Joint 2] (dynamic)
    │ useRopeJoint
[Joint 3] (dynamic)
    │ useSphericalJoint → [Card Body] (dynamic, mass: 1.0, angularDamping: 1.2)
```

- **Card mesh**: `RoundedBoxGeometry(1.6, 2.3, 0.02)` dengan texture canvas:
  - Background: `--bg-surface` (#222731)
  - Border accent: `--accent` (#D9A441)  
  - Foto profil Naufal di area utama
  - Teks: "Muhammad Naufal Rio Ramadhan" + "Data Analyst & Front-End Developer"
  - Material: `MeshPhysicalMaterial` dengan `roughness: 0.2`, `metalness: 0.05`

- **Band/Rope rendering**: `MeshLine` dengan `CatmullRomCurve3` dari posisi semua joint nodes, warna `--accent` (#D9A441), `lineWidth: 0.1`

- **Drag interaction**:
  - `onPointerDown`: capture pointer, set drag mode
  - `useFrame`: update card velocity berdasarkan pointer position
  - `onPointerUp`: release, return ke dynamic physics

- **Wind/idle animation** (saat tidak di-drag):
  ```ts
  const windX = Math.sin(t * 1.4) * 0.08 + Math.cos(t * 2.1) * 0.04;
  const windZ = Math.sin(t * 1.8) * 0.06;
  cardRef.current.applyImpulse({ x: windX * delta, y: 0, z: windZ * delta });
  ```

- **`@media (prefers-reduced-motion: reduce)`**: Disable wind animation, static card position

### File yang Dimodifikasi

#### [MODIFY] `src/App.jsx`
- Import `IntroScreen` (langsung, bukan lazy — ini ringan)
- Lazy-import `Lanyard`
- Tambah state `showIntro` (default `true`)
- Render `<AnimatePresence>` untuk IntroScreen di atas semua section
- Pass `onDismiss={() => setShowIntro(false)}` ke IntroScreen
- Tambah `'intro'` ke `SECTION_IDS` jika perlu

#### [MODIFY] `src/styles/index.css`
- Tambahkan `@import "tailwindcss"` dan `@theme inline` mapping (Phase 0)

#### [MODIFY] `vite.config.js` → `vite.config.ts`
- Tambahkan `@tailwindcss/vite` plugin

---

## Open Questions

> [!IMPORTANT]
> 1. **Tombol "Lihat CV"** di Task 2 nanti — apakah sudah ada file CV (PDF) yang bisa di-link? Atau pakai placeholder dulu?
> 2. **Data achievements** untuk Task 4 — sertifikasi apa saja yang ingin ditampilkan? (Dicoding, HarvardX, dll?) Perlu saya buatkan daftar berdasarkan percakapan sebelumnya?
> 3. **Data activities** untuk Task 7 — apakah kamu sudah punya daftar aktivitas & link dokumentasinya, atau perlu saya buatkan draft?
> 4. **IntroScreen auto-dismiss**: Apakah intro hanya muncul sekali (pakai `sessionStorage`), atau selalu muncul setiap kali buka halaman?

---

## Verification Plan

### Automated Tests
```bash
npm run build          # Bundle sukses, no errors
npx tsc --noEmit       # TypeScript clean
```

### Manual Verification
- [ ] Intro screen muncul saat pertama kali buka halaman
- [ ] Floating badges melayang halus dengan animasi
- [ ] Lanyard 3D bisa di-drag dan berayun natural
- [ ] Tombol dismiss menutup intro dengan animasi smooth
- [ ] Hero section terlihat normal setelah intro dismiss
- [ ] Performance: bundle 3D ter-lazy-load (cek Network tab)
- [ ] Mobile responsive: badges hidden di layar kecil, lanyard tetap tampil
- [ ] `prefers-reduced-motion`: animasi berhenti
- [ ] Dark/light mode: warna lanyard card dan badges konsisten
