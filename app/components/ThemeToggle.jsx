"use client";

import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("site-theme");
      if (stored) {
        setTheme(stored);
        document.documentElement.classList.toggle("theme-dark", stored === "dark");
      } else {
        // default to dark if user prefers dark
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setTheme(initial);
        document.documentElement.classList.toggle("theme-dark", initial === "dark");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("site-theme", next);
    } catch (e) {}
    document.documentElement.classList.toggle("theme-dark", next === "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center gap-2" 
      style={{background: "transparent", color: "var(--text)" }}
    >
      <span>Theme :</span>
      {theme === "dark" ? <FaMoon /> : theme === "light" ? <IoMdSunny /> : <span>...</span>}
    </button>
  );
}
