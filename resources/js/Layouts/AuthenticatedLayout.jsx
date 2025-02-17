import { useState } from "react";
import { Button } from "primereact/button";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AuthenticatedLayout = ({ header, children }) => {
  const [visible, setVisible] = useState(false);

  return (
<div className="min-h-screen">
  
  <Sidebar />
  <div className="min-h-screen flex flex-col md:ml-60">
    <Navbar />

    <main>{children}</main>
  </div>
  
</div>
    
   
  );
};

export default AuthenticatedLayout;
