"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Loader2,
  Play,
  TerminalSquare,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner";

type CompilerLanguage = {
  id: number;
  name: string;
};

type CompilerResult = {
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  message: string;
  time: string;
  memory: number;
};

const compilerStarters: Array<{
  match: RegExp;
  code: string;
  monacoLanguage: string;
}> = [
  {
    match: /python/i,
    monacoLanguage: "python",
    code: `name = input().strip() or "VibeCode"\nprint(f"Hello, {name}!")`,
  },
  {
    match: /javascript|node/i,
    monacoLanguage: "javascript",
    code: `const fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\nconsole.log(\`Hello, \${input || "VibeCode"}!\`);`,
  },
  {
    match: /typescript/i,
    monacoLanguage: "typescript",
    code: `const name = "VibeCode";\nconsole.log(\`Hello, \${name}!\`);`,
  },
  {
    match: /java(?!script)/i,
    monacoLanguage: "java",
    code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, VibeCode!");\n  }\n}`,
  },
  {
    match: /c\+\+/i,
    monacoLanguage: "cpp",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, VibeCode!" << endl;\n  return 0;\n}`,
  },
  {
    match: /^c\s|c \(/i,
    monacoLanguage: "c",
    code: `#include <stdio.h>\n\nint main(void) {\n  printf("Hello, VibeCode!\\n");\n  return 0;\n}`,
  },
  {
    match: /go/i,
    monacoLanguage: "go",
    code: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, VibeCode!")\n}`,
  },
  {
    match: /rust/i,
    monacoLanguage: "rust",
    code: `fn main() {\n    println!("Hello, VibeCode!");\n}`,
  },
  {
    match: /php/i,
    monacoLanguage: "php",
    code: `<?php\n\necho "Hello, VibeCode!\\n";`,
  },
];

const defaultFallbackCode = `print("Hello, VibeCode!")`;

const getLanguagePreset = (languageName: string) =>
  compilerStarters.find((entry) => entry.match.test(languageName));

const getEditorFilename = (languageName?: string) => {
  const normalized = languageName?.toLowerCase() ?? "";

  if (normalized.includes("python")) return "main.py";
  if (normalized.includes("javascript") || normalized.includes("node")) {
    return "main.js";
  }
  if (normalized.includes("typescript")) return "main.ts";
  if (normalized.includes("java")) return "Main.java";
  if (normalized.includes("c++")) return "main.cpp";
  if (normalized === "c" || /^c\s|c \(/i.test(normalized)) return "main.c";
  if (normalized.includes("go")) return "main.go";
  if (normalized.includes("rust")) return "main.rs";
  if (normalized.includes("php")) return "index.php";

  return "main.txt";
};

export default function OnlineCompiler() {
  const [languages, setLanguages] = useState<CompilerLanguage[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(
    null,
  );
  const [sourceCode, setSourceCode] = useState(defaultFallbackCode);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<CompilerResult | null>(null);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "$ runtime ready",
    "> choose a language and run your code",
  ]);

  useEffect(() => {
    async function loadLanguages() {
      try {
        const response = await fetch("/api/compiler/languages");
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }

        const data = (await response.json()) as { languages: CompilerLanguage[] };
        setLanguages(data.languages);

        const preferredLanguage =
          data.languages.find((language) => /python/i.test(language.name)) ??
          data.languages.find((language) => /javascript|node/i.test(language.name)) ??
          data.languages[0];

        if (preferredLanguage) {
          setSelectedLanguageId(preferredLanguage.id);
          setSourceCode(
            getLanguagePreset(preferredLanguage.name)?.code ?? defaultFallbackCode,
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load compiler languages",
        );
      } finally {
        setIsLoadingLanguages(false);
      }
    }

    void loadLanguages();
  }, []);

  const selectedLanguage = useMemo(
    () => languages.find((language) => language.id === selectedLanguageId) ?? null,
    [languages, selectedLanguageId],
  );

  const monacoLanguage =
    (selectedLanguage && getLanguagePreset(selectedLanguage.name)?.monacoLanguage) ||
    "plaintext";

  const handleLanguageChange = (value: string) => {
    const nextId = Number(value);
    const nextLanguage = languages.find((language) => language.id === nextId);
    setSelectedLanguageId(nextId);
    setSourceCode(
      getLanguagePreset(nextLanguage?.name ?? "")?.code ??
        "// Write your code here",
    );
    setResult(null);
    setTerminalLines([
      "$ runtime ready",
      `> language switched to ${nextLanguage?.name ?? "unknown"}`,
    ]);
  };

  const handleRun = async () => {
    if (!selectedLanguageId || !sourceCode.trim()) {
      toast.error("Choose a language and add some code first");
      return;
    }

    try {
      setIsRunning(true);
      setTerminalLines((prev) => [
        ...prev,
        "$ run submission",
        `> booting ${selectedLanguage?.name ?? "selected language"} runtime`,
      ]);
      const response = await fetch("/api/compiler/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          languageId: selectedLanguageId,
          sourceCode,
          stdin,
        }),
      });

      const data = (await response.json()) as CompilerResult & {
        error?: string;
        details?: string;
      };

      if (!response.ok) {
        throw new Error(data.details || data.error || "Execution failed");
      }

      setResult(data);
      setTerminalLines((prev) => [
        ...prev,
        data.stderr || data.compileOutput || data.message
          ? "> execution finished with warnings"
          : "> execution finished successfully",
        `> status: ${data.status}`,
        ...(data.time ? [`> time: ${data.time}s`] : []),
        ...(data.memory ? [`> memory: ${data.memory} KB`] : []),
      ]);
      toast.success("Execution finished");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to execute code";
      setResult({
        status: "Execution failed",
        stdout: "",
        stderr: message,
        compileOutput: "",
        message,
        time: "",
        memory: 0,
      });
      setTerminalLines((prev) => [...prev, `> error: ${message}`]);
      toast.error(message);
    } finally {
      setIsRunning(false);
    }
  };

  const outputText =
    result?.stdout?.trim() || "Program output will appear here.";
  const errorText =
    result?.stderr?.trim() ||
    result?.compileOutput?.trim() ||
    result?.message?.trim() ||
    "No compiler or runtime errors.";
  const metaText = result
    ? `Status : ${result.status}\nTime   : ${result.time || "n/a"}\nMemory : ${
        result.memory ? `${result.memory} KB` : "n/a"
      }`
    : "Run your code to inspect execution details.";
  const hasErrors = Boolean(
    result?.stderr || result?.compileOutput || result?.message,
  );

  return (
    <div className="flex h-[calc(100vh-4.5rem)] w-full flex-col">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-zinc-950/85">
        <div className="flex flex-col gap-4 border-b border-black/10 px-4 py-3 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#e93f3f] dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              disabled={isLoadingLanguages}
              value={selectedLanguageId ?? ""}
              onChange={(event) => handleLanguageChange(event.target.value)}
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
              className="h-11 rounded-2xl px-5"
              disabled={isRunning || isLoadingLanguages}
              onClick={handleRun}
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
            {selectedLanguage?.name ?? "Compiler"}
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={54} minSize={42}>
            <div className="flex h-full flex-col border-r border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2">
                    {selectedLanguage?.name ?? "Editor"}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  {getEditorFilename(selectedLanguage?.name)}
                </div>
              </div>

              <div className="flex-1 overflow-hidden bg-[#0b1020]">
                <Editor
                  height="100%"
                  language={monacoLanguage}
                  theme="vs-dark"
                  value={sourceCode}
                  onChange={(value) => setSourceCode(value ?? "")}
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
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={46} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={55} minSize={32}>
                <div className="flex h-full flex-col border-b border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#e93f3f]/10 p-2 text-[#e93f3f]">
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
                      {result?.status ?? "Idle"}
                    </div>
                  </div>

                  <div className="flex-1 bg-[#07101d] text-zinc-100">
                    <pre className="h-full whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-6">
{hasErrors ? errorText : outputText}
                    </pre>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={45} minSize={25}>
                <div className="grid h-full grid-rows-[auto_auto_1fr]">
                  <div className="border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#e93f3f]/10 p-2 text-[#e93f3f]">
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
                      onChange={(event) => setStdin(event.target.value)}
                      className="min-h-24 rounded-xl border-black/10 bg-white/80 text-sm dark:border-white/10 dark:bg-zinc-900/80"
                      placeholder="Example:&#10;5&#10;1 2 3 4 5"
                    />
                  </div>

                  <div className="bg-[#050b16] text-zinc-100">
                    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                      <span className="rounded-full border border-white/10 px-2 py-1">
                        session
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ChevronRight className="h-3 w-3" />
                        {selectedLanguage?.name ?? "runtime"}
                      </span>
                    </div>

                    <pre className="h-full min-h-[190px] whitespace-pre-wrap break-words border-t border-white/10 px-4 py-4 font-mono text-sm leading-6 text-zinc-200">
{[...terminalLines, "", metaText].join("\n")}
                    </pre>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
