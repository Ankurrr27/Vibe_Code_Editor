"use client";

import { useRef, useEffect, useCallback, type ComponentProps } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import {
  configureMonaco,
  defaultEditorOptions,
  getEditorLanguage,
} from "@/modules/playground/lib/editor-config";
import type { TemplateFile } from "@/modules/playground/lib/path-to-json";

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined;
  content: string;
  onContentChange: (value: string) => void;
}

type EditorOptions = ComponentProps<typeof Editor>["options"];
type EditorInstance = Parameters<
  NonNullable<ComponentProps<typeof Editor>["onMount"]>
>[0];
type UpdateOptions = Parameters<EditorInstance["updateOptions"]>[0];

const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
}: PlaygroundEditorProps) => {
  const editorRef = useRef<EditorInstance | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const updateEditorLanguage = useCallback(() => {
    if (!activeFile || !monacoRef.current || !editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    const language = getEditorLanguage(activeFile.fileExtension || "");
    try {
      monacoRef.current.editor.setModelLanguage(model, language);
    } catch (error) {
      console.warn("Failed to set Editor language:", error);
    }
  }, [activeFile]);

  const handleEditorDidMount = (editor: EditorInstance, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.updateOptions(defaultEditorOptions as unknown as UpdateOptions);

    configureMonaco(monaco);
    updateEditorLanguage();
  };

  useEffect(() => {
    updateEditorLanguage();
  }, [updateEditorLanguage]);

  const editorOptions = defaultEditorOptions as unknown as EditorOptions;

  return (
    <div className="relative h-full">
      <Editor
        height="100%"
        value={content}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={
          activeFile
            ? getEditorLanguage(activeFile.fileExtension || "")
            : "plaintext"
        }
        options={editorOptions}
      />
    </div>
  );
};

export default PlaygroundEditor;
