import { ComponentType, SVGProps, useEffect, useRef, useState } from "react";
import ExtensionsIcon from "../../assets/icons/ui/Extensions.svg?react";
import FileIcon from "../../assets/icons/ui/File.svg?react";
import SearchIcon from "../../assets/icons/ui/SearchSolid.svg?react";
import SettingsIcon from "../../assets/icons/ui/Settings.svg?react";
import UserIcon from "../../assets/icons/ui/User.svg?react";
import { FolderNavLink } from "./FolderNavLink";

type NavItem = {
  id: number;
  title: string;
  hotkey: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navLinksArray: NavItem[] = [
  {
    id: 0,
    title: "Folder",
    hotkey: "Ctrl + Shift + E",
    to: "/folder",
    icon: FileIcon,
  },
  {
    id: 1,
    title: "Search",
    hotkey: "Ctrl + Shift + F",
    to: "/search",
    icon: SearchIcon,
  },
  {
    id: 2,
    title: "Extensions",
    hotkey: "Ctrl + Shift + X",
    to: "/extensions",
    icon: ExtensionsIcon,
  },
];

type ModalType = "user" | "settings" | null;

function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      if (e.target instanceof Node && el.contains(e.target)) return;

      onOutside();
    };

    document.addEventListener("mousedown", handler, true);
    document.addEventListener("touchstart", handler, true);

    return () => {
      document.removeEventListener("mousedown", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
  }, [ref, onOutside, enabled]);
}

export const FolderNavMenu = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const closeModal = () => setOpenModal(null);

  const toggleModal = (type: Exclude<ModalType, null>) => {
    setOpenModal((prev) => (prev === type ? null : type));
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, closeModal, openModal !== null);

  const modalPosition =
    openModal === "user"
      ? "left-full bottom-14"
      : openModal === "settings"
        ? "left-full bottom-0"
        : "";

  return (
    <nav className="relative h-full bg-panel2 border-r-2 border-border flex flex-col items-center justify-between">
      <div className="w-full">
        {navLinksArray.map((navLink) => (
          <FolderNavLink
            key={navLink.id}
            title={navLink.title}
            hotkey={navLink.hotkey}
            icon={navLink.icon}
            to={navLink.to}
          />
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={() => toggleModal("user")}
          className="group p-3 flex items-center justify-center border-l-2 border-transparent transition-colors"
          aria-expanded={openModal === "user"}
        >
          <UserIcon className="w-6 h-6 text-muted group-hover:text-fg" />
        </button>

        <button
          type="button"
          onClick={() => toggleModal("settings")}
          className="group p-3 flex items-center justify-center border-l-2 border-transparent transition-colors"
          aria-expanded={openModal === "settings"}
        >
          <SettingsIcon className="w-6 h-6 text-muted group-hover:text-fg" />
        </button>
      </div>

      {openModal !== null && (
        <div
          ref={modalRef}
          className={`absolute ${modalPosition} p-10 bg-panel2 rounded-r-xl`}
        ></div>
      )}
    </nav>
  );
};
