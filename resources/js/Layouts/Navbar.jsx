import React from "react";
import { Button } from "primereact/button";
import axios from "axios"; 
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
    <nav className="flex w-full p-4 justify-between items-center bg-white">
      <div className="flex items-center gap-3">
        <Button icon="pi pi-bars" className="p-button-text p-2 bg-white" onClick={toggleSidebar} />
      </div>
      <div className="flex items-center gap-2">
        <Button icon="pi pi-globe" className="p-button-text p-2" />
        <Button icon="pi pi-sign-out" className="p-button-text p-2 bg-white" onClick={handleSignOut} />
      </div>
    </nav>
  );
}
