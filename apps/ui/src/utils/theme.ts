import { syncMonacoThemeWithDom } from "./monacoTheme";

type Theme = "dark" | "light";

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
  syncMonacoThemeWithDom();
}

export async function initSystemThemeSync() {
  const t = await window.theme.getSystem();
  applyTheme(t);

  const unsubscribe = window.theme.onSystemChanged((next) => {
    applyTheme(next);
  });

  return unsubscribe;
}
