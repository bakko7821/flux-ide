import { Navigate, Route, Routes } from "react-router-dom";

import { FolderBar } from "./components/FolderBar";
import ExtensionsPage from "./pages/ExtensionsPage";
import FolderPage from "./pages/FolderPage";
import SearchPage from "./pages/SearchPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<FolderBar />}>
        <Route index element={<Navigate to="/folder" replace />} />
        <Route path="/folder" element={<FolderPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/extensions" element={<ExtensionsPage />} />
      </Route>
    </Routes>
  );
}
