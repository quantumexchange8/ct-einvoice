import React from "react";
import { Button } from "primereact/button";
import axios from "axios"; 
import { BreadcumbIcon, LangIcon, LogoutIcon } from "@/Components/Outline";
export default function Navbar({ toggleSidebar }) {
  const handleSignOut = async () => {
    try {
      await axios.post("/logout"); 
      localStorage.removeItem("authToken"); 
      sessionStorage.clear();
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 flex w-full p-4 justify-between items-center bg-white border-b border-vulcan-100">
      <div className="flex items-center py-2.5 px-2 cursor-pointer hover:bg-vulcan-100 rounded-lg" onClick={toggleSidebar} >
        <BreadcumbIcon className='text-[#333333]' />
      </div>
      <div className="flex items-center gap-2 ">
        <div className="py-2.5 px-2 cursor-pointer hover:bg-vulcan-100 rounded-lg">
          <LangIcon />
        </div>
        <div className="py-2.5 px-2 cursor-pointer hover:bg-vulcan-100 rounded-lg" onClick={handleSignOut}>
          <LogoutIcon />
        </div>
      </div>
    </nav>
  );
}
