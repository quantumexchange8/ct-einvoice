import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { format } from "date-fns";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { Checkbox } from "primereact/checkbox";
import {Dialog } from '@headlessui/react'
import { Paginator } from 'primereact/paginator';

export default function InvoiceListing() {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false); 


    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get("/getInvoiceListing");
            setInvoices(response.data);
            setFilteredInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter invoices whenever search, date, or status changes
    useEffect(() => {
        let filtered = invoices;

        // Search filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(
                (invoice) =>
                    invoice.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    invoice.full_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Date range filter
        if (selectedDate && selectedDate.length === 2 && selectedDate[0] && selectedDate[1]) {
            const start = new Date(selectedDate[0]);
            const end = new Date(selectedDate[1]);

            filtered = filtered.filter((invoice) => {
                const invoiceDate = new Date(invoice.date);
                return invoiceDate >= start && invoiceDate <= end;
            });
        }

        // Status filter
        if (selectedStatus !== "all") {
            filtered = filtered.filter((invoice) => invoice.status.toLowerCase() === selectedStatus);
        }

        setFilteredInvoices(filtered);
    }, [selectedStatus, searchTerm, selectedDate, invoices]);

    const statusBodyTemplate = (rowData) => {
        let statusClasses = "bg-gray-100 text-gray-900 border-gray-300"; // Default styles
        let dotColor = "bg-gray-500"; // Default dot color
        // console.log(rowData)
        return (
            <>
                {
                    rowData.status === 'pending' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FC0]"></div>
                            <div>
                                PENDING
                            </div>
                        </div>
                    )
                }
                {
                    rowData.status === 'paid' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></div>
                            <div>
                               Paid
                            </div>
                        </div>
                    )
                }
            </>
        );
    };
    
 
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);


    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

  // Handle tab changes
    const handleTabChange = (index) => {
        const statuses = ["all", "pending", "paid"];
        setSelectedStatus(statuses[index]);
    };

    const handleCheckboxChange = (e, rowData) => {
        const selected = [...selectedInvoices];
        if (e.checked) {
            selected.push(rowData);
        } else {
            const index = selected.findIndex((invoice) => invoice.invoice_no === rowData.invoice_no);
            if (index !== -1) {
                selected.splice(index, 1);
            }
        }
        setSelectedInvoices(selected);
    };

    const checkboxTemplate = (rowData) => {
        return (
            <Checkbox
                onChange={(e) => handleCheckboxChange(e, rowData)}
                checked={selectedInvoices.some((invoice) => invoice.invoice_no === rowData.invoice_no)}
                className="border-2 border-black w-5 h-5 rounded"
            />
        );
    };

    const handlePreview = (invoice) => {
        setSelectedInvoice(invoice);
        setIsPreviewOpen(true);
    };

   
 
  const dropdownStyles = {
    container: "relative inline-block text-left",
    button: "p-2 hover:bg-gray-200 rounded focus:outline-none",
    dropdown: "absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 overflow-hidden",
    dropdownItem: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
};

