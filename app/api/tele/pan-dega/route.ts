import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Fungsi util sederhana untuk kirim pesan balik
const sendMessage = async (chatId: number, text: string) => {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
};

const sendLocation = async (chatId: number, lat: string | number, lng: string | number) => {
  await fetch(`${TELEGRAM_API}/sendLocation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, latitude: lat, longitude: lng }),
  });
};

// Fungsi untuk notifikasi ke owner tentang pesan masuk
const notifyOwner = async (from: any, text: string) => {
  const ownerChatId = process.env.OWNER_CHAT_ID;

  if (!ownerChatId) {
    console.warn("OWNER_CHAT_ID not set, skipping notification");
    return;
  }

  const username = from.username ? `@${from.username}` : "No username";
  const firstName = from.first_name || "";
  const lastName = from.last_name || "";
  const userId = from.id;

  const notification = `🔔 Pesan Baru Masuk!\n\n` +
    `👤 Dari: ${firstName} ${lastName}\n` +
    `🆔 User ID: ${userId}\n` +
    `📱 Username: ${username}\n` +
    `💬 Pesan: ${text}`;

  await sendMessage(parseInt(ownerChatId), notification);
};

const getRandomCoordinateInRadius = (
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): { lat: string; lng: string } => {
  // Konversi radius dari meter ke derajat
  const radiusInDegrees = radiusMeters / 111_320; // 1° latitude ≈ 111.32 km

  // Random sudut dan jarak
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInDegrees;

  // Hitung offset
  const deltaLat = distance * Math.cos(angle);
  const deltaLng =
    distance * Math.sin(angle) / Math.cos((centerLat * Math.PI) / 180);

  // Tambahkan offset ke koordinat pusat
  const newLat = centerLat + deltaLat;
  const newLng = centerLng + deltaLng;

  return { lat: newLat.toFixed(7).toString(), lng: newLng.toFixed(7).toString() };
};

const getLocalTimeIndonesia = (): string => {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  };

  // Format dalam bahasa Indonesia
  const formatted = new Intl.DateTimeFormat('id-ID', options).format(now);

  // Ubah titik pemisah jam ke titik dua, lalu tambahkan WIB
  return `${formatted.replace('.', ':')} WIB`;
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  // Pastikan ada message
  if (!body.message) {
    return NextResponse.json({ ok: false, reason: "No message received" });
  }

  const message = body.message;
  const chatId = message.chat.id;
  const text: string = message.text || "";

  console.log("📩 Incoming message:", text);

  // Notifikasi ke owner tentang pesan masuk
  await notifyOwner(message.from, text);

  // --- Tangani command /ambil saja ---
  if (text.startsWith("/ambil")) {

    const center = { lat: -7.681848, lng: 108.645998 };
    const { lat, lng } = getRandomCoordinateInRadius(center.lat, center.lng, 100);
    const waktuSekarang = getLocalTimeIndonesia()

    // Kirim waktu sekarang
    await sendMessage(chatId, waktuSekarang);

    // Kirim lattitude
    await sendMessage(chatId, lat);

    // Kirim longitude
    await sendMessage(chatId, lng);

    // Kirim preview lokasi dengan URL
    await sendMessage(chatId, `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);

    // Kirim lokasi (preview peta)
    await sendLocation(chatId, lat, lng);

  } else {
    // Jika bukan /ambil, abaikan atau beri respon default
    await sendMessage(chatId, "Perintah tidak dikenali. Coba ketik /ambil");
  }

  return NextResponse.json({ ok: true });
};