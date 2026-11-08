# Taskedu - Web Pengelola Tugas Kuliah

Aplikasi web pengelola tugas kuliah modern dan responsif yang dibangun menggunakan framework **React**, **TypeScript**, dan **Vite** dengan pendekatan **Component-Based UI Development**. Antarmuka mengadopsi bahasa desain **Bento Grid** yang bersih, minimalis, dan berorientasi pada produktivitas mahasiswa.
<img width="1055" height="902" alt="Screenshot 2026-11-08 193431" src="https://github.com/user-attachments/assets/5ca8909e-06d4-44e7-b294-e6e499554cc9" />

---

## 🌟 Fitur Utama

1. **Daftar Tugas Kuliah (Task List)**
   - Menampilkan kartu tugas (*Bento Card*) lengkap dengan nama mata kuliah, judul tugas, tenggat waktu, indikator urgensi (terlewat, hari ini, besok, x hari lagi), serta badge prioritas (Rendah / Sedang / Tinggi).
2. **Form Tambah & Edit Tugas (Modal Interaktif)**
   - Modal form dialog dengan validasi data (judul tugas, mata kuliah, tenggat waktu, tingkat prioritas, status, dan catatan detail).
   - Penutupan modal yang fleksibel: tombol tutup/batal, klik backdrop luar, atau tombol keyboard `Escape`.
3. **Penyuntingan & Penghapusan (Edit & Delete)**
   - Mengedit data tugas yang sudah tersimpan dengan prefill otomatis ke dalam form modal.
   - Konfirmasi penghapusan tugas dengan aman untuk mencegah kehilangan data secara tidak sengaja.
4. **Pembaruan Status Cepat (One-Click Toggle)**
   - Checkbox interaktif untuk menandai status tugas (Belum Selesai / Selesai) langsung dari kartu tugas.
5. **Indikator Statistik Tugas (Bento Stats Grid Seimbang)**
   - Tata letak grid 4 kolom simetris (*equal-width* 3 : 3 : 3 : 3 = 12 kolom):
     1. **Progres Tugas (Hero Card)**: Persentase penyelesaian dan progress bar dinamis.
     2. **Belum Selesai**: Jumlah tugas pending dengan peringatan deadline dekat atau terlewat.
     3. **Selesai**: Counter tugas yang telah berhasil diselesaikan.
     4. **Mata Kuliah**: Jumlah mata kuliah unik yang memiliki tugas aktif.
6. **Filter & Pencarian Komprehensif**
   - **Filter Status**: *Semua*, *Belum Selesai*, *Selesai* lengkap dengan live counter jumlah tugas pada masing-masing tab.
   - **Filter Prioritas**: Dropdown penyaringan berdasarkan *Semua*, *Tinggi* (🔴), *Sedang* (🟡), atau *Rendah* (🟢).
   - **Pencarian Real-Time**: Input pencarian responsif berdasarkan judul tugas, mata kuliah, maupun deskripsi catatan.
   - **Pengurutan (Sorting)**: Berdasarkan tenggat terdekat, tenggat terjauh, terbaru ditambahkan, judul (A-Z), dan mata kuliah (A-Z).
7. **Notifikasi Toast Interaktif**
   - Umpan balik visual dinamis (pop-up toast) untuk setiap aksi penambahan, perubahan status, penyuntingan, dan penghapusan tugas.
8. **Penyimpanan Lokal (LocalStorage Persistence)**
   - Sinkronisasi otomatis ke `localStorage` peramban sehingga data tugas tetap tersimpan saat halaman dimuat ulang (*refresh*).
9. **Environment Variables (.env)**
   - Membaca dan menampilkan nama aplikasi, versi, dan nama institusi secara dinamis di Header dan Footer.

---

## ⚛️ Arsitektur Component-Based UI Development

Aplikasi menerapkan konsep fundamental **Component-Based UI** menggunakan React:
- **Modularitas & Reusability**: Memecah antarmuka monolitik menjadi komponen-komponen mandiri yang dapat digunakan kembali (*reusable*).
- **Lifting State Up**: State utama (`tasks`, `filterState`, `isModalOpen`, `editingTask`) dikelola secara terpusat pada komponen root (`App.tsx`), kemudian didistribusikan ke komponen anak melalui **Props**.
- **Pure Functions & Immutability**: Pembaruan state dilakukan secara *immutable* menggunakan generic helper functions (`filterItems`, `sortItems`, `updateItemInList`, `removeItemFromList`).
- **React Hooks**:
  - `useState`: Mengelola state reaktif (daftar tugas, state filter/sorting, dan visibilitas modal).
  - `useEffect`: Sinkronisasi otomatis data tugas ke LocalStorage dan *event listener* global (seperti tombol keyboard `Escape`).
  - `useMemo`: Menghitung metrik statistik analitik dan memfilter/mengurutkan tugas secara teroptimasi (*memoized*).
  - `useCallback`: Menjaga stabilitas referensi fungsi *handler* yang diteruskan ke komponen anak.
  - `useRef`: Auto-focus pada kolom input judul saat modal dibuka.

