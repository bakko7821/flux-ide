import { Outlet } from "react-router-dom";
import { FolderNavMenu } from "./FolderNavMenu/FolderNavMenu";

export const FolderBar = () => {
  return (
    <div className="bg-panel h-full min-w-85 flex flex-row">
      <FolderNavMenu />
      <div className="w-full h-full flex flex-col min-h-0">
        <Outlet />
      </div>
    </div>
  );
};
