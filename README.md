# Muhammad Fathur Rohman — Interactive 3D Tactile & Editorial Portfolio (2026)

> **Dokumentasi Arsitektur & Panduan AI (AI Context & Token Optimizer)**  
> File ini dirancang sebagai panduan lengkap (*single source of truth*) arsitektur website agar asisten AI / developer dapat memahami seluruh struktur, logika, aturan styling, dan konfigurasi tanpa perlu menganalisis ribuan baris kode satu per satu.

---

## 📌 Ringkasan Repositori & Stack Teknologi
- **Repository Remote:** `https://github.com/recreativeid/portofess.git`
- **File Utama:** [`portofolio-muhammad-fathur-rohman-v7.html`](portofolio-muhammad-fathur-rohman-v7.html)
- **Arsitektur 3D Three.js:** [`assets/phone-3d-showcase.ts`](assets/phone-3d-showcase.ts)
- **Teknologi:**
  - **HTML5 & Vanilla JavaScript**: Logika aplikasi, physics engine lanyard, sistem CMS internal, dan DOM event listeners.
  - **Tailwind CSS (CDN)**: Utility styling sistematis.
  - **Three.js (r128 CDN)**: Render 3D studio smartphone mockup di atas balok podium batu hitam (*stone podium*), shadow mapping PCF Soft, dan tekstur canvas dinamis.
  - **Local Storage API**: Persistensi data CMS tanpa database eksternal (`fathur_portfolio_cms_data` & `fathur_portfolio_theme`).

---

## 🎨 Aturan Desain & Palet Warna (PENTING)
1. **Tidak Ada Mode Gelap Penuh di Body**:
   - `document.body` **selalu** berada dalam mode terang editorial kertas (*clean editorial paper*, `#FFFFFF` dan `#F7F7F5`).
   - Tidak menggunakan border neon atau efek glow neon pada tepi kartu maupun halaman (`kembalikan ga usah pakai neon ditepi, dan ga usah pakai tema gelap`).
2. **Implementasi Koding Murni Canva Slide (Section 07)**:
   - Menggunakan 100% kode HTML/CSS, font typography, SVG logos, dan 3 kartu frosted social media (*Instagram, GitHub, LinkedIn*).
   - Tiga variasi tema kartu:
     - **Putih (`canva-theme-white`)**: Canva Slide 4 (default).
     - **Biru (`canva-theme-blue`)**: Canva Slide 3 (UNIMMA Royal Blue `#134B88`).
     - **Hitam (`canva-theme-dark`)**: Canva Slide 2 (`#0C0F14` tanpa neon).
3. **Efek Kursor 3D Magnetic Tilt (`.container-tilt-3d`)**:
   - Diterapkan pada seluruh kartu konten desain, kartu video, dan header Section 04.
   - Bereaksi secara interaktif terhadap posisi kursor (`perspective(850px) rotateX(...) rotateY(...) scale3d(1.02, 1.02, 1.02)`).

---

## 📱 Section 04: Design Portfolio & 3D Smartphone Showcase

### 1. Struktur Hirarki & Urutan Elemen
1. **Subheader Teks**:
   - Judul: `Muhammad Fathur Rohman - Design Portofolio`
   - Handle: `Instagram: @halteaindonesia` (link ke akun resmi dengan badge *Official Client*).
2. **Three.js 3D Smartphone Showcase (Tepat di Bawah Header)**:
   - Sesuai prompt:
     > *"A modern premium smartphone mockup standing vertically on a sleek matte black geometric stone podium block. Minimalist studio environment, sophisticated dark charcoal gray background, clean UI placeholder screen on the mobile display, soft architectural side-lighting with realistic cast shadows, high-end 3D product showcase style, ultra-detailed, photorealistic --ar 4:3."*
   - Berdiri vertikal di atas balok podium batu hitam geometris (*geometric stone podium block*).
   - Pencahayaan studio arsitektural (*Directional side light* dengan soft shadow, *rim light*, dan *ambient studio fill*).
   - Layar smartphone dirender dari in-memory 720x1560 canvas texture (`CanvasTexture`) yang menampilkan header verified `@halteaindonesia`, status bar 5G 100%, judul karya digital, subtitle, dan home bar.
   - Presets `#1`, `#2`, `#3` untuk beralih layar 3D secara instan.
   - Tombol **"🔄 Putar 3D 360°"** untuk memicu animasi putar satu putaran penuh.
   - Mengikuti gerakan mouse kursor (*perspective tilt*).
3. **Konten Desain Grafis (Cukup 6 Karya)**:
   - Ditampilkan dalam container `#featuredDesignGrid` (grid 6 kolom responsif).
   - Tiap kartu memiliki thumbnail gambar/banner, badge karya, judul, subtitle, tombol lightbox preview, dan tombol `📲 Pasang di 3D` untuk langsung memasang desain ke layar smartphone 3D.
