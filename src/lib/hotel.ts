import queen from "@/assets/queen.jpg.asset.json";
import twin from "@/assets/actual-twin.jpg.asset.json";
import deluxe from "@/assets/deluxe-room-new.jpg.asset.json";
import suite from "@/assets/suite-room-new.jpg.asset.json";
import restaurant from "@/assets/actual-dining.jpg.asset.json";
import lobby from "@/assets/actual-lounge.jpg.asset.json";
import exterior from "@/assets/actual-reception.jpg.asset.json";
import pool from "@/assets/actual-pool.jpg.asset.json";
import gym from "@/assets/actual-gym.jpg.asset.json";
import sauna from "@/assets/actual-sauna.jpg.asset.json";
import location from "@/assets/actual-location.jpg.asset.json";
import extraRoom from "@/assets/room-gallery-new.jpg.asset.json";
import music from "@/assets/hero-oud-music.mp3.asset.json";
import steam from "@/assets/actual-steam.jpg.asset.json";
import building from "@/assets/al-hayat-hotel-blue-skies.png.asset.json";
import diningWide from "@/assets/actual-dining-wide.jpg.asset.json";
import diningLounge from "@/assets/actual-dining-lounge.jpg.asset.json";
import diningTable from "@/assets/actual-dining-table.jpg.asset.json";
import video1 from "@/assets/hero-video-1.webm.asset.json";
import video2 from "@/assets/hero-video-2.webm.asset.json";
import video3 from "@/assets/hero-video-3.webm.asset.json";
import video4 from "@/assets/hero-video-4.webm.asset.json";
import video5 from "@/assets/hero-video-5.webm.asset.json";
import video6 from "@/assets/hero-video-6.webm.asset.json";

export const heroVideos = [video1.url, video2.url, video3.url, video4.url, video5.url, video6.url];
export const heroMusic = music.url;

export const CONTACT = {
  address: "Zahraa St., Facing King Faisal Masjid, Sharjah - U.A.E",
  email: "reservation@alhayat-hotel.com",
  phone: "+971 6 506 6222",
  phoneHref: "tel:+97165066222",
  whatsapp: "+971 50 376 8262",
  whatsappUrl: "https://wa.me/971503768262",
  website: "www.alhayat-hotel.com",
};

export const photos = { queen: queen.url, twin: twin.url, deluxe: deluxe.url, suite: suite.url, restaurant: restaurant.url, lobby: lobby.url, room: deluxe.url, exterior: exterior.url, buffet: diningWide.url, coffee: diningLounge.url, roomService: diningTable.url, kitchen: diningWide.url, pool: pool.url, jacuzzi: pool.url, gym: gym.url, sauna: sauna.url, steam: steam.url, location: location.url, additionalRoom: extraRoom.url, building: building.url };

export type RoomType = "Queen" | "Twin" | "Deluxe" | "Suite";
export const ROOM_RATES: Record<RoomType, number> = { Queen: 250, Twin: 250, Deluxe: 350, Suite: 500 };
export const roomTypes = Object.keys(ROOM_RATES) as RoomType[];
export const calculateNights = (arrival: string, departure: string) => {
  const start = new Date(arrival).getTime();
  const end = new Date(departure).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.max(1, Math.ceil((end - start) / 86_400_000));
};
export const calculateTotal = (rate: number, nights: number, taxRate = 0.05) => rate * nights * (1 + taxRate);

// Date-only helpers (YYYY-MM-DD, local midnight — no timezone/DST drift)
export const toISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
export const addDays = (iso: string, days: number) => {
  const d = parseISODate(iso);
  if (!d) return "";
  d.setDate(d.getDate() + days);
  return toISODate(d);
};
export const nightsBetween = (checkIn: string, checkOut: string) => {
  const a = parseISODate(checkIn);
  const b = parseISODate(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
};
export const formatDate = (iso: string) => {
  const d = parseISODate(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
export const formatAED = (n: number) => n.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const navItems = [
  ["Home", "/"], ["Hotel", "/hotel"], ["Rooms", "/rooms"], ["Dining", "/dining"],
  ["Recreation", "/recreation"], ["Gallery", "/gallery"], ["Location", "/location"], ["Contact", "/contact"],
] as const;

export const meta = (title: string, description: string, image?: string) => [
  { title }, { name: "description", content: description }, { property: "og:title", content: title },
  { property: "og:description", content: description }, { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
];
