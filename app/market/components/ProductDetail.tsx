"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Heart,
  Share2,
  Calendar,
  MapPin,
  User,
  Clock,
  Phone,
  Send,
  MessageCircle,
  Tag,
  Sparkles,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import {
  LABEL,
  formatPrice,
  timeAgo,
  formatMonthYear,
  type MarketItem,
} from "../../lib/types";

export function ProductDetail({
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 px-3 py-2 backdrop-blur-lg sm:px-6 sm:py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">Назад</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLiked((p) => !p)}
            className={`rounded-full p-2 transition-colors active:scale-95 ${
              liked ? "text-rose-500" : "text-zinc-400 hover:bg-zinc-100"
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
          src={item.images[currentImage] ?? item.image_url}
          alt={item.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {item.images.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {item.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImage ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
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
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {currentImage + 1} / {item.images.length}
        </span>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 pb-32 sm:px-6">
        <div className="pt-4 sm:pt-6">
          <p className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            {formatPrice(item.price)}
          </p>
          <h1 className="mt-1 text-base font-medium text-zinc-800 sm:text-xl">
            {item.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400 sm:text-sm">
            <Calendar className="h-3.5 w-3.5" />
            <span>{timeAgo(item.created_at)}</span>
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
            value={`${item.size}${item.height ? ` · ${item.height}` : ""}`}
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
        {item.description && (
          <div className="mt-5 sm:mt-6">
            <h2 className="text-sm font-semibold text-zinc-800 sm:text-base">
              Описание
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600 sm:text-base">
              {item.description}
            </p>
          </div>
        )}

        <hr className="my-5 border-zinc-100 sm:my-6" />

        {/* Seller */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 sm:text-base">
            Продавец
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-100">
              {item.seller.avatar_url ? (
                <Image
                  src={item.seller.avatar_url}
                  alt={item.seller.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-violet-100 text-lg font-bold text-violet-600">
                  {item.seller.name.charAt(0)}
                </div>
              )}
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
              <span>На ProDance с {formatMonthYear(item.seller.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="mt-5 space-y-2.5 sm:mt-6">
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

          {item.seller.telegram && (
            <a
              href={`https://t.me/${item.seller.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#2AABEE] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#229ED9] active:bg-[#1a8ac2]"
            >
              <Send className="h-4 w-4" />
              Написать в Telegram
            </a>
          )}

          <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100">
            <MessageCircle className="h-4 w-4" />
            Написать сообщение
          </button>
        </div>
      </div>

      {/* Sticky bottom CTA mobile */}
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
              href={
                item.seller.telegram
                  ? `https://t.me/${item.seller.telegram.replace("@", "")}`
                  : "#"
              }
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
      className={`rounded-xl p-3 ${accent ? "bg-violet-50" : "bg-zinc-50"}`}
    >
      <div className={`mb-1 ${accent ? "text-violet-500" : "text-zinc-400"}`}>
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
