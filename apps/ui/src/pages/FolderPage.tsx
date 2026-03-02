import { useEditor } from "../hooks/useEditor";

export default function FolderPage() {
  const { openFile } = useEditor();

  return (
    <>
      <p className="uppercase text-base text-muted p-1 pl-7">Проводник</p>

      <div className="flex gap-2 p-2">
        <button className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">
          Открыть папку
        </button>

        <button
          className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5"
          onClick={openFile}
        >
          Открыть файл
        </button>
      </div>
    </>
  );
}
