import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { format } from "date-fns";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { Checkbox } from "primereact/checkbox";
import {Dialog } from '@headlessui/react'
import { CreateInvoiceIcon, DotVerticleIcon, ExportIcon, PreviewIcon, ShareIcon, VoidIcon } from "@/Components/Outline";
import { formatAmount } from "@/Composables";
import Button from "@/Components/Button";
import { Menu } from "primereact/menu";
import toast from "react-hot-toast";
import Modal from "@/Components/Modal";
import QRCode from "react-qrcode-logo";
import TextInput from "@/Components/TextInput";

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

    const fetchInvoices = async () => {

        try {
            const response = await axios.get("/getInvoiceListing", {
                params: {
                    status: selectedStatus,
                    search: searchTerm,
                },
            });

            setFilteredInvoices(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [selectedStatus, searchTerm]);

    const statusBodyTemplate = (rowData) => {
        return (
            <div className="flex">
                {
                    rowData.status === 'pending' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#007aff]"></div>
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
                {
                    rowData.status === 'requested' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#efba30]"></div>
                            <div>
                               Requested
                            </div>
                        </div>
                    )
                }
                {
                    rowData.status === 'Invalid' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#ff2742]"></div>
                            <div>
                               Invalid
                            </div>
                        </div>
                    )
                }
                {
                    rowData.status === 'Submitted' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#efba30]"></div>
                            <div>
                               Submitted
                            </div>
                        </div>
                    )
                }
                {
                    rowData.status === 'Valid' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></div>
                            <div>
                               Valid
                            </div>
                        </div>
                    )
                }
                {
                    rowData.status === 'consolidated' && (
                        <div className="flex items-center font-manrope not-italic font-bold tracking-[1.32px] uppercase leading-[18px] text-[11px] gap-2 py-1 px-2 border border-vulcan-300" >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></div>
                            <div>
                               Consolidated
                            </div>
                        </div>
                    )
                }
            </div>
        );
    };
    
 
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleTabChange = (index) => {
        const statuses = ["all", "pending", "Submitted", "Valid", "Invalid", "consolidated"];
        setSelectedStatus(statuses[index]);
        setLoading(true);
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
    const closePreview = () => {
        setSelectedInvoice(null);
        setIsPreviewOpen(false);
    };

    const actionBodyTemplate = (rowData) => {
        const menuRight = useRef(null);
        const handleShare = (invoice) => {
            const value = `https://preprod.myinvois.hasil.gov.my/${invoice.invoice_uuid}/share/${invoice.longId}`;
            navigator.clipboard.writeText(value).then(() => {
                toast.success('Copied!', {
                    title: 'Copied!',
                    duration: 3000,
                    variant: 'variant3',
                });
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        };

        const items = [
            {
                label: 'Share',
                template: () => {
                    return (
                        <div className="p-menuitem-content py-2 px-3 flex items-center gap-3" data-pc-section="content" onClick={(e) => {
                            e.stopPropagation()
                            handleShare(rowData)
                            menuRight.current.hide(e);
                            
                        }}  >
                            <ShareIcon />
                            <span className="text-vulcan-700 text-sm font-medium">Share</span>
                        </div>
                    );
                }
            },
            {
                label: 'Preview',
                template: () => {
                    return (
                        <div className="p-menuitem-content py-2 px-3 flex items-center gap-3" data-pc-section="content" onClick={(e) => {
                            e.stopPropagation()
                            handlePreview(rowData);
                            menuRight.current.hide(e);
                            }}>
                            <PreviewIcon />
                            <span className="text-vulcan-700 text-sm font-medium">Preview</span>
                        </div>
                    );
                }
            },
        ];

        return (
            <div className="card flex justify-center">
                <Button size="sm" variant="textOnly" label="Show Right" className="" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup >
                    <DotVerticleIcon />
                </Button>
                <Menu model={rowData.status === 'Valid' ? items : null } popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            </div>
        );
    };

    const merchantTemplate = (data) => {
        return (
            <div className="flex flex-col">
                <span className="text-xs">{data.merchant.name}</span>
                <span className="text-xs">{data.merchant.merchant_uid}</span>
            </div>
        )
    }

    const amountTemplate = (data) => {
        return (
            <div>
                RM {formatAmount(data.total_amount)}
            </div>
        )
    }

    const customLoadingAnimate = () => {
        return (
            <div className="min-h-[30vh] flex justify-center items-center">
                No data found...
            </div>
        )
    }

    console.log('selectedInvoice', selectedInvoice);

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
                            {/* <button className="flex px-3 py-2 gap-2 border rounded-sm border-vulcan-700 bg-vulcan-700 text-vulcan-25 text-xs font-medium">
                            <CreateInvoiceIcon/>
                                Create Ad-hoc Invoice
                            </button> */}
                        </div>
                    </div>
                    <div className="flex w-full justify-between items-center">
                        {/* Tabs for Invoice Status */}
                        <TabGroup selectedIndex={["all", "pending", "Submitted", "Valid", "Invalid", "consolidated"].indexOf(selectedStatus)} onChange={handleTabChange}>
                            <TabList className="flex gap-[2px] p-[3px] items-center justify-center bg-vulcan-100 rounded-sm">
                                {["All", "Pending", "Submitted", "Valid", "Invalid", "Consolidated"].map((label, index) => (
                                    <Tab
                                        key={index}
                                        className={({ selected }) =>
                                            `flex px-3 py-[5px] text-xs rounded-sm ${
                                                selected
                                                    ? "bg-white font-bold text-black border-none shadow-sm outline-none" // No border on selected tab
                                                    : "text-vulcan-950 font-normal hover:bg-gray-200"
                                            }`
                                        }
                                    >
                                        {label}
                                    </Tab>
                                ))}
                            </TabList>
                        </TabGroup>

                        <div>
                            <TextInput 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Invoice No"
                                className="w-[300px] p-2 border border-vulcan-200 rounded-md box-border h-11"
                            />
                        </div>
                    </div>
                    {/* <div className="flex w-full items-center gap-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">

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
                    </div> */}

                    <div >
                        {
                            loading ? (
                                <>
                                    loading...
                                </>
                            ) : (
                                <>
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
                                                    rows={8}
                                                    removableSort
                                                    scrollHeight="500px"
                                                >
                                                    <Column field="date" header="Date Issued" body={(rowData) => format(new Date(rowData.date), "dd/MM/yyyy")} sortable  className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                    <Column field="merchant" header="Merchant" body={merchantTemplate} sortable  className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                    <Column field="invoice_no" header="Invoice No" sortable  className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                    <Column field="total_amount" header="Total Amount" sortable  body={amountTemplate} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                    <Column field="status" header="Status" body={statusBodyTemplate}  tableStyle={{ maxWidth: '60px' }} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                    <Column header="Action" body={actionBodyTemplate} tableStyle={{ maxWidth: '60px' }} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                </DataTable>
                                            </>
                                        ) : (
                                            <DataTable
                                                value={filteredInvoices.slice(first, first + rows)}
                                                selection={selectedInvoices}
                                                onSelectionChange={(e) => setSelectedInvoices(e.value)}
                                                selectionMode="multiple"
                                                className="font-manrope text-[10px] not-italic text-vulcan-800 font-bold leading-[16px]"
                                                paginator
                                                rows={5}
                                                removableSort
                                                emptyMessage={customLoadingAnimate}
                                            >
                                                <Column field="date" header="Date Issued" body={(rowData) => format(new Date(rowData.date), "dd/MM/yyyy")} sortable  className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                <Column field="merchant" header="Merchant" body={merchantTemplate} sortable  className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                <Column field="invoice_no" header="Invoice No" sortable  className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                <Column field="total_amount" header="Total Amount" sortable  body={amountTemplate} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                <Column field="status" header="Status" body={statusBodyTemplate}  tableStyle={{ maxWidth: '60px' }} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                                <Column header="Action" body={actionBodyTemplate} tableStyle={{ maxWidth: '60px' }} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                            </DataTable>
                                        )
                                    }
                                </>
                            )
                        }
                        
                    </div>

                    <Modal
                        show={isPreviewOpen}
                        onClose={closePreview}
                        maxWidth='lg'
                        maxHeight='lg'
                        header='Preview Invoice'
                        footer={
                            <div className="flex justify-end gap-5 ">
                                <Button variant="redOutline" size="md" onClick={closePreview}>Close</Button>
                            </div>
                        }
                    >
                        {
                            selectedInvoice && (
                                <div className="flex flex-col gap-4 w-full">
                                    {/* header */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <img src="/assets/image/logo.png" alt="" />
                                            <div className="font-bold text-lg">
                                                Invoice No: {selectedInvoice.invoice_no}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="font-bold ">{selectedInvoice.merchant.name}</div>
                                                <div className="max-w-60">Address: {selectedInvoice.merchant.address1}, {selectedInvoice.merchant.address2 ? `${selectedInvoice.merchant.address2},` : null} {selectedInvoice.merchant.postcode}, {selectedInvoice.merchant.city}, Malaysia</div>
                                                <div className="">Reg.No: {selectedInvoice.merchant.brn_no}</div>
                                                <div className="">Contact: {selectedInvoice.merchant.contact}</div>
                                                <div className="">Email: {selectedInvoice.merchant.email}</div>
                                            </div>
                                            <div className="flex flex-col gap-1 text-xs items-end">
                                                <div>E-Invoice Version: 1.0</div>
                                                <div>Submission UID: {selectedInvoice.submission_uuid}</div>
                                                <div>UUID: {selectedInvoice.invoice_uuid}</div>
                                                <div>Issue Date&Time: {selectedInvoice.issue_date}</div>
                                            </div>
                                        </div>
                                        <div className="w-full text-right">{selectedInvoice.invoice_status === 'Valid' ? <span className="text-success-600 font-bold text-lg">Valid</span> : <span className="text-error-600 font-bold text-lg">Invalid</span>}</div>
                                    </div>
                                    {/* content */}
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div>Supplier TIN: {selectedInvoice.merchant.tin_no}</div>
                                            <div>Supplier Name: {selectedInvoice.merchant.name}</div>
                                            <div>Supplier Registration Number: {selectedInvoice.merchant.brn_no}</div>
                                            <div>Supplier SST ID: {selectedInvoice.merchant.sst_no ? selectedInvoice.merchant.sst_no : 'NA'}</div>
                                            <div>Supplier Business activity description: {selectedInvoice.merchant.business_activity}</div>
                                            <div>Supplier Contact: {selectedInvoice.merchant.contact}</div>
                                            <div>Supplier MSIC: {selectedInvoice.merchant.msic.Code}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 text-xs">
                                            <div>Buyer TIN: {selectedInvoice.tin_no}</div>
                                            <div>Buyer Name: {selectedInvoice.full_name}</div>
                                            <div>Buyer BRN: {selectedInvoice.business_registration}</div>
                                            <div>Buyer Address: {selectedInvoice.addressLine1}, {selectedInvoice.postcode}, {selectedInvoice.city}, Malaysia</div>
                                            <div>Buyer Email: {selectedInvoice.email}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <table className="border border-[#d0d0d0] border-collapse w-full text-xs">
                                            <thead>
                                                <tr className="bg-vulcan-950 text-white  ">
                                                    <th className="text-center border border-[#d0d0d0]">Classification</th>
                                                    <th className="text-center border border-[#d0d0d0]">Description</th>
                                                    <th className="text-center border border-[#d0d0d0]">Quantity</th>
                                                    <th className="text-center border border-[#d0d0d0]">Unit Price</th>
                                                    <th className="text-center border border-[#d0d0d0]">Amount</th>
                                                    <th className="text-center border border-[#d0d0d0]">Disc</th>
                                                    <th className="text-center border border-[#d0d0d0]">Tax Rate</th>
                                                    <th className="text-center border border-[#d0d0d0]">Tax Amount</th>
                                                    <th className="text-center border border-[#d0d0d0]">Total Product / Service</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedInvoice.invoice_lines.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center border border-[#d0d0d0]">{item.classification?.code}</td>
                                                        <td className="text-left border border-[#d0d0d0]">{item.item_name}</td>
                                                        <td className="text-center border border-[#d0d0d0]">{item.item_qty}</td>
                                                        <td className="text-center border border-[#d0d0d0]">RM {Number(item.item_price).toFixed(2)}</td>
                                                        <td className="text-center border border-[#d0d0d0]">RM {(item.item_price * item.item_qty).toFixed(2)}</td>
                                                        <td className="border border-[#d0d0d0]">-</td>
                                                        <td className="border border-[#d0d0d0]">{Number(item.tax_rate).toFixed(2)}%</td>
                                                        <td className="text-right border border-[#d0d0d0]">RM {Number(item.tax_amount).toFixed(2)}</td>
                                                        <td className="text-right border border-[#d0d0d0]">RM {Number(item.subtotal).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                <td colSpan="4" className="text-right font-bold border border-[#d0d0d0]">Subtotal:</td>
                                                <td className="text-right font-bold border border-[#d0d0d0]">RM {Number(selectedInvoice.amount).toFixed(2)}</td>
                                                <td className="border border-[#d0d0d0]">-</td>
                                                <td className="border border-[#d0d0d0]"></td>
                                                <td className="text-right font-bold border border-[#d0d0d0]">RM {Number(selectedInvoice.sst_amount).toFixed(2)}</td>
                                                <td className="text-right font-bold border border-[#d0d0d0]">
                                                    RM {(selectedInvoice.amount + selectedInvoice.sst_amount).toFixed(2)}
                                                </td>
                                                </tr>
                                                <tr>
                                                <td colSpan="8" className="text-right font-bold border border-[#d0d0d0]">Total excluding tax:</td>
                                                <td className="text-right font-bold border border-[#d0d0d0]">RM {Number(selectedInvoice.amount).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                <td colSpan="8" className="text-right font-bold border border-[#d0d0d0]">Tax Amount:</td>
                                                <td className="text-right font-bold border border-[#d0d0d0]">RM {Number(selectedInvoice.sst_amount).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                <td colSpan="8" className="text-right font-bold border border-[#d0d0d0]">Total Including tax:</td>
                                                <td className="text-right font-bold border border-[#d0d0d0]">
                                                    RM {(selectedInvoice.amount + selectedInvoice.sst_amount).toFixed(2)}
                                                </td>
                                                </tr>
                                                <tr>
                                                <td colSpan="8" className="text-right font-bold border border-[#d0d0d0]">Total Amount:</td>
                                                <td className="text-right font-bold">
                                                    RM {(selectedInvoice.amount + selectedInvoice.sst_amount).toFixed(2)}
                                                </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    {/* footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div>Date and Time of Validation: {selectedInvoice.invoice_datetime}</div>
                                            <div>Thhis document us a visual presentation of the e-invoice.</div>
                                        </div>
                                        <div>
                                            <QRCode 
                                                value={'https://preprod.myinvois.hasil.gov.my/' + selectedInvoice.invoice_uuid + '/share/' + selectedInvoice.longId} 
                                                fgColor="#000000"
                                                size={120}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
