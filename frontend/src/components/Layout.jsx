import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false, fullHeight = false }) => {
  return (
    <div className={fullHeight ? "h-screen flex flex-col" : "min-h-screen"}>
      <Navbar />
      <div className="flex flex-1 min-h-0">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 min-h-0 ${fullHeight ? "" : "overflow-y-auto pb-20 lg:pb-0"}`}>
          {children}
        </main>
      </div>
      {!fullHeight && <MobileNav />}
    </div>
  );
};

export default Layout;