import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";
import { SearchInput } from "./components/SearchInput";
import { MarketFilters } from "./components/MarketFilters";
import { ProductGrid } from "./components/ProductGrid";
import { pluralize, type ProductListResponse } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function fetchProducts(
  params: Record<string, string | string[] | undefined>,
): Promise<ProductListResponse> {
  try {
    const url = new URL(`${API_URL}/products`);

    const category = params.category ?? "competition";
    url.searchParams.set("category", String(category));

    for (const key of ["condition", "program", "federation"] as const) {
      const val = params[key];
      if (val) {
        (Array.isArray(val) ? val : [val]).forEach((v) =>
          url.searchParams.append(key, v),
        );
      }
    }

    if (params.price_min) url.searchParams.set("price_min", String(params.price_min));
    if (params.price_max) url.searchParams.set("price_max", String(params.price_max));
    if (params.search) url.searchParams.set("search", String(params.search));
    url.searchParams.set("limit", "50");

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return { items: [], total: 0, page: 1, limit: 50 };
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MarketPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await fetchProducts(params);

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 sm:pb-0">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-violet-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-500 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-fuchsia-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-zinc-300">
              Маркетплейс для бальных танцев
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-zinc-200 to-violet-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
            ProDance Market
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400 sm:mt-3 sm:text-base">
            Покупайте и продавайте тренировочную и турнирную одежду с умной
            системой фильтрации.
          </p>

          <Suspense>
            <SearchInput />
          </Suspense>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="lg:flex lg:gap-8">
          <Suspense>
            <MarketFilters total={data.total} />
          </Suspense>

          {/* Product grid */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <p className="text-sm text-zinc-500">
                {data.total} {pluralize(data.total)}
              </p>
              <Link
                href="/market/create"
                className="hidden items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 lg:inline-flex"
              >
                <Plus className="h-4 w-4" />
                Продать
              </Link>
            </div>

            <ProductGrid items={data.items} />
          </section>
        </div>
      </main>
    </div>
  );
}
