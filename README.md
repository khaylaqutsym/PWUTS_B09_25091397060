# SmartFinder

## 1. Deskripsi Proyek

SmartFinder merupakan rancangan sistem informasi pencarian partner belajar mahasiswa. Website ini dibuat untuk membantu mahasiswa menemukan teman belajar berdasarkan keterampilan (*skill*) dan topik pembelajaran yang diminati.

Proyek ini dikembangkan sebagai bagian dari Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web.

## 2. Tujuan

Tujuan pengembangan SmartFinder adalah:
- Menyediakan tampilan website untuk memperkenalkan konsep pencarian partner belajar.
- Memungkinkan pengguna mengisi dan menyimpan data profil.
- Memungkinkan pengguna memilih skill dan topik pembelajaran.
- Menerapkan navigasi halaman menggunakan JavaScript dan AJAX.
- Menerapkan validasi formulir sebelum data dikirim ke server.

## 3. Teknologi yang Digunakan

- **HTML5** untuk menyusun struktur halaman website.
- **CSS3** untuk mengatur tampilan dan tata letak website.
- **JavaScript** untuk interaksi, validasi formulir, dan pengelolaan data.
- **AJAX (Fetch API)** untuk memuat konten halaman tanpa memuat ulang seluruh halaman.
- **Local Storage** untuk menyimpan data profil serta pilihan skill dan topik di browser.
- **Python HTTP Server** untuk menerima dan memvalidasi pengiriman data profil melalui HTTP POST.
- **GitHub** untuk menyimpan dan membagikan kode sumber proyek.

## 4. Struktur Folder

```text
SmartFinder/
├── index.html
├── style.css
├── script.js
├── server.py
├── README.md
├── assets/
│   └── logo-smartfinder.png
└── pages/
    ├── profil.html
    └── skill-topik.html
```

## 5. Fitur Website

### Beranda
Menampilkan halaman utama SmartFinder sebagai pengenalan sistem pencarian partner belajar mahasiswa.

### Profil
Menyediakan formulir untuk memasukkan nama, universitas, program studi, dan semester. Formulir menggunakan validasi sebelum data dikirim ke server. Data profil juga disimpan di Local Storage agar dapat ditampilkan kembali di browser.

### Skill dan Topik
Memungkinkan pengguna memilih keterampilan dan menentukan topik pembelajaran. Pilihan disimpan di Local Storage.

### Navigasi AJAX
Memungkinkan pengguna berpindah antara halaman Beranda, Profil, serta Skill dan Topik dengan memuat konten menggunakan Fetch API.

### Validasi Formulir
Memeriksa kelengkapan data sebelum formulir diproses atau dikirim.

## 6. Cara Menjalankan Website

1. Pastikan Python sudah terpasang di komputer.
2. Buka folder proyek SmartFinder melalui Visual Studio Code.
3. Buka terminal pada folder utama proyek.
4. Jalankan perintah berikut:

   ```bash
   py -3 server.py
   ```

5. Tunggu hingga terminal menampilkan alamat server:

   ```text
   SmartFinder berjalan di http://127.0.0.1:8000
   ```

6. Buka browser dan akses alamat berikut:

   `http://127.0.0.1:8000/`

7. Gunakan menu navigasi untuk mencoba fitur Profil serta Skill dan Topik.

**Catatan:** Terminal harus tetap berjalan selama website digunakan. Server lokal ini menerima dan memvalidasi data profil, sedangkan penyimpanan profil dan pilihan skill/topik pada browser menggunakan Local Storage.

## 7. Catatan Pengembangan

SmartFinder dikembangkan sebagai prototipe website pencarian partner belajar mahasiswa. Fitur yang tersedia berfokus pada tampilan halaman, navigasi, pengisian profil, pemilihan skill dan topik, validasi formulir, serta pengiriman data profil ke server lokal.

Pengembangan lanjutan dapat mencakup penggunaan basis data, autentikasi pengguna, dan fitur pencarian serta pencocokan partner belajar secara dinamis.
