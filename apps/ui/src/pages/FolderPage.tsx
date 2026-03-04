import type { DirNode } from "@flux/shared";
import { useState } from "react";
import FolderIcon from "../assets/icons/files/folder.svg?react";
import OpenFolderIcon from "../assets/icons/files/open-folder.svg?react";
import ArrowIcon from "../assets/icons/ui/ArrowDown.svg?react";
import { useEditor } from "../hooks/useEditor";
import { getFileIconUrl } from "../utils/icons/getFileIconUrl";

function TreeNode({
  node,
  onOpenFile,
}: {
  node: DirNode;
  onOpenFile: (p: string) => void;
}) {
  const [open, setOpen] = useState(true);

  if (node.type === "file") {
    const iconUrl = getFileIconUrl(node.ext || node.name);

    return (
      <button
        className="w-full flex flex-row items-center gap-2 justify-start p-1 rounded hover:bg-muted/5"
        onClick={() => onOpenFile(node.path)}
        title={node.path}
      >
        <img
          src={iconUrl}
          className="w-3 h-3 shrink-0"
          alt=""
          draggable={false}
        />
        <span className="text-muted text-left text-sm truncate">
          {node.name}
        </span>
      </button>
    );
  }

  return (
    <div className="">
      <button
        className="w-full flex flex-row items-center justify-start text-left p-1 rounded hover:bg-fg/5 gap-1"
        onClick={() => setOpen((v) => !v)}
        title={node.path}
      >
        <ArrowIcon className={`w-3 h-3 text-fg ${!open && "-rotate-90"}`} />
        <span className="flex flex-row items-center justify-start gap-2">
          {open ? (
            <OpenFolderIcon className="w-3 h-3" />
          ) : (
            <FolderIcon className="w-3 h-3" />
          )}
          <span className="text-sm font-medium text-fg">{node.name}</span>
        </span>
      </button>

      {open && (
        <div className="pl-3 border-l border-white/10">
          {node.children.map((c) => (
            <TreeNode key={c.path} node={c} onOpenFile={onOpenFile} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderPage() {
  const { folderPath, tree, openFolder, openFile, openFileByPath } =
    useEditor();

  return (
    <div className="w-72 min-w-72 max-w-72 h-full flex flex-col">
      <div className="flex flex-col">
        <p className="uppercase text-base text-muted pl-2 p-1">Проводник</p>
        <div
          className="bg-bg text-xs text-muted pl-2 truncate p-1"
          title={folderPath ?? ""}
        >
          {folderPath ?? "Папка не выбрана"}
        </div>
      </div>

      {!folderPath || !tree ? (
        <div className="p-1 px-2 flex gap-2 flex-col pt-3">
          <button
            className="bg-accent text-bg text-base p-2 rounded-lg font-medium hover:bg-accent-hover active:bg-accent-pressed"
            onClick={openFolder}
          >
            Открыть папку
          </button>
          <div className="w-full flex flex-row items-center justify-center gap-2">
            <span className="w-full h-px bg-muted"></span>
            <p className="text-base font-medium uppercase text-fg">или</p>
            <span className="w-full h-px bg-muted"></span>
          </div>
          <button
            className="bg-accent text-bg text-base p-2 rounded-lg font-medium hover:bg-accent-hover active:bg-accent-pressed"
            onClick={openFile}
          >
            Открыть файл
          </button>
        </div>
      ) : (
        <div className="treeNode flex-1 min-h-0 overflow-auto p-1 px-2">
          <TreeNode node={tree} onOpenFile={openFileByPath} />
        </div>
      )}
    </div>
  );
}
