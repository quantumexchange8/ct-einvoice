import React from "react";
import { Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { formatAmount } from "@/Composables";
import { CoinIcon, DownloadIcon, FailIcon, InfoIcon, PendingIcon, SuccessIcon } from "@/Components/Outline";
import Button from "@/Components/Button";

export default function Pending({ invoice }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        id: invoice.id,
    }); 

    const handleDownload = () => {
        window.open(`/downloadInvoice/${invoice.id}/download`, "_blank");
    };

    const reSubmit = (e) => {
        e.preventDefault();
        post(route('resubmit'));
    }

    return (
        <GuestLayout class>
            <div className="flex flex-col w-full items-start justify-center self-stretch pb-[75px] bg-white"> 
                <div className="flex flex-col w-full p-5 gap-8 bg-white">
                    <div className="flex w-full flex-col justify-center items-start gap-6 ">
                        {/* Banner */}
                        {
                            invoice.status === 'consolidated' && (
                                <div className="flex gap-2 w-full p-4 items-center self-stretch rounded-sm bg-warning-50 ">
                                    <div className="flex shrink-0">
                                        <PendingIcon />
                                    </div>
                                    <div className="w-full font-manrope not-italic">
                                        <div className=" font-bold text-warning-500 text-base leading-[22px]">Consolidated</div>
                                            <span className="block text-warning-950 text-xs leading-[18px] font-normal">
                                                This invoice/receipt has been submitted as consolidated e-invoice by the merchant.
                                            </span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            invoice.status === 'pending' || invoice.invoice_status === 'Submitted' && (
                                <div className="flex gap-2 w-full p-4 items-center self-stretch rounded-sm bg-warning-50 ">
                                    <div className="flex shrink-0">
                                        <PendingIcon />
                                    </div>
                                    <div className="w-full font-manrope not-italic">
                                        <div className=" font-bold text-warning-500 text-base leading-[22px]">Pending Validation</div>
                                            <span className="block text-warning-950 text-xs leading-[18px] font-normal">
                                            e-invoice will be available for download once it has been successfully validated.
                                            </span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            invoice.invoice_status === 'Valid' && (
                                <div className="flex gap-2 w-full p-4 items-center self-stretch rounded-sm bg-success-50 ">
                                    <div className="flex shrink-0">
                                        <SuccessIcon />
                                    </div>
                                    <div className="w-full font-manrope not-italic">
                                        <div className=" font-bold text-success-500 text-base leading-[22px]">Validated</div>
                                            <span className="block text-warning-950 text-xs leading-[18px] font-normal">
                                            Your transaction has been successfully validated by LHDN. You can now proceed to download your e-invoice.
                                            </span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (invoice.invoice_status === 'Invalid' || invoice.invoice_status === 'Cancelled') && (
                                <div className=" p-4 flex flex-col gap-2 bg-error-50">
                                    <div className="flex gap-2 w-full items-center self-stretch rounded-sm ">
                                        <div className="flex shrink-0">
                                            <FailIcon />
                                        </div>
                                        <div className="w-full font-manrope not-italic">
                                            <div className=" font-bold text-error-500 text-base leading-[22px]">Invalid</div>
                                                <span className="block text-warning-950 text-xs leading-[18px] font-normal">
                                                    We encountered an issue with your e-invoice submission. Please review the details you provided and try submitting again.
                                                </span>
                                        </div>
                                    </div>
                                    {
                                        invoice.invoice_status === 'Invalid' && (
                                            <div>
                                                {
                                                    invoice.invoice_error.length > 0 && (
                                                        <ul className="list-disc flex flex-col gap-1">
                                                            {
                                                                invoice.invoice_error.map((error, index) => (
                                                                    <li key={index} className=" pl-5 text-error-500 text-xs leading-[18px] font-normal">
                                                                        <span>{error.error_step}: {error.error_code} - {error.error_message}</span>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        
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
                            {
                                invoice.invoice_status === 'Invalid' || invoice.invoice_status === 'Cancelled' ? (
                                    <Button onClick={reSubmit}
                                        className="w-full flex items-center justify-center gap-2 text-sm font-medium disabled:bg-white disabled:text-vulcan-500" 
                                        size="md"
                                    >
                                        Request again
                                    </Button>
                                ) : (
                                    <Button onClick={handleDownload} disabled={invoice.invoice_status === 'pending' || invoice.invoice_status === 'Submitted' || invoice.invoice_status === 'consolidated'}
                                        className="w-full flex items-center justify-center gap-2 text-sm font-medium disabled:bg-white disabled:text-vulcan-500" 
                                        size="md"
                                    >
                                        <DownloadIcon />
                                        Download e-Invoice
                                    </Button>
                                )
                            }
                            
                        </div>
                </div> 
            </div>
        </GuestLayout>
       
    )
}