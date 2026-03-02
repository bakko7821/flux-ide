import { IPC } from "@flux/shared";
import React, { useMemo, useState } from "react";
import { Ctx } from "../hooks/useEditor";

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState("");
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

  const openFile = async () => {
    const pick = await window.flux.invoke(IPC.fs.openFileDialog);
    if (pick.canceled) return;

    const { text } = await window.flux.invoke(IPC.fs.readTextFile, {
      path: pick.path,
    });

    setActiveFilePath(pick.path);
    setValue(text);
  };

  const ctx = useMemo(
    () => ({ value, setValue, activeFilePath, openFile }),
    [value, activeFilePath],
  );

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
