# Laporan Operasi

Aplikasi web berbasis HTML, CSS, dan JavaScript untuk mencatat, mencari, melihat, mengubah, dan mencetak laporan operasi dalam bentuk PDF. Proyek ini berjalan di browser tanpa backend; data disimpan pada `localStorage` perangkat yang digunakan.

## Ringkasan

- Form laporan mencakup informasi pasien, rencana praoperasi, tindakan, anestesi, spesimen, serta detail tim operasi.
- Daftar laporan memiliki pencarian dan filter tanggal.
- Halaman detail menyediakan aksi edit dan ekspor PDF.
- Tombol **Isi Data Dummy** membantu mencoba alur tanpa menyiapkan data sendiri.

## Coba secara lokal

1. Clone repo ini.
2. Buka `index.html` di browser.
3. Pilih **Tambah Laporan Baru**, isi form atau gunakan **Isi Data Dummy**, lalu simpan.
4. Cari laporan di halaman utama, buka detailnya, dan coba ekspor PDF.

Tidak ada proses instalasi paket atau database untuk versi ini.

> **Batas penggunaan:** `localStorage` tidak menyediakan sinkronisasi antarperangkat, kontrol akses, atau perlindungan yang sesuai untuk rekam medis nyata. Gunakan **data fiktif** saat mencoba demo ini. Jangan memasukkan identitas atau informasi kesehatan pasien sungguhan.

## Teknologi

`HTML` · `CSS` · `JavaScript` · `localStorage`

## Alur data

`Form → JavaScript → localStorage → Daftar / Detail → PDF`

## File Struktur

```
LAPORANOPERASI/
├── index.html      # Halaman utama (daftar laporan)
├── form.html       # Form input/edit laporan
├── view.html       # Halaman view laporan
├── script.js       # JavaScript untuk logika aplikasi
├── style.css       # Styling aplikasi
├── logo.png        # Logo aplikasi
└── .htaccess       # Konfigurasi Apache

```

## Deployment

### Opsi 1: Deploy ke VPS dengan Apache/Nginx

#### Persiapan:
1. Pastikan VPS sudah terinstall Apache atau Nginx
2. Pastikan domain sudah diarahkan ke IP VPS

#### Deploy dengan Git:

```bash
# Di VPS, clone repository
cd /var/www/html
git clone [URL_REPOSITORY_ANDA] LAPORANOPERASI

# Atau jika sudah ada, pull update
cd /var/www/html/LAPORANOPERASI
git pull origin main

# Set permissions
chmod -R 755 /var/www/html/LAPORANOPERASI
chown -R www-data:www-data /var/www/html/LAPORANOPERASI
```

#### Konfigurasi Apache Virtual Host:

Buat file `/etc/apache2/sites-available/laporanoperasi.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/html/LAPORANOPERASI
    
    <Directory /var/www/html/LAPORANOPERASI>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/laporanoperasi_error.log
    CustomLog ${APACHE_LOG_DIR}/laporanoperasi_access.log combined
</VirtualHost>
```

Aktifkan site:
```bash
sudo a2ensite laporanoperasi.conf
sudo systemctl reload apache2
```

#### Konfigurasi Nginx:

Buat file `/etc/nginx/sites-available/laporanoperasi`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html/LAPORANOPERASI;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Aktifkan site:
```bash
sudo ln -s /etc/nginx/sites-available/laporanoperasi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Opsi 2: Deploy ke Shared Hosting (cPanel, dll)

1. Login ke cPanel
2. Buka File Manager
3. Upload semua file ke folder `public_html` atau subdomain folder
4. Pastikan file `.htaccess` sudah terupload
5. Akses website melalui domain/subdomain

### Opsi 3: Deploy ke GitHub Pages (Gratis)

1. Buat repository di GitHub
2. Upload semua file ke repository
3. Settings > Pages > Source: pilih branch `main`
4. Website akan tersedia di `https://username.github.io/repository-name`

**Catatan:** GitHub Pages tidak mendukung `.htaccess`, tapi aplikasi tetap bisa berjalan.

### Opsi 4: Deploy ke Netlify/Vercel (Gratis)

1. Buat akun di Netlify atau Vercel
2. Connect dengan GitHub repository
3. Deploy otomatis akan dilakukan
4. Website akan tersedia di URL yang diberikan

## Catatan penyimpanan

Data hanya tersedia pada browser dan perangkat yang sama. Menghapus data situs pada browser dapat menghapus laporan. Untuk penggunaan operasional diperlukan backend, autentikasi, dan perlindungan data yang sesuai.

## HTTPS/SSL

Untuk production, sangat disarankan menggunakan HTTPS. Anda bisa:
- Menggunakan Let's Encrypt (gratis)
- Menggunakan Cloudflare (gratis dengan SSL)
- Membeli SSL certificate

## Troubleshooting

### File tidak ter-load
- Pastikan permissions file sudah benar (755 untuk folder, 644 untuk file)
- Cek error log Apache/Nginx

### .htaccess tidak bekerja
- Pastikan `AllowOverride All` sudah diaktifkan di konfigurasi Apache
- Restart Apache: `sudo systemctl restart apache2`

## Support

Jika ada masalah, cek:
1. Error log server
2. Console browser (F12)
3. Network tab untuk melihat request yang gagal

