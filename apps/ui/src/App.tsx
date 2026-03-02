import { useEffect, useState } from "react";
import { TitleBar } from "./components/TitleBar/TitleBar";
import MonacoEditor from "./editor/MonacoEditor";
import { initSystemThemeSync } from "./utils/theme";
import { AppRoutes } from "./router";

export default function App() {
  const [value, setValue] = useState("// Open a file path and load it 🚀\n");

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

  return (
    <div className="w-screen h-screen bg-bg flex flex-col">
      <TitleBar></TitleBar>
      <main className="w-full flex-1 min-h-0 flex flex-row">
        <AppRoutes />
        <div className="w-full h-full flex flex-col">
          <div className="w-full bg-panel min-h-8"></div>
          <MonacoEditor
            value={value}
            onChange={setValue}
            language="typescript"
          />
        </div>
      </main>
    </div>
  );
}
