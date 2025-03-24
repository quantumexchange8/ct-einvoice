import React from "react";
import axios from "axios"; 
import { ConfigurationIcon, DashboardIcon, InvoiceIcon, MerchantIcon } from "@/Components/Outline";
export default function Sidebar() {
  const handleLogout = async () => {
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
    <aside className="fixed w-full max-w-[233px] inset-y-0 z-20 overflow-auto bg-vulcan-50">
      <nav className="flex flex-col gap-5 p-4 shadow-container min-h-screen">
        <div className="px-2 py-3"><img src="/assets/image/logo.png" alt="logo" /></div>
        <div className="flex flex-col">
          <div className="flex flex-col w-full items-start gap-3 self-stretch">
            <div className="flex w-full p-3 flex-col items-start gap-1 self-stretch border rounded-[1px] bg-gray-200">
              <div className="flex py-2 items-center self-stretch gap-3">
                <img src="/assets/image/9720009 2.png" alt="logo" />
                <div className="text-gray-700 font-manrope text-sm font-bold leading-5">
                  CT Admin 001
                  <span className="block text-gray-500 font-manrope text-xs font-normal leading-[18px]">
                    ID: CT00009
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <button>
                    <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                        <DashboardIcon />
                        Dashboard
                    </div>
                </button>
              <a href="/invoice-listing">
                <button>
                  <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                    <InvoiceIcon />
                    Invoice Listing
                  </div>
                </button>
              </a>
              <a href="/merchant">
                <button>
                  <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                    <MerchantIcon />
                    Merchant
                  </div>
                </button>
              </a>
              <a href="/configuration">
                <button>
                  <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                    <ConfigurationIcon />
                    Configuration
                  </div>
                </button>
              </a>
            </div>
          </div>
          <div className="flex w-full flex-col absolute inset-x-0 bottom-0">
            <button onClick={handleLogout}>
              <div className="flex w-full gap-3 px-7 py-5 text-vulcan-900 font-manrope font-normal text-sm leading-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                  <path d="M13.0061 7.08789H4.59619" stroke="#161B26" strokeLinecap="square"/>
                  <path d="M11.334 4.93237L13.4993 7.08783L11.334 9.24394" stroke="#161B26" strokeLinecap="square"/>
                  <path d="M7.8977 10.1319V13.1759H0.971191V1H7.8977V4.04396" stroke="#161B26" strokeLinecap="square"/>
                </svg>
                Log out
              </div>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
