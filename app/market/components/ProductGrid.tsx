"use client";

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { type MarketItem } from "../../lib/types";
import { ProductCard } from "./ProductCard";
import { ProductDetail } from "./ProductDetail";

export function ProductGrid({ items }: { items: MarketItem[] }) {
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  const handleBack = useCallback(() => setSelectedItem(null), []);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
        <Search className="mb-3 h-10 w-10 text-zinc-300" />
        <p className="text-lg font-medium text-zinc-400">Ничего не найдено</p>
        <p className="mt-1 text-sm text-zinc-400">
          Попробуйте изменить параметры фильтрации
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <ProductDetail item={selectedItem} onBack={handleBack} />
      )}
    </>
  );
}
