"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  ImagePlus,
  Video,
} from "lucide-react";
import type { Category, Condition, Program, Gender, Federation } from "../../lib/types";
import { LABEL } from "../../lib/types";
import { useAuth } from "../../lib/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/* ─── Photo picker state ─── */
interface PhotoFile {
  file: File;
  preview: string;
}

/* ─── Page ─── */

export default function CreateListingPage() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [authLoading, token, router]);

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("competition");
  const [condition, setCondition] = useState<Condition>("new");
  const [program, setProgram] = useState<Program>("latin");
  const [gender, setGender] = useState<Gender>("woman");
  const [size, setSize] = useState("");
  const [height, setHeight] = useState("");
  const [federation, setFederation] = useState<Federation | "">("");

  // Photo state
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video state (max 1)
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  /* ─── Photo handlers ─── */

  const isImageFile = useCallback((file: File) => {
    if (file.type.startsWith("image/")) return true;
    const ext = file.name.split(".").pop()?.toLowerCase();
    return ext === "heic" || ext === "heif";
  }, []);

  const addPhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    const next: PhotoFile[] = [];
    for (const file of Array.from(files)) {
      if (!isImageFile(file)) continue;
      if (photos.length + next.length >= 10) break;
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    setPhotos((p) => [...p, ...next]);
  }, [photos, isImageFile]);

  function removePhoto(index: number) {
    setPhotos((p) => {
      URL.revokeObjectURL(p[index].preview);
      return p.filter((_, i) => i !== index);
    });
  }

  /* ─── Drag & drop ─── */

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    addPhotos(e.dataTransfer.files);
  }

  /* ─── Video handlers ─── */

  function addVideo(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("video/")) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  function removeVideo() {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
  }

  /* ─── Submit ─── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("price", price);
    fd.append("category", category);
    fd.append("condition", condition);
    fd.append("program", program);
    fd.append("gender", gender);
    fd.append("size", size.trim());
    if (height.trim()) fd.append("height", height.trim());
    if (category === "competition" && federation) fd.append("federation", federation);
    if (description.trim()) fd.append("description", description.trim());
    photos.forEach((p) => fd.append("images", p.file));
    if (videoFile) fd.append("video", videoFile);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.detail ?? `Ошибка сервера: ${res.status}`);
      }

      const product = await res.json();
      setDone(true);
      router.push(`/market?highlight=${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    title.trim() &&
    price &&
    size.trim() &&
    photos.length > 0 &&
    !loading;

  /* ─── Loading / not authenticated ─── */

  if (authLoading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    );
  }

  /* ─── Success ─── */

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 pb-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Объявление опубликовано!</h1>
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

  /* ─── Form ─── */

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 sm:pb-8">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-lg sm:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1 text-zinc-600 active:bg-zinc-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-zinc-900">Новое объявление</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl px-4 pt-4 sm:px-6 sm:pt-8"
      >
        <h1 className="mb-6 hidden text-2xl font-bold text-zinc-900 sm:block">
          Новое объявление
        </h1>

        {/* ── Photo picker ── */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-zinc-500">
            Фотографии * (до 10 штук)
          </label>

          {/* Drop zone — shown only when fewer than 10 photos */}
          {photos.length < 10 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mb-3 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 bg-white transition-colors hover:border-violet-400 hover:bg-violet-50/30 active:bg-violet-50"
            >
              <Upload className="h-6 w-6 text-zinc-300" />
              <p className="text-xs text-zinc-400">
                Нажмите или перетащите фото
              </p>
              <p className="text-[11px] text-zinc-300">
                JPEG, PNG, WEBP, HEIC до 10 МБ
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
            multiple
            className="hidden"
            onChange={(e) => addPhotos(e.target.files)}
          />

          {/* Thumbnails */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div
                  key={p.preview}
                  className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm"
                >
                  <Image
                    src={p.preview}
                    alt={`Фото ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {/* Main photo badge */}
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-px text-[9px] font-semibold text-white">
                      Главное
                    </span>
                  )}
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Add more — compact */}
              {photos.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-200 text-zinc-300 transition-colors hover:border-violet-400 hover:text-violet-400"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px]">Добавить</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Video picker ── */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-zinc-500">
            Видео (необязательно, макс. 1)
          </label>

          {!videoFile ? (
            <div
              onClick={() => videoInputRef.current?.click()}
              className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 bg-white transition-colors hover:border-violet-400 hover:bg-violet-50/30 active:bg-violet-50"
            >
              <Video className="h-5 w-5 text-zinc-300" />
              <span className="text-xs text-zinc-400">Добавить видео</span>
              <span className="text-[11px] text-zinc-300">MP4, MOV, WEBM до 100 МБ</span>
            </div>
          ) : (
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900">
              <video
                src={videoPreview!}
                className="h-40 w-full object-contain"
                controls
                muted
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="px-3 py-1.5 text-xs text-zinc-400 truncate">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} МБ)
              </div>
            </div>
          )}

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
            className="hidden"
            onChange={(e) => addVideo(e.target.files)}
          />
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
            min={1}
            className="input-field"
          />
        </Field>

        {/* Category */}
        <Field label="Категория">
          <ToggleGroup
            options={[
              { value: "competition", label: "Турнирная" },
              { value: "practice", label: "Тренировочная" },
            ]}
            value={category}
            onChange={(v) => {
              setCategory(v as Category);
              setFederation("");
            }}
          />
        </Field>

        {/* Condition */}
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
              { value: "standard", label: "Стандарт" },
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
          <Field label="Рост">
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="164-170 см"
              className="input-field"
            />
          </Field>
        </div>

        {/* Federation */}
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
        <Field label="Описание">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Расскажите о состоянии, истории, особенностях. Укажите, готовы ли отправить или только самовывоз."
            className="input-field resize-none"
          />
        </Field>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Публикуем…
            </>
          ) : (
            "Опубликовать объявление"
          )}
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

/* ─── Helpers ─── */

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
