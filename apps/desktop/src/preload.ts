import type { IpcInvokeMap } from "@flux/shared";
import { IPC } from "@flux/shared";
import { contextBridge, ipcRenderer } from "electron";

type InvokeKey = keyof IpcInvokeMap;

const api = {
  invoke: async <K extends InvokeKey>(
    channel: K,
    ...args: Parameters<IpcInvokeMap[K]> extends []
      ? []
      : [Parameters<IpcInvokeMap[K]>[0]]
  ): Promise<Awaited<ReturnType<IpcInvokeMap[K]>>> => {
    return ipcRenderer.invoke(channel as string, ...(args as unknown[]));
  },

  window: {
    minimize: () => ipcRenderer.send(IPC.window.minimize),
    maximizeToggle: () => ipcRenderer.send(IPC.window.maxToggle),
    close: () => ipcRenderer.send(IPC.window.close),

    isMaximized: () =>
      ipcRenderer.invoke("window:isMaximized") as Promise<boolean>,
    onMaximizedChanged: (cb: (v: boolean) => void) => {
      const handler = (_: unknown, v: boolean) => cb(v);
      ipcRenderer.on("window:maximizedChanged", handler);
      return () =>
        ipcRenderer.removeListener("window:maximizedChanged", handler);
    },
  },
};

contextBridge.exposeInMainWorld("flux", api);

contextBridge.exposeInMainWorld("theme", {
  getSystem: () =>
    ipcRenderer.invoke("theme:getSystem") as Promise<"dark" | "light">,
  setSource: (source: "system" | "light" | "dark") =>
    ipcRenderer.invoke("theme:setSource", source) as Promise<"dark" | "light">,
  onSystemChanged: (cb: (t: "dark" | "light") => void) => {
    const handler = (_: unknown, t: "dark" | "light") => cb(t);
    ipcRenderer.on("theme:systemChanged", handler);
    return () => ipcRenderer.removeListener("theme:systemChanged", handler);
  },
});

export type FluxApi = typeof api;
