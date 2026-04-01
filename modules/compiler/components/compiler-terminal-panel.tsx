"use client";

import { ChevronRight, TerminalSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type CompilerTerminalPanelProps = {
  metaText: string;
  selectedLanguageName?: string;
  stdin: string;
  terminalLines: string[];
  onStdinChange: (value: string) => void;
};

export function CompilerTerminalPanel({
  metaText,
  selectedLanguageName,
  stdin,
  terminalLines,
  onStdinChange,
}: CompilerTerminalPanelProps) {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr]">
      <div className="border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#e93f3f]/10 p-2 text-[#e93f3f]">
            <TerminalSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              Terminal
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Execution log and standard input
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/60">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Standard Input
        </label>
        <Textarea
          value={stdin}
          onChange={(event) => onStdinChange(event.target.value)}
          className="min-h-24 rounded-xl border-black/10 bg-white/80 text-sm dark:border-white/10 dark:bg-zinc-900/80"
          placeholder="Example:&#10;5&#10;1 2 3 4 5"
        />
      </div>

      <div className="flex min-h-0 flex-col bg-[#050b16] text-zinc-100">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-zinc-500">
          <span className="rounded-full border border-white/10 px-2 py-1">
            session
          </span>
          <span className="inline-flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {selectedLanguageName ?? "runtime"}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <pre className="min-h-full whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-6 text-zinc-200">
            {[...terminalLines, "", metaText].join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
