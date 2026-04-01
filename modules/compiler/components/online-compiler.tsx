"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CompilerEditorPanel } from "@/modules/compiler/components/compiler-editor-panel";
import { CompilerOutputPanel } from "@/modules/compiler/components/compiler-output-panel";
import { CompilerTerminalPanel } from "@/modules/compiler/components/compiler-terminal-panel";
import { CompilerToolbar } from "@/modules/compiler/components/compiler-toolbar";
import { useOnlineCompiler } from "@/modules/compiler/hooks/use-online-compiler";
import { getEditorFilename } from "@/modules/compiler/lib/presets";

export default function OnlineCompiler() {
  const {
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
  } = useOnlineCompiler();

  return (
    <div className="flex h-[calc(100vh-4.5rem)] min-h-0 w-full flex-col">
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-zinc-950/85">
        <CompilerToolbar
          isLoadingLanguages={isLoadingLanguages}
          isRunning={isRunning}
          languages={languages}
          selectedLanguageId={selectedLanguageId}
          selectedLanguageName={selectedLanguage?.name}
          onLanguageChange={handleLanguageChange}
          onRun={handleRun}
        />

        <ResizablePanelGroup
          direction="horizontal"
          className="h-full min-h-0 w-full"
        >
          <ResizablePanel defaultSize={54} minSize={42}>
            <CompilerEditorPanel
              filename={getEditorFilename(selectedLanguage?.name)}
              language={monacoLanguage}
              selectedLanguageName={selectedLanguage?.name}
              sourceCode={sourceCode}
              onChange={setSourceCode}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={46} minSize={30}>
            <ResizablePanelGroup direction="vertical" className="min-h-0">
              <ResizablePanel defaultSize={55} minSize={32}>
                <CompilerOutputPanel
                  hasErrors={hasErrors}
                  outputText={outputText}
                  errorText={errorText}
                  status={result?.status}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={45} minSize={25}>
                <CompilerTerminalPanel
                  metaText={metaText}
                  selectedLanguageName={selectedLanguage?.name}
                  stdin={stdin}
                  terminalLines={terminalLines}
                  onStdinChange={setStdin}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