4. **Konten Video Portfolio (Cukup 3 Karya)**:
   - Ditampilkan dalam container `#featuredVideoGrid` (grid 3 kolom responsif).
   - Mendukung berbagai rasio: **9:16 (Reels/TikTok/Shorts)**, **16:9 (Landscape YouTube)**, **1:1**, dan **4:5**.
5. **Tombol "Lihat Selengkapnya"**:
   - Menuju ke halaman katalog penuh `allMedsosView` yang menampilkan seluruh koleksi desain grafis dan video.

---

## 🔐 Menu Login Admin Tersembunyi & Panel CRUD Penuh

### 1. Akses & Autentikasi
- **Shortcut Keyboard Rahasia**: **`Ctrl + Shift + A`**
- **Discreet Button**: Ikon gerigi (⚙️) di subheader Section 04 atau tombol di navigasi.
- **Kredensial Default**:
  - **Username**: `admin`
  - **Password**: `admin123`

### 2. Tab & Fitur Panel Admin
| Tab | Fitur Utama | Fungsi CRUD |
|---|---|---|
| **📱 Layar 3D & Header** | Kontrol Layar Smartphone & Teks Subheader | Ganti judul subheader, ganti handle Instagram, pilih layar dari karya desain, atau upload gambar kustom layar 3D + Putar 360°. |
| **🎨 Desain Grafis (CRUD)** | Pengelolaan Konten Desain (6 Pilihan) | **Tambah Baru**, **Edit**, **Hapus**, upload file gambar desain. 6 item teratas otomatis tampil di Section 04. |
| **🎬 Video (CRUD)** | Pengelolaan Video Portfolio (3 Pilihan) | **Tambah Baru**, **Edit**, **Hapus**, set rasio (9:16, 16:9, dll), durasi, dan file/URL video. 3 item teratas otomatis tampil di Section 04. |
| **⚙️ Pengaturan Umum** | Profil, Proyek Website, Tema & Reset | Ganti foto profil ID card, ubah thumbnail 14 proyek website, pilih tema kartu Canva, dan **Reset ke Default**. |

### 3. Persistensi Data (`localStorage`)
- Kunci penyimpanan: `fathur_portfolio_cms_data`
- Skema data:
  ```json
  {
    "sectionTitle": "Muhammad Fathur Rohman - Design Portofolio",
    "instagramHandle": "halteaindonesia",
    "instagramUrl": "https://www.instagram.com/halteaindonesia",
    "currentScreenIndex": 0,
    "activeScreen": {
      "title": "Creamy Tiramitsu 10k",
      "subtitle": "Feed & Poster Produk Haltea",
      "bg": "#1D4ED8",
      "img": null
    },
    "designs": [ ... ],
    "videos": [ ... ]
  }
  ```

---

## 🗺️ Ringkasan Seluruh Bagian (Sections 01 - 07)
1. **Curtain Intro Sinematik**: Layar pembuka film sinematik HD dengan fokus blur masuk dan klik untuk membuka.
2. **Section 01 / Tentang Saya**: Kartu ID Card 3D berayun pada tali lanyard interaktif dengan fisika tali canvas 2D, bisa ditarik dan diputar balik 360°.
3. **Section 02 / Keahlian Saya**: Grid kartu keahlian teknis (Web, AI, UI/UX, Desain Grafis, Video Editing, Live Streaming).
4. **Section 03 / My Project**: Katalog 14 proyek website nyata (*SOLVETA, TeKaPe.id, tidurnyenyak.com, squabumin.id, dll*) dengan filter kategori dan thumbnail.
5. **Section 04 / Design Portfolio & 3D Showcase**: Mockup 3D smartphone di atas podium batu hitam matte (Three.js), 6 kartu desain grafis, 3 kartu video, dan Admin CRUD tersembunyi.
6. **Section 05 / Papan Jejak**: Tiga papan gabus polaroid terhubung tali benang rajut non-bersilangan:
   - Jejak Pengalaman Kerja (Herbal Indo Utama, Yayasan ICMA, Narasumber).
   - Jejak Pendidikan (Universitas Muhammadiyah Magelang - Cum Laude, SMAN 5 Magelang).
   - Jejak Organisasi (5 kampus, 1 luar kampus, 1 SMA).
7. **Section 06 / Prestasi Lomba**: 6 kartu kejuaraan nasional bergambar (Juara 1 HW UNIMMA, Juara 1 Mercomfest UMBY, dll).
8. **Section 07 / Eksekutif Portofolio (Canva Slide Parity)**: Kartu eksekutif profil editorial dengan 3 kartu frosted social media (*Instagram, GitHub, LinkedIn*) dan pemilih tema Putih/Biru/Hitam.

---

## 🚀 Perintah Git & Deployment
Untuk memperbarui repositori:
```bash
git add .
git commit -m "feat: complete Three.js 3D smartphone showcase, Section 04 layout, and hidden Admin CMS"
git push -u origin main
```
