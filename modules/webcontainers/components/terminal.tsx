"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SearchAddon } from "@xterm/addon-search";
import "@xterm/xterm/css/xterm.css";
import type { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: WebContainer | null;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
}

const terminalThemes = {
  dark: {
    background: "#09090B",
    foreground: "#FAFAFA",
    cursor: "#FAFAFA",
    cursorAccent: "#09090B",
    selection: "#27272A",
    black: "#18181B",
    red: "#EF4444",
    green: "#22C55E",
    yellow: "#EAB308",
    blue: "#3B82F6",
    magenta: "#A855F7",
    cyan: "#06B6D4",
    white: "#F4F4F5",
    brightBlack: "#3F3F46",
    brightRed: "#F87171",
    brightGreen: "#4ADE80",
    brightYellow: "#FDE047",
    brightBlue: "#60A5FA",
    brightMagenta: "#C084FC",
    brightCyan: "#22D3EE",
    brightWhite: "#FFFFFF",
  },
  light: {
    background: "#FFFFFF",
    foreground: "#18181B",
    cursor: "#18181B",
    cursorAccent: "#FFFFFF",
    selection: "#E4E4E7",
    black: "#18181B",
    red: "#DC2626",
    green: "#16A34A",
    yellow: "#CA8A04",
    blue: "#2563EB",
    magenta: "#9333EA",
    cyan: "#0891B2",
    white: "#F4F4F5",
    brightBlack: "#71717A",
    brightRed: "#EF4444",
    brightGreen: "#22C55E",
    brightYellow: "#EAB308",
    brightBlue: "#3B82F6",
    brightMagenta: "#A855F7",
    brightCyan: "#06B6D4",
    brightWhite: "#FAFAFA",
  },
} as const;

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(
  ({ className, theme = "dark", webContainerInstance }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<Terminal | null>(null);
    const fitAddon = useRef<FitAddon | null>(null);
    const searchAddon = useRef<SearchAddon | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const currentLine = useRef("");
    const cursorPosition = useRef(0);
    const commandHistory = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const currentProcess = useRef<WebContainerProcess | null>(null);
    const shellProcess = useRef<WebContainerProcess | null>(null);

    const writePrompt = useCallback(() => {
      if (term.current) {
        term.current.write("\r\n$ ");
        currentLine.current = "";
        cursorPosition.current = 0;
      }
    }, []);

    const clearTerminal = useCallback(() => {
      if (term.current) {
        term.current.clear();
        term.current.writeln("WebContainer Terminal");
        writePrompt();
      }
    }, [writePrompt]);

    useImperativeHandle(
      ref,
      () => ({
        writeToTerminal: (data: string) => {
          term.current?.write(data);
        },
        clearTerminal,
        focusTerminal: () => {
          term.current?.focus();
        },
      }),
      [clearTerminal],
    );

    const executeCommand = useCallback(
      async (command: string) => {
        if (!webContainerInstance || !term.current) return;

        if (
          command.trim() &&
          commandHistory.current[commandHistory.current.length - 1] !== command
        ) {
          commandHistory.current.push(command);
        }
        historyIndex.current = -1;

        try {
          if (command.trim() === "clear") {
            clearTerminal();
            return;
          }

          if (command.trim() === "history") {
            commandHistory.current.forEach((cmd, index) => {
              term.current?.writeln(`  ${index + 1}  ${cmd}`);
            });
            writePrompt();
            return;
          }

          if (command.trim() === "") {
            writePrompt();
            return;
          }

          const parts = command.trim().split(" ");
          const cmd = parts[0];
          const args = parts.slice(1);

          term.current.writeln("");
          const process = await webContainerInstance.spawn(cmd, args, {
            terminal: {
              cols: term.current.cols,
              rows: term.current.rows,
            },
          });

          currentProcess.current = process;

          process.output.pipeTo(
            new WritableStream({
              write(data) {
                term.current?.write(data);
              },
            }),
          );

          await process.exit;
          currentProcess.current = null;
          writePrompt();
        } catch (error) {
          if (term.current) {
            term.current.writeln(`\r\nCommand not found: ${command}`);
            writePrompt();
          }
          console.error("Terminal command error:", error);
          currentProcess.current = null;
        }
      },
      [clearTerminal, webContainerInstance, writePrompt],
    );

    const handleTerminalInput = useCallback(
      (data: string) => {
        if (!term.current) return;

        switch (data) {
          case "\r":
            void executeCommand(currentLine.current);
            break;
          case "\u007F":
            if (cursorPosition.current > 0) {
              currentLine.current =
                currentLine.current.slice(0, cursorPosition.current - 1) +
                currentLine.current.slice(cursorPosition.current);
              cursorPosition.current--;
              term.current.write("\b \b");
            }
            break;
          case "\u0003":
            currentProcess.current?.kill();
            currentProcess.current = null;
            term.current.writeln("^C");
            writePrompt();
            break;
          case "\u001b[A":
            if (commandHistory.current.length > 0) {
              if (historyIndex.current === -1) {
                historyIndex.current = commandHistory.current.length - 1;
              } else if (historyIndex.current > 0) {
                historyIndex.current--;
              }

              const historyCommand = commandHistory.current[historyIndex.current];
              term.current.write(
                "\r$ " + " ".repeat(currentLine.current.length) + "\r$ ",
              );
              term.current.write(historyCommand);
              currentLine.current = historyCommand;
              cursorPosition.current = historyCommand.length;
            }
            break;
          case "\u001b[B":
            if (historyIndex.current !== -1) {
              if (historyIndex.current < commandHistory.current.length - 1) {
                historyIndex.current++;
                const historyCommand =
                  commandHistory.current[historyIndex.current];
                term.current.write(
                  "\r$ " + " ".repeat(currentLine.current.length) + "\r$ ",
                );
                term.current.write(historyCommand);
                currentLine.current = historyCommand;
                cursorPosition.current = historyCommand.length;
              } else {
                historyIndex.current = -1;
                term.current.write(
                  "\r$ " + " ".repeat(currentLine.current.length) + "\r$ ",
                );
                currentLine.current = "";
                cursorPosition.current = 0;
              }
            }
            break;
          default:
            if (data >= " " || data === "\t") {
              currentLine.current =
                currentLine.current.slice(0, cursorPosition.current) +
                data +
                currentLine.current.slice(cursorPosition.current);
              cursorPosition.current++;
              term.current.write(data);
            }
            break;
        }
      },
      [executeCommand, writePrompt],
    );

    const initializeTerminal = useCallback(() => {
      if (!terminalRef.current || term.current) return;

      const terminal = new Terminal({
        cursorBlink: true,
        fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
        fontSize: 14,
        lineHeight: 1.2,
        letterSpacing: 0,
        theme: terminalThemes[theme],
        allowTransparency: false,
        convertEol: true,
        scrollback: 1000,
        tabStopWidth: 4,
      });

      const fitAddonInstance = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      const searchAddonInstance = new SearchAddon();

      terminal.loadAddon(fitAddonInstance);
      terminal.loadAddon(webLinksAddon);
      terminal.loadAddon(searchAddonInstance);

      terminal.open(terminalRef.current);
      fitAddon.current = fitAddonInstance;
      searchAddon.current = searchAddonInstance;
      term.current = terminal;

      terminal.onData(handleTerminalInput);

      setTimeout(() => {
        fitAddonInstance.fit();
      }, 100);

      terminal.writeln("WebContainer Terminal");
      terminal.writeln("Type 'help' for available commands");
      writePrompt();
    }, [handleTerminalInput, theme, writePrompt]);

    const connectToWebContainer = useCallback(async () => {
      if (!webContainerInstance || !term.current) return;

      try {
        setIsConnected(true);
        term.current.writeln("Connected to WebContainer");
        term.current.writeln("Ready to execute commands");
        writePrompt();
      } catch (error) {
        setIsConnected(false);
        term.current.writeln("Failed to connect to WebContainer");
        console.error("WebContainer connection error:", error);
      }
    }, [webContainerInstance, writePrompt]);

    const copyTerminalContent = useCallback(async () => {
      if (!term.current) return;

      const content = term.current.getSelection();
      if (!content) return;

      try {
        await navigator.clipboard.writeText(content);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }, []);

    const downloadTerminalLog = useCallback(() => {
      if (!term.current) return;

      const buffer = term.current.buffer.active;
      let content = "";

      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
          content += line.translateToString(true) + "\n";
        }
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `terminal-log-${new Date().toISOString().slice(0, 19)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, []);

    const searchInTerminal = useCallback((value: string) => {
      if (searchAddon.current && value) {
        searchAddon.current.findNext(value);
      }
    }, []);

    useEffect(() => {
      initializeTerminal();

      const resizeObserver = new ResizeObserver(() => {
        if (fitAddon.current) {
          setTimeout(() => {
            fitAddon.current?.fit();
          }, 100);
        }
      });

      if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
      }

      const runningProcess = currentProcess.current;
      const activeShellProcess = shellProcess.current;

      return () => {
        resizeObserver.disconnect();
        runningProcess?.kill();
        activeShellProcess?.kill();
        if (term.current) {
          term.current.dispose();
          term.current = null;
        }
      };
    }, [initializeTerminal]);

    useEffect(() => {
      if (webContainerInstance && term.current && !isConnected) {
        const timeoutId = window.setTimeout(() => {
          void connectToWebContainer();
        }, 0);

        return () => window.clearTimeout(timeoutId);
      }
    }, [connectToWebContainer, isConnected, webContainerInstance]);

    return (
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-lg border bg-background",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium">WebContainer Terminal</span>
            {isConnected && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {showSearch && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchInTerminal(e.target.value);
                  }}
                  className="h-6 w-32 text-xs"
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => void copyTerminalContent()}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearTerminal}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={downloadTerminalLog}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div ref={terminalRef} className="min-h-0 flex-1 p-2" />
      </div>
    );
  },
);

TerminalComponent.displayName = "TerminalComponent";

export default TerminalComponent;
