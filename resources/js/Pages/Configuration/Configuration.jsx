import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";

export default function Configuration() {
    
    const [imageFile, setImageFile] = useState(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        invoice_prefix: '',
        company_name: '',
        tin: '',
        registration: '',
        sst: '',
        TTX: '',
        contact: '',
        email: '',
    });

    const onUpload = () => {

    }
    
    const save = () => {

    }

    return (
        <AuthenticatedLayout>
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
                        <button className="px-4 py-2 border shadow-sm border-gray-300 rounded-sm text-sm" onClick={save}>
                            Save Changes
                        </button>
                    </div>
                    <div className="flex w-full justify-between items-center gap-4">
                     
                            {imageFile && (
                                <img 
                                    src={URL.createObjectURL(imageFile)} 
                                    alt="Uploaded" 
                                    className="flex w-full max-w-[208px] max-h-[80px] object-cover " 
                                />
                            )}
                             <div className="flex border border-vulcan-950 rounded-md">
                                <FileUpload
                                    mode="basic"
                                    chooseLabel={
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M14 10V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10"
                                            stroke="#61646C"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        </svg>
                                        <span>Upload Photo</span>
                                    </div>
                                    }
                                    auto
                                    customUpload
                                    uploadHandler={onUpload}
                                    className="w-full"
                                />
                            </div>

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
                        <button className="px-4 py-2 border shadow-sm border-gray-300 rounded-sm text-sm" onClick={save}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
