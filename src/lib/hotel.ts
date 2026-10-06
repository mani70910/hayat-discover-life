import queen from "@/assets/queen.jpg.asset.json";
import twin from "@/assets/twin.jpg.asset.json";
import deluxe from "@/assets/deluxe.jpg.asset.json";
import suite from "@/assets/suite.jpg.asset.json";
import restaurant from "@/assets/restaurant.jpg.asset.json";
import lobby from "@/assets/hotel-lobby.jpg.asset.json";
import room from "@/assets/hotel-room.jpg.asset.json";
import exterior from "@/assets/hotel-exterior.jpg.asset.json";
import buffet from "@/assets/buffet.jpg.asset.json";
import coffee from "@/assets/coffee-shop.jpg.asset.json";
import roomService from "@/assets/room-service.jpg.asset.json";
import kitchen from "@/assets/kitchen.jpg.asset.json";
import pool from "@/assets/pool.jpg.asset.json";
import jacuzzi from "@/assets/jacuzzi.jpg.asset.json";
import gym from "@/assets/gym.jpg.asset.json";
import video1 from "@/assets/hero-video-1.mp4.asset.json";
import video2 from "@/assets/hero-video-2.mp4.asset.json";
import video3 from "@/assets/hero-video-3.mp4.asset.json";
import video4 from "@/assets/hero-video-4.mp4.asset.json";
import video5 from "@/assets/hero-video-5.mp4.asset.json";
import video6 from "@/assets/hero-video-6.mp4.asset.json";

export const heroVideos = [video1.url, video2.url, video3.url, video4.url, video5.url, video6.url];

export const CONTACT = {
  address: "Zahraa St., Facing King Faisal Masjid, Sharjah - U.A.E",
  email: "reservation@alhayat-hotel.com",
  phone: "+971 6 506 6222",
  phoneHref: "tel:+97165066222",
  whatsapp: "+971 50 376 8262",
  whatsappUrl: "https://wa.me/971503768262",
  website: "www.alhayat-hotel.com",
};

export const photos = { queen: queen.url, twin: twin.url, deluxe: deluxe.url, suite: suite.url, restaurant: restaurant.url, lobby: lobby.url, room: room.url, exterior: exterior.url, buffet: buffet.url, coffee: coffee.url, roomService: roomService.url, kitchen: kitchen.url, pool: pool.url, jacuzzi: jacuzzi.url, gym: gym.url };

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

export const navItems = [
  ["Home", "/"], ["Hotel", "/hotel"], ["Rooms", "/rooms"], ["Dining", "/dining"],
  ["Recreation", "/recreation"], ["Gallery", "/gallery"], ["Location", "/location"], ["Contact", "/contact"],
] as const;

export const meta = (title: string, description: string) => [
  { title }, { name: "description", content: description }, { property: "og:title", content: title },
  { property: "og:description", content: description }, { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];
