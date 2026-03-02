export const IPC = {
  fs: {
    readTextFile: "fs:readTextFile",
    writeTextFile: "fs:writeTextFile",

    openFileDialog: "fs:openFileDialog",
    openFolderDialog: "fs:openFolderDialog",
  },
  window: {
    minimize: "win:minimize",
    maxToggle: "win:maxToggle",
    close: "win:close",
  },
} as const;

export type IpcInvokeMap = {
  [IPC.fs.readTextFile]: (args: { path: string }) => Promise<{ text: string }>;
  [IPC.fs.writeTextFile]: (args: {
    path: string;
    text: string;
  }) => Promise<{ ok: true }>;

  [IPC.fs.openFileDialog]: (
    args: void,
  ) => Promise<{ canceled: true } | { canceled: false; path: string }>;

  [IPC.fs.openFolderDialog]: (
    args: void,
  ) => Promise<{ canceled: true } | { canceled: false; path: string }>;
};

export type IpcSendMap = {
  [IPC.window.minimize]: void;
  [IPC.window.maxToggle]: void;
  [IPC.window.close]: void;
};
