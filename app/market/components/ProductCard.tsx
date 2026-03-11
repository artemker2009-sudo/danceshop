import Image from "next/image";
import { LABEL, formatPrice, timeAgo, type MarketItem } from "../../lib/types";

export function ProductCard({
  item,
  onClick,
}: {
  item: MarketItem;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
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
          {item.seller.city} · {timeAgo(item.created_at)}
        </p>
      </div>
    </article>
  );
}

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
