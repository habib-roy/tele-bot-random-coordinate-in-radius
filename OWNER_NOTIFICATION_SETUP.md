# Setup Notifikasi Telegram Owner

Untuk mengaktifkan notifikasi ke inbox Telegram pribadi Anda setiap kali ada yang mengirim pesan ke bot, ikuti langkah berikut:

## 1. Dapatkan Chat ID Telegram Anda

Ada beberapa cara untuk mendapatkan Chat ID:

### Cara 1: Menggunakan Bot @userinfobot
1. Buka Telegram
2. Cari bot `@userinfobot`
3. Kirim `/start` ke bot tersebut
4. Bot akan membalas dengan informasi Anda, termasuk Chat ID

### Cara 2: Menggunakan Bot Anda Sendiri
1. Tambahkan `console.log` sementara di code untuk melihat `message.from.id`
2. Kirim pesan ke bot Anda
3. Lihat logs di terminal/Vercel untuk melihat ID Anda

## 2. Tambahkan Environment Variable

### Untuk Development Lokal
Tambahkan ke file `.env.local`:
```
OWNER_CHAT_ID=your_chat_id_here
```

### Untuk Vercel Production
1. Buka Vercel Dashboard: https://vercel.com
2. Pilih project **tele-bot**
3. Klik **Settings** → **Environment Variables**
4. Tambahkan variable baru:
   - **Name**: `OWNER_CHAT_ID`
   - **Value**: Chat ID Anda (contoh: `123456789`)
   - **Environment**: Production (atau pilih semua)
5. Klik **Save**
6. Redeploy project

## 3. Test Notifikasi

Setelah setup selesai:
1. Minta seseorang kirim pesan ke bot Anda
2. Anda akan menerima notifikasi di inbox Telegram pribadi dengan informasi:
   - Nama pengirim
   - User ID
   - Username
   - Isi pesan

## Catatan

- Jika `OWNER_CHAT_ID` tidak di-set, bot akan tetap berfungsi normal tetapi tidak akan mengirim notifikasi
- Notifikasi akan dikirim untuk **SETIAP** pesan yang masuk ke bot
