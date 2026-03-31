"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "vibecode-footer-view-count";

export default function SiteViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const nextViews = storedValue ? Number(storedValue) + 1 : 1;

    window.localStorage.setItem(STORAGE_KEY, String(nextViews));
    const frame = window.requestAnimationFrame(() => {
      setViews(nextViews);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
      <Eye className="h-3.5 w-3.5 text-[#e93f3f]" />
      <span>
        {views === null ? "Loading views..." : `${views.toLocaleString()} footer views`}
      </span>
    </div>
  );
}
