import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <span className={`relative inline-flex h-9 w-9 items-center justify-center ${className}`}>
      {/* Soft glowing halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -m-3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(229,234,146,0.55) 0%, rgba(229,234,146,0.28) 35%, rgba(229,234,146,0) 70%)",
          filter: "blur(6px)",
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
        title={theme === "dark" ? "亮色模式" : "暗色模式"}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105"
        style={{ backgroundColor: "#E5EA92", color: "#3a3a1f" }}
      >
        {mounted && theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </span>
  );
}
