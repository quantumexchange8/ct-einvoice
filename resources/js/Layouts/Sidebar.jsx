import React from "react";

export default function Sidebar() {

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
                            <div className="flex px-3 py-2 justify-center items-center gap-2 self-stretch border rounded-sm border-gray-300 bg-gray-100">
                            <button>
                                <div className="flex flex-shrink-0 gap-2 text-gray-700 text-xs font-manrope font-medium leading-[18px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1.3999V12.5999" stroke="#161B26" strokeLinecap="square" />
                                    <path d="M1.3999 7H12.5999" stroke="#161B26" strokeLinecap="square" />
                                </svg>
                                Create Order
                                </div>
                            </button>
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <button>
                            <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                                <path d="M1 7.3643L7.99991 1.36621L14.9998 7.3643" stroke="#161B26" strokeLinecap="square" />
                                <path d="M2.50195 6.51855V14.2311H13.5013V6.51855" stroke="#161B26" strokeLinecap="square" />
                                <path d="M8 8.28857V10.6587" stroke="#161B26" strokeLinecap="square" />
                                </svg>
                                Dashboard
                            </div>
                            </button>
                            <a href="/invoice-listing">
                            <button>
                            <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14.6663 4.66634L7.99967 1.33301L1.33301 4.66634V11.333L7.99967 14.6663L14.6663 11.333V4.66634Z" stroke="#161B26" strokeLinejoin="round" />
                                <path d="M1.33301 4.6665L7.99967 7.99984" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 14.6667V8" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.6667 4.6665L8 7.99984" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.3337 3L4.66699 6.33333" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Invoice Listing
                            </div>
                            </button>
                            </a>
                            <a href="/merchant">
                            <button>
                            <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14.6663 4.66634L7.99967 1.33301L1.33301 4.66634V11.333L7.99967 14.6663L14.6663 11.333V4.66634Z" stroke="#161B26" strokeLinejoin="round" />
                                <path d="M1.33301 4.6665L7.99967 7.99984" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 14.6667V8" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.6667 4.6665L8 7.99984" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.3337 3L4.66699 6.33333" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Merchant
                            </div>
                            </button>
                            </a>
                            <a href="/configuration">
                            <button>
                            <div className="flex w-full items-center gap-3 px-3 py-2 text-gray-900 font-manrope text-sm font-normal leading-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14.6663 4.66634L7.99967 1.33301L1.33301 4.66634V11.333L7.99967 14.6663L14.6663 11.333V4.66634Z" stroke="#161B26" strokeLinejoin="round" />
                                <path d="M1.33301 4.6665L7.99967 7.99984" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 14.6667V8" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.6667 4.6665L8 7.99984" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.3337 3L4.66699 6.33333" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Configuration
                            </div>
                            </button>
                            </a>
                        </div>
                    </div>
                    <div className="flex w-full flex-col absolute inset-x-0 bottom-0">
                        <button >
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
    )
}