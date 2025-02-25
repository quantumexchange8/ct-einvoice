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
import { CreateInvoiceIcon, DotVerticleIcon, ExportIcon, PreviewIcon, ShareIcon, VoidIcon } from "@/Components/Outline";

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
    const [configurations, setConfigurations] = useState(null);

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("/getInvoiceListing"); // Call Laravel API
            setConfigurations(response.data.configurations);
            setInvoices(response.data.invoices);
        } catch (error) {
            console.error("Error fetching data:", error);
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
    container: " w-full",
    button: "p-2 hover:bg-gray-200 rounded focus:outline-none",
    dropdown: "absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 overflow-hidden",
    dropdownItem: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
};

const actionBodyTemplate = (rowData) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex w-full p-2 items-center gap-3 self-stretch relative">
        <div className={dropdownStyles.container}>
            <button onClick={() => setIsOpen(!isOpen)} className={dropdownStyles.button}>
                <DotVerticleIcon />
            </button>
            {isOpen && (
                <div className={dropdownStyles.dropdown}>
                   
                    <button className={dropdownStyles.dropdownItem} >
                        <ShareIcon />
                        Share
                    </button>
                    
                   
               
                  <button onClick={() => handlePreview(rowData)} className={dropdownStyles.dropdownItem}>
                    <PreviewIcon /> Preview
                    </button>
                  </div>
                
            )}

        </div>
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
                            <ExportIcon/>
                            Export
                            </button>
                            <button className="flex px-3 py-2 gap-2 border rounded-sm border-vulcan-700 bg-vulcan-700 text-vulcan-25 text-xs font-medium">
                            <CreateInvoiceIcon/>
                            Create Ad-hoc Invoice
                            </button>
                        </div>
                    </div>
                    <div className="flex w-full">
            {/* Tabs for Invoice Status */}
            <TabGroup selectedIndex={["all", "pending", "paid"].indexOf(selectedStatus)} onChange={handleTabChange}>
                <TabList className="flex gap-[2px] p-[3px] items-center justify-center bg-vulcan-100 rounded-sm">
                    {["All", "Pending", "Paid"].map((label, index) => (
                        <Tab
                            key={index}
                            className={({ selected }) =>
                                `flex px-3 py-[5px] text-xs rounded-sm ${
                                    selected
                                        ? "bg-white font-bold text-black border-none shadow-sm" // No border on selected tab
                                        : "text-vulcan-950 font-normal hover:bg-gray-200"
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
                                    <VoidIcon/>
                                    <span>Void</span>
                                </button>

                                <button className="flex items-center px-3 py-2 gap-2 border rounded-sm border-vulcan-200 bg-white font-manrope text-vulcan-500 text-xs leading-[18px] not-italic font-medium">
                                    <PreviewIcon/>
                                    <span>Preview</span>
                                </button>
                                <button className="flex items-center px-3 py-2 gap-2 border rounded-sm border-vulcan-200 bg-white font-manrope text-vulcan-500 text-xs leading-[18px] not-italic font-medium">
                                   <ShareIcon/>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div >
                        {
                            filteredInvoices.length > 0 ? (
                                <>
                                    <DataTable
                                        value={filteredInvoices.slice(first, first + rows)}
                                        selection={selectedInvoices}
                                        onSelectionChange={(e) => setSelectedInvoices(e.value)}
                                        selectionMode="multiple"
                                        className="font-manrope text-[10px] not-italic text-vulcan-800 font-bold leading-[16px]"
                                        paginator
                                        rows={5}
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
                                    {/* <Paginator
                                        first={first}
                                        rows={rows}
                                        totalRecords={filteredInvoices.length}
                                        onPageChange={(e) => {
                                        setFirst(e.first);
                                        setRows(e.rows);
                                        }}
                                    /> */}
                                </>
                            ) : (
                                <p>No invoices found.</p>
                            )
                        }
                    </div>
                    <Dialog
                        open={isPreviewOpen}
                        onClose={() => setIsPreviewOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        >
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                            <div className="flex justify-between items-center border-b pb-3">
                            <img src={configurations?.logo} alt="logo" className="h-16 w-auto" />

                            <h1 className="text-3xl font-serif font-bold">INVOICE</h1>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between">
                                    {configurations ? (
                                    <div className="">
                                        <h2 className="flex flex-col text-vulcan-950 font-manrope font-bold leading-4 text-[10px] not-italic">{configurations.companyName}</h2>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic"> {configurations.address1}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic"> {configurations.address2}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic"> {configurations.poscode} {configurations.area} ,{configurations.state}</span>
                                        <br/>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic">Reg.No : {configurations.registration}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic">Contact : {configurations.phone}</span>
                                        <span className="flex flex-col text-vulcan-950 font-manrope tfont-normal leading-4 text-[10px] not-italic">Email : {configurations.email}</span>
                                        
                                    </div>
                                    ) : (
                                        <span>Loading configuration...</span>
                                    )}
                                   
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
