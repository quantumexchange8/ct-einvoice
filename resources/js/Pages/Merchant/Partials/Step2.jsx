import React from "react";

export default function Step2({ data, setData }) {

    return (
        <div className="flex gap-8 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-5 w-full ">
                <div className="flex flex-col gap-3">
                    <div className="text-base font-semibold font-Lora">Account Details</div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Merchant Name: </div>
                            <div className="text-sm text-vulcan-700">{data.merchant_name}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Merchant Email: </div>
                            <div className="text-sm text-vulcan-700">{data.merchant_email}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Merchant Contact: </div>
                            <div className="text-sm text-vulcan-700">{data.merchant_contact}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="text-base font-semibold font-Lora">Merchant Details</div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Merchant Address: </div>
                            <div className="text-sm text-vulcan-700">{data.address_1}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Merchant Address 2: </div>
                            <div className="text-sm text-vulcan-700">{data.address_2 ? data.address_2 : 'NA'}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Merchant Address 3: </div>
                            <div className="text-sm text-vulcan-700">{data.address_3 ? data.address_3 : 'NA'}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">City: </div>
                            <div className="text-sm text-vulcan-700">{data.city ? data.city : 'NA'}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Postal Code: </div>
                            <div className="text-sm text-vulcan-700">{data.postal_code}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">State: </div>
                            <div className="text-sm text-vulcan-700">{data.state ? <span>{data.state['Code']} - {data.state['State']}</span> : 'NA'}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-full max-w-40 text-sm font-Lora">Country: </div>
                            <div className="text-sm text-vulcan-700">{data.country ? data.country['country'] : 'NA'}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <div className="text-base font-semibold font-Lora">Merchant Tax Info</div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">TIN No: </div>
                        <div className="text-sm text-vulcan-700">{data.tin_no}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">BRN No: </div>
                        <div className="text-sm text-vulcan-700">{data.brn_no}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">SST No: </div>
                        <div className="text-sm text-vulcan-700">{data.sst_no ? data.sst_no : 'NA'}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">TTX No: </div>
                        <div className="text-sm text-vulcan-700">{data.ttx_no ? data.ttx_no : 'NA'}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">Claasification Code: </div>
                        <div className="text-sm text-vulcan-700">{data.classification_code ? <span className="max-w-40 truncate">{data.classification_code['code']} - {data.classification_code['description']}</span>  : 'NA'}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">MSIC Code: </div>
                        <div className="text-sm text-vulcan-700">{data.msic_code ? <span className="max-w-40 truncate">{data.msic_code['Code']} - {data.msic_code['Description']}</span>  : 'NA'}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">IRBM Client ID: </div>
                        <div className="text-sm text-vulcan-700">{data.irbm_client_id}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-40 text-sm font-Lora">IRBM Client Secret: </div>
                        <div className="text-sm text-vulcan-700">{data.irbm_client_secret}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}