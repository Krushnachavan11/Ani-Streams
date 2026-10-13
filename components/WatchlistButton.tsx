"use client";

import { useEffect, useState } from "react";
import { isInWatchlist, toggleWatchlist, type WatchlistItem } from "@/lib/storage";

export default function WatchlistButton({ item }: { item: WatchlistItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(item.slug));
  }, [item.slug]);

  return (
    <button
      onClick={() => setSaved(toggleWatchlist(item))}
      className={`rounded-full px-6 py-2.5 text-sm font-semibold ${
        saved ? "bg-white/20 hover:bg-white/30" : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {saved ? "✓ In My List" : "+ My List"}
    </button>
  );
}