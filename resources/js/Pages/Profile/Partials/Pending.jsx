import React from "react";
import { Button } from "primereact/button";
import { Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { formatAmount } from "@/Composables";
import { CoinIcon } from "@/Components/Outline";

export default function Pending({ invoice }) {
    const handleDownload = () => {
        if (invoice?.download_url) {
            const link = document.createElement("a");
            link.href = invoice.download_url; // The URL where the invoice is hosted
            link.download = `invoice_${invoice.invoice_no}.pdf`; // Set default download filename
            link.click();
        } else {
            alert("Download link is unavailable.");
        }
    };

    return (
        <GuestLayout class>
            <div className="flex flex-col w-full items-start justify-center self-stretch pb-[75px] bg-white"> 
                <div className="flex flex-col w-full p-5 gap-8 bg-white">
                    <div className="flex w-full flex-col justify-center items-start gap-6 ">
                        <div className="flex w-full p-4 items-center self-stretch rounded-sm bg-warning-50 ">
                            <div className="flex shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2">
                                    <rect width="20" height="20" rx="10" fill="#E79B19"/>
                                    <path d="M10 10H12.7273H15.4545" stroke="#FEFAEC" strokeWidth="1.6361" strokeLinecap="square"/>
                                    <path d="M10 10V7.27273V4.54545" stroke="#FEFAEC" strokeWidth="1.6361" strokeLinecap="square"/>
                                </svg>
                            </div>
                            <div className="w-full font-manrope not-italic">
                                <div className=" font-bold text-warning-500 text-base leading-[22px]">Pending Validation</div>
                                    <span className="block text-warning-950 text-xs leading-[18px] font-normal">
                                    e-invoice will be available for download once it has been successfully validated.
                                    </span>
                            </div>
                        </div>
                        <div className="flex w-full items-start gap-4 self-stretch">
                            <div className="text-vulcan-900 font-bold leading-[26px] not-italic text-xl flex flex-col gap-2 w-full">
                                <div>#{invoice.invoice_no}</div>
                                
                                <div className="flex items-start gap-2">
                                    <CoinIcon />
                                    <div className="text-vulcan-950 font-manrope text-sm font-medium">
                                        RM {formatAmount(invoice.amount)}
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M4.44922 8.67676H15.3417" stroke="#333741" strokeLinecap="square"/>
                                            <path d="M12.3672 4.33252V6.26311" stroke="#333741" strokeLinecap="square"/>
                                            <path d="M7.43164 4.33252V6.26311" stroke="#333741" strokeLinecap="square"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M15.3945 5.25977H4.39453V16.0667H15.3945V5.25977Z" stroke="#333741" strokeLinecap="square"/>
                                        </svg>
                                    </div>
                                    <div className="flex text-vulcan-950 font-manrope text-sm not-italic leading-5 font-medium ">
                                        {new Date(invoice.date).toISOString().split("T")[0]}
                                    </div>
                                </div>   
                            </div>
                        </div>
                        {invoice?.type === "Business" ? (
                        <div className="w-full grid grid-cols-2 grid-rows-7 font-manrope gap-4 self-stretch not-italic leading-5">
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Full Name</span>
                                <span className="text-vulcan-950 text-sm font-medium">{invoice?.full_name || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">TIN No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.tin_no || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Business Registration No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.business_registration || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">SST No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.sst_no || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Email Address</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.email || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Contact No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.contact || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Address Line 1</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.addressLine1 || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Address Line 2</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.addressLine2 || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Address Line 3</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.addressLine3 || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">City</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.city || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Postcode</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.postcode || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">State</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.state || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Country</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.country || "N/A"}</span>
                            </div>

                        </div>
                        ) : invoice?.type === "Personal" ? (
                        <div className="w-full grid grid-cols-2 grid-rows-7 font-manrope gap-4 self-stretch not-italic leading-5">
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Full Name</span>
                                <span className="text-vulcan-950 text-sm font-medium">{invoice?.full_name || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">TIN No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.tin_no || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">ID Type</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.id_type || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">ID Value</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.id_no || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">SST No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.sst_no || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Email Address</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.email || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Contact No.</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.contact || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Address Line 1</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.addressLine1 || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Address Line 2</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.addressLine2 || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Address Line 3</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.addressLine3 || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">City</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.city || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Postcode</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.postcode || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">State</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.state || "N/A"}</span>
                            </div>
                            <div className="flex w-full flex-col gap-1">
                                <span className="text-vulcan-500 text-sm font-normal">Country</span>
                                <span className="text-vulcan-950 text-sm font-medium"> {invoice?.country || "N/A"}</span>
                            </div>

                        </div>
                    ) : null}
                    </div>
                        <div className="flex justify-center items-center w-full self-stretch ">
                        <Button onClick={handleDownload}
                                className=" w-full py-3 px-4 font-manrope text-sm not-italic font-medium leading-5 
                                        text-vulcan-500 border rounded-sm border-vulcan-200 bg-white 
                                        p-button p-button-outlined flex items-center justify-center gap-1"
                                        
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                    <path d="M2.10156 8.00249V13.4H12.9016V8" stroke="#85888E" strokeLinecap="square"/>
                                    <path d="M4.80117 7.19971L7.50117 9.89971L10.2012 7.19971" stroke="#85888E" strokeLinecap="square"/>
                                    <path d="M7.49805 2.3999V9.5999" stroke="#85888E" strokeLinecap="square"/>
                                </svg>
                                Download e-Invoice
                            </Button>
                        </div>
                </div> 
            </div>
        </GuestLayout>
       
    )
}