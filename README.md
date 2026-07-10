# Native Power App - Smart Check-In System

Aplikasi mobile berbasis **React Native (Expo Go)** yang mengintegrasikan fitur hardware native perangkat berupa Kamera, Galeri foto, dan GPS lokasi presisi tinggi untuk melakukan pencatatan kehadiran (Smart Check-In). 

Aplikasi ini dibangun dengan desain modern berkonsep **Ultra-Dark Aesthetic** yang nyaman di mata dan responsif di berbagai perangkat fisik.

---

## 🚀 Cakupan Fitur Aplikasi

### 🟢 Level 1 — Fitur Wajib (Core)
- **Akses Kamera Perangkat:** Mengambil foto secara langsung untuk keperluan data check-in.
- **Akses GPS (Akurasi Tinggi):** Menarik koordinat lintang (*Latitude*) dan bujur (*Longitude*) secara realtime.
- **Permission Flow Aman:** Memeriksa status izin (`granted`) sebelum mengakses perangkat keras. Jika izin ditolak, aplikasi menangani secara *graceful* menggunakan dialog `Alert` ramah tanpa mengalami *crash*.
- **Validasi Pembatalan:** Memeriksa status `canceled` pada *image picker* sebelum memproses URI aset gambar.
- **UI Responsif:** Menampilkan hasil jepretan foto dan koordinat lokasi dengan tata letak yang rapi dan dimensi gambar yang presisi.

### 🟡 Level 2 — Fitur Pengembangan (Minimal 2)
- **📸 Kamera + Galeri:** Menyediakan opsi alternatif bagi pengguna untuk mengambil foto langsung dari kamera atau memilih aset gambar yang ada di dalam galeri ponsel.
- **📍 Kamera + Lokasi:** Menggabungkan jepretan foto profil/selfie dan koordinat GPS secara sinkron dalam satu kali ketukan tombol check-in.
- **🔁 Tombol Settings via Linking:** Menyediakan tombol interaktif yang mengarahkan pengguna secara otomatis ke menu Pengaturan Aplikasi pada sistem HP jika izin perangkat sebelumnya ditolak.

### 🔴 Level 3 — Tantangan Bonus (Opsional)
- **🗺️ Reverse Geocoding:** Mengonversi data mentah koordinat GPS (`latitude` & `longitude`) menjadi nama jalan dan wilayah yang dapat dibaca manusia secara *realtime* memanfaatkan modul `Location.reverseGeocodeAsync`.
- **🗑️ Reset Device Data:** Fitur kliring state untuk menghapus foto serta data lokasi terikat, mengembalikan antarmuka aplikasi ke kondisi semula.

## tampilan awal
![tampilan awal](./assets/tampilan_awal.JPEG) 
## input gambar
![tampilan awal](./assets/input_gambar.JPEG) 
## lokasi
![tampilan awal](./assets/lokasi.JPEG)

## link snack
[link snack](https://snack.expo.dev/@manisha00/native-power-app)
## 📱 Panduan Menjalankan Proyek Secara Lokal

### 1. Kloning Repositori
```bash
git clone [https://github.com/USERNAME_KAMU/NAMA_REPO_KAMU.git](https://github.com/USERNAME_KAMU/NAMA_REPO_KAMU.git)
cd NAMA_REPO_KAMU
