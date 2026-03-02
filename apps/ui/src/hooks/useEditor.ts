import { createContext, useContext } from "react";

export type EditorCtx = {
  value: string;
  setValue: (v: string) => void;

  activeFilePath: string | null;
  openFile: () => Promise<void>;
};

export const Ctx = createContext<EditorCtx | null>(null);

export function useEditor() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useEditor must be used within EditorProvider");
  return v;
}
