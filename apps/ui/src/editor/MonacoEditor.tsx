import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import "./monacoWorkers";
import { syncMonacoThemeWithDom } from "../utils/monacoTheme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  language?: string;
};

export default function MonacoEditor({
  value,
  onChange,
  language = "typescript",
}: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    syncMonacoThemeWithDom();

    modelRef.current = monaco.editor.createModel(value, language);

    editorRef.current = monaco.editor.create(elRef.current, {
      model: modelRef.current,
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true },
    });

    const sub = editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current!.getValue());
    });

    return () => {
      sub.dispose();
      editorRef.current?.dispose();
      modelRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const m = modelRef.current;
    if (!m) return;
    if (m.getValue() !== value) m.setValue(value);
  }, [value]);

  return <div ref={elRef} style={{ width: "100%", height: "100%" }} />;
}
