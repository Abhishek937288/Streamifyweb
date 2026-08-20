import React, { useState } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { PaletteIcon, XIcon } from "lucide-react";
import { THEMES } from "../constants";

const ThemeSelector = ({ inline = false }) => {
  const { theme, setTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const themeContent = (
    <div className="px-3 py-2">
      <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Select Theme</p>
      <div className="grid grid-cols-2 gap-1.5 p-1.5">
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
              ${
                theme === themeOption.name
                  ? "bg-primary/10 ring-2 ring-primary/50 scale-[1.02]"
                  : "hover:bg-base-content/5 hover:scale-[1.02]"
              }
            `}
            onClick={() => {
              setTheme(themeOption.name);
              if (mobileOpen) setMobileOpen(false);
            }}
          >
            <div className="flex gap-1">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-base-content/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs font-medium">{themeOption.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (inline) {
    return (
      <>
        <button
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          onClick={() => setMobileOpen(true)}
        >
          <PaletteIcon className="size-5" />
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between px-4 pt-4">
                <p className="text-sm font-bold">Select Theme</p>
                <button
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <XIcon className="size-4" />
                </button>
              </div>
              {themeContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>
      <div
        className="dropdown-content z-[1] mt-3 p-2 shadow-2xl bg-base-100 backdrop-blur-xl rounded-2xl
        w-64 border border-base-content/10 max-h-96 overflow-y-auto"
        tabIndex={0}
      >
        {themeContent}
      </div>
    </div>
  );
};

export default ThemeSelector;
