import { useEffect, useState } from "react";
import { FolderBar } from "./components/FolderBar";
import { TitleBar } from "./components/TitleBar/TitleBar";
import MonacoEditor from "./editor/MonacoEditor";
import { initSystemThemeSync } from "./utils/theme";
// import CrossIcon from "../src/assets/icons/ui/CrossFilled.svg"

export default function App() {
  // const [path, setPath] = useState("");
  const [value, setValue] = useState("// Open a file path and load it 🚀\n");

  // const open = async () => {
  //   if (!path) return;
  //   const res = await window.flux.invoke(IPC.fs.readTextFile, { path });
  //   setValue(res.text);
  // };

  // const save = async () => {
  //   if (!path) return;
  //   await window.flux.invoke(IPC.fs.writeTextFile, { path, text: value });
  // };

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

      // если сейчас печатаем/редактируем — не мешаем
      if (isTypingControl) return;

      e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  return (
    <div className="w-screen h-screen bg-bg flex flex-col">
      <TitleBar></TitleBar>
      <main className="w-full h-full flex flex-row">
        <FolderBar />
        <div className="w-full h-full flex flex-col">
          <div className="w-full bg-panel p-3"></div>
          <MonacoEditor
            value={value}
            onChange={setValue}
            language="typescript"
          />
        </div>
      </main>
    </div>
    // <div className="w-screen bg-red-300 flex flex-col items-start justify-start">
    //   <div className="w-full items-center justify-between flex flex-row">
    //     <div className="">
    //       <img
    //         src="apps/ui/src/assets/images/icon.png"
    //         alt="flux"
    //         className="w-6 h-6"
    //       />
    //       <div className=""></div>
    //     </div>

    //     <div className="flex flex-row items-center justify-center gap-0">
    //       <button
    //
    //         className="px-3 py-1 flex items-center justify-center"
    //       >
    //         —
    //       </button>
    //       <button
    //
    //         className="px-3 py-1 flex items-center justify-center"
    //       >
    //         ▢
    //       </button>
    //       <button
    //
    //         className="px-3 py-1 flex items-center justify-center"
    //       >
    //         ✕
    //       </button>
    //     </div>
    //   </div>
    //   <div>
    //     <input
    //       value={path}
    //       onChange={(e) => setPath(e.target.value)}
    //       placeholder="C:\path\to\file.ts"
    //     />
    //     <button onClick={open}>Open</button>
    //     <button onClick={save}>Save</button>
    //   </div>

    //   <div>
    //     <MonacoEditor value={value} onChange={setValue} language="typescript" />
    //   </div>
    // </div>
  );
}
