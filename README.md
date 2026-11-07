# Demo — Monitoring Lab Energi FST

Versi demo dari project Capstone Monitoring & Kontrol Tungku Laboratorium Energi FST Universitas Jambi.

## Fitur Demo
- **Login** dengan 3 akun demo (admin / operator / viewer) — data disimpan di `localStorage`.
- **Admin**: Dashboard statistik, CRUD operator (tambah / lihat / edit / hapus), daftar operator, riwayat akses tungku.
- **Operator**: Dashboard kontrol tungku (simulasi sensor), mulai/akhiri sesi, pengiriman setpoint suhu, log monitoring + unduh CSV.
- **Viewer**: Monitoring pantauan suhu & tekanan tungku (hanya baca).
- **Penyimpanan dummy + localStorage**: input tetap tersimpan saat refresh, tapi akan hilang saat tombol **"Reset Data Demo"** ditekan (localStorage dibersihkan & di-seed ulang data dummy).

## Cara Menjalankan

Di dalam folder `demo`:

```bash
# 1. Install dependensi
npm install

# 2. Jalankan dev server
npm run dev

# 3. Build untuk produksi
npm run build

# 4. Preview hasil build
npm run preview
```

Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`).

## Akun Demo

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Operator | `operator` | `operator123` |
| Viewer | `viewer` | `viewer123` |

## Struktur Penyimpanan

Semua data disimpan di `localStorage` browser (tidak perlu backend/database):
- `demo_lab_energi_v1:users` — data user/operator
- `demo_lab_energi_v1:furnaceStatus` — status tiap tungku
- `demo_lab_energi_v1:liveData` — data simulasi sensor (suhu/tekanan/setpoint)
- `demo_lab_energi_v1:accessLogs` — log sesi akses tungku
- `demo_user`, `demo_token`, `demo_role`, `demo_username` — sesi login

Klik tombol **Reset Data Demo** di halaman Riwayat Akses untuk menghapus semua input dan kembali ke data dummy awal.

## Catatan
- Ini adalah versi **demo stand-alone** (frontend only), tidak terhubung ke backend API/MQTT asli. Data sensor difungsikan sebagai simulasi agar dapat dicoba langsung tanpa server.
- UI menggunakan Tailwind CSS dengan warna identik versi asli (`#3674B5` biru).
