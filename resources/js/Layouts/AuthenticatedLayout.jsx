import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthenticatedLayout = ({ children, header }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth > 1024) { // md breakpoint (768px)
            setIsSidebarExpanded(true);
        } else {
            setIsSidebarExpanded(false);
        }
    };

    // Set initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar: Show only when isSidebarOpen is true */}
      <Sidebar expanded={isSidebarExpanded} showingNavigationDropdown={showingNavigationDropdown} toggleSidebar={toggleSidebar} />

      <div className={`min-h-screen flex flex-col w-full bg-white transition-all duration-300 ${isSidebarExpanded ? "md:ml-[233px]" : "translate-x-0 md:ml-0"}`}>
        <Navbar header={header} toggleSidebar={toggleSidebar} expanded={isSidebarExpanded} />

        <main className="w-full flex justify-center">
          <div className="max-w-[1440px] w-full rounded-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
