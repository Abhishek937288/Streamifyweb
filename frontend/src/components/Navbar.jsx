import React, { useState } from "react";
import useAuthUser from "../hooks/useAuth.User";
import { useLocation } from "react-router";
import useLogout from "../hooks/userLogout.js";
import { Link } from "react-router";

import { BellIcon, LogOutIcon, ShipWheelIcon, MenuIcon, XIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();

  const { logoutMutation } = useLogout();
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* left side */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu */}
            <button
              className="lg:hidden btn btn-ghost btn-circle btn-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
            
            {/* Logo - show on all pages */}
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider hidden sm:inline">
                Streamify
              </span>
            </Link>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-16 left-0 right-0 bg-base-200 border-b border-base-300 shadow-lg">
              <div className="p-4 space-y-2">
                <Link
                  to="/"
                  className={`btn btn-ghost justify-start w-full gap-3 normal-case ${
                    location.pathname === "/" ? "btn-active" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Home</span>
                </Link>
                <Link
                  to="/friends"
                  className={`btn btn-ghost justify-start w-full gap-3 normal-case ${
                    location.pathname === "/friends" ? "btn-active" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Friends</span>
                </Link>
                <Link
                  to="/notifications"
                  className={`btn btn-ghost justify-start w-full gap-3 normal-case ${
                    location.pathname === "/notifications" ? "btn-active" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Notifications</span>
                </Link>
              </div>
            </div>
          )}

          {/* right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to={"/notifications"} className="hidden sm:flex">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-5 w-5 text-base-content opacity-70" />
              </button>
            </Link>
            <div className="hidden sm:flex">
              <ThemeSelector />
            </div>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  rel="noreferrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => logoutMutation()}
            >
              <LogOutIcon className="h-5 w-5 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;