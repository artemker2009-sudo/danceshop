"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Filter,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import {
  LABEL,
  pluralize,
  type Category,
  type Condition,
  type Program,
  type Federation,
} from "../../lib/types";

export function MarketFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const category: Category =
    (searchParams.get("category") as Category) || "competition";
  const conditions = searchParams.getAll("condition") as Condition[];
  const programs = searchParams.getAll("program") as Program[];
  const federations = searchParams.getAll("federation") as Federation[];
  const priceMin = searchParams.get("price_min") ?? "";
  const priceMax = searchParams.get("price_max") ?? "";

  const push = useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  function setCategory(cat: Category) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("category", cat);
    p.delete("federation");
    push(p);
  }

  function toggleArray(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    const cur = p.getAll(key);
    p.delete(key);
    if (cur.includes(value)) {
      cur.filter((v) => v !== value).forEach((v) => p.append(key, v));
    } else {
      [...cur, value].forEach((v) => p.append(key, v));
    }
    push(p);
  }

  function setPrice(key: "price_min" | "price_max", value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    push(p);
  }

  function resetFilters() {
    const p = new URLSearchParams();
    p.set("category", category);
    const search = searchParams.get("search");
    if (search) p.set("search", search);
    push(p);
  }

  function FilterControls() {
    return (
      <div className="space-y-6">
        {/* Категория */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Категория
          </h3>
          <div className="flex gap-1 rounded-xl bg-zinc-100 p-1">
            {(["competition", "practice"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {LABEL[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Состояние */}
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
                  checked={conditions.includes(c)}
                  onChange={() => toggleArray("condition", c)}
                  className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-zinc-700">{LABEL[c]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Программа */}
        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Программа
          </legend>
          <div className="space-y-2">
            {(["standard", "latin"] as const).map((p) => (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50"
              >
                <input
                  type="checkbox"
                  checked={programs.includes(p)}
                  onChange={() => toggleArray("program", p)}
                  className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-zinc-700">{LABEL[p]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Федерация */}
        {category === "competition" && (
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
                    checked={federations.includes(f)}
                    onChange={() => toggleArray("federation", f)}
                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-zinc-700">{LABEL[f]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* Цена */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Цена, ₽
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="От"
              value={priceMin}
              onChange={(e) => setPrice("price_min", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <span className="text-zinc-300">—</span>
            <input
              type="number"
              placeholder="До"
              value={priceMax}
              onChange={(e) => setPrice("price_max", e.target.value)}
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-zinc-800">
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
          </div>
          <FilterControls />
        </div>
      </aside>

      {/* Mobile filter button */}
      <div className="mb-4 flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          <Filter className="h-4 w-4" />
          Фильтры
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>
        <Link
          href="/market/create"
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Продать
        </Link>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterControls />
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              Показать {total} {pluralize(total)}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
