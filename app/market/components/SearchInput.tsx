"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const DEBOUNCE_MS = 400;

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  const pushURL = useCallback(
    (v: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (v) {
        params.set("search", v);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushURL(v), DEBOUNCE_MS);
  }

  function handleClear() {
    setValue("");
    clearTimeout(timerRef.current);
    pushURL("");
  }

  return (
    <div className="mx-auto mt-5 max-w-xl sm:mt-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Найти костюм, платье, фрак…"
          value={value}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-zinc-500 outline-none backdrop-blur transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:py-3.5"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
