export type Category = "competition" | "practice";
export type Condition = "new" | "used";
export type Program = "standart" | "latin";
export type Gender = "boy" | "girl" | "man" | "woman";
export type Federation = "FTSARR" | "RTS" | "WDSF" | "any";

export interface Seller {
  name: string;
  city: string;
  phone: string;
  telegram: string;
  avatar_url: string;
  registered: string;
  listings_count: number;
}

export interface MarketItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  images: string[];
  category: Category;
  condition: Condition;
  program: Program;
  gender: Gender;
  size: string;
  height: string;
  federation: Federation | null;
  description: string;
  posted_at: string;
  views: number;
  seller: Seller;
}

export interface UserProfile {
  name: string;
  city: string;
  phone: string;
  telegram: string;
  avatar_url: string;
  registered: string;
}

export const LABEL: Record<string, string> = {
  competition: "Турнирные",
  practice: "Тренировочная",
  new: "Новое",
  used: "Б/У",
  standart: "Стандарт",
  latin: "Латина",
  FTSARR: "ФТСАРР",
  RTS: "РТС",
  WDSF: "WDSF",
  any: "Любая",
  boy: "Мальчик",
  girl: "Девочка",
  man: "Мужчина",
  woman: "Женщина",
};

export function formatPrice(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "Только что";
  if (diffMin < 60) return `${diffMin} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function pluralize(
  n: number,
  one?: string,
  few?: string,
  many?: string,
): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  const w1 = one ?? "товар";
  const w2 = few ?? "товара";
  const w5 = many ?? "товаров";
  if (mod10 === 1 && mod100 !== 11) return w1;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return w2;
  return w5;
}
