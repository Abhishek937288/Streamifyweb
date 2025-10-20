import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("stremify-theme") || "coffee", // to check the theme in local storage
  setTheme: (theme) => {
    localStorage.setItem("stremify-theme", theme);  // set the theme if available in locale storage
    set({ theme });
  },
}));
