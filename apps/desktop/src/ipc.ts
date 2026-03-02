import { IPC } from "@flux/shared";
import { dialog, ipcMain } from "electron";
import { readFile, writeFile } from "node:fs/promises";

export function registerIpcHandlers() {
  console.log("[main] registerIpcHandlers called");
  ipcMain.handle(IPC.fs.readTextFile, async (_evt, args: { path: string }) => {
    const text = await readFile(args.path, "utf-8");
    return { text };
  });

  ipcMain.handle(
    IPC.fs.writeTextFile,
    async (_evt, args: { path: string; text: string }) => {
      await writeFile(args.path, args.text, "utf-8");
      return { ok: true as const };
    },
  );

  ipcMain.handle(IPC.fs.openFileDialog, async () => {
    console.log("[main] fs:openFileDialog handler hit");
    const res = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (res.canceled || res.filePaths.length === 0)
      return { canceled: true as const };
    return { canceled: false as const, path: res.filePaths[0] };
  });

  ipcMain.handle(IPC.fs.openFolderDialog, async () => {
    console.log("[main] fs:openFolderDialog handler hit");
    const res = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (res.canceled || res.filePaths.length === 0)
      return { canceled: true as const };
    return { canceled: false as const, path: res.filePaths[0] };
  });
}
