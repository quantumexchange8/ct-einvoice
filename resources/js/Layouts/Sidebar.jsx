import React from "react";
import axios from "axios"; 
import { ConfigurationIcon, DashboardIcon, InvoiceIcon, MerchantIcon, PayoutConfigIcon } from "@/Components/Outline";
import { Link, usePage } from "@inertiajs/react";

export default function Sidebar({ showingNavigationDropdown, expanded, toggleSidebar }) {

  const { url } = usePage();

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
    <>
      <div className={`${expanded ? 'fixed inset-0 z-20 bg-black/50 md:hidden' : ''} `} onClick={toggleSidebar}></div>
      <aside className={`fixed w-full max-w-[233px] inset-y-0 z-20 overflow-auto bg-vulcan-50 transition-all duration-300 ease-in-out ${expanded ? 'translate-x-0 w-full' : 'translate-x-[-100%] md:translate-x-0 md:w-0'}`}>
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
                <Link href={route('dashboard')} >
                  <div className={`${url === '/dashboard' ? 'w-full flex items-center gap-2 py-2 px-3 bg-vulcan-700 text-vulcan-50 text-sm rounded-[2px] ' : 'w-full flex items-center gap-2 py-2 px-3 text-vulcan-900 text-sm hover:bg-vulcan-100 rounded-[2px]'}`} >
                    <DashboardIcon />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link href={route('invoice-listing')} >
                  <div className={`${url === '/invoice-listing' ? 'w-full flex items-center gap-2 py-2 px-3 bg-vulcan-700 text-vulcan-50 text-sm rounded-[2px] ' : 'w-full flex items-center gap-2 py-2 px-3 text-vulcan-900 text-sm hover:bg-vulcan-100 rounded-[2px]'}`} >
                    <InvoiceIcon />
                    <span>Invoice Listing</span>
                  </div>
                </Link>
                <Link href={route('merchant')} >
                  <div className={`${url === '/merchant' ? 'w-full flex items-center gap-2 py-2 px-3 bg-vulcan-700 text-vulcan-50 text-sm rounded-[2px] ' : 'w-full flex items-center gap-2 py-2 px-3 text-vulcan-900 text-sm hover:bg-vulcan-100 rounded-[2px]'}`} >
                    <MerchantIcon />
                    <span>Merchant</span>
                  </div>
                </Link>
                <Link href={route('payout-config')} >
                  <div className={`${url === '/payout-config' ? 'w-full flex items-center gap-2 py-2 px-3 bg-vulcan-700 text-vulcan-50 text-sm rounded-[2px] ' : 'w-full flex items-center gap-2 py-2 px-3 text-vulcan-900 text-sm hover:bg-vulcan-100 rounded-[2px]'}`} >
                    <PayoutConfigIcon />
                    <span>Payout Config</span>
                  </div>
                </Link>
                <Link href={route('configuration')} >
                  <div className={`${url === '/configuration' ? 'w-full flex items-center gap-2 py-2 px-3 bg-vulcan-700 text-vulcan-50 text-sm rounded-[2px] ' : 'w-full flex items-center gap-2 py-2 px-3 text-vulcan-900 text-sm hover:bg-vulcan-100 rounded-[2px]'}`} >
                    <ConfigurationIcon />
                    <span>Configuration</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
