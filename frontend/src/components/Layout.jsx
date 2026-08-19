import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
          {/* the children is  will change all times according the component works like the outlet*/}
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Layout;