### Hirarki Komponen React
```
App.tsx (Root State Management & Business Logic)
├── Header.tsx (Branding, .env Variables, Tanggal Aktif, Tombol Tambah)
├── TaskStats.tsx (4 Bento Grid Cards: Progres, Pending, Selesai, Mata Kuliah)
├── TaskControls.tsx (Search Bar, Status Tabs, Filter Prioritas, Dropdown Sorting)
├── TaskList.tsx (Task Grid Wrapper & Empty State)
│   └── TaskItem.tsx (Single Bento Task Card dengan Status Toggle, Edit, & Delete)
├── Footer.tsx (Informasi Versi .env, Hak Cipta, & Status Sinkronisasi LocalStorage)
└── TaskModal.tsx (Controlled Form Dialog Tambah/Edit Tugas dengan Validasi)
```

---

## 📋 Rincian Komponen React (`src/components/`)

| Komponen | Berkas | Props Utama | Tanggung Jawab & Fitur |
|---|---|---|---|
| **`Header`** | `Header.tsx` | `onAddTask: () => void` | Menampilkan logo, nama aplikasi, badge versi (.env), tanggal hari ini dalam format bahasa Indonesia, dan tombol trigger buka modal tambah tugas. |
| **`TaskStats`** | `TaskStats.tsx` | `tasks: Task[]` | Menghitung metrik analitik dan merender 4 kotak Bento Cards simetris (1:1:1:1) dengan warna tema dan ikon khas. |
| **`TaskControls`** | `TaskControls.tsx` | `filterState`, `onFilterChange`, `totalCount`, `pendingCount`, `completedCount`, `visibleCount` | Kontrol interaktif: pencarian teks, tab status dengan counter dinamis, dropdown filter prioritas, dan dropdown sorting. |
| **`TaskItem`** | `TaskItem.tsx` | `task: Task`, `onToggleStatus`, `onEdit`, `onDelete` | Render satu kartu tugas bergaya Bento: badge mata kuliah, badge prioritas, judul, deskripsi, tenggat waktu relatif, checkbox status, dan tombol aksi edit/hapus. |
| **`TaskList`** | `TaskList.tsx` | `tasks: Task[]`, `filterState`, `onAddTask`, `onToggleStatus`, `onEdit`, `onDelete` | Merender grid koleksi kartu tugas atau Bento Empty State yang informatif jika tidak ada data yang cocok dengan kriteria filter. |
| **`TaskModal`** | `TaskModal.tsx` | `isOpen`, `mode`, `task`, `onClose`, `onSubmit` | Form modal terkontrol (*controlled component*) untuk tambah/edit tugas. Memiliki validasi input, auto-focus, dan penutupan dengan backdrop click atau tombol `Escape`. |
| **`Footer`** | `Footer.tsx` | - | Menampilkan badge versi aplikasi (.env), hak cipta semester berjalan, status sinkronisasi LocalStorage, dan nama kampus. |
| **`App`** | `App.tsx` | - | Root koordinasi seluruh alur data, integrasi LocalStorage, kalkulasi filter/sorting, dan orkestrasi modal dialog. |

---

## 🎨 Desain UI (Bento Grid Design System)

- **Latar Belakang**: Abu-abu sangat muda bersih (`#f8fafc`).
- **Kartu Bento**: Putih murni (`#ffffff`) dengan sudut melengkung besar (`border-radius: 1.5rem` / 24px).
- **Grid Statistik Simetris**: 4 kartu berukuran seimbang (`bento-col-3` / 25% lebar grid pada desktop).
- **Bayangan (Soft Shadows)**: Halus dan bertingkat dengan efek hover lift (`transform: translateY(-3px)`).
- **Aksen Warna**: Rose Coral (`#e0556f` & `#cc3d58`), Amber (`#d97706`), Emerald (`#15803d`), dan Rose (`#e11d48`).
- **Tipografi**: Font **Manrope** dari Google Fonts (bobot 300, 400, 500, 600, 700, 800).
- **Responsif**:
  - **Desktop (> 1024px)**: 4 kolom statistik sejajar (`span 3` per kartu) dan 2-3 kolom kartu tugas.
  - **Tablet (768px - 1024px)**: 2x2 grid statistik (`span 6` per kartu) dan kartu tugas 2 kolom.
  - **Mobile (< 768px)**: 1 kolom penuh vertikal (`span 12` per kartu) dengan navigasi header fleksibel.

---

## 📐 Cakupan TypeScript (TypeScript Coverage)

Proyek ini mempertahankan standar pengetikan ketat (*strict mode*) pada TypeScript:

