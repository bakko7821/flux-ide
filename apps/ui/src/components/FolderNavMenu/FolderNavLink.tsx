import { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  title: string;
  hotkey?: string;
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const FolderNavLink = ({ title, to, hotkey, icon: Icon }: Props) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group p-3 flex items-center justify-center",
          "border-l-2 transition-colors w-full",
          isActive ? "border-accent bg-white/5" : "border-transparent",
        ].join(" ")
      }
      aria-label={title}
    >
      <Icon
        className="w-6 h-6 text-muted group-hover:text-fg"
        aria-hidden="true"
        focusable="false"
      />

      {/* кастомный tooltip */}
      <span
        className="
          pointer-events-none absolute left-full ml-2
          whitespace-nowrap rounded-lg
          bg-panel2 border border-border px-2 py-1
          text-xs text-fg opacity-0
          translate-x-1 transition
          group-hover:opacity-100 group-hover:translate-x-0
        "
      >
        {`${title} ${hotkey && `( ${hotkey} )`}`}
      </span>
    </NavLink>
  );
};
