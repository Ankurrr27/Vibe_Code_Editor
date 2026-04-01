"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  defaultFallbackCode,
  getLanguagePreset,
} from "@/modules/compiler/lib/presets";
import {
  CompilerLanguage,
  CompilerResult,
} from "@/modules/compiler/types";

const initialTerminalLines = [
  "$ runtime ready",
  "> choose a language and run your code",
];

export function useOnlineCompiler() {
  const [languages, setLanguages] = useState<CompilerLanguage[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(
    null,
  );
  const [sourceCode, setSourceCode] = useState(defaultFallbackCode);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<CompilerResult | null>(null);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] =
    useState<string[]>(initialTerminalLines);

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
          data.languages.find((language) =>
            /javascript|node/i.test(language.name),
          ) ??
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

  return {
    errorText,
    handleLanguageChange,
    handleRun,
    hasErrors,
    isLoadingLanguages,
    isRunning,
    languages,
    metaText,
    monacoLanguage,
    outputText,
    result,
    selectedLanguage,
    selectedLanguageId,
    setSourceCode,
    setStdin,
    sourceCode,
    stdin,
    terminalLines,
  };
}
