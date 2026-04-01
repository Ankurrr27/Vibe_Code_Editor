"use client";

import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompilerLanguage } from "@/modules/compiler/types";

type CompilerToolbarProps = {
  isLoadingLanguages: boolean;
  isRunning: boolean;
  languages: CompilerLanguage[];
  selectedLanguageId: number | null;
  selectedLanguageName?: string;
  onLanguageChange: (value: string) => void;
  onRun: () => void;
};

export function CompilerToolbar({
  isLoadingLanguages,
  isRunning,
  languages,
  selectedLanguageId,
  selectedLanguageName,
  onLanguageChange,
  onRun,
}: CompilerToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-black/10 px-4 py-3 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#e93f3f] dark:border-white/10 dark:bg-zinc-900 dark:text-white"
          disabled={isLoadingLanguages}
          value={selectedLanguageId ?? ""}
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          {isLoadingLanguages ? (
            <option>Loading languages...</option>
          ) : (
            languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))
          )}
        </select>

        <Button
          type="button"
          variant="brand"
          className="h-11 rounded-xl px-5"
          disabled={isRunning || isLoadingLanguages}
          onClick={onRun}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run Code
        </Button>
      </div>

      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
        {selectedLanguageName ?? "Compiler"}
      </div>
    </div>
  );
}
