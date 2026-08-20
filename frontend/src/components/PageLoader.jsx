import React, { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = ({ message }) => {
  const { theme } = useThemeStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      data-theme={theme}
    >
      <LoaderIcon className="animate-spin size-10 text-primary" />
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-base-content/70">
          {message || "Connecting to server..."}
        </p>
        <p className="text-xs text-base-content/40">
          {elapsed < 10
            ? "Waking up the server, this may take a moment"
            : elapsed < 30
            ? "Server is warming up..."
            : "Almost there, thank you for your patience"}
        </p>
        <p className="text-xs text-base-content/30 tabular-nums">
          {elapsed}s
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
