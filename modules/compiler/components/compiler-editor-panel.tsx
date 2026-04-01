"use client";

import Editor from "@monaco-editor/react";

type CompilerEditorPanelProps = {
  filename: string;
  language: string;
  selectedLanguageName?: string;
  sourceCode: string;
  onChange: (value: string) => void;
};

export function CompilerEditorPanel({
  filename,
  language,
  selectedLanguageName,
  sourceCode,
  onChange,
}: CompilerEditorPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col border-r border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {selectedLanguageName ?? "Editor"}
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          {filename}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-[#0b1020]">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={sourceCode}
          onChange={(value) => onChange(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
}
