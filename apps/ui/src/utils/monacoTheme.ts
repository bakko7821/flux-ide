import * as monaco from "monaco-editor";

type MonacoBase = "vs" | "vs-dark";

function clampByte(n: number) {
  return Math.max(0, Math.min(255, n | 0));
}

function toHexByte(n: number) {
  return clampByte(n).toString(16).padStart(2, "0");
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function parseCssColorToHex(raw: string, fallbackHex: string) {
  const v = (raw ?? "").trim();
  if (!v) return fallbackHex;

  // already hex
  if (v.startsWith("#")) {
    // normalize #rgb -> #rrggbb
    if (v.length === 4) {
      const r = v[1],
        g = v[2],
        b = v[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return v.slice(0, 7);
  }

  // rgb(...) / rgba(...)
  const rgbMatch = v.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return rgbToHex(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]);
  }

  // "r g b" or "r, g, b"
  const parts = v
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
    return rgbToHex(parts[0], parts[1], parts[2]);
  }

  return fallbackHex;
}

function readVar(name: string, fallbackHex: string) {
  const s = getComputedStyle(document.documentElement);
  return parseCssColorToHex(s.getPropertyValue(name), fallbackHex);
}

function readThemeColors() {
  const isDark = document.documentElement.classList.contains("dark");

  // Фоллбеки (чтобы никогда не падало, даже если vars нет)
  const defaults = isDark
    ? {
        bg: "#0F1115",
        fg: "#E6EDF3",
        panel: "#181C23",
        muted: "#5C6673",
        border: "#2A2F3A",
        accent: "#39FF14",
        danger: "#EF4444",
      }
    : {
        bg: "#F5F7FA",
        fg: "#1A1F2B",
        panel: "#FFFFFF",
        muted: "#9CA3AF",
        border: "#DCE1E7",
        accent: "#00B140",
        danger: "#DC2626",
      };

  return {
    bg: readVar("--bg", defaults.bg),
    fg: readVar("--fg", defaults.fg),
    panel: readVar("--panel", defaults.panel),
    muted: readVar("--muted", defaults.muted),
    border: readVar("--border", defaults.border),
    accent: readVar("--accent", defaults.accent),
    danger: readVar("--danger", defaults.danger),
  };
}

export function syncMonacoThemeWithDom() {
  const isDark = document.documentElement.classList.contains("dark");
  const base: MonacoBase = isDark ? "vs-dark" : "vs";
  const themeName = isDark ? "flux-dark" : "flux-light";

  const c = readThemeColors();

  monaco.editor.defineTheme(themeName, {
    base,
    inherit: true,
    rules: [
      { token: "comment", foreground: c.muted.slice(1) },
      { token: "string", foreground: c.accent.slice(1) },
      { token: "keyword", foreground: c.accent.slice(1) },
      { token: "number", foreground: c.danger.slice(1) },
    ],
    colors: {
      "editor.background": c.bg,
      "editor.foreground": c.fg,

      "editor.lineHighlightBackground": c.panel,
      "editor.selectionBackground": c.accent + "33",
      "editor.inactiveSelectionBackground": c.accent + "22",

      "editorCursor.foreground": c.fg,
      "editorLineNumber.foreground": c.muted,
      "editorLineNumber.activeForeground": c.fg,

      "editorIndentGuide.background": c.border,
      "editorIndentGuide.activeBackground": c.muted,

      "editorWidget.background": c.panel,
      "editorWidget.border": c.border,
      "dropdown.background": c.panel,
      "dropdown.border": c.border,
    },
  });

  monaco.editor.setTheme(themeName);
}
