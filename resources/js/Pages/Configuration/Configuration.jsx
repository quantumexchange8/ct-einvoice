import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Configuration() {
    const [company, setCompany] = useState({
        invoicePrefix: "",
        invoice: "",
        companyName: "",
        tin: "",
        registration: "",
        MSIC: "",
        phone: "",
        email: "",
        sst: "",
        businessActivity: "",
        address1: "",
        address2: "",
        poscode: "",
        area: "",
        state: "",
        image: "",
    });

    const [imageFile, setImageFile] = useState(null); 
    const toast = useRef(null);

    const handleChange = (e, key) => {
        setCompany({ ...company, [key]: e.target.value });
    };

    const onUpload = (event) => {
        const file = event.files[0];
        setImageFile(file);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            Object.keys(company).forEach((key) => {
                formData.append(key, company[key]);
            });

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await axios.post("/updateConfiguration", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Company details saved successfully",
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to save details",
                    life: 3000,
                });
            }
        } catch (error) {
            console.error("Error saving company details:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "An error occurred while saving",
                life: 3000,
            });
        }
    };
    

    return (
        <AuthenticatedLayout>
            <Toast ref={toast} />
            <div className="flex w-full flex-col justify-center items-center self-stretch p-5 gap-6 bg-white rounded-lg max-w-3xl mx-auto">
                <div className="flex w-full p-4 flex-col gap-6 self-stretch border rounded-sm border-vulcan-200 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="font-sans text-vulcan-900 font-bold text-xl">
                                Company <span className="text-vulcan-500">Detail</span>
                            </div>
                            <div className="text-xs text-vulcan-900">
                                Active and inactive clients will all be shown in this list.
                            </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-sm text-sm" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>
                    <div className="flex w-full justify-between items-center gap-4">
                        {imageFile && (
                            <img 
                                src={URL.createObjectURL(imageFile)} 
                                alt="Uploaded" 
                                className="flex w-full max-w-[208px] max-h-[80px] " 
                            />
                        )}
                        <FileUpload
                            mode="basic"
                            chooseLabel={<div className="flex items-center gap-2 text-gray-600">Upload Photo</div>}
                            auto
                            customUpload
                            uploadHandler={onUpload}
                        />
                        <button className="ml-auto"> {/* Pushes the button to the right */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4.4082 3.65058L4.86259 1H10.7696L11.224 3.65058" stroke="#161B26" strokeLinejoin="round"/>
                                <path d="M1 3.65234H14.6316" stroke="#161B26" strokeLinecap="round"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.7395 3.65234L11.9822 15.3906H3.65184L2.89453 3.65234H12.7395Z" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.92188 12.3594H9.70842" stroke="#161B26" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries({
                            invoicePrefix: "Invoice Prefix",
                            invoice: "Invoice No.",
                            companyName: "Company Name",
                            tin: "TIN No.",
                            registration: "Registration No.",
                            MSIC: "MSIC Code",
                            phone: "Phone No.",
                            email: "Email Address",
                            sst: "SST Registration No.",
                            businessActivity: "Business Activity Description",
                        }).map(([key, label]) => (
                            <div key={key} className="flex flex-col">
                                <label className="text-sm font-medium mb-1">{label}</label>
                                <InputText value={company[key]} onChange={(e) => handleChange(e, key)} placeholder={label} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex w-full p-4 flex-col gap-6 self-stretch border rounded-sm border-vulcan-200 bg-white">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <div className="font-sans text-vulcan-900 font-bold text-xl">
                                Company <span className="text-vulcan-500">Address</span>
                            </div>
                            <div className="text-xs text-vulcan-900">Essential company information for your e-Invoice.</div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-sm text-sm" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries({
                            address1: "Address 1",
                            address2: "Address 2",
                            poscode: "Postcode",
                            area: "Area",
                            state: "State",
                        }).map(([key, label]) => (
                            <div key={key} className="flex flex-col">
                                <label className="text-sm font-medium mb-1">{label}</label>
                                <InputText value={company[key]} onChange={(e) => handleChange(e, key)} placeholder={label} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
