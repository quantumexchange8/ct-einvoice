import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthenticatedLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar: Show only when isSidebarOpen is true */}
      {isSidebarOpen && <Sidebar />}

      <div className={`flex flex-col w-full bg-white transition-all duration-300 ${isSidebarOpen ? "ml-[233px]" : "ml-0"}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
