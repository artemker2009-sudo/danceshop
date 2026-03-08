"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  MessageCircle,
  Filter,
  Phone,
  Send,
  Calendar,
  MapPin,
  User,
  Clock,
  Share2,
  Heart,
  ShieldCheck,
  Ruler,
  Tag,
} from "lucide-react";

/* ──────────────────────────── Types ──────────────────────────── */

type Category = "competition" | "practice";
type Condition = "new" | "used";
type Program = "standart" | "latin";
type Gender = "boy" | "girl" | "man" | "woman";
type Federation = "FTSARR" | "RTS" | "WDSF" | "any";

interface Seller {
  name: string;
  city: string;
  phone: string;
  telegram: string;
  avatar_url: string;
  registered: string;
  listings_count: number;
}

interface MarketItem {
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

/* ──────────────────────────── Mock Data ──────────────────────── */

const SELLERS: Seller[] = [
  {
    name: "Елена Волкова",
    city: "Москва",
    phone: "+7 (916) 123-45-67",
    telegram: "@elena_dance",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    registered: "Март 2024",
    listings_count: 5,
  },
  {
    name: "Дмитрий Кузнецов",
    city: "Санкт-Петербург",
    phone: "+7 (921) 987-65-43",
    telegram: "@dima_ballroom",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    registered: "Январь 2025",
    listings_count: 3,
  },
  {
    name: "Анна Соколова",
    city: "Новосибирск",
    phone: "+7 (913) 555-12-34",
    telegram: "@anna_dance_nsk",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    registered: "Октябрь 2024",
    listings_count: 8,
  },
  {
    name: "Михаил Петров",
    city: "Казань",
    phone: "+7 (843) 222-33-44",
    telegram: "@misha_dance",
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    registered: "Июнь 2025",
    listings_count: 2,
  },
];

const mockItems: MarketItem[] = [
  {
    id: "1",
    title: "Платье для латины Chrisanne Clover",
    price: 45_000,
    image_url:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=1000&fit=crop",
    ],
    category: "competition",
    condition: "used",
    program: "latin",
    gender: "woman",
    size: "S",
    height: "164-170 см",
    federation: "FTSARR",
    description:
      "Продаю турнирное платье для латиноамериканской программы от Chrisanne Clover. Было надето на 3 турнира, состояние отличное. Ткань — лайкра с декоративной бахромой, украшено стразами Preciosa. Цвет — чёрный с золотым. Подходит под правила ФТСАРР для категории Взрослые-Б. Возможна примерка в Москве.",
    posted_at: "2026-03-05T14:30:00Z",
    views: 142,
    seller: SELLERS[0],
  },
  {
    id: "2",
    title: "Фрак мужской International Dance Shoes",
    price: 62_000,
    image_url:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    ],
    category: "competition",
    condition: "new",
    program: "standart",
    gender: "man",
    size: "48",
    height: "178-182 см",
    federation: "WDSF",
    description:
      "Новый мужской фрак для стандартной программы от IDS. Ни разу не надевался — не подошёл размер. Классический чёрно-белый, пошив Великобритания. Полностью соответствует правилам WDSF. В комплекте: фрак, жилет, бабочка. Готов отправить транспортной компанией или встретиться в СПб.",
    posted_at: "2026-03-07T09:15:00Z",
    views: 89,
    seller: SELLERS[1],
  },
  {
    id: "3",
    title: "Тренировочная юбка для стандарта",
    price: 4_500,
    image_url:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=1000&fit=crop",
    ],
    category: "practice",
    condition: "new",
    program: "standart",
    gender: "woman",
    size: "M",
    height: "160-168 см",
    federation: null,
    description:
      "Новая тренировочная юбка-годе для стандартной программы. Ткань бифлекс, красиво летит в движении. Цвет — тёмно-синий. Длина до щиколотки. Подходит для тренировок и открытых уроков. Пояс на резинке. Отправлю почтой или СДЭК.",
    posted_at: "2026-03-01T18:00:00Z",
    views: 67,
    seller: SELLERS[2],
  },
  {
    id: "4",
    title: "Рубашка-боди для латины (мальчик)",
    price: 3_200,
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1000&fit=crop",
    ],
    category: "practice",
    condition: "used",
    program: "latin",
    gender: "boy",
    size: "134",
    height: "128-134 см",
    federation: null,
    description:
      "Тренировочная рубашка-боди для мальчика, латиноамериканская программа. Носили один сезон, состояние хорошее, без дефектов. Цвет белый, ткань стрейч. Удобные кнопки снизу. Ребёнок вырос, поэтому продаём. Находимся в Казани, возможна отправка.",
    posted_at: "2026-02-20T12:00:00Z",
    views: 34,
    seller: SELLERS[3],
  },
  {
    id: "5",
    title: "Платье стандарт юниоры Aida",
    price: 38_000,
    image_url:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop",
    ],
    category: "competition",
    condition: "used",
    program: "standart",
    gender: "girl",
    size: "152",
    height: "146-152 см",
    federation: "RTS",
    description:
      "Красивое конкурсное платье для стандарта. Производство — ателье Aida (Москва). Нежно-голубой цвет, украшение стразами Swarovski по лифу и рукавам. Платье в идеальном состоянии, надевалось 5 раз. Допуск РТС, категория Юниоры-1. Рекомендую! Примерка в Москве по договорённости.",
    posted_at: "2026-03-08T10:00:00Z",
    views: 215,
    seller: SELLERS[0],
  },
  {
    id: "6",
    title: "Тренировочные брюки мужские Espen",
    price: 7_800,
    image_url:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop",
    ],
    category: "practice",
    condition: "new",
    program: "standart",
    gender: "man",
    size: "50",
    height: "176-180 см",
    federation: null,
    description:
      "Новые тренировочные брюки для стандарта от Espen Salberg. Куплены в Лондоне, не подошёл размер (маломерят). Чёрные, прямого кроя, очень комфортная ткань с лёгким стрейчем. Идеальны для ежедневных тренировок. Отправлю в любой город.",
    posted_at: "2026-03-06T16:45:00Z",
    views: 53,
    seller: SELLERS[1],
  },
  {
    id: "7",
    title: "Костюм латина женский со стразами Swarovski",
    price: 85_000,
    image_url:
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=1000&fit=crop",
    ],
    category: "competition",
    condition: "new",
    program: "latin",
    gender: "woman",
    size: "S",
    height: "168-174 см",
    federation: "FTSARR",
    description:
      "Абсолютно новый конкурсный костюм для латины. Пошив на заказ в ателье Chrisanne (Лондон). Полностью расшит стразами Swarovski — около 3000 камней. Цвет — красно-чёрный градиент. Бахрома ручной работы. Создан для категории Взрослые по правилам ФТСАРР. Продаю, так как заказали два платья и выбрали другое. Торг уместен.",
    posted_at: "2026-03-09T08:00:00Z",
    views: 312,
    seller: SELLERS[2],
  },
  {
    id: "8",
    title: "Топ тренировочный для латины (девочка)",
    price: 2_900,
    image_url:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&h=1000&fit=crop",
    ],
    category: "practice",
    condition: "new",
    program: "latin",
    gender: "girl",
    size: "140",
    height: "134-140 см",
    federation: null,
    description:
      "Новый тренировочный топ для латины, подойдёт девочке 8-10 лет. Чёрный, с длинным рукавом, ткань — бифлекс. Хорошо тянется, не сковывает движения. Можно носить с юбкой или леггинсами. Покупали для дочки, но быстро выросла. Отправим из Казани.",
    posted_at: "2026-02-28T11:30:00Z",
    views: 41,
    seller: SELLERS[3],
  },
];

