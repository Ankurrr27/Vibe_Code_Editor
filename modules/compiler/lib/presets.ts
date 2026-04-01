import { CompilerPreset } from "@/modules/compiler/types";

export const compilerStarters: CompilerPreset[] = [
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

export const defaultFallbackCode = `print("Hello, VibeCode!")`;

export const getLanguagePreset = (languageName: string) =>
  compilerStarters.find((entry) => entry.match.test(languageName));

export const getEditorFilename = (languageName?: string) => {
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
