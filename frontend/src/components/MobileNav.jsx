import React from "react";
import { useLocation, Link } from "react-router";
import { HomeIcon, UserIcon, BellIcon, ShipWheelIcon } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-50">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
            isActive("/") ? "text-primary" : "text-base-content/60"
          }`}
        >
          <HomeIcon className="size-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          to="/friends"
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
            isActive("/friends") ? "text-primary" : "text-base-content/60"
          }`}
        >
          <UserIcon className="size-5" />
          <span className="text-[10px] font-medium">Friends</span>
        </Link>
        <Link
          to="/notifications"
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${
            isActive("/notifications") ? "text-primary" : "text-base-content/60"
          }`}
        >
          <BellIcon className="size-5" />
          <span className="text-[10px] font-medium">Alerts</span>
        </Link>
        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-base-content/60"
        >
          <ShipWheelIcon className="size-5" />
          <span className="text-[10px] font-medium">Streamify</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;