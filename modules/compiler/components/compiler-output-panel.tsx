"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CompilerOutputPanelProps = {
  hasErrors: boolean;
  outputText: string;
  errorText: string;
  status?: string;
};

export function CompilerOutputPanel({
  hasErrors,
  outputText,
  errorText,
  status,
}: CompilerOutputPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col border-b border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#e93f3f]/10 p-2 text-[#e93f3f]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              Output
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Program result
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
            hasErrors
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-300"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
          )}
        >
          {hasErrors ? (
            <CircleAlert className="h-3.5 w-3.5" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {status ?? "Idle"}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#07101d] text-zinc-100">
        <pre className="min-h-full whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-6">
          {hasErrors ? errorText : outputText}
        </pre>
      </div>
    </div>
  );
}
