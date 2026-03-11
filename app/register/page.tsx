"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Phone,
  Lock,
  User,
  MapPin,
  Send,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [telegram, setTelegram] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/profile");
    }
  }, [authLoading, user, router]);

  const canSubmit = name.trim() && phone.trim() && password.trim().length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setError(null);
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        phone_number: phone.trim(),
        password,
        city: city.trim() || undefined,
        telegram: telegram.trim() || undefined,
      });
      router.replace("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-4 pb-24 pt-10 sm:items-center sm:pt-0">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200">
            <Store className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Регистрация</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Создайте аккаунт ProDance Market
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Имя <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Елена Волкова"
                  autoComplete="name"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Телефон <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Пароль <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-11 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && password.length < 6 && (
                <p className="mt-1 text-[11px] text-red-500">
                  Пароль должен содержать не менее 6 символов
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-100" />
              <span className="text-xs text-zinc-400">необязательно</span>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>

            {/* City */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Город
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Москва"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Telegram */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">
                Telegram
              </label>
              <div className="relative">
                <Send className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Регистрируем…
                </>
              ) : (
                "Создать аккаунт"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-zinc-500">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