const actionBodyTemplate = (rowData) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={dropdownStyles.container}>
            <button onClick={() => setIsOpen(!isOpen)} className={dropdownStyles.button}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="#85888E"/>
            <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" fill="#85888E"/>
            <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" fill="#85888E"/>
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#85888E" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#85888E" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#85888E" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </button>
            {isOpen && (
                <div className={dropdownStyles.dropdown}>
                    <button className={dropdownStyles.dropdownItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                    <path d="M12.8125 5.375C14.0206 5.375 15 4.39561 15 3.1875C15 1.97938 14.0206 1 12.8125 1C11.6044 1 10.625 1.97938 10.625 3.1875C10.625 4.39561 11.6044 5.375 12.8125 5.375Z" stroke="#161B26"/>
                    <path d="M3.1875 11.0625C4.39561 11.0625 5.375 10.0831 5.375 8.875C5.375 7.66689 4.39561 6.6875 3.1875 6.6875C1.97939 6.6875 1 7.66689 1 8.875C1 10.0831 1.97939 11.0625 3.1875 11.0625Z" stroke="#161B26"/>
                    <path d="M10.6252 4.31396L5.08594 7.66998" stroke="#161B26" strokeLinecap="square"/>
                    <path d="M5.08594 9.99683L10.9224 13.4456" stroke="#161B26" strokeLinecap="square"/>
                    <path d="M12.8125 12.375C14.0206 12.375 15 13.3544 15 14.5625C15 15.7706 14.0206 16.75 12.8125 16.75C11.6044 16.75 10.625 15.7706 10.625 14.5625C10.625 13.3544 11.6044 12.375 12.8125 12.375Z" stroke="#161B26"/>
                    </svg>Share
                    </button>
                    <button onClick={() => handlePreview(rowData)} className={dropdownStyles.dropdownItem}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M13 4.25L9.25 0.5H1V1.25V14.75V15.5H13V14.75V4.25Z" stroke="#161B26"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.75 5.75H9.25V8.74689L4.75311 8.75L4.75 5.75Z" stroke="#161B26" strokeLinecap="square"/>
                    <path d="M4.75 5.75V11.75" stroke="#161B26" strokeLinecap="square"/>
                    </svg> Preview
                    </button>
                </div>
            )}

        </div>
    );
};


    return (
        <AuthenticatedLayout>
            <div className="flex w-full py-5 pr-[23px] pl-6 flex-col items-start">
                <div className="flex w-full p-4 flex-col gap-4 border rounded-sm border-vulcan-200 bg-white">
                    
                    {/* Header Section */}
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <div className="font-sans text-vulcan-900 font-bold text-xl">
                                List of <span className="text-vulcan-500">Invoice</span>
                            </div>
                            <div className="text-xs text-vulcan-900">All invoices will be displayed in the listing.</div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex px-3 py-2 gap-2 border rounded-sm border-vulcan-300 bg-white text-vulcan-700 text-xs font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2.59961 8.00249V13.4H13.3996V8" stroke="#161B26" strokeLinecap="square"/>
                            <path d="M5.29971 5.2998L7.99971 2.5998L10.6997 5.2998" stroke="#161B26" strokeLinecap="square"/>
                            <path d="M7.99756 3.19971V10.3997" stroke="#161B26" strokeLinecap="square"/>
                            </svg>
                            Export
                            </button>
                            <button className="flex px-3 py-2 gap-2 border rounded-sm border-vulcan-700 bg-vulcan-700 text-vulcan-25 text-xs font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1.3999V12.5999" stroke="#F5F5F6" strokeLinecap="square"/>
                            <path d="M1.3999 7H12.5999" stroke="#F5F5F6" strokeLinecap="square"/>
                            </svg>
                            Create Ad-hoc Invoice
                            </button>
                        </div>
                    </div>
                    <div className="flex w-full">
                        {/* Tabs for Invoice Status */}
                        <TabGroup selectedIndex={["all", "pending", "paid"].indexOf(selectedStatus)} onChange={handleTabChange}>
                            <TabList className="flex border gap-[2px] px-3 py-[5px] border-gray-300 bg-vulcan-100 rounded-sm">
                                {["All", "Pending", "Paid"].map((label, index) => (
                                    <Tab
                                        key={index}
                                        className={({ selected }) =>
                                            ` text-center px-3 py-[5px] font-medium text-sm rounded-md transition ${
                                                selected ? "bg-white shadow border border-gray-300" : "text-vulcan-700"
                                            }`
                                        }
                                    >
                                        {label}
                                    </Tab>
                                ))}
                            </TabList>
                        </TabGroup>
                    </div>
                   
                    <div className="flex w-full items-center gap-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <div className="flex max-w-[270px] p-[3px] items-center bg-vulcan-50 gap-2">
                                    <i className="pi pi-search text-vulcan-500"></i>
                                    <InputText
                                        placeholder="Search"
                                        className="w-full text-vulcan-900 px-3 py-2 bg-transparent border-none outline-none text-xs font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="relative gap-3 w-full max-w-[212px] flex items-center px-3 py-2 text-xs ">
                                    <Calendar
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.value)}
                                        placeholder="Select Date"
                                        dateFormat="dd/mm/yy"
                                        selectionMode="range"
                                        className="max-w-[212px] gap-3 border-none font-manrope outline-none text-xs font-medium"
                                    />
                                    {selectedDate && selectedDate.length > 0 && (
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className="absolute right-5 text-gray-500 font-manrope text-xs hover:text-red-500"
                                        >
                                            <i className="pi pi-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center px-3 py-2 gap-2 border rounded-sm border-vulcan-50 bg-white font-manrope text-error-300 text-xs leading-[18px] not-italic font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                        <path d="M10.7922 1.20508L1.2002 10.7971" stroke="#FF96A3" strokeWidth="1.2" strokeLinecap="square"/>
                                        <path d="M10.8002 10.8012L1.2002 1.19922" stroke="#FF96A3" strokeWidth="1.2" strokeLinecap="square"/>
                                    </svg>
                                    <span>Void</span>
                                </button>

                                <button className="flex items-center px-3 py-2 gap-2 border rounded-sm border-vulcan-200 bg-white font-manrope text-vulcan-500 text-xs leading-[18px] not-italic font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                                        <path d="M10.8 4L7.79995 1H1.19995V1.6V12.4V13H10.8V12.4V4Z" stroke="#85888E"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.19995 5.2002H7.79995V7.59771L4.20244 7.6002L4.19995 5.2002Z" stroke="#85888E" strokeLinecap="square"/>
                                        <path d="M4.19995 5.2002V10.0002" stroke="#85888E" strokeLinecap="square"/>
                                    </svg>
                                    <span>Preview</span>
                                </button>
                       <button className="flex items-center px-3 py-2 gap-2 border rounded-sm border-vulcan-200 bg-white font-manrope text-vulcan-500 text-xs leading-[18px] not-italic font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M10.8499 4.1001C11.8163 4.1001 12.5999 3.31659 12.5999 2.3501C12.5999 1.3836 11.8163 0.600098 10.8499 0.600098C9.88336 0.600098 9.09985 1.3836 9.09985 2.3501C9.09985 3.31659 9.88336 4.1001 10.8499 4.1001Z" stroke="#85888E"/>
                                        <path d="M3.1499 8.6499C4.11639 8.6499 4.8999 7.86639 4.8999 6.8999C4.8999 5.93341 4.11639 5.1499 3.1499 5.1499C2.18341 5.1499 1.3999 5.93341 1.3999 6.8999C1.3999 7.86639 2.18341 8.6499 3.1499 8.6499Z" stroke="#85888E"/>
                                        <path d="M9.10033 3.25146L4.66895 5.93628" stroke="#85888E" strokeLinecap="square"/>
                                        <path d="M4.66895 7.79736L9.33809 10.5564" stroke="#85888E" strokeLinecap="square"/>
                                        <path d="M10.8499 9.7002C11.8163 9.7002 12.5999 10.4837 12.5999 11.4502C12.5999 12.4167 11.8163 13.2002 10.8499 13.2002C9.88336 13.2002 9.09985 12.4167 9.09985 11.4502C9.09985 10.4837 9.88336 9.7002 10.8499 9.7002Z" stroke="#85888E"/>
                                    </svg>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div >
                    {filteredInvoices.length > 0 ? (
        <>
          <DataTable
            value={filteredInvoices.slice(first, first + rows)}
            selection={selectedInvoices}
            onSelectionChange={(e) => setSelectedInvoices(e.value)}
            selectionMode="multiple"
            className="font-manrope text-[10px] not-italic text-vulcan-800 font-bold leading-[16px]"
          >
            <Column selectionMode="multiple" />
            <Column field="date" header="Date Issued" body={(rowData) => format(new Date(rowData.date), "dd/MM/yyyy")} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column field="invoice_no" header="Invoice No" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column field="amount" header="Total Amount" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column field="full_name" header="Name" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column field="tin_no" header="TIN No." className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column field="type" header="Type" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column field="status" header="Status" body={statusBodyTemplate} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
            <Column header="Action" body={actionBodyTemplate} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
          </DataTable>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredInvoices.length}
            onPageChange={(e) => {
              setFirst(e.first);
              setRows(e.rows);
            }}
          />
        </>
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
                    <Dialog
                        open={isPreviewOpen}
                        onClose={() => setIsPreviewOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        >
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                            <div className="flex justify-between items-center border-b pb-3">
                            <img src="/assets/image/logo.png" alt="logo" />
                            <h1 className="text-3xl font-serif font-bold">INVOICE</h1>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <div className="">
                                        <h2 className="flex flex-col text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">Current Tech Industries Sdh.Bhd</h2>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic">V06-03-08, Signature 2,</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Lingkaran SV, Sunway Velocity, 55100 Cheras,</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">55100 Cheras, Kuala Lumpur</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Reg. No: 123412341234</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Contact: +6012 234 5678</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Email: account@currenttech.pro</span>
                                    </div>
                                    <div>
                                        <div className="text-right">
                                            {selectedInvoice?.status === "Paid" ? (
                                            <span className="text-green-700 font-bold text-lg bg-green-200 px-4 py-2 rounded">
                                                PARTIALLY PAID
                                            </span>
                                            ) : (
                                            <span className="text-red-700 font-bold text-lg bg-red-200 px-4 py-2 rounded">
                                                UNPAID
                                            </span>
                                            )}
                                        </div>
                                    </div>                  
                                </div>

                                <div className="mt-4 border-t pt-3 flex justify-between"> 
                                    <div className="text-left">
                                        <h2 className="flex flex-col text-vulcan-950 font-manrope leading-4 text-[10px] not-italic font-bold">Bill to</h2>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">{selectedInvoice?.full_name}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">{selectedInvoice?.addressLine1}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">{selectedInvoice?.addressLine2}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">{selectedInvoice?.city}, {selectedInvoice?.postcode}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">{selectedInvoice?.state}, {selectedInvoice?.country}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Phone No.: {selectedInvoice?.contact}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Reg. No: {selectedInvoice?.reg_no}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Email: {selectedInvoice?.email}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex justify-between">
                                            <span className="text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Invoice Type</span>
                                            <span className="text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">{selectedInvoice?.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Invoice No</span>
                                            <span className="text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">{selectedInvoice?.invoice_no}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic whitespace-pre-wrap">Invoice Date      </span>
                                            <span className="text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">{selectedInvoice?.date?.split("T")[0]}</span>
                                        </div>
                                        {/* <div className="flex justify-between">
                                            <span className="text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Terms</span>
                                            <span className="text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">{selectedInvoice?.terms} days</span>
                                        </div> */}
                                        {/* <div className="flex justify-between">
                                            <span className="text-vulcan-950 font-manrope font-normal leading-4 text-[10px] not-italic">Due Date</span>
                                            <span className=" text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">{selectedInvoice?.due_date?.split("T")[0]}</span>
                                        </div> */}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Dialog>
                                
                  
   
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
