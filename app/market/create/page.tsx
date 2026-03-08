"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ImagePlus,
  Check,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../../lib/store";
import type {
  Category,
  Condition,
  Program,
  Gender,
  Federation,
  MarketItem,
} from "../../lib/types";
import { LABEL } from "../../lib/types";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop",
];

export default function CreateListingPage() {
  const router = useRouter();
  const { user, addItem } = useStore();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("competition");
  const [condition, setCondition] = useState<Condition>("new");
  const [program, setProgram] = useState<Program>("latin");
  const [gender, setGender] = useState<Gender>("woman");
  const [size, setSize] = useState("");
  const [height, setHeight] = useState("");
  const [federation, setFederation] = useState<Federation | "">("FTSARR");
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 pb-20 text-center">
        <AlertCircle className="mb-3 h-12 w-12 text-zinc-300" />
        <h1 className="text-lg font-bold text-zinc-800">
          Необходимо войти
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Чтобы создать объявление, заполните профиль
        </p>
        <Link
          href="/profile"
          className="mt-4 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Перейти в профиль
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 pb-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">
          Объявление опубликовано!
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Теперь его видят все пользователи ProDance Market
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/market"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            В каталог
          </Link>
          <Link
            href="/profile"
            className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Мои объявления
          </Link>
        </div>
      </div>
    );
  }

  const canSubmit =
    title.trim() && price && description.trim() && size.trim() && height.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !user) return;

    const img =
      PLACEHOLDER_IMAGES[
        Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)
      ];

    const item: MarketItem = {
      id: `user_${Date.now()}`,
      title: title.trim(),
      price: Number(price),
      image_url: img,
      images: [img.replace("w=600&h=800", "w=800&h=1000")],
      category,
      condition,
      program,
      gender,
      size: size.trim(),
      height: height.trim(),
      federation: category === "competition" && federation ? federation : null,
      description: description.trim(),
      posted_at: new Date().toISOString(),
      views: 0,
      seller: {
        name: user.name,
        city: user.city,
        phone: user.phone,
        telegram: user.telegram,
        avatar_url: user.avatar_url,
        registered: user.registered,
        listings_count: 0,
      },
    };

    addItem(item);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 sm:pb-8">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-lg sm:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1 text-zinc-600 active:bg-zinc-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-zinc-900">
            Новое объявление
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl px-4 pt-4 sm:px-6 sm:pt-8"
      >
        <h1 className="mb-6 hidden text-2xl font-bold text-zinc-900 sm:block">
          Новое объявление
        </h1>

        {/* Photo placeholder */}
        <div className="mb-5 flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white transition-colors">
          <div className="text-center">
            <ImagePlus className="mx-auto mb-1 h-8 w-8 text-zinc-300" />
            <p className="text-xs text-zinc-400">
              Фото (скоро)
            </p>
          </div>
        </div>

        {/* Title */}
        <Field label="Название *">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Платье для латины Chrisanne"
            className="input-field"
          />
        </Field>

        {/* Price */}
        <Field label="Цена, ₽ *">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45000"
            inputMode="numeric"
            className="input-field"
          />
        </Field>

        {/* Category toggle */}
        <Field label="Категория">
          <ToggleGroup
            options={[
              { value: "competition", label: "Турнирная" },
              { value: "practice", label: "Тренировочная" },
            ]}
            value={category}
            onChange={(v) => setCategory(v as Category)}
          />
        </Field>

        {/* Condition toggle */}
        <Field label="Состояние">
          <ToggleGroup
            options={[
              { value: "new", label: "Новое" },
              { value: "used", label: "Б/У" },
            ]}
            value={condition}
            onChange={(v) => setCondition(v as Condition)}
          />
        </Field>

        {/* Program */}
        <Field label="Программа">
          <ToggleGroup
            options={[
              { value: "latin", label: "Латина" },
              { value: "standart", label: "Стандарт" },
            ]}
            value={program}
            onChange={(v) => setProgram(v as Program)}
          />
        </Field>

        {/* Gender */}
        <Field label="Для кого">
          <div className="grid grid-cols-4 gap-2">
            {(["woman", "man", "girl", "boy"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`rounded-xl py-2.5 text-xs font-medium transition-all ${
                  gender === g
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 active:bg-zinc-200"
                }`}
              >
                {LABEL[g]}
              </button>
            ))}
          </div>
        </Field>

        {/* Size & Height */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Размер *">
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="S / 42 / 152"
              className="input-field"
            />
          </Field>
          <Field label="Рост *">
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="164-170 см"
              className="input-field"
            />
          </Field>
        </div>

        {/* Federation (only competition) */}
        {category === "competition" && (
          <Field label="Правила федерации">
            <div className="grid grid-cols-3 gap-2">
              {(["FTSARR", "RTS", "WDSF"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFederation(federation === f ? "" : f)}
                  className={`rounded-xl py-2.5 text-xs font-medium transition-all ${
                    federation === f
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 active:bg-zinc-200"
                  }`}
                >
                  {LABEL[f]}
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Description */}
        <Field label="Описание *">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Расскажите о состоянии, истории, особенностях вещи. Укажите, готовы ли отправить или только самовывоз."
            className="input-field resize-none"
          />
        </Field>

        {/* Seller info preview */}
        <div className="mb-5 rounded-2xl bg-violet-50 p-4">
          <p className="text-xs font-medium text-violet-600">
            Контакты из вашего профиля
          </p>
          <p className="mt-1 text-sm text-violet-900">
            {user.name} · {user.city}
          </p>
          <p className="text-sm text-violet-700">{user.phone}</p>
          {user.telegram && (
            <p className="text-sm text-violet-700">{user.telegram}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-2xl bg-zinc-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-violet-600 disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          Опубликовать объявление
        </button>

        <style jsx>{`
          .input-field {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid #e4e4e7;
            background: white;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
          }
          .input-field:focus {
            border-color: #a78bfa;
            box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
          }
          .input-field::placeholder {
            color: #a1a1aa;
          }
        `}</style>
      </form>
    </div>
  );
}

/* ───────────────────── Helpers ────────────────────────────────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            value === opt.value
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-zinc-100 text-zinc-600 active:bg-zinc-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
