import { useEffect } from "react";
import { TitleBar } from "./components/TitleBar/TitleBar";
import { EditorProvider } from "./editor/EditorContext";
import MonacoEditor from "./editor/MonacoEditor";
import { useEditor } from "./hooks/useEditor";
import { AppRoutes } from "./router";
import { initSystemThemeSync } from "./utils/theme";

export default function App() {
  useEffect(() => {
    let unsub: undefined | (() => void);
    initSystemThemeSync().then((u) => (unsub = u));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();

      const isTypingControl =
        tag === "input" ||
        tag === "textarea" ||
        (target?.isContentEditable ?? false);

      if (isTypingControl) return;

      e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  function EditorPane() {
    const { value, setValue } = useEditor();

    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full bg-panel min-h-8"></div>
        <MonacoEditor value={value} onChange={setValue} language="typescript" />
      </div>
    );
  }

  return (
    <EditorProvider>
      <div className="w-screen h-screen bg-bg flex flex-col">
        <TitleBar></TitleBar>
        <main className="w-full flex-1 min-h-0 flex flex-row">
          <AppRoutes />
          <EditorPane />
        </main>
      </div>
    </EditorProvider>
  );
}