/* ──────────────────────────── Helpers ─────────────────────────── */

const LABEL: Record<string, string> = {
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

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function timeAgo(dateStr: string): string {
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

/* ─────────────────────── Filter sidebar ──────────────────────── */

interface FiltersState {
  category: Category;
  conditions: Condition[];
  programs: Program[];
  federations: Federation[];
  priceMin: string;
  priceMax: string;
  search: string;
}

const INITIAL_FILTERS: FiltersState = {
  category: "competition",
  conditions: [],
  programs: [],
  federations: [],
  priceMin: "",
  priceMax: "",
  search: "",
};

/* ──────────────────────────── Page ────────────────────────────── */

export default function MarketPage() {
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    if (selectedItem || mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem, mobileFiltersOpen]);

  const handleBack = useCallback(() => setSelectedItem(null), []);

  function toggleArrayFilter<T extends string>(
    key: "conditions" | "programs" | "federations",
    value: T,
  ) {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      if (item.category !== filters.category) return false;
      if (
        filters.conditions.length > 0 &&
        !filters.conditions.includes(item.condition)
      )
        return false;
      if (
        filters.programs.length > 0 &&
        !filters.programs.includes(item.program)
      )
        return false;
      if (
        filters.category === "competition" &&
        filters.federations.length > 0 &&
        item.federation &&
        !filters.federations.includes(item.federation)
      )
        return false;
      const min = filters.priceMin ? Number(filters.priceMin) : 0;
      const max = filters.priceMax ? Number(filters.priceMax) : Infinity;
      if (item.price < min || item.price > max) return false;
      if (
        filters.search &&
        !item.title.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters]);

  const resetFilters = () =>
    setFilters({ ...INITIAL_FILTERS, category: filters.category });

  function FilterControls() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Категория
          </h3>
          <div className="flex gap-1 rounded-xl bg-zinc-100 p-1">
            {(["competition", "practice"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    category: cat,
                    federations: [],
                  }))
                }
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  filters.category === cat
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {LABEL[cat]}
              </button>
            ))}
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Состояние
          </legend>
          <div className="space-y-2">
            {(["new", "used"] as const).map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50"
              >
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(c)}
                  onChange={() => toggleArrayFilter("conditions", c)}
                  className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-zinc-700">{LABEL[c]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Программа
          </legend>
          <div className="space-y-2">
            {(["standart", "latin"] as const).map((p) => (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50"
              >
                <input
                  type="checkbox"
                  checked={filters.programs.includes(p)}
                  onChange={() => toggleArrayFilter("programs", p)}
                  className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-zinc-700">{LABEL[p]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {filters.category === "competition" && (
          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Правила федерации
            </legend>
            <div className="space-y-2">
              {(["FTSARR", "RTS", "WDSF"] as const).map((f) => (
                <label
                  key={f}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.federations.includes(f)}
                    onChange={() => toggleArrayFilter("federations", f)}
                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-zinc-700">{LABEL[f]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Цена, ₽
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="От"
              value={filters.priceMin}
              onChange={(e) =>
                setFilters((p) => ({ ...p, priceMin: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <span className="text-zinc-300">—</span>
            <input
              type="number"
              placeholder="До"
              value={filters.priceMax}
              onChange={(e) =>
                setFilters((p) => ({ ...p, priceMax: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  /* ──────────────────────── Render ────────────────────────────── */

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-violet-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-500 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-fuchsia-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-zinc-300">
              Маркетплейс для бальных танцев
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-zinc-200 to-violet-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-6xl">
            ProDance Market
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-400 sm:mt-4 sm:text-lg">
            Премиальный маркетплейс для танцоров. Покупайте и продавайте
            тренировочную и турнирную одежду с умной системой фильтрации.
          </p>

          <div className="mx-auto mt-6 max-w-xl sm:mt-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Найти костюм, платье, фрак…"
                value={filters.search}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, search: e.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-zinc-500 outline-none backdrop-blur transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((p) => ({ ...p, search: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="lg:flex lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </div>
              <FilterControls />
            </div>
          </aside>

          {/* Mobile filter button */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
            >
              <Filter className="h-4 w-4" />
              Фильтры
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Mobile filter drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                    <SlidersHorizontal className="h-4 w-4" />
                    Фильтры
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterControls />
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                >
                  Показать {filteredItems.length}{" "}
                  {pluralize(filteredItems.length)}
                </button>
              </div>
            </div>
          )}

          {/* Product grid */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <p className="text-sm text-zinc-500">
                {filteredItems.length} {pluralize(filteredItems.length)}
              </p>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
                <Search className="mb-3 h-10 w-10 text-zinc-300" />
                <p className="text-lg font-medium text-zinc-400">
                  Ничего не найдено
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Попробуйте изменить параметры фильтрации
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onOpen={setSelectedItem}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Product detail fullscreen overlay ─────────── */}
      {selectedItem && (
        <ProductDetail item={selectedItem} onBack={handleBack} />
      )}
    </div>
  );
}

/* ──────────────────────── Product Card ────────────────────────── */

function ProductCard({
  item,
  onOpen,
}: {
  item: MarketItem;
  onOpen: (item: MarketItem) => void;
}) {
  return (
    <article
      onClick={() => onOpen(item)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg active:scale-[0.98] hover:-translate-y-0.5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs ${
            item.condition === "new"
              ? "bg-emerald-500/90 text-white"
              : "bg-white/90 text-zinc-700"
          }`}
        >
          {LABEL[item.condition]}
        </span>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-lg font-bold text-zinc-900 sm:text-xl">
          {formatPrice(item.price)}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-600 sm:mt-1 sm:text-sm">
          {item.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
          <Badge>{LABEL[item.program]}</Badge>
          <Badge>{item.size}</Badge>
          {item.federation && <Badge accent>{LABEL[item.federation]}</Badge>}
        </div>

        <p className="mt-2 text-[11px] text-zinc-400 sm:mt-3 sm:text-xs">
          {item.seller.city} · {timeAgo(item.posted_at)}
        </p>
      </div>
    </article>
  );
}

/* ──────────── Product Detail (fullscreen, mobile-first) ─────── */

function ProductDetail({
  item,
  onBack,
}: {
  item: MarketItem;
  onBack: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    setCurrentImage(0);
    setShowPhone(false);
  }, [item.id]);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto overscroll-contain">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 px-3 py-2 backdrop-blur-lg sm:px-6 sm:py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Назад</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLiked((p) => !p)}
            className={`rounded-full p-2 transition-colors active:scale-95 ${
              liked
                ? "text-rose-500"
                : "text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <Heart
              className="h-5 w-5"
              fill={liked ? "currentColor" : "none"}
            />
          </button>
          <button className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 active:scale-95">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image gallery */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 sm:aspect-[16/10] sm:max-h-[70vh]">
        <Image
          src={item.images[currentImage]}
          alt={item.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {item.images.length > 1 && (
          <>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {item.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImage
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
            {/* Tap zones for swipe-like behavior */}
            <button
              onClick={() =>
                setCurrentImage((p) =>
                  p > 0 ? p - 1 : item.images.length - 1,
                )
              }
              className="absolute inset-y-0 left-0 w-1/3"
              aria-label="Предыдущее фото"
            />
            <button
              onClick={() =>
                setCurrentImage((p) =>
                  p < item.images.length - 1 ? p + 1 : 0,
                )
              }
              className="absolute inset-y-0 right-0 w-1/3"
              aria-label="Следующее фото"
            />
          </>
        )}
        {/* Image counter */}
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {currentImage + 1} / {item.images.length}
        </span>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 pb-32 sm:px-6">
        {/* Price & title */}
        <div className="pt-4 sm:pt-6">
          <p className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            {formatPrice(item.price)}
          </p>
          <h1 className="mt-1 text-base font-medium text-zinc-800 sm:text-xl">
            {item.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400 sm:text-sm">
            <Calendar className="h-3.5 w-3.5" />
            <span>{timeAgo(item.posted_at)}</span>
            <span className="text-zinc-200">·</span>
            <MapPin className="h-3.5 w-3.5" />
            <span>{item.seller.city}</span>
            <span className="text-zinc-200">·</span>
            <span>{item.views} просм.</span>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
          <SpecCard
            icon={<Tag className="h-4 w-4" />}
            label="Состояние"
            value={LABEL[item.condition]}
          />
          <SpecCard
            icon={<Sparkles className="h-4 w-4" />}
            label="Программа"
            value={LABEL[item.program]}
          />
          <SpecCard
            icon={<Ruler className="h-4 w-4" />}
            label="Размер / Рост"
            value={`${item.size} · ${item.height}`}
          />
          <SpecCard
            icon={<User className="h-4 w-4" />}
            label="Для кого"
            value={LABEL[item.gender]}
          />
          {item.federation && (
            <SpecCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Федерация"
              value={LABEL[item.federation]}
              accent
            />
          )}
        </div>

        {/* Description */}
        <div className="mt-5 sm:mt-6">
          <h2 className="text-sm font-semibold text-zinc-800 sm:text-base">
            Описание
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600 sm:text-base">
            {item.description}
          </p>
        </div>

        {/* Divider */}
        <hr className="my-5 border-zinc-100 sm:my-6" />

        {/* Seller */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 sm:text-base">
            Продавец
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-100">
              <Image
                src={item.seller.avatar_url}
                alt={item.seller.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {item.seller.name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{item.seller.city}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400 sm:text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>На ProDance с {item.seller.registered}</span>
            </div>
            <span className="text-zinc-200">·</span>
            <span>
              {item.seller.listings_count}{" "}
              {pluralize(item.seller.listings_count, "объявление", "объявления", "объявлений")}
            </span>
          </div>
        </div>

        {/* Contact options (expanded, not in sticky bar — easier to reach on mobile) */}
        <div className="mt-5 space-y-2.5 sm:mt-6">
          {/* Phone */}
          {showPhone ? (
            <a
              href={`tel:${item.seller.phone.replace(/[\s()-]/g, "")}`}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 active:bg-zinc-700"
            >
              <Phone className="h-4 w-4" />
              {item.seller.phone}
            </a>
          ) : (
            <button
              onClick={() => setShowPhone(true)}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 active:bg-zinc-700"
            >
              <Phone className="h-4 w-4" />
              Показать телефон
            </button>
          )}

          {/* Telegram */}
          <a
            href={`https://t.me/${item.seller.telegram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#2AABEE] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#229ED9] active:bg-[#1a8ac2]"
          >
            <Send className="h-4 w-4" />
            Написать в Telegram
          </a>

          {/* Generic message */}
          <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100">
            <MessageCircle className="h-4 w-4" />
            Написать сообщение
          </button>
        </div>
      </div>

      {/* Sticky bottom CTA for mobile — quick access */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-lg sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-zinc-900">
              {formatPrice(item.price)}
            </p>
          </div>
          {showPhone ? (
            <a
              href={`tel:${item.seller.phone.replace(/[\s()-]/g, "")}`}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white active:bg-zinc-700"
            >
              <Phone className="h-4 w-4" />
              Позвонить
            </a>
          ) : (
            <a
              href={`https://t.me/${item.seller.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#2AABEE] px-5 py-3 text-sm font-semibold text-white active:bg-[#1a8ac2]"
            >
              <Send className="h-4 w-4" />
              Написать
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── SpecCard ────────────────────────────── */

function SpecCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        accent ? "bg-violet-50" : "bg-zinc-50"
      }`}
    >
      <div
        className={`mb-1 ${accent ? "text-violet-500" : "text-zinc-400"}`}
      >
        {icon}
      </div>
      <p className="text-[11px] text-zinc-400">{label}</p>
      <p
        className={`text-sm font-semibold ${
          accent ? "text-violet-700" : "text-zinc-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ──────────────────────── Badge ───────────────────────────────── */

function Badge({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-block rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:px-2 sm:text-xs ${
        accent
          ? "bg-violet-100 text-violet-700"
          : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {children}
    </span>
  );
}

/* ──────────────────────── Pluralize ──────────────────────────── */

function pluralize(n: number, one?: string, few?: string, many?: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  const w1 = one ?? "товар";
  const w2 = few ?? "товара";
  const w5 = many ?? "товаров";
  if (mod10 === 1 && mod100 !== 11) return w1;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return w2;
  return w5;
}