| Konsep TypeScript | Implementasi pada Proyek |
|---|---|
| **Primitive Types** | `string` (id, title, course, deadline), `number` (createdAt, stats counts, completion rate), `boolean` (isCompleted). |
| **Arrays** | `Task[]`, operasi *immutable* array (`filter`, `map`, `sort`). |
| **Interfaces** | `Task`, `TaskFormData`, `TaskStatsData`, `FilterState`, `AppConfig`, `StoragePayload<T>`. |
| **Type Aliases & Union Types** | `TaskPriority = 'low' \| 'medium' \| 'high'`, `TaskStatusFilter = 'all' \| 'pending' \| 'completed'`, `TaskSortOption`, `ModalMode = 'create' \| 'edit'`, `DeadlineStatus`. |
| **Generic Helper Functions** | `getStorageItem<T>(key, defaultValue): T`<br>`setStorageItem<T>(key, value): OperationResult<T>`<br>`filterItems<T>(items, predicate): T[]`<br>`sortItems<T>(items, comparator): T[]`<br>`updateItemInList<T extends { id: string }>(items, updatedItem): T[]`<br>`removeItemFromList<T extends { id: string }>(items, id): T[]` |

---

## 📁 Struktur Direktori Proyek

```
PAW-7/
├── .env                  # Konfigurasi environment variables lokal
├── .env.example          # Contoh referensi template konfigurasi .env
├── .gitignore            # Berkas pengecualian Git
├── index.html            # Entry point HTML & pemuatan font Manrope
├── package.json          # Manajemen dependensi React, Vite & TypeScript
├── tsconfig.json         # Konfigurasi TypeScript compiler dengan jsx react-jsx
├── vite.config.ts        # Konfigurasi build Vite dengan plugin @vitejs/plugin-react
├── README.md             # Dokumentasi lengkap proyek
└── src/
    ├── assets/
    │   └── styles.css    # Styling Bento Grid, font Manrope, & utilitas responsif
    ├── types/
    │   └── task.ts       # Definisi Primitive, Array, Interface, Union Types, & Generics
    ├── utils/
    │   ├── storage.ts    # Helper generic LocalStorage, format tanggal, & seed data
    │   └── toast.ts      # Utilitas notifikasi pop-up feedback
    ├── components/
    │   ├── Header.tsx        # Komponen Header (membaca env variables: App Name & Version)
    │   ├── TaskStats.tsx     # Ringkasan status dan progres tugas (Bento Stats Seimbang)
    │   ├── TaskControls.tsx  # Kontrol pencarian, filter status, filter prioritas, & sorting
    │   ├── TaskItem.tsx      # Render single task card ala Bento Card
    │   ├── TaskList.tsx      # Grid daftar tugas & empty state
    │   ├── TaskModal.tsx     # Komponen Modal Form Tambah/Edit Tugas
    │   └── Footer.tsx        # Komponen Footer (membaca env variables)
    ├── App.tsx               # Komponen root pengelola state aplikasi React
    └── main.tsx              # Entry point React (createRoot)
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- Node.js (versi 18 ke atas)
- npm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas `.env.example` ke `.env` (sudah otomatis tersedia secara default):
```ini
VITE_APP_NAME="Taskademik"
VITE_APP_VERSION="v1.2.0"
VITE_APP_DESCRIPTION="Manajemen Tugas Kuliah Modern & Terstruktur"
VITE_COLLEGE_NAME="Portal Mahasiswa"
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban pada alamat yang tertera di terminal (biasanya `http://localhost:5173`).

### 5. Membangun Proyek untuk Produksi (Build)
```bash
npm run build
```
Hasil build yang teroptimasi akan tersimpan pada folder `dist/`.

### 6. Menjalankan Preview Hasil Build
```bash
npm run preview
```

---

## 💡 Pengujian Fungsionalitas
- [x] Memuat daftar tugas awal (*sample tasks*) saat pertama kali dibuka.
- [x] Kotak statistik Bento Grid tertata simetris 4 kolom seimbang (*Progres, Belum Selesai, Selesai, Mata Kuliah*).
- [x] Menambah tugas baru melalui modal dialog dan otomatis tersimpan di LocalStorage.
- [x] Mengedit judul, mata kuliah, tenggat waktu, prioritas, dan catatan tugas dengan prefill data.
- [x] Mengubah status tugas (*Belum Selesai / Selesai*) dengan interaksi realtime.
- [x] Menghapus tugas dengan prompt dialog konfirmasi.
- [x] Menyaring tugas berdasarkan status (*Semua, Belum Selesai, Selesai*) dengan counter live.
- [x] Menyaring tugas berdasarkan prioritas (*Tinggi, Sedang, Rendah*).
- [x] Mencari tugas berdasarkan judul, mata kuliah, atau catatan secara dinamis.
- [x] Mengurutkan tugas (*deadline terdekat, deadline terjauh, terbaru ditambahkan, alfabetis*).
- [x] Menampilkan nama aplikasi dan versi dari variabel `.env` pada Header dan Footer.
- [x] Notifikasi visual (*toast notification*) muncul pada setiap aksi pengguna.
