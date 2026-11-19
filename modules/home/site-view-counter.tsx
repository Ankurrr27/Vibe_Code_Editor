"use client";

import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

const SiteViewsContext = createContext<number | null>(null);

export function SiteViewProvider({ children }: { children: ReactNode }) {
  const [views, setViews] = useState<number | null>(null);
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    let active = true;

    const recordView = async () => {
      try {
        const response = await fetch("/api/views", {
          method: "POST",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`View counter request failed (${response.status})`);
        }

        const result: unknown = await response.json();
        if (
          !result ||
          typeof result !== "object" ||
          !("views" in result) ||
          typeof result.views !== "number"
        ) {
          throw new Error("View counter returned an invalid response");
        }

        if (active) setViews(result.views);
      } catch {
        if (active) setViews(null);
      }
    };

    void recordView();
    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <SiteViewsContext.Provider value={views}>
      {children}
    </SiteViewsContext.Provider>
  );
}

export default function SiteViewCounter() {
  const views = useContext(SiteViewsContext);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
      <Eye className="h-3.5 w-3.5 text-[#e93f3f]" />
      <span>
        {views === null ? "Views unavailable" : `${views.toLocaleString()} site views`}
      </span>
    </div>
  );
}
