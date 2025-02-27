import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { CreateInvoiceIcon, DotVerticleIcon, ExportIcon, PreviewIcon, ShareIcon, VoidIcon } from "@/Components/Outline";

export default function Merchant() {
    const [merchants, setMerchant] = useState([]);
    const [filteredMerchants, setFilteredMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [visible, setVisible] = useState(false);
    const op = useRef(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState(null);  // Track which row has menu open
    const [selectedDetails, setSelectedDetails] = useState(null); // Track selected merchant details modal
        
    useEffect(() => {
        fetchMerchant();
    }, []);
    
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const onPageChange = (event) => {
            setFirst(event.first);
            setRows(event.rows);
        };

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        name: '',
        merchant_uid: '',
        staging_url: '',
        live_url: '',
        appID: '',
       
        
    });

    const fetchMerchant = async () => {
        try {
            const response = await axios.get("/getMerchants");

            setMerchant(response.data);
            setFilteredMerchants(response.data); // Ensure table updates
        } catch (error) {
            console.error("Error fetching merchants", error);
        }
    };
    
   
   useEffect(() => {
   let filtered = merchants;

    if (searchTerm.trim()) {
        filtered = filtered.filter(
            (merchant) =>
                merchant.merchant_uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                merchant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (selectedStatus !== "all") {
        filtered = filtered.filter((merchant) => merchant.status.toLowerCase() === selectedStatus);
    }

        setFilteredMerchants(filtered);
    }, [selectedStatus, searchTerm, merchants]);

        const statusBodyTemplate = (rowData) => {
        
        return (
            <>
               <div className="flex justify-start">
               <div className={`${rowData.status === 'active' ? 'border border-gray-300 bg-yellow-100 ' : ' border border-gray-300 bg-green-100' } ' flex items-center gap-2 py-1 px-2 ' `}>
                    <div className={`${rowData.status === 'active' ? 'w-1.5 h-1.5 rounded-full bg-yellow-500' : 'w-1.5 h-1.5 rounded-full bg-green-500'}`}></div>
                    <div className="uppercase">{rowData.status}</div>
                </div>
               </div>
            </>
        );
    };
    
    const actionBodyTemplate = (rowData) => {
        const [isOpen, setIsOpen] = useState(false);
        const [showDetails, setShowDetails] = useState(false);
    
        const handleStatusChange = async () => {
            const newStatus = rowData.status === "active" ? "inactive" : "active";
            await updateStatus(rowData.id, newStatus);
            setIsOpen(false);
            className="bg-white";

            
        };
    
        return (
            <div className="relative">
                {/* Toggle Dropdown */}
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="p-2 rounded-md "
                >
                    <DotVerticleIcon />
                </button>
    
                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                        {/* Edit Button */}
                        <button 
                            onClick={() => handleEditMerchant(rowData)} 
                            className="px-4 py-2 w-full text-left hover:bg-gray-100"
                        >
                            Edit Client
                        </button>
    
                        {/* Status Toggle Button */}
                       <div className="flex flex-col">
                       <button 
                            onClick={handleStatusChange} 
                            className={`px-4 py-2 text-left hover:bg-gray-100 ${
                                rowData.status === "active" ? "text-red-600" : "text-green-600"
                            }`}
                        >
                            {rowData.status === "active" ? "Deactivate Client" : "Reactivate Client"}
                        </button>
                       </div>
    
                        {/* View Details Button */}
                      <div className="flex flex-col">
                      <button 
                            onClick={() => setShowDetails(true)} 
                            className="px-4 py-2 text-left static hover:bg-gray-100"
                        >
                            View Details
                        </button>
                      </div>
                    </div>
                )}
    
                {/* Details Modal */}
                {showDetails && <DetailsModal rowData={rowData} onClose={() => setShowDetails(false)} />}
            </div>
        );
    };
    
    
    const DetailsModal = ({ rowData, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <span className="text-xl font-bold mb-4">
                    {rowData.status === "inactive" ? "Deactivation Details" : "Reactivation Details"}
                </span>

                <span className="flex flex-col">Merchant ID: {rowData.merchant_uid}</span>
                <span className="flex flex-col">Name: {rowData.name}</span>
                <span className="flex flex-col">Staging url:{rowData.staging_url}</span>
                <span className="flex flex-col">Live url: {rowData.live_url }</span>
                <span className="flex flex-col">App ID: {rowData.appID}</span>
                <span className="flex flex-col">Status: {rowData.status}</span>
                <button 
                    onClick={onClose} 
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.post(`/updateMerchantStatus/${id}`, { status: newStatus });
    
            // Update the local state after successful backend update
            setMerchant((prev) =>
                prev.map((merchant) =>
                    merchant.id === id ? { ...merchant, status: newStatus } : merchant
                )
            );
            setFilteredMerchants((prev) =>
                prev.map((merchant) =>
                    merchant.id === id ? { ...merchant, status: newStatus } : merchant
                )
            );
        } catch (error) {
            console.error("Failed to update merchant status", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/submitMerchant", {
            onSuccess: () => {
                setVisible(false); 
                reset();
                fetchMerchant();
            },
            onError: (error) => {
                console.error("Submission failed", error);
            }
        });
    };
    
    const handleEditMerchant = (merchant) => {
        setSelectedMerchant({ ...merchant });
        setEditDialogVisible(true);
    };

    const saveMerchantChanges = async () => {
        if (!selectedMerchant) return;

        try {
        const response = await axios.put(`/updateMerchant/${selectedMerchant.id}`, selectedMerchant);
        if (response.status === 200) {
            setMerchant((prev) =>
                prev.map((merchant) =>
                    merchant.id === selectedMerchant.id ? { ...merchant, ...selectedMerchant } : merchant
                )
            );
            setFilteredMerchants((prev) =>
                prev.map((merchant) =>
                    merchant.id === selectedMerchant.id ? { ...merchant, ...selectedMerchant } : merchant
                )
                );
                alert("Merchant updated successfully!");
            }
        } catch (error) {
            console.error("Error updating merchant:", error);
            alert("Failed to update merchant.");
        }
        setEditDialogVisible(false);
    };

    const confirmDeleteMerchant = () => {
        setDeleteConfirmVisible(true);
    };

    const deleteMerchant = async () => {
        if (!selectedMerchant) return;

        try {
            await axios.delete(`/deleteMerchant/${selectedMerchant.id}`);
            setMerchant((prev) => prev.filter((merchant) => merchant.id !== selectedMerchant.id));
            setFilteredMerchants((prev) => prev.filter((merchant) => merchant.id !== selectedMerchant.id));
            alert("Merchant deleted successfully!");
        } catch (error) {
            console.error("Error deleting merchant:", error);
            alert("Failed to delete merchant.");
        }
        setDeleteConfirmVisible(false);
        setEditDialogVisible(false);
    };

    return (
        <AuthenticatedLayout>
            <div className="flex w-full py-5 pr-[23px] pl-6 flex-col items-start">
                <div className="flex w-full p-4 flex-col gap-4 border rounded-sm border-vulcan-200 bg-white">
                    
                    {/* Header Section */}
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <div className="font-sans text-vulcan-900 font-bold text-xl">
                                List of <span className="text-vulcan-500">Merchant</span>
                            </div>
                            <div className="text-xs text-vulcan-900">Active client and inactive client will all be shown up in this list.</div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex px-3 py-2 gap-2 border rounded-sm border-vulcan-300 bg-white text-vulcan-700 text-xs font-medium">
                            <ExportIcon/>
                            Export
                            </button>
                            <button className="flex px-3 py-2 gap-2 border rounded-sm border-vulcan-700 bg-vulcan-700 text-vulcan-25 text-xs font-medium"  onClick={() => setVisible(true)}>
                            <CreateInvoiceIcon/>
                            Add Merchant
                            </button>
                        </div>
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
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {
                            filteredMerchants.length > 0 ? ( 
                                <>
                            <DataTable
                                value={filteredMerchants.slice(first, first + rows)}
                                className=" font-manrope text-[10px] not-italic text-vulcan-800 font-bold leading-[16px]"
                                paginator
                                rows={5}
                            >
                                <Column field="name" header="NAME" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                <Column field="merchant_uid" header="MERCHANT UID" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                <Column field="staging_url" header="STAGING URL" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                <Column field="live_url" header="LIVE URL" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                <Column field="appID" header="APP ID" className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                <Column field="status" header="STATUS" body={statusBodyTemplate} className="font-manrope text-sm not-italic text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                                <Column header="Action" body={actionBodyTemplate} className="font-manrope text-sm not-italic bg-white text-vulcan-900 font-medium whitespace-nowrap text-ellipsis leading-5" />
                            </DataTable>
                                </>
                            ) : (
                                <p>No invoices found.</p>
                            )
                        }
                    </div>
                    
                    <Dialog 
                        header={<div style={{ borderBottom: '1px solid #ECECED'}} className="flex max-w-[800px] pb-4 items-start font-sans text-xl not-italic font-bold leading-[26px] text-vulcan-900">Add Merchant</div>} 
                        visible={visible} 
                        onHide={() => setVisible(false)}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="flex max-w-[800px] flex-col items-start gap-6 self-stretch">
                                <div className="flex w-full flex-col items-start self-stretch gap-5">
                                    <div className="flex w-full items-center gap-3">
                                        <svg width="4" height="20" viewBox="0 0 4 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="4" height="20" fill="#333741"/>
                                        </svg>
                                        <div className="font-sans text-vulcan-900 font-bold text-xl">
                                            Merchant <span className="text-vulcan-500">Details</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="w-full grid grid-cols-2 gap-4">
                                            {/* Name */}
                                            <div className="w-full flex gap-1 ">
                                                <div className="text-vulcan-900 text-xs font-medium flex-col items-start w-full">
                                                    <div className="flex items-center gap-1">
                                                        <InputLabel value="MERCHANT NAME" />
                                                        <span className="text-error-800 gap-1">*</span>
                                                    </div>
                                                    <TextInput 
                                                        id="name"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        type="text"
                                                        placeholder="e.g. Merchant"
                                                    />
                                                    <InputError message={errors.name} className="mt-2" />
                                                </div>
                                            </div>
                                            {/* Staging URL */}
                                            <div className="w-full flex gap-1 ">
                                                <div className="text-vulcan-900 text-xs font-medium flex-col items-start w-full">
                                                    <div className="flex items-center gap-1">
                                                    <InputLabel value="STAGING URL" />
                                                    <span className="text-error-800 gap-1">*</span>
                                                    </div>
                                                    <TextInput 
                                                        id="staging_url"
                                                        name="staging_url"
                                                        value={data.staging_url}
                                                        onChange={(e) => setData('staging_url', e.target.value)}
                                                        type="text"
                                                        placeholder="e.g. https://staging.com"
                                                    />
                                                    <InputError message={errors.staging_url} className="mt-2" />
                                                </div>
                                            </div>
                                            {/* Live URL */}
                                            <div className="w-full flex gap-1 ">
                                                <div className="text-vulcan-900 text-xs font-medium flex-col items-start w-full">
                                                    <div className="flex items-center gap-1">
                                                    <InputLabel value="LIVE URL" />
                                                    <span className="text-error-800 gap-1">*</span>
                                                    </div>
                                                    <TextInput 
                                                        id="live_url"
                                                        name="live_url"
                                                        value={data.live_url}
                                                        onChange={(e) => setData('live_url', e.target.value)}
                                                        type="text"
                                                        placeholder= "e.g. https://example.com"
                                                    />
                                                    <InputError message={errors.live_url} className="mt-2" />
                                                </div>
                                            </div>
                                            {/* App ID */}
                                            <div className="w-full flex gap-1 ">
                                                <div className="text-vulcan-900 text-xs font-medium flex-col items-start w-full">
                                                    <div className="flex items-center gap-1">
                                                        <InputLabel value="APP ID" />
                                                        <span className="text-error-800 gap-1">*</span>
                                                    </div>
                                                    <TextInput 
                                                        id="appID"
                                                        name="appID"
                                                        value={data.appID}
                                                        onChange={(e) => setData('appID', e.target.value)}
                                                        type="text"
                                                        placeholder="e.g. 987654"
                                                    />
                                                    <InputError message={errors.appID} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Footer Buttons */}
                                <div className="flex justify-end gap-2 px-4 py-3 ">
                                    <button 
                                        type="button" 
                                        onClick={() => setVisible(false)} 
                                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 text-white bg-blue-600 rounded-md"
                                        disabled={processing}
                                    >
                                        {processing ? "Saving..." : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Dialog>
                    <>
                    {/* Edit Merchant Dialog */}
                    {editDialogVisible && selectedMerchant && (
                        <Dialog
                            visible={editDialogVisible}
                            onHide={() => setEditDialogVisible(false)}
                            header="Edit Merchant"
                            className="w-96"
                            >
                            <div className="p-4">
                                <label className="block">Merchant ID</label>
                                <InputText value={selectedMerchant.merchant_uid} readOnly className="w-full mb-2" />

                                <label className="block">Name</label>
                                <InputText
                                    value={selectedMerchant.name}
                                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, name: e.target.value })}
                                    className="w-full mb-2"
                                />
                                <label className="block">Staging URL</label>
                                <InputText
                                    value={selectedMerchant.staging_url}
                                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, staging_url: e.target.value })}
                                    className="w-full mb-2"
                                />
                                <label className="block">Live URL</label>
                                <InputText
                                    value={selectedMerchant.live_url}
                                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, live_url: e.target.value })}
                                    className="w-full mb-2"
                                />
                                <label className="block">App ID</label>
                                <InputText
                                    value={selectedMerchant.appID}
                                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, appID: e.target.value })}
                                    className="w-full mb-2"
                                />
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={saveMerchantChanges}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={confirmDeleteMerchant}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Dialog>
                    )}

                    {/* Delete Confirmation Dialog */}
                    {deleteConfirmVisible && (
                        <Dialog
                            visible={deleteConfirmVisible}
                            onHide={() => setDeleteConfirmVisible(false)}
                            header="Confirm Deletion"
                            className="w-80"
                            >
                            <span className="font-bold">Are you sure you want to delete {selectedMerchant.name}?</span>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={deleteMerchant}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmVisible(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Dialog>
                    )}
                </>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